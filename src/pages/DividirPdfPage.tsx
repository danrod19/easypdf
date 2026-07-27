import { useCallback, useId, useState } from 'react';
import { Seo } from '../components/Seo';
import { getSeoForPath } from '../data/seo';
import { AdSlot } from '../components/AdSlot';
import { ProgressBar } from '../components/ProgressBar';
import { DropZone } from '../components/merge/DropZone';
import { FaqAccordion } from '../components/FaqAccordion';
import { StickyCta } from '../components/StickyCta';
import { SuccessAction } from '../components/SuccessAction';
import { ToolSeoContent } from '../components/ToolSeoContent';
import { PdfPreviewModal } from '../components/PdfPreviewModal';
import { dividirPdfSeoContent } from '../data/toolSeoContent';
import { TOOL_NAMES } from '../data/toolNames';
import { useToolAnalytics } from '../hooks/useToolAnalytics';
import {
  extractPdfPages,
  getPdfPageCount,
  parsePageRange,
} from '../lib/splitPdf';
import { downloadBlob, formatBytes } from '../lib/format';

function buildExtractedFileName(originalName: string) {
  const stamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, '-');
  const baseName = originalName.replace(/\.pdf$/i, '') || 'documento';
  return `${baseName}-paginas-${stamp}.pdf`;
}

/**
 * Página /dividir-pdf — extrai páginas por intervalo de texto com pdf-lib.
 * Gera um único PDF (não ZIP) → pré-visualização no modal antes do download.
 */
