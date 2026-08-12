/**
 * Valida HTML pré-renderizado em dist/ (pós-Playwright).
 * Só file checks — sem browser. Usado no CI antes do wrangler deploy.
 *
 * Uso: npm run validate:prerender
 *      node scripts/validate-prerender.mjs
 *
 * Falha (exit 1) se qualquer rota obrigatória estiver ausente ou fraca
 * (shell SPA, title da home vazado, canonical errada, sem H1/conteúdo).
 *
 * Lista e regras: docs/PRERENDER.md § Validação CI
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const SITE_HOST = 'easypdflocal.com.br';

/** Title genérico da home — não pode aparecer como title de tool/post/hub */
const HOME_TITLE_SNIPPET =
  'Easy PDF Local | Ferramentas de PDF 100% Seguras';

/**
 * Checklist mínimo obrigatório (GSC / AdSense / SEO).
 * path: rota canônica SEM trailing slash (exceto "/").
 *
 * @typedef {object} RouteCheck
 * @property {string} path
 * @property {string | string[]} titleIncludes  — todas as substrings no <title>
 * @property {string} [h1Includes]             — substring no <h1> (opcional)
 * @property {string | string[]} [bodyIncludes] — substrings no HTML (artigo etc.)
 * @property {boolean} [allowHomeTitle]        — só home: title pode ser o da home
 * @property {boolean} [requireArticle]        — post de blog: <article> ou body longo
 */

/** @type {readonly RouteCheck[]} */
const REQUIRED_CHECKS = [
  {
    path: '/',
    titleIncludes: ['Easy PDF Local'],
    allowHomeTitle: true,
  },
  {
    path: '/juntar-pdf',
    titleIncludes: ['Juntar'],
    h1Includes: 'Juntar',
  },
  {
    path: '/comprimir-pdf',
    titleIncludes: ['Comprimir'],
    h1Includes: 'Comprimir',
  },
  {
    path: '/word-para-pdf',
    titleIncludes: ['Word'],
    h1Includes: 'Word',
  },
  {
    path: '/pdf-sem-upload',
    titleIncludes: ['sem Upload'],
    // title real: "PDF sem Upload | …" — aceita case do seo.ts
    h1Includes: 'upload',
  },
  {
    path: '/sobre',
    titleIncludes: ['Sobre'],
    h1Includes: 'Sobre',
  },
  {
    path: '/blog/juntar-pdf-online-sem-upload',
    titleIncludes: ['Juntar PDF'],
    bodyIncludes: ['juntar', 'sem upload'],
    requireArticle: true,
  },
];

/**
 * path de rota → arquivo em dist
 * / → index.html
 * /juntar-pdf → juntar-pdf/index.html
 * /blog/slug → blog/slug/index.html
 * @param {string} route
 */
function routeToRelFile(route) {
  if (route === '/') return 'index.html';
  const clean = route.replace(/\/$/, '');
  return `${clean.slice(1)}/index.html`;
}

/** Pathname canônico esperado (sem trailing slash, exceto home) */
function expectedCanonicalPath(route) {
  if (route === '/') return '/';
  return route.replace(/\/$/, '') || '/';
}

/**
 * @param {string} route
 * @returns {string} substring esperada no href canonical
 */
function expectedCanonicalIncludes(route) {
  const p = expectedCanonicalPath(route);
  return p === '/' ? `${SITE_HOST}/` : `${SITE_HOST}${p}`;
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m ? m[1].trim() : '';
}

function extractCanonicalHref(html) {
  const m =
    html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
    html.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  return m ? m[1].trim() : null;
}

