import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from 'react';

type DropZoneProps = {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  /**
   * Filtro de arquivos após a seleção.
   * Default: apenas PDFs (compatível com /juntar-pdf e /dividir-pdf).
   */
  acceptFile?: (file: File) => boolean;
  /** Chamado quando nenhum arquivo válido foi selecionado. */
  onReject?: (message: string) => void;
  /** Âncora para Sticky CTA / deep-link (default: tool-dropzone) */
  id?: string;
  labels?: {
    idle?: string;
    dragging?: string;
    hint?: string;
    ariaLabel?: string;
    rejectMessage?: string;
  };
};

function defaultIsPdf(file: File): boolean {
  return (
    file.type === 'application/pdf' ||
    file.name.toLowerCase().endsWith('.pdf')
  );
}

/**
 * Área generosa de drag-and-drop + clique para selecionar arquivos.
 */
export function DropZone({
  onFiles,
  disabled = false,
  accept = 'application/pdf,.pdf',
  multiple = true,
  acceptFile = defaultIsPdf,
  onReject,
  id = 'tool-dropzone',
  labels,
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const idle =
    labels?.idle ?? 'Arraste e solte seus PDFs';
  const dragging =
    labels?.dragging ?? 'Solte os PDFs aqui';
  const hint =
    labels?.hint ??
    'ou clique para escolher arquivos · apenas PDF · processamento local';
  const ariaLabel =
    labels?.ariaLabel ?? 'Selecionar arquivos PDF';
  const rejectMessage =
    labels?.rejectMessage ??
    'Nenhum arquivo válido foi selecionado.';

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const all = Array.from(fileList);
      const accepted = all.filter(acceptFile);
      if (accepted.length === 0) {
        onReject?.(rejectMessage);
        return;
      }
      onFiles(accepted);
    },
    [acceptFile, onFiles, onReject, rejectMessage]
  );

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // permite selecionar o mesmo arquivo de novo
    e.target.value = '';
  };

  return (
    <div
      id={id}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      aria-describedby={`${id}-hint`}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative flex min-h-[220px] scroll-mt-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 dark:focus-visible:ring-brand-800
        ${
          disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60 dark:border-slate-700 dark:bg-slate-900'
            : isDragging
              ? 'border-brand-500 bg-brand-50 shadow-dropzone dark:border-brand-400 dark:bg-brand-950/40'
              : 'border-slate-300 bg-slate-50 hover:border-brand-400 hover:bg-brand-50/50 dark:border-slate-600 dark:bg-slate-900/40 dark:hover:border-brand-500 dark:hover:bg-brand-950/30'
        }`}
    >
      {/* Input real: fora da ordem de tab (o role=button é o controle de teclado) */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        disabled={disabled}
        onChange={onChange}
        tabIndex={-1}
        aria-hidden
      />

      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
          isDragging
            ? 'bg-brand-600 text-white'
            : 'bg-white text-brand-600 shadow-sm dark:bg-slate-800 dark:text-brand-400'
        }`}
        aria-hidden
      >
        <UploadIcon className="h-7 w-7" />
      </div>

      <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        {isDragging ? dragging : idle}
      </p>
      <p
        id={`${id}-hint`}
        className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400"
      >
        {hint}
      </p>
    </div>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
