import { PDFDocument, degrees } from 'pdf-lib';
import { getPdfPageCount, parsePageRange } from './splitPdf';

export { getPdfPageCount, parsePageRange };

export interface RotateProgress {
  /** 0–100 */
  percent: number;
  message: string;
}

export type RotateProgressCallback = (progress: RotateProgress) => void;

/** Normaliza ângulo para 0, 90, 180 ou 270 (pdf-lib). */
export function normalizeAngle(angle: number): number {
  const n = ((Math.round(angle) % 360) + 360) % 360;
  // Arredonda para o múltiplo de 90 mais próximo
  return (Math.round(n / 90) * 90) % 360;
}

/**
 * Cria array de deltas de rotação (graus adicionais) zerados por página.
 */
export function createZeroRotations(pageCount: number): number[] {
  return Array.from({ length: pageCount }, () => 0);
}

/**
 * Aplica +90° ou −90° aos índices informados (0-based).
 * Retorna um novo array (imutável).
 */
export function applyRotationDelta(
  rotations: number[],
  pageIndices: number[],
  direction: 'left' | 'right'
): number[] {
  const delta = direction === 'right' ? 90 : -90;
  const next = [...rotations];

  for (const idx of pageIndices) {
    if (idx < 0 || idx >= next.length) {
      throw new Error(
        `Página ${idx + 1} fora do intervalo (1–${next.length}).`
      );
    }
    next[idx] = normalizeAngle(next[idx] + delta);
  }

  return next;
}

/**
 * Quantas páginas têm rotação pendente (≠ 0°).
 */
export function countPendingRotations(rotations: number[]): number {
  return rotations.filter((r) => normalizeAngle(r) !== 0).length;
}

/**
 * Lê o PDF, aplica o delta de rotação de cada página sobre o ângulo atual
 * (page.getRotation().angle + delta) e devolve os bytes do documento.
 *
 * `rotations[i]` = graus adicionais em relação ao original (múltiplos de 90).
 */
export async function applyRotationsToPdf(
  file: File,
  rotations: number[],
  onProgress?: RotateProgressCallback
): Promise<Uint8Array> {
  onProgress?.({ percent: 10, message: `Lendo ${file.name}…` });

  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    throw new Error(`Não foi possível ler o arquivo "${file.name}".`);
  }

  onProgress?.({ percent: 30, message: 'Carregando documento…' });

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(bytes, { ignoreEncryption: false });
  } catch {
    throw new Error(
      `O arquivo "${file.name}" não é um PDF válido ou está protegido por senha.`
    );
  }

  const pages = doc.getPages();
  const pageCount = pages.length;

  if (rotations.length !== pageCount) {
    throw new Error(
      `Estado de rotação inconsistente (${rotations.length} vs ${pageCount} páginas). Recarregue o arquivo.`
    );
  }

  onProgress?.({
    percent: 55,
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

  onProgress?.({ percent: 90, message: 'Gerando arquivo final…' });

  const pdfBytes = await doc.save();

  onProgress?.({ percent: 100, message: 'Concluído!' });

  return pdfBytes;
}

/**
 * Nome de download: `{base}-rotacionado.pdf`
 */
export function rotatedFileName(originalName: string): string {
  const base = originalName.replace(/\.pdf$/i, '') || 'documento';
  return `${base}-rotacionado.pdf`;
}
