/** Helpers leves de tipo DOCX — sem mammoth/html2pdf. */

/** MIME oficial de DOCX (OOXML). */
export const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/**
 * Aceita estritamente .docx com MIME associado.
 * MIME vazio ou application/octet-stream ainda é comum em alguns SO/navegadores
 * quando a extensão é .docx — nesses casos a extensão decide.
 */
export function isDocxFile(file: File): boolean {
  const name = file.name.toLowerCase();
  if (!name.endsWith('.docx')) return false;

  const type = (file.type || '').toLowerCase();
  if (!type) return true;
  if (type === DOCX_MIME) return true;
  // Fallback frequente no Windows / drag-and-drop
  if (type === 'application/octet-stream') return true;
  return false;
}
