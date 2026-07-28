import { loadPdfJs } from './pdfjsLoader';
import { assertOcrPageLimit } from './fileValidation';
import { TOOL_NAMES } from '../data/toolNames';

export interface ExtractProgress {
  /** 0–100 */
  percent: number;
  message: string;
  status?: string;
}

export type ExtractProgressCallback = (progress: ExtractProgress) => void;

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

/** Alias legado */
export function isOcrImageFile(file: File): boolean {
  return isPdfFile(file);
}

type LoggerMessage = {
  status?: string;
  progress?: number;
};

type TextItem = { str?: string; transform?: number[] };

/**
 * Junta itens de getTextContent em linhas razoáveis (por posição Y).
 */
function textContentToString(items: TextItem[]): string {
  if (!items.length) return '';

  type Line = { y: number; parts: { x: number; str: string }[] };
  const lines: Line[] = [];
  const yTolerance = 3;

  for (const item of items) {
    const str = (item.str ?? '').replace(/\s+/g, ' ');
    if (!str.trim() && str !== ' ') continue;

    const transform = item.transform;
    const x = transform?.[4] ?? 0;
    const y = transform?.[5] ?? 0;

    let line = lines.find((l) => Math.abs(l.y - y) <= yTolerance);
    if (!line) {
      line = { y, parts: [] };
      lines.push(line);
    }
    line.parts.push({ x, str });
  }

  // PDF: Y cresce para cima → ordenar linhas de cima para baixo
  lines.sort((a, b) => b.y - a.y);

  return lines
    .map((line) => {
      line.parts.sort((a, b) => a.x - b.x);
      let out = '';
      for (const part of line.parts) {
        if (!out) {
          out = part.str;
          continue;
        }
        const needsSpace =
          !/\s$/.test(out) && !/^\s/.test(part.str) && part.str.length > 0;
        out += needsSpace ? ` ${part.str}` : part.str;
      }
      return out.trimEnd();
    })
    .filter((l) => l.length > 0)
    .join('\n');
}

function formatPageBlocks(chunks: string[], pageCount: number): string {
  return chunks
    .map((t, idx) => {
      if (!t.trim()) return '';
      return pageCount > 1 ? `--- Página ${idx + 1} ---\n${t}` : t;
    })
    .filter(Boolean)
    .join('\n\n')
    .trim();
}

/**
 * Extração nativa (rápida): pdf.js getTextContent em todas as páginas.
 */
export async function extractNativeTextFromPdf(
  file: File,
  onProgress?: ExtractProgressCallback
): Promise<string> {
  if (!isPdfFile(file)) {
    throw new Error('Envie um arquivo PDF para extrair o texto.');
  }

  onProgress?.({ percent: 2, message: 'Carregando PDF…' });

  const pdfjs = await loadPdfJs();
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pageCount = pdf.numPages;

  if (pageCount < 1) {
    throw new Error('O PDF não contém páginas legíveis.');
  }

  const chunks: string[] = [];

  for (let i = 1; i <= pageCount; i++) {
    onProgress?.({
      percent: Math.min(95, Math.round(((i - 1) / pageCount) * 100)),
      message: `Lendo página ${i} de ${pageCount}…`,
    });

    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const items = (content.items as TextItem[]) ?? [];
    chunks.push(textContentToString(items).trim());
    page.cleanup();
  }

  await pdf.cleanup();
  onProgress?.({ percent: 100, message: 'Concluído!' });
  return formatPageBlocks(chunks, pageCount);
}

/**
 * Renderiza uma página do PDF em canvas off-screen (escala 2× para OCR).
 */
async function renderPageToCanvas(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page: any,
  scale = 2
): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Não foi possível criar o canvas para OCR.');
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext: ctx,
    viewport,
    canvas,
  }).promise;

  return canvas;
}

export type ExtractOcrOptions = {
  /** tool_name GA4 (default: extrair_texto) */
  toolName?: string;
};

/**
 * OCR de PDF escaneado: cada página → canvas → Tesseract.recognize(..., 'por').
 * Sempre valida limite de páginas (MAX_OCR_PAGES) antes de iniciar o Tesseract —
 * cobre “Forçar OCR”, extractTextFromImage e qualquer fallback automático.
 */
