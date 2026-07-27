/**
 * Web Worker (Vite) — merge de PDFs com pdf-lib fora da UI thread.
 *
 * Instanciar no app:
 *   import PdfWorker from '../workers/pdfWorker?worker'
 *   const worker = new PdfWorker()
 *
 * Ou via helper: src/lib/mergePdfsWorker.ts
 */

import { PDFDocument } from 'pdf-lib';

export type PdfWorkerMergeRequest = {
  type: 'merge';
  id: string;
  /** Conteúdo de cada PDF (ArrayBuffer transferível). */
  files: ArrayBuffer[];
  /** Nomes opcionais (mensagens de progresso / erros). */
  names?: string[];
};

export type PdfWorkerProgressMessage = {
  type: 'progress';
  id: string;
  percent: number;
  current: number;
  total: number;
  message: string;
};

export type PdfWorkerResultMessage = {
  type: 'result';
  id: string;
  bytes: ArrayBuffer;
};

export type PdfWorkerErrorMessage = {
  type: 'error';
  id: string;
  message: string;
};

export type PdfWorkerOutbound =
  | PdfWorkerProgressMessage
  | PdfWorkerResultMessage
  | PdfWorkerErrorMessage;

/** Escopo do Worker (evita depender de lib DOM "webworker" no tsconfig). */
const ctx = self as unknown as {
  postMessage: (message: unknown, transfer?: Transferable[]) => void;
  onmessage: ((event: MessageEvent) => void) | null;
};

function post(msg: PdfWorkerOutbound, transfer?: Transferable[]): void {
  if (transfer?.length) {
    ctx.postMessage(msg, transfer);
  } else {
    ctx.postMessage(msg);
  }
}

async function mergePdfs(
  id: string,
  files: ArrayBuffer[],
  names: string[] = []
): Promise<void> {
  if (files.length < 2) {
    post({
      type: 'error',
      id,
      message: 'Selecione pelo menos 2 arquivos PDF para juntar.',
    });
    return;
  }

  const total = files.length;
  const merged = await PDFDocument.create();

  for (let i = 0; i < total; i++) {
    const name = names[i] || `arquivo-${i + 1}.pdf`;

    post({
      type: 'progress',
      id,
      percent: Math.round((i / total) * 90),
      current: i + 1,
      total,
      message: `Lendo ${name}…`,
    });

    let src: PDFDocument;
    try {
      src = await PDFDocument.load(files[i], { ignoreEncryption: false });
    } catch {
      post({
        type: 'error',
        id,
        message: `O arquivo "${name}" não é um PDF válido ou está protegido por senha.`,
      });
      return;
    }

    post({
      type: 'progress',
      id,
      percent: Math.round(((i + 0.5) / total) * 90),
      current: i + 1,
      total,
      message: `Copiando páginas de ${name}…`,
    });

    const pageIndices = src.getPageIndices();
    const copied = await merged.copyPages(src, pageIndices);
    copied.forEach((page) => merged.addPage(page));
  }

  post({
    type: 'progress',
    id,
    percent: 95,
    current: total,
    total,
    message: 'Gerando arquivo final…',
  });

  const pdfBytes = await merged.save();
  // Cópia em ArrayBuffer “puro” para transferir sem detach do buffer do TypedArray
  const ab = pdfBytes.buffer.slice(
    pdfBytes.byteOffset,
    pdfBytes.byteOffset + pdfBytes.byteLength
  ) as ArrayBuffer;

  post(
    {
      type: 'progress',
      id,
      percent: 100,
      current: total,
      total,
      message: 'Concluído!',
    }
  );

  post({ type: 'result', id, bytes: ab }, [ab]);
}

ctx.onmessage = (event: MessageEvent<PdfWorkerMergeRequest>) => {
  const data = event.data;
  if (!data || data.type !== 'merge') return;

  void mergePdfs(data.id, data.files, data.names).catch((err: unknown) => {
    const message =
      err instanceof Error
        ? err.message
        : 'Falha inesperada no worker ao juntar PDFs.';
    post({ type: 'error', id: data.id, message });
  });
};
