/**
 * Nomes canônicos das ferramentas para eventos GA4 (snake_case).
 * Evita strings mágicas espalhadas pelo código.
 */
export const TOOL_NAMES = {
  JUNTAR_PDF: 'juntar_pdf',
  DIVIDIR_PDF: 'dividir_pdf',
  GIRAR_PDF: 'girar_pdf',
  MARCA_DAGUA: 'marca_dagua',
  DESENHAR_PDF: 'desenhar_pdf',
  WORD_PARA_PDF: 'word_para_pdf',
  IMAGEM_PARA_PDF: 'imagem_para_pdf',
  EXTRAIR_TEXTO: 'extrair_texto',
  PROTEGER_PDF: 'proteger_pdf',
  DESBLOQUEAR_PDF: 'desbloquear_pdf',
  REMOVER_PAGINAS: 'remover_paginas',
  COMPRIMIR_PDF: 'comprimir_pdf',
} as const;

export type ToolName = (typeof TOOL_NAMES)[keyof typeof TOOL_NAMES];

/** Path da rota → tool_name GA4 */
export const TOOL_NAME_BY_PATH: Record<string, ToolName> = {
  '/juntar-pdf': TOOL_NAMES.JUNTAR_PDF,
  '/dividir-pdf': TOOL_NAMES.DIVIDIR_PDF,
  '/girar-pdf': TOOL_NAMES.GIRAR_PDF,
  '/marca-dagua': TOOL_NAMES.MARCA_DAGUA,
  '/desenhar-pdf': TOOL_NAMES.DESENHAR_PDF,
  '/word-para-pdf': TOOL_NAMES.WORD_PARA_PDF,
  '/imagem-para-pdf': TOOL_NAMES.IMAGEM_PARA_PDF,
  '/extrair-texto': TOOL_NAMES.EXTRAIR_TEXTO,
  '/proteger-pdf': TOOL_NAMES.PROTEGER_PDF,
  '/desbloquear-pdf': TOOL_NAMES.DESBLOQUEAR_PDF,
  '/remover-paginas': TOOL_NAMES.REMOVER_PAGINAS,
  '/comprimir-pdf': TOOL_NAMES.COMPRIMIR_PDF,
};

export function getToolNameFromPath(pathname: string): ToolName | undefined {
  const normalized =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;
  return TOOL_NAME_BY_PATH[normalized];
}

/** Posições de CTAs de monetização (afiliado / doação). */
export const MONETIZATION_POSITIONS = {
  SUCCESS_MODAL: 'success_modal',
  POST_DOWNLOAD: 'post_download',
  BANNER_DUO: 'banner_duo',
  BANNER_FOOTER: 'banner_footer',
  SIDEBAR: 'sidebar',
  STICKY: 'sticky',
} as const;

export type MonetizationPosition =
  (typeof MONETIZATION_POSITIONS)[keyof typeof MONETIZATION_POSITIONS];
