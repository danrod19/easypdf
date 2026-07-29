/**
 * Web Worker (Vite) — operações pdf-lib fora da UI thread.
 *
 * Ops: merge | rotate | split
 * Compressão (pdf.js + canvas) permanece na main thread.
 *
 * Instanciar: import PdfWorker from '../workers/pdfWorker?worker'
 * Helper: src/lib/runPdfWorker.ts
 */

import { PDFDocument, degrees } from 'pdf-lib';

// —— Types (request / response) ——

export type PdfWorkerMergeRequest = {
  type: 'merge';
  id: string;
  files: ArrayBuffer[];
  names?: string[];
};

export type PdfWorkerRotateRequest = {
  type: 'rotate';
  id: string;
  file: ArrayBuffer;
  /** Graus adicionais por página (0-based index) */
  rotations: number[];
};

export type PdfWorkerSplitRequest = {
  type: 'split';
  id: string;
  file: ArrayBuffer;
  /** Índices 0-based a copiar */
  pageIndices: number[];
};

export type PdfWorkerRequest =
  | PdfWorkerMergeRequest
  | PdfWorkerRotateRequest
  | PdfWorkerSplitRequest;

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

function toTransferableAb(pdfBytes: Uint8Array): ArrayBuffer {
  return pdfBytes.buffer.slice(
    pdfBytes.byteOffset,
    pdfBytes.byteOffset + pdfBytes.byteLength
  ) as ArrayBuffer;
}

function normalizeAngle(angle: number): number {
  const n = ((Math.round(angle) % 360) + 360) % 360;
  return (Math.round(n / 90) * 90) % 360;
}

// —— Merge ——

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
  const ab = toTransferableAb(pdfBytes);

  post({
    type: 'progress',
    id,
    percent: 100,
    current: total,
    total,
    message: 'Concluído!',
  });

  post({ type: 'result', id, bytes: ab }, [ab]);
}

// —— Rotate ——

async function rotatePdf(
  id: string,
  file: ArrayBuffer,
  rotations: number[]
): Promise<void> {
  post({
    type: 'progress',
    id,
    percent: 15,
    current: 0,
    total: 1,
    message: 'Carregando documento…',
  });

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(file, { ignoreEncryption: false });
  } catch {
    post({
      type: 'error',
      id,
      message:
        'O arquivo não é um PDF válido ou está protegido por senha.',
    });
    return;
  }

  const pages = doc.getPages();
  const pageCount = pages.length;

  if (rotations.length !== pageCount) {
    post({
      type: 'error',
      id,
      message: `Estado de rotação inconsistente (${rotations.length} vs ${pageCount} páginas). Recarregue o arquivo.`,
    });
    return;
  }

  post({
    type: 'progress',
    id,
    percent: 55,
    current: 0,
    total: pageCount,
    message: `Aplicando rotação em ${pageCount} página${pageCount === 1 ? '' : 's'}…`,
  });

  for (let i = 0; i < pageCount; i++) {
    const page = pages[i];
    const current = page.getRotation().angle;
    const delta = rotations[i] ?? 0;
    if (delta === 0) continue;
    const next = normalizeAngle(current + delta);
    page.setRotation(degrees(next));
  }

  post({
    type: 'progress',
    id,
    percent: 90,
    current: pageCount,
    total: pageCount,
    message: 'Gerando arquivo final…',
  });

  const pdfBytes = await doc.save();
  const ab = toTransferableAb(pdfBytes);

  post({
    type: 'progress',
    id,
    percent: 100,
    current: pageCount,
    total: pageCount,
    message: 'Concluído!',
  });

  post({ type: 'result', id, bytes: ab }, [ab]);
}

// —— Split / extract pages ——

async function splitPdf(
  id: string,
  file: ArrayBuffer,
  pageIndices: number[]
): Promise<void> {
  if (pageIndices.length === 0) {
    post({
      type: 'error',
      id,
      message: 'Nenhuma página selecionada para extrair.',
    });
    return;
  }

  post({
    type: 'progress',
    id,
    percent: 20,
    current: 0,
    total: pageIndices.length,
    message: 'Carregando documento…',
  });

  let src: PDFDocument;
  try {
    src = await PDFDocument.load(file, { ignoreEncryption: false });
  } catch {
    post({
      type: 'error',
      id,
      message:
        'O arquivo não é um PDF válido ou está protegido por senha.',
    });
    return;
  }

  const pageCount = src.getPageCount();
  for (const idx of pageIndices) {
    if (idx < 0 || idx >= pageCount) {
      post({
        type: 'error',
        id,
        message: `Índice de página inválido (${idx + 1}). O PDF tem ${pageCount} página${pageCount === 1 ? '' : 's'}.`,
      });
      return;
    }
  }

  post({
    type: 'progress',
    id,
    percent: 55,
    current: 0,
    total: pageIndices.length,
    message: `Copiando ${pageIndices.length} página${pageIndices.length === 1 ? '' : 's'}…`,
  });

  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, pageIndices);
  copied.forEach((page) => out.addPage(page));

  post({
    type: 'progress',
    id,
    percent: 90,
    current: pageIndices.length,
    total: pageIndices.length,
    message: 'Gerando arquivo final…',
  });

  const pdfBytes = await out.save();
  const ab = toTransferableAb(pdfBytes);

  post({
    type: 'progress',
    id,
    percent: 100,
    current: pageIndices.length,
    total: pageIndices.length,
    message: 'Concluído!',
  });

  post({ type: 'result', id, bytes: ab }, [ab]);
}

// —— Dispatcher ——

ctx.onmessage = (event: MessageEvent<PdfWorkerRequest>) => {
  const data = event.data;
  if (!data || !data.id || !data.type) return;

  const run = async () => {
    switch (data.type) {
      case 'merge':
        await mergePdfs(data.id, data.files, data.names);
        break;
      case 'rotate':
        await rotatePdf(data.id, data.file, data.rotations);
        break;
      case 'split':
        await splitPdf(data.id, data.file, data.pageIndices);
        break;
      default:
        post({
          type: 'error',
          id: (data as { id: string }).id,
          message: 'Operação desconhecida no worker de PDF.',
        });
    }
  };

  void run().catch((err: unknown) => {
    const message =
      err instanceof Error
        ? err.message
        : 'Falha inesperada no worker de PDF.';
    post({ type: 'error', id: data.id, message });
  });
};
