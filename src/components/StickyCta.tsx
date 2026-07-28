import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';

type StickyCtaProps = {
  /** Seletor do DropZone / âncora de foco (default: #tool-dropzone) */
  targetSelector?: string;
  /** Pixels de scroll antes de exibir o banner */
  showAfter?: number;
  label?: string;
  hint?: string;
};

/**
 * Banner flutuante de conversão: aparece ao rolar (FAQ / instruções)
 * e foca o DropZone do topo da página de ferramenta.
 */
export function StickyCta({
  targetSelector = '#tool-dropzone',
  showAfter = 380,
  label = 'Carregar Arquivo para Começar',
  hint = 'Processamento 100% local no navegador',
}: StickyCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // O scroll real está no container do Layout (overflow-y-auto), não no window
    const scrollRoot =
      document.querySelector<HTMLElement>('[data-scroll-root]') ??
      document.documentElement;

    const onScroll = () => {
      const top =
        scrollRoot === document.documentElement
          ? window.scrollY || document.documentElement.scrollTop
          : scrollRoot.scrollTop;
      setVisible(top > showAfter);
    };

    onScroll();
    scrollRoot.addEventListener('scroll', onScroll, { passive: true });
    // fallback se o scroll for no window
    if (scrollRoot !== document.documentElement) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => {
      scrollRoot.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, [showAfter]);

  const handleClick = () => {
    const el = document.querySelector<HTMLElement>(targetSelector);
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Destaca brevemente e tenta focar / acionar o dropzone
    el.classList.add('ring-2', 'ring-brand-500', 'ring-offset-2');
    window.setTimeout(() => {
      el.classList.remove('ring-2', 'ring-brand-500', 'ring-offset-2');
    }, 1600);

    // Foco acessível; se for o dropzone clicável, Enter abre o seletor
    if (typeof el.focus === 'function') {
      try {
        el.focus({ preventScroll: true });
      } catch {
        el.focus();
      }
    }
  };

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 sm:px-4 sm:pb-5 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      } transition-all duration-300 ease-out`}
      aria-hidden={!visible}
    >
      <div
        className={`pointer-events-auto flex w-full max-w-xl items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-2.5 pl-4 shadow-xl shadow-slate-900/10 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/95 dark:shadow-black/40 ${
          visible ? '' : 'pointer-events-none'
        }`}
        role="region"
        aria-label="Atalho para carregar arquivo"
      >
        <div className="hidden min-w-0 flex-1 sm:block">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
            Pronto para começar?
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {hint}
          </p>
        </div>

        <button
          type="button"
          onClick={handleClick}
          tabIndex={visible ? 0 : -1}
          className="btn-primary w-full shrink-0 !rounded-xl !px-4 !py-2.5 text-sm sm:w-auto"
        >
          <Upload className="h-4 w-4" aria-hidden />
          {label}
        </button>
      </div>
    </div>
  );
}
