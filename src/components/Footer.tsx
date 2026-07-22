import { Link } from 'react-router-dom';

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
            to="/dividir-pdf"
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            Dividir PDF
          </Link>
          <a
            href="mailto:easypdf19@gmail.com?subject=Feedback%20-%20Easy%20PDF"
            className="rounded-md text-slate-500 transition hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:text-slate-400 dark:hover:text-brand-400"
          >
            💡 Sugestões ou Relatar Falha
          </a>
        </div>
      </div>
    </footer>
  );
}
