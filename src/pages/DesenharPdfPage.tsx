import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Eraser, Loader2, PenTool, Undo2 } from 'lucide-react';
import { Seo } from '../components/Seo';
import { getSeoForPath } from '../data/seo';
import { AdSlot } from '../components/AdSlot';
import { ProgressBar } from '../components/ProgressBar';
import { DropZone } from '../components/merge/DropZone';
import { FaqAccordion } from '../components/FaqAccordion';
import { StickyCta } from '../components/StickyCta';
import { SuccessAction } from '../components/SuccessAction';
import { ToolSeoContent } from '../components/ToolSeoContent';
import { desenharPdfSeoContent } from '../data/toolSeoContent';
import { loadPdfJs } from '../lib/pdfjsLoader';
import {
  applyDrawingsToPdf,
  BRUSH_SIZES,
  DRAW_COLORS,
  drawnFileName,
  type BrushSizeName,
  type DrawColorName,
  type DrawPoint,
  type DrawStroke,
} from '../lib/drawPdf';
import { downloadBlob, formatBytes } from '../lib/format';
import type { FaqItem } from '../data/faq';

const drawFaqItems: FaqItem[] = [
  {
    id: 'mobile',
    question: 'Posso desenhar pelo celular?',
    answer:
      'Sim. A camada de desenho aceita toque (touch/pointer events). Use o polegar ou a caneta stylus para traçar. Em telas pequenas o canvas se adapta à largura disponível mantendo a proporção da página.',
  },
  {
    id: 'pagina',
    question: 'Em qual página o desenho é aplicado?',
    answer:
      'Nesta versão a pré-visualização e os traços são feitos na página 1 do PDF. Ao salvar, o pdf-lib injeta as linhas apenas nessa página; as demais permanecem intactas.',
  },
  {
    id: 'qualidade',
    question: 'O desenho reduz a qualidade do PDF?',
    answer:
      'Não. Os traços são linhas vetoriais (drawLine do pdf-lib) sobre o conteúdo original — sem rasterizar a página inteira. A qualidade de textos e imagens do documento se mantém.',
  },
  {
    id: 'seguro',
    question: 'É seguro desenhar no PDF aqui?',
    answer:
      'Sim. A renderização (pdf.js) e a exportação (pdf-lib) rodam 100% no navegador. Seu arquivo nunca é enviado a servidores — fica só na memória do dispositivo até o download.',
  },
  {
    id: 'desfazer',
    question: 'Como desfazer um traço errado?',
    answer:
      'Use o botão “Desfazer último traço” na toolbar. Cada soltura do mouse/toque grava um caminho; desfazer remove o mais recente. “Limpar tudo” apaga todos os traços da sessão.',
  },
];

const COLOR_ORDER: DrawColorName[] = ['black', 'blue', 'red'];
const BRUSH_ORDER: { id: BrushSizeName; label: string }[] = [
  { id: 'thin', label: 'Fino' },
  { id: 'medium', label: 'Médio' },
  { id: 'thick', label: 'Grosso' },
];

/**
 * Página /desenhar-pdf — desenho livre na página 1 (pdf.js + canvas + pdf-lib).
 */
