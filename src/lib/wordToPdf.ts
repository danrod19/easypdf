export interface WordToPdfProgress {
  /** 0–100 */
  percent: number;
  message: string;
}

export type WordToPdfProgressCallback = (progress: WordToPdfProgress) => void;

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

/**
 * Estilos de impressão embutidos na string HTML.
 * Cores fixas (#000 / #fff) evitam texto invisível com Dark Mode do app.
 */
const PRINT_STYLES = `
  * { box-sizing: border-box; }
  .docx-pdf-root, .docx-pdf-root * {
    color: #000000 !important;
  }
  .docx-pdf-root {
    margin: 0;
    padding: 0;
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #000000;
    background-color: #FFFFFF;
    width: 100%;
  }
  .docx-pdf-root h1,
  .docx-pdf-root h2,
  .docx-pdf-root h3,
  .docx-pdf-root h4,
  .docx-pdf-root h5,
  .docx-pdf-root h6 {
    color: #000000 !important;
    line-height: 1.25;
    margin: 1.1em 0 0.5em;
    page-break-after: avoid;
  }
  .docx-pdf-root h1 { font-size: 20pt; }
  .docx-pdf-root h2 { font-size: 16pt; }
  .docx-pdf-root h3 { font-size: 13pt; }
  .docx-pdf-root p {
    margin: 0 0 0.65em;
    orphans: 3;
    widows: 3;
  }
  .docx-pdf-root ul,
  .docx-pdf-root ol {
    margin: 0 0 0.75em 1.25em;
    padding: 0;
  }
  .docx-pdf-root li { margin-bottom: 0.25em; }
  .docx-pdf-root table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.75em 0;
    page-break-inside: auto;
  }
  .docx-pdf-root th,
  .docx-pdf-root td {
    border: 1px solid #cbd5e1;
    padding: 6px 8px;
    vertical-align: top;
    text-align: left;
    color: #000000 !important;
    background-color: #FFFFFF;
  }
  .docx-pdf-root th {
    background: #f1f5f9;
    font-weight: 600;
  }
  .docx-pdf-root img {
    max-width: 100% !important;
    height: auto !important;
    page-break-inside: avoid;
  }
  .docx-pdf-root a {
    color: #1d4ed8 !important;
    text-decoration: underline;
  }
  .docx-pdf-root blockquote {
    margin: 0.75em 0;
    padding: 0.25em 0 0.25em 0.9em;
    border-left: 3px solid #94a3b8;
    color: #000000 !important;
  }
  .docx-pdf-root pre,
  .docx-pdf-root code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 9.5pt;
    color: #000000 !important;
  }
  .docx-pdf-root pre {
    white-space: pre-wrap;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 8px;
    page-break-inside: avoid;
  }
`;

/**
 * Envolve o HTML do mammoth num container bruto com estilos fixos
 * (sem montar elementos React nem div off-screen no app).
 * html2pdf().from() aceita essa string e cuida do DOM internamente.
 */
export function wrapMammothHtmlForPdf(mammothHtml: string): string {
  return [
    '<div class="docx-pdf-root" style="padding: 20px; font-family: sans-serif; color: #000000; background-color: #FFFFFF; width: 100%;">',
    `<style>${PRINT_STYLES}</style>`,
    mammothHtml,
    '</div>',
  ].join('');
}

/**
 * Converte um .docx em PDF no navegador:
 * DOCX → (mammoth) HTML string → (html2pdf.js.from string) PDF blob.
 *
 * Arquitetura em memória: não usa elementos React escondidos nem captura
 * de div com left: -10000px (causava PDF em branco no html2canvas).
 */
export async function convertDocxToPdf(
  file: File,
  onProgress?: WordToPdfProgressCallback
): Promise<Uint8Array> {
  if (!isDocxFile(file)) {
    throw new Error(
      'Envie um arquivo .docx válido (Microsoft Word OOXML).'
    );
  }

  onProgress?.({ percent: 5, message: 'Carregando conversor…' });

  // Lazy-load: não entope o bundle das outras rotas
  const [{ default: mammoth }, { default: html2pdf }] = await Promise.all([
    import('mammoth'),
    import('html2pdf.js'),
  ]);

  onProgress?.({ percent: 12, message: 'Lendo documento…' });

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch {
    throw new Error(`Não foi possível ler o arquivo "${file.name}".`);
  }

  onProgress?.({ percent: 28, message: 'Convertendo DOCX para HTML…' });

  let mammothHtml: string;
  try {
    const result = await mammoth.convertToHtml({ arrayBuffer });
    mammothHtml = result.value?.trim() ?? '';
  } catch {
    throw new Error(
      `Não foi possível interpretar "${file.name}". Confirme que é um .docx válido.`
    );
  }

  if (!mammothHtml) {
    throw new Error(
      'O documento parece estar vazio ou não possui conteúdo conversível.'
    );
  }

  onProgress?.({ percent: 45, message: 'Preparando layout para impressão…' });

  // String HTML com cores fixas — passada direto ao html2pdf (sem DOM do React)
  const htmlForPdf = wrapMammothHtmlForPdf(mammothHtml);

  onProgress?.({
    percent: 60,
    message: 'Gerando PDF…',
  });

  try {
    const worker = html2pdf()
      .set({
        margin: [12, 12, 12, 12],
        filename: 'documento.pdf',
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          avoid: ['img', 'tr', 'table', 'pre', 'blockquote'],
        },
        enableLinks: true,
      })
      // html2pdf aceita string HTML diretamente (monta o container internamente)
      .from(htmlForPdf);

    const output = (await worker.outputPdf('blob')) as Blob;
    if (!(output instanceof Blob) || output.size === 0) {
      throw new Error('Falha ao gerar o PDF a partir do documento.');
    }

    onProgress?.({ percent: 95, message: 'Finalizando arquivo…' });

    const buffer = await output.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    onProgress?.({ percent: 100, message: 'Concluído!' });
    return bytes;
  } catch (err) {
    if (err instanceof Error && err.message) {
      if (
        err.message.startsWith('Envie') ||
        err.message.startsWith('Não foi') ||
        err.message.startsWith('O documento') ||
        err.message.startsWith('Falha ao')
      ) {
        throw err;
      }
    }
    throw new Error(
      'Falha ao renderizar o PDF. Tente um documento mais simples ou menor.'
    );
  }
}
