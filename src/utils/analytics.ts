/**
 * Utilitários GA4 (gtag.js).
 * O script base + consent defaults ficam no index.html.
 * Pageviews SPA: RouteTracker. Eventos custom: logEvent (ex.: affiliate_click).
 */

/** Measurement ID — env de produção ou placeholder temporário */
export const GA_MEASUREMENT_ID =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim() ||
  'G-XXXXXXXXXX';

export const isGaPlaceholder =
  !GA_MEASUREMENT_ID ||
  GA_MEASUREMENT_ID === 'G-XXXXXXXXXX' ||
  GA_MEASUREMENT_ID.includes('XXXX');

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function canTrack(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/**
 * Envia page_view com page_path (navegação SPA).
 */
export function logPageView(url: string): void {
  if (!canTrack()) return;

  window.gtag('event', 'page_view', {
    page_path: url,
    page_location: `${window.location.origin}${url}`,
    page_title: document.title,
  });
}

/**
 * Wrapper genérico: window.gtag('event', action, params).
 */
export function logEvent(
  action: string,
  params?: Record<string, unknown>
): void {
  if (!canTrack()) return;
  window.gtag('event', action, params ?? {});
}
