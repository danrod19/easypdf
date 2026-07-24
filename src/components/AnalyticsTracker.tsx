import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import {
  ensureConsentDefaultsDenied,
  subscribeGoogleCmpAnalyticsConsent,
  updateConsent,
  type ConsentValue,
} from '../lib/googleConsent';

/**
 * Measurement ID do Google Analytics 4.
 * Substitua pelo ID real ou defina VITE_GA_MEASUREMENT_ID no .env / host.
 */
export const GA_MEASUREMENT_ID =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim() ||
  'G-XXXXXXXXXX';

const isPlaceholderId =
  !GA_MEASUREMENT_ID ||
  GA_MEASUREMENT_ID === 'G-XXXXXXXXXX' ||
  GA_MEASUREMENT_ID.includes('XXXX');

/**
 * GA4 + Google Consent Mode v2, alinhado à CMP oficial do AdSense.
 *
 * Fluxo:
 * 1. Defaults `analytics_storage` / `ad_storage` = **denied**
 *    (snippet no index.html + reforço aqui)
 * 2. Escuta a CMP Google (TCF / Funding Choices / dataLayer consent update)
 * 3. Só após **granted**: `ReactGA.initialize` + pageviews SPA
 * 4. Se o usuário revogar: para pageviews e `analytics_storage: denied`
 *
 * Montar **dentro** de `<BrowserRouter>` (já em main.tsx):
 *
 * ```tsx
 * <BrowserRouter>
 *   <AnalyticsTracker />
 *   <App />
 * </BrowserRouter>
 * ```
 */
export function AnalyticsTracker() {
  const location = useLocation();
  const gaReady = useRef(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const lastPageviewKey = useRef<string | null>(null);

  // 1) Consent Mode defaults (denied) o mais cedo possível no React
  useEffect(() => {
    ensureConsentDefaultsDenied();
  }, []);

  // 2) Escuta a CMP do Google (aceite / revogação)
  useEffect(() => {
    if (isPlaceholderId) {
      if (import.meta.env.DEV) {
        console.info(
          '[Analytics] GA4 placeholder (G-XXXXXXXXXX). Defina VITE_GA_MEASUREMENT_ID. Consent Mode defaults = denied.'
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
          // Reforço idempotente: a CMP do Google em geral já chamou update
          updateConsent({ analytics_storage: 'granted' });
          setAnalyticsAllowed(true);
        } else {
          updateConsent({ analytics_storage: 'denied' });
          setAnalyticsAllowed(false);
          lastPageviewKey.current = null;
        }
      }
    );

    return unsubscribe;
  }, []);

  // 3) Initialize + pageview SPA — somente com consentimento de analytics
  useEffect(() => {
    if (isPlaceholderId || !analyticsAllowed) return;

    if (!gaReady.current) {
      ReactGA.initialize(GA_MEASUREMENT_ID, {
        gtagOptions: {
          anonymize_ip: true,
        },
      });
      gaReady.current = true;
      if (import.meta.env.DEV) {
        console.info(
          '[Analytics] ReactGA.initialize após consentimento granted'
        );
      }
    }

    const page = `${location.pathname}${location.search}`;
    const key = `${page}|${document.title}`;
    if (lastPageviewKey.current === key) return;
    lastPageviewKey.current = key;

    ReactGA.send({
      hitType: 'pageview',
      page,
      title: document.title,
    });
  }, [location.pathname, location.search, analyticsAllowed]);

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
