export interface ExtractProgress {
  /** 0–100 */
  percent: number;
  message: string;
  /** Status bruto do Tesseract (ex.: "recognizing text") */
  status?: string;
}

export type ExtractProgressCallback = (progress: ExtractProgress) => void;

export const OCR_IMAGE_ACCEPT =
  'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp';

/**
 * Aceita JPEG, PNG e WebP (mesmo critério das outras rotas de imagem).
 */
export function isOcrImageFile(file: File): boolean {
  const type = (file.type || '').toLowerCase();
  if (
    type === 'image/jpeg' ||
    type === 'image/png' ||
    type === 'image/webp'
  ) {
    return true;
  }

  if (!type || type === 'application/octet-stream') {
    const name = file.name.toLowerCase();
    return (
      name.endsWith('.jpg') ||
      name.endsWith('.jpeg') ||
      name.endsWith('.png') ||
      name.endsWith('.webp')
    );
  }

  return false;
}

type LoggerMessage = {
  status?: string;
  progress?: number;
  jobId?: string;
  userJobId?: string;
  workerId?: string;
};

function mapTesseractProgress(m: LoggerMessage): ExtractProgress {
  const p = typeof m.progress === 'number' && Number.isFinite(m.progress) ? m.progress : 0;
  const status = (m.status || '').toLowerCase();

  if (status.includes('loading tesseract') || status.includes('loading core')) {
    return {
      percent: Math.round(p * 15),
      message: 'Carregando motor OCR…',
      status: m.status,
    };
  }

  if (status.includes('initializing tesseract') || status.includes('initialized tesseract')) {
    return {
      percent: 15 + Math.round(p * 10),
      message: 'Inicializando Tesseract…',
      status: m.status,
    };
  }

  if (status.includes('loading language') || status.includes('loaded language')) {
    return {
      percent: 25 + Math.round(p * 15),
      message: 'Carregando idioma (português)…',
      status: m.status,
    };
  }

  if (status.includes('initializing api') || status.includes('initialized api')) {
    return {
      percent: 40 + Math.round(p * 5),
      message: 'Preparando reconhecimento…',
      status: m.status,
    };
  }

  // Evento principal pedido no requisito
  if (status === 'recognizing text' || status.includes('recognizing')) {
    return {
      percent: 45 + Math.round(p * 50),
      message: 'Lendo a imagem…',
      status: m.status,
    };
  }

  return {
    percent: Math.min(95, Math.round(p * 100)),
    message: m.status || 'Processando…',
    status: m.status,
  };
}

/**
 * Extrai texto de uma imagem com tesseract.js (Web Worker + WASM).
 * Idioma: português (`por`). Sempre encerra o worker ao final.
 */
export async function extractTextFromImage(
  file: File,
  onProgress?: ExtractProgressCallback
): Promise<string> {
  if (!isOcrImageFile(file)) {
    throw new Error(
      'Envie uma imagem JPEG, PNG ou WebP para o OCR.'
    );
  }

  onProgress?.({ percent: 2, message: 'Preparando OCR…' });

  // Lazy-load: worker + WASM só entram quando a rota OCR é usada
  const { createWorker } = await import('tesseract.js');

  let worker: Awaited<ReturnType<typeof createWorker>> | null = null;

  try {
    onProgress?.({ percent: 5, message: 'Iniciando worker (português)…' });

    worker = await createWorker('por', undefined, {
      logger: (m) => {
        onProgress?.(mapTesseractProgress(m as LoggerMessage));
      },
    });

    onProgress?.({
      percent: 45,
      message: 'Lendo a imagem…',
      status: 'recognizing text',
    });

    const {
      data: { text },
    } = await worker.recognize(file);

    const cleaned = (text ?? '').replace(/\r\n/g, '\n').trim();

    onProgress?.({ percent: 100, message: 'Concluído!' });

    if (!cleaned) {
      // Página “vazia” ainda é resultado válido do Tesseract
      return '';
    }

    return cleaned;
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('Envie')) {
      throw err;
    }
    throw new Error(
      err instanceof Error
        ? `Erro ao ler imagem: ${err.message}`
        : 'Erro ao ler imagem. Tente outro arquivo ou uma foto mais nítida.'
    );
  } finally {
    // Gestão de memória: libera RAM do navegador imediatamente
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // ignore terminate errors
      }
    }
  }
}
