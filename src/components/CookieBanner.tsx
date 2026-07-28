import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  cookieConsentLabel,
  hasCookieConsentAnswer,
  OPEN_COOKIE_PREFS_EVENT,
  readCookieConsent,
  restoreCookieConsentFromStorage,
  saveAndApplyCookieConsent,
  type CookieConsentChoice,
} from '../lib/cookieConsent';

type PanelMode = 'hidden' | 'first-visit' | 'manage';

/**
 * Banner de cookies (LGPD + Consent Mode v2).
 * - 1ª visita: barra inferior se ainda não respondeu
 * - Depois: reabre via openCookiePreferences() (link no rodapé)
 */
export function CookieBanner() {
  const [mode, setMode] = useState<PanelMode>('hidden');
  const [current, setCurrent] = useState<CookieConsentChoice | null>(null);
  const titleId = useId();
  const descId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stored = restoreCookieConsentFromStorage();
    setCurrent(stored);
    if (stored !== null || hasCookieConsentAnswer()) {
      setMode('hidden');
      return;
    }
    setMode('first-visit');
  }, []);

  useEffect(() => {
    const onOpen = () => {
      setCurrent(readCookieConsent());
      setMode('manage');
    };
    window.addEventListener(OPEN_COOKIE_PREFS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_COOKIE_PREFS_EVENT, onOpen);
  }, []);

  // Foco e Escape no modo gerenciar (modal)
  useEffect(() => {
    if (mode !== 'manage') return;
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMode('hidden');
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [mode]);

  const apply = (choice: CookieConsentChoice) => {
    saveAndApplyCookieConsent(choice);
    setCurrent(choice);
    setMode('hidden');
  };

  if (mode === 'hidden') return null;

  const actions = (
    <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row sm:justify-end lg:w-auto">
      <button
        type="button"
        onClick={() => apply('denied')}
        className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 sm:w-auto sm:min-w-[10rem] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus-visible:ring-slate-600"
      >
        Apenas necessários
      </button>
      <button
        type="button"
        onClick={() => apply('granted')}
        className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300 sm:w-auto sm:min-w-[10rem] dark:hover:bg-red-500 dark:focus-visible:ring-red-800"
      >
        Aceitar todos
      </button>
    </div>
  );

  const description = (
    <p
      id={descId}
      className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
    >
      Usamos cookies para métricas (Google Analytics) e anúncios (Google
      AdSense), que ajudam a manter o Easy PDF gratuito. Seus arquivos PDF são
      processados só no seu navegador. Detalhes na{' '}
      <Link
        to="/privacidade"
        className="font-medium text-red-600 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 dark:text-red-400 dark:focus-visible:ring-red-800"
        onClick={() => mode === 'manage' && setMode('hidden')}
      >
        Política de Privacidade
      </Link>
      .
    </p>
  );

  // —— 1ª visita: barra inferior ——
  if (mode === 'first-visit') {
    return (
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-200 bg-white/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="min-w-0 flex-1">
            <p
              id={titleId}
              className="text-sm font-semibold text-slate-900 dark:text-white"
            >
              Cookies e privacidade
            </p>
            {description}
          </div>
          {actions}
        </div>
      </div>
    );
  }

  // —— Gerenciar preferências (modal) ——
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        aria-label="Fechar preferências de cookies"
        onClick={() => setMode('hidden')}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div>
            <p
              id={titleId}
              className="text-base font-semibold text-slate-900 dark:text-white"
            >
              Preferências de cookies
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Escolha atual:{' '}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {cookieConsentLabel(current)}
              </span>
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setMode('hidden')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 dark:text-slate-400 dark:hover:bg-slate-800 dark:focus-visible:ring-red-800"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          {description}
          <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <li>
              <strong className="text-slate-700 dark:text-slate-200">
                Aceitar todos:
              </strong>{' '}
              métricas (GA4) e anúncios (AdSense).
            </li>
            <li>
              <strong className="text-slate-700 dark:text-slate-200">
                Apenas necessários:
              </strong>{' '}
              o site funciona; sem tracking e sem anúncios personalizados.
            </li>
          </ul>
          {actions}
        </div>
      </div>
    </div>
  );
}

/** Reexport para imports legados */
export { COOKIE_CONSENT_KEY, readCookieConsent } from '../lib/cookieConsent';
