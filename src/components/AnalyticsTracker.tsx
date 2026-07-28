import { useEffect, useState } from 'react';
import {
  ensureConsentDefaultsDenied,
  updateConsent,
  type ConsentValue,
} from '../lib/googleConsent';
import {
  COOKIE_CONSENT_EVENT,
  isAnalyticsConsentGranted,
  restoreCookieConsentFromStorage,
  type CookieConsentEventDetail,
} from '../lib/cookieConsent';
import { GA_MEASUREMENT_ID, isGaPlaceholder } from '../utils/analytics';

/**
 * Google Consent Mode v2 + sincronização com CookieBanner.
 * Pageviews SPA: <RouteTracker /> (respeita cookie_consent via logPageView).
 */
export function AnalyticsTracker() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(() =>
    typeof window !== 'undefined' ? isAnalyticsConsentGranted() : false
  );

  useEffect(() => {
    ensureConsentDefaultsDenied();
    const restored = restoreCookieConsentFromStorage();
    setAnalyticsAllowed(restored === 'granted');
  }, []);

  useEffect(() => {
    const onConsent = (ev: Event) => {
      const detail = (ev as CustomEvent<CookieConsentEventDetail>).detail;
      const granted = detail?.choice === 'granted';
      setAnalyticsAllowed(granted);
    };
    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
  }, []);

  // Config GA4 só com consentimento positivo
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
    ad_storage: 'granted' as ConsentValue,
    ad_user_data: 'granted' as ConsentValue,
    ad_personalization: 'granted' as ConsentValue,
  });
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, {
      detail: {
        choice: 'granted',
        analytics_storage: 'granted',
        ad_storage: 'granted',
      },
    })
  );
}
