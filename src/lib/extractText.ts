import { loadPdfJs } from './pdfjsLoader';
import { assertOcrPageLimit } from './fileValidation';
import { TOOL_NAMES } from '../data/toolNames';
import { isPdfFile } from './pdfFileTypes';

export {
  isPdfFile,
  PDF_EXTRACT_ACCEPT,
  OCR_IMAGE_ACCEPT,
} from './pdfFileTypes';

/** Assets self-hosted em public/tesseract/ (sem CDN) */
export const TESSERACT_PATHS = {
  workerPath: '/tesseract/worker.min.js',
  /** Diretório dos tesseract-core-*.wasm(.js) */
  corePath: '/tesseract',
  /** Diretório do por.traineddata.gz */
  langPath: '/tesseract',
} as const;

export interface ExtractProgress {
  /** 0–100 */
  percent: number;
  message: string;
  status?: string;
}

export type ExtractProgressCallback = (progress: ExtractProgress) => void;

export class AbortError extends Error {
  constructor(message = 'Processamento cancelado.') {
    super(message);
    this.name = 'AbortError';
  }
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new AbortError();
  }
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
  onProgress?: ExtractProgressCallback,
  signal?: AbortSignal
): Promise<string> {
  if (!isPdfFile(file)) {
    throw new Error('Envie um arquivo PDF para extrair o texto.');
  }

  throwIfAborted(signal);
  onProgress?.({ percent: 2, message: 'Carregando PDF…' });

  const pdfjs = await loadPdfJs();
  throwIfAborted(signal);
  const data = new Uint8Array(await file.arrayBuffer());
  throwIfAborted(signal);
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pageCount = pdf.numPages;

  if (pageCount < 1) {
    throw new Error('O PDF não contém páginas legíveis.');
  }

  const chunks: string[] = [];

  try {
    for (let i = 1; i <= pageCount; i++) {
      throwIfAborted(signal);
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
  } finally {
    try {
      await pdf.cleanup();
    } catch {
      // ignore
    }
  }

  throwIfAborted(signal);
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
  /** Cancelamento (desmontagem da página / sair da ferramenta) */
  signal?: AbortSignal;
};

/**
 * OCR de PDF escaneado: cada página → canvas → Tesseract.recognize(..., 'por').
 * - Assets 100% locais (/tesseract/*)
 * - Limite MAX_OCR_PAGES antes do Tesseract
 * - signal.abort → terminate do worker (sem leak ao sair da página)
 */
export async function extractOcrTextFromPdf(
  file: File,
  onProgress?: ExtractProgressCallback,
  options: ExtractOcrOptions = {}
): Promise<string> {
  const signal = options.signal;

  if (!isPdfFile(file)) {
    throw new Error('Envie um arquivo PDF para o OCR.');
  }

  throwIfAborted(signal);

  // Proteção OOM: único choke-point de OCR (forçado ou automático)
  onProgress?.({
    percent: 1,
    message: 'Verificando se o PDF é adequado para OCR…',
  });
  await assertOcrPageLimit(
    file,
    options.toolName ?? TOOL_NAMES.EXTRAIR_TEXTO
  );
  throwIfAborted(signal);

  onProgress?.({ percent: 2, message: 'Carregando PDF…' });

  const pdfjs = await loadPdfJs();
  throwIfAborted(signal);
  const data = new Uint8Array(await file.arrayBuffer());
  throwIfAborted(signal);
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pageCount = pdf.numPages;

  if (pageCount < 1) {
    throw new Error('O PDF não contém páginas legíveis.');
  }

  onProgress?.({
    percent: 3,
    message: 'Iniciando OCR local (português)…',
  });

  const { createWorker } = await import('tesseract.js');
  let worker: Awaited<ReturnType<typeof createWorker>> | null = null;

  /** Página em OCR no momento (para o logger do Tesseract) */
  let currentPage = 1;

  const terminateWorker = async () => {
    if (!worker) return;
    try {
      await worker.terminate();
    } catch {
      // ignore
    }
    worker = null;
  };

  const onAbort = () => {
    void terminateWorker();
  };
  signal?.addEventListener('abort', onAbort, { once: true });

  try {
    throwIfAborted(signal);

    // Self-host: worker + core WASM + por.traineddata.gz em /tesseract/
    worker = await createWorker('por', undefined, {
      workerPath: TESSERACT_PATHS.workerPath,
      corePath: TESSERACT_PATHS.corePath,
      langPath: TESSERACT_PATHS.langPath,
      // Carrega worker do mesmo origin (worker-src 'self'), sem blob remoto
      workerBlobURL: false,
      gzip: true,
      logger: (m) => {
        if (signal?.aborted) return;
        const msg = m as LoggerMessage;
        const p =
          typeof msg.progress === 'number' && Number.isFinite(msg.progress)
            ? Math.min(1, Math.max(0, msg.progress))
            : 0;
        const status = (msg.status || '').toLowerCase();

        if (
          currentPage === 0 ||
          status.includes('loading') ||
          status.includes('initializ')
        ) {
          onProgress?.({
            percent: Math.min(8, Math.round(p * 8)),
            message: `Preparando OCR… ${msg.status || ''}`.trim(),
            status: msg.status,
          });
          return;
        }

        const pageBase = ((currentPage - 1) / pageCount) * 100;
        const pageSpan = 100 / pageCount;
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

    throwIfAborted(signal);

    const chunks: string[] = [];

    for (let i = 1; i <= pageCount; i++) {
      throwIfAborted(signal);
      currentPage = i;

      onProgress?.({
        percent: Math.round(((i - 1) / pageCount) * 100),
        message: `Lendo página ${i} de ${pageCount}… Renderizando…`,
      });

      const page = await pdf.getPage(i);
      throwIfAborted(signal);
      const canvas = await renderPageToCanvas(page, 2);
      throwIfAborted(signal);

      onProgress?.({
        percent: Math.round(((i - 0.65) / pageCount) * 100),
        message: `Lendo página ${i} de ${pageCount}… OCR em andamento…`,
      });

      if (!worker) throw new AbortError();

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

    throwIfAborted(signal);
    onProgress?.({ percent: 100, message: 'Concluído!' });
    return formatPageBlocks(chunks, pageCount);
  } catch (err) {
    if (err instanceof AbortError || (err instanceof Error && err.name === 'AbortError')) {
      throw err instanceof AbortError ? err : new AbortError();
    }
    if (err instanceof Error && err.message.startsWith('Envie')) {
      throw err;
    }
    // Mensagens de limite de páginas (assertOcrPageLimit) passam direto
    if (
      err instanceof Error &&
      (err.message.includes('muitas páginas') ||
        err.message.includes('mais de'))
    ) {
      throw err;
    }
    throw new Error(
      err instanceof Error
        ? `Erro no OCR do PDF: ${err.message}`
        : 'Erro no OCR do PDF. Tente outro arquivo ou desative o OCR se o PDF tiver texto selecionável.'
    );
  } finally {
    signal?.removeEventListener('abort', onAbort);
    await terminateWorker();
    try {
      await pdf.cleanup();
    } catch {
      // ignore
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
    signal?: AbortSignal;
  } = {},
  onProgress?: ExtractProgressCallback
): Promise<string> {
  const toolName = options.toolName ?? TOOL_NAMES.EXTRAIR_TEXTO;
  const ocrOpts = { toolName, signal: options.signal };

  if (options.forceOcr) {
    return extractOcrTextFromPdf(file, onProgress, ocrOpts);
  }

  const native = await extractNativeTextFromPdf(
    file,
    onProgress,
    options.signal
  );
  const autoOcr = options.autoOcr !== false;
  const stripped = native.replace(/\s/g, '');

  // PDF escaneado / sem texto selecionável → OCR automático (protegido)
  if (autoOcr && stripped.length < 20) {
    throwIfAborted(options.signal);
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
  onProgress?: ExtractProgressCallback,
  signal?: AbortSignal
): Promise<string> {
  return extractTextFromPdf(file, { forceOcr: true, signal }, onProgress);
}
