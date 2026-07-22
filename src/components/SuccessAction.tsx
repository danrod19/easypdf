import { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Heart,
  ShoppingCart,
} from 'lucide-react';
import { affiliateConfig } from '../data/monetization';
import { DonationModal } from './DonationModal';

type SuccessActionProps = {
  /** Mensagem principal de sucesso (opcional) */
  message?: string;
  className?: string;
  /** Esconde o botão de afiliado */
  hideAffiliate?: boolean;
};

/**
 * Alerta de sucesso expandido com CTAs de doação e afiliado.
 * Renderize após o processamento bem-sucedido de um arquivo.
 */
export function SuccessAction({
  message = 'Arquivo processado e baixado com sucesso!',
  className = '',
  hideAffiliate = false,
}: SuccessActionProps) {
  const [donateOpen, setDonateOpen] = useState(false);
  const affiliate = affiliateConfig.mercadoLivre;

  return (
    <>
      <div
        role="status"
        className={`rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/30 sm:p-5 ${className}`}
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                {message}
              </p>
              <p className="mt-1 text-sm text-emerald-800/80 dark:text-emerald-200/70">
                Processamento 100% local — seus arquivos não saíram do
                dispositivo.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <button
                type="button"
                onClick={() => setDonateOpen(true)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-300/80 bg-white px-3 py-2.5 text-sm font-medium text-emerald-900 shadow-sm transition hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-100 dark:hover:bg-slate-800"
              >
                <Heart className="h-3.5 w-3.5 shrink-0 text-rose-500" aria-hidden />
                Apoiar com um PIX/Café
              </button>

              {!hideAffiliate && (
                <a
                  href={affiliate.href}
                  target="_blank"
                  rel={affiliate.rel}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-300 hover:text-brand-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-600 dark:hover:text-brand-300"
                >
                  <ShoppingCart
                    className="h-3.5 w-3.5 shrink-0 text-amber-500"
                    aria-hidden
                  />
                  <span className="text-left leading-snug">
                    {affiliate.message}
                  </span>
                  <ExternalLink
                    className="h-3.5 w-3.5 shrink-0 opacity-60"
                    aria-hidden
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <DonationModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </>
  );
}
