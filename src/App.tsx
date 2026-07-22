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
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
