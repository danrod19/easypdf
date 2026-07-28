import { useCallback, useId, useState } from 'react';
import { Loader2, Stamp } from 'lucide-react';
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
import { marcaDaguaSeoContent } from '../data/toolSeoContent';
import { TOOL_NAMES } from '../data/toolNames';
import { useToolAnalytics } from '../hooks/useToolAnalytics';
import { useFileIntake } from '../hooks/useFileIntake';
import { dropZoneLimitHint } from '../lib/fileValidation';
import {
  applyWatermarkToPdf,
  DEFAULT_WATERMARK_OPTIONS,
  getPdfPageCount,
  WATERMARK_LIMITS,
  watermarkedFileName,
  type WatermarkColorName,
  type WatermarkOptions,
  type WatermarkPosition,
} from '../lib/watermarkPdf';
import { downloadBlob, formatBytes } from '../lib/format';
import type { FaqItem } from '../data/faq';

const watermarkFaqItems: FaqItem[] = [
  {
    id: 'todas-paginas',
    question: "A marca d'água é adicionada em todas as páginas?",
    answer:
      "Sim. Ao clicar em Aplicar Marca d'água, o texto é desenhado em cada página do PDF (centro diagonal a 45° ou rodapé, conforme a opção escolhida). O processamento usa pdf-lib no seu navegador — nada é enviado a servidores.",
  },
  {
    id: 'remover',
    question: "Posso remover a marca d'água depois?",
    answer:
      "A marca d'água é texto embutido no PDF (não um carimbo de imagem separado fácil de apagar). Para um documento limpo, mantenha o original e use a cópia marcada apenas quando precisar compartilhar. Não há upload nem armazenamento nosso do arquivo.",
  },
  {
    id: 'qualidade',
    question: "A marca d'água reduz a qualidade do PDF?",
    answer:
      'Não. Apenas um texto vetorial (Helvetica Bold) é sobreposto com a opacidade escolhida. Imagens e conteúdo original permanecem intactos — não há recompactação destrutiva.',
  },
  {
    id: 'seguro',
    question: "É seguro adicionar marca d'água aqui?",
    answer:
      'Sim. Todo o fluxo roda 100% offline no navegador. O PDF fica só na memória do dispositivo até o download de nome-marcado.pdf. Sem conta e sem envio para a nuvem.',
  },
  {
    id: 'caracteres',
    question: 'Quais caracteres posso usar no texto?',
    answer:
      'Letras, números e pontuação comum funcionam bem. Acentos são normalizados para a fonte padrão Helvetica (WinAnsi). Emojis e símbolos raros podem ser removidos automaticamente na sanitização.',
  },
];

const COLOR_OPTIONS: {
  id: WatermarkColorName;
  label: string;
  swatch: string;
}[] = [
  {
    id: 'black',
    label: 'Preto',
    swatch: 'bg-slate-900 dark:bg-slate-100',
  },
  {
    id: 'gray',
    label: 'Cinza',
    swatch: 'bg-slate-400',
  },
  {
    id: 'red',
    label: 'Vermelho',
    swatch: 'bg-red-600',
  },
];

/**
 * Página /marca-dagua — marca d'água textual em todas as páginas (pdf-lib).
 */
