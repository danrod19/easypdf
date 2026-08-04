/**
 * Configuração central do Google AdSense.
 *
 * Client ID real do Easy PDF Local (já no index.html).
 * Slot IDs: painel AdSense → Ads → By ad unit → data-ad-slot (só dígitos).
 *
 * Enquanto o slot for placeholder (XXXXXXXXXX), **nada** de ad é renderizado
 * (nem label “Publicidade”, nem <ins>, nem push) — evita UX vazia e risco de
 * “conteúdo de baixo valor” na revisão do AdSense.
 */

/** Publisher ID (data-ad-client) */
export const ADSENSE_CLIENT =
  (import.meta.env.VITE_ADSENSE_CLIENT as string | undefined)?.trim() ||
  'ca-pub-1776280342582118';

/**
 * IDs de unidade (data-ad-slot).
 * Prioridade: env > default no código.
 * Default "XXXXXXXXXX" = desligado até configurar .env / painel.
 */
export const ADSENSE_SLOTS = {
  /** Banner horizontal — topo do layout */
  top:
    (import.meta.env.VITE_ADSENSE_SLOT_TOP as string | undefined)?.trim() ||
    'XXXXXXXXXX',
  /** Banner horizontal — rodapé */
  bottom:
    (import.meta.env.VITE_ADSENSE_SLOT_BOTTOM as string | undefined)?.trim() ||
    'XXXXXXXXXX',
  /** Display abaixo do CTA da ferramenta */
  belowCta:
    (import.meta.env.VITE_ADSENSE_SLOT_BELOW_CTA as string | undefined)?.trim() ||
    'XXXXXXXXXX',
  /** Sidebar esquerda (desktop xl+) */
  sidebarLeft:
    (import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR_LEFT as string | undefined)?.trim() ||
    'XXXXXXXXXX',
  /** Sidebar direita (desktop 2xl+) */
  sidebarRight:
    (import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR_RIGHT as string | undefined)?.trim() ||
    'XXXXXXXXXX',
  /** Inline genérico */
  inline:
    (import.meta.env.VITE_ADSENSE_SLOT_INLINE as string | undefined)?.trim() ||
    'XXXXXXXXXX',
} as const;

export type AdSensePlacement = keyof typeof ADSENSE_SLOTS;

/** Ad unit IDs do painel são numéricos; costumam ter 9–12 dígitos. */
const SLOT_DIGITS_MIN = 6;
const SLOT_DIGITS_MAX = 16;

/**
 * Placeholder explícito ou valor “vazio” de config.
 * (ex.: XXXXXXXXXX, 0, string vazia)
 */
export function isPlaceholderSlot(slot: string | null | undefined): boolean {
  if (slot == null) return true;
  const s = String(slot).trim();
  if (!s) return true;
  if (s === '0') return true;
  // Qualquer sequência longa de X (case-insensitive)
  if (/^x+$/i.test(s)) return true;
  if (/X{5,}/i.test(s)) return true;
  if (/placeholder/i.test(s)) return true;
  return false;
}

/**
 * Slot válido para montar unidade real:
 * - não é placeholder
 * - só dígitos
 * - comprimento razoável (6–16)
 */
export function isValidAdSenseSlot(slot: string | null | undefined): boolean {
  if (isPlaceholderSlot(slot)) return false;
  const s = String(slot).trim();
  if (!/^\d+$/.test(s)) return false;
  if (s.length < SLOT_DIGITS_MIN || s.length > SLOT_DIGITS_MAX) return false;
  return true;
}

export function isAdSenseClientReady(): boolean {
  return (
    Boolean(ADSENSE_CLIENT) &&
    ADSENSE_CLIENT.startsWith('ca-pub-') &&
    !ADSENSE_CLIENT.includes('XXXX') &&
    !/x{4,}/i.test(ADSENSE_CLIENT)
  );
}

/**
 * Pode tentar renderizar unidade:
 * client válido + slot real (não placeholder).
 * Consentimento é checado no componente.
 */
export function canMountAdSenseUnit(slot: string | null | undefined): boolean {
  return isAdSenseClientReady() && isValidAdSenseSlot(slot);
}
