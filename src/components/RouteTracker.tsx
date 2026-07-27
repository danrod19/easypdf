import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageView } from '../utils/analytics';

/**
 * Rastreador de rotas SPA para GA4.
 * Não renderiza UI — montar dentro de `<BrowserRouter>` (ex.: main.tsx).
 *
 * ```tsx
 * <BrowserRouter>
 *   <RouteTracker />
 *   <App />
 * </BrowserRouter>
 * ```
 */
export function RouteTracker() {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    if (lastPath.current === path) return;
    lastPath.current = path;
    logPageView(path);
  }, [location.pathname, location.search]);

  return null;
}