export default function MarcaDaguaPage() {
  const errorId = useId();
  const textId = useId();
  const opacityId = useId();
  const fontSizeId = useId();
  const ga = useToolAnalytics(TOOL_NAMES.MARCA_DAGUA);
  const intake = useFileIntake(TOOL_NAMES.MARCA_DAGUA, 'pdf_single');

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [options, setOptions] = useState<WatermarkOptions>(
    DEFAULT_WATERMARK_OPTIONS
  );
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
    resetResult();
  }, [resetResult]);

  const patchOptions = useCallback((partial: Partial<WatermarkOptions>) => {
    setOptions((prev) => ({ ...prev, ...partial }));
    setError(null);
    setSuccess(null);
  }, []);

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

      try {
        const count = await getPdfPageCount(accepted);
        setPageCount(count);
        ga.trackUpload(gate.files);
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
    [ga, intake, resetResult]
  );

  const handleApply = async () => {
    if (!file) {
      setError('Envie um arquivo PDF primeiro.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setProgress(0);
    setProgressMsg('Preparando…');
    resetPreview();

    const startedAt = ga.startProcess(1);

    try {
      const bytes = await applyWatermarkToPdf(
        file,
        options,
        ({ percent, message }) => {
          setProgress(percent);
          setProgressMsg(message);
        }
      );

      const outName = watermarkedFileName(file.name);
      const stableBytes = new Uint8Array(bytes);

      setPreviewBytes(stableBytes);
      setPreviewFileName(outName);
      setIsModalOpen(true);

      setSuccess(
        `Marca d'água aplicada em ${pageCount ?? 'todas as'} página${
          pageCount === 1 ? '' : 's'
        }. Confira a pré-visualização e baixe quando quiser.`
      );
      ga.endProcess(true, startedAt);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Falha inesperada ao aplicar a marca d'água.";
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
    const name = previewFileName || 'pdf-marcado.pdf';
    const blob = new Blob([new Uint8Array(previewBytes)], {
      type: 'application/pdf',
    });
    downloadBlob(blob, name);
    ga.trackDownload(name);
    setIsModalOpen(false);
    setSuccess('Download iniciado. O arquivo permanece só no seu dispositivo.');
  }, [previewBytes, previewFileName, ga]);

  const busy = isProcessing || isLoadingMeta;
  const canApply =
    !!file &&
    pageCount != null &&
    pageCount > 0 &&
    options.text.trim().length > 0 &&
    !busy;

  const opacityPercent = Math.round(options.opacity * 100);

  const seo = getSeoForPath('/marca-dagua');

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
            Ferramenta gratuita · Sem upload
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Marca d&apos;água PDF
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Sobreponha um texto (ex.: CONFIDENCIAL) em todas as páginas, com
            opacidade, cor e estilo. Processamento com{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              pdf-lib no seu navegador
            </strong>{' '}
            — zero upload.
          </p>
        </header>

        {!file ? (
          <DropZone
            onFiles={handleFiles}
            disabled={busy}
            multiple={false}
            onReject={(msg) => setError(msg)}
            labels={{
              hint: `ou clique para escolher · ${dropZoneLimitHint('pdf_single')}`,
            }}
          />
        ) : (
          <div className="space-y-5">
            {/* Arquivo */}
            <div className="card">
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
            </div>

            {/* Formulário de configuração */}
            {pageCount != null && !isLoadingMeta && (
              <div className="grid gap-5 lg:grid-cols-[1fr_minmax(0,18rem)]">
                <div className="card space-y-6">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                      Configurar marca d&apos;água
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Ajuste o texto e o visual. A aplicação roda localmente em
                      todas as páginas.
                    </p>
                  </div>

                  {/* Texto */}
                  <div className="space-y-2">
                    <label
                      htmlFor={textId}
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Texto da marca d&apos;água
                    </label>
                    <input
                      id={textId}
                      type="text"
                      maxLength={WATERMARK_LIMITS.textMaxLength}
                      value={options.text}
                      disabled={busy}
                      placeholder="CONFIDENCIAL"
                      onChange={(e) => patchOptions({ text: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {options.text.length}/{WATERMARK_LIMITS.textMaxLength}{' '}
                      caracteres
                    </p>
                  </div>

                  {/* Opacidade */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor={opacityId}
                        className="text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        Transparência (opacidade)
                      </label>
                      <span className="rounded-lg bg-cyan-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300">
                        {opacityPercent}%
                      </span>
                    </div>
                    <input
                      id={opacityId}
                      type="range"
                      min={WATERMARK_LIMITS.opacityMin * 100}
                      max={WATERMARK_LIMITS.opacityMax * 100}
                      step={5}
                      value={opacityPercent}
                      disabled={busy}
                      onChange={(e) =>
                        patchOptions({
                          opacity: Number(e.target.value) / 100,
                        })
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-cyan-600 dark:bg-slate-700"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>10% (mais transparente)</span>
                      <span>100% (opaco)</span>
                    </div>
                  </div>

                  {/* Fonte */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor={fontSizeId}
                        className="text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        Tamanho da fonte
                      </label>
                      <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {options.fontSize} pt
                      </span>
                    </div>
                    <input
                      id={fontSizeId}
                      type="range"
                      min={WATERMARK_LIMITS.fontSizeMin}
                      max={WATERMARK_LIMITS.fontSizeMax}
                      step={2}
                      value={options.fontSize}
                      disabled={busy}
                      onChange={(e) =>
                        patchOptions({ fontSize: Number(e.target.value) })
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-cyan-600 dark:bg-slate-700"
                    />
                  </div>

                  {/* Cor */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Cor
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_OPTIONS.map((c) => {
                        const selected = options.color === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            disabled={busy}
                            onClick={() => patchOptions({ color: c.id })}
                            aria-pressed={selected}
                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                              selected
                                ? 'border-cyan-500 bg-cyan-50 text-cyan-900 ring-2 ring-cyan-500/30 dark:border-cyan-400 dark:bg-cyan-950/50 dark:text-cyan-100'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600'
                            }`}
                          >
                            <span
                              className={`h-4 w-4 rounded-full border border-black/10 ${c.swatch}`}
                              aria-hidden
                            />
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Posição */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Posição / estilo
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {(
                        [
                          {
                            id: 'diagonal' as WatermarkPosition,
                            title: 'Centro diagonal',
                            desc: '45° no centro de cada página',
                          },
                          {
                            id: 'footer' as WatermarkPosition,
                            title: 'Rodapé',
                            desc: 'Centralizado na base da página',
                          },
                        ] as const
                      ).map((pos) => {
                        const selected = options.position === pos.id;
                        return (
                          <button
                            key={pos.id}
                            type="button"
                            disabled={busy}
                            onClick={() => patchOptions({ position: pos.id })}
                            aria-pressed={selected}
                            className={`rounded-xl border px-4 py-3 text-left transition ${
                              selected
                                ? 'border-cyan-500 bg-cyan-50 ring-2 ring-cyan-500/30 dark:border-cyan-400 dark:bg-cyan-950/50'
                                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600'
                            }`}
                          >
                            <span className="block text-sm font-semibold text-slate-900 dark:text-slate-50">
                              {pos.title}
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                              {pos.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center dark:border-slate-700">
                    <button
                      type="button"
                      className="btn-primary w-full sm:w-auto sm:min-w-[240px] !bg-cyan-600 hover:!bg-cyan-700 focus-visible:!ring-cyan-500"
                      disabled={!canApply}
                      onClick={() => void handleApply()}
                      aria-describedby={error ? errorId : undefined}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2
                            className="h-4 w-4 animate-spin"
                            aria-hidden
                          />
                          Aplicando…
                        </>
                      ) : (
                        <>
                          <Stamp className="h-4 w-4" aria-hidden />
                          Aplicar Marca d&apos;água
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

                {/* Preview lateral */}
                <aside className="card flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Pré-visualização
                  </p>
                  <div className="relative flex aspect-[3/4] w-full max-w-[12rem] items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-inner dark:border-slate-700 dark:bg-slate-900">
                    <div className="absolute inset-3 rounded border border-dashed border-slate-200 dark:border-slate-700" />
                    <span
                      className="relative z-10 max-w-[90%] break-words px-2 text-center font-bold uppercase leading-tight"
                      style={{
                        fontSize: `${Math.max(10, Math.min(22, options.fontSize * 0.35))}px`,
                        opacity: options.opacity,
                        color:
                          options.color === 'red'
                            ? '#dc2626'
                            : options.color === 'gray'
                              ? '#94a3b8'
                              : '#0f172a',
                        transform:
                          options.position === 'diagonal'
                            ? 'rotate(-45deg)'
                            : 'none',
                        alignSelf:
                          options.position === 'footer'
                            ? 'flex-end'
                            : 'center',
                        marginBottom:
                          options.position === 'footer' ? '1rem' : undefined,
                      }}
                    >
                      {options.text.trim() || 'CONFIDENCIAL'}
                    </span>
                  </div>
                  <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
                    Aproximação visual · o PDF final usa Helvetica Bold
                  </p>
                </aside>
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
          <SuccessAction message={success} toolName={TOOL_NAMES.MARCA_DAGUA} />
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
              Defina o texto, opacidade, tamanho, cor e posição (diagonal ou
              rodapé).
            </li>
            <li>
              Clique em <em>Aplicar Marca d&apos;água</em> — o pdf-lib desenha o
              texto em todas as páginas no navegador.
            </li>
            <li>
              O arquivo{' '}
              <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                nome-marcado.pdf
              </code>{' '}
              abre em pré-visualização antes do download.
            </li>
          </ol>
        </section>

        <ToolSeoContent content={marcaDaguaSeoContent} />

        <FaqAccordion
          items={watermarkFaqItems}
          title="Perguntas frequentes sobre Marca d'água"
          subtitle="Escopo por página, qualidade, segurança e caracteres suportados."
        />
      </div>

      <StickyCta />

      <PdfPreviewModal
        isOpen={isModalOpen}
        pdfBytes={previewBytes}
        fileName={previewFileName}
        onClose={handleClosePreview}
        onDownload={handleDownloadFromPreview}
        toolName={TOOL_NAMES.MARCA_DAGUA}
      />
    </>
  );
}
