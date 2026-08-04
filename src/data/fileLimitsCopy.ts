/**
 * Textos de limites técnicos derivados de FILE_LIMITS.
 * Fonte única de números para UI, DropZone, SEO e FAQ — evita drift.
 */

import {
  FILE_LIMITS,
  formatLimitMb,
  type ValidationProfile,
} from '../lib/fileValidation';

/** Números legíveis (sempre derivados de FILE_LIMITS). */
export const LIMIT_NUMBERS = {
  maxFileMb: formatLimitMb(FILE_LIMITS.MAX_FILE_BYTES),
  maxMergeTotalMb: formatLimitMb(FILE_LIMITS.MAX_MERGE_TOTAL_BYTES),
  maxMergeFiles: FILE_LIMITS.MAX_MERGE_FILES,
  maxOcrPages: FILE_LIMITS.MAX_OCR_PAGES,
  maxCompressPages: FILE_LIMITS.MAX_COMPRESS_PAGES,
  maxPdfPagesGeneral: FILE_LIMITS.MAX_PDF_PAGES_GENERAL,
} as const;

export type LimitItem = {
  label: string;
  text: string;
};

/**
 * Perfis de UI/SEO.
 * Alinhados a ValidationProfile + overview (hub).
 */
export type LimitsUiProfile =
  | ValidationProfile
  | 'overview';

export const LIMITS_DEFAULT_TITLE = 'Limites técnicos (honestos)';

const INTRO_BROWSER =
  'Limites técnicos do navegador (memória e estabilidade) — não são cota de “plano grátis” nem paywall. Não há modo ilimitado no cliente.';

/** Intro curta por perfil. */
export function getLimitsIntro(profile: LimitsUiProfile): string {
  switch (profile) {
    case 'merge_pdf':
      return `${INTRO_BROWSER} No merge, contam quantidade de arquivos, tamanho de cada um e o total da fila.`;
    case 'merge_images':
      return `${INTRO_BROWSER} Na conversão de imagens, contam quantidade e tamanho de cada arquivo.`;
    case 'compress':
      return `${INTRO_BROWSER} A compressão rasteriza páginas (pesado em CPU/RAM); por isso há teto de páginas e de tamanho.`;
    case 'ocr':
      return `${INTRO_BROWSER} OCR com canvas e Tesseract é custoso; o teto de páginas protege o aparelho.`;
    case 'docx':
      return `${INTRO_BROWSER} Conversão DOCX no navegador tem teto de tamanho e depende da memória do aparelho.`;
    case 'overview':
      return `${INTRO_BROWSER} Cada ferramenta aplica o perfil abaixo na validação ao selecionar arquivos.`;
    case 'pdf_single':
    case 'image_single':
    default:
      return INTRO_BROWSER;
  }
}

/** Itens rótulo + texto derivados de FILE_LIMITS. */
export function getLimitItems(profile: LimitsUiProfile): LimitItem[] {
  const n = LIMIT_NUMBERS;

  switch (profile) {
    case 'merge_pdf':
      return [
        {
          label: 'Por arquivo',
          text: `Até ${n.maxFileMb} MB cada PDF.`,
        },
        {
          label: 'Quantidade',
          text: `Até ${n.maxMergeFiles} arquivos por operação.`,
        },
        {
          label: 'Total da fila',
          text: `Até ${n.maxMergeTotalMb} MB somados na lista.`,
        },
        {
          label: 'Se passar do limite',
          text: 'Junte em lotes menores ou comprima scans pesados antes. Em aparelhos com pouca RAM, prefira menos arquivos por vez.',
        },
      ];

    case 'merge_images':
      return [
        {
          label: 'Por imagem',
          text: `Até ${n.maxFileMb} MB cada (JPG, PNG, WebP, etc.).`,
        },
        {
          label: 'Quantidade',
          text: `Até ${n.maxMergeFiles} imagens por operação.`,
        },
        {
          label: 'Se passar do limite',
          text: 'Reduza a resolução das fotos ou divida em mais de um PDF.',
        },
      ];

    case 'compress':
      return [
        {
          label: 'Tamanho do arquivo',
          text: `Até ${n.maxFileMb} MB por PDF.`,
        },
        {
          label: 'Páginas',
          text: `Até ${n.maxCompressPages} páginas na compressão.`,
        },
        {
          label: 'Texto selecionável',
          text: 'Em geral não permanece: as páginas viram JPEG no PDF de saída.',
        },
        {
          label: 'PDFs já leves',
          text: 'Podem encolher pouco — a UI mostra o resultado real.',
        },
      ];

    case 'ocr':
      return [
        {
          label: 'Tamanho do PDF',
          text: `Até ${n.maxFileMb} MB.`,
        },
        {
          label: 'Páginas no OCR',
          text: `Até ${n.maxOcrPages} páginas (Tesseract + canvas).`,
        },
        {
          label: 'Texto nativo',
          text: 'PDFs com texto embutido usam extração mais leve; o teto de páginas do OCR vale quando o modo OCR é necessário.',
        },
      ];

    case 'docx':
      return [
        {
          label: 'Formato',
          text: 'Foco em DOCX. Arquivos .doc antigos: salve como DOCX antes.',
        },
        {
          label: 'Tamanho',
          text: `Até ${n.maxFileMb} MB por arquivo.`,
        },
        {
          label: 'Layout',
          text: 'Textos e listas do dia a dia costumam ir bem; layouts complexos podem divergir do Word desktop.',
        },
        {
          label: 'Celular e memória',
          text: 'DOCX pesados (muitas imagens) pedem mais RAM — em falha, tente no desktop.',
        },
      ];

    case 'overview':
      return [
        {
          label: 'Por arquivo',
          text: `Até ${n.maxFileMb} MB (teto geral).`,
        },
        {
          label: 'Juntar PDF',
          text: `Até ${n.maxMergeFiles} arquivos · ${n.maxMergeTotalMb} MB no total da fila.`,
        },
        {
          label: 'Comprimir PDF',
          text: `Até ${n.maxCompressPages} páginas · ${n.maxFileMb} MB.`,
        },
        {
          label: 'OCR / extrair texto',
          text: `Até ${n.maxOcrPages} páginas no fluxo de OCR.`,
        },
        {
          label: 'Operações leves',
          text: `Proteção extra em torno de ${n.maxPdfPagesGeneral} páginas em fluxos gerais (split, girar, etc.).`,
        },
      ];

    case 'image_single':
      return [
        {
          label: 'Tamanho',
          text: `Até ${n.maxFileMb} MB por imagem.`,
        },
      ];

    case 'pdf_single':
    default:
      return [
        {
          label: 'Tamanho',
          text: `Até ${n.maxFileMb} MB por PDF.`,
        },
        {
          label: 'Páginas (operações leves)',
          text: `Ordem de até cerca de ${n.maxPdfPagesGeneral} páginas — em aparelhos fracos, prefira arquivos menores.`,
        },
      ];
  }
}

