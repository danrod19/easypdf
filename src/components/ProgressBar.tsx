type ProgressBarProps = {
  percent: number;
  message?: string;
  visible: boolean;
};

export function ProgressBar({ percent, message, visible }: ProgressBarProps) {
  if (!visible) return null;

  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="w-full space-y-2" role="status" aria-live="polite">
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
        <span>{message ?? 'Processando…'}</span>
        <span className="font-semibold tabular-nums text-brand-600 dark:text-brand-400">
          {clamped}%
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-brand-600 transition-[width] duration-300 ease-out dark:bg-brand-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
