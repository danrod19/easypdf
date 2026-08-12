import { PDFDocument } from 'pdf-lib';
import { loadPdfJs } from './pdfjsLoader';

export interface UnlockProgress {
  /** 0–100 */
  percent: number;
  message: string;
}

export type UnlockProgressCallback = (progress: UnlockProgress) => void;

/**
 * Nome sugerido para o PDF sem senha.
 */
export function unlockedFileName(originalName: string): string {
  const stamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, '-');
  const base = originalName.replace(/\.pdf$/i, '') || 'documento';
  return `${base}-desbloqueado-${stamp}.pdf`;
}

/**
 * Detecta se o PDF parece criptografado (pdf-lib lança EncryptedPDFError).
 */
export async function isPdfEncrypted(file: File): Promise<boolean> {
  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    throw new Error(`Não foi possível ler o arquivo "${file.name}".`);
  }

  try {
    await PDFDocument.load(bytes, { ignoreEncryption: false });
    return false;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/encrypt/i.test(msg)) return true;
    // PDF inválido ou outro erro — propaga na unlock
    return true;
  }
}

/**
 * Remove a senha de um PDF e devolve bytes sem criptografia.
 *
 * Limitação da pdf-lib oficial: **não existe**
 * `PDFDocument.load(bytes, { password })` — LoadOptions só tem
 * `ignoreEncryption`, que NÃO descriptografa streams.
 *
 * Pipeline client-side (100% no navegador):
 * 1. Se o PDF já abre sem senha → regrava com pdf-lib (sem Encrypt).
 * 2. Se estiver protegido → pdf.js valida a senha e abre o documento;
 *    cada página é renderizada e embutida num PDF novo via pdf-lib
 *    (visual sem senha; conteúdo vira imagem de alta qualidade).
 *
 * Erro de senha incorreta é detectado via PasswordException do pdf.js.
 */
function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException('Processamento cancelado.', 'AbortError');
  }
}

export async function unlockPdfWithPassword(
  file: File,
  password: string,
  onProgress?: UnlockProgressCallback,
  signal?: AbortSignal
): Promise<Uint8Array> {
  if (!password.trim()) {
    throw new Error('Digite a senha atual do PDF para remover a proteção.');
  }

  throwIfAborted(signal);
  onProgress?.({ percent: 5, message: `Lendo ${file.name}…` });

  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    throwIfAborted(signal);
    throw new Error(`Não foi possível ler o arquivo "${file.name}".`);
  }

  throwIfAborted(signal);
  onProgress?.({ percent: 15, message: 'Verificando proteção…' });

  // Caminho A: PDF sem senha de usuário — pdf-lib carrega e regrava limpo
  try {
    const plain = await PDFDocument.load(bytes, { ignoreEncryption: false });
    if (plain.getPageCount() < 1) {
      throw new Error('O PDF não possui páginas.');
    }
    throwIfAborted(signal);
    onProgress?.({
      percent: 70,
      message: 'PDF já está sem senha de abertura. Gerando cópia limpa…',
    });
    const out = await plain.save();
    throwIfAborted(signal);
    onProgress?.({ percent: 100, message: 'Concluído!' });
    return out;
  } catch (err) {
    if (
      (err instanceof DOMException && err.name === 'AbortError') ||
      (err instanceof Error && err.name === 'AbortError')
    ) {
      throw err;
    }
    const msg = err instanceof Error ? err.message : String(err);
    if (!/encrypt/i.test(msg)) {
      // Não é erro de criptografia — propaga (PDF inválido etc.)
      if (err instanceof Error && err.message.startsWith('O PDF')) throw err;
      throw new Error(
        `O arquivo "${file.name}" não é um PDF válido.`
      );
    }
    // Criptografado → caminho B
  }

  throwIfAborted(signal);
  onProgress?.({ percent: 25, message: 'Validando senha…' });

  return unlockEncryptedViaPdfJs(bytes, password, onProgress, signal);
}

/**
 * Abre PDF cifrado com pdf.js (password) e reconstrói PDF sem Encrypt.
 */
async function unlockEncryptedViaPdfJs(
  bytes: ArrayBuffer,
  password: string,
  onProgress?: UnlockProgressCallback,
  signal?: AbortSignal
): Promise<Uint8Array> {
  throwIfAborted(signal);
  const pdfjs = await loadPdfJs();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pdf: any;
  try {
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(bytes),
      password,
    });
    pdf = await loadingTask.promise;
  } catch (err) {
    throwIfAborted(signal);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyErr = err as any;
    const name = anyErr?.name || '';
    const code = anyErr?.code;
    const message = anyErr instanceof Error ? anyErr.message : String(err);

    // PasswordResponses: NEED_PASSWORD = 1, INCORRECT_PASSWORD = 2
    if (
      name === 'PasswordException' ||
      code === 1 ||
      code === 2 ||
      /password/i.test(message)
    ) {
      throw new Error(
        'Senha incorreta ou ausente. Confira a senha e tente novamente.'
      );
    }

    throw new Error(
      'Não foi possível abrir o PDF protegido. Verifique se o arquivo não está corrompido.'
    );
  }

  throwIfAborted(signal);
  const pageCount: number = pdf.numPages;
  if (pageCount < 1) {
    throw new Error('O PDF não possui páginas.');
  }

  onProgress?.({
    percent: 35,
    message: `Senha aceita. Removendo proteção (${pageCount} página${pageCount === 1 ? '' : 's'})…`,
  });

  const outDoc = await PDFDocument.create();
  const RENDER_SCALE = 2; // ~144 DPI — equilíbrio qualidade/tamanho

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    throwIfAborted(signal);
    const percent = 35 + Math.round((pageNum / pageCount) * 55);
    onProgress?.({
      percent,
      message: `Processando página ${pageNum} de ${pageCount}…`,
    });

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: RENDER_SCALE });
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D indisponível neste navegador.');
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport,
      canvas,
    }).promise;

    throwIfAborted(signal);
    const jpegBytes = await canvasToJpegBytes(canvas, 0.92);
    const image = await outDoc.embedJpg(jpegBytes);

    // Dimensões em pontos PDF (72 DPI base): divide pelo scale de render
    const pageWidth = viewport.width / RENDER_SCALE;
    const pageHeight = viewport.height / RENDER_SCALE;
    const pdfPage = outDoc.addPage([pageWidth, pageHeight]);
    pdfPage.drawImage(image, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    });
  }

  throwIfAborted(signal);
  onProgress?.({ percent: 95, message: 'Gerando PDF sem senha…' });

  const out = await outDoc.save();
  throwIfAborted(signal);
  onProgress?.({ percent: 100, message: 'Concluído!' });
  return out;
}

function canvasToJpegBytes(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          reject(new Error('Falha ao exportar página do PDF.'));
          return;
        }
        const buf = await blob.arrayBuffer();
        resolve(new Uint8Array(buf));
      },
      'image/jpeg',
      quality
    );
  });
}
