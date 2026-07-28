/**
 * Copia worker + core WASM do tesseract.js para public/tesseract/
 * e baixa o modelo de idioma português (por.traineddata.gz).
 *
 * Uso: node scripts/setup-tesseract.mjs
 * (ou npm run tesseract:setup)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'tesseract');

const workerSrc = path.join(
  root,
  'node_modules',
  'tesseract.js',
  'dist',
  'worker.min.js'
);
const coreDir = path.join(root, 'node_modules', 'tesseract.js-core');

/** Variantes LSTM (SIMD + fallback) — suficientes para createWorker padrão */
const CORE_FILES = [
  'tesseract-core-simd-lstm.wasm.js',
  'tesseract-core-simd-lstm.wasm',
  'tesseract-core-lstm.wasm.js',
  'tesseract-core-lstm.wasm',
];

const LANG_URL =
  'https://cdn.jsdelivr.net/npm/@tesseract.js-data/por@1.0.0/4.0.0_best_int/por.traineddata.gz';
// Fallback oficial tessdata
const LANG_URL_FALLBACK =
  'https://raw.githubusercontent.com/naptha/tessdata/gh-pages/4.0.0/por.traineddata.gz';

fs.mkdirSync(outDir, { recursive: true });

function copyFile(src, destName) {
  const dest = path.join(outDir, destName);
  if (!fs.existsSync(src)) {
    throw new Error(`Arquivo não encontrado: ${src}`);
  }
  fs.copyFileSync(src, dest);
  const kb = Math.round(fs.statSync(dest).size / 1024);
  console.log(`✓ ${destName} (${kb} KB)`);
}

async function downloadLang() {
  const dest = path.join(outDir, 'por.traineddata.gz');
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
    console.log(`✓ por.traineddata.gz (já existe, ${Math.round(fs.statSync(dest).size / 1024)} KB)`);
    return;
  }

  for (const url of [LANG_URL, LANG_URL_FALLBACK]) {
    try {
      console.log(`Baixando por.traineddata.gz de ${url} …`);
      const res = await fetch(url, {
        headers: { 'User-Agent': 'EasyPDFLocal-setup/1.0' },
        redirect: 'follow',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1000) throw new Error('Arquivo muito pequeno');
      fs.writeFileSync(dest, buf);
      console.log(`✓ por.traineddata.gz (${Math.round(buf.length / 1024)} KB)`);
      return;
    } catch (err) {
      console.warn(`  falhou: ${err.message || err}`);
    }
  }
  throw new Error('Não foi possível baixar por.traineddata.gz');
}

console.log('Self-host Tesseract → public/tesseract/\n');

copyFile(workerSrc, 'worker.min.js');

for (const name of CORE_FILES) {
  const src = path.join(coreDir, name);
  if (fs.existsSync(src)) {
    copyFile(src, name);
  } else {
    console.warn(`⚠ opcional ausente: ${name}`);
  }
}

await downloadLang();

// README local
fs.writeFileSync(
  path.join(outDir, 'README.md'),
  `# Tesseract self-hosted (Easy PDF Local)

Arquivos servidos de \`/tesseract/*\` (sem CDN).

Regenerar:
\`\`\`
npm run tesseract:setup
\`\`\`

- worker.min.js — worker do tesseract.js
- tesseract-core-*.wasm(.js) — runtime WASM
- por.traineddata.gz — idioma português
`
);

console.log('\nPronto. Aponte createWorker para /tesseract/');
