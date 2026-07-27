/**
 * Utilitários GA4 (gtag.js).
 * O script base + consent defaults ficam no index.html.
 * Pageviews SPA: RouteTracker (logPageView).
 * Eventos de produto: preferir helpers tipados em `gaEvents.ts`
 * (tool_view, file_uploaded, process_*, affiliate_click, etc.).
 */

/** Measurement ID — preferir VITE_GA_MEASUREMENT_ID no .env */
export const GA_MEASUREMENT_ID =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim() ||
  'G-S7MTF3EX46';

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
