import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { AnalyticsTracker } from './components/AnalyticsTracker';
import { RouteTracker } from './components/RouteTracker';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

// Service Worker PWA — atualização automática quando há nova versão
registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;
    // Verifica atualizações periodicamente (1h)
    setInterval(() => {
      void registration.update();
    }, 60 * 60 * 1000);
  },
  onRegisterError(error) {
    console.warn('[PWA] falha ao registrar Service Worker', error);
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter é obrigatório para RouteTracker / AnalyticsTracker (useLocation) */}
    <BrowserRouter>
      {/* Consent Mode v2 + CMP AdSense */}
      <AnalyticsTracker />
      {/* GA4 SPA: page_view em cada mudança de rota */}
      <RouteTracker />
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
