export function PrivacyBanner() {
  return (
    <div
      role="status"
      className="z-30 shrink-0 border-b border-emerald-700/30 bg-emerald-600 text-white shadow-sm dark:border-emerald-500/20 dark:bg-emerald-700"
    >
      <div className="flex items-center justify-center gap-2 px-4 py-2 text-center text-sm font-medium sm:text-[15px]">
        <LockIcon className="hidden h-4 w-4 shrink-0 sm:block" />
        <span>
          Processamento 100% local. Seus arquivos não são enviados para nenhum
          servidor.
        </span>
      </div>
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
