/**
 * Consentimento de cookies (LGPD) + Google Consent Mode v2.
 * Chave localStorage: cookie_consent = "granted" | "denied"
 *
 * Defaults "denied" no index.html antes de qualquer tag Google.
 * Só "granted" após o usuário clicar em "Aceitar todos".
 */

import {
  CONSENT_DEFAULT_DENIED,
  updateConsent,
  type ConsentState,
} from './googleConsent';

/** Chave canônica no localStorage */
export const COOKIE_CONSENT_KEY = 'cookie_consent';

/** Chave legada (banner antigo só com Aceitar) */
const LEGACY_CONSENT_KEY = 'easypdf-cookie-consent';

export type CookieConsentChoice = 'granted' | 'denied';

export const CONSENT_GRANTED_STATE: ConsentState = {
  analytics_storage: 'granted',
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
};

export const CONSENT_DENIED_STATE: ConsentState = {
  ...CONSENT_DEFAULT_DENIED,
};

/** Evento custom para SPA (AnalyticsTracker, AdSenseUnit, etc.) */
export const COOKIE_CONSENT_EVENT = 'easypdf-consent';

export type CookieConsentEventDetail = {
  choice: CookieConsentChoice;
  analytics_storage: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
};

/**
 * Lê a escolha salva. Migra legada "accepted" → "granted".
 * null = ainda não respondeu.
 */
export function readCookieConsent(): CookieConsentChoice | null {
  if (typeof window === 'undefined') return null;
  try {
    const current = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (current === 'granted' || current === 'denied') return current;

    const legacy = localStorage.getItem(LEGACY_CONSENT_KEY);
    if (legacy === 'accepted') {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'granted');
      return 'granted';
    }
    return null;
  } catch {
    return null;
  }
}

export function hasCookieConsentAnswer(): boolean {
  return readCookieConsent() !== null;
}

export function isAnalyticsConsentGranted(): boolean {
  return readCookieConsent() === 'granted';
}

export function isAdsConsentGranted(): boolean {
  return readCookieConsent() === 'granted';
}

function persistChoice(choice: CookieConsentChoice): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, choice);
  } catch {
    // modo privado restrito
  }
}

function dispatchConsentEvent(choice: CookieConsentChoice): void {
  window.dispatchEvent(
    new CustomEvent<CookieConsentEventDetail>(COOKIE_CONSENT_EVENT, {
      detail: {
        choice,
        analytics_storage: choice,
        ad_storage: choice,
      },
    })
  );
}

/**
 * Aplica Consent Mode v2 + evento SPA.
 * Não grava localStorage (use saveAndApplyCookieConsent para a escolha do user).
 */
export function applyCookieConsent(choice: CookieConsentChoice): void {
  if (choice === 'granted') {
    updateConsent(CONSENT_GRANTED_STATE);
  } else {
    updateConsent(CONSENT_DENIED_STATE);
  }
  dispatchConsentEvent(choice);
}

/** Persiste + aplica (botões Aceitar / Recusar). */
export function saveAndApplyCookieConsent(choice: CookieConsentChoice): void {
  persistChoice(choice);
  applyCookieConsent(choice);
}

/**
 * No boot: se já houver escolha salva, reaplica no gtag.
 * Se não houver, mantém denied (defaults do index.html).
 */
export function restoreCookieConsentFromStorage(): CookieConsentChoice | null {
  const stored = readCookieConsent();
  if (stored === 'granted' || stored === 'denied') {
    applyCookieConsent(stored);
    return stored;
  }
  // garante denied explícito se ainda não respondeu
  updateConsent(CONSENT_DENIED_STATE);
  return null;
}
