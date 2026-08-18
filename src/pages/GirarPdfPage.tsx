import { useCallback, useId, useMemo, useState } from 'react';
import {
  Loader2,
  RotateCcw,
  RotateCw,
  Save,
  Undo2,
} from 'lucide-react';
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
import { girarPdfSeoContent } from '../data/toolSeoContent';
import { TOOL_NAMES } from '../data/toolNames';
import { useToolAnalytics } from '../hooks/useToolAnalytics';
import { useFileIntake } from '../hooks/useFileIntake';
import { useAbortablePdfJob } from '../hooks/useAbortablePdfJob';
import { dropZoneLimitHint } from '../lib/fileValidation';
import {
  applyRotationDelta,
  countPendingRotations,
  createZeroRotations,
  getPdfPageCount,
  normalizeAngle,
  parsePageRange,
  rotatedFileName,
} from '../lib/rotatePdf';
import { applyRotationsPreferWorker } from '../lib/pdfOpsWorker';
import { downloadBlob, formatBytes } from '../lib/format';
import type { FaqItem } from '../data/faq';

const rotateFaqItems: FaqItem[] = [
  {
    id: 'qualidade',
    question: 'Girar o PDF afeta a qualidade?',
    answer:
      'Não. A rotação no PDF é apenas um metadado de orientação da página (0°, 90°, 180° ou 270°). O conteúdo vetorial e as imagens embutidas permanecem intactos — não há recompactação nem perda de nitidez. O download usa o mesmo documento, só com o ângulo atualizado via pdf-lib no seu navegador.',
  },
  {
    id: 'uma-pagina',
    question: 'Como girar apenas uma página do PDF?',
    answer:
      'Na seção “Girar páginas específicas”, digite o número da página (ex.: 3) ou um intervalo (ex.: 1, 3-5) e clique em Girar 90° à esquerda ou à direita. Somente as páginas listadas recebem a rotação. Depois use “Salvar PDF Rotacionado” para baixar o arquivo completo.',
  },
  {
    id: 'seguro-girar',
    question: 'É seguro girar meus PDFs aqui?',
    answer:
      'Sim. Todo o processamento roda 100% offline no navegador com pdf-lib. O arquivo nunca é enviado a servidores — fica só na memória do seu dispositivo até você baixar o resultado ou fechar a aba.',
  },
  {
    id: 'pagar-girar',
    question: 'Preciso pagar para girar PDFs?',
    answer:
      'Não. Girar PDF é gratuito e sem cadastro. Você pode rotacionar todas as páginas ou intervalos específicos quantas vezes quiser, e só baixa quando clicar em Salvar.',
  },
  {
    id: 'salvar',
    question: 'Por que preciso clicar em Salvar depois de girar?',
    answer:
      'Os botões de rotação apenas ajustam o estado local (ângulo de cada página). Assim você pode combinar várias rotações (todas as páginas + páginas específicas) antes de gerar o arquivo. “Salvar PDF Rotacionado” aplica tudo de uma vez e inicia o download como nome-rotacionado.pdf.',
  },
];

type Mode = 'all' | 'specific';

/**
 * Página /girar-pdf — rotação de páginas 100% no navegador com pdf-lib.
 */
