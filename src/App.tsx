import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';

const HomePage = lazy(() => import('./pages/HomePage'));
const JuntarPdfPage = lazy(() => import('./pages/JuntarPdfPage'));
const DividirPdfPage = lazy(() => import('./pages/DividirPdfPage'));
const GirarPdfPage = lazy(() => import('./pages/GirarPdfPage'));
const MarcaDaguaPage = lazy(() => import('./pages/MarcaDaguaPage'));
const DesenharPdfPage = lazy(() => import('./pages/DesenharPdfPage'));
const WordParaPdfPage = lazy(() => import('./pages/WordParaPdfPage'));
const ImagemParaPdfPage = lazy(() => import('./pages/ImagemParaPdfPage'));
const ExtrairTextoPage = lazy(() => import('./pages/ExtrairTextoPage'));
const ProtegerPdfPage = lazy(() => import('./pages/ProtegerPdfPage'));
const DesbloquearPdfPage = lazy(() => import('./pages/DesbloquearPdfPage'));
const RemoverPaginasPage = lazy(() => import('./pages/RemoverPaginasPage'));
const ComprimirPdfPage = lazy(() => import('./pages/ComprimirPdfPage'));
const PrivacidadePage = lazy(() => import('./pages/PrivacidadePage'));
const TermosPage = lazy(() => import('./pages/TermosPage'));
const SobrePage = lazy(() => import('./pages/SobrePage'));
const ContatoPage = lazy(() => import('./pages/ContatoPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const PdfSemUploadPage = lazy(() => import('./pages/PdfSemUploadPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function RouteFallback() {
  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 py-16"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span
        className="h-9 w-9 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400"
        aria-hidden
      />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
        Carregando ferramenta…
      </p>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="juntar-pdf" element={<JuntarPdfPage />} />
            <Route path="dividir-pdf" element={<DividirPdfPage />} />
            <Route path="girar-pdf" element={<GirarPdfPage />} />
            <Route path="marca-dagua" element={<MarcaDaguaPage />} />
            <Route path="desenhar-pdf" element={<DesenharPdfPage />} />
            <Route path="word-para-pdf" element={<WordParaPdfPage />} />
            <Route path="imagem-para-pdf" element={<ImagemParaPdfPage />} />
            <Route path="extrair-texto" element={<ExtrairTextoPage />} />
            <Route path="proteger-pdf" element={<ProtegerPdfPage />} />
            <Route path="desbloquear-pdf" element={<DesbloquearPdfPage />} />
            <Route path="remover-paginas" element={<RemoverPaginasPage />} />
            <Route path="comprimir-pdf" element={<ComprimirPdfPage />} />
            <Route path="privacidade" element={<PrivacidadePage />} />
            <Route path="termos" element={<TermosPage />} />
            <Route path="sobre" element={<SobrePage />} />
            <Route path="contato" element={<ContatoPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogPostPage />} />
            <Route path="pdf-sem-upload" element={<PdfSemUploadPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
