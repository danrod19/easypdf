import type { ProgressCallback } from './mergePdfs';
import { mergePdfFiles } from './mergePdfs';
import { isAbort, runPdfWorkerJob } from './runPdfWorker';

/**
 * Junta PDFs preferencialmente em Web Worker.
 * Fallback na UI thread se o Worker falhar (exceto abort).
 */
export async function mergePdfFilesPreferWorker(
  files: File[],
  onProgress?: ProgressCallback,
  signal?: AbortSignal
): Promise<Uint8Array> {
  if (signal?.aborted) {
    throw new DOMException('Processamento cancelado.', 'AbortError');
  }

  if (typeof Worker === 'undefined') {
    return mergePdfFiles(files, onProgress);
  }

  try {
    const buffers: ArrayBuffer[] = [];
    const names: string[] = [];

    for (let i = 0; i < files.length; i++) {
      if (signal?.aborted) {
        throw new DOMException('Processamento cancelado.', 'AbortError');
      }
      const file = files[i];
      names.push(file.name);
      onProgress?.({
        percent: Math.round((i / files.length) * 5),
        current: i + 1,
        total: files.length,
        message: `Preparando ${file.name}…`,
      });
      buffers.push(await file.arrayBuffer());
    }

    return await runPdfWorkerJob(
      (id) => ({
        request: {
          type: 'merge',
          id,
          files: buffers,
          names,
        },
        transfer: buffers,
      }),
      (p) =>
        onProgress?.({
          percent: p.percent,
          current: p.current,
          total: p.total,
          message: p.message,
        }),
      signal
    );
  } catch (err) {
    if (isAbort(err)) throw err;
    if (signal?.aborted) {
      throw new DOMException('Processamento cancelado.', 'AbortError');
    }
    if (import.meta.env.DEV) {
      console.warn(
        '[mergePdfsWorker] Worker indisponível — fallback na UI thread.',
        err
      );
    }
    return mergePdfFiles(files, onProgress);
  }
}
