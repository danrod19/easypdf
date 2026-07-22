/**
 * Carrega pdfjs-dist sob demanda (code-split) e configura o worker uma vez.
 * Evita inflar o bundle inicial das outras ferramentas.
 */

type PdfJsModule = typeof import('pdfjs-dist');

let pdfjsPromise: Promise<PdfJsModule> | null = null;
let workerConfigured = false;

export async function loadPdfJs(): Promise<PdfJsModule> {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist');
  }

  const pdfjs = await pdfjsPromise;

  if (!workerConfigured) {
    // Worker local via Vite (?url) — fallback CDN da Mozilla
    try {
      const workerMod = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
      const src =
        typeof workerMod === 'object' && workerMod && 'default' in workerMod
          ? (workerMod as { default: string }).default
          : String(workerMod);
      pdfjs.GlobalWorkerOptions.workerSrc = src;
    } catch {
      const ver = pdfjs.version || '5.4.149';
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${ver}/pdf.worker.min.mjs`;
    }
    workerConfigured = true;
  }

  return pdfjs;
}
