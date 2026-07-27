import { useState, useEffect } from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { affiliateLinks, type AffiliateLink } from '../data/affiliateLinks';
import { logEvent } from '../utils/analytics';

/**
 * Banner de afiliado “nativo” — sorteia um link por montagem.
 * Renderizado como HTML normal (não é AdSense), o que reduz bloqueio por AdBlock.
 */
export function AffiliateBanner() {
  const [ad, setAd] = useState<AffiliateLink | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * affiliateLinks.length);
    setAd(affiliateLinks[randomIndex] ?? null);
  }, []);

  if (!ad) return null;

  return (
    <aside
      className="mt-8 rounded-xl border border-red-100 bg-gradient-to-r from-red-50 to-orange-50 p-5 shadow-sm transition-all hover:shadow-md dark:border-red-900/40 dark:from-red-950/40 dark:to-orange-950/30"
      aria-label="Conteúdo patrocinado"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700 dark:bg-red-900/50 dark:text-red-200">
              <Star className="h-3 w-3" aria-hidden />
              {ad.badge}
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Patrocinado
            </span>
          </div>
          <h4 className="mb-1 text-lg font-bold leading-tight text-slate-900 dark:text-slate-50">
            {ad.title}
          </h4>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {ad.description}
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <a
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() =>
              logEvent('affiliate_click', {
                link_id: ad.id,
                platform: ad.platform,
                link_url: ad.url,
                link_title: ad.title,
              })
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300 sm:w-auto dark:bg-red-600 dark:hover:bg-red-500 dark:focus-visible:ring-red-800"
          >
            {ad.ctaText}
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </aside>
  );
}
