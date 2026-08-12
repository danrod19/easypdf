import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { Loader2, Trash2, X } from 'lucide-react';
import { Seo } from '../components/Seo';
import { getSeoForPath } from '../data/seo';
import { AdSlot } from '../components/AdSlot';
import { ProgressBar } from '../components/ProgressBar';
import { DropZone } from '../components/merge/DropZone';
import { FaqAccordion } from '../components/FaqAccordion';
import { StickyCta } from '../components/StickyCta';
import { SuccessAction } from '../components/SuccessAction';
import { ToolSeoContent } from '../components/ToolSeoContent';
import { FileLimitsNotice } from '../components/FileLimitsNotice';
import { PdfPreviewModal } from '../components/PdfPreviewModal';
import { removerPaginasSeoContent } from '../data/toolSeoContent';
import { TOOL_NAMES } from '../data/toolNames';
import { useToolAnalytics } from '../hooks/useToolAnalytics';
import { useFileIntake } from '../hooks/useFileIntake';
import { useAbortablePdfJob } from '../hooks/useAbortablePdfJob';
import { dropZoneLimitHint } from '../lib/fileValidation';
import {
  generatePageThumbnails,
  removePagesFromPdf,
  removedPagesFileName,
  type PageThumbnail,
} from '../lib/removePages';
import { downloadBlob, formatBytes } from '../lib/format';
import type { FaqItem } from '../data/faq';

const removeFaqItems: FaqItem[] = [
  {
    id: 'como-marcar',
    question: 'Como marco páginas para excluir?',
    answer:
      'Após carregar o PDF, as miniaturas aparecem em grade. Clique no X / lixeira de cada página que deseja remover — ela fica destacada em vermelho. Clique de novo para desmarcar. Depois use “Gerar Novo PDF”.',
  },
  {
    id: 'original',
    question: 'O PDF original é alterado?',
    answer:
      'Não. Geramos um arquivo novo com as páginas restantes. O original permanece intacto no seu disco. Você só baixa a versão sem as páginas marcadas.',
  },
  {
    id: 'todas',
    question: 'Posso remover todas as páginas?',
    answer:
      'Não. O PDF final precisa ter ao menos uma página. Desmarque pelo menos uma miniatura antes de gerar o arquivo.',
  },
  {
    id: 'seguro',
    question: 'É seguro remover páginas aqui?',
    answer:
      'Sim. Miniaturas (pdf.js) e remoção (pdf-lib) rodam 100% no navegador. Nada sobe para servidores — o arquivo fica só na memória até o download.',
  },
];

/**
 * Página /remover-paginas — exclui páginas selecionadas via miniaturas.
 */
