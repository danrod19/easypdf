import { Link } from 'react-router-dom';
import { openCookiePreferences } from '../lib/cookieConsent';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8 dark:text-slate-400">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:items-start">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Easy PDF Local — processamento no seu
            dispositivo.
          </p>
          <p className="max-w-md text-center text-xs leading-relaxed sm:text-right">
            As tools rodam no navegador.{' '}
            <Link
              to="/pdf-sem-upload"
              className="font-semibold text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-300"
            >
              PDF sem upload
            </Link>
            : o arquivo não sobe para processar.
          </p>
        </div>

        <nav
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-slate-100 pt-4 sm:justify-start dark:border-slate-800"
          aria-label="Rodapé"
        >
          <Link
            to="/"
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            Início
          </Link>
          <Link
            to="/pdf-sem-upload"
            className="font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200"
          >
            PDF sem upload
          </Link>
          <Link
            to="/juntar-pdf"
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            Juntar PDF
          </Link>
          <Link
            to="/blog"
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            Blog
          </Link>
          <Link
            to="/sobre"
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            Sobre
          </Link>
          <Link
            to="/contato"
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            Contato
          </Link>
          <Link
            to="/privacidade"
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            Privacidade
          </Link>
          <Link
            to="/termos"
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            Termos
          </Link>
          <button
            type="button"
            onClick={() => openCookiePreferences()}
            className="hover:text-brand-600 focus:outline-none focus-visible:underline dark:hover:text-brand-400"
          >
            Preferências de cookies
          </button>
        </nav>
      </div>
    </footer>
  );
}
