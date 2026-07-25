import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import HomePage from './pages/HomePage';
import JuntarPdfPage from './pages/JuntarPdfPage';
import DividirPdfPage from './pages/DividirPdfPage';
import GirarPdfPage from './pages/GirarPdfPage';
import MarcaDaguaPage from './pages/MarcaDaguaPage';
import DesenharPdfPage from './pages/DesenharPdfPage';
import WordParaPdfPage from './pages/WordParaPdfPage';
import ImagemParaPdfPage from './pages/ImagemParaPdfPage';
import ExtrairTextoPage from './pages/ExtrairTextoPage';
import ProtegerPdfPage from './pages/ProtegerPdfPage';
import DesbloquearPdfPage from './pages/DesbloquearPdfPage';
import RemoverPaginasPage from './pages/RemoverPaginasPage';
import ComprimirPdfPage from './pages/ComprimirPdfPage';
import PrivacidadePage from './pages/PrivacidadePage';
import TermosPage from './pages/TermosPage';
import SobrePage from './pages/SobrePage';
import ContatoPage from './pages/ContatoPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
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
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
