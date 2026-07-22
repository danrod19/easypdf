import { PDFDocument, rgb, LineCapStyle, type RGB } from 'pdf-lib';

export type DrawColorName = 'black' | 'blue' | 'red';
export type BrushSizeName = 'thin' | 'medium' | 'thick';

export type DrawPoint = {
  /** Coordenada X no canvas (CSS px, origem topo-esquerda) */
  x: number;
  /** Coordenada Y no canvas (CSS px, origem topo-esquerda) */
  y: number;
};

export type DrawStroke = {
  color: DrawColorName;
  /** Espessura em pixels do canvas (espaço lógico de desenho) */
  thickness: number;
  points: DrawPoint[];
};

export interface DrawProgress {
  percent: number;
  message: string;
}

export type DrawProgressCallback = (progress: DrawProgress) => void;

/** Espessuras de pincel em px do canvas. */
export const BRUSH_SIZES: Record<BrushSizeName, number> = {
  thin: 2,
  medium: 4,
  thick: 8,
};

export const DRAW_COLORS: Record<
  DrawColorName,
  { label: string; hex: string; rgb: RGB }
> = {
  black: {
    label: 'Preto',
    hex: '#0f172a',
    rgb: rgb(0.06, 0.09, 0.16),
  },
  blue: {
    label: 'Azul',
    hex: '#2563eb',
    rgb: rgb(0.15, 0.39, 0.92),
  },
  red: {
    label: 'Vermelho',
    hex: '#dc2626',
    rgb: rgb(0.86, 0.15, 0.15),
  },
};

/**
 * Canvas (topo-esq) → PDF (inferior-esq).
 * pdfY = pageHeight - (canvasY * (pageHeight / canvasHeight))
 */
export function canvasToPdfPoint(
  canvasX: number,
  canvasY: number,
  canvasWidth: number,
  canvasHeight: number,
  pageWidth: number,
  pageHeight: number
): { x: number; y: number } {
  const scaleX = pageWidth / canvasWidth;
  const scaleY = pageHeight / canvasHeight;
  return {
    x: canvasX * scaleX,
    y: pageHeight - canvasY * scaleY,
  };
}

export function canvasThicknessToPdf(
  canvasThickness: number,
  canvasWidth: number,
  canvasHeight: number,
  pageWidth: number,
  pageHeight: number
): number {
  const scale = (pageWidth / canvasWidth + pageHeight / canvasHeight) / 2;
  return Math.max(0.5, canvasThickness * scale);
}

/**
 * Aplica traços da página 1 (índice 0) no PDF original e devolve bytes.
 * Coordenadas dos strokes estão no espaço do canvas de visualização.
 */
export async function applyDrawingsToPdf(
  file: File,
  strokes: DrawStroke[],
  canvasWidth: number,
  canvasHeight: number,
  /** Página 1-based onde o usuário desenhou (default: 1) */
  pageNumber = 1,
  onProgress?: DrawProgressCallback
): Promise<Uint8Array> {
  if (canvasWidth <= 0 || canvasHeight <= 0) {
    throw new Error('Dimensões do canvas inválidas para exportação.');
  }
  if (strokes.length === 0) {
    throw new Error('Desenhe ao menos um traço antes de salvar.');
  }

  onProgress?.({ percent: 10, message: `Lendo ${file.name}…` });

  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    throw new Error(`Não foi possível ler o arquivo "${file.name}".`);
  }

  onProgress?.({ percent: 30, message: 'Carregando documento…' });

  let pdfDoc: PDFDocument;
  try {
    pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: false });
  } catch {
    throw new Error(
      `O arquivo "${file.name}" não é um PDF válido ou está protegido por senha.`
    );
  }

  const pages = pdfDoc.getPages();
  const pageIndex = pageNumber - 1;
  if (pageIndex < 0 || pageIndex >= pages.length) {
    throw new Error(`A página ${pageNumber} não existe neste PDF.`);
  }

  const page = pages[pageIndex];
  const { width: pageWidth, height: pageHeight } = page.getSize();

  onProgress?.({
    percent: 50,
    message: `Desenhando ${strokes.length} traço${strokes.length === 1 ? '' : 's'}…`,
  });

  const total = strokes.length;
  for (let s = 0; s < total; s++) {
    const stroke = strokes[s];
    if (!stroke.points || stroke.points.length === 0) continue;

    const color = DRAW_COLORS[stroke.color]?.rgb ?? DRAW_COLORS.black.rgb;
    const thickness = canvasThicknessToPdf(
      stroke.thickness,
      canvasWidth,
      canvasHeight,
      pageWidth,
      pageHeight
    );

    // Um único ponto → pequeno segmento (ponto)
    if (stroke.points.length === 1) {
      const p = stroke.points[0];
      const a = canvasToPdfPoint(
        p.x,
        p.y,
        canvasWidth,
        canvasHeight,
        pageWidth,
        pageHeight
      );
      const half = thickness / 2;
      page.drawLine({
        start: { x: a.x - half, y: a.y },
        end: { x: a.x + half, y: a.y },
        thickness,
        color,
        lineCap: LineCapStyle.Round,
      });
    } else {
      for (let i = 1; i < stroke.points.length; i++) {
        const prev = stroke.points[i - 1];
        const curr = stroke.points[i];
        const start = canvasToPdfPoint(
          prev.x,
          prev.y,
          canvasWidth,
          canvasHeight,
          pageWidth,
          pageHeight
        );
        const end = canvasToPdfPoint(
          curr.x,
          curr.y,
          canvasWidth,
          canvasHeight,
          pageWidth,
          pageHeight
        );
        page.drawLine({
          start,
          end,
          thickness,
          color,
          lineCap: LineCapStyle.Round,
        });
      }
    }

    if (total > 0 && (s % 5 === 0 || s === total - 1)) {
      const pct = 50 + Math.round(((s + 1) / total) * 40);
      onProgress?.({
        percent: pct,
        message: `Traço ${s + 1} de ${total}…`,
      });
    }
  }

  onProgress?.({ percent: 95, message: 'Gerando arquivo final…' });
  const pdfBytes = await pdfDoc.save();
  onProgress?.({ percent: 100, message: 'Concluído!' });

  return pdfBytes;
}

export function drawnFileName(originalName: string): string {
  const base = originalName.replace(/\.pdf$/i, '') || 'documento';
  return `${base}-desenhado.pdf`;
}
