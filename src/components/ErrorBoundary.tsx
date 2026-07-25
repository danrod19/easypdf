import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
  /** Quando true, o fallback ocupa menos espaço (útil dentro do Layout). */
  compact?: boolean;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

/**
 * Rede de segurança para erros de renderização e falhas de carregamento de chunks (lazy).
 * O React ainda exige class component para Error Boundaries.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log para diagnóstico em dev / futuros serviços de observabilidade
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const compact = this.props.compact;

      return (
        <div
          className={
            compact
              ? 'flex min-h-[40vh] flex-col items-center justify-center px-4 py-12'
              : 'flex min-h-[50vh] flex-col items-center justify-center px-4 py-16'
          }
          role="alert"
        >
          <div className="card mx-auto w-full max-w-md text-center">
            <span
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
              aria-hidden
            >
              <AlertIcon className="h-7 w-7" />
            </span>

            <h1 className="mt-5 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Ops! Encontramos um obstáculo.
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Ocorreu um erro inesperado no processamento da interface — pode
              ser uma falha temporária de carregamento ou de renderização. Seus
              arquivos no dispositivo não são afetados.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              className="btn-primary mt-6 w-full sm:w-auto"
            >
              Recarregar Página
            </button>

            {import.meta.env.DEV && this.state.error ? (
              <p className="mt-4 break-all text-left text-xs text-slate-400 dark:text-slate-500">
                {this.state.error.message}
              </p>
            ) : null}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AlertIcon({ className }: { className?: string }) {
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
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
