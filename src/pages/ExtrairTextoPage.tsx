import { useCallback, useEffect, useId, useState } from 'react';
import { Seo } from '../components/Seo';
import { getSeoForPath } from '../data/seo';
import { AdSlot } from '../components/AdSlot';
import { ProgressBar } from '../components/ProgressBar';
import { DropZone } from '../components/merge/DropZone';
import { FaqAccordion } from '../components/FaqAccordion';
import { StickyCta } from '../components/StickyCta';
import { SuccessAction } from '../components/SuccessAction';
import { ToolSeoContent } from '../components/ToolSeoContent';
import { extrairTextoSeoContent } from '../data/toolSeoContent';
import { TOOL_NAMES } from '../data/toolNames';
import { useToolAnalytics } from '../hooks/useToolAnalytics';
import {
  extractTextFromPdf,
  isPdfFile,
  PDF_EXTRACT_ACCEPT,
} from '../lib/extractText';
import { downloadBlob, formatBytes } from '../lib/format';

/**
 * Página /extrair-texto — texto nativo (pdf.js) ou OCR (Tesseract) em PDF.
 * 100% no navegador; toggle “Forçar OCR” para scans.
 */
export default function ExtrairTextoPage() {
  const errorId = useId();
  const textareaId = useId();
  const toggleId = useId();
  const ga = useToolAnalytics(TOOL_NAMES.EXTRAIR_TEXTO);

  const [file, setFile] = useState<File | null>(null);
  const [forceOcr, setForceOcr] = useState(false);
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasResult, setHasResult] = useState(false);

  useEffect(() => {
    if (!success) return;
    const t = window.setTimeout(() => setSuccess(null), 3500);
    return () => window.clearTimeout(t);
  }, [success]);

  const handleFiles = useCallback(
    (files: File[]) => {
      const next = files[0];
      if (!next) return;

      if (!isPdfFile(next)) {
        setError('Apenas 1 arquivo PDF é aceito.');
        return;
      }

      setFile(next);
      setText('');
      setHasResult(false);
      setError(null);
      setSuccess(null);
      setProgress(0);
      setProgressMsg('');
      ga.trackUpload([next]);
    },
    [ga]
  );

  const clearFile = useCallback(() => {
    if (isProcessing) return;
    setFile(null);
    setText('');
    setHasResult(false);
    setError(null);
    setSuccess(null);
    setProgress(0);
    setProgressMsg('');
  }, [isProcessing]);

  const handleExtract = async () => {
    if (!file) {
      setError('Selecione um arquivo PDF primeiro.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setHasResult(false);
    setText('');
    setProgress(0);
    setProgressMsg(
      forceOcr
        ? 'Iniciando OCR (pode demorar em PDFs longos)…'
        : 'Extraindo texto nativo do PDF…'
    );

    const startedAt = ga.startProcess(1);

    try {
      const result = await extractTextFromPdf(
        file,
        { forceOcr },
        ({ percent, message }) => {
          setProgress(percent);
          setProgressMsg(message);
        }
      );

      setText(result);
      setHasResult(true);

      if (!result.trim()) {
        setSuccess(
          forceOcr
            ? 'OCR concluído, mas nenhum texto foi detectado. Tente maior nitidez no scan ou outra página.'
            : 'Nenhum texto nativo encontrado. Se o PDF for escaneado (só imagem), ative “Forçar OCR” e tente de novo.'
        );
      } else {
        setSuccess(
          forceOcr
            ? 'Texto reconhecido por OCR com sucesso! Revise, copie ou baixe.'
            : 'Texto extraído do PDF com sucesso! Você pode editar, copiar ou baixar.'
        );
      }
      ga.endProcess(true, startedAt);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Falha inesperada ao extrair texto do PDF.';
      setError(message);
      setProgress(0);
      setProgressMsg('');
      setHasResult(false);
      ga.endProcess(false, startedAt);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!text.trim()) {
      setError('Não há texto para copiar.');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setError(null);
      setSuccess('Texto copiado!');
    } catch {
      setError('Não foi possível copiar. Selecione o texto e use Ctrl+C.');
    }
  };

  const handleDownloadTxt = () => {
    if (!text.trim()) {
      setError('Não há texto para baixar.');
      return;
    }
    const stamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, '-');
    const base = file?.name.replace(/\.[^.]+$/i, '') || 'pdf';
    const fileName = `${base}-texto-${stamp}.txt`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, fileName);
    ga.trackDownload(fileName);
    setError(null);
    setSuccess('Arquivo .TXT baixado!');
  };

  const seo = getSeoForPath('/extrair-texto');
  const canExtract = !!file && !isProcessing;

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Ferramenta gratuita · Sem upload
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Extrair texto de PDF
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Copie o texto de PDFs digitais com{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              pdf.js
            </strong>{' '}
            ou use OCR com{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              Tesseract.js
            </strong>{' '}
            (português) em PDFs escaneados. Tudo roda no seu navegador — zero
            envio para a nuvem.
          </p>
        </header>

        <DropZone
          onFiles={handleFiles}
          disabled={isProcessing}
          multiple={false}
          accept={PDF_EXTRACT_ACCEPT}
          acceptFile={isPdfFile}
          onReject={() => setError('Apenas 1 arquivo PDF é aceito.')}
          labels={{
            idle: 'Arraste e solte um PDF',
            dragging: 'Solte o PDF aqui',
            hint: 'ou clique para escolher · 1 arquivo · PDF · processamento local',
            ariaLabel: 'Selecionar PDF para extrair texto',
            rejectMessage: 'Apenas 1 arquivo PDF é aceito.',
          }}
        />

        {file && (
          <div className="card space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Arquivo
                </p>
                <p className="truncate font-semibold text-slate-800 dark:text-slate-100">
                  {file.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {formatBytes(file.size)}
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary shrink-0"
                disabled={isProcessing}
                onClick={clearFile}
              >
                Trocar PDF
              </button>
            </div>
          </div>
        )}

        {/* Toggle Forçar OCR */}
        <div className="card">
          <div className="flex items-start gap-4">
            <button
              type="button"
              id={toggleId}
              role="switch"
              aria-checked={forceOcr}
              aria-describedby={`${toggleId}-hint`}
              disabled={isProcessing}
              onClick={() => setForceOcr((v) => !v)}
              className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-slate-900 ${
                forceOcr
                  ? 'bg-amber-500 dark:bg-amber-500'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  forceOcr ? 'translate-x-5' : 'translate-x-0'
                }`}
                aria-hidden
              />
            </button>
            <div className="min-w-0">
              <label
                htmlFor={toggleId}
                className="cursor-pointer text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                Forçar OCR (Ative apenas para PDFs escaneados. É mais lento)
              </label>
              <p
                id={`${toggleId}-hint`}
                className="mt-1 text-sm text-slate-600 dark:text-slate-400"
              >
                {forceOcr ? (
                  <>
                    <span className="font-medium text-amber-700 dark:text-amber-400">
                      OCR ativo:
                    </span>{' '}
                    cada página será renderizada e lida com Tesseract (idioma{' '}
                    <code className="rounded bg-slate-100 px-1 text-xs dark:bg-slate-800">
                      por
                    </code>
                    ). Use em scans sem texto selecionável.
                  </>
                ) : (
                  <>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Modo rápido:
                    </span>{' '}
                    extrai texto embutido no PDF com pdf.js (
                    <code className="rounded bg-slate-100 px-1 text-xs dark:bg-slate-800">
                      getTextContent
                    </code>
                    ). Ideal para PDFs digitais.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            className="btn-primary w-full sm:w-auto sm:min-w-[200px]"
            disabled={!canExtract}
            onClick={() => void handleExtract()}
            aria-busy={isProcessing}
            aria-describedby={error ? errorId : undefined}
          >
            {isProcessing ? (
              <>
                <Spinner />
                Extraindo…
              </>
            ) : (
              <>
                <ExtractIcon />
                Extrair Texto
              </>
            )}
          </button>
          {!file && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Selecione um PDF para habilitar a extração.
            </p>
          )}
        </div>

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
          message={progressMsg || 'Processando…'}
        />

        {hasResult && text.trim() && (
          <SuccessAction
            message="Texto extraído com sucesso!"
            toolName={TOOL_NAMES.EXTRAIR_TEXTO}
          />
        )}

        {/* Resultado sempre disponível após tentativa bem-sucedida (mesmo vazio editável) */}
        {hasResult && (
          <section className="card space-y-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Texto extraído
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {forceOcr
                    ? 'Revise o OCR — erros em números e nomes são comuns.'
                    : 'Edite se necessário e copie ou baixe como .txt.'}
                </p>
              </div>
            </div>

            <label htmlFor={textareaId} className="sr-only">
              Texto extraído do PDF
            </label>
            <textarea
              id={textareaId}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={16}
              spellCheck
              className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono text-sm leading-relaxed text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-400"
              placeholder="O texto extraído aparecerá aqui…"
            />

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                className="btn-primary w-full sm:w-auto"
                onClick={() => void handleCopy()}
                disabled={!text.trim()}
              >
                <CopyIcon />
                Copiar para a Área de Transferência
              </button>
              <button
                type="button"
                className="btn-secondary w-full sm:w-auto"
                onClick={handleDownloadTxt}
                disabled={!text.trim()}
              >
                <DownloadIcon />
                Baixar como .txt
              </button>
            </div>
          </section>
        )}

        <div className="lg:hidden">
          <AdSlot placement="below-cta" />
        </div>

        <section className="card text-sm text-slate-600 dark:text-slate-400">
          <h2 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
            Como funciona
          </h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Selecione 1 PDF no seu dispositivo.</li>
            <li>
              Deixe o OCR <em>desligado</em> para PDFs com texto selecionável
              (rápido, pdf.js).
            </li>
            <li>
              Ative <em>Forçar OCR</em> só se o PDF for scan/foto de páginas
              (mais lento, Tesseract em português).
            </li>
            <li>
              Clique em <strong>Extrair Texto</strong>, acompanhe o progresso
              (“Lendo página X de Y…”) e copie ou baixe o{' '}
              <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                .txt
              </code>
              .
            </li>
          </ol>
          <p className="mt-3 text-xs text-slate-500">
            No OCR, a primeira execução pode baixar o modelo de idioma (~alguns
            MB) e guardá-lo em cache — o conteúdo do PDF nunca sobe para a
            nuvem.
          </p>
        </section>

        <ToolSeoContent content={extrairTextoSeoContent} />

        <FaqAccordion
          title="Perguntas frequentes sobre Extrair Texto"
          subtitle="Texto nativo, OCR de scans, privacidade e uso offline."
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

function ExtractIcon() {
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
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function CopyIcon() {
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
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function DownloadIcon() {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
