import { ADSENSE_SLOTS } from '../data/adsense';
import { AdSenseUnit } from './AdSenseUnit';

type AdBannerProps = {
  /** Posição no layout — define slot + altura (anti-CLS) */
  placement?: 'top' | 'bottom' | 'inline';
  className?: string;
  label?: string;
};

const SLOT_BY_PLACEMENT: Record<
  NonNullable<AdBannerProps['placement']>,
  string
> = {
  top: ADSENSE_SLOTS.top,
  bottom: ADSENSE_SLOTS.bottom,
  inline: ADSENSE_SLOTS.inline,
};

const MIN_H: Record<NonNullable<AdBannerProps['placement']>, string> = {
  top: 'min-h-[90px]',
  bottom: 'min-h-[90px]',
  inline: 'min-h-[100px]',
};

/**
 * Banner AdSense horizontal (topo / rodapé / inline).
 * Unidade real: display responsivo full-width.
 */
export function AdBanner({
  placement = 'inline',
  className = '',
  label = 'Publicidade',
}: AdBannerProps) {
  return (
    <AdSenseUnit
      slot={SLOT_BY_PLACEMENT[placement]}
      format="auto"
      fullWidthResponsive
      minHeightClass={MIN_H[placement]}
      className={`adsense-banner ${className}`}
      label={label}
      data-placement={placement}
    />
  );
}
