import { useEffect, useState } from 'react';
import {
  ensureConsentDefaultsDenied,
  subscribeGoogleCmpAnalyticsConsent,
  updateConsent,
  type ConsentValue,
} from '../lib/googleConsent';
import { GA_MEASUREMENT_ID, isGaPlaceholder } from '../utils/analytics';

/**
 * Google Consent Mode v2 + escuta da CMP do AdSense.
 * Pageviews SPA ficam a cargo do <RouteTracker /> (gtag page_view).
 *
 * Montar **dentro** de `<BrowserRouter>` (main.tsx):
 *
 * ```tsx
 * <BrowserRouter>
 *   <AnalyticsTracker />
 *   <RouteTracker />
 *   <App />
 * </BrowserRouter>
 * ```
 */
export function AnalyticsTracker() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    ensureConsentDefaultsDenied();
  }, []);

  useEffect(() => {
    if (isGaPlaceholder) {
      if (import.meta.env.DEV) {
        console.info(
          '[Analytics] GA4 placeholder (G-XXXXXXXXXX). Defina VITE_GA_MEASUREMENT_ID no .env. Consent Mode defaults = denied.'
        );
      }
      return;
    }

    const unsubscribe = subscribeGoogleCmpAnalyticsConsent(
      (granted, source) => {
        if (import.meta.env.DEV) {
          console.info(
            `[Analytics] analytics_storage=${granted ? 'granted' : 'denied'} (${source})`
          );
        }

        if (granted) {
          updateConsent({ analytics_storage: 'granted' });
          setAnalyticsAllowed(true);
        } else {
          updateConsent({ analytics_storage: 'denied' });
          setAnalyticsAllowed(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  // Reforça gtag config quando o ID real existe e o consentimento foi dado
  useEffect(() => {
    if (isGaPlaceholder || !analyticsAllowed) return;
    if (typeof window.gtag !== 'function') return;

    window.gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      send_page_view: false,
    });
  }, [analyticsAllowed]);

  return null;
}

/**
 * Teste manual no DevTools (só em desenvolvimento):
 * import { debugGrantAnalyticsConsent } from './components/AnalyticsTracker'
 * debugGrantAnalyticsConsent()
 */
export function debugGrantAnalyticsConsent(): void {
  updateConsent({
    analytics_storage: 'granted' as ConsentValue,
  });
  window.dispatchEvent(
    new CustomEvent('easypdf-consent', {
      detail: { analytics_storage: 'granted' },
    })
  );
}
