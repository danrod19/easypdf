import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  hasCookieConsentAnswer,
  restoreCookieConsentFromStorage,
  saveAndApplyCookieConsent,
} from '../lib/cookieConsent';

/**
 * Banner de cookies (LGPD + Consent Mode v2).
 * - Só aparece se o usuário ainda não respondeu
 * - "Aceitar todos" → granted (GA4 + AdSense)
 * - "Apenas necessários" → denied (sem tracking/ads personalizados)
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reaplica escolha salva (ou reforça denied) o quanto antes
    const stored = restoreCookieConsentFromStorage();
    if (stored !== null || hasCookieConsentAnswer()) {
      setVisible(false);
      return;
    }
    setVisible(true);
  }, []);

  const acceptAll = () => {
    saveAndApplyCookieConsent('granted');
    setVisible(false);
  };

  const rejectNonEssential = () => {
    saveAndApplyCookieConsent('denied');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-200 bg-white/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-[0_-8px_30px_rgba(0,0,0,0.4)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="min-w-0 flex-1">
          <p
            id="cookie-banner-title"
            className="text-sm font-semibold text-slate-900 dark:text-white"
          >
            Cookies e privacidade
          </p>
          <p
            id="cookie-banner-desc"
            className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
          >
            Usamos cookies para métricas (Google Analytics) e anúncios (Google
            AdSense), que ajudam a manter o Easy PDF gratuito. Seus arquivos PDF
            são processados só no seu navegador — nunca enviamos o conteúdo dos
            documentos. Você pode aceitar todos ou usar apenas o necessário para
            o site funcionar. Detalhes na{' '}
            <Link
              to="/privacidade"
              className="font-medium text-red-600 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 dark:text-red-400 dark:focus-visible:ring-red-800"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row sm:justify-end lg:w-auto">
          <button
            type="button"
            onClick={rejectNonEssential}
            className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 sm:w-auto sm:min-w-[10rem] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus-visible:ring-slate-600"
          >
            Apenas necessários
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300 sm:w-auto sm:min-w-[10rem] dark:hover:bg-red-500 dark:focus-visible:ring-red-800"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}

/** Reexport para imports legados */
export { COOKIE_CONSENT_KEY, readCookieConsent } from '../lib/cookieConsent';
