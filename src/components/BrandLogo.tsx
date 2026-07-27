import { Link } from 'react-router-dom';

type BrandLogoProps = {
  /** Destino do clique (default: Home). */
  to?: string;
  onClick?: () => void;
  /** compact = header mobile; default = sidebar */
  size?: 'compact' | 'default';
  /** Esconde o subtítulo (útil no header estreito). */
  hideTagline?: boolean;
  className?: string;
};

/**
 * Logotipo: símbolo (imagem) + marca (texto CSS).
 * O texto adapta-se ao dark mode; o ícone PNG permanece transparente.
 */
export function BrandLogo({
  to = '/',
  onClick,
  size = 'default',
  hideTagline = false,
  className = '',
}: BrandLogoProps) {
  const iconBox =
    size === 'compact' ? 'h-9 w-9' : 'h-10 w-10';
  const titleClass =
    size === 'compact'
      ? 'text-base font-extrabold leading-tight tracking-tight'
      : 'text-lg font-extrabold leading-tight tracking-tight sm:text-xl';

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group flex min-w-0 items-center gap-2.5 sm:gap-3 ${className}`}
    >
      <div
        className={`${iconBox} flex-shrink-0 transition-transform group-hover:scale-105`}
      >
        <img
          src="/logo-icon.png"
          alt="Easy PDF Local"
          className="h-full w-full object-contain"
          width={size === 'compact' ? 36 : 40}
          height={size === 'compact' ? 36 : 40}
          decoding="async"
        />
      </div>

      <div className="flex min-w-0 flex-col">
        <span
          className={`${titleClass} truncate text-gray-900 dark:text-white`}
        >
          EASY PDF LOCAL
        </span>
        {!hideTagline && (
          <span className="truncate text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
            100% Seguro e Offline
          </span>
        )}
      </div>
    </Link>
  );
}
