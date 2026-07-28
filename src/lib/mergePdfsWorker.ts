import type { ProgressCallback } from './mergePdfs';
import { mergePdfFiles } from './mergePdfs';
import type {
  PdfWorkerMergeRequest,
  PdfWorkerOutbound,
} from '../workers/pdfWorker';

/**
 * Junta PDFs preferencialmente em Web Worker (Vite `?worker`).
 * Se o Worker falhar ao carregar/rodar, faz fallback para a UI thread.
 * `signal` permite cancelar (terminate) ao desmontar a página.
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
    return await mergePdfFilesInWorker(files, onProgress, signal);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
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

async function mergePdfFilesInWorker(
  files: File[],
  onProgress?: ProgressCallback,
  signal?: AbortSignal
): Promise<Uint8Array> {
  const PdfWorkerCtor = (
    await import('../workers/pdfWorker?worker')
  ).default as new () => Worker;

  if (signal?.aborted) {
    throw new DOMException('Processamento cancelado.', 'AbortError');
  }

  const worker = new PdfWorkerCtor();
  const id = `merge-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const buffers: ArrayBuffer[] = [];
  const names: string[] = [];

  for (let i = 0; i < files.length; i++) {
    if (signal?.aborted) {
      worker.terminate();
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

  const request: PdfWorkerMergeRequest = {
    type: 'merge',
    id,
    files: buffers,
    names,
  };

  return new Promise<Uint8Array>((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      worker.onmessage = null;
      worker.onerror = null;
      signal?.removeEventListener('abort', onAbort);
      try {
        worker.terminate();
      } catch {
        // ignore
      }
    };

    const fail = (err: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(err);
    };

    const succeed = (bytes: Uint8Array) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(bytes);
    };

    const onAbort = () => {
      fail(new DOMException('Processamento cancelado.', 'AbortError'));
    };

    if (signal?.aborted) {
      onAbort();
      return;
    }
    signal?.addEventListener('abort', onAbort, { once: true });

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
        fail(new Error(msg.message));
        return;
      }

      if (msg.type === 'result') {
        succeed(new Uint8Array(msg.bytes));
      }
    };

    worker.onerror = (ev) => {
      fail(new Error(ev.message || 'Erro no Web Worker de PDF.'));
    };

    // Transfere ownership dos buffers (zero-copy) para o worker
    worker.postMessage(request, buffers);
  });
}
