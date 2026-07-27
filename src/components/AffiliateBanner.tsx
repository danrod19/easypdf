import { useState, useEffect } from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { affiliateLinks, type AffiliateLink } from '../data/affiliateLinks';
import {
  getToolNameFromPath,
  MONETIZATION_POSITIONS,
} from '../data/toolNames';
import { trackAffiliateClick } from '../utils/gaEvents';

/**
 * Banner de afiliado “nativo” — sorteia 2 links distintos por montagem.
 */
export function AffiliateBanner() {
  const location = useLocation();
  const toolName = getToolNameFromPath(location.pathname) ?? 'site';
  const [ads, setAds] = useState<AffiliateLink[]>([]);

  useEffect(() => {
    const shuffled = [...affiliateLinks].sort(() => 0.5 - Math.random());
    setAds(shuffled.slice(0, 2));
  }, []);

  if (ads.length === 0) return null;

  const handleAdClick = (ad: AffiliateLink) => {
    trackAffiliateClick({
      toolName,
      affiliateNetwork: ad.platform === 'ml' ? 'ml' : 'amazon',
      affiliateProduct: ad.id,
      position: MONETIZATION_POSITIONS.BANNER_DUO,
    });
  };

  return (
    <div className="mt-8 w-full">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="flex flex-col items-center gap-4 rounded-xl border border-red-100 bg-gradient-to-r from-red-50 to-orange-50 p-4 shadow-sm transition-all hover:shadow-md sm:flex-row dark:border-gray-700 dark:from-gray-800 dark:to-gray-800/80"
          >
            <div className="flex h-28 w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white p-2 sm:w-28 dark:border-gray-600">
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex h-full w-full flex-1 flex-col justify-between text-left">
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    <Star className="h-3 w-3" aria-hidden />
                    {ad.badge}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Patrocinado
                  </span>
                </div>

                <h4 className="mb-1 line-clamp-2 text-base font-bold leading-tight text-gray-900 dark:text-gray-100">
                  {ad.title}
                </h4>

                {ad.price && (
                  <div className="mb-2 flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-green-600 dark:text-green-400">
                      {ad.price}
                    </span>
                    {ad.originalPrice && (
                      <span className="text-xs font-medium text-gray-400 line-through">
                        {ad.originalPrice}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <a
                href={ad.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={() => handleAdClick(ad)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
              >
                {ad.ctaText}
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Faça suas compras no mercado livre a partir dos nossos links e ajude
          na manutenção do site.{' '}
          <a
            href="https://meli.la/1GK6w1X"
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() =>
              trackAffiliateClick({
                toolName,
                affiliateNetwork: 'ml',
                affiliateProduct: 'mercado_livre_lista',
                position: MONETIZATION_POSITIONS.BANNER_FOOTER,
              })
            }
            className="font-bold text-red-600 hover:underline dark:text-red-400"
          >
            Acessar Lista ML
          </a>
        </p>
      </div>
    </div>
  );
}
