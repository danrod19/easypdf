type AdBannerProps = {
  /** Posição no layout — define altura fixa (anti-CLS) */
  placement?: 'top' | 'bottom' | 'inline';
  className?: string;
  label?: string;
};

const HEIGHT: Record<NonNullable<AdBannerProps['placement']>, string> = {
  top: 'h-[90px]',
  bottom: 'h-[90px]',
  inline: 'h-[100px]',
};

/**
 * Placeholder estável para Google AdSense.
 * Altura fixa evita Cumulative Layout Shift (CLS) quando o script carregar.
 * Substitua o interior pelo snippet do AdSense sem alterar a caixa externa.
 */
export function AdBanner({
  placement = 'inline',
  className = '',
  label = 'Publicidade',
}: AdBannerProps) {
  return (
    <div
      className={`adsense-banner flex w-full shrink-0 items-center justify-center overflow-hidden border border-dashed border-slate-200 bg-gray-100 text-xs text-slate-400 dark:border-slate-700 dark:bg-gray-800 dark:text-slate-500 ${HEIGHT[placement]} ${className}`}
      data-adsense-banner={placement}
      role="complementary"
      aria-label={label}
    >
      {/*
        Gancho para o snippet AdSense:
        <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-…" …></ins>
      */}
      <span className="select-none tracking-wide">{label}</span>
    </div>
  );
}
