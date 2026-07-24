import { useCallback, useId, useState } from 'react';
import { Download, FileDown, Loader2, Minimize2 } from 'lucide-react';
import { Seo } from '../components/Seo';
import { getSeoForPath } from '../data/seo';
import { AdSlot } from '../components/AdSlot';
import { ProgressBar } from '../components/ProgressBar';
import { DropZone } from '../components/merge/DropZone';
import { FaqAccordion } from '../components/FaqAccordion';
import { StickyCta } from '../components/StickyCta';
import { SuccessAction } from '../components/SuccessAction';
import { ToolSeoContent } from '../components/ToolSeoContent';
import { comprimirPdfSeoContent } from '../data/toolSeoContent';
import {
  COMPRESSION_PRESETS,
  DEFAULT_COMPRESSION_LEVEL,
  compressPdf,
  compressedFileName,
  type CompressionLevel,
  type CompressPdfResult,
} from '../lib/compressPdf';
import { downloadBlob, formatBytes } from '../lib/format';
import type { FaqItem } from '../data/faq';

const LEVEL_ORDER: CompressionLevel[] = ['low', 'medium', 'high'];

const compressFaqItems: FaqItem[] = [
  {
    id: 'como-funciona',
    question: 'Como a compressão funciona no navegador?',
    answer:
      'Cada página é renderizada em canvas (pdf.js), convertida em JPEG com a qualidade do nível escolhido e montada de novo com pdf-lib. Tudo ocorre no seu dispositivo — sem upload e sem Ghostscript no servidor.',
  },
  {
    id: 'texto-selecionavel',
    question: 'Posso continuar selecionando texto no PDF comprimido?',
    answer:
      'Em geral não. Para garantir privacidade e compressão local, as páginas viram imagens. O visual (scans, fotos, layout) se mantém; texto deixará de ser pesquisável/selecionável. Ideal para PDFs escaneados ou com imagens pesadas.',
  },
  {
    id: 'qual-nivel',
    question: 'Qual nível de compressão devo usar?',
    answer:
      'Média (Recomendado) equilibra tamanho e nitidez. Use Baixa se precisar de mais detalhe (impressão) e Alta para o menor arquivo possível (envio por e-mail/WhatsApp), aceitando mais perda visual.',
  },
  {
    id: 'seguro',
    question: 'É seguro comprimir PDFs aqui?',
    answer:
      'Sim. O arquivo não sobe para a nuvem. Processamento 100% no navegador; o original permanece no seu disco e só a cópia comprimida é baixada.',
  },
];

/**
 * Página /comprimir-pdf — reduz tamanho via rasterização (pdf.js + pdf-lib).
 */
