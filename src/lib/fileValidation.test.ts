/**
 * Unit tests — regras de limite e validação de arquivos.
 * Mock leve de pdf.js (contagem de páginas) e GA.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  FILE_LIMITS,
  formatLimitMb,
  validateIncomingFiles,
  validateIncomingFilesSync,
} from './fileValidation';

const mockPageCount = vi.hoisted(() => ({ value: 1 }));

vi.mock('../utils/gaEvents', () => ({
  trackFileRejected: vi.fn(),
}));

vi.mock('./pdfjsLoader', () => ({
  loadPdfJs: vi.fn(async () => ({
    getDocument: () => ({
      promise: Promise.resolve({
        get numPages() {
          return mockPageCount.value;
        },
        destroy: vi.fn(async () => undefined),
      }),
    }),
  })),
}));

/** File com `size` controlado sem alocar megabytes reais. */
function makeFile(
  name: string,
  sizeBytes: number,
  type = 'application/pdf'
): File {
  const file = new File([new Uint8Array([0])], name, { type });
  Object.defineProperty(file, 'size', { value: sizeBytes, configurable: true });
  return file;
}

function nPdf(size: number, name = 'doc.pdf') {
  return makeFile(name, size, 'application/pdf');
}

beforeEach(() => {
  mockPageCount.value = 1;
  // getPdfPageCount usa blob URL no caminho principal
  if (typeof URL.createObjectURL !== 'function') {
    URL.createObjectURL = vi.fn(() => 'blob:mock-pdf') as typeof URL.createObjectURL;
  } else {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-pdf');
  }
  if (typeof URL.revokeObjectURL !== 'function') {
    URL.revokeObjectURL = vi.fn() as typeof URL.revokeObjectURL;
  } else {
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
  }
});

describe('validateIncomingFiles — tamanho e tipo', () => {
  it('aceita arquivo dentro do limite', async () => {
    const file = nPdf(1024 * 1024); // 1 MB
    const result = await validateIncomingFiles([file], {
      profile: 'pdf_single',
      toolName: 'test',
      checkPages: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.files).toHaveLength(1);
      expect(result.files[0]).toBe(file);
    }
  });

  it('rejeita arquivo acima de MAX_FILE_BYTES', async () => {
    const file = nPdf(FILE_LIMITS.MAX_FILE_BYTES + 1);
    const result = await validateIncomingFiles([file], {
      profile: 'pdf_single',
      toolName: 'test',
      checkPages: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('file_too_large');
      expect(result.message).toContain(
        String(formatLimitMb(FILE_LIMITS.MAX_FILE_BYTES))
      );
      expect(result.message).toMatch(/MB/i);
    }
  });

  it('rejeita lista vazia com reason invalid_type', async () => {
    const result = await validateIncomingFiles([], {
      profile: 'pdf_single',
      toolName: 'test',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('invalid_type');
      expect(result.message).toMatch(/Nenhum arquivo válido/i);
    }
  });
});

describe('validateIncomingFiles — merge', () => {
  it('rejeita quantidade > MAX_MERGE_FILES', async () => {
    const existing = Array.from({ length: FILE_LIMITS.MAX_MERGE_FILES }, (_, i) =>
      nPdf(1000, `e${i}.pdf`)
    );
    const incoming = [nPdf(1000, 'extra.pdf')];
    const result = await validateIncomingFiles(incoming, {
      profile: 'merge_pdf',
      toolName: 'juntar_pdf',
      existingFiles: existing,
      checkPages: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('too_many_files');
      expect(result.message).toContain(String(FILE_LIMITS.MAX_MERGE_FILES));
    }
  });

  it('rejeita total > MAX_MERGE_TOTAL_BYTES', async () => {
    // Dois arquivos grandes dentro do teto por arquivo, mas acima do total
    const half = Math.floor(FILE_LIMITS.MAX_MERGE_TOTAL_BYTES / 2) + 1;
    // half must be ≤ MAX_FILE_BYTES
    expect(half).toBeLessThanOrEqual(FILE_LIMITS.MAX_FILE_BYTES);
    const a = nPdf(half, 'a.pdf');
    const b = nPdf(half, 'b.pdf');
    const result = await validateIncomingFiles([a, b], {
      profile: 'merge_pdf',
      toolName: 'juntar_pdf',
      checkPages: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('total_size_too_large');
      expect(result.message).toContain(
        String(formatLimitMb(FILE_LIMITS.MAX_MERGE_TOTAL_BYTES))
      );
    }
  });

  it('aceita merge dentro de quantidade e total', async () => {
    const files = [nPdf(1024, 'a.pdf'), nPdf(2048, 'b.pdf')];
    const result = await validateIncomingFiles(files, {
      profile: 'merge_pdf',
      toolName: 'juntar_pdf',
      checkPages: false,
    });
    expect(result.ok).toBe(true);
  });
});

describe('validateIncomingFiles — páginas (OCR / compress)', () => {
  it('OCR: rejeita páginas > MAX_OCR_PAGES', async () => {
    mockPageCount.value = FILE_LIMITS.MAX_OCR_PAGES + 1;
    const file = nPdf(50_000);
    const result = await validateIncomingFiles([file], {
      profile: 'ocr',
      toolName: 'extrair_texto',
      checkPages: true,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('too_many_pages');
      expect(result.pageCount).toBe(FILE_LIMITS.MAX_OCR_PAGES + 1);
      expect(result.message).toContain(String(FILE_LIMITS.MAX_OCR_PAGES));
      expect(result.message).toMatch(/OCR/i);
    }
  });

  it('OCR: aceita páginas no limite', async () => {
    mockPageCount.value = FILE_LIMITS.MAX_OCR_PAGES;
    const file = nPdf(50_000);
    const result = await validateIncomingFiles([file], {
      profile: 'ocr',
      toolName: 'extrair_texto',
      checkPages: true,
    });
    expect(result.ok).toBe(true);
  });

  it('compress: rejeita páginas > MAX_COMPRESS_PAGES', async () => {
    mockPageCount.value = FILE_LIMITS.MAX_COMPRESS_PAGES + 5;
    const file = nPdf(50_000);
    const result = await validateIncomingFiles([file], {
      profile: 'compress',
      toolName: 'comprimir_pdf',
      checkPages: true,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('too_many_pages');
      expect(result.pageCount).toBe(FILE_LIMITS.MAX_COMPRESS_PAGES + 5);
      expect(result.message).toContain(String(FILE_LIMITS.MAX_COMPRESS_PAGES));
      expect(result.message).toMatch(/comprimir/i);
    }
  });

  it('compress: aceita páginas no limite', async () => {
    mockPageCount.value = FILE_LIMITS.MAX_COMPRESS_PAGES;
    const file = nPdf(50_000);
    const result = await validateIncomingFiles([file], {
      profile: 'compress',
      toolName: 'comprimir_pdf',
      checkPages: true,
    });
    expect(result.ok).toBe(true);
  });
});

describe('validateIncomingFilesSync', () => {
  it('rejeita arquivo grande sem ler páginas', () => {
    const file = nPdf(FILE_LIMITS.MAX_FILE_BYTES + 10);
    const result = validateIncomingFilesSync([file], {
      profile: 'pdf_single',
      toolName: 'test',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('file_too_large');
    }
  });
});
