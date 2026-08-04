import {
  getLimitItems,
  getLimitsIntro,
  LIMITS_DEFAULT_TITLE,
  type LimitItem,
  type LimitsUiProfile,
} from '../data/fileLimitsCopy';

export type FileLimitsNoticeProps = {
  /**
   * Perfil de limites (espelha validação + overview da hub).
   * @example "merge_pdf" | "compress" | "ocr" | "overview"
   */
  profile: LimitsUiProfile;
  /** Sobrescreve o título padrão */
  title?: string;
  /** Sobrescreve a intro; passe `null` para omitir intro */
  intro?: string | null;
  /** Itens extras (trade-offs da tool, sem números inventados) */
  extraItems?: LimitItem[];
  /** Só extras (não mostra itens base do perfil) */
  replaceItems?: boolean;
  className?: string;
  /** Visual mais compacto (ex.: sob a DropZone) */
  compact?: boolean;
  headingLevel?: 'h2' | 'h3';
  /** id do heading (a11y / âncoras) */
  headingId?: string;
};

/**
 * Bloco reutilizável de limites técnicos honestos.
 * Números vêm de FILE_LIMITS via fileLimitsCopy — sem magic numbers.
 */
export function FileLimitsNotice({
  profile,
  title = LIMITS_DEFAULT_TITLE,
  intro,
  extraItems,
  replaceItems = false,
  className = '',
  compact = false,
  headingLevel = 'h2',
  headingId = 'file-limits-heading',
}: FileLimitsNoticeProps) {
  const baseItems = replaceItems ? [] : getLimitItems(profile);
  const items = [...baseItems, ...(extraItems ?? [])];
  const introText =
    intro === null ? null : (intro ?? getLimitsIntro(profile));

  if (items.length === 0) return null;

  const HeadingTag = headingLevel;

  return (
    <section
      className={`space-y-3 ${className}`}
      aria-labelledby={headingId}
    >
      <HeadingTag
        id={headingId}
        className={
          compact
            ? 'text-base font-bold tracking-tight text-slate-900 dark:text-slate-50'
            : 'text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-50'
        }
      >
        {title}
      </HeadingTag>

      {introText && (
        <p
          className={
            compact
              ? 'max-w-3xl text-xs leading-relaxed text-slate-600 dark:text-slate-400'
              : 'max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400'
          }
        >
          {introText}
        </p>
      )}

      <dl
        className={
          compact
            ? 'grid gap-2 sm:grid-cols-2'
            : 'grid gap-2 sm:grid-cols-2'
        }
      >
        {items.map((lim) => (
          <div
            key={`${lim.label}-${lim.text.slice(0, 24)}`}
            className={
              compact
                ? 'rounded-lg border border-amber-200/80 bg-amber-50/50 px-3 py-2 dark:border-amber-900/40 dark:bg-amber-950/20'
                : 'rounded-xl border border-amber-200/80 bg-amber-50/50 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-950/20'
            }
          >
            <dt
              className={
                compact
                  ? 'text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200'
                  : 'text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200'
              }
            >
              {lim.label}
            </dt>
            <dd
              className={
                compact
                  ? 'mt-0.5 text-xs text-slate-700 dark:text-slate-300'
                  : 'mt-1 text-sm text-slate-700 dark:text-slate-300'
              }
            >
              {lim.text}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
