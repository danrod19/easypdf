/**
 * Valida que o dist foi pré-renderizado de verdade (pós-Playwright).
 * Usado no GitHub Actions antes do deploy — falha se o HTML for só o shell SPA.
 *
 * Uso: node scripts/validate-prerender.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');

/** Rotas mínimas que devem existir com HTML rico */
const CHECKS = [
  {
    file: 'juntar-pdf/index.html',
    marker: 'easypdf-prerender: /juntar-pdf',
    titleIncludes: 'Juntar PDF',
    canonicalIncludes: 'easypdflocal.com.br/juntar-pdf',
  },
  {
    file: 'comprimir-pdf/index.html',
    marker: 'easypdf-prerender: /comprimir-pdf',
    titleIncludes: 'Comprimir PDF',
    canonicalIncludes: 'easypdflocal.com.br/comprimir-pdf',
  },
  {
    file: 'pdf-sem-upload/index.html',
    marker: 'easypdf-prerender: /pdf-sem-upload',
    titleIncludes: 'PDF',
    canonicalIncludes: 'easypdflocal.com.br/pdf-sem-upload',
  },
  {
    file: 'index.html',
    marker: 'easypdf-prerender: /',
    titleIncludes: 'Easy PDF Local',
    canonicalIncludes: 'easypdflocal.com.br/',
  },
];

function fail(msg) {
  console.error(`[validate-prerender] FALHA: ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`[validate-prerender] ✓ ${msg}`);
}

if (!fs.existsSync(DIST)) {
  fail(`pasta dist/ não encontrada em ${DIST}`);
}

let errors = 0;

for (const check of CHECKS) {
  const full = path.join(DIST, check.file);
  if (!fs.existsSync(full)) {
    console.error(`[validate-prerender] ✗ ausente: ${check.file}`);
    errors += 1;
    continue;
  }

  const html = fs.readFileSync(full, 'utf8');

  if (!html.includes(check.marker)) {
    console.error(
      `[validate-prerender] ✗ ${check.file}: falta marcador "${check.marker}" (prerender não rodou?)`
    );
    errors += 1;
    continue;
  }

  if (check.titleIncludes) {
    const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = m ? m[1] : '';
    if (!title.includes(check.titleIncludes)) {
      console.error(
        `[validate-prerender] ✗ ${check.file}: title inesperado: "${title.slice(0, 80)}"`
      );
      errors += 1;
      continue;
    }
  }

  if (
    check.canonicalIncludes &&
    !html.includes(check.canonicalIncludes)
  ) {
    console.error(
      `[validate-prerender] ✗ ${check.file}: canonical não contém ${check.canonicalIncludes}`
    );
    errors += 1;
    continue;
  }

  if (!/<h1[\s>]/i.test(html)) {
    console.error(`[validate-prerender] ✗ ${check.file}: sem <h1>`);
    errors += 1;
    continue;
  }

  // Shell da home “vazado” em rota de tool (title da home em /juntar-pdf)
  if (
    check.file.startsWith('juntar-pdf') &&
    /Easy PDF Local \| Ferramentas de PDF 100% Seguras/.test(html) &&
    !/Juntar PDF/.test(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? '')
  ) {
    console.error(
      `[validate-prerender] ✗ ${check.file}: parece shell da home (title genérico)`
    );
    errors += 1;
    continue;
  }

  ok(check.file);
}

if (errors > 0) {
  fail(
    `${errors} checagem(ns) falharam. Rode o build em ambiente com Playwright (imagem mcr.microsoft.com/playwright).`
  );
}

console.log(
  `[validate-prerender] OK — ${CHECKS.length} arquivos com HTML pré-renderizado.`
);
