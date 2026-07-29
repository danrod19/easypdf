import { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, Heart } from 'lucide-react';
import { affiliateLinks, type AffiliateLink } from '../data/affiliateLinks';
import {
  MONETIZATION_POSITIONS,
  type ToolName,
} from '../data/toolNames';
import {
  trackAffiliateClick,
  trackDonationClick,
} from '../utils/gaEvents';
import { DonationModal } from './DonationModal';

type SuccessActionProps = {
  /** Mensagem principal de sucesso (curta) */
  message?: string;
  className?: string;
  /** Esconde ofertas de afiliado */
  hideAffiliate?: boolean;
  /**
   * @deprecated Use hideAffiliate — mantido por compatibilidade com páginas antigas
   */
  hidePostDownloadAd?: boolean;
  /** Nome canônico da ferramenta (GA4) */
  toolName?: ToolName | string;
  /** Quantidade de ofertas (1 ou 2). Default: 1 no mobile-friendly, 2 no desktop via CSS grid. */
  offerCount?: 1 | 2;
};

function pickOffers(count: number): AffiliateLink[] {
  const shuffled = [...affiliateLinks];
  // Fisher–Yates
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Bloco único pós-sucesso: mensagem + PIX discreto + 1–2 ofertas.
 * Renderize apenas após processamento bem-sucedido.
 */
export function SuccessAction({
  message = 'Pronto! Seu arquivo foi processado.',
  className = '',
  hideAffiliate = false,
  hidePostDownloadAd = false,
  toolName = 'unknown',
  offerCount = 2,
}: SuccessActionProps) {
  const [donateOpen, setDonateOpen] = useState(false);
  const [offers, setOffers] = useState<AffiliateLink[]>([]);
  const showOffers = !hideAffiliate && !hidePostDownloadAd;

  useEffect(() => {
    if (!showOffers) return;
    setOffers(pickOffers(offerCount));
  }, [showOffers, offerCount]);

  const handleDonationClick = () => {
    trackDonationClick(toolName, MONETIZATION_POSITIONS.SUCCESS_MODAL);
    setDonateOpen(true);
  };

  const handleOfferClick = (ad: AffiliateLink) => {
    trackAffiliateClick({
      toolName,
      affiliateNetwork: ad.platform === 'ml' ? 'ml' : 'amazon',
      affiliateProduct: ad.id,
      position: MONETIZATION_POSITIONS.SUCCESS_MODAL,
    });
  };

  return (
    <>
      <div
        role="status"
        className={`overflow-hidden rounded-2xl border border-emerald-200/90 bg-white shadow-sm dark:border-emerald-900/40 dark:bg-slate-900 ${className}`}
      >
        {/* Faixa de sucesso — objetiva */}
        <div className="flex items-start gap-3 border-b border-emerald-100 bg-emerald-50/90 px-4 py-3.5 dark:border-emerald-900/30 dark:bg-emerald-950/40 sm:px-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="font-semibold leading-snug text-emerald-900 dark:text-emerald-50">
              {message}
            </p>
            <p className="mt-0.5 text-xs text-emerald-800/75 dark:text-emerald-200/70">
              100% no seu dispositivo — nada foi enviado à nuvem.
            </p>
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          {/* Ofertas (1–2) — foco de conversão */}
          {showOffers && offers.length > 0 && (
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Apoie o site com uma oferta
              </p>
              <div
                className={`grid gap-3 ${
                  offers.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'
                }`}
              >
                {offers.map((ad) => (
                  <a
                    key={ad.id}
                    href={ad.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={() => handleOfferClick(ad)}
                    className="group flex gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 transition hover:border-red-200 hover:bg-white hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-red-900/50 dark:hover:bg-slate-800"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-white p-1 dark:border-slate-600">
                      <img
                        src={ad.imageUrl}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 group-hover:text-red-700 dark:text-slate-50 dark:group-hover:text-red-300">
                        {ad.title}
                      </p>
                      {ad.price && (
                        <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {ad.price}
                          {ad.originalPrice && (
                            <span className="ml-1.5 text-xs font-medium text-slate-400 line-through">
                              {ad.originalPrice}
                            </span>
                          )}
                        </p>
                      )}
                      <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                        {ad.ctaText}
                        <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* PIX — discreto, secundário */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gostou da ferramenta?
            </p>
            <button
              type="button"
              onClick={handleDonationClick}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 dark:text-slate-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 dark:focus-visible:ring-rose-800"
            >
              <Heart className="h-3.5 w-3.5 text-rose-500" aria-hidden />
              Apoiar com PIX
            </button>
          </div>
        </div>
      </div>

      <DonationModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </>
  );
}
