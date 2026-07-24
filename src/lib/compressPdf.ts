import { PDFDocument } from 'pdf-lib';
import { loadPdfJs } from './pdfjsLoader';

/** Níveis de compressão expostos na UI. */
export type CompressionLevel = 'low' | 'medium' | 'high';

export interface CompressionPreset {
  id: CompressionLevel;
  /** Rótulo curto (botões) */
  label: string;
  /** Descrição (ex.: Melhor Qualidade) */
  description: string;
  /** Qualidade JPEG 0–1 */
  jpegQuality: number;
  /** Escala de renderização no pdf.js */
  scale: number;
}

/**
 * Mapeamento de nível → qualidade JPEG + escala de resolução.
 * Baixa compressão = melhor qualidade; Alta = menor arquivo.
 */
export const COMPRESSION_PRESETS: Record<CompressionLevel, CompressionPreset> =
  {
    low: {
      id: 'low',
      label: 'Baixa',
      description: 'Melhor Qualidade',
      jpegQuality: 0.8,
      scale: 1.5,
    },
    medium: {
      id: 'medium',
      label: 'Média',
      description: 'Recomendado',
      jpegQuality: 0.5,
      scale: 1.0,
    },
    high: {
      id: 'high',
      label: 'Alta',
      description: 'Menor Arquivo',
      jpegQuality: 0.2,
      scale: 0.8,
    },
  };

export const DEFAULT_COMPRESSION_LEVEL: CompressionLevel = 'medium';

export interface CompressProgress {
  /** 0–100 */
  percent: number;
  message: string;
  currentPage?: number;
  totalPages?: number;
}

export type CompressProgressCallback = (progress: CompressProgress) => void;

export interface CompressPdfResult {
  /** Bytes do PDF comprimido */
  bytes: Uint8Array;
  originalSize: number;
  compressedSize: number;
  /** Redução em % (0–100). Pode ser negativa se o arquivo crescer. */
  reductionPercent: number;
  pageCount: number;
  level: CompressionLevel;
}

/**
 * Nome sugerido para download.
 */
export function compressedFileName(
  originalName: string,
  level: CompressionLevel
): string {
  const stamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, '-');
  const base = originalName.replace(/\.pdf$/i, '') || 'documento';
  return `${base}-comprimido-${level}-${stamp}.pdf`;
}

/**
 * Converte data URL (ex.: data:image/jpeg;base64,...) em Uint8Array.
 */
export function dataUrlToBytes(dataUrl: string): Uint8Array {
  const comma = dataUrl.indexOf(',');
  if (comma < 0) {
    throw new Error('Data URL JPEG inválido.');
  }
  const base64 = dataUrl.slice(comma + 1);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Comprime um PDF no navegador via rasterização (pdf.js → canvas → JPEG → pdf-lib).
 *
 * Limitação intencional (privacidade / client-side): cada página vira imagem JPEG.
 * Texto deixa de ser selecionável; ótimo para scans e PDFs com fotos pesadas.
 */
export async function compressPdf(
  file: File,
  level: CompressionLevel = DEFAULT_COMPRESSION_LEVEL,
  onProgress?: CompressProgressCallback
): Promise<CompressPdfResult> {
  const preset = COMPRESSION_PRESETS[level];
  if (!preset) {
    throw new Error('Nível de compressão inválido.');
  }

  const originalSize = file.size;
  if (originalSize < 1) {
    throw new Error('O arquivo parece estar vazio.');
  }

  onProgress?.({ percent: 3, message: `Lendo ${file.name}…` });

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch {
    throw new Error(`Não foi possível ler o arquivo "${file.name}".`);
  }

  onProgress?.({ percent: 8, message: 'Carregando visualizador…' });

  const pdfjs = await loadPdfJs();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pdf: any;
  try {
    pdf = await pdfjs.getDocument({
      data: new Uint8Array(arrayBuffer),
    }).promise;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/password|encrypt/i.test(msg)) {
      throw new Error(
        'Este PDF está protegido por senha. Use Desbloquear PDF antes de comprimir.'
      );
    }
    throw new Error(
      `Não foi possível abrir "${file.name}". Confirme que é um PDF válido.`
    );
  }

  const pageCount: number = pdf.numPages;
  if (pageCount < 1) {
    throw new Error('O PDF não possui páginas.');
  }

  onProgress?.({
    percent: 12,
    message: `Preparando compressão (${pageCount} página${pageCount === 1 ? '' : 's'})…`,
    totalPages: pageCount,
  });

  const outDoc = await PDFDocument.create();
  const { jpegQuality, scale } = preset;

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const percent = 12 + Math.round((pageNum / pageCount) * 80);
    onProgress?.({
      percent,
      message: `Comprimindo página ${pageNum} de ${pageCount}…`,
      currentPage: pageNum,
      totalPages: pageCount,
    });

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      throw new Error('Canvas 2D indisponível neste navegador.');
    }

    // Fundo branco (evita transparência preta no JPEG)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport,
      canvas,
    }).promise;

    // Raster → JPEG com qualidade do nível escolhido
    const dataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
    const jpegBytes = dataUrlToBytes(dataUrl);
    const image = await outDoc.embedJpg(jpegBytes);

    // Tamanho da página em pontos PDF (72 DPI): divide pelo scale de render
    const pageWidth = viewport.width / scale;
    const pageHeight = viewport.height / scale;
    const pdfPage = outDoc.addPage([pageWidth, pageHeight]);
    pdfPage.drawImage(image, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    });

    // Libera memória do canvas o quanto antes
    canvas.width = 0;
    canvas.height = 0;
  }

  onProgress?.({
    percent: 95,
    message: 'Gerando arquivo final…',
    totalPages: pageCount,
  });

  const bytes = await outDoc.save({ useObjectStreams: true });
  const compressedSize = bytes.byteLength;
  const reductionPercent =
    originalSize > 0
      ? Math.round(((originalSize - compressedSize) / originalSize) * 1000) / 10
      : 0;

  onProgress?.({
    percent: 100,
    message: 'Concluído!',
    totalPages: pageCount,
  });

  return {
    bytes,
    originalSize,
    compressedSize,
    reductionPercent,
    pageCount,
    level,
  };
}
