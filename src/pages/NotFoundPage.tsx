import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Página não encontrada" description="A página solicitada não existe." />
      <div className="card mx-auto max-w-lg text-center">
        <p className="text-6xl font-bold text-slate-300 dark:text-slate-700">404</p>
        <h1 className="mt-2 text-xl font-semibold">Página não encontrada</h1>
        <p className="mt-2 text-sm text-slate-500">
          O endereço pode estar incorreto ou a ferramenta ainda não existe.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Voltar ao início
        </Link>
      </div>
    </>
  );
}
