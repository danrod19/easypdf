/**
 * Gera ícones PWA a partir de public/logo.svg com Sharp.
 *
 * Uso:
 *   npm i -D sharp
 *   npm run icons:pwa
 *
 * Maskable (Android/One UI): ~25% de margem em cada lado para o logo
 * não ser cortado por máscaras circulares/arredondadas.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const logoPath = path.join(publicDir, 'logo.svg');

/** Brand red — alinhado ao Tailwind brand / theme */
const BRAND_BG = { r: 239, g: 68, b: 68, alpha: 1 }; // #ef4444

/** Fração de padding por lado (0.25 = 25% de respiro maskable) */
const PADDING_RATIO = 0.25;

const SIZES = [192, 512];

async function generateIcon(size) {
  if (!fs.existsSync(logoPath)) {
    throw new Error(`Logo não encontrado: ${logoPath}`);
  }

  const padding = Math.round(size * PADDING_RATIO);
  const logoSize = size - padding * 2;

  const logoBuffer = await sharp(logoPath)
    .resize(logoSize, logoSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const outPath = path.join(publicDir, `pwa-${size}x${size}.png`);

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BRAND_BG,
    },
  })
    .composite([
      {
        input: logoBuffer,
        gravity: 'centre',
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  const stats = fs.statSync(outPath);
  console.log(
    `✓ ${path.relative(root, outPath)} (${size}×${size}, logo ${logoSize}px, padding ${padding}px) — ${stats.size} bytes`
  );
}

async function main() {
  console.log('Gerando ícones PWA a partir de public/logo.svg …');
  console.log(`Fundo: #ef4444 · padding maskable: ${PADDING_RATIO * 100}% por lado\n`);

  for (const size of SIZES) {
    await generateIcon(size);
  }

  console.log('\nPronto. Substitua logo.svg e rode `npm run icons:pwa` para regenerar.');
}

main().catch((err) => {
  console.error('Falha ao gerar ícones:', err);
  process.exit(1);
});
