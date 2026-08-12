import {
  PDFDocument,
  StandardFonts,
  rgb,
  degrees,
  type RGB,
  type PDFFont,
  type PDFPage,
} from 'pdf-lib';
import { getPdfPageCount } from './splitPdf';

export { getPdfPageCount };

export type WatermarkColorName = 'black' | 'gray' | 'red';
export type WatermarkPosition = 'diagonal' | 'footer';

export interface WatermarkOptions {
  text: string;
  /** 0.1 – 1.0 */
  opacity: number;
  /** Tamanho da fonte em pontos PDF */
  fontSize: number;
  color: WatermarkColorName;
  position: WatermarkPosition;
}

export interface WatermarkProgress {
  percent: number;
  message: string;
}

export type WatermarkProgressCallback = (progress: WatermarkProgress) => void;

const COLOR_RGB: Record<WatermarkColorName, RGB> = {
  black: rgb(0.08, 0.08, 0.1),
  gray: rgb(0.45, 0.47, 0.5),
  red: rgb(0.85, 0.12, 0.12),
};

/** Limites do formulário (UI + validação). */
export const WATERMARK_LIMITS = {
  opacityMin: 0.1,
  opacityMax: 1,
  fontSizeMin: 12,
  fontSizeMax: 96,
  textMaxLength: 80,
} as const;

export const DEFAULT_WATERMARK_OPTIONS: WatermarkOptions = {
  text: 'CONFIDENCIAL',
  opacity: 0.35,
  fontSize: 48,
  color: 'gray',
  position: 'diagonal',
};

/**
 * StandardFonts (WinAnsi) não cobrem todos os caracteres Unicode.
 * Substitui acentos comuns e remove o resto fora do conjunto seguro.
 */
export function sanitizeWatermarkText(raw: string): string {
  const map: Record<string, string> = {
    á: 'a',
    à: 'a',
    ã: 'a',
    â: 'a',
    ä: 'a',
    é: 'e',
    ê: 'e',
    è: 'e',
    ë: 'e',
    í: 'i',
    ì: 'i',
    î: 'i',
    ï: 'i',
    ó: 'o',
    ò: 'o',
    õ: 'o',
    ô: 'o',
    ö: 'o',
    ú: 'u',
    ù: 'u',
    û: 'u',
    ü: 'u',
    ç: 'c',
    ñ: 'n',
    Á: 'A',
    À: 'A',
    Ã: 'A',
    Â: 'A',
    Ä: 'A',
    É: 'E',
    Ê: 'E',
    È: 'E',
    Ë: 'E',
    Í: 'I',
    Ì: 'I',
    Î: 'I',
    Ï: 'I',
    Ó: 'O',
    Ò: 'O',
    Õ: 'O',
    Ô: 'O',
    Ö: 'O',
    Ú: 'U',
    Ù: 'U',
    Û: 'U',
    Ü: 'U',
    Ç: 'C',
    Ñ: 'N',
    '’': "'",
    '‘': "'",
    '“': '"',
    '”': '"',
    '–': '-',
    '—': '-',
  };

  let out = '';
  for (const ch of raw) {
    if (map[ch]) {
      out += map[ch];
      continue;
    }
    const code = ch.charCodeAt(0);
    // WinAnsi printable range roughly; keep space and common punctuation
    if (code >= 32 && code <= 126) {
      out += ch;
    } else if (code >= 160 && code <= 255) {
      // leave Latin-1 for pdf-lib when possible
      out += ch;
    }
  }
  return out.trim();
}

export function validateWatermarkOptions(options: WatermarkOptions): string {
  const text = options.text.trim();
  if (!text) {
    return 'Informe o texto da marca d\'água.';
  }
  if (text.length > WATERMARK_LIMITS.textMaxLength) {
    return `O texto pode ter no máximo ${WATERMARK_LIMITS.textMaxLength} caracteres.`;
  }
  if (
    options.opacity < WATERMARK_LIMITS.opacityMin ||
    options.opacity > WATERMARK_LIMITS.opacityMax
  ) {
    return 'A opacidade deve estar entre 10% e 100%.';
  }
  if (
    options.fontSize < WATERMARK_LIMITS.fontSizeMin ||
    options.fontSize > WATERMARK_LIMITS.fontSizeMax
  ) {
    return `O tamanho da fonte deve estar entre ${WATERMARK_LIMITS.fontSizeMin} e ${WATERMARK_LIMITS.fontSizeMax}.`;
  }
  return '';
}

