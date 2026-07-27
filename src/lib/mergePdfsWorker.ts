import type { ProgressCallback } from './mergePdfs';
import { mergePdfFiles } from './mergePdfs';
import type {
  PdfWorkerMergeRequest,
  PdfWorkerOutbound,
} from '../workers/pdfWorker';

/**
 * Junta PDFs preferencialmente em Web Worker (Vite `?worker`).
 * Se o Worker falhar ao carregar/rodar, faz fallback para a UI thread.
 */
export async function mergePdfFilesPreferWorker(
  files: File[],
  onProgress?: ProgressCallback
): Promise<Uint8Array> {
  if (typeof Worker === 'undefined') {
    return mergePdfFiles(files, onProgress);
  }

  try {
    return await mergePdfFilesInWorker(files, onProgress);
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn(
        '[mergePdfsWorker] Worker indisponível — fallback na UI thread.',
        err
      );
    }
    return mergePdfFiles(files, onProgress);
  }
}

async function mergePdfFilesInWorker(
  files: File[],
  onProgress?: ProgressCallback
): Promise<Uint8Array> {
  const PdfWorkerCtor = (
    await import('../workers/pdfWorker?worker')
  ).default as new () => Worker;

  const worker = new PdfWorkerCtor();
  const id = `merge-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const buffers: ArrayBuffer[] = [];
  const names: string[] = [];

  for (let i = 0; i < files.length; i++) {
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

  const request: PdfWorkerMergeRequest = {
    type: 'merge',
    id,
    files: buffers,
    names,
  };

  return new Promise<Uint8Array>((resolve, reject) => {
    const cleanup = () => {
      worker.onmessage = null;
      worker.onerror = null;
      worker.terminate();
    };

    worker.onmessage = (event: MessageEvent<PdfWorkerOutbound>) => {
      const msg = event.data;
      if (!msg || msg.id !== id) return;

      if (msg.type === 'progress') {
        onProgress?.({
          percent: msg.percent,
          current: msg.current,
          total: msg.total,
          message: msg.message,
        });
        return;
      }

      if (msg.type === 'error') {
        cleanup();
        reject(new Error(msg.message));
        return;
      }

      if (msg.type === 'result') {
        const bytes = new Uint8Array(msg.bytes);
        cleanup();
        resolve(bytes);
      }
    };

    worker.onerror = (ev) => {
      cleanup();
      reject(new Error(ev.message || 'Erro no Web Worker de PDF.'));
    };

    // Transfere ownership dos buffers (zero-copy) para o worker
    worker.postMessage(request, buffers);
  });
}
