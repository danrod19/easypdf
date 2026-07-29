/**
 * Ops pdf-lib pesadas via Worker: rotate + split (fallback main thread).
 *
 * Compressão **não** entra aqui: `compressPdf` usa pdf.js + Canvas 2D no DOM
 * (main thread). Abort cooperativo via `AbortSignal` entre páginas.
 *
 * Uso: páginas Girar / Dividir passam `signal` de AbortController (unmount → abort → terminate worker).
 */

import {
  applyRotationsToPdf,
  type RotateProgressCallback,
} from './rotatePdf';
import {
  extractPdfPages,
  type SplitProgressCallback,
} from './splitPdf';
import { isAbort, runPdfWorkerJob } from './runPdfWorker';

/**
 * Aplica rotações preferencialmente no Worker.
 */
export async function applyRotationsPreferWorker(
  file: File,
  rotations: number[],
  onProgress?: RotateProgressCallback,
  signal?: AbortSignal
): Promise<Uint8Array> {
  if (signal?.aborted) {
    throw new DOMException('Processamento cancelado.', 'AbortError');
  }

  if (typeof Worker === 'undefined') {
    return applyRotationsToPdf(file, rotations, onProgress);
  }

  try {
    if (signal?.aborted) {
      throw new DOMException('Processamento cancelado.', 'AbortError');
    }
    const buffer = await file.arrayBuffer();
    // Cópia: não transferir o buffer se o fallback precisar do File original
    // (File ainda é válido; arrayBuffer já materializou)

    return await runPdfWorkerJob(
      (id) => ({
        request: {
          type: 'rotate',
          id,
          file: buffer,
          rotations,
        },
        // Não transferimos o buffer para permitir fallback com o mesmo File
        transfer: [],
      }),
      (p) => onProgress?.({ percent: p.percent, message: p.message }),
      signal
    );
  } catch (err) {
    if (isAbort(err)) throw err;
    if (signal?.aborted) {
      throw new DOMException('Processamento cancelado.', 'AbortError');
    }
    if (import.meta.env.DEV) {
      console.warn(
        '[pdfOpsWorker] rotate worker falhou — fallback main thread.',
        err
      );
    }
    return applyRotationsToPdf(file, rotations, onProgress);
  }
}

/**
 * Extrai páginas preferencialmente no Worker.
 */
export async function extractPdfPagesPreferWorker(
  file: File,
  pageIndices: number[],
  onProgress?: SplitProgressCallback,
  signal?: AbortSignal
): Promise<Uint8Array> {
  if (signal?.aborted) {
    throw new DOMException('Processamento cancelado.', 'AbortError');
  }

  if (typeof Worker === 'undefined') {
    return extractPdfPages(file, pageIndices, onProgress);
  }

  try {
    const buffer = await file.arrayBuffer();

    return await runPdfWorkerJob(
      (id) => ({
        request: {
          type: 'split',
          id,
          file: buffer,
          pageIndices,
        },
        transfer: [],
      }),
      (p) => onProgress?.({ percent: p.percent, message: p.message }),
      signal
    );
  } catch (err) {
    if (isAbort(err)) throw err;
    if (signal?.aborted) {
      throw new DOMException('Processamento cancelado.', 'AbortError');
    }
    if (import.meta.env.DEV) {
      console.warn(
        '[pdfOpsWorker] split worker falhou — fallback main thread.',
        err
      );
    }
    return extractPdfPages(file, pageIndices, onProgress);
  }
}
