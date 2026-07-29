import type { ReactNode } from 'react';
import { formatBytes } from '../../lib/format';

export type PdfItem = {
  id: string;
  file: File;
};

type FileListProps = {
  items: PdfItem[];
  disabled?: boolean;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onClear: () => void;
};

export function FileList({
  items,
  disabled,
  onRemove,
  onMove,
  onClear,
}: FileListProps) {
  if (items.length === 0) return null;

  return (
    <div className="card space-y-3 !p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Arquivos na fila ({items.length})
        </h2>
        <button
          type="button"
          className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
          onClick={onClear}
          disabled={disabled}
        >
          Limpar tudo
        </button>
      </div>

      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" title={item.file.name}>
                {item.file.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatBytes(item.file.size)}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <IconBtn
                label="Mover para cima"
                disabled={disabled || index === 0}
                onClick={() => onMove(item.id, 'up')}
              >
                ↑
              </IconBtn>
              <IconBtn
                label="Mover para baixo"
                disabled={disabled || index === items.length - 1}
                onClick={() => onMove(item.id, 'down')}
              >
                ↓
              </IconBtn>
              <IconBtn
                label="Remover"
                disabled={disabled}
                onClick={() => onRemove(item.id)}
                danger
              >
                ×
              </IconBtn>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
  danger,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-30
        ${
          danger
            ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
        }`}
    >
      <span aria-hidden>{children}</span>
    </button>
  );
}
