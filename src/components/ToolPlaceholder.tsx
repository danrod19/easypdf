import { Link } from 'react-router-dom';
import { Seo } from './Seo';
import { AdSlot } from './AdSlot';
import type { ToolMeta } from '../data/tools';

type ToolPlaceholderProps = {
  tool: ToolMeta;
};

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
            Em breve
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {tool.title}
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            {tool.description} Esta ferramenta será implementada com
            processamento 100% no navegador — seus arquivos nunca saem do seu
            dispositivo.
          </p>
        </header>

        <div className="card flex min-h-[280px] flex-col items-center justify-center border-dashed text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl dark:bg-slate-800">
            🛠️
          </div>
          <p className="mb-1 text-lg font-semibold">Interface em construção</p>
          <p className="mb-6 max-w-md text-sm text-slate-500 dark:text-slate-400">
            A estrutura de rotas e o layout já estão prontos. Use{' '}
            <Link
              to="/juntar-pdf"
              className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
            >
              Juntar PDF
            </Link>{' '}
            como referência de implementação completa.
          </p>
          <div className="w-full max-w-xl rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-slate-400 dark:border-slate-600 dark:bg-slate-900/50">
            Área de Drag and Drop (placeholder)
          </div>
        </div>

        <button type="button" className="btn-primary w-full sm:w-auto" disabled>
          Processar (em breve)
        </button>

        <div className="lg:hidden">
          <AdSlot placement="below-cta" />
        </div>
      </div>
    </>
  );
}
