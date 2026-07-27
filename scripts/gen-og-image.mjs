import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, '..', 'public', 'og-image.png');

const width = 1200;
const height = 630;

const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="55%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#7f1d1d"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect x="64" y="64" width="120" height="120" rx="28" fill="#dc2626"/>
  <text x="124" y="145" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="48" font-weight="700" fill="#ffffff">PDF</text>
  <text x="220" y="140" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="700" fill="#ffffff">Easy PDF Local</text>
  <text x="220" y="200" font-family="Segoe UI, Arial, sans-serif" font-size="32" font-weight="500" fill="#fca5a5">Ferramentas de PDF 100% no navegador</text>
  <text x="64" y="340" font-family="Segoe UI, Arial, sans-serif" font-size="36" font-weight="600" fill="#e2e8f0">Junte · Divida · Comprima · Converta</text>
  <text x="64" y="410" font-family="Segoe UI, Arial, sans-serif" font-size="28" fill="#94a3b8">Sem upload · Privacidade total · Grátis</text>
  <text x="64" y="540" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#f87171">easypdflocal.com.br</text>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log('Wrote', out);
