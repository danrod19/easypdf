import { PDFDocument } from 'pdf-lib';

export interface SplitProgress {
  /** 0–100 */
  percent: number;
  message: string;
}

export type SplitProgressCallback = (progress: SplitProgress) => void;

/**
 * Converte uma string de intervalos (1-based, como "1, 3-5, 8")
 * em índices 0-based únicos, na ordem informada pelo usuário.
 *
 * Aceita:
 * - páginas isoladas: `1`, `8`
 * - intervalos inclusivos: `3-5`, `10 - 12`
 * - combinação: `1, 3-5, 8`
 */
export function parsePageRange(input: string, pageCount: number): number[] {
  if (pageCount < 1) {
    throw new Error('O PDF não possui páginas.');
  }

  const raw = input.trim();
  if (!raw) {
    throw new Error(
      'Informe o intervalo de páginas (ex.: 1, 3-5, 8).'
    );
  }

  const parts = raw.split(',');
  const indices: number[] = [];
  const seen = new Set<number>();

  for (const part of parts) {
    const token = part.trim();
    if (!token) continue;

    const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      let start = Number(rangeMatch[1]);
      let end = Number(rangeMatch[2]);

      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        throw new Error(`Intervalo inválido: "${token}".`);
      }

      // Normaliza 5-3 → 3-5
      if (start > end) {
        const tmp = start;
        start = end;
        end = tmp;
      }

      if (start < 1 || end > pageCount) {
        throw new Error(
          `O intervalo "${token}" está fora do PDF (1–${pageCount}).`
        );
      }

      for (let page = start; page <= end; page++) {
        const idx = page - 1;
        if (!seen.has(idx)) {
          seen.add(idx);
          indices.push(idx);
        }
      }
      continue;
    }

    const singleMatch = token.match(/^(\d+)$/);
    if (singleMatch) {
      const page = Number(singleMatch[1]);
      if (!Number.isInteger(page) || page < 1) {
        throw new Error(`Número de página inválido: "${token}".`);
      }
      if (page > pageCount) {
        throw new Error(
          `A página ${page} não existe. O PDF tem ${pageCount} página${pageCount === 1 ? '' : 's'}.`
        );
      }
      const idx = page - 1;
      if (!seen.has(idx)) {
        seen.add(idx);
        indices.push(idx);
      }
      continue;
    }

    throw new Error(
      `Formato inválido: "${token}". Use números e intervalos, ex.: 1, 3-5, 8.`
    );
  }

  if (indices.length === 0) {
    throw new Error(
      'Informe o intervalo de páginas (ex.: 1, 3-5, 8).'
    );
  }

  return indices;
}

/**
 * Lê um PDF e devolve a quantidade de páginas (client-side).
 */
export async function getPdfPageCount(file: File): Promise<number> {
  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    throw new Error(`Não foi possível ler o arquivo "${file.name}".`);
  }

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(bytes, { ignoreEncryption: false });
  } catch {
    throw new Error(
      `O arquivo "${file.name}" não é um PDF válido ou está protegido por senha.`
    );
  }

  return doc.getPageCount();
}

/**
 * Extrai páginas de um PDF e gera um novo documento com pdf-lib.
 * `pageIndices` deve ser 0-based (use parsePageRange).
 */
export async function extractPdfPages(
  file: File,
  pageIndices: number[],
  onProgress?: SplitProgressCallback
): Promise<Uint8Array> {
  if (pageIndices.length === 0) {
    throw new Error('Nenhuma página selecionada para extrair.');
  }

  onProgress?.({ percent: 10, message: `Lendo ${file.name}…` });

  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    throw new Error(`Não foi possível ler o arquivo "${file.name}".`);
  }

  onProgress?.({ percent: 30, message: 'Carregando documento…' });

  let src: PDFDocument;
  try {
    src = await PDFDocument.load(bytes, { ignoreEncryption: false });
  } catch {
    throw new Error(
      `O arquivo "${file.name}" não é um PDF válido ou está protegido por senha.`
    );
  }

  const pageCount = src.getPageCount();
  for (const idx of pageIndices) {
    if (idx < 0 || idx >= pageCount) {
      throw new Error(
        `Índice de página inválido (${idx + 1}). O PDF tem ${pageCount} página${pageCount === 1 ? '' : 's'}.`
      );
    }
  }

  onProgress?.({
    percent: 55,
    message: `Copiando ${pageIndices.length} página${pageIndices.length === 1 ? '' : 's'}…`,
  });

  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, pageIndices);
  copied.forEach((page) => out.addPage(page));

  onProgress?.({ percent: 90, message: 'Gerando arquivo final…' });

  const pdfBytes = await out.save();

  onProgress?.({ percent: 100, message: 'Concluído!' });

  return pdfBytes;
}
