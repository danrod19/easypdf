/**
 * Baixa imagens de afiliados e grava em public/affiliates/*.webp (otimizado).
 * Uso: node scripts/fetch-affiliate-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'affiliates');

const items = [
  {
    id: 'kindle-unlimited',
    url: 'https://editorialge.com/wp-content/uploads/2023/04/Amazon-kindle-unlimited-1024x532.jpeg',
  },
  {
    id: 'amazon-prime',
    url: 'https://tse3.mm.bing.net/th/id/OIP.SRI5lFYPZasfwH490xc9XQHaEM?r=0&pid=Api&P=0&h=180',
  },
  {
    id: 'amazon-music',
    url: 'https://tse4.mm.bing.net/th/id/OIP.hXi4HjpQ20NbOYV2i60xJwHaE7?r=0&pid=Api&P=0&h=180',
  },
  {
    id: 'mouse-vertical',
    url: 'https://http2.mlstatic.com/D_NQ_NP_2X_760268-MLA112165982538_062026-F.webp',
  },
  {
    id: 'pc-completo',
    url: 'https://http2.mlstatic.com/D_NQ_NP_2X_777241-MLB94692583816_102025-F-pc-computador-completo-intel-i5-16gb-ssd-480gb-monitor-19.webp',
  },
  {
    id: 'mouse-rgb',
    url: 'https://m.media-amazon.com/images/I/71-EbJpLi8L._AC_SL1500_.jpg',
  },
  {
    id: 'meias-puma',
    url: 'https://http2.mlstatic.com/D_NQ_NP_2X_746099-MLB80308965401_102024-F-kit-9-pares-meias-puma-soquete-cano-curto-sapatilha-original.webp',
  },
  {
    id: 'lista-bebe',
    url: 'https://mamaepechincha.com.br/wp-content/uploads/2022/08/voce-sabia-que-e-possivel-criar-uma-lista-de-produtos-essenciais-para-a-chegada-do-seu-bebe-na-amazon.webp',
  },
];

fs.mkdirSync(outDir, { recursive: true });

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function processOne({ id, url }) {
  const outPath = path.join(outDir, `${id}.webp`);
  console.log(`→ ${id}`);
  console.log(`  ${url}`);
  try {
    const buf = await fetchBuffer(url);
    await sharp(buf)
      .rotate()
      .resize({
        width: 800,
        height: 800,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 4 })
      .toFile(outPath);
    const stats = fs.statSync(outPath);
    console.log(`  ✓ ${path.relative(process.cwd(), outPath)} (${stats.size} bytes)`);
    return true;
  } catch (err) {
    console.error(`  ✗ ${id}:`, err.message || err);
    // Placeholder neutro se o download falhar
    const svg = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
        <rect width="100%" height="100%" fill="#f1f5f9"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="18" fill="#64748b">Produto</text>
      </svg>`
    );
    await sharp(svg).webp({ quality: 80 }).toFile(outPath);
    console.log(`  → placeholder gerado: ${id}.webp`);
    return false;
  }
}

let ok = 0;
for (const item of items) {
  const success = await processOne(item);
  if (success) ok += 1;
}

console.log(`\nConcluído: ${ok}/${items.length} baixadas com sucesso.`);
console.log(`Pasta: ${outDir}`);
