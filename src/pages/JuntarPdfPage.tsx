import { useCallback, useId, useState } from 'react';
import { Seo } from '../components/Seo';
import { AdSlot } from '../components/AdSlot';
import { ProgressBar } from '../components/ProgressBar';
import { DropZone } from '../components/merge/DropZone';
import { FileList, type PdfItem } from '../components/merge/FileList';
import { FaqAccordion } from '../components/FaqAccordion';
import { StickyCta } from '../components/StickyCta';
import { SuccessAction } from '../components/SuccessAction';
import { ToolSeoContent } from '../components/ToolSeoContent';
import { PdfPreviewModal } from '../components/PdfPreviewModal';
import { getSeoForPath } from '../data/seo';
import { juntarPdfSeoContent } from '../data/toolSeoContent';
import { TOOL_NAMES } from '../data/toolNames';
import { useToolAnalytics } from '../hooks/useToolAnalytics';
import { useFileIntake } from '../hooks/useFileIntake';
import { dropZoneLimitHint } from '../lib/fileValidation';
import { mergePdfFilesPreferWorker } from '../lib/mergePdfsWorker';
import { downloadBlob } from '../lib/format';

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function buildMergedFileName() {
  const stamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, '-');
  return `pdf-unido-${stamp}.pdf`;
}

/**
 * Página /juntar-pdf — merge com pdf-lib em Web Worker (fallback na UI thread).
 * Nenhum arquivo é enviado a servidor; tudo roda no navegador.
 * Após o merge, abre pré-visualização antes do download.
 */
export default function JuntarPdfPage() {
  const errorId = useId();
  const ga = useToolAnalytics(TOOL_NAMES.JUNTAR_PDF);
  const intake = useFileIntake(TOOL_NAMES.JUNTAR_PDF, 'merge_pdf');
  const [items, setItems] = useState<PdfItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Pré-visualização do PDF gerado (em vez de download automático)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewBytes, setPreviewBytes] = useState<Uint8Array | null>(null);
  const [previewFileName, setPreviewFileName] = useState('');

  const resetPreview = useCallback(() => {
    setIsModalOpen(false);
    setPreviewBytes(null);
    setPreviewFileName('');
  }, []);

  const addFiles = useCallback(
    async (files: File[]) => {
      setError(null);
      setSuccess(null);

      const existing = items.map((i) => i.file);
      // evita duplicata (lista atual + batch)
      const deduped: File[] = [];
      for (const file of files) {
        const exists =
          existing.some(
            (p) =>
              p.name === file.name &&
              p.size === file.size &&
              p.lastModified === file.lastModified
          ) ||
          deduped.some(
            (p) =>
              p.name === file.name &&
              p.size === file.size &&
              p.lastModified === file.lastModified
          );
        if (!exists) deduped.push(file);
      }

      if (!deduped.length) return;

      const gate = await intake(deduped, existing);
      if (!gate.ok) {
        setError(gate.message);
        return;
      }

      setItems((prev) => [
        ...prev,
        ...gate.files.map((file) => ({ id: createId(), file })),
      ]);
      ga.trackUpload(gate.files);
    },
    [ga, intake, items]
  );

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
    resetPreview();
  }, [resetPreview]);

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
    // Fecha prévia anterior se o usuário juntar de novo
    resetPreview();

    const startedAt = ga.startProcess(items.length);

    try {
      const files = items.map((i) => i.file);
      // pdf-lib no Worker — evita travar a UI com arquivos grandes
      const bytes = await mergePdfFilesPreferWorker(
        files,
        ({ percent, message }) => {
          setProgress(percent);
          setProgressMsg(message);
        }
      );

      // Cópia estável para o estado (evita buffer detach do pdf.js / pdf-lib)
      const stableBytes = new Uint8Array(bytes);
      const fileName = buildMergedFileName();

      setPreviewBytes(stableBytes);
      setPreviewFileName(fileName);
      setIsModalOpen(true);
      setSuccess(
        `PDF gerado com sucesso (${items.length} arquivos). Confira a pré-visualização e baixe quando quiser.`
      );
      ga.endProcess(true, startedAt);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Falha inesperada ao juntar os PDFs.';
      setError(message);
      setProgress(0);
      setProgressMsg('');
      ga.endProcess(false, startedAt);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClosePreview = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleDownloadFromPreview = useCallback(() => {
    if (!previewBytes) return;

    const name = previewFileName || buildMergedFileName();
    const blob = new Blob([new Uint8Array(previewBytes)], {
      type: 'application/pdf',
    });
    downloadBlob(blob, name);
    ga.trackDownload(name);
    setIsModalOpen(false);
    setSuccess('Download iniciado. O arquivo permanece só no seu dispositivo.');
  }, [previewBytes, previewFileName, ga]);

  const canMerge = items.length >= 2 && !isProcessing;
  const seo = getSeoForPath('/juntar-pdf');

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Ferramenta gratuita · Sem upload
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Juntar PDF online e seguro
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Combine dois ou mais PDFs em um único arquivo, grátis e no
            navegador. Reordene a lista antes de mesclar. Todo o processamento
            usa{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              pdf-lib no seu dispositivo
            </strong>{' '}
            — zero envio para a nuvem e privacidade total.
          </p>
        </header>

        <DropZone
          onFiles={addFiles}
          disabled={isProcessing}
          onReject={(msg) => setError(msg)}
          labels={{
            hint: `ou clique para escolher · ${dropZoneLimitHint('merge_pdf')}`,
          }}
        />

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
          <SuccessAction message={success} toolName={TOOL_NAMES.JUNTAR_PDF} />
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

          {previewBytes && !isModalOpen && (
            <button
              type="button"
              className="btn-secondary w-full sm:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              Ver pré-visualização
            </button>
          )}
        </div>

        {/* Slot AdSense mobile — abaixo do CTA */}
        <div className="lg:hidden">
          <AdSlot placement="below-cta" />
        </div>

        {/* Conteúdo semântico SEO (H2/H3/P) — legível pelo Googlebot */}
        <ToolSeoContent content={juntarPdfSeoContent} />

        <FaqAccordion
          title="Perguntas frequentes sobre Juntar PDF"
          subtitle="Privacidade, custo e como o merge local funciona no navegador."
        />
      </div>

      <StickyCta />

      <PdfPreviewModal
        isOpen={isModalOpen}
        pdfBytes={previewBytes}
        fileName={previewFileName}
        onClose={handleClosePreview}
        onDownload={handleDownloadFromPreview}
        toolName={TOOL_NAMES.JUNTAR_PDF}
      />
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
