/**
 * Pré-renderização estática pós-`vite build` (Easy PDF Local)
 * --------------------------------------------------------------------------
 * Problema: SPA entrega o mesmo index.html (meta/title da home) em todas as
 * rotas até o JS rodar. Crawlers e sites novos sofrem com isso.
 *
 * Solução: após o build, sobe um servidor estático do `dist/`, abre cada rota
 * com Playwright (Chromium), espera title + canonical + H1, e grava o HTML
 * em `dist{path}/index.html` (ou sobrescreve `dist/index.html` na home).
 *
 * Cloudflare Pages / Azure SWA: arquivos reais têm prioridade sobre fallback SPA.
 * O client-side React continua com createRoot (substitui #root ao hidratar).
 *
 * Uso:
 *   node scripts/prerender.mjs
 *   SKIP_PRERENDER=1 npm run build   → pula (emergência)
 *
 * Deps: playwright (devDependency) + `npx playwright install chromium`
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRERENDER_ROUTES } from './prerender-routes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PRERENDER_PORT || 4179);
const ORIGIN = `http://127.0.0.1:${PORT}`;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.map': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.wasm': 'application/wasm',
  '.gz': 'application/gzip',
};

function log(msg) {
  console.log(`[prerender] ${msg}`);
}

function fail(msg) {
  console.error(`[prerender] ERRO: ${msg}`);
  process.exitCode = 1;
}

/** Normaliza path de rota → path de arquivo em dist */
function routeToOutFile(route) {
  if (route === '/') return path.join(DIST, 'index.html');
  const clean = route.replace(/\/$/, '');
  return path.join(DIST, clean.slice(1), 'index.html');
}

/** Pathname esperado na canonical (sem trailing slash, exceto home) */
function expectedCanonicalPath(route) {
  if (route === '/') return '/';
  return route.replace(/\/$/, '') || '/';
}

/**
 * Servidor estático do dist com fallback SPA → sempre o index.html do Vite
 * (não usa HTML já pré-renderizado como shell — evita misturar rotas).
 */
