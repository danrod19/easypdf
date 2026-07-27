import { useEffect, useId, useRef, useState } from 'react';
import { Download, FileText, Loader2, X } from 'lucide-react';
import { loadPdfJs } from '../lib/pdfjsLoader';
import { trackPreviewOpened } from '../utils/gaEvents';
import type { ToolName } from '../data/toolNames';

export type PdfPreviewModalProps = {
  isOpen: boolean;
  /** Bytes do PDF gerado (Uint8Array ou Blob). Null limpa a prévia. */
  pdfBytes: Uint8Array | Blob | null;
  fileName: string;
  onClose: () => void;
  /** Dispara o download real do arquivo. */
  onDownload: () => void;
  /** Nome da ferramenta para evento preview_opened */
  toolName?: ToolName | string;
};

/**
 * Modal global de pré-visualização de PDF.
 * Renderiza apenas a 1ª página via pdfjs-dist (capa da prévia).
 */
export function PdfPreviewModal({
  isOpen,
  pdfBytes,
  fileName,
  onClose,
  onDownload,
  toolName,
}: PdfPreviewModalProps) {
  const titleId = useId();
  const descId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<{ current: number; total: number } | null>(
    null
  );

  // Trava scroll do body + foco no fechar
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [isOpen]);

  // GA4: preview_opened (uma vez por abertura)
  useEffect(() => {
    if (!isOpen || !toolName) return;
    trackPreviewOpened(toolName);
  }, [isOpen, toolName]);

  // Escape fecha o modal
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Renderiza a 1ª página no canvas quando o modal abre com bytes
  useEffect(() => {
    if (!isOpen || !pdfBytes) {
      setIsLoading(false);
      setRenderError(null);
      setPageInfo(null);
      return;
    }

    let cancelled = false;

    const renderFirstPage = async () => {
      setIsLoading(true);
      setRenderError(null);
      setPageInfo(null);

      try {
        const data = await toUint8Array(pdfBytes);
        // Cópia isolada: pdf.js pode transferir/detach o buffer
        const dataCopy = data.slice();

        const pdfjs = await loadPdfJs();
        if (cancelled) return;

        const pdf = await pdfjs.getDocument({ data: dataCopy }).promise;
        if (cancelled) {
          await pdf.cleanup();
          return;
        }

        const total = pdf.numPages;
        const page = await pdf.getPage(1);

        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) {
          await pdf.cleanup();
          throw new Error('Canvas de pré-visualização indisponível.');
        }

        // Ajuste à largura do container (máx. ~1.75× para nitidez)
        const maxCssWidth = Math.max(240, container.clientWidth - 8);
        const maxCssHeight = Math.min(window.innerHeight * 0.5, 520);
        const baseViewport = page.getViewport({ scale: 1 });
        const fitScale = Math.min(
          maxCssWidth / baseViewport.width,
          maxCssHeight / baseViewport.height,
          1.75
        );
        const viewport = page.getViewport({ scale: fitScale });

        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.floor(viewport.width * dpr));
        canvas.height = Math.max(1, Math.floor(viewport.height * dpr));
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) {
          await pdf.cleanup();
          throw new Error('Contexto 2D indisponível neste navegador.');
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, viewport.width, viewport.height);

        await page.render({
          canvasContext: ctx,
          viewport,
          canvas,
        }).promise;

        if (!cancelled) {
          setPageInfo({ current: 1, total });
        }

        page.cleanup();
        await pdf.cleanup();
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : 'Não foi possível gerar a pré-visualização.';
          setRenderError(message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void renderFirstPage();

    return () => {
      cancelled = true;
    };
  }, [isOpen, pdfBytes]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] transition-opacity"
        aria-label="Fechar pré-visualização"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 flex max-h-[min(92vh,880px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
              <FileText className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2
                id={titleId}
                className="text-base font-semibold text-slate-900 dark:text-slate-50"
              >
                Pré-visualização
              </h2>
              <p
                id={descId}
                className="truncate text-xs text-slate-500 dark:text-slate-400"
                title={fileName}
              >
                {fileName || 'documento.pdf'}
                {pageInfo
                  ? ` · página ${pageInfo.current} de ${pageInfo.total}`
                  : ''}
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preview body */}
        <div
          ref={containerRef}
          className="relative flex min-h-[220px] flex-1 items-center justify-center overflow-auto bg-slate-100/80 px-4 py-6 dark:bg-slate-950/60"
        >
          {isLoading && (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-100/90 dark:bg-slate-950/90"
              role="status"
              aria-live="polite"
            >
              <Loader2
                className="h-8 w-8 animate-spin text-brand-600 dark:text-brand-400"
                aria-hidden
              />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Montando pré-visualização…
              </p>
            </div>
          )}

          {renderError ? (
            <div
              role="alert"
              className="max-w-sm rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
            >
              <p className="font-medium">Falha na prévia</p>
              <p className="mt-1 text-amber-800/90 dark:text-amber-200/80">
                {renderError}
              </p>
              <p className="mt-2 text-xs text-amber-700 dark:text-amber-300/80">
                Você ainda pode baixar o PDF normalmente.
              </p>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className="max-w-full rounded-lg border border-slate-200 bg-white shadow-md dark:border-slate-700"
              aria-label={`Pré-visualização da primeira página de ${fileName || 'PDF'}`}
            />
          )}
        </div>

        {/* Footer actions */}
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end dark:border-slate-800">
          <button
            type="button"
            className="btn-secondary w-full sm:w-auto"
            onClick={onClose}
          >
            Voltar / Cancelar
          </button>
          <button
            type="button"
            className="btn-primary w-full sm:w-auto sm:min-w-[160px]"
            onClick={onDownload}
            disabled={!pdfBytes}
          >
            <Download className="h-4 w-4" aria-hidden />
            Baixar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

async function toUint8Array(source: Uint8Array | Blob): Promise<Uint8Array> {
  if (source instanceof Blob) {
    const buffer = await source.arrayBuffer();
    return new Uint8Array(buffer);
  }
  return source instanceof Uint8Array ? source : new Uint8Array(source);
}

export default PdfPreviewModal;
