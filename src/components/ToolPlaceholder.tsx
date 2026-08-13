import { Link } from 'react-router-dom';
import { Seo } from './Seo';
import type { ToolMeta } from '../data/tools';

type ToolPlaceholderProps = {
  tool: ToolMeta;
};

/**
 * Fallback para tool ainda não implementada (status soon).
 * Não monta anúncios nem UI vazia de “Publicidade”.
 * Hoje todas as tools em tools.ts estão ready — mantido só por segurança.
 */
export function ToolPlaceholder({ tool }: ToolPlaceholderProps) {
  return (
    <>
      <Seo
        title={tool.title}
        description={tool.description}
        path={tool.path}
      />
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Ferramenta em preparação
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {tool.title}
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            {tool.description} Quando estiver pronta, o processamento será 100%
            no navegador — sem upload do arquivo para a nossa nuvem.
          </p>
        </header>

        <div className="card flex min-h-[200px] flex-col items-center justify-center text-center">
          <p className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
            Ainda não disponível
          </p>
          <p className="mb-6 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Enquanto isso, use as ferramentas prontas — por exemplo{' '}
            <Link
              to="/juntar-pdf"
              className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
            >
              Juntar PDF
            </Link>
            ,{' '}
            <Link
              to="/comprimir-pdf"
              className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
            >
              Comprimir PDF
            </Link>{' '}
            ou o guia{' '}
            <Link
              to="/pdf-sem-upload"
              className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
            >
              PDF sem upload
            </Link>
            .
          </p>
          <Link to="/" className="btn-primary w-full sm:w-auto">
            Ver ferramentas disponíveis
          </Link>
        </div>
      </div>
    </>
  );
}