export default function DividirPdfPage() {
  const errorId = useId();
  const rangeId = useId();
  const ga = useToolAnalytics(TOOL_NAMES.DIVIDIR_PDF);

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [rangeInput, setRangeInput] = useState('');
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewBytes, setPreviewBytes] = useState<Uint8Array | null>(null);
  const [previewFileName, setPreviewFileName] = useState('');

  const resetPreview = useCallback(() => {
    setIsModalOpen(false);
    setPreviewBytes(null);
    setPreviewFileName('');
  }, []);

  const resetResult = useCallback(() => {
    setError(null);
    setSuccess(null);
    setProgress(0);
    setProgressMsg('');
    resetPreview();
  }, [resetPreview]);

  const clearFile = useCallback(() => {
    setFile(null);
    setPageCount(null);
    setRangeInput('');
    resetResult();
  }, [resetResult]);

  const handleFiles = useCallback(
    async (files: File[]) => {
      const next = files[0];
      if (!next) return;

      setIsLoadingMeta(true);
      resetResult();
      setFile(next);
      setPageCount(null);
      setRangeInput('');

      try {
        const count = await getPdfPageCount(next);
        setPageCount(count);
        ga.trackUpload([next]);
      } catch (err) {
        setFile(null);
        setPageCount(null);
        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível ler o PDF.'
        );
      } finally {
        setIsLoadingMeta(false);
      }
    },
    [ga, resetResult]
  );

  const handleExtract = async () => {
    if (!file || pageCount == null) {
      setError('Envie um arquivo PDF primeiro.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setProgress(0);
    setProgressMsg('Validando intervalo…');
    resetPreview();

    const startedAt = ga.startProcess(1);

    try {
      const indices = parsePageRange(rangeInput, pageCount);

      const bytes = await extractPdfPages(file, indices, ({ percent, message }) => {
        setProgress(percent);
        setProgressMsg(message);
      });

      const stableBytes = new Uint8Array(bytes);
      const fileName = buildExtractedFileName(file.name);

      setPreviewBytes(stableBytes);
      setPreviewFileName(fileName);
      setIsModalOpen(true);
      setSuccess(
        `PDF gerado com ${indices.length} página${indices.length === 1 ? '' : 's'}. Confira a pré-visualização e baixe quando quiser.`
      );
      ga.endProcess(true, startedAt);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Falha inesperada ao extrair as páginas.';
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
    const name = previewFileName || 'paginas-extraidas.pdf';
    const blob = new Blob([new Uint8Array(previewBytes)], {
      type: 'application/pdf',
    });
    downloadBlob(blob, name);
    ga.trackDownload(name);
    setIsModalOpen(false);
    setSuccess('Download iniciado. O arquivo permanece só no seu dispositivo.');
  }, [previewBytes, previewFileName, ga]);

  const busy = isProcessing || isLoadingMeta;
  const canExtract =
    !!file && pageCount != null && pageCount > 0 && rangeInput.trim().length > 0 && !busy;

  const seo = getSeoForPath('/dividir-pdf');

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Ferramenta gratuita · Sem upload
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Dividir PDF
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Envie um PDF e informe as páginas que deseja extrair (ex.:{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">
              1, 3-5, 8
            </code>
            ). Todo o processamento usa{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              pdf-lib no seu navegador
            </strong>{' '}
            — nada é enviado para a nuvem.
          </p>
        </header>

        {!file ? (
          <DropZone
            onFiles={handleFiles}
            disabled={busy}
            multiple={false}
          />
        ) : (
          <div className="card space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Arquivo carregado
                </p>
                <p className="truncate font-semibold text-slate-800 dark:text-slate-100">
                  {file.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {formatBytes(file.size)}
                  {pageCount != null && (
                    <>
                      {' · '}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {pageCount} página{pageCount === 1 ? '' : 's'}
                      </span>
                    </>
                  )}
                  {isLoadingMeta && ' · lendo PDF…'}
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary shrink-0"
                disabled={busy}
                onClick={clearFile}
              >
                Trocar arquivo
              </button>
            </div>

            {pageCount != null && (
              <form
                className="space-y-4 border-t border-slate-200 pt-5 dark:border-slate-700"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (canExtract) void handleExtract();
                }}
              >
                <div className="rounded-xl border border-brand-200 bg-brand-50/80 px-4 py-3 text-sm text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-100">
                  Este PDF possui{' '}
                  <strong>
                    {pageCount} página{pageCount === 1 ? '' : 's'}
                  </strong>
                  . Informe quais deseja extrair (numeração a partir de 1).
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor={rangeId}
                    className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Intervalo de páginas
                  </label>
                  <input
                    id={rangeId}
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder='Ex.: 1, 3-5, 8'
                    value={rangeInput}
                    disabled={busy}
                    onChange={(e) => {
                      setRangeInput(e.target.value);
                      setError(null);
                      setSuccess(null);
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-400"
                    aria-describedby={`${rangeId}-hint`}
                    aria-invalid={error ? true : undefined}
                  />
                  <p
                    id={`${rangeId}-hint`}
                    className="text-xs text-slate-500 dark:text-slate-400"
                  >
                    Use vírgulas para separar e hífen para intervalos. Ex.:{' '}
                    <span className="font-medium">1</span> (só a 1ª),{' '}
                    <span className="font-medium">3-5</span> (páginas 3, 4 e 5),{' '}
                    <span className="font-medium">1, 3-5, 8</span>.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-auto sm:min-w-[200px]"
                    disabled={!canExtract}
                    aria-describedby={error ? errorId : undefined}
                  >
                    {isProcessing ? (
                      <>
                        <Spinner />
                        Extraindo…
                      </>
                    ) : (
                      <>
                        <SplitIcon />
                        Extrair Páginas
                      </>
                    )}
                  </button>
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
              </form>
            )}
          </div>
        )}

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
          <SuccessAction message={success} toolName={TOOL_NAMES.DIVIDIR_PDF} />
        )}

        <ProgressBar
          visible={isProcessing || progress === 100}
          percent={progress}
          message={progressMsg}
        />

        {/* Slot AdSense mobile — abaixo do CTA */}
        <div className="lg:hidden">
          <AdSlot placement="below-cta" />
        </div>

        <section className="card text-sm text-slate-600 dark:text-slate-400">
          <h2 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
            Como funciona
          </h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Arraste ou selecione 1 arquivo PDF.</li>
            <li>
              Veja quantas páginas o documento tem e digite o intervalo desejado.
            </li>
            <li>
              Clique em <em>Extrair Páginas</em> — a cópia roda localmente com
              pdf-lib.
            </li>
            <li>
              O novo PDF (somente as páginas escolhidas) abre em pré-visualização
              antes do download.
            </li>
          </ol>
        </section>

        <ToolSeoContent content={dividirPdfSeoContent} />

        <FaqAccordion
          title="Perguntas frequentes sobre Dividir PDF"
          subtitle="Privacidade, custo e como a extração local funciona no navegador."
        />
      </div>

      <StickyCta />

      <PdfPreviewModal
        isOpen={isModalOpen}
        pdfBytes={previewBytes}
        fileName={previewFileName}
        onClose={handleClosePreview}
        onDownload={handleDownloadFromPreview}
        toolName={TOOL_NAMES.DIVIDIR_PDF}
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

function SplitIcon() {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}