export default function ComprimirPdfPage() {
  const errorId = useId();
  const levelGroupId = useId();

  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>(
    DEFAULT_COMPRESSION_LEVEL
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState<CompressPdfResult | null>(null);

  const resetResult = useCallback(() => {
    setError(null);
    setSuccess(null);
    setProgress(0);
    setProgressMsg('');
    setResult(null);
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    resetResult();
  }, [resetResult]);

  const handleFiles = useCallback(
    (files: File[]) => {
      const next = files[0];
      if (!next) return;
      resetResult();
      setFile(next);
    },
    [resetResult]
  );

  const handleCompress = async () => {
    if (!file) {
      setError('Envie um arquivo PDF primeiro.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setResult(null);
    setProgress(0);
    setProgressMsg('Iniciando compressão…');

    try {
      const out = await compressPdf(file, level, ({ percent, message }) => {
        setProgress(percent);
        setProgressMsg(message);
      });

      setResult(out);

      const blob = new Blob([new Uint8Array(out.bytes)], {
        type: 'application/pdf',
      });
      downloadBlob(blob, compressedFileName(file.name, level));

      const reductionLabel =
        out.reductionPercent > 0
          ? `Redução de ${out.reductionPercent.toFixed(1)}%.`
          : out.reductionPercent < 0
            ? `O arquivo ficou ${Math.abs(out.reductionPercent).toFixed(1)}% maior (comum em PDFs já leves ou vetoriais).`
            : 'Tamanho praticamente igual ao original.';

      setSuccess(
        `PDF comprimido com sucesso. ${reductionLabel} O download deve ter iniciado.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Falha inesperada ao comprimir o PDF.'
      );
      setProgress(0);
      setProgressMsg('');
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const canCompress = !!file && !isProcessing;
  const seo = getSeoForPath('/comprimir-pdf');

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Ferramenta gratuita · Sem upload
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Comprimir PDF
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Reduza o tamanho de PDFs escaneados ou com imagens pesadas no
            navegador. Cada página é re-renderizada em JPEG —{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              sem enviar o arquivo para a nuvem
            </strong>
            .
          </p>
        </header>

        {!file ? (
          <DropZone
            onFiles={handleFiles}
            disabled={isProcessing}
            multiple={false}
            labels={{
              idle: 'Arraste e solte seu PDF',
              dragging: 'Solte o PDF aqui',
              hint: 'ou clique para escolher · 1 arquivo · compressão local por rasterização',
              ariaLabel: 'Selecionar PDF para comprimir',
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
                  Tamanho original:{' '}
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {formatBytes(file.size)}
                  </span>
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

            <div className="space-y-3 border-t border-slate-200 pt-5 dark:border-slate-700">
              <div>
                <p
                  id={levelGroupId}
                  className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Nível de compressão
                </p>
                <div
                  className="grid gap-2 sm:grid-cols-3"
                  role="radiogroup"
                  aria-labelledby={levelGroupId}
                >
                  {LEVEL_ORDER.map((id) => {
                    const preset = COMPRESSION_PRESETS[id];
                    const selected = level === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={isProcessing}
                        onClick={() => {
                          setLevel(id);
                          resetResult();
                        }}
                        className={`rounded-xl border px-3 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                          selected
                            ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500 dark:border-brand-400 dark:bg-brand-950/40 dark:ring-brand-400'
                            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600'
                        }`}
                      >
                        <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {preset.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                          {preset.description}
                        </span>
                        <span className="mt-1.5 block text-[11px] text-slate-400 dark:text-slate-500">
                          JPEG {Math.round(preset.jpegQuality * 100)}% · escala{' '}
                          {preset.scale}×
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-500">
                A compressão local converte páginas em imagens. Isso reduz
                muito o peso de scans e fotos, mas remove a seleção de texto no
                arquivo gerado.
              </p>

              <button
                type="button"
                className="btn-primary w-full sm:w-auto sm:min-w-[220px]"
                disabled={!canCompress}
                onClick={() => void handleCompress()}
                aria-describedby={error ? errorId : undefined}
                aria-busy={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Comprimindo…
                  </>
                ) : (
                  <>
                    <Minimize2 className="h-4 w-4" aria-hidden />
                    Comprimir PDF
                  </>
                )}
              </button>
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

        {result && (
          <div className="card space-y-4 border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                <FileDown className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                  Resultado da compressão
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Nível:{' '}
                  <strong className="font-medium text-slate-800 dark:text-slate-200">
                    {COMPRESSION_PRESETS[result.level].label} (
                    {COMPRESSION_PRESETS[result.level].description})
                  </strong>
                  {' · '}
                  {result.pageCount} página
                  {result.pageCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <dl className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Original
                </dt>
                <dd className="mt-0.5 text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {formatBytes(result.originalSize)}
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Comprimido
                </dt>
                <dd className="mt-0.5 text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {formatBytes(result.compressedSize)}
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Redução
                </dt>
                <dd
                  className={`mt-0.5 text-lg font-semibold ${
                    result.reductionPercent > 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : result.reductionPercent < 0
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-slate-900 dark:text-slate-50'
                  }`}
                >
                  {result.reductionPercent > 0 ? '−' : result.reductionPercent < 0 ? '+' : ''}
                  {Math.abs(result.reductionPercent).toFixed(1)}%
                </dd>
              </div>
            </dl>

            <button
              type="button"
              className="btn-secondary w-full sm:w-auto"
              onClick={() => {
                const blob = new Blob([new Uint8Array(result.bytes)], {
                  type: 'application/pdf',
                });
                downloadBlob(
                  blob,
                  compressedFileName(file?.name || 'documento.pdf', result.level)
                );
              }}
            >
              <Download className="h-4 w-4" aria-hidden />
              Baixar novamente
            </button>
          </div>
        )}

        {success && <SuccessAction message={success} />}

        <ProgressBar
          visible={isProcessing || progress === 100}
          percent={progress}
          message={progressMsg || 'Comprimindo PDF…'}
        />

        <div className="lg:hidden">
          <AdSlot placement="below-cta" />
        </div>

        <section className="card text-sm text-slate-600 dark:text-slate-400">
          <h2 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
            Como funciona
          </h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Envie 1 PDF (sem senha).</li>
            <li>
              Escolha o nível: Baixa (qualidade), Média (recomendado) ou Alta
              (menor arquivo).
            </li>
            <li>
              Clique em <em>Comprimir PDF</em> — pdf.js renderiza cada página e
              a pdf-lib monta um PDF novo com JPEGs.
            </li>
            <li>
              Veja o tamanho final e a % de redução e baixe a cópia comprimida.
            </li>
          </ol>
        </section>

        <ToolSeoContent content={comprimirPdfSeoContent} />

        <FaqAccordion
          title="Perguntas frequentes sobre Comprimir PDF"
          subtitle="Qualidade, texto selecionável e privacidade do processamento local."
          items={compressFaqItems}
        />
      </div>

      <StickyCta />
    </>
  );
}
