type ProgressBarProps = {
  percent: number;
  message?: string;
  visible: boolean;
};

export function ProgressBar({ percent, message, visible }: ProgressBarProps) {
  if (!visible) return null;

  const clamped = Math.min(100, Math.max(0, percent));
  const label = message ?? 'Processando…';

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
        <span id="progress-bar-label">{label}</span>
        <span
          className="font-semibold tabular-nums text-brand-600 dark:text-brand-400"
          aria-hidden
        >
          {clamped}%
        </span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped)}
        aria-valuetext={`${Math.round(clamped)} por cento — ${label}`}
        aria-labelledby="progress-bar-label"
      >
        <div
          className="h-full rounded-full bg-brand-600 transition-[width] duration-300 ease-out dark:bg-brand-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