function drawDiagonal(
  page: PDFPage,
  text: string,
  font: PDFFont,
  fontSize: number,
  color: RGB,
  opacity: number
) {
  const { width, height } = page.getSize();
  const textWidth = font.widthOfTextAtSize(text, fontSize);
  const angleDeg = 45;
  const angleRad = (angleDeg * Math.PI) / 180;

  // Âncora no centro da página, compensando metade da largura do texto no eixo rotacionado
  const x = width / 2 - (textWidth / 2) * Math.cos(angleRad);
  const y = height / 2 - (textWidth / 2) * Math.sin(angleRad);

  page.drawText(text, {
    x,
    y,
    size: fontSize,
    font,
    color,
    opacity,
    rotate: degrees(angleDeg),
  });
}

function drawFooter(
  page: PDFPage,
  text: string,
  font: PDFFont,
  fontSize: number,
  color: RGB,
  opacity: number
) {
  const { width } = page.getSize();
  const textWidth = font.widthOfTextAtSize(text, fontSize);
  const margin = Math.max(18, fontSize * 0.6);
  const x = Math.max(margin, (width - textWidth) / 2);
  const y = margin;

  page.drawText(text, {
    x,
    y,
    size: fontSize,
    font,
    color,
    opacity,
    rotate: degrees(0),
  });
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException('Processamento cancelado.', 'AbortError');
  }
}

/**
 * Aplica marca d'água textual em todas as páginas e devolve os bytes do PDF.
 * `signal` cancela entre páginas (unmount / novo job).
 */
export async function applyWatermarkToPdf(
  file: File,
  options: WatermarkOptions,
  onProgress?: WatermarkProgressCallback,
  signal?: AbortSignal
): Promise<Uint8Array> {
  const validationError = validateWatermarkOptions(options);
  if (validationError) {
    throw new Error(validationError);
  }

  const text = sanitizeWatermarkText(options.text);
  if (!text) {
    throw new Error(
      'O texto da marca d\'água ficou vazio após sanitização. Use letras e números sem emojis.'
    );
  }

  throwIfAborted(signal);
  onProgress?.({ percent: 10, message: `Lendo ${file.name}…` });

  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    throwIfAborted(signal);
    throw new Error(`Não foi possível ler o arquivo "${file.name}".`);
  }

  throwIfAborted(signal);
  onProgress?.({ percent: 30, message: 'Carregando documento…' });

  let pdfDoc: PDFDocument;
  try {
    pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: false });
  } catch {
    throwIfAborted(signal);
    throw new Error(
      `O arquivo "${file.name}" não é um PDF válido ou está protegido por senha.`
    );
  }

  throwIfAborted(signal);
  onProgress?.({ percent: 45, message: 'Embutindo fonte Helvetica Bold…' });

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const color = COLOR_RGB[options.color];
  const opacity = Math.min(
    WATERMARK_LIMITS.opacityMax,
    Math.max(WATERMARK_LIMITS.opacityMin, options.opacity)
  );
  const fontSize = options.fontSize;
  const pages = pdfDoc.getPages();
  const total = pages.length;

  if (total === 0) {
    throw new Error('O PDF não possui páginas.');
  }

  onProgress?.({
    percent: 55,
    message: `Aplicando marca d'água em ${total} página${total === 1 ? '' : 's'}…`,
  });

  for (let i = 0; i < total; i++) {
    throwIfAborted(signal);
    const page = pages[i];
    try {
      if (options.position === 'footer') {
        drawFooter(page, text, font, fontSize, color, opacity);
      } else {
        drawDiagonal(page, text, font, fontSize, color, opacity);
      }
    } catch (err) {
      if (
        (err instanceof DOMException && err.name === 'AbortError') ||
        (err instanceof Error && err.name === 'AbortError')
      ) {
        throw err;
      }
      const msg =
        err instanceof Error ? err.message : 'erro desconhecido ao desenhar texto';
      throw new Error(
        `Falha ao desenhar a marca d'água na página ${i + 1}: ${msg}. Evite caracteres especiais.`
      );
    }

    const pct = 55 + Math.round(((i + 1) / total) * 35);
    onProgress?.({
      percent: pct,
      message: `Página ${i + 1} de ${total}…`,
    });
  }

  throwIfAborted(signal);
  onProgress?.({ percent: 95, message: 'Gerando arquivo final…' });
  const pdfBytes = await pdfDoc.save();
  throwIfAborted(signal);
  onProgress?.({ percent: 100, message: 'Concluído!' });

  return pdfBytes;
}

/** Nome de download: `{base}-marcado.pdf` */
export function watermarkedFileName(originalName: string): string {
  const base = originalName.replace(/\.pdf$/i, '') || 'documento';
  return `${base}-marcado.pdf`;
}
