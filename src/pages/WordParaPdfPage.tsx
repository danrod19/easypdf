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
import { wordParaPdfSeoContent } from '../data/toolSeoContent';
import { TOOL_NAMES } from '../data/toolNames';
import { useToolAnalytics } from '../hooks/useToolAnalytics';
import { useFileIntake } from '../hooks/useFileIntake';
import { dropZoneLimitHint } from '../lib/fileValidation';
import {
  convertDocxToPdf,
  DOCX_MIME,
  isDocxFile,
} from '../lib/wordToPdf';
import { downloadBlob, formatBytes } from '../lib/format';

function buildConvertedFileName(originalName: string) {
  const stamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, '-');
  const baseName = originalName.replace(/\.docx$/i, '') || 'documento';
  return `${baseName}-convertido-${stamp}.pdf`;
}

/**
 * Página /word-para-pdf — DOCX → PDF 100% no navegador (mammoth + html2pdf.js).
 */
export default function WordParaPdfPage() {
  const errorId = useId();
  const ga = useToolAnalytics(TOOL_NAMES.WORD_PARA_PDF);
  const intake = useFileIntake(TOOL_NAMES.WORD_PARA_PDF, 'docx');

  const [file, setFile] = useState<File | null>(null);
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
    resetResult();
  }, [resetResult]);

  const handleFiles = useCallback(
    async (files: File[]) => {
      const next = files[0];
      if (!next) return;

      if (!isDocxFile(next)) {
        setError(
          'Apenas arquivos .docx são aceitos (Microsoft Word OOXML).'
        );
        return;
      }

      const gate = await intake([next]);
      if (!gate.ok) {
        setError(gate.message);
        return;
      }

      resetResult();
      setFile(gate.files[0] ?? next);
      ga.trackUpload(gate.files);
    },
    [ga, intake, resetResult]
  );

  const handleConvert = async () => {
    if (!file) {
      setError('Envie um arquivo .docx primeiro.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setProgress(0);
    setProgressMsg('Processando documento…');
    resetPreview();

    const startedAt = ga.startProcess(1);

    try {
      const bytes = await convertDocxToPdf(file, ({ percent, message }) => {
        setProgress(percent);
        setProgressMsg(message);
      });

      const stableBytes = new Uint8Array(bytes);
      const fileName = buildConvertedFileName(file.name);

      setPreviewBytes(stableBytes);
      setPreviewFileName(fileName);
      setIsModalOpen(true);
      setSuccess(
        'PDF gerado com sucesso. Confira a pré-visualização e baixe quando quiser.'
      );
      ga.endProcess(true, startedAt);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Falha inesperada ao converter o documento.';
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
    const name = previewFileName || 'documento-convertido.pdf';
    const blob = new Blob([new Uint8Array(previewBytes)], {
      type: 'application/pdf',
    });
    downloadBlob(blob, name);
    ga.trackDownload(name);
    setIsModalOpen(false);
    setSuccess('Download iniciado. O arquivo permanece só no seu dispositivo.');
  }, [previewBytes, previewFileName, ga]);

  const canConvert = !!file && !isProcessing;

  const seo = getSeoForPath('/word-para-pdf');

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Ferramenta gratuita · Sem upload
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Word para PDF
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Converta arquivos{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              .docx
            </strong>{' '}
            em PDF sem upload. O fluxo usa{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              mammoth
            </strong>{' '}
            (DOCX → HTML) e{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              html2pdf.js
            </strong>{' '}
            (HTML → PDF A4) — tudo no seu navegador.
          </p>
        </header>

        {!file ? (
          <DropZone
            onFiles={handleFiles}
            disabled={isProcessing}
            multiple={false}
            accept={`${DOCX_MIME},.docx`}
            acceptFile={isDocxFile}
            onReject={(msg) => setError(msg)}
            labels={{
              idle: 'Arraste e solte seu DOCX',
              dragging: 'Solte o documento aqui',
              hint: `ou clique para escolher · ${dropZoneLimitHint('docx')}`,
              ariaLabel: 'Selecionar arquivo DOCX',
              rejectMessage:
                'Apenas arquivos .docx são aceitos (Microsoft Word OOXML).',
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
                  {formatBytes(file.size)} · DOCX
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary shrink-0"
                disabled={isProcessing}
                onClick={clearFile}
              >
                Trocar arquivo
              </button>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center dark:border-slate-700">
              <button
                type="button"
                className="btn-primary w-full sm:w-auto sm:min-w-[220px]"
                disabled={!canConvert}
                onClick={() => void handleConvert()}
                aria-describedby={error ? errorId : undefined}
                aria-busy={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Spinner />
                    Processando documento…
                  </>
                ) : (
                  <>
                    <WordIcon />
                    Converter para PDF
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
          <SuccessAction message={success} toolName={TOOL_NAMES.WORD_PARA_PDF} />
        )}

        <ProgressBar
          visible={isProcessing || progress === 100}
          percent={progress}
          message={progressMsg || 'Processando documento…'}
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
            <li>Arraste ou selecione 1 arquivo .docx.</li>
            <li>
              Clique em <em>Converter para PDF</em> — o DOCX vira HTML com
              mammoth (localmente).
            </li>
            <li>
              O HTML é envolvido numa string com estilos fixos (fundo branco /
              texto preto) e convertido em PDF A4 via html2pdf.js — sem
              elementos ocultos no React.
            </li>
            <li>
              O PDF abre em pré-visualização e, ao baixar, usa o nome{' '}
              <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                nome-convertido-timestamp.pdf
              </code>
              .
            </li>
          </ol>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
            Limitação: formatação complexa (text boxes, SmartArt, macros,
            campos avançados) pode não ser reproduzida com fidelidade total —
            é uma conversão client-side via HTML.
          </p>
        </section>

        <ToolSeoContent content={wordParaPdfSeoContent} />

        <FaqAccordion
          title="Perguntas frequentes sobre Word para PDF"
          subtitle="Privacidade, custo e como a conversão local funciona no navegador."
        />
      </div>

      <StickyCta />

      <PdfPreviewModal
        isOpen={isModalOpen}
        pdfBytes={previewBytes}
        fileName={previewFileName}
        onClose={handleClosePreview}
        onDownload={handleDownloadFromPreview}
        toolName={TOOL_NAMES.WORD_PARA_PDF}
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

function WordIcon() {
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
      <path d="M9 15l1.5-4L12 15l1.5-4L15 15" />
    </svg>
  );
}