export default function DesenharPdfPage() {
  const errorId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [color, setColor] = useState<DrawColorName>('red');
  const [brush, setBrush] = useState<BrushSizeName>('medium');
  const [strokes, setStrokes] = useState<DrawStroke[]>([]);
  /** Tamanho lógico do canvas (CSS px) — base da conversão canvas→PDF */
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const drawingRef = useRef(false);
  const currentStrokeRef = useRef<DrawStroke | null>(null);
  const strokesRef = useRef<DrawStroke[]>([]);
  const colorRef = useRef(color);
  const brushRef = useRef(brush);
  const pdfBytesRef = useRef<ArrayBuffer | null>(null);

  useEffect(() => {
    strokesRef.current = strokes;
  }, [strokes]);
  useEffect(() => {
    colorRef.current = color;
  }, [color]);
  useEffect(() => {
    brushRef.current = brush;
  }, [brush]);

  const resetMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
    setProgress(0);
    setProgressMsg('');
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setPageCount(null);
    setStrokes([]);
    setCanvasSize({ width: 0, height: 0 });
    pdfBytesRef.current = null;
    drawingRef.current = false;
    currentStrokeRef.current = null;
    resetMessages();

    const bg = bgCanvasRef.current;
    const draw = drawCanvasRef.current;
    if (bg) {
      const ctx = bg.getContext('2d');
      ctx?.clearRect(0, 0, bg.width, bg.height);
      bg.width = 0;
      bg.height = 0;
    }
    if (draw) {
      const ctx = draw.getContext('2d');
      ctx?.clearRect(0, 0, draw.width, draw.height);
      draw.width = 0;
      draw.height = 0;
    }
  }, [resetMessages]);

  /** Redesenha todos os traços no canvas de foreground. */
  const redrawStrokes = useCallback((list: DrawStroke[]) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const stroke of list) {
      if (stroke.points.length === 0) continue;
      ctx.strokeStyle = DRAW_COLORS[stroke.color].hex;
      ctx.lineWidth = stroke.thickness;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      if (stroke.points.length === 1) {
        const p = stroke.points[0];
        ctx.lineTo(p.x + 0.01, p.y);
      }
      ctx.stroke();
    }
    ctx.restore();

    // mantém w/h referenciados para lint silencioso em edge cases
    void w;
    void h;
  }, []);

  const setupCanvasPair = useCallback(
    (cssWidth: number, cssHeight: number) => {
      const dpr = window.devicePixelRatio || 1;
      for (const canvas of [bgCanvasRef.current, drawCanvasRef.current]) {
        if (!canvas) continue;
        canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
        canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
      }
      setCanvasSize({ width: cssWidth, height: cssHeight });
    },
    []
  );

  const renderPageOne = useCallback(
    async (buffer: ArrayBuffer, maxCssWidth: number) => {
      const pdfjs = await loadPdfJs();
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      // Viewport em escala 1 para medidas base
      const baseViewport = page.getViewport({ scale: 1 });
      const fitScale = Math.min(1.5, maxCssWidth / baseViewport.width);
      const viewport = page.getViewport({ scale: fitScale });

      setupCanvasPair(viewport.width, viewport.height);

      const bg = bgCanvasRef.current;
      if (!bg) throw new Error('Canvas de fundo não encontrado.');
      const ctx = bg.getContext('2d');
      if (!ctx) throw new Error('Contexto 2D indisponível.');

      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      await page.render({
        canvasContext: ctx,
        viewport,
        canvas: bg,
      }).promise;

      // Limpa camada de desenho
      redrawStrokes([]);

      return pdf.numPages;
    },
    [redrawStrokes, setupCanvasPair]
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      const next = files[0];
      if (!next) return;

      setIsLoadingPdf(true);
      resetMessages();
      setFile(next);
      setPageCount(null);
      setStrokes([]);
      drawingRef.current = false;
      currentStrokeRef.current = null;

      try {
        const buffer = await next.arrayBuffer();
        // Cópia independente: pdf.js pode transferir/detatch o buffer
        const copy = buffer.slice(0);
        pdfBytesRef.current = copy;

        const containerW =
          containerRef.current?.clientWidth ||
          Math.min(720, window.innerWidth - 48);

        const count = await renderPageOne(copy.slice(0), containerW);
        setPageCount(count);
      } catch (err) {
        clearFile();
        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível renderizar o PDF. Tente outro arquivo.'
        );
      } finally {
        setIsLoadingPdf(false);
      }
    },
    [clearFile, renderPageOne, resetMessages]
  );

  // Redesenha quando strokes mudam
  useEffect(() => {
    redrawStrokes(strokes);
  }, [strokes, redrawStrokes]);

  // Re-render ao redimensionar — reescala traços para o novo tamanho do canvas
  useEffect(() => {
    if (!file || !pdfBytesRef.current) return;

    let timer: number | undefined;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(async () => {
        const containerW =
          containerRef.current?.clientWidth ||
          Math.min(720, window.innerWidth - 48);
        const prevW = canvasSize.width;
        const prevH = canvasSize.height;
        try {
          setIsLoadingPdf(true);
          await renderPageOne(pdfBytesRef.current!.slice(0), containerW);
          // Escala coordenadas dos traços se o canvas mudou de tamanho
          setStrokes((prev) => {
            if (prev.length === 0 || prevW <= 0 || prevH <= 0) return prev;
            const nextW =
              drawCanvasRef.current
                ? drawCanvasRef.current.clientWidth
                : prevW;
            const nextH =
              drawCanvasRef.current
                ? drawCanvasRef.current.clientHeight
                : prevH;
            if (nextW === prevW && nextH === prevH) return prev;
            const sx = nextW / prevW;
            const sy = nextH / prevH;
            return prev.map((stroke) => ({
              ...stroke,
              thickness: stroke.thickness * ((sx + sy) / 2),
              points: stroke.points.map((p) => ({
                x: p.x * sx,
                y: p.y * sy,
              })),
            }));
          });
        } catch {
          /* ignore resize glitches */
        } finally {
          setIsLoadingPdf(false);
        }
      }, 200);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(timer);
    };
    // canvasSize omitido de propósito: usamos o valor no momento do resize via closure atualizada por re-subscribe
  }, [file, renderPageOne, canvasSize.width, canvasSize.height]);

  const getCanvasPoint = (
    e: ReactPointerEvent<HTMLCanvasElement>
  ): DrawPoint | null => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    // Coordenadas no espaço CSS (mesmo usado na exportação)
    const x = ((e.clientX - rect.left) / rect.width) * (canvasSize.width || rect.width);
    const y =
      ((e.clientY - rect.top) / rect.height) * (canvasSize.height || rect.height);
    return { x, y };
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (isLoadingPdf || isProcessing) return;
    e.preventDefault();
    const point = getCanvasPoint(e);
    if (!point) return;

    const canvas = drawCanvasRef.current;
    canvas?.setPointerCapture(e.pointerId);

    drawingRef.current = true;
    const stroke: DrawStroke = {
      color: colorRef.current,
      thickness: BRUSH_SIZES[brushRef.current],
      points: [point],
    };
    currentStrokeRef.current = stroke;

    // Preview imediato
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = DRAW_COLORS[stroke.color].hex;
      ctx.lineWidth = stroke.thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x + 0.01, point.y);
      ctx.stroke();
      ctx.restore();
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !currentStrokeRef.current) return;
    e.preventDefault();
    const point = getCanvasPoint(e);
    if (!point) return;

    const stroke = currentStrokeRef.current;
    const prev = stroke.points[stroke.points.length - 1];
    stroke.points.push(point);

    const canvas = drawCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas && prev) {
      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = DRAW_COLORS[stroke.color].hex;
      ctx.lineWidth = stroke.thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      ctx.restore();
    }
  };

  const endStroke = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    drawingRef.current = false;

    try {
      drawCanvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }

    const stroke = currentStrokeRef.current;
    currentStrokeRef.current = null;
    if (!stroke || stroke.points.length === 0) return;

    setStrokes((prev) => [...prev, stroke]);
    setSuccess(null);
    setError(null);
  };

  const handleUndo = () => {
    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
    setSuccess(null);
  };

  const handleClear = () => {
    setStrokes([]);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!file) {
      setError('Envie um arquivo PDF primeiro.');
      return;
    }
    if (strokes.length === 0) {
      setError('Desenhe ao menos um traço antes de salvar.');
      return;
    }
    if (canvasSize.width <= 0 || canvasSize.height <= 0) {
      setError('Canvas ainda não está pronto. Aguarde a renderização.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setProgress(0);
    setProgressMsg('Preparando…');

    try {
      const bytes = await applyDrawingsToPdf(
        file,
        strokes,
        canvasSize.width,
        canvasSize.height,
        1,
        ({ percent, message }) => {
          setProgress(percent);
          setProgressMsg(message);
        }
      );

      const outName = drawnFileName(file.name);
      const blob = new Blob([new Uint8Array(bytes)], {
        type: 'application/pdf',
      });
      downloadBlob(blob, outName);

      setSuccess(
        `PDF salvo com ${strokes.length} traço${strokes.length === 1 ? '' : 's'} na página 1. Download de ${outName} iniciado.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Falha inesperada ao salvar o PDF desenhado.'
      );
      setProgress(0);
      setProgressMsg('');
    } finally {
      setIsProcessing(false);
    }
  };

  const busy = isLoadingPdf || isProcessing;
  const canSave =
    !!file && strokes.length > 0 && canvasSize.width > 0 && !busy;

  const seo = getSeoForPath('/desenhar-pdf');

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-pink-600 dark:text-pink-400">
            Ferramenta gratuita · Sem upload
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Desenhar no PDF
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Assine, circule ou rabisque na página 1. A pré-visualização usa{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              pdf.js
            </strong>{' '}
            e a exportação{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              pdf-lib
            </strong>{' '}
            — tudo no seu dispositivo.
          </p>
        </header>

        {!file ? (
          <DropZone
            onFiles={handleFiles}
            disabled={busy}
            multiple={false}
          />
        ) : (
          <div className="space-y-4">
            {/* Meta do arquivo */}
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
                        {' · desenhando na página 1'}
                      </>
                    )}
                    {isLoadingPdf && ' · renderizando…'}
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

            {/* Toolbar */}
            <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Cor
                </span>
                <div className="flex gap-1.5">
                  {COLOR_ORDER.map((c) => {
                    const selected = color === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        disabled={busy}
                        aria-label={DRAW_COLORS[c].label}
                        aria-pressed={selected}
                        title={DRAW_COLORS[c].label}
                        onClick={() => setColor(c)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                          selected
                            ? 'border-pink-500 ring-2 ring-pink-500/30'
                            : 'border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        <span
                          className="h-5 w-5 rounded-full"
                          style={{ backgroundColor: DRAW_COLORS[c].hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Pincel
                </span>
                <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-950">
                  {BRUSH_ORDER.map((b) => {
                    const selected = brush === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        disabled={busy}
                        onClick={() => setBrush(b.id)}
                        aria-pressed={selected}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                          selected
                            ? 'bg-white text-pink-700 shadow-sm dark:bg-slate-800 dark:text-pink-300'
                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                      >
                        {b.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-secondary !px-3 !py-2 text-sm"
                  disabled={busy || strokes.length === 0}
                  onClick={handleUndo}
                >
                  <Undo2 className="h-4 w-4" aria-hidden />
                  Desfazer
                </button>
                <button
                  type="button"
                  className="btn-secondary !px-3 !py-2 text-sm"
                  disabled={busy || strokes.length === 0}
                  onClick={handleClear}
                >
                  <Eraser className="h-4 w-4" aria-hidden />
                  Limpar
                </button>
              </div>
            </div>

            {/* Dual canvas */}
            <div
              ref={containerRef}
              className="relative w-full max-w-full overflow-x-auto rounded-2xl border border-slate-200 bg-slate-100/80 p-2 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <div
                className="relative mx-auto touch-none"
                style={{
                  width: canvasSize.width || '100%',
                  height: canvasSize.height || 320,
                  maxWidth: '100%',
                }}
              >
                {isLoadingPdf && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/70 text-sm font-medium text-slate-600 backdrop-blur-sm dark:bg-slate-950/70 dark:text-slate-300">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Renderizando página…
                  </div>
                )}
                <canvas
                  id="pdf-bg"
                  ref={bgCanvasRef}
                  className="pointer-events-none absolute left-0 top-0 block rounded-lg bg-white shadow-sm"
                  aria-hidden
                />
                <canvas
                  id="draw-layer"
                  ref={drawCanvasRef}
                  className="absolute left-0 top-0 block cursor-crosshair rounded-lg touch-none"
                  style={{ touchAction: 'none' }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={endStroke}
                  onPointerCancel={endStroke}
                  onPointerLeave={(e) => {
                    if (drawingRef.current) endStroke(e);
                  }}
                  role="img"
                  aria-label="Área de desenho sobre a página 1 do PDF"
                />
              </div>
              {strokes.length > 0 && (
                <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                  {strokes.length} traço{strokes.length === 1 ? '' : 's'} · pincel{' '}
                  {BRUSH_ORDER.find((b) => b.id === brush)?.label.toLowerCase()} ·{' '}
                  {DRAW_COLORS[color].label.toLowerCase()}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className="btn-primary w-full sm:w-auto sm:min-w-[240px] !bg-pink-600 hover:!bg-pink-700 focus-visible:!ring-pink-500"
                disabled={!canSave}
                onClick={() => void handleSave()}
                aria-describedby={error ? errorId : undefined}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Salvando…
                  </>
                ) : (
                  <>
                    <PenTool className="h-4 w-4" aria-hidden />
                    Salvar e Baixar
                  </>
                )}
              </button>
              {file && strokes.length === 0 && !isProcessing && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Desenhe na página acima para habilitar o salvamento.
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

        {success && (
          <SuccessAction message={success} />
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
            <li>Envie 1 PDF — a página 1 é renderizada com pdf.js.</li>
            <li>
              Desenhe na camada superior (mouse ou toque). Escolha cor e
              espessura; use Desfazer se precisar.
            </li>
            <li>
              Clique em <em>Salvar e Baixar</em> — as coordenadas Y são
              convertidas (canvas topo-esq → PDF base-esq) e injetadas com
              pdf-lib.
            </li>
            <li>
              O arquivo{' '}
              <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                nome-desenhado.pdf
              </code>{' '}
              é baixado automaticamente.
            </li>
          </ol>
        </section>

        <ToolSeoContent content={desenharPdfSeoContent} />

        <FaqAccordion
          items={drawFaqItems}
          title="Perguntas frequentes sobre Desenhar no PDF"
          subtitle="Mobile, página alvo, qualidade e privacidade."
        />
      </div>

      <StickyCta />
    </>
  );
}