export async function extractOcrTextFromPdf(
  file: File,
  onProgress?: ExtractProgressCallback,
  options: ExtractOcrOptions = {}
): Promise<string> {
  if (!isPdfFile(file)) {
    throw new Error('Envie um arquivo PDF para o OCR.');
  }

  // Proteção OOM: único choke-point de OCR (forçado ou automático)
  onProgress?.({
    percent: 1,
    message: 'Verificando se o PDF é adequado para OCR…',
  });
  await assertOcrPageLimit(
    file,
    options.toolName ?? TOOL_NAMES.EXTRAIR_TEXTO
  );

  onProgress?.({ percent: 2, message: 'Carregando PDF…' });

  const pdfjs = await loadPdfJs();
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pageCount = pdf.numPages;

  if (pageCount < 1) {
    throw new Error('O PDF não contém páginas legíveis.');
  }

  onProgress?.({
    percent: 3,
    message: 'Iniciando OCR (português)… Na 1ª vez o modelo pode ser baixado.',
  });

  const { createWorker } = await import('tesseract.js');
  let worker: Awaited<ReturnType<typeof createWorker>> | null = null;

  /** Página em OCR no momento (para o logger do Tesseract) */
  let currentPage = 1;

  try {
    worker = await createWorker('por', undefined, {
      logger: (m) => {
        const msg = m as LoggerMessage;
        const p =
          typeof msg.progress === 'number' && Number.isFinite(msg.progress)
            ? Math.min(1, Math.max(0, msg.progress))
            : 0;
        const status = (msg.status || '').toLowerCase();

        // Ainda carregando o worker (antes do loop de páginas)
        if (currentPage === 0 || status.includes('loading') || status.includes('initializ')) {
          onProgress?.({
            percent: Math.min(8, Math.round(p * 8)),
            message: `Preparando OCR… ${msg.status || ''}`.trim(),
            status: msg.status,
          });
          return;
        }

        const pageBase = ((currentPage - 1) / pageCount) * 100;
        const pageSpan = 100 / pageCount;
        // metade da fatia = render já feito; OCR usa o restante
        const ocrStart = 0.35;
        const percent = Math.min(
          99,
          Math.round(pageBase + pageSpan * (ocrStart + p * (1 - ocrStart)))
        );

        onProgress?.({
          percent,
          message: `Lendo página ${currentPage} de ${pageCount}… OCR em andamento…`,
          status: msg.status,
        });
      },
    });

    const chunks: string[] = [];

    for (let i = 1; i <= pageCount; i++) {
      currentPage = i;

      onProgress?.({
        percent: Math.round(((i - 1) / pageCount) * 100),
        message: `Lendo página ${i} de ${pageCount}… Renderizando…`,
      });

      const page = await pdf.getPage(i);
      const canvas = await renderPageToCanvas(page, 2);

      onProgress?.({
        percent: Math.round(((i - 0.65) / pageCount) * 100),
        message: `Lendo página ${i} de ${pageCount}… OCR em andamento…`,
      });

      const {
        data: { text },
      } = await worker.recognize(canvas);

      canvas.width = 0;
      canvas.height = 0;
      page.cleanup();

      chunks.push((text ?? '').replace(/\r\n/g, '\n').trim());

      onProgress?.({
        percent: Math.min(99, Math.round((i / pageCount) * 100)),
        message: `Lendo página ${i} de ${pageCount}… Concluída.`,
      });
    }

    await pdf.cleanup();
    onProgress?.({ percent: 100, message: 'Concluído!' });
    return formatPageBlocks(chunks, pageCount);
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('Envie')) {
      throw err;
    }
    throw new Error(
      err instanceof Error
        ? `Erro no OCR do PDF: ${err.message}`
        : 'Erro no OCR do PDF. Tente outro arquivo ou desative o OCR se o PDF tiver texto selecionável.'
    );
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // ignore
      }
    }
  }
}

/**
 * Extrai texto de PDF: nativo (pdf.js) ou OCR (canvas + Tesseract 'por').
 *
 * - forceOcr: sempre OCR (com limite de páginas).
 * - autoOcr (default true): se o texto nativo for praticamente vazio
 *   (PDF escaneado), tenta OCR automaticamente — também com limite de páginas.
 */
export async function extractTextFromPdf(
  file: File,
  options: {
    forceOcr?: boolean;
    /** Se true (default), OCR automático quando nativo ≈ vazio */
    autoOcr?: boolean;
    toolName?: string;
  } = {},
  onProgress?: ExtractProgressCallback
): Promise<string> {
  const toolName = options.toolName ?? TOOL_NAMES.EXTRAIR_TEXTO;
  const ocrOpts = { toolName };

  if (options.forceOcr) {
    return extractOcrTextFromPdf(file, onProgress, ocrOpts);
  }

  const native = await extractNativeTextFromPdf(file, onProgress);
  const autoOcr = options.autoOcr !== false;
  const stripped = native.replace(/\s/g, '');

  // PDF escaneado / sem texto selecionável → OCR automático (protegido)
  if (autoOcr && stripped.length < 20) {
    onProgress?.({
      percent: 4,
      message:
        'Pouco ou nenhum texto nativo encontrado. Iniciando OCR automático…',
    });
    return extractOcrTextFromPdf(file, onProgress, ocrOpts);
  }

  return native;
}

/**
 * @deprecated Prefer extractTextFromPdf
 */
export async function extractTextFromImage(
  file: File,
  onProgress?: ExtractProgressCallback
): Promise<string> {
  return extractTextFromPdf(file, { forceOcr: true }, onProgress);
}