export default function GirarPdfPage() {
  const errorId = useId();
  const rangeId = useId();
  const tabAllId = useId();
  const tabSpecificId = useId();
  const panelAllId = useId();
  const panelSpecificId = useId();
  const ga = useToolAnalytics(TOOL_NAMES.GIRAR_PDF);
  const intake = useFileIntake(TOOL_NAMES.GIRAR_PDF, 'pdf_single');
  const job = useAbortablePdfJob();

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  /** Delta de rotação por página (graus adicionais sobre o original). */
  const [rotations, setRotations] = useState<number[]>([]);
  const [mode, setMode] = useState<Mode>('all');
  const [rangeInput, setRangeInput] = useState('');
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  /** true apenas após gerar o PDF rotacionado (não em rotações intermediárias) */
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewBytes, setPreviewBytes] = useState<Uint8Array | null>(null);
  const [previewFileName, setPreviewFileName] = useState('');

  const pendingCount = useMemo(
    () => countPendingRotations(rotations),
    [rotations]
  );

  const resetPreview = useCallback(() => {
    setIsModalOpen(false);
    setPreviewBytes(null);
    setPreviewFileName('');
  }, []);

  const resetResult = useCallback(() => {
    setError(null);
    setSuccess(null);
    setDownloadSuccess(false);
    setProgress(0);
    setProgressMsg('');
    resetPreview();
  }, [resetPreview]);

  const clearFile = useCallback(() => {
    setFile(null);
    setPageCount(null);
    setRotations([]);
    setRangeInput('');
    setMode('all');
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

      setIsLoadingMeta(true);
      resetResult();
      setFile(accepted);
      setPageCount(null);
      setRotations([]);
      setRangeInput('');

      try {
        const count = await getPdfPageCount(accepted);
        setPageCount(count);
        setRotations(createZeroRotations(count));
        ga.trackUpload(gate.files);
      } catch (err) {
        setFile(null);
        setPageCount(null);
        setRotations([]);
        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível ler o PDF.'
        );
      } finally {
        setIsLoadingMeta(false);
      }
    },
    [ga, intake, resetResult]
  );

  const rotatePages = useCallback(
    (direction: 'left' | 'right', indices: number[]) => {
      if (pageCount == null || rotations.length === 0) {
        setError('Envie um arquivo PDF primeiro.');
        return;
      }

      try {
        const next = applyRotationDelta(rotations, indices, direction);
        setRotations(next);
        setError(null);
        setDownloadSuccess(false);
        // Prévia anterior deixa de refletir o estado pendente
        setIsModalOpen(false);
        setPreviewBytes(null);
        setPreviewFileName('');
        const n = indices.length;
        setSuccess(
          n === pageCount
            ? `Todas as ${n} páginas giradas 90° ${direction === 'right' ? 'à direita' : 'à esquerda'}. Clique em Salvar para baixar.`
            : `${n} página${n === 1 ? '' : 's'} girada${n === 1 ? '' : 's'} com sucesso. Clique em Salvar para baixar.`
        );
      } catch (err) {
        setSuccess(null);
        setDownloadSuccess(false);
        setError(
          err instanceof Error ? err.message : 'Não foi possível girar as páginas.'
        );
      }
    },
    [pageCount, rotations]
  );

  const handleRotateAll = (direction: 'left' | 'right') => {
    if (pageCount == null) return;
    const indices = Array.from({ length: pageCount }, (_, i) => i);
    rotatePages(direction, indices);
  };

  const handleRotateSpecific = (direction: 'left' | 'right') => {
    if (pageCount == null) {
      setError('Envie um arquivo PDF primeiro.');
      return;
    }
    try {
      const indices = parsePageRange(rangeInput, pageCount);
      rotatePages(direction, indices);
    } catch (err) {
      setSuccess(null);
      setError(
        err instanceof Error ? err.message : 'Intervalo de páginas inválido.'
      );
    }
  };

  const handleResetRotations = () => {
    if (pageCount == null) return;
    setRotations(createZeroRotations(pageCount));
    setError(null);
    setDownloadSuccess(false);
    setSuccess('Rotações desfeitas. O PDF voltou à orientação original.');
  };

  const handleSave = async () => {
    if (!file || pageCount == null) {
      setError('Envie um arquivo PDF primeiro.');
      return;
    }
    if (pendingCount === 0) {
      setError(
        'Nenhuma rotação pendente. Gire ao menos uma página antes de salvar.'
      );
      return;
    }

    const signal = job.beginJob();

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setDownloadSuccess(false);
    setProgress(0);
    setProgressMsg('Preparando…');
    resetPreview();

    const startedAt = ga.startProcess(1);

    try {
      const bytes = await applyRotationsPreferWorker(
        file,
        rotations,
        ({ percent, message }) => {
          setProgress(percent);
          setProgressMsg(message);
        },
        signal
      );

      if (signal.aborted || !job.isMounted()) return;

      const outName = rotatedFileName(file.name);
      const stableBytes = new Uint8Array(bytes);
      const blob = new Blob([new Uint8Array(stableBytes)], {
        type: 'application/pdf',
      });

      // A nova base já reflete as rotações — próximas giros empilham sobre ela
      setFile(
        new File([blob], outName, {
          type: 'application/pdf',
          lastModified: Date.now(),
        })
      );
      setRotations(createZeroRotations(pageCount));

      setPreviewBytes(stableBytes);
      setPreviewFileName(outName);
      setIsModalOpen(true);

      setSuccess(
        `PDF rotacionado gerado (${pendingCount} página${pendingCount === 1 ? '' : 's'} alterada${pendingCount === 1 ? '' : 's'}). Confira a pré-visualização e baixe quando quiser.`
      );
      setDownloadSuccess(true);
      ga.endProcess(true, startedAt);
    } catch (err) {
      if (job.isAbortError(err) || !job.isMounted()) return;
      const message =
        err instanceof Error
          ? err.message
          : 'Falha inesperada ao salvar o PDF rotacionado.';
      setError(message);
      setDownloadSuccess(false);
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
    const name = previewFileName || 'pdf-rotacionado.pdf';
    const blob = new Blob([new Uint8Array(previewBytes)], {
      type: 'application/pdf',
    });
    downloadBlob(blob, name);
    ga.trackDownload(name);
    setIsModalOpen(false);
    setSuccess('Download iniciado. O arquivo permanece só no seu dispositivo.');
    setDownloadSuccess(true);
  }, [previewBytes, previewFileName, ga]);

  const busy = isProcessing || isLoadingMeta;
  const canSave = !!file && pageCount != null && pendingCount > 0 && !busy;

  const seo = getSeoForPath('/girar-pdf');

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
            Ferramenta gratuita · Sem upload
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Girar PDF online
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Vire páginas de lado ou de cabeça para baixo: 90° à esquerda ou à
            direita, em todas as páginas ou só um intervalo (ex.:{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">
              1, 3-5
            </code>
            ). Salve a cópia no navegador —{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              sem upload
            </strong>{' '}
            e sem cadastro.
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
              ariaLabel: 'Selecionar PDF para girar páginas',
            }}
          />
        ) : (
          <div className="space-y-5">
            {/* Arquivo carregado */}
            <div className="card space-y-4">
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

              {pendingCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-900 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-200">
                  <RotateCw className="h-4 w-4 shrink-0" aria-hidden />
                  <span>
                    <strong>{pendingCount}</strong> página
                    {pendingCount === 1 ? '' : 's'} com rotação pendente.
                    Salve para baixar.
                  </span>
                  <button
                    type="button"
                    className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-orange-800 underline-offset-2 hover:underline dark:text-orange-200"
                    disabled={busy}
                    onClick={handleResetRotations}
                  >
                    <Undo2 className="h-3.5 w-3.5" aria-hidden />
                    Desfazer tudo
                  </button>
                </div>
              )}
            </div>

            {/* Abas: todas vs específicas */}
            {pageCount != null && !isLoadingMeta && (
              <div className="card space-y-5">
                <div
                  className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-950"
                  role="tablist"
                  aria-label="Modo de rotação"
                >
                  <button
                    type="button"
                    role="tab"
                    id={tabAllId}
                    aria-selected={mode === 'all'}
                    aria-controls={panelAllId}
                    tabIndex={mode === 'all' ? 0 : -1}
                    className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                      mode === 'all'
                        ? 'bg-white text-orange-700 shadow-sm dark:bg-slate-800 dark:text-orange-300'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                    onClick={() => setMode('all')}
                  >
                    Girar todas as páginas
                  </button>
                  <button
                    type="button"
                    role="tab"
                    id={tabSpecificId}
                    aria-selected={mode === 'specific'}
                    aria-controls={panelSpecificId}
                    tabIndex={mode === 'specific' ? 0 : -1}
                    className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                      mode === 'specific'
                        ? 'bg-white text-orange-700 shadow-sm dark:bg-slate-800 dark:text-orange-300'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                    onClick={() => setMode('specific')}
                  >
                    Girar páginas específicas
                  </button>
                </div>

                {mode === 'all' ? (
                  <div
                    role="tabpanel"
                    id={panelAllId}
                    aria-labelledby={tabAllId}
                    className="space-y-4"
                  >
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Aplica 90° em todas as {pageCount} páginas de uma vez.
                      Você pode clicar várias vezes antes de salvar.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-xl border-2 border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800 transition hover:border-orange-300 hover:bg-orange-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-200 dark:hover:border-orange-700 dark:hover:bg-orange-950/70"
                        disabled={busy}
                        onClick={() => handleRotateAll('left')}
                      >
                        <RotateCcw className="h-5 w-5" aria-hidden />
                        Girar 90° à Esquerda
                      </button>
                      <button
                        type="button"
                        className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-xl border-2 border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800 transition hover:border-orange-300 hover:bg-orange-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-200 dark:hover:border-orange-700 dark:hover:bg-orange-950/70"
                        disabled={busy}
                        onClick={() => handleRotateAll('right')}
                      >
                        <RotateCw className="h-5 w-5" aria-hidden />
                        Girar 90° à Direita
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    role="tabpanel"
                    id={panelSpecificId}
                    aria-labelledby={tabSpecificId}
                    className="space-y-4"
                  >
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
                        placeholder="Ex.: 1, 3-5, 8"
                        value={rangeInput}
                        disabled={busy}
                        onChange={(e) => {
                          setRangeInput(e.target.value);
                          setError(null);
                        }}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-orange-400"
                        aria-describedby={`${rangeId}-hint`}
                      />
                      <p
                        id={`${rangeId}-hint`}
                        className="text-xs text-slate-500 dark:text-slate-400"
                      >
                        Use vírgulas e hífens. Ex.:{' '}
                        <span className="font-medium">1</span>,{' '}
                        <span className="font-medium">3-5</span>,{' '}
                        <span className="font-medium">1, 3-5, 8</span>. Total:{' '}
                        {pageCount} página{pageCount === 1 ? '' : 's'}.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-xl border-2 border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800 transition hover:border-orange-300 hover:bg-orange-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-200 dark:hover:border-orange-700 dark:hover:bg-orange-950/70"
                        disabled={busy || !rangeInput.trim()}
                        onClick={() => handleRotateSpecific('left')}
                      >
                        <RotateCcw className="h-5 w-5" aria-hidden />
                        Esquerda (intervalo)
                      </button>
                      <button
                        type="button"
                        className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-xl border-2 border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800 transition hover:border-orange-300 hover:bg-orange-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-200 dark:hover:border-orange-700 dark:hover:bg-orange-950/70"
                        disabled={busy || !rangeInput.trim()}
                        onClick={() => handleRotateSpecific('right')}
                      >
                        <RotateCw className="h-5 w-5" aria-hidden />
                        Direita (intervalo)
                      </button>
                    </div>
                  </div>
                )}

                {/* Resumo por página (compacto) */}
                {pendingCount > 0 && (
                  <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Rotações pendentes
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {rotations.map((deg, i) => {
                        const n = normalizeAngle(deg);
                        if (n === 0) return null;
                        return (
                          <li
                            key={i}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                          >
                            Pág. {i + 1}: +{n}°
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Salvar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className="btn-primary w-full sm:w-auto sm:min-w-[240px] !bg-orange-600 hover:!bg-orange-700 focus-visible:!ring-orange-500"
                disabled={!canSave}
                onClick={() => void handleSave()}
                aria-describedby={error ? errorId : undefined}
                aria-busy={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Salvando…
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" aria-hidden />
                    Salvar PDF Rotacionado
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
              {file && pendingCount === 0 && !isProcessing && !previewBytes && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Gire ao menos uma página para habilitar o salvamento.
                </p>
              )}
            </div>
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

        {success && downloadSuccess && (
          <SuccessAction message={success} toolName={TOOL_NAMES.GIRAR_PDF} />
        )}

        {success && !downloadSuccess && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200"
          >
            {success}
          </div>
        )}

        <ProgressBar
          visible={isProcessing || progress === 100}
          percent={progress}
          message={progressMsg}
        />

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
              Escolha girar <em>todas</em> as páginas ou um <em>intervalo</em>{' '}
              (ex.: 1, 3-5).
            </li>
            <li>
              Clique em girar 90° à esquerda ou à direita — o estado fica
              local até você salvar.
            </li>
            <li>
              Clique em <em>Salvar PDF Rotacionado</em> — o pdf-lib aplica os
              ângulos e a pré-visualização abre antes do download como{' '}
              <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                nome-rotacionado.pdf
              </code>
              .
            </li>
          </ol>
        </section>

        <FileLimitsNotice
          profile="pdf_single"
          title="Limites técnicos desta ferramenta"
          compact
          headingLevel="h2"
          headingId="limites-girar"
        />

        <ToolSeoContent content={girarPdfSeoContent} />

        <FaqAccordion
          items={rotateFaqItems}
          title="Perguntas frequentes sobre Girar PDF"
          subtitle="Qualidade, páginas específicas e privacidade do processamento local."
        />
      </div>

      <StickyCta />

      <PdfPreviewModal
        isOpen={isModalOpen}
        pdfBytes={previewBytes}
        fileName={previewFileName}
        onClose={handleClosePreview}
        onDownload={handleDownloadFromPreview}
        toolName={TOOL_NAMES.GIRAR_PDF}
      />
    </>
  );
}
