export type ToolAccent =
  | 'red'
  | 'violet'
  | 'blue'
  | 'emerald'
  | 'amber'
  | 'orange'
  | 'cyan'
  | 'pink';

export type ToolIconName =
  | 'merge'
  | 'split'
  | 'word'
  | 'image'
  | 'ocr'
  | 'rotate'
  | 'watermark'
  | 'draw';

export interface ToolMeta {
  path: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: ToolIconName;
  status: 'ready' | 'soon';
  /** Cor sutil de destaque no card da Home */
  accent: ToolAccent;
}

/**
 * Classes Tailwind por accent — light/dark mode.
 * Mantidas como strings estáticas para o JIT do Tailwind.
 */
export const toolAccentStyles: Record<
  ToolAccent,
  {
    iconBg: string;
    iconText: string;
    ring: string;
    badge: string;
  }
> = {
  red: {
    iconBg: 'bg-red-50 dark:bg-red-950/50',
    iconText: 'text-red-600 dark:text-red-400',
    ring: 'group-hover:border-red-300 dark:group-hover:border-red-800',
    badge: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  },
  violet: {
    iconBg: 'bg-violet-50 dark:bg-violet-950/50',
    iconText: 'text-violet-600 dark:text-violet-400',
    ring: 'group-hover:border-violet-300 dark:group-hover:border-violet-800',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  },
  blue: {
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
    iconText: 'text-blue-600 dark:text-blue-400',
    ring: 'group-hover:border-blue-300 dark:group-hover:border-blue-800',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  },
  emerald: {
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconText: 'text-emerald-600 dark:text-emerald-400',
    ring: 'group-hover:border-emerald-300 dark:group-hover:border-emerald-800',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  },
  amber: {
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconText: 'text-amber-600 dark:text-amber-400',
    ring: 'group-hover:border-amber-300 dark:group-hover:border-amber-800',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  },
  orange: {
    iconBg: 'bg-orange-50 dark:bg-orange-950/50',
    iconText: 'text-orange-600 dark:text-orange-400',
    ring: 'group-hover:border-orange-300 dark:group-hover:border-orange-800',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
  },
  cyan: {
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/50',
    iconText: 'text-cyan-600 dark:text-cyan-400',
    ring: 'group-hover:border-cyan-300 dark:group-hover:border-cyan-800',
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
  },
  pink: {
    iconBg: 'bg-pink-50 dark:bg-pink-950/50',
    iconText: 'text-pink-600 dark:text-pink-400',
    ring: 'group-hover:border-pink-300 dark:group-hover:border-pink-800',
    badge: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300',
  },
};

export const tools: ToolMeta[] = [
  {
    path: '/juntar-pdf',
    title: 'Juntar PDF',
    shortTitle: 'Juntar',
    description:
      'Combine vários arquivos PDF em um único documento, na ordem que quiser.',
    icon: 'merge',
    status: 'ready',
    accent: 'red',
  },
  {
    path: '/dividir-pdf',
    title: 'Dividir PDF',
    shortTitle: 'Dividir',
    description:
      'Extraia páginas ou intervalos de um PDF em um novo arquivo.',
    icon: 'split',
    status: 'ready',
    accent: 'violet',
  },
  {
    path: '/girar-pdf',
    title: 'Girar PDF',
    shortTitle: 'Girar',
    description:
      'Rotacione páginas 90° à esquerda ou à direita — todas ou só um intervalo.',
    icon: 'rotate',
    status: 'ready',
    accent: 'orange',
  },
  {
    path: '/marca-dagua',
    title: "Marca d'água",
    shortTitle: "Marca d'água",
    description:
      "Adicione texto (ex.: CONFIDENCIAL) em todas as páginas, com opacidade e estilo.",
    icon: 'watermark',
    status: 'ready',
    accent: 'cyan',
  },
  {
    path: '/desenhar-pdf',
    title: 'Desenhar no PDF',
    shortTitle: 'Desenhar',
    description:
      'Assine ou rabisque livremente na página 1 — mouse ou toque, exportação local.',
    icon: 'draw',
    status: 'ready',
    accent: 'pink',
  },
  {
    path: '/word-para-pdf',
    title: 'Word para PDF',
    shortTitle: 'Word → PDF',
    description:
      'Converta documentos DOCX em PDF sem sair do navegador.',
    icon: 'word',
    status: 'ready',
    accent: 'blue',
  },
  {
    path: '/imagem-para-pdf',
    title: 'Imagem para PDF',
    shortTitle: 'Imagem → PDF',
    description:
      'Junte várias imagens JPG/PNG em um único PDF — uma página por imagem, sem perda de qualidade.',
    icon: 'image',
    status: 'ready',
    accent: 'emerald',
  },
  {
    path: '/extrair-texto',
    title: 'Extrair Texto (OCR)',
    shortTitle: 'OCR',
    description:
      'Extraia texto de imagens (JPEG, PNG, WebP) com Tesseract.js no navegador.',
    icon: 'ocr',
    status: 'ready',
    accent: 'amber',
  },
];

export function getToolByPath(pathname: string): ToolMeta | undefined {
  return tools.find((t) => t.path === pathname);
}
