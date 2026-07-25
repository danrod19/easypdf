import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

/** Evento não tipado no DOM lib padrão — Chrome / Edge / Android. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

type InstallPwaButtonProps = {
  /** Classes extras no botão (ex.: largura total no Sidebar). */
  className?: string;
  /** Fecha drawer mobile após interação, se fornecido. */
  onNavigate?: () => void;
};

/**
 * Botão de instalação PWA.
 * Só aparece quando o navegador dispara `beforeinstallprompt`
 * (critérios de instalabilidade atendidos: HTTPS, manifest, SW, engajamento).
 */
export function InstallPwaButton({
  className = '',
  onNavigate,
}: InstallPwaButtonProps) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Já em modo standalone / app instalado
    const media = window.matchMedia('(display-mode: standalone)');
    const isStandalone =
      media.matches ||
      // iOS Safari
      ('standalone' in navigator &&
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone));

    if (isStandalone) {
      setInstalled(true);
      return;
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setDeferredPrompt(null);
      setInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed || !deferredPrompt) {
    return null;
  }

  const handleInstall = async () => {
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
      }
    } catch (err) {
      console.warn('[PWA] install prompt failed', err);
    } finally {
      setDeferredPrompt(null);
      onNavigate?.();
    }
  };

  return (
    <button
      type="button"
      onClick={handleInstall}
      className={[
        'flex w-full items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-800 transition',
        'hover:bg-brand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
        'dark:border-brand-900/50 dark:bg-brand-950/40 dark:text-brand-100 dark:hover:bg-brand-950/70',
        className,
      ].join(' ')}
      aria-label="Instalar Easy PDF como aplicativo"
    >
      <Download className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden />
      <span className="flex-1 text-left">Instalar App</span>
    </button>
  );
}