/**
 * Bloco completo para ToolSeoBlock.limits* (números sempre de FILE_LIMITS).
 */
export function buildSeoLimitsBlock(
  profile: LimitsUiProfile,
  extras?: {
    title?: string;
    intro?: string;
    /** Itens adicionais (trade-offs específicos da tool, sem números inventados) */
    extraItems?: LimitItem[];
    /** Se true, substitui items base (só extras). Default: concatena. */
    replaceItems?: boolean;
  }
): {
  limitsTitle: string;
  limitsIntro: string;
  limits: LimitItem[];
} {
  const base = extras?.replaceItems ? [] : getLimitItems(profile);
  const extra = extras?.extraItems ?? [];
  return {
    limitsTitle: extras?.title ?? LIMITS_DEFAULT_TITLE,
    limitsIntro: extras?.intro ?? getLimitsIntro(profile),
    limits: [...base, ...extra],
  };
}

/**
 * Dica curta para DropZone — mesmos números de FILE_LIMITS.
 */
export function dropZoneLimitHintFromLimits(
  profile: ValidationProfile
): string {
  const n = LIMIT_NUMBERS;
  switch (profile) {
    case 'merge_pdf':
      return `até ${n.maxMergeFiles} PDFs · máx. ${n.maxFileMb} MB cada · total ${n.maxMergeTotalMb} MB · 100% local`;
    case 'merge_images':
      return `até ${n.maxMergeFiles} imagens · máx. ${n.maxFileMb} MB cada · 100% local`;
    case 'ocr':
      return `PDF · máx. ${n.maxFileMb} MB · até ${n.maxOcrPages} páginas no OCR · 100% local`;
    case 'compress':
      return `PDF · máx. ${n.maxFileMb} MB · até ${n.maxCompressPages} páginas · 100% local`;
    case 'docx':
      return `DOCX · máx. ${n.maxFileMb} MB · processamento local`;
    case 'image_single':
      return `máx. ${n.maxFileMb} MB · processamento local`;
    default:
      return `máx. ${n.maxFileMb} MB por arquivo · processamento local`;
  }
}

/** Resposta de FAQ (home / hub) com números vivos. */
export function getHomeLimitsFaqAnswer(): string {
  const n = LIMIT_NUMBERS;
  return `Sim — limites técnicos para proteger a memória do navegador, não cotas de “conta”. Em geral: até ${n.maxFileMb} MB por arquivo; no juntar PDF, até ${n.maxMergeFiles} arquivos e cerca de ${n.maxMergeTotalMb} MB no total; OCR até ${n.maxOcrPages} páginas; compressão até ${n.maxCompressPages} páginas. Arquivos dentro desses tetos costumam funcionar bem; acima disso o site avisa e bloqueia o processamento para evitar travamentos. Não há modo ilimitado no cliente.`;
}

/** Frase compacta para avisos (hub, banners). */
export function getLimitsOverviewOneLiner(): string {
  const n = LIMIT_NUMBERS;
  return `Exemplos: ${n.maxFileMb} MB por arquivo · merge até ${n.maxMergeFiles} arquivos / ${n.maxMergeTotalMb} MB total · OCR ${n.maxOcrPages} págs · compressão ${n.maxCompressPages} págs.`;
}
