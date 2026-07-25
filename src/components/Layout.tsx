import { Suspense, useEffect, useId, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PrivacyBanner } from './PrivacyBanner';
import { CookieConsent } from './CookieConsent';
import { Footer } from './Footer';
import { AdSlot } from './AdSlot';
import { AdBanner } from './AdBanner';
import { Sidebar } from './Sidebar';
import { ErrorBoundary } from './ErrorBoundary';

/**
 * Layout global: sidebar fixa (desktop) + drawer off-canvas (mobile)
 * e área de conteúdo com scroll independente.
 */
export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const sidebarId = useId();

  // Fecha o drawer ao mudar de rota
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Esc fecha o menu mobile
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  // Evita scroll do body com o drawer aberto
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
      <PrivacyBanner />

      <div className="flex min-h-0 flex-1">
        {/* Sidebar desktop — sempre visível */}
        <aside className="hidden h-full shrink-0 lg:flex" aria-label="Menu principal">
          <Sidebar />
        </aside>

        {/* Drawer mobile */}
        <div
          className={`fixed inset-0 z-40 lg:hidden ${
            mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          aria-hidden={!mobileOpen}
        >
          {/* Overlay */}
          <button
            type="button"
            className={`absolute inset-0 bg-slate-900/50 transition-opacity ${
              mobileOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeMobile}
            tabIndex={mobileOpen ? 0 : -1}
            aria-label="Fechar menu"
          />

          {/* Painel */}
          <div
            className={`absolute inset-y-0 left-0 flex transform shadow-2xl transition-transform duration-300 ease-out ${
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            id={sidebarId}
          >
            <Sidebar onNavigate={closeMobile} onClose={closeMobile} />
          </div>
        </div>

        {/* Coluna de conteúdo */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar mobile */}
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/90 px-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={mobileOpen}
              aria-controls={sidebarId}
            >
              <HamburgerIcon className="h-5 w-5" />
            </button>

            <Link
              to="/"
              className="flex min-w-0 items-center gap-2 font-bold text-brand-700 dark:text-brand-300"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white dark:bg-brand-500">
                <PdfIcon className="h-4 w-4" />
              </span>
              <span className="truncate">Easy PDF</span>
            </Link>
          </header>

          {/* Conteúdo com scroll — data-scroll-root para StickyCta */}
          <div className="min-h-0 flex-1 overflow-y-auto" data-scroll-root>
            {/* Banner AdSense topo — altura fixa (anti-CLS) */}
            <div className="border-b border-slate-200/80 px-4 py-3 sm:px-6 lg:px-8 dark:border-slate-800/80">
              <div className="mx-auto max-w-6xl">
                <AdBanner placement="top" />
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-6 pb-24 sm:px-6 sm:py-8 sm:pb-28 lg:px-8">
              {/* Ad lateral — telas grandes */}
              <aside className="hidden w-36 shrink-0 xl:block" aria-hidden>
                <div className="sticky top-6">
                  <AdSlot placement="sidebar-left" />
                </div>
              </aside>

              <main className="min-w-0 flex-1">
                {/* Boundary + Suspense no Outlet: Sidebar/shell permanecem visíveis */}
                <ErrorBoundary compact>
                  <Suspense
                    fallback={
                      <div
                        className="flex min-h-[40vh] flex-col items-center justify-center gap-3 py-16"
                        role="status"
                        aria-live="polite"
                        aria-busy="true"
                      >
                        <span
                          className="h-9 w-9 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400"
                          aria-hidden
                        />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Carregando ferramenta…
                        </p>
                      </div>
                    }
                  >
                    <Outlet />
                  </Suspense>
                </ErrorBoundary>
              </main>

              <aside className="hidden w-36 shrink-0 2xl:block" aria-hidden>
                <div className="sticky top-6">
                  <AdSlot placement="sidebar-right" />
                </div>
              </aside>
            </div>

            {/* Banner AdSense rodapé — antes do Footer */}
            <div className="border-t border-slate-200/80 px-4 py-3 sm:px-6 lg:px-8 dark:border-slate-800/80">
              <div className="mx-auto max-w-6xl">
                <AdBanner placement="bottom" />
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>

      <CookieConsent />
    </div>
  );
}

function HamburgerIcon({ className }: { className?: string }) {
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
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
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
