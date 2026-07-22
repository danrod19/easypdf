import { useCallback, useId, useState } from 'react';
import { Seo } from '../components/Seo';
import { AdSlot } from '../components/AdSlot';
import { ProgressBar } from '../components/ProgressBar';
import { DropZone } from '../components/merge/DropZone';
import { FileList, type PdfItem } from '../components/merge/FileList';
import { FaqAccordion } from '../components/FaqAccordion';
import { StickyCta } from '../components/StickyCta';
import { SuccessAction } from '../components/SuccessAction';
import { mergePdfFiles } from '../lib/mergePdfs';
import { downloadBlob } from '../lib/format';

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Página /juntar-pdf — merge real com pdf-lib + drag-and-drop.
 * Nenhum arquivo é enviado a servidor; tudo roda no navegador.
 */
export default function JuntarPdfPage() {
  const errorId = useId();
  const [items, setItems] = useState<PdfItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const addFiles = useCallback((files: File[]) => {
    setError(null);
    setSuccess(null);
    setItems((prev) => {
      const next = [...prev];
      for (const file of files) {
        // evita duplicata por nome + tamanho + lastModified
        const exists = next.some(
          (p) =>
            p.file.name === file.name &&
            p.file.size === file.size &&
            p.file.lastModified === file.lastModified
        );
        if (!exists) next.push({ id: createId(), file });
      }
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setError(null);
    setSuccess(null);
  }, []);

  const moveItem = useCallback((id: string, direction: 'up' | 'down') => {
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === id);
      if (index < 0) return prev;
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      copy.splice(target, 0, removed);
      return copy;
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    setError(null);
    setSuccess(null);
    setProgress(0);
    setProgressMsg('');
  }, []);

  const handleMerge = async () => {
    if (items.length < 2) {
      setError('Adicione pelo menos 2 arquivos PDF para juntar.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setProgress(0);
    setProgressMsg('Iniciando…');

    try {
      const files = items.map((i) => i.file);
      const bytes = await mergePdfFiles(files, ({ percent, message }) => {
        setProgress(percent);
        setProgressMsg(message);
      });

      const blob = new Blob([new Uint8Array(bytes)], {
        type: 'application/pdf',
      });
      const stamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, '-');
      downloadBlob(blob, `pdf-unido-${stamp}.pdf`);

      setSuccess(
        `PDF gerado com sucesso (${items.length} arquivos). O download deve ter iniciado.`
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Falha inesperada ao juntar os PDFs.';
      setError(message);
      setProgress(0);
      setProgressMsg('');
    } finally {
      setIsProcessing(false);
    }
  };

  const canMerge = items.length >= 2 && !isProcessing;

  return (
    <>
      <Seo
        title="Juntar PDF"
        description="Una vários arquivos PDF em um só, 100% no navegador. Seus arquivos não são enviados para nenhum servidor."
      />

      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Ferramenta gratuita
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Juntar PDF
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Combine dois ou mais PDFs em um único arquivo. Reordene a lista
            antes de mesclar. Todo o processamento usa{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              pdf-lib no seu navegador
            </strong>{' '}
            — nada é enviado para a nuvem.
          </p>
        </header>

        <DropZone onFiles={addFiles} disabled={isProcessing} />

        <FileList
          items={items}
          disabled={isProcessing}
          onRemove={removeItem}
          onMove={moveItem}
          onClear={clearAll}
        />

        {error && (
          <div
            id={errorId}
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          >
            {error}
          </div>
        )}

        {success && (
          <SuccessAction message={success} />
        )}

        <ProgressBar
          visible={isProcessing || progress === 100}
          percent={progress}
          message={progressMsg}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            className="btn-primary w-full sm:w-auto sm:min-w-[200px]"
            disabled={!canMerge}
            onClick={handleMerge}
            aria-describedby={error ? errorId : undefined}
          >
            {isProcessing ? (
              <>
                <Spinner />
                Juntando…
              </>
            ) : (
              <>
                <MergeIcon />
                Juntar {items.length > 0 ? `${items.length} PDFs` : 'PDFs'}
              </>
            )}
          </button>

          {items.length === 1 && (
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Adicione pelo menos mais 1 PDF para mesclar.
            </p>
          )}
        </div>

        {/* Slot AdSense mobile — abaixo do CTA */}
        <div className="lg:hidden">
          <AdSlot placement="below-cta" />
        </div>

        <section className="card text-sm text-slate-600 dark:text-slate-400">
          <h2 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
            Como funciona
          </h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Arraste ou selecione 2 ou mais arquivos PDF.</li>
            <li>Reordene com as setas, se necessário.</li>
            <li>
              Clique em <em>Juntar</em> — o merge roda localmente com pdf-lib.
            </li>
            <li>O PDF unificado é baixado automaticamente no seu dispositivo.</li>
          </ol>
        </section>

        <FaqAccordion
          title="Perguntas frequentes sobre Juntar PDF"
          subtitle="Privacidade, custo e como o merge local funciona no navegador."
        />
      </div>

      <StickyCta />
    </>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

function MergeIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}
