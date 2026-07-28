import { Link, useLocation } from 'react-router-dom';
import { FileStack, Home } from 'lucide-react';
import { Seo } from '../components/Seo';

/**
 * 404 estratégico — retém o usuário com CTA para a Home / Juntar PDFs.
 * Rota de fallback: <Route path="*" element={<NotFoundPage />} /> em App.tsx
 * noindex: evita indexar URLs inexistentes; canonical self-ref da URL pedida.
 */
export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <>
      <Seo
        title="Página não encontrada | Easy PDF Local"
        description="A página solicitada não existe no Easy PDF Local. Volte ao início e junte PDFs grátis no navegador, sem upload."
        path={pathname}
        noIndex
      />
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-12 text-center sm:py-16">
        <p className="text-7xl font-bold tracking-tight text-slate-200 dark:text-slate-800">
          404
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
          Página não encontrada
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          O endereço pode estar incorreto, desatualizado ou a ferramenta ainda
          não existe. Não se preocupe — suas ferramentas de PDF gratuitas e 100%
          locais continuam a um clique de distância.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300 dark:hover:bg-red-500 dark:focus-visible:ring-red-800"
          >
            <Home className="h-4 w-4" aria-hidden />
            Voltar para a Home e Juntar PDFs
          </Link>
          <Link
            to="/juntar-pdf"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-red-200 hover:text-red-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-red-800 dark:hover:text-red-300"
          >
            <FileStack className="h-4 w-4" aria-hidden />
            Ir direto para Juntar PDF
          </Link>
        </div>
      </div>
    </>
  );
}
