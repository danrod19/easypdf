import { ADSENSE_SLOTS } from '../data/adsense';
import { AdSenseUnit } from './AdSenseUnit';

type AdSlotProps = {
  /** Identificador de layout → mapeia para data-ad-slot */
  placement: 'sidebar-left' | 'sidebar-right' | 'below-cta';
  className?: string;
};

const CONFIG: Record<
  AdSlotProps['placement'],
  {
    slot: string;
    format: 'auto' | 'rectangle' | 'vertical';
    minHeightClass: string;
    sizeClass: string;
    fullWidth: boolean;
  }
> = {
  'below-cta': {
    slot: ADSENSE_SLOTS.belowCta,
    format: 'auto',
    minHeightClass: 'min-h-[100px]',
    sizeClass: 'w-full max-w-xl mx-auto',
    fullWidth: true,
  },
  'sidebar-left': {
    slot: ADSENSE_SLOTS.sidebarLeft,
    format: 'vertical',
    minHeightClass: 'min-h-[250px]',
    sizeClass: 'w-full max-w-[160px]',
    fullWidth: false,
  },
  'sidebar-right': {
    slot: ADSENSE_SLOTS.sidebarRight,
    format: 'vertical',
    minHeightClass: 'min-h-[250px]',
    sizeClass: 'w-full max-w-[160px]',
    fullWidth: false,
  },
};

/**
 * Slot AdSense contextual (below-cta / sidebars).
 * Below-CTA: prioridade mobile — logo abaixo do botão principal da ferramenta.
 */
export function AdSlot({ placement, className = '' }: AdSlotProps) {
  const cfg = CONFIG[placement];

  return (
    <AdSenseUnit
      slot={cfg.slot}
      format={cfg.format}
      fullWidthResponsive={cfg.fullWidth}
      minHeightClass={cfg.minHeightClass}
      className={`adsense-slot ${cfg.sizeClass} ${className}`}
      label="Publicidade"
      data-placement={placement}
    />
  );
}
