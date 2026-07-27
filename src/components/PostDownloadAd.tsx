import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { affiliateLinks, type AffiliateLink } from '../data/affiliateLinks';
import { logEvent } from '../utils/analytics';

/**
 * Anúncio em destaque no “momento de alívio” pós-download.
 * Exibe um único produto aleatório para maximizar CTR.
 */
export function PostDownloadAd() {
  const [ad, setAd] = useState<AffiliateLink | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * affiliateLinks.length);
    setAd(affiliateLinks[randomIndex] ?? null);
  }, []);

  if (!ad) return null;

  const handleAdClick = () => {
    logEvent('affiliate_click', {
      link_id: ad.id,
      platform: ad.platform,
      link_url: ad.url,
      link_title: ad.title,
      placement: 'post_download',
    });
  };

  return (
    <div className="mt-6 rounded-xl border-2 border-green-100 bg-green-50/50 p-5 text-center shadow-sm dark:border-green-900/30 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-100">
        🎉 Download concluído com sucesso!
      </h3>

      <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 text-left sm:flex-row dark:border-gray-600 dark:bg-gray-700">
        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded bg-white p-1">
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
            Oferta Especial
          </span>
          <h4 className="mb-1 font-bold leading-tight text-gray-900 dark:text-gray-100">
            {ad.title}
          </h4>
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            {ad.description}
          </p>
          {ad.price && (
            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-base font-extrabold text-green-600 dark:text-green-400">
                {ad.price}
              </span>
              {ad.originalPrice && (
                <span className="text-xs font-medium text-gray-400 line-through">
                  {ad.originalPrice}
                </span>
              )}
            </div>
          )}
          <a
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={handleAdClick}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            Aproveitar Oferta <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}
