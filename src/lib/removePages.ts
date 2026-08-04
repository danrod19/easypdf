import { PDFDocument } from 'pdf-lib';
import { loadPdfJs } from './pdfjsLoader';
import { getPdfPageCount } from './splitPdf';

export { getPdfPageCount };

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException('Processamento cancelado.', 'AbortError');
  }
}

export interface RemovePagesProgress {
  /** 0–100 */
  percent: number;
  message: string;
}

export type RemovePagesProgressCallback = (
  progress: RemovePagesProgress
) => void;

export interface PageThumbnail {
  /** Índice 0-based da página no PDF original */
  index: number;
  /** Data URL JPEG da miniatura */
  dataUrl: string;
  /** Número exibido (1-based) */
  pageNumber: number;
}

/**
 * Nome sugerido para o download após remoção de páginas.
 */
export function removedPagesFileName(originalName: string): string {
  const stamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, '-');
  const base = originalName.replace(/\.pdf$/i, '') || 'documento';
  return `${base}-sem-paginas-${stamp}.pdf`;
}

/**
 * Gera miniaturas de todas as páginas com pdfjs-dist (client-side).
 * `signal` cancela entre páginas (ex.: unmount / troca de rota).
 */
export async function generatePageThumbnails(
  file: File,
  onProgress?: RemovePagesProgressCallback,
  signal?: AbortSignal
): Promise<PageThumbnail[]> {
  throwIfAborted(signal);
  onProgress?.({ percent: 5, message: 'Carregando visualizador…' });

  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    throw new Error(`Não foi possível ler o arquivo "${file.name}".`);
  }

  throwIfAborted(signal);
  const pdfjs = await loadPdfJs();
  onProgress?.({ percent: 15, message: 'Abrindo PDF…' });

  let pdf: Awaited<ReturnType<typeof pdfjs.getDocument>['promise']>;
  try {
    pdf = await pdfjs.getDocument({ data: new Uint8Array(bytes) }).promise;
  } catch {
    throw new Error(
      `Não foi possível abrir "${file.name}" para pré-visualização.`
    );
  }

  const pageCount = pdf.numPages;
  if (pageCount < 1) {
    throw new Error('O PDF não possui páginas.');
  }

  const thumbs: PageThumbnail[] = [];
  const maxWidth = 160;

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    throwIfAborted(signal);
    const percent = 15 + Math.round((pageNum / pageCount) * 80);
    onProgress?.({
      percent,
      message: `Gerando miniaturas… ${pageNum}/${pageCount}`,
    });

    try {
      const page = await pdf.getPage(pageNum);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = maxWidth / baseViewport.width;
      const viewport = page.getViewport({ scale: Math.min(scale, 1.2) });

      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D indisponível.');
      }

      await page.render({
        canvasContext: ctx,
        viewport,
        canvas,
      }).promise;

      thumbs.push({
        index: pageNum - 1,
        pageNumber: pageNum,
        dataUrl: canvas.toDataURL('image/jpeg', 0.72),
      });
    } catch {
      // Placeholder se a renderização falhar (página corrompida, etc.)
      thumbs.push({
        index: pageNum - 1,
        pageNumber: pageNum,
        dataUrl: '',
      });
    }
  }

  onProgress?.({ percent: 100, message: 'Miniaturas prontas.' });
  return thumbs;
}

/**
 * Remove páginas do PDF com pdf-lib.
 *
 * `indicesToRemove` é 0-based. O loop remove de trás para frente
 * para não invalidar os índices restantes.
 * Exige que ao menos 1 página permaneça no documento final.
 */
export async function removePagesFromPdf(
  file: File,
  indicesToRemove: number[],
  onProgress?: RemovePagesProgressCallback,
  signal?: AbortSignal
): Promise<Uint8Array> {
  throwIfAborted(signal);
  if (indicesToRemove.length === 0) {
    throw new Error(
      'Marque pelo menos uma página para remover (ícone de lixeira na miniatura).'
    );
  }

  onProgress?.({ percent: 10, message: `Lendo ${file.name}…` });

  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    throw new Error(`Não foi possível ler o arquivo "${file.name}".`);
  }

  throwIfAborted(signal);
  onProgress?.({ percent: 30, message: 'Carregando documento…' });

  let pdfDoc: PDFDocument;
  try {
    pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: false });
  } catch {
    throw new Error(
      `O arquivo "${file.name}" não é um PDF válido ou está protegido por senha.`
    );
  }

  const pageCount = pdfDoc.getPageCount();
  if (pageCount < 1) {
    throw new Error('O PDF não possui páginas.');
  }

  const unique = [...new Set(indicesToRemove)].sort((a, b) => b - a);

  for (const idx of unique) {
    if (idx < 0 || idx >= pageCount) {
      throw new Error(
        `Página ${idx + 1} inválida. O PDF tem ${pageCount} página${pageCount === 1 ? '' : 's'}.`
      );
    }
  }

  if (unique.length >= pageCount) {
    throw new Error(
      'Não é possível remover todas as páginas. Mantenha ao menos uma no PDF final.'
    );
  }

  throwIfAborted(signal);
  onProgress?.({
    percent: 50,
    message: `Removendo ${unique.length} página${unique.length === 1 ? '' : 's'}…`,
  });

  // De trás para frente: removePage não desloca índices menores
  for (const idx of unique) {
    throwIfAborted(signal);
    pdfDoc.removePage(idx);
  }

  throwIfAborted(signal);
  onProgress?.({ percent: 90, message: 'Gerando novo PDF…' });

  const out = await pdfDoc.save();

  onProgress?.({ percent: 100, message: 'Concluído!' });
  return out;
}
