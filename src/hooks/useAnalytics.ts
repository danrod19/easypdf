import { useEffect } from 'react';

/**
 * @deprecated Preferir o componente `<AnalyticsTracker />` em main.tsx.
 * Ele já implementa Google Consent Mode v2 + escuta da CMP do AdSense.
 *
 * Este hook permanece só como atalho de documentação; não duplica o tracker.
 */
export function useAnalytics(): void {
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.info(
        '[Analytics] useAnalytics() é no-op. Use <AnalyticsTracker /> (Consent Mode v2).'
      );
    }
  }, []);
}
