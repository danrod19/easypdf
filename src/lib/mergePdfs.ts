import { PDFDocument } from 'pdf-lib';

export interface MergeProgress {
  /** 0–100 */
  percent: number;
  /** Arquivo sendo processado (1-based) */
  current: number;
  total: number;
  message: string;
}

export type ProgressCallback = (progress: MergeProgress) => void;

/**
 * Mescla N arquivos PDF em um único documento usando pdf-lib.
 * Todo o processamento ocorre em memória no navegador.
 */
export async function mergePdfFiles(
  files: File[],
  onProgress?: ProgressCallback
): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error('Selecione pelo menos 2 arquivos PDF para juntar.');
  }

  const merged = await PDFDocument.create();
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    onProgress?.({
      percent: Math.round((i / total) * 90),
      current: i + 1,
      total,
      message: `Lendo ${file.name}…`,
    });

    let bytes: ArrayBuffer;
    try {
      bytes = await file.arrayBuffer();
    } catch {
      throw new Error(`Não foi possível ler o arquivo "${file.name}".`);
    }

    let src: PDFDocument;
    try {
      src = await PDFDocument.load(bytes, { ignoreEncryption: false });
    } catch {
      throw new Error(
        `O arquivo "${file.name}" não é um PDF válido ou está protegido por senha.`
      );
    }

    onProgress?.({
      percent: Math.round(((i + 0.5) / total) * 90),
      current: i + 1,
      total,
      message: `Copiando páginas de ${file.name}…`,
    });

    const pageIndices = src.getPageIndices();
    const copied = await merged.copyPages(src, pageIndices);
    copied.forEach((page) => merged.addPage(page));
  }

  onProgress?.({
    percent: 95,
    current: total,
    total,
    message: 'Gerando arquivo final…',
  });

  const pdfBytes = await merged.save();

  onProgress?.({
    percent: 100,
    current: total,
    total,
    message: 'Concluído!',
  });

  return pdfBytes;
}
