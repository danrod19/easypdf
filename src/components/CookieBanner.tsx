import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { updateConsent } from '../lib/googleConsent';

/** Chave oficial (Consent Mode v2). */
export const COOKIE_CONSENT_KEY = 'cookie_consent';

/** Chave legada do banner antigo — migrada no primeiro load. */
const LEGACY_CONSENT_KEY = 'easypdf-cookie-consent';

const GRANTED_VALUE = 'granted';

const CONSENT_GRANTED = {
  analytics_storage: 'granted' as const,
  ad_storage: 'granted' as const,
  ad_user_data: 'granted' as const,
  ad_personalization: 'granted' as const,
};

function readStoredConsent(): string | null {
  try {
    const current = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (current) return current;

    // Migra aceite antigo → novo formato
    const legacy = localStorage.getItem(LEGACY_CONSENT_KEY);
    if (legacy === 'accepted') {
      localStorage.setItem(COOKIE_CONSENT_KEY, GRANTED_VALUE);
      return GRANTED_VALUE;
    }
    return null;
  } catch {
    return null;
  }
}

function applyGrantedConsent(): void {
  updateConsent(CONSENT_GRANTED);
  // Compatível com listeners do AnalyticsTracker / CMP
  window.dispatchEvent(
    new CustomEvent('easypdf-consent', {
      detail: { analytics_storage: 'granted' },
    })
  );
}

/**
 * Banner fixo de cookies (Consent Mode v2 / GA4 + AdSense).
 * - Aceitar → localStorage cookie_consent = "granted" + gtag consent update
 * - Já aceito → reaplica consent update e não mostra o banner
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = readStoredConsent();
    if (stored === GRANTED_VALUE) {
      applyGrantedConsent();
      setVisible(false);
      return;
    }
    setVisible(true);
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, GRANTED_VALUE);
    } catch {
      // modo privado restrito — ainda fecha o banner nesta sessão
    }
    applyGrantedConsent();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-[0_-8px_30px_rgba(0,0,0,0.4)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <p
            id="cookie-banner-title"
            className="text-sm font-semibold text-slate-900 dark:text-white"
          >
            Este site usa cookies
          </p>
          <p
            id="cookie-banner-desc"
            className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
          >
            Utilizamos cookies para anúncios (Google AdSense) e métricas de uso
            (GA4), ajudando a manter o Easy PDF gratuito. Seus arquivos PDF
            continuam processados 100% no seu navegador — cookies não enviam o
            conteúdo dos seus documentos. Consulte a{' '}
            <Link
              to="/privacidade"
              className="font-medium text-red-600 underline-offset-2 hover:underline dark:text-red-400"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        <button
          type="button"
          onClick={accept}
          className="inline-flex w-full shrink-0 items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300 sm:w-auto sm:min-w-[8.5rem] dark:hover:bg-red-500 dark:focus-visible:ring-red-800"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}
