/**
 * Validação centralizada de arquivos — previne OOM no navegador (esp. mobile).
 * Use em todo upload (DropZone / seleção) antes de carregar em memória pesada.
 */

import { loadPdfJs } from './pdfjsLoader';
import { trackFileRejected } from '../utils/gaEvents';
import type { ToolName } from '../data/toolNames';

// ---------------------------------------------------------------------------
// Limites (justificativa: heap típico mobile ~1–2 GB; PDF rasterizado multiplica
// o tamanho; OCR e compressão são os piores casos)
// ---------------------------------------------------------------------------

export const FILE_LIMITS = {
  /** Tamanho máximo por arquivo (bytes) */
  MAX_FILE_BYTES: 50 * 1024 * 1024,
  /** Total combinado no merge (bytes) */
  MAX_MERGE_TOTAL_BYTES: 80 * 1024 * 1024,
  /** Máximo de arquivos no merge / imagem→PDF */
  MAX_MERGE_FILES: 20,
  /** Páginas máximas para OCR (Tesseract + canvas) */
  MAX_OCR_PAGES: 30,
  /** Páginas máximas para compressão (rasterização página a página) */
  MAX_COMPRESS_PAGES: 50,
  /** Páginas máximas em operações PDF “leves” (merge, split, etc.) — proteção extra */
  MAX_PDF_PAGES_GENERAL: 150,
} as const;

export type FileRejectReason =
  | 'file_too_large'
  | 'total_size_too_large'
  | 'too_many_files'
  | 'too_many_pages'
  | 'invalid_type';

/** Perfil por tipo de ferramenta */
export type ValidationProfile =
  | 'merge_pdf'
  | 'merge_images'
  | 'ocr'
  | 'compress'
  | 'pdf_single'
  | 'docx'
  | 'image_single';

export type FileValidationOptions = {
  profile: ValidationProfile;
  toolName: ToolName | string;
  /** Arquivos já na lista (merge) */
  existingFiles?: File[];
  /**
   * Se true, conta páginas do PDF (async).
   * Default: true para ocr/compress; false para merge (só tamanho/quantidade).
   */
  checkPages?: boolean;
};

export type FileValidationSuccess = {
  ok: true;
  files: File[];
};

export type FileValidationFailure = {
  ok: false;
  message: string;
  reason: FileRejectReason;
  fileSizeMb?: number;
  pageCount?: number;
};

export type FileValidationResult = FileValidationSuccess | FileValidationFailure;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function bytesToMb(bytes: number): number {
  return Math.round((bytes / (1024 * 1024)) * 100) / 100;
}

export function formatLimitMb(bytes: number): number {
  return Math.round(bytes / (1024 * 1024));
}

/** Conta páginas de um PDF (após validar tamanho). */
export async function getPdfPageCount(file: File): Promise<number> {
  const pdfjs = await loadPdfJs();
  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjs.getDocument({ data });
  try {
    const pdf = await loadingTask.promise;
    const count = pdf.numPages;
    // destroy() exists at runtime; some pdfjs type packages omit it
    const destroy = (pdf as { destroy?: () => void | Promise<void> }).destroy;
    if (destroy) await destroy.call(pdf);
    return count;
  } catch {
    throw new Error(
      'Não foi possível ler este PDF. O arquivo pode estar danificado ou protegido.'
    );
  }
}

function reject(
  toolName: string,
  reason: FileRejectReason,
  message: string,
  extra?: { fileSizeMb?: number; pageCount?: number }
): FileValidationFailure {
  trackFileRejected({
    toolName,
    reason,
    fileSizeMb: extra?.fileSizeMb,
    pageCount: extra?.pageCount,
  });
  return { ok: false, message, reason, ...extra };
}

function maxPagesForProfile(profile: ValidationProfile): number | null {
  switch (profile) {
    case 'ocr':
      return FILE_LIMITS.MAX_OCR_PAGES;
    case 'compress':
      return FILE_LIMITS.MAX_COMPRESS_PAGES;
    case 'pdf_single':
    case 'merge_pdf':
      return FILE_LIMITS.MAX_PDF_PAGES_GENERAL;
    default:
      return null;
  }
}

function shouldCheckPages(
  profile: ValidationProfile,
  explicit?: boolean
): boolean {
  if (explicit !== undefined) return explicit;
  return profile === 'ocr' || profile === 'compress';
}

// ---------------------------------------------------------------------------
// Validação principal
// ---------------------------------------------------------------------------

/**
 * Valida arquivos de entrada. Chame o mais cedo possível (no DropZone / onFiles).
 * Dispara `file_rejected` no GA4 quando bloqueia.
 */
