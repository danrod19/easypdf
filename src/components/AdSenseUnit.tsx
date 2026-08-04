import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ADSENSE_CLIENT,
  canMountAdSenseUnit,
  isValidAdSenseSlot,
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
  /**
   * Altura mínima reservada (anti-CLS) — só aplica com slot **real**
   * e consentimento granted (unidade montada).
   */
  minHeightClass?: string;
  /** Rótulo acessível (aria-label) quando o ad está montado */
  label?: string;
  /** data-* de debug / layout */
  'data-placement'?: string;
};

/**
 * Unidade Google AdSense.
 *
 * Regras:
 * - Slot placeholder/inválido → **null** (sem “Publicidade”, sem <ins>, sem push)
 * - Slot real + consentimento denied/ausente → **null**
 * - Slot real + cookie_consent=granted → <ins> + adsbygoogle.push
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

  // Slot inválido/placeholder: não ocupa layout nem chama AdSense
  if (!canMountAdSenseUnit(slot) || !isValidAdSenseSlot(slot)) {
    return null;
  }

  // LGPD: só monta com consentimento positivo
  if (!adsAllowed) {
    return null;
  }

  return (
    <AdSenseUnitMounted
      unitKey={unitKey}
      slot={slot}
      format={format}
      fullWidthResponsive={fullWidthResponsive}
      className={className}
      minHeightClass={minHeightClass}
      label={label}
      dataPlacement={dataPlacement}
    />
  );
}

/** Só montado com slot real + consent granted */
function AdSenseUnitMounted({
  unitKey,
  slot,
  format,
  fullWidthResponsive,
  className,
  minHeightClass,
  label,
  dataPlacement,
}: {
  unitKey: string;
  slot: string;
  format: NonNullable<AdSenseUnitProps['format']>;
  fullWidthResponsive: boolean;
  className: string;
  minHeightClass: string;
  label: string;
  dataPlacement?: string;
}) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Script ainda carregando ou site em "Preparando"
    }
  }, [unitKey]);

  return (
    <div
      className={`adsense-unit w-full overflow-hidden ${minHeightClass} ${className}`}
      data-adsense-placement={dataPlacement}
      data-adsense-ready="true"
      role="complementary"
      aria-label={label}
    >
      <ins
        key={unitKey}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}
