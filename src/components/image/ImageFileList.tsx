import { useEffect, useState, type ReactNode } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Images,
} from 'lucide-react';
import { formatBytes } from '../../lib/format';

export type ImageItem = {
  id: string;
  file: File;
};

type ImageFileListProps = {
  items: ImageItem[];
  disabled?: boolean;
  onRemove: (id: string) => void;
  /** 'up' = página anterior (sobe na lista), 'down' = próxima página */
  onMove: (id: string, direction: 'up' | 'down') => void;
  onClear: () => void;
};

/**
 * Grid de miniaturas com Subir / Descer / Excluir.
 * Ordem da esquerda → direita (e cima → baixo) = páginas do PDF.
 */
export function ImageFileList({
  items,
  disabled,
  onRemove,
  onMove,
  onClear,
}: ImageFileListProps) {
  if (items.length === 0) return null;

  return (
    <div className="card space-y-4 !p-4 sm:!p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Images
            className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
            aria-hidden
          />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Imagens na fila ({items.length})
          </h2>
        </div>
        <button
          type="button"
          className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
          onClick={onClear}
          disabled={disabled}
        >
          Limpar tudo
        </button>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        A ordem define as páginas do PDF. Use <strong>Subir</strong> /{' '}
        <strong>Descer</strong> para reordenar e o ícone de lixeira para
        excluir.
      </p>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-emerald-800"
          >
            <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-900">
              <Thumbnail file={item.file} />
              <span className="absolute left-2 top-2 flex h-6 min-w-[1.5rem] items-center justify-center rounded-md bg-slate-900/75 px-1.5 text-[11px] font-bold text-white backdrop-blur-sm">
                {index + 1}
              </span>
            </div>

            <div className="space-y-2 p-2.5">
              <div className="min-w-0">
                <p
                  className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100"
                  title={item.file.name}
                >
                  {item.file.name}
                </p>
                <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                  {formatBytes(item.file.size)}
                  {item.file.type ? ` · ${shortMime(item.file.type)}` : ''}
                </p>
              </div>

              <div className="flex items-center justify-between gap-1">
                <div className="flex gap-0.5">
                  <IconBtn
                    label="Subir"
                    disabled={disabled || index === 0}
                    onClick={() => onMove(item.id, 'up')}
                  >
                    <ChevronUp className="h-4 w-4" aria-hidden />
                  </IconBtn>
                  <IconBtn
                    label="Descer"
                    disabled={disabled || index === items.length - 1}
                    onClick={() => onMove(item.id, 'down')}
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden />
                  </IconBtn>
                </div>
                <IconBtn
                  label="Excluir"
                  disabled={disabled}
                  onClick={() => onRemove(item.id)}
                  danger
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </IconBtn>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function shortMime(type: string): string {
  if (type === 'image/jpeg' || type === 'image/jpg') return 'JPEG';
  if (type === 'image/png') return 'PNG';
  if (type === 'image/webp') return 'WebP';
  return type.replace('image/', '').toUpperCase();
}

function Thumbnail({ file }: { file: File }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return src ? (
    <img
      src={src}
      alt=""
      className="h-full w-full object-cover"
      loading="lazy"
      draggable={false}
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
      …
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
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-30
        ${
          danger
            ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
        }`}
    >
      {children}
    </button>
  );
}
