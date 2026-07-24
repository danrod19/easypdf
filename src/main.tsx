import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AnalyticsTracker } from './components/AnalyticsTracker';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter é obrigatório para o AnalyticsTracker (useLocation) */}
    <BrowserRouter>
      {/* GA4 SPA: initialize + pageview em cada mudança de rota */}
      <AnalyticsTracker />
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
