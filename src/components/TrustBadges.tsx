import { ShieldCheck, Cpu, Gift } from 'lucide-react';

type TrustBadgesProps = {
  className?: string;
  /** Centraliza os badges (ex.: hero / layout) */
  centered?: boolean;
};

const badges = [
  {
    label: 'Privacidade Absoluta',
    description: 'Seus arquivos nunca saem da sua máquina',
    Icon: ShieldCheck,
  },
  {
    label: 'Processamento Local',
    description: 'Tudo roda no seu próprio navegador. Sem nuvem, sem lentidão',
    Icon: Cpu,
  },
  {
    label: '100% Grátis e Sem Limites',
    description: 'Sem limites diários, de páginas ou tamanho de arquivo',
    Icon: Gift,
  },
] as const;

/**
 * Badges de confiança — ataque à nuvem: 100% client-side, grátis e sem limites.
 */
export function TrustBadges({
  className = '',
  centered = false,
}: TrustBadgesProps) {
  return (
    <ul
      className={[
        'grid w-full gap-2 sm:grid-cols-3 sm:gap-3',
        centered ? 'mx-auto max-w-4xl' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Diferenciais do Easy PDF Local — processamento local e privacidade"
    >
      {badges.map(({ label, description, Icon }) => (
        <li key={label}>
          <div className="flex h-full items-start gap-2.5 rounded-xl border border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/60 px-3 py-2.5 shadow-sm dark:border-emerald-900/40 dark:from-slate-900 dark:to-emerald-950/30 sm:px-3.5 sm:py-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 text-left">
              <p className="text-xs font-bold leading-snug text-slate-900 sm:text-sm dark:text-slate-50">
                {label}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-600 sm:text-xs dark:text-slate-400">
                {description}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
