import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { tools, type ToolIconName } from '../data/tools';
import { useTheme } from '../context/ThemeContext';
import { DonationModal } from './DonationModal';

type SidebarProps = {
  /** Fecha o drawer mobile ao navegar / clicar no overlay. */
  onNavigate?: () => void;
  /** Botão X no topo (drawer mobile). */
  onClose?: () => void;
  className?: string;
  id?: string;
};

/**
 * Menu lateral com as ferramentas, logo e toggle de tema.
 * Usado no desktop (fixo) e no drawer mobile (off-canvas).
 */
export function Sidebar({
  onNavigate,
  onClose,
  className = '',
  id,
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <>
    <div
      id={id}
      className={`flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 ${className}`}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 px-3 dark:border-slate-800">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex min-w-0 flex-1 items-center gap-2.5 font-bold text-brand-700 dark:text-brand-300"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm dark:bg-brand-500">
            <PdfIcon className="h-5 w-5" />
          </span>
          <span className="truncate text-base tracking-tight">Easy PDF</span>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Fechar menu"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navegação */}
      <nav
        className="flex-1 space-y-1 overflow-y-auto p-3"
        aria-label="Ferramentas"
      >
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Ferramentas
        </p>

        <NavLink
          to="/"
          end
          onClick={onNavigate}
          className={({ isActive }) => navClass(isActive)}
        >
          <HomeIcon className="h-5 w-5 shrink-0" />
          <span className="truncate">Início</span>
        </NavLink>

        {tools.map((tool) => (
          <NavLink
            key={tool.path}
            to={tool.path}
            onClick={onNavigate}
            className={({ isActive }) => navClass(isActive)}
          >
            <ToolIcon name={tool.icon} className="h-5 w-5 shrink-0" />
            <span className="min-w-0 flex-1 truncate">{tool.title}</span>
            {tool.status === 'soon' && (
              <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                Em breve
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Apoio + tema + rodapé do menu */}
      <div className="shrink-0 space-y-2 border-t border-slate-200 p-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setDonateOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-800 transition hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-950/70"
        >
          <Heart className="h-5 w-5 shrink-0 text-rose-500" aria-hidden />
          <span className="flex-1 text-left">Apoie o Projeto</span>
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label={
            theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'
          }
        >
          {theme === 'dark' ? (
            <SunIcon className="h-5 w-5 text-amber-400" />
          ) : (
            <MoonIcon className="h-5 w-5 text-slate-600" />
          )}
          <span className="flex-1 text-left">
            {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          </span>
          <span
            className={`relative h-5 w-9 shrink-0 rounded-full transition ${
              theme === 'dark' ? 'bg-brand-600' : 'bg-slate-300'
            }`}
            aria-hidden
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
                theme === 'dark' ? 'left-4' : 'left-0.5'
              }`}
            />
          </span>
        </button>

        <a
          href="mailto:easypdf19@gmail.com?subject=Feedback%20-%20Easy%20PDF"
          className="block rounded-lg px-1 py-1 text-center text-[11px] leading-snug text-slate-400 transition hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:text-slate-500 dark:hover:text-brand-400"
        >
          💡 Sugestões ou Relatar Falha
        </a>

        <p className="px-1 text-center text-[11px] leading-snug text-slate-400 dark:text-slate-500">
          Processamento 100% no dispositivo
        </p>
      </div>
    </div>

    <DonationModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </>
  );
}

function navClass(isActive: boolean): string {
  return [
    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
    'border-l-4',
    isActive
      ? 'border-brand-600 bg-brand-50 text-brand-800 dark:border-brand-400 dark:bg-brand-950/70 dark:text-brand-100'
      : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100',
  ].join(' ');
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PdfIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2.5L18.5 10H13V4.5zM8 13h8v2H8v-2zm0 4h5v2H8v-2z" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ToolIcon({
  name,
  className,
}: {
  name: ToolIconName;
  className?: string;
}) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };

  switch (name) {
    case 'merge':
      return (
        <svg {...common}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case 'split':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      );
    case 'rotate':
      return (
        <svg {...common}>
          <path d="M21 12a9 9 0 1 1-3-6.7" />
          <polyline points="21 3 21 9 15 9" />
        </svg>
      );
    case 'watermark':
      return (
        <svg {...common}>
          <path d="M5 22V2" />
          <path d="M19 22V2" />
          <path d="M5 12h14" />
          <path d="M9 8h6" />
          <path d="M9 16h6" />
          <rect x="7" y="4" width="10" height="16" rx="1" />
        </svg>
      );
    case 'draw':
      return (
        <svg {...common}>
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      );
    case 'word':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9 15l1.5-4L12 15l1.5-4L15 15" />
        </svg>
      );
    case 'image':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case 'ocr':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    default:
      return null;
  }
}
