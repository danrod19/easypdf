import { useCallback, useEffect, useId, useState } from 'react';
import { Seo } from '../components/Seo';
import { AdSlot } from '../components/AdSlot';
import { ProgressBar } from '../components/ProgressBar';
import { DropZone } from '../components/merge/DropZone';
import { FaqAccordion } from '../components/FaqAccordion';
import { StickyCta } from '../components/StickyCta';
import { SuccessAction } from '../components/SuccessAction';
import {
  extractTextFromImage,
  isOcrImageFile,
  OCR_IMAGE_ACCEPT,
} from '../lib/extractText';
import { downloadBlob, formatBytes } from '../lib/format';

/**
 * Página /extrair-texto — OCR com tesseract.js (Web Worker + WASM).
 * Processamento 100% no navegador; worker encerrado após cada leitura.
 */
export default function ExtrairTextoPage() {
  const errorId = useId();
  const textareaId = useId();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasResult, setHasResult] = useState(false);

  // Preview + cleanup de object URL
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Auto-dismiss de alertas de sucesso
  useEffect(() => {
    if (!success) return;
    const t = window.setTimeout(() => setSuccess(null), 3500);
    return () => window.clearTimeout(t);
  }, [success]);

  const runOcr = useCallback(async (image: File) => {
    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setHasResult(false);
    setText('');
    setProgress(0);
    setProgressMsg('Lendo a imagem…');

    try {
      const result = await extractTextFromImage(image, ({ percent, message }) => {
        setProgress(percent);
        setProgressMsg(message);
      });

      setText(result);
      setHasResult(true);

      if (!result) {
        setSuccess(
          'OCR concluído, mas nenhum texto foi detectado. Tente uma imagem mais nítida.'
        );
      } else {
        setSuccess('Texto extraído com sucesso! Você pode editar, copiar ou baixar.');
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Erro ao ler imagem.';
      setError(message);
      setProgress(0);
      setProgressMsg('');
      setHasResult(false);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleFiles = useCallback(
    (files: File[]) => {
      const next = files[0];
      if (!next) return;

      if (!isOcrImageFile(next)) {
        setError('Apenas 1 imagem JPEG, PNG ou WebP é aceita.');
        return;
      }

      setFile(next);
      setError(null);
      setSuccess(null);
      // Inicia OCR assim que a imagem chega
      void runOcr(next);
    },
    [runOcr]
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
    const base = file?.name.replace(/\.[^.]+$/i, '') || 'ocr';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `${base}-ocr-${stamp}.txt`);
    setError(null);
    setSuccess('Arquivo .TXT baixado!');
  };

  return (
    <>
      <Seo
        title="Extrair Texto (OCR)"
        description="Extraia texto de imagens com Tesseract.js 100% no navegador. Seus arquivos não são enviados para nenhum servidor."
      />

      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Ferramenta gratuita
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Extrair Texto (OCR)
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Reconhecimento óptico de caracteres com{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              tesseract.js
            </strong>{' '}
            em Web Worker (WASM). Idioma:{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              português
            </strong>
            . Nada é enviado para a nuvem.
          </p>
        </header>

        <DropZone
          onFiles={handleFiles}
          disabled={isProcessing}
          multiple={false}
          accept={OCR_IMAGE_ACCEPT}
          acceptFile={isOcrImageFile}
          onReject={() =>
            setError('Apenas 1 imagem JPEG, PNG ou WebP é aceita.')
          }
          labels={{
            idle: 'Arraste e solte uma imagem',
            dragging: 'Solte a imagem aqui',
            hint: 'ou clique para escolher · 1 arquivo · JPEG, PNG ou WebP · OCR local',
            ariaLabel: 'Selecionar imagem para OCR',
            rejectMessage: 'Apenas 1 imagem JPEG, PNG ou WebP é aceita.',
          }}
        />

        {file && (
          <div className="card space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                {previewUrl && (
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                    <img
                      src={previewUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </div>
                )}
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Imagem
                  </p>
                  <p className="truncate font-semibold text-slate-800 dark:text-slate-100">
                    {file.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-primary sm:min-w-[180px]"
                  disabled={isProcessing}
                  onClick={() => void runOcr(file)}
                  aria-busy={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Spinner />
                      Lendo a imagem…
                    </>
                  ) : (
                    <>
                      <OcrIcon />
                      {hasResult ? 'Ler novamente' : 'Extrair texto'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={isProcessing}
                  onClick={clearFile}
                >
                  Trocar imagem
                </button>
              </div>
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
          message={progressMsg || 'Lendo a imagem…'}
        />

        {hasResult && (
          <SuccessAction message="Texto extraído com sucesso!" />
        )}

        {hasResult && (
          <section className="card space-y-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Texto extraído
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Edite o resultado se o OCR falhar em alguma palavra.
                </p>
              </div>
            </div>

            <label htmlFor={textareaId} className="sr-only">
              Texto extraído pelo OCR
            </label>
            <textarea
              id={textareaId}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={14}
              spellCheck
              className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono text-sm leading-relaxed text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-400"
              placeholder="O texto reconhecido aparecerá aqui…"
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
                Baixar como .TXT
              </button>
            </div>
          </section>
        )}

        {/* Slot AdSense mobile — abaixo do CTA */}
        <div className="lg:hidden">
          <AdSlot placement="below-cta" />
        </div>

        <section className="card text-sm text-slate-600 dark:text-slate-400">
          <h2 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
            Como funciona
          </h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Envie 1 imagem (JPEG, PNG ou WebP).</li>
            <li>
              O Tesseract sobe em um Web Worker com o modelo de português e
              processa a imagem localmente.
            </li>
            <li>
              Acompanhe o progresso na barra — a UI permanece responsiva.
            </li>
            <li>
              Revise o texto no editor, copie ou baixe como{' '}
              <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                .txt
              </code>
              .
            </li>
          </ol>
          <p className="mt-3 text-xs text-slate-500">
            Na primeira execução o navegador pode baixar o modelo de idioma
            (~alguns MB) e guardá-lo em cache local — ainda assim, a imagem
            nunca sai do seu dispositivo.
          </p>
        </section>

        <FaqAccordion
          title="Perguntas frequentes sobre OCR"
          subtitle="Privacidade, custo e como o reconhecimento local funciona no navegador."
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

function OcrIcon() {
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
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