export async function validateIncomingFiles(
  incoming: File[],
  options: FileValidationOptions
): Promise<FileValidationResult> {
  const { profile, toolName, existingFiles = [] } = options;

  if (!incoming.length) {
    return reject(
      toolName,
      'invalid_type',
      'Nenhum arquivo válido foi selecionado.'
    );
  }

  const maxFile = FILE_LIMITS.MAX_FILE_BYTES;
  const maxFileMb = formatLimitMb(maxFile);

  // 1) Tamanho por arquivo
  for (const file of incoming) {
    if (file.size > maxFile) {
      return reject(
        toolName,
        'file_too_large',
        `Este arquivo tem mais de ${maxFileMb} MB. Por favor, envie um arquivo menor.`,
        { fileSizeMb: bytesToMb(file.size) }
      );
    }
  }

  // 2) Merge: quantidade e total
  if (profile === 'merge_pdf' || profile === 'merge_images') {
    const combined = [...existingFiles, ...incoming];
    const maxFiles = FILE_LIMITS.MAX_MERGE_FILES;

    if (combined.length > maxFiles) {
      return reject(
        toolName,
        'too_many_files',
        `Você selecionou arquivos demais. O limite é de ${maxFiles} arquivos por vez.`
      );
    }

    const totalBytes = combined.reduce((s, f) => s + (f.size || 0), 0);
    if (totalBytes > FILE_LIMITS.MAX_MERGE_TOTAL_BYTES) {
      const maxTotalMb = formatLimitMb(FILE_LIMITS.MAX_MERGE_TOTAL_BYTES);
      return reject(
        toolName,
        'total_size_too_large',
        `O tamanho total dos arquivos passa de ${maxTotalMb} MB. Remova alguns ou use arquivos menores.`,
        { fileSizeMb: bytesToMb(totalBytes) }
      );
    }
  }

  // 3) Páginas (PDF) — ocr / compress (e opcionalmente outros)
  if (shouldCheckPages(profile, options.checkPages)) {
    const maxPages = maxPagesForProfile(profile);
    if (maxPages != null) {
      for (const file of incoming) {
        const isPdf =
          file.type === 'application/pdf' ||
          file.name.toLowerCase().endsWith('.pdf');
        if (!isPdf) continue;

        let pageCount: number;
        try {
          pageCount = await getPdfPageCount(file);
        } catch (err) {
          return reject(
            toolName,
            'invalid_type',
            err instanceof Error
              ? err.message
              : 'Não foi possível ler este PDF.'
          );
        }

        if (pageCount > maxPages) {
          const hint =
            profile === 'ocr'
              ? `Este PDF tem muitas páginas para o OCR no navegador. Tente com no máximo ${maxPages} páginas.`
              : profile === 'compress'
                ? `Este PDF tem muitas páginas para comprimir no navegador. Tente com no máximo ${maxPages} páginas.`
                : `Este PDF tem muitas páginas para processar no navegador. Tente com no máximo ${maxPages} páginas.`;

          return reject(toolName, 'too_many_pages', hint, {
            pageCount,
            fileSizeMb: bytesToMb(file.size),
          });
        }
      }
    }
  }

  return { ok: true, files: incoming };
}

/**
 * Validação síncrona só de tamanho/quantidade (sem ler PDF).
 * Útil quando a contagem de páginas será feita depois.
 */
export function validateIncomingFilesSync(
  incoming: File[],
  options: Omit<FileValidationOptions, 'checkPages'> & {
    checkPages?: false;
  }
): FileValidationResult {
  // Reutiliza a lógica async sem await de páginas
  const { profile, toolName, existingFiles = [] } = options;

  if (!incoming.length) {
    return reject(
      toolName,
      'invalid_type',
      'Nenhum arquivo válido foi selecionado.'
    );
  }

  const maxFileMb = formatLimitMb(FILE_LIMITS.MAX_FILE_BYTES);
  for (const file of incoming) {
    if (file.size > FILE_LIMITS.MAX_FILE_BYTES) {
      return reject(
        toolName,
        'file_too_large',
        `Este arquivo tem mais de ${maxFileMb} MB. Por favor, envie um arquivo menor.`,
        { fileSizeMb: bytesToMb(file.size) }
      );
    }
  }

  if (profile === 'merge_pdf' || profile === 'merge_images') {
    const combined = [...existingFiles, ...incoming];
    if (combined.length > FILE_LIMITS.MAX_MERGE_FILES) {
      return reject(
        toolName,
        'too_many_files',
        `Você selecionou arquivos demais. O limite é de ${FILE_LIMITS.MAX_MERGE_FILES} arquivos por vez.`
      );
    }
    const totalBytes = combined.reduce((s, f) => s + (f.size || 0), 0);
    if (totalBytes > FILE_LIMITS.MAX_MERGE_TOTAL_BYTES) {
      return reject(
        toolName,
        'total_size_too_large',
        `O tamanho total dos arquivos passa de ${formatLimitMb(FILE_LIMITS.MAX_MERGE_TOTAL_BYTES)} MB. Remova alguns ou use arquivos menores.`,
        { fileSizeMb: bytesToMb(totalBytes) }
      );
    }
  }

  return { ok: true, files: incoming };
}

/** Texto de dica para DropZone (limites em linguagem humana). */
export function dropZoneLimitHint(profile: ValidationProfile): string {
  const mb = formatLimitMb(FILE_LIMITS.MAX_FILE_BYTES);
  switch (profile) {
    case 'merge_pdf':
      return `até ${FILE_LIMITS.MAX_MERGE_FILES} PDFs · máx. ${mb} MB cada · total ${formatLimitMb(FILE_LIMITS.MAX_MERGE_TOTAL_BYTES)} MB · 100% local`;
    case 'merge_images':
      return `até ${FILE_LIMITS.MAX_MERGE_FILES} imagens · máx. ${mb} MB cada · 100% local`;
    case 'ocr':
      return `PDF · máx. ${mb} MB · até ${FILE_LIMITS.MAX_OCR_PAGES} páginas no OCR · 100% local`;
    case 'compress':
      return `PDF · máx. ${mb} MB · até ${FILE_LIMITS.MAX_COMPRESS_PAGES} páginas · 100% local`;
    case 'docx':
      return `DOCX · máx. ${mb} MB · processamento local`;
    default:
      return `máx. ${mb} MB por arquivo · processamento local`;
  }
}
