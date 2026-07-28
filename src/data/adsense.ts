/**
 * Configuração central do Google AdSense.
 *
 * Client ID real do Easy PDF Local (já no index.html).
 * Slot IDs: crie unidades no painel AdSense → Ads → By ad unit,
 * copie o "Ad unit ID" (data-ad-slot) e cole abaixo ou via .env.
 *
 * Enquanto o site estiver em "Preparando", a estrutura já está pronta:
 * assim que o Google aprovar e os slots existirem, os anúncios preenchem sozinhos.
 */

/** Publisher ID (data-ad-client) */
export const ADSENSE_CLIENT =
  (import.meta.env.VITE_ADSENSE_CLIENT as string | undefined)?.trim() ||
  'ca-pub-1776280342582118';

/**
 * IDs de unidade (data-ad-slot).
 * Prioridade de env > default no código.
 * Substitua "XXXXXXXXXX" pelos IDs reais do painel (só dígitos).
 */
export const ADSENSE_SLOTS = {
  /** Banner horizontal — topo do layout (todas as páginas) */
  top:
    (import.meta.env.VITE_ADSENSE_SLOT_TOP as string | undefined)?.trim() ||
    'XXXXXXXXXX',
  /** Banner horizontal — rodapé do layout */
  bottom:
    (import.meta.env.VITE_ADSENSE_SLOT_BOTTOM as string | undefined)?.trim() ||
    'XXXXXXXXXX',
  /** Display responsivo — abaixo do CTA da ferramenta (mobile prioritário) */
  belowCta:
    (import.meta.env.VITE_ADSENSE_SLOT_BELOW_CTA as string | undefined)?.trim() ||
    'XXXXXXXXXX',
  /** Retângulo vertical — sidebar esquerda (desktop xl+) */
  sidebarLeft:
    (import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR_LEFT as string | undefined)?.trim() ||
    'XXXXXXXXXX',
  /** Retângulo vertical — sidebar direita (desktop 2xl+) */
  sidebarRight:
    (import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR_RIGHT as string | undefined)?.trim() ||
    'XXXXXXXXXX',
  /** Inline genérico (blogs / páginas internas) */
  inline:
    (import.meta.env.VITE_ADSENSE_SLOT_INLINE as string | undefined)?.trim() ||
    'XXXXXXXXXX',
} as const;

export type AdSensePlacement = keyof typeof ADSENSE_SLOTS;

/** Slot ainda é placeholder de exemplo (não faz push para evitar erro no console). */
export function isPlaceholderSlot(slot: string): boolean {
  return !slot || /X{5,}/i.test(slot) || slot === '0';
}

export function isAdSenseClientReady(): boolean {
  return (
    Boolean(ADSENSE_CLIENT) &&
    ADSENSE_CLIENT.startsWith('ca-pub-') &&
    !ADSENSE_CLIENT.includes('XXXX')
  );
}