function startServer(spaShellHtml) {
  const server = http.createServer((req, res) => {
    try {
      const url = new URL(req.url || '/', ORIGIN);
      let pathname = decodeURIComponent(url.pathname);

      // Segurança básica
      if (pathname.includes('..')) {
        res.writeHead(400);
        res.end('Bad path');
        return;
      }

      // Arquivo estático existente (assets, robots, etc.)
      let filePath = path.join(DIST, pathname === '/' ? 'index.html' : pathname);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        const asIndex = path.join(filePath, 'index.html');
        if (fs.existsSync(asIndex)) filePath = asIndex;
      }

      const isAsset =
        pathname.startsWith('/assets/') ||
        /\.[a-zA-Z0-9]+$/.test(pathname);

      if (isAsset && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
        return;
      }

      // Rotas da app: sempre devolve o shell SPA original (build do Vite)
      // — inclusive se já existir dist/juntar-pdf/index.html de uma passada anterior
      if (
        !isAsset ||
        !fs.existsSync(filePath) ||
        !fs.statSync(filePath).isFile()
      ) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(spaShellHtml);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } catch (err) {
      res.writeHead(500);
      res.end(String(err));
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

function injectPrerenderMarker(html, route) {
  const marker = `<!-- easypdf-prerender: ${route} -->`;
  if (html.includes('easypdf-prerender:')) {
    return html.replace(/<!-- easypdf-prerender:.*?-->/, marker);
  }
  if (html.includes('<head>')) {
    return html.replace('<head>', `<head>\n    ${marker}`);
  }
  return `${marker}\n${html}`;
}

/**
 * Playwright serializa modulepreload/src com origem absoluta do servidor local.
 * Em produção isso quebra — reescreve para paths root-relative.
 */
function rewriteLocalOriginToRelative(html) {
  return html
    .replaceAll(`http://127.0.0.1:${PORT}`, '')
    .replaceAll(`http://localhost:${PORT}`, '')
    .replaceAll(`http://[::1]:${PORT}`, '');
}

/** Pós-processamento do HTML capturado antes de gravar em dist */
function finalizeHtml(html, route) {
  let out = rewriteLocalOriginToRelative(html);
  out = injectPrerenderMarker(out, route);
  return out;
}

async function waitForSeoReady(page, route) {
  const expectedPath = expectedCanonicalPath(route);

  // 1) App montou (root com conteúdo)
  await page.waitForFunction(
    () => {
      const root = document.getElementById('root');
      return !!(root && root.innerHTML && root.innerHTML.length > 80);
    },
    { timeout: 45_000 }
  );

  // 2) H1 visível (ou sr-only + conteúdo em posts)
  await page.waitForFunction(
    () => {
      const h1s = Array.from(document.querySelectorAll('h1'));
      return h1s.some((h) => (h.textContent || '').trim().length >= 3);
    },
    { timeout: 45_000 }
  );

  // 3) Canonical self-referencing da rota (useSEO)
  await page.waitForFunction(
    (exp) => {
      const link = document.querySelector('link[rel="canonical"]');
      if (!link) return false;
      const href = link.getAttribute('href') || '';
      try {
        const u = new URL(href);
        let p = u.pathname || '/';
        if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
        return p === exp;
      } catch {
        return false;
      }
    },
    expectedPath,
    { timeout: 45_000 }
  );

  // 4) Title não vazio e, se não for home, diferente do genérico vazio
  await page.waitForFunction(
    () => (document.title || '').trim().length > 5,
    { timeout: 15_000 }
  );

  // Posts do blog: esperar corpo markdown (além do shell “Carregando…”)
  if (route.startsWith('/blog/') && route !== '/blog') {
    await page.waitForFunction(
      () => {
        const article = document.querySelector('article');
        if (!article) return false;
        const text = (article.textContent || '').replace(/\s+/g, ' ');
        // Post real tem mais que o header de loading
        return (
          text.length > 400 &&
          !text.includes('Carregando artigo') &&
          !text.includes('Não foi possível carregar')
        );
      },
      { timeout: 60_000 }
    );
  }

  // Pequena folga para useEffect de SEO / JSON-LD
  await new Promise((r) => setTimeout(r, 300));
}

async function prerenderRoute(page, route) {
  const url = `${ORIGIN}${route === '/' ? '/' : route}`;
  log(`→ ${route}`);

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });

  await waitForSeoReady(page, route);

  let html = await page.content();
  html = finalizeHtml(html, route);

  // Sanity checks
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const hasCanonical = html.includes('rel="canonical"') || html.includes("rel='canonical'");
  const hasH1 = /<h1[\s>]/i.test(html);

  if (!title) throw new Error(`title vazio em ${route}`);
  if (!hasCanonical) throw new Error(`canonical ausente em ${route}`);
  if (!hasH1) throw new Error(`H1 ausente em ${route}`);

  // Canonical deve apontar para a rota
  const exp = expectedCanonicalPath(route);
  const canMatch = html.match(
    /rel=["']canonical["'][^>]*href=["']([^"']+)["']/i
  ) || html.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  if (canMatch) {
    try {
      const u = new URL(canMatch[1]);
      let p = u.pathname || '/';
      if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
      if (p !== exp) {
        throw new Error(
          `canonical path "${p}" ≠ esperado "${exp}" em ${route}`
        );
      }
    } catch (e) {
      if (e instanceof TypeError) {
        // href relativo — aceitar se contiver a rota
        if (exp !== '/' && !canMatch[1].includes(exp)) {
          throw new Error(`canonical inesperada: ${canMatch[1]}`);
        }
      } else {
        throw e;
      }
    }
  }

  const outFile = routeToOutFile(route);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html, 'utf8');

  log(`  ✓ ${path.relative(ROOT, outFile)}  |  title: ${title.slice(0, 70)}`);
  return { route, title, outFile };
}

async function main() {
  if (process.env.SKIP_PRERENDER === '1' || process.env.SKIP_PRERENDER === 'true') {
    log('SKIP_PRERENDER ativo — saindo sem pré-renderizar.');
    return;
  }

  if (!fs.existsSync(DIST) || !fs.existsSync(path.join(DIST, 'index.html'))) {
    fail('dist/index.html não encontrado. Rode `vite build` antes.');
    process.exit(1);
  }

  /**
   * Shell SPA = HTML gerado pelo Vite (scripts de entrada), NÃO um HTML já
   * pré-renderizado. Se o usuário rodar `npm run prerender` duas vezes,
   * dist/index.html já tem o conteúdo da home — guardamos o shell limpo.
   */
  const shellCachePath = path.join(DIST, '.prerender-spa-shell.html');
  const indexPath = path.join(DIST, 'index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  if (!indexHtml.includes('easypdf-prerender:')) {
    fs.writeFileSync(shellCachePath, indexHtml, 'utf8');
  } else if (fs.existsSync(shellCachePath)) {
    log('index.html já pré-renderizado — reutilizando shell SPA em cache.');
  } else {
    fail(
      'dist/index.html já foi pré-renderizado e não há shell em cache. Rode `vite build` (ou npm run build) de novo.'
    );
    process.exit(1);
  }
  const spaShellHtml = fs.readFileSync(shellCachePath, 'utf8');

  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    fail(
      'Pacote "playwright" não encontrado. Rode: npm i -D playwright && npx playwright install chromium'
    );
    process.exit(1);
  }

  log(`Servindo ${DIST} em ${ORIGIN}`);
  const server = await startServer(spaShellHtml);

  let browser;
  const results = [];
  const errors = [];

  try {
    browser = await playwright.chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });

    const context = await browser.newContext({
      // Evita Service Worker da PWA interferir no HTML capturado
      serviceWorkers: 'block',
      userAgent:
        'EasyPDFLocalPrerender/1.0 (+https://easypdflocal.com.br; build prerender)',
      locale: 'pt-BR',
      viewport: { width: 1280, height: 800 },
    });

    const page = await context.newPage();

    // Bloqueia tags de analytics/ads (mais rápido e estável no CI)
    await page.route('**/*', (route) => {
      const u = route.request().url();
      if (
        /googletagmanager|google-analytics|googlesyndication|googleadservices|doubleclick|fundingchoices|cloudflareinsights|facebook\.net|hotjar/i.test(
          u
        )
      ) {
        return route.abort();
      }
      return route.continue();
    });

    page.setDefaultTimeout(60_000);

    for (const route of PRERENDER_ROUTES) {
      try {
        const r = await prerenderRoute(page, route);
        results.push(r);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push({ route, msg });
        console.error(`  ✗ ${route}: ${msg}`);
      }
    }

    await context.close();
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  // Remove cache interno do shell (não deve ir para o deploy)
  const shellCachePathEnd = path.join(DIST, '.prerender-spa-shell.html');
  try {
    if (fs.existsSync(shellCachePathEnd)) fs.unlinkSync(shellCachePathEnd);
  } catch {
    // ignore
  }

  log('—'.repeat(40));
  log(`OK: ${results.length}/${PRERENDER_ROUTES.length} rotas`);
  if (errors.length) {
    log(`Falhas: ${errors.length}`);
    for (const e of errors) log(`  - ${e.route}: ${e.msg}`);
    // Falha o build se alguma rota prioritária quebrar
    fail('Prerender incompleto — corrija antes do deploy.');
    process.exit(1);
  }

  // Amostra rápida para o log de CI
  const sample = results.find((r) => r.route === '/juntar-pdf');
  if (sample) {
    log(`Amostra /juntar-pdf title: "${sample.title}"`);
  }
  log('Concluído.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