export default function RemoverPaginasPage() {
  const errorId = useId();
  const ga = useToolAnalytics(TOOL_NAMES.REMOVER_PAGINAS);
  const intake = useFileIntake(TOOL_NAMES.REMOVER_PAGINAS, 'pdf_single');
  const job = useAbortablePdfJob();

  const [file, setFile] = useState<File | null>(null);
  const [thumbs, setThumbs] = useState<PageThumbnail[]>([]);
  /** Índices 0-based marcados para exclusão */
  const [markedForDelete, setMarkedForDelete] = useState<number[]>([]);
  const [isLoadingThumbs, setIsLoadingThumbs] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewBytes, setPreviewBytes] = useState<Uint8Array | null>(null);
  const [previewFileName, setPreviewFileName] = useState('');

  const markedSet = useMemo(
    () => new Set(markedForDelete),
    [markedForDelete]
  );

  const remainingCount = thumbs.length - markedForDelete.length;

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
    setThumbs([]);
    setMarkedForDelete([]);
    resetResult();
  }, [resetResult]);

  const handleFiles = useCallback(
    async (files: File[]) => {
      const next = files[0];
      if (!next) return;

      const gate = await intake([next]);
      if (!gate.ok) {
        setError(gate.message);
        return;
      }
      const accepted = gate.files[0] ?? next;

      const signal = job.beginJob();
      setIsLoadingThumbs(true);
      resetResult();
      setFile(accepted);
      setThumbs([]);
      setMarkedForDelete([]);

      try {
        const generated = await generatePageThumbnails(
          accepted,
          ({ percent, message }) => {
            setProgress(percent);
            setProgressMsg(message);
          },
          signal
        );
        if (signal.aborted || !job.isMounted()) return;
        setThumbs(generated);
        setProgress(0);
        setProgressMsg('');
        ga.trackUpload(gate.files);
      } catch (err) {
        if (job.isAbortError(err) || !job.isMounted()) return;
        setFile(null);
        setThumbs([]);
        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar as miniaturas do PDF.'
        );
        setProgress(0);
        setProgressMsg('');
      } finally {
        job.endJob(signal);
        if (job.isMounted()) setIsLoadingThumbs(false);
      }
    },
    [ga, intake, job, resetResult]
  );

  const toggleMark = useCallback((index: number) => {
    setMarkedForDelete((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }
      return [...prev, index];
    });
    setError(null);
    setSuccess(null);
  }, []);

  const clearMarks = useCallback(() => {
    setMarkedForDelete([]);
    setError(null);
    setSuccess(null);
  }, []);

  const handleGenerate = async () => {
    if (!file) {
      setError('Envie um arquivo PDF primeiro.');
      return;
    }
    if (markedForDelete.length === 0) {
      setError('Marque pelo menos uma página para remover.');
      return;
    }
    if (remainingCount < 1) {
      setError(
        'Não é possível remover todas as páginas. Mantenha ao menos uma.'
      );
      return;
    }

    const signal = job.beginJob();
    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setProgress(0);
    setProgressMsg('Removendo páginas…');
    resetPreview();

    const startedAt = ga.startProcess(1);

    try {
      const bytes = await removePagesFromPdf(
        file,
        markedForDelete,
        ({ percent, message }) => {
          setProgress(percent);
          setProgressMsg(message);
        },
        signal
      );

      if (signal.aborted || !job.isMounted()) return;

      const stableBytes = new Uint8Array(bytes);
      const fileName = removedPagesFileName(file.name);

      setPreviewBytes(stableBytes);
      setPreviewFileName(fileName);
      setIsModalOpen(true);
      setSuccess(
        `Novo PDF gerado com ${remainingCount} página${remainingCount === 1 ? '' : 's'}. Confira a pré-visualização e baixe quando quiser.`
      );
      ga.endProcess(true, startedAt);
    } catch (err) {
      if (job.isAbortError(err) || !job.isMounted()) return;
      setError(
        err instanceof Error
          ? err.message
          : 'Falha inesperada ao gerar o PDF.'
      );
      setProgress(0);
      setProgressMsg('');
      ga.endProcess(false, startedAt);
    } finally {
      job.endJob(signal);
      if (job.isMounted()) setIsProcessing(false);
    }
  };

  const handleClosePreview = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleDownloadFromPreview = useCallback(() => {
    if (!previewBytes) return;
    const name = previewFileName || 'pdf-sem-paginas.pdf';
    const blob = new Blob([new Uint8Array(previewBytes)], {
      type: 'application/pdf',
    });
    downloadBlob(blob, name);
    ga.trackDownload(name);
    setIsModalOpen(false);
    setSuccess('Download iniciado. O arquivo permanece só no seu dispositivo.');
  }, [previewBytes, previewFileName, ga]);

  // Revoga data URLs grandes ao desmontar / trocar arquivo (best-effort)
  useEffect(() => {
    return () => {
      setThumbs([]);
    };
  }, [file]);

  const busy = isProcessing || isLoadingThumbs;
  const canGenerate =
    !!file &&
    thumbs.length > 0 &&
    markedForDelete.length > 0 &&
    remainingCount >= 1 &&
    !busy;

  const seo = getSeoForPath('/remover-paginas');

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Ferramenta gratuita · Sem upload
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Remover Páginas
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Visualize as páginas em miniaturas, marque as que deseja excluir e
            baixe um novo PDF — tudo com pdf-lib e pdf.js no seu navegador.
          </p>
        </header>

        {!file ? (
          <DropZone
            onFiles={handleFiles}
            disabled={busy}
            multiple={false}
            onReject={(msg) => setError(msg)}
            labels={{
              idle: 'Arraste e solte seu PDF',
              dragging: 'Solte o PDF aqui',
              hint: `ou clique para escolher · ${dropZoneLimitHint('pdf_single')}`,
              ariaLabel: 'Selecionar PDF para remover páginas',
            }}
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
                  {thumbs.length > 0 && (
                    <>
                      {' · '}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {thumbs.length} página{thumbs.length === 1 ? '' : 's'}
                      </span>
                    </>
                  )}
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

            {isLoadingThumbs && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Gerando miniaturas das páginas…
              </div>
            )}

            {thumbs.length > 0 && (
              <div className="space-y-4 border-t border-slate-200 pt-5 dark:border-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Clique na lixeira para marcar páginas a remover.
                    {markedForDelete.length > 0 && (
                      <>
                        {' '}
                        <strong className="font-semibold text-red-600 dark:text-red-400">
                          {markedForDelete.length} marcada
                          {markedForDelete.length === 1 ? '' : 's'}
                        </strong>
                        {' · '}
                        restarão {remainingCount}
                      </>
                    )}
                  </p>
                  {markedForDelete.length > 0 && (
                    <button
                      type="button"
                      className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
                      disabled={busy}
                      onClick={clearMarks}
                    >
                      Limpar seleção
                    </button>
                  )}
                </div>

                <ul
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                  aria-label="Páginas do PDF"
                >
                  {thumbs.map((thumb) => {
                    const marked = markedSet.has(thumb.index);
                    return (
                      <li key={thumb.index}>
                        <div
                          className={`relative overflow-hidden rounded-xl border bg-slate-50 transition dark:bg-slate-800/50 ${
                            marked
                              ? 'border-red-400 ring-2 ring-red-400/60 dark:border-red-500 dark:ring-red-500/50'
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="relative aspect-[3/4] w-full">
                            {thumb.dataUrl ? (
                              <img
                                src={thumb.dataUrl}
                                alt={`Página ${thumb.pageNumber}`}
                                className={`h-full w-full object-contain object-top ${
                                  marked ? 'opacity-40' : ''
                                }`}
                                draggable={false}
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                                Pág. {thumb.pageNumber}
                              </div>
                            )}

                            {marked && (
                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-red-500/10">
                                <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                  Remover
                                </span>
                              </div>
                            )}

                            <button
                              type="button"
                              className={`absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                                marked
                                  ? 'bg-red-600 text-white hover:bg-red-700'
                                  : 'bg-white/95 text-slate-700 hover:bg-red-50 hover:text-red-600 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-red-950 dark:hover:text-red-300'
                              }`}
                              disabled={busy}
                              onClick={() => toggleMark(thumb.index)}
                              aria-pressed={marked}
                              aria-label={
                                marked
                                  ? `Desmarcar página ${thumb.pageNumber}`
                                  : `Marcar página ${thumb.pageNumber} para remover`
                              }
                              title={
                                marked
                                  ? 'Desmarcar remoção'
                                  : 'Marcar para remover'
                              }
                            >
                              {marked ? (
                                <X className="h-4 w-4" aria-hidden />
                              ) : (
                                <Trash2 className="h-4 w-4" aria-hidden />
                              )}
                            </button>
                          </div>
                          <p className="border-t border-slate-200 px-2 py-1.5 text-center text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400">
                            Página {thumb.pageNumber}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    className="btn-primary w-full sm:w-auto sm:min-w-[220px]"
                    disabled={!canGenerate}
                    onClick={() => void handleGenerate()}
                    aria-describedby={error ? errorId : undefined}
                    aria-busy={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        Gerando PDF…
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" aria-hidden />
                        Gerar Novo PDF
                        {markedForDelete.length > 0 &&
                          ` (−${markedForDelete.length})`}
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
              </div>
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
          <SuccessAction
            message={success}
            toolName={TOOL_NAMES.REMOVER_PAGINAS}
          />
        )}

        <ProgressBar
          visible={busy || progress === 100}
          percent={progress}
          message={
            progressMsg ||
            (isLoadingThumbs
              ? 'Gerando miniaturas…'
              : 'Processando páginas…')
          }
        />

        <div className="lg:hidden">
          <AdSlot placement="below-cta" />
        </div>

        <section className="card text-sm text-slate-600 dark:text-slate-400">
          <h2 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
            Como funciona
          </h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Envie 1 PDF.</li>
            <li>
              As miniaturas são geradas localmente com{' '}
              <strong className="font-semibold text-slate-800 dark:text-slate-200">
                pdf.js
              </strong>
              .
            </li>
            <li>Marque com a lixeira as páginas a excluir.</li>
            <li>
              Clique em <em>Gerar Novo PDF</em> —{' '}
              <strong className="font-semibold text-slate-800 dark:text-slate-200">
                pdf-lib
              </strong>{' '}
              remove as páginas (de trás para frente) e abre a pré-visualização
              antes do download.
            </li>
          </ol>
        </section>

        <FileLimitsNotice
          profile="pdf_single"
          title="Limites técnicos desta ferramenta"
          compact
          headingLevel="h2"
          headingId="limites-remover"
        />

        <ToolSeoContent content={removerPaginasSeoContent} />

        <FaqAccordion
          title="Perguntas frequentes sobre Remover Páginas"
          subtitle="Seleção, PDF final e privacidade do processamento local."
          items={removeFaqItems}
        />
      </div>

      <StickyCta />

      <PdfPreviewModal
        isOpen={isModalOpen}
        pdfBytes={previewBytes}
        fileName={previewFileName}
        onClose={handleClosePreview}
        onDownload={handleDownloadFromPreview}
        toolName={TOOL_NAMES.REMOVER_PAGINAS}
      />
    </>
  );
}
