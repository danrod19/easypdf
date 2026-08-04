/** Helpers leves de tipo PDF — sem pdf.js / Tesseract. */

export const PDF_EXTRACT_ACCEPT = 'application/pdf,.pdf';

/** @deprecated use PDF_EXTRACT_ACCEPT */
export const OCR_IMAGE_ACCEPT = PDF_EXTRACT_ACCEPT;

/**
 * Aceita apenas PDF (extração de texto / OCR de páginas).
 */
export function isPdfFile(file: File): boolean {
  const type = (file.type || '').toLowerCase();
  if (type === 'application/pdf') return true;
  if (!type || type === 'application/octet-stream') {
    return file.name.toLowerCase().endsWith('.pdf');
  }
  return file.name.toLowerCase().endsWith('.pdf');
}
