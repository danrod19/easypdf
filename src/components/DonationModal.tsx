import { useEffect, useId, useRef, useState } from 'react';
import { Check, Coffee, Copy, ExternalLink, Heart, X } from 'lucide-react';
import { donationConfig } from '../data/monetization';

type DonationModalProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Modal de apoio (PIX / Buy me a Coffee) — empático e não intrusivo.
 */
export function DonationModal({ open, onClose }: DonationModalProps) {
  const titleId = useId();
  const descId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  if (!open) return null;

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(donationConfig.pixKey);
      setCopied(true);
    } catch {
      // Fallback para ambientes sem clipboard API
      const el = document.createElement('textarea');
      el.value = donationConfig.pixKey;
      el.setAttribute('readonly', '');
      el.style.position = 'fixed';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand('copy');
        setCopied(true);
      } finally {
        document.body.removeChild(el);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] transition-opacity"
        aria-label="Fechar modal"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Coffee className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2
                id={titleId}
                className="text-base font-semibold text-slate-900 dark:text-slate-50"
              >
                Apoie o projeto
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gratuito · offline · sem conta
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <p
            id={descId}
            className="text-sm leading-relaxed text-slate-600 dark:text-slate-300"
          >
            Esta ferramenta é 100% gratuita, roda no seu próprio dispositivo e
            não tem custos de servidor. Se ela te ajudou hoje, considere apoiar
            o desenvolvedor!
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <Heart className="h-3.5 w-3.5 text-rose-500" aria-hidden />
              PIX
            </div>
            <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
              Favorecido: {donationConfig.pixRecipient}
            </p>
            <code className="block break-all rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-800 dark:bg-slate-900 dark:text-slate-100">
              {donationConfig.pixKey}
            </code>
            <button
              type="button"
              onClick={() => void copyPix()}
              className="btn-secondary mt-3 w-full !py-2 text-sm"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" aria-hidden />
                  Chave copiada!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden />
                  Copiar chave PIX
                </>
              )}
            </button>
          </div>

          {donationConfig.coffeeUrl && (
            <a
              href={donationConfig.coffeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-950/70"
            >
              <Coffee className="h-4 w-4" aria-hidden />
              Buy me a Coffee
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
