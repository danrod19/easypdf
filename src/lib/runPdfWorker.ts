/**
 * Helper genérico: executa ops pdf-lib no Web Worker com AbortSignal + fallback.
 */

import type {
  PdfWorkerOutbound,
  PdfWorkerRequest,
} from '../workers/pdfWorker';

export type PdfWorkerProgress = {
  percent: number;
  current: number;
  total: number;
  message: string;
};

export type PdfWorkerProgressCallback = (p: PdfWorkerProgress) => void;

function abortError(): DOMException {
  return new DOMException('Processamento cancelado.', 'AbortError');
}

function isAbort(err: unknown): boolean {
  return (
    (err instanceof DOMException && err.name === 'AbortError') ||
    (err instanceof Error && err.name === 'AbortError')
  );
}

/**
 * Roda um job no pdfWorker e devolve os bytes do PDF resultante.
 * Em falha de worker (exceto abort), o caller deve fazer fallback na main thread.
 */
export async function runPdfWorkerJob(
  buildRequest: (id: string) => {
    request: PdfWorkerRequest;
    transfer?: Transferable[];
  },
  onProgress?: PdfWorkerProgressCallback,
  signal?: AbortSignal
): Promise<Uint8Array> {
  if (signal?.aborted) throw abortError();
  if (typeof Worker === 'undefined') {
    throw new Error('Web Worker indisponível');
  }

  const PdfWorkerCtor = (
    await import('../workers/pdfWorker?worker')
  ).default as new () => Worker;

  if (signal?.aborted) throw abortError();

  const worker = new PdfWorkerCtor();
  const id = `pdfop-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const { request, transfer = [] } = buildRequest(id);

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

    const onAbort = () => fail(abortError());

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

    worker.postMessage(request, transfer);
  });
}

export { isAbort };
