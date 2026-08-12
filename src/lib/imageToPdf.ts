import { PDFDocument } from 'pdf-lib';
import { downloadBlob } from './format';

export interface ImageToPdfProgress {
  /** 0–100 */
  percent: number;
  message: string;
  current: number;
  total: number;
}

export type ImageToPdfProgressCallback = (
  progress: ImageToPdfProgress
) => void;

/** MIME types aceitos (JPG/PNG prioritários; WebP convertido para PNG). */
export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export type ImageMimeType = (typeof IMAGE_MIME_TYPES)[number];

/** accept do <input type="file"> — foco em PNG/JPG/JPEG */
const IMAGE_ACCEPT_ATTR =
  'image/jpeg,image/png,image/jpg,.jpg,.jpeg,.png';

export function getImageAcceptAttr(): string {
  return IMAGE_ACCEPT_ATTR;
}

/**
 * Aceita JPEG e PNG (MIME e/ou extensão).
 * WebP ainda é aceito por compatibilidade e convertido antes do embed.
 */
export function isSupportedImageFile(file: File): boolean {
  const type = (file.type || '').toLowerCase();
  if (
    type === 'image/jpeg' ||
    type === 'image/png' ||
    type === 'image/webp' ||
    type === 'image/jpg'
  ) {
    return true;
  }

  if (!type || type === 'application/octet-stream') {
    const name = file.name.toLowerCase();
    return (
      name.endsWith('.jpg') ||
      name.endsWith('.jpeg') ||
      name.endsWith('.png') ||
      name.endsWith('.webp')
    );
  }

  return false;
}

function isPngFile(file: File): boolean {
  const type = (file.type || '').toLowerCase();
  if (type === 'image/png') return true;
  return file.name.toLowerCase().endsWith('.png');
}

function isJpegFile(file: File): boolean {
  const type = (file.type || '').toLowerCase();
  if (type === 'image/jpeg' || type === 'image/jpg') return true;
  const name = file.name.toLowerCase();
  return name.endsWith('.jpg') || name.endsWith('.jpeg');
}

function isWebpFile(file: File): boolean {
  const type = (file.type || '').toLowerCase();
  if (type === 'image/webp') return true;
  return file.name.toLowerCase().endsWith('.webp');
}

/**
 * Converte WebP (ou formatos sem embed nativo) em PNG via canvas.
 */
async function convertToPngBytes(file: File): Promise<Uint8Array> {
  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D indisponível neste navegador.');
    }
    ctx.drawImage(bitmap, 0, 0);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Falha ao exportar PNG.'))),
        'image/png'
      );
    });
    return new Uint8Array(await blob.arrayBuffer());
  } finally {
    bitmap?.close();
  }
}

/** Nome padrão do download. */
export function imagesToPdfFileName(): string {
  return 'imagens-convertidas.pdf';
}

/**
 * Converte 1..N imagens em um único PDF com pdf-lib (100% client-side).
 *
 * Abordagem de página: **dimensões exatas da imagem** (não A4).
 * Cada imagem vira uma página com width/height = tamanho nativo embutido,
 * desenhada em (0,0) cobrindo a página inteira — sem letterbox nem escala
 * para folha padrão. Preserva proporção e nitidez do arquivo original.
 *
 * Fluxo por imagem:
 * 1. Lê ArrayBuffer
 * 2. embedJpg / embedPng (WebP → PNG via canvas)
 * 3. addPage([width, height])
 * 4. drawImage na página
 */
function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException('Processamento cancelado.', 'AbortError');
  }
}

export async function convertImagesToPdf(
  files: File[],
  onProgress?: ImageToPdfProgressCallback,
  signal?: AbortSignal
): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error('Adicione pelo menos 1 imagem para converter.');
  }

  for (const file of files) {
    if (!isSupportedImageFile(file)) {
      throw new Error(
        `"${file.name}" não é uma imagem suportada. Use JPEG ou PNG.`
      );
    }
  }

  throwIfAborted(signal);
  const total = files.length;
  onProgress?.({
    percent: 5,
    message: 'Criando documento PDF…',
    current: 0,
    total,
  });

  // 1) Novo documento vazio
  const pdfDoc = await PDFDocument.create();

  // 2) Itera na ordem definida pelo usuário
  for (let i = 0; i < total; i++) {
    throwIfAborted(signal);
    const file = files[i];
    const n = i + 1;

    onProgress?.({
      percent: Math.round((i / total) * 85) + 8,
      message: `Embutindo imagem ${n} de ${total}…`,
      current: n,
      total,
    });

    let bytes: ArrayBuffer;
    try {
      bytes = await file.arrayBuffer();
    } catch {
      throwIfAborted(signal);
      throw new Error(`Não foi possível ler o arquivo "${file.name}".`);
    }

    // 3) Embed conforme tipo
    let embedded;
    try {
      if (isJpegFile(file)) {
        embedded = await pdfDoc.embedJpg(bytes);
      } else if (isPngFile(file)) {
        embedded = await pdfDoc.embedPng(bytes);
      } else if (isWebpFile(file)) {
        const pngBytes = await convertToPngBytes(file);
        throwIfAborted(signal);
        embedded = await pdfDoc.embedPng(pngBytes);
      } else {
        throw new Error(`Formato não suportado: "${file.name}".`);
      }
    } catch (err) {
      if (
        (err instanceof DOMException && err.name === 'AbortError') ||
        (err instanceof Error && err.name === 'AbortError')
      ) {
        throw err;
      }
      if (err instanceof Error && err.message.includes('não suportado')) {
        throw err;
      }
      throw new Error(
        `Falha ao embutir "${file.name}". Verifique se o arquivo não está corrompido (use JPEG ou PNG).`
      );
    }

    const { width, height } = embedded.scale(1);
    if (width < 1 || height < 1) {
      throw new Error(`A imagem "${file.name}" possui dimensões inválidas.`);
    }

    // 4) Página = tamanho da imagem + drawImage em tela cheia
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(embedded, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  throwIfAborted(signal);
  onProgress?.({
    percent: 95,
    message: 'Gerando arquivo final…',
    current: total,
    total,
  });

  // 5) Serializa PDF
  const pdfBytes = await pdfDoc.save();
  throwIfAborted(signal);

  onProgress?.({
    percent: 100,
    message: 'Concluído!',
    current: total,
    total,
  });

  return pdfBytes;
}

/**
 * Converte e dispara o download de imagens-convertidas.pdf.
 */
export async function convertAndDownloadImagesToPdf(
  files: File[],
  onProgress?: ImageToPdfProgressCallback,
  signal?: AbortSignal
): Promise<void> {
  const bytes = await convertImagesToPdf(files, onProgress, signal);
  throwIfAborted(signal);
  const blob = new Blob([new Uint8Array(bytes)], {
    type: 'application/pdf',
  });
  downloadBlob(blob, imagesToPdfFileName());
}