function extractH1Text(html) {
  const m = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return '';
  return m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Valida uma rota. Retorna lista de mensagens de erro (vazia = ok).
 * @param {RouteCheck} check
 * @returns {string[]}
 */
function validateRoute(check) {
  const { path: route } = check;
  const relFile = routeToRelFile(route);
  const full = path.join(DIST, relFile);
  /** @type {string[]} */
  const errors = [];
  const label = `${route} (${relFile})`;

  if (!fs.existsSync(full)) {
    errors.push(
      `${label}: arquivo ausente — prerender não gerou HTML (rode npm run build com Playwright)`
    );
    return errors;
  }

  const html = fs.readFileSync(full, 'utf8');
  const marker = `easypdf-prerender: ${expectedCanonicalPath(route)}`;

  if (!html.includes(marker)) {
    errors.push(
      `${label}: falta marker "<!-- ${marker} -->" — HTML não foi pré-renderizado (shell SPA?)`
    );
  }

  // Title
  const title = extractTitle(html);
  if (!title || title.length < 5) {
    errors.push(`${label}: <title> vazio ou curto`);
  } else {
    const needles = Array.isArray(check.titleIncludes)
      ? check.titleIncludes
      : [check.titleIncludes];
    for (const n of needles) {
      if (!title.toLowerCase().includes(String(n).toLowerCase())) {
        errors.push(
          `${label}: title não contém "${n}" — obtido: "${title.slice(0, 90)}"`
        );
      }
    }
    // Tool / post / hub não pode vazar title genérico da home
    if (!check.allowHomeTitle && title.includes(HOME_TITLE_SNIPPET)) {
      errors.push(
        `${label}: title é o genérico da home ("${HOME_TITLE_SNIPPET}…") — prerender/SEO da rota falhou`
      );
    }
  }

  // Canonical alinhado à regra SEM barra (exceto home)
  const canHref = extractCanonicalHref(html);
  const canNeedle = expectedCanonicalIncludes(route);
  if (!canHref) {
    errors.push(`${label}: <link rel="canonical"> ausente`);
  } else {
    if (!canHref.includes(canNeedle)) {
      errors.push(
        `${label}: canonical não contém "${canNeedle}" — href="${canHref}"`
      );
    }
    try {
      const u = new URL(canHref);
      const p = u.pathname || '/';
      const expected = expectedCanonicalPath(route);
      if (p !== expected) {
        errors.push(
          `${label}: canonical path "${p}" ≠ esperado "${expected}" (regra: sem trailing slash, exceto /)`
        );
      }
      if (p.length > 1 && p.endsWith('/')) {
        errors.push(
          `${label}: canonical com trailing slash (${p}) — decisão do site é SEM barra`
        );
      }
    } catch {
      // href relativo: exige ao menos a substring canônica
      if (!canHref.includes(canNeedle.replace(`${SITE_HOST}`, ''))) {
        errors.push(
          `${label}: canonical relativa inesperada: "${canHref}"`
        );
      }
    }
  }

  // H1 / conteúdo da página
  const h1 = extractH1Text(html);
  if (!h1 || h1.length < 3) {
    // Blog: h1 pode vir só do markdown; requireArticle cobre o corpo
    if (!check.requireArticle) {
      errors.push(`${label}: <h1> ausente ou vazio no HTML pré-renderizado`);
    }
  } else if (check.h1Includes) {
    if (!h1.toLowerCase().includes(String(check.h1Includes).toLowerCase())) {
      errors.push(
        `${label}: <h1> não contém "${check.h1Includes}" — obtido: "${h1.slice(0, 80)}"`
      );
    }
  }

  if (check.bodyIncludes) {
    const needles = Array.isArray(check.bodyIncludes)
      ? check.bodyIncludes
      : [check.bodyIncludes];
    const lower = html.toLowerCase();
    for (const n of needles) {
      if (!lower.includes(String(n).toLowerCase())) {
        errors.push(
          `${label}: HTML não contém indício de conteúdo "${n}"`
        );
      }
    }
  }

  if (check.requireArticle) {
    const hasArticle = /<article\b/i.test(html);
    // Corpo real do post (prerender espera texto longo; evita "Carregando artigo")
    const textish = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ');
    const longEnough = textish.length > 400;
    const stillLoading =
      /Carregando artigo/i.test(html) && !longEnough;

    if (!hasArticle && !longEnough) {
      errors.push(
        `${label}: falta <article> / corpo do post no HTML (prerender incompleto?)`
      );
    }
    if (stillLoading) {
      errors.push(
        `${label}: HTML ainda mostra "Carregando artigo" — markdown não capturado`
      );
    }
  }

  return errors;
}

// —— main ——

if (!fs.existsSync(DIST)) {
  console.error(`[validate-prerender] FALHA: pasta dist/ não encontrada em ${DIST}`);
  process.exit(1);
}

/** @type {string[]} */
const allErrors = [];
let okCount = 0;

console.log(
  `[validate-prerender] Checklist obrigatório: ${REQUIRED_CHECKS.length} rotas em ${DIST}`
);

for (const check of REQUIRED_CHECKS) {
  const errs = validateRoute(check);
  if (errs.length === 0) {
    console.log(`[validate-prerender] ✓ ${check.path}`);
    okCount += 1;
  } else {
    for (const e of errs) {
      console.error(`[validate-prerender] ✗ ${e}`);
      allErrors.push(e);
    }
  }
}

if (allErrors.length > 0) {
  console.error('');
  console.error(
    `[validate-prerender] FALHA: ${allErrors.length} problema(s) em ${REQUIRED_CHECKS.length - okCount}/${REQUIRED_CHECKS.length} rota(s).`
  );
  console.error(
    '[validate-prerender] Rode o build com Playwright (imagem mcr.microsoft.com/playwright) e confira scripts/prerender-routes.mjs.'
  );
  console.error(
    '[validate-prerender] Docs: docs/PRERENDER.md § Validação CI'
  );
  process.exit(1);
}

console.log(
  `[validate-prerender] OK — ${okCount}/${REQUIRED_CHECKS.length} rotas com HTML pré-renderizado válido.`
);
process.exit(0);
