type AdSlotProps = {
  /** Identificador visual para o layout (sidebar / mobile / etc.) */
  placement: 'sidebar-left' | 'sidebar-right' | 'below-cta';
  className?: string;
};

const labels: Record<AdSlotProps['placement'], string> = {
  'sidebar-left': 'Espaço publicitário',
  'sidebar-right': 'Espaço publicitário',
  'below-cta': 'Espaço publicitário',
};

/**
 * Placeholder para Google AdSense.
 * Substitua o conteúdo interno pelo script/snippet do AdSense quando for monetizar.
 * A classe `adsense-slot` é o gancho estável para injeção futura.
 */
export function AdSlot({ placement, className = '' }: AdSlotProps) {
  const sizeClass =
    placement === 'below-cta'
      ? 'min-h-[90px] w-full max-w-xl mx-auto'
      : 'min-h-[250px] w-full max-w-[160px]';

  return (
    <div
      className={`adsense-slot ${sizeClass} ${className}`}
      data-adsense-placement={placement}
      aria-hidden="true"
    >
      <span className="px-2 text-center leading-snug">{labels[placement]}</span>
    </div>
  );
}
