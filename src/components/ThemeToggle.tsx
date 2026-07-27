import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

type ThemeToggleProps = {
  /** `icon` = botão compacto (header); `full` = linha com label (sidebar) */
  variant?: 'icon' | 'full';
  className?: string;
};

/**
 * Alterna light/dark via ThemeContext:
 * - persiste em localStorage (`theme`, com migração da chave legada)
 * - aplica/remove a classe `dark` em <html>
 * - fallback inicial: prefers-color-scheme
 */
export function ThemeToggle({
  variant = 'icon',
  className = '',
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Ativar modo claro' : 'Ativar modo escuro';

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 ${className}`}
        aria-label={label}
        title={label}
      >
        {isDark ? (
          <Sun className="h-5 w-5 shrink-0 text-amber-400" aria-hidden />
        ) : (
          <Moon className="h-5 w-5 shrink-0 text-slate-600 dark:text-slate-300" aria-hidden />
        )}
        <span className="flex-1 text-left">
          {isDark ? 'Modo claro' : 'Modo escuro'}
        </span>
        <span
          className={`relative h-5 w-9 shrink-0 rounded-full transition ${
            isDark ? 'bg-red-600' : 'bg-slate-300'
          }`}
          aria-hidden
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
              isDark ? 'left-4' : 'left-0.5'
            }`}
          />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-red-900 ${className}`}
      aria-label={label}
      title={label}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-400" aria-hidden />
      ) : (
        <Moon className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
