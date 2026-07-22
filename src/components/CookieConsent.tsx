import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'easypdf-cookie-consent';

/**
 * Banner fixo de consentimento de cookies (AdSense / métricas).
 * Esconde permanentemente após "Aceitar" (localStorage).
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(STORAGE_KEY);
      if (accepted !== 'accepted') {
        setVisible(true);
      }
    } catch {
      // localStorage indisponível (modo privado restrito etc.)
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {
      // ignora falha de escrita; ainda fecha o banner nesta sessão
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-[0_-8px_30px_rgba(0,0,0,0.4)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <p
            id="cookie-consent-title"
            className="text-sm font-semibold text-slate-900 dark:text-white"
          >
            Este site usa cookies
          </p>
          <p
            id="cookie-consent-desc"
            className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
          >
            Utilizamos cookies para anúncios (Google AdSense) e métricas de
            uso, ajudando a manter o Easy PDF gratuito. Seus arquivos PDF
            continuam processados 100% no seu navegador — cookies não enviam o
            conteúdo dos seus documentos. Consulte a{' '}
            <Link
              to="/privacidade"
              className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        <button
          type="button"
          onClick={accept}
          className="btn-primary w-full shrink-0 sm:w-auto sm:min-w-[8.5rem]"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}
