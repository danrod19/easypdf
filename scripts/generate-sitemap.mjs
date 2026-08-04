/**
 * Gera public/sitemap.xml (e dist/sitemap.xml se dist/ existir)
 * a partir das fontes de verdade do código — sem lista manual de URLs.
 *
 * Fontes:
 * - Home + institucionais (espelham App.tsx)
 * - tools ready: src/data/tools.ts
 * - posts: src/data/blogPosts.ts (slug + date / dateModified)
 *
 * Uso:
 *   node scripts/generate-sitemap.mjs
 *   npm run sitemap
 *
 * lastmod:
 * - Posts: dateModified || date (ISO YYYY-MM-DD)
 * - Demais: omitido (evita lastmod = data de build artificial)
 *
 * Nova tool ready em tools.ts ou post em blogPosts.ts → entra no próximo build.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE_ORIGIN = 'https://easypdflocal.com.br';

/** Páginas institucionais / hubs (rotas reais em App.tsx — sem 404). */
const STATIC_PAGES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/pdf-sem-upload', changefreq: 'monthly', priority: '0.9' },
  { path: '/blog', changefreq: 'weekly', priority: '0.7' },
  { path: '/sobre', changefreq: 'monthly', priority: '0.5' },
  { path: '/contato', changefreq: 'monthly', priority: '0.5' },
  { path: '/privacidade', changefreq: 'yearly', priority: '0.4' },
  { path: '/termos', changefreq: 'yearly', priority: '0.4' },
];

/** Tools com prioridade um pouco maior (tráfego / conversão). */
const TOOL_PRIORITY_BOOST = new Set([
  '/juntar-pdf',
  '/comprimir-pdf',
  '/word-para-pdf',
]);

/**
 * Extrai tools ready de tools.ts (path + status no mesmo objeto).
 * @param {string} source
 * @returns {string[]} paths ordenados
 */
function parseReadyToolPaths(source) {
  const paths = [];
  // Cada tool: { path: '...', ... status: 'ready'|'soon' }
  const objectRe = /\{\s*path:\s*'(\/[^']+)'[\s\S]*?status:\s*'(ready|soon)'/g;
  let m;
  while ((m = objectRe.exec(source)) !== null) {
    const toolPath = m[1];
    const status = m[2];
    if (status === 'ready' && toolPath.startsWith('/') && !toolPath.includes('?')) {
      paths.push(toolPath);
    }
  }
  return [...new Set(paths)].sort((a, b) => a.localeCompare(b));
}

/**
 * Extrai posts de blogPosts.ts.
 * @param {string} source
 * @returns {{ slug: string, lastmod: string | null }[]}
 */
function parseBlogPosts(source) {
  const posts = [];
  // Blocos entre objetos do array (heurística: slug + date no mesmo objeto)
  const objectRe =
    /\{\s*id:\s*'[^']+',\s*slug:\s*'([^']+)'[\s\S]*?date:\s*'(\d{4}-\d{2}-\d{2})'(?:[\s\S]*?dateModified:\s*'(\d{4}-\d{2}-\d{2})')?/g;
  let m;
  while ((m = objectRe.exec(source)) !== null) {
    const slug = m[1];
    const date = m[2];
    const dateModified = m[3] || null;
    if (!slug || slug.includes('/') || slug.includes('?')) continue;
    posts.push({
      slug,
      lastmod: dateModified || date || null,
    });
  }
  // Ordenação estável por slug (sitemap); listagem do blog usa outra ordem
  posts.sort((a, b) => a.slug.localeCompare(b.slug));
  return posts;
}

/**
 * @param {string} pathname
 * @returns {string}
 */
function absoluteLoc(pathname) {
  if (pathname === '/') return `${SITE_ORIGIN}/`;
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_ORIGIN}${p.replace(/\/+$/, '')}`;
}

/**
 * @param {{ loc: string, lastmod?: string | null, changefreq?: string, priority?: string }} entry
 */
function urlEntryXml(entry) {
  const lines = ['  <url>', `    <loc>${escapeXml(entry.loc)}</loc>`];
  if (entry.lastmod) {
    lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
  }
  if (entry.changefreq) {
    lines.push(`    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`);
  }
  if (entry.priority) {
    lines.push(`    <priority>${escapeXml(entry.priority)}</priority>`);
  }
  lines.push('  </url>');
  return lines.join('\n');
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildSitemapXml(entries) {
  const body = entries.map(urlEntryXml).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function main() {
  const toolsPath = path.join(ROOT, 'src', 'data', 'tools.ts');
  const blogPath = path.join(ROOT, 'src', 'data', 'blogPosts.ts');

  if (!fs.existsSync(toolsPath)) {
    console.error('[sitemap] FALHA: src/data/tools.ts não encontrado');
    process.exit(1);
  }
  if (!fs.existsSync(blogPath)) {
    console.error('[sitemap] FALHA: src/data/blogPosts.ts não encontrado');
    process.exit(1);
  }

  const toolsSrc = fs.readFileSync(toolsPath, 'utf8');
  const blogSrc = fs.readFileSync(blogPath, 'utf8');

  const toolPaths = parseReadyToolPaths(toolsSrc);
  const posts = parseBlogPosts(blogSrc);

  if (toolPaths.length === 0) {
    console.error('[sitemap] FALHA: nenhuma tool ready encontrada em tools.ts');
    process.exit(1);
  }
  if (posts.length === 0) {
    console.error('[sitemap] FALHA: nenhum post encontrado em blogPosts.ts');
    process.exit(1);
  }

  /** @type {{ loc: string, lastmod?: string | null, changefreq?: string, priority?: string }[]} */
  const entries = [];

  // 1) Home + institucionais (ordem fixa)
  for (const page of STATIC_PAGES) {
    entries.push({
      loc: absoluteLoc(page.path),
      changefreq: page.changefreq,
      priority: page.priority,
    });
  }

  // 2) Tools ready (ordenadas)
  for (const toolPath of toolPaths) {
    entries.push({
      loc: absoluteLoc(toolPath),
      changefreq: 'monthly',
      priority: TOOL_PRIORITY_BOOST.has(toolPath) ? '0.9' : '0.8',
    });
  }

  // 3) Posts do blog (ordenados por slug)
  for (const post of posts) {
    entries.push({
      loc: absoluteLoc(`/blog/${post.slug}`),
      lastmod: post.lastmod,
      changefreq: 'monthly',
      priority: '0.65',
    });
  }

  // Dedup por loc (home/institucionais não devem colidir com tools)
  const seen = new Set();
  const unique = [];
  for (const e of entries) {
    if (seen.has(e.loc)) continue;
    seen.add(e.loc);
    unique.push(e);
  }

  const xml = buildSitemapXml(unique);

  const publicOut = path.join(ROOT, 'public', 'sitemap.xml');
  fs.mkdirSync(path.dirname(publicOut), { recursive: true });
  fs.writeFileSync(publicOut, xml, 'utf8');
  console.log(
    `[sitemap] Wrote ${publicOut} (${unique.length} URLs: ${STATIC_PAGES.length} static, ${toolPaths.length} tools, ${posts.length} posts)`
  );

  const distDir = path.join(ROOT, 'dist');
  if (fs.existsSync(distDir)) {
    const distOut = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(distOut, xml, 'utf8');
    console.log(`[sitemap] Wrote ${distOut}`);
  }
}

main();
