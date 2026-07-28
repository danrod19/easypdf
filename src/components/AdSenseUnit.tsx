import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ADSENSE_CLIENT,
  isAdSenseClientReady,
  isPlaceholderSlot,
} from '../data/adsense';
import {
  COOKIE_CONSENT_EVENT,
  isAdsConsentGranted,
  type CookieConsentEventDetail,
} from '../lib/cookieConsent';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export type AdSenseUnitProps = {
  /** data-ad-slot da unidade no painel AdSense */
  slot: string;
  /**
   * Formato AdSense:
   * - auto: responsivo (banner / below-cta)
   * - rectangle | horizontal | vertical | fluid
   */
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'fluid';
  /** data-full-width-responsive */
  fullWidthResponsive?: boolean;
  className?: string;
  /** Altura mínima reservada (anti-CLS) */
  minHeightClass?: string;
  /** Rótulo acessível */
  label?: string;
  /** data-* de debug / layout */
  'data-placement'?: string;
};

/**
 * Unidade real do Google AdSense.
 * - <ins class="adsbygoogle" data-ad-client data-ad-slot …>
 * - (window.adsbygoogle = window.adsbygoogle || []).push({})
 * - Remonta o <ins> em cada rota SPA para permitir novo fill
 */
export function AdSenseUnit({
  slot,
  format = 'auto',
  fullWidthResponsive = true,
  className = '',
  minHeightClass = 'min-h-[90px]',
  label = 'Publicidade',
  'data-placement': dataPlacement,
}: AdSenseUnitProps) {
  const { pathname } = useLocation();
  // Chave única por rota + slot → React recria o <ins> limpo
  const unitKey = `${pathname}::${slot}::${dataPlacement ?? format}`;

  const [adsAllowed, setAdsAllowed] = useState(() =>
    typeof window !== 'undefined' ? isAdsConsentGranted() : false
  );

  useEffect(() => {
    setAdsAllowed(isAdsConsentGranted());
    const onConsent = (ev: Event) => {
      const detail = (ev as CustomEvent<CookieConsentEventDetail>).detail;
      setAdsAllowed(detail?.choice === 'granted');
    };
    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
  }, []);

  const clientReady = isAdSenseClientReady();
  const slotReady = !isPlaceholderSlot(slot);
  // LGPD: só monta/push de anúncio com consentimento positivo
  const canRenderAd = clientReady && slotReady && adsAllowed;

  useEffect(() => {
    if (!canRenderAd) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Script ainda carregando ou site em "Preparando" — sem quebrar a UI
    }
  }, [unitKey, canRenderAd]);

  return (
    <div
      className={`adsense-unit w-full overflow-hidden ${minHeightClass} ${className}`}
      data-adsense-placement={dataPlacement}
      data-adsense-ready={canRenderAd ? 'true' : 'false'}
      role="complementary"
      aria-label={label}
    >
      {canRenderAd ? (
        <ins
          key={unitKey}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={
            fullWidthResponsive ? 'true' : 'false'
          }
        />
      ) : (
        /*
          Reserva de espaço (anti-CLS) enquanto:
          - slots ainda são XXXXXXXXXX, ou
          - o site está em análise e ainda não há fill.
          Troque os slot IDs em src/data/adsense.ts ou .env → redeploy.
        */
        <div
          className="flex h-full min-h-[inherit] w-full items-center justify-center border border-dashed border-slate-200 bg-slate-50 text-[11px] text-slate-400 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-500"
          aria-hidden
        >
          <span className="select-none tracking-wide">{label}</span>
        </div>
      )}
    </div>
  );
}
