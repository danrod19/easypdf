import { Link } from 'react-router-dom';
import { openCookiePreferences } from '../lib/cookieConsent';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-sm text-slate-500 sm:flex-row sm:px-6 sm:text-left lg:px-8 dark:text-slate-400">
        <p>
          © {new Date().getFullYear()} Easy PDF — processamento no seu
          dispositivo.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400">
            Início
          </Link>
          <Link
            to="/juntar-pdf"
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            Juntar PDF
          </Link>
          <Link
            to="/pdf-sem-upload"
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            PDF sem upload
          </Link>
          <Link
            to="/dividir-pdf"
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            Dividir PDF
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
            Termos de Uso
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
            Sobre Nós
          </Link>
          <Link
            to="/contato"
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            Contato
          </Link>
          <button
            type="button"
            onClick={() => openCookiePreferences()}
            className="hover:text-brand-600 focus:outline-none focus-visible:underline dark:hover:text-brand-400"
          >
            Preferências de cookies
          </button>
        </div>
      </div>
    </footer>
  );
}
