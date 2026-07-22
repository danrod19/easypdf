import { Download, FileUp, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Step = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const DEFAULT_STEPS: Step[] = [
  {
    title: '1. Escolha seus arquivos',
    description: 'Arraste ou selecione PDFs, imagens ou documentos DOCX no seu dispositivo.',
    icon: FileUp,
  },
  {
    title: '2. Edite ou Converta localmente',
    description: 'O processamento roda no navegador — seus arquivos não sobem para nenhum servidor.',
    icon: Sparkles,
  },
  {
    title: '3. Baixe na Hora',
    description: 'Receba o resultado imediatamente no download, sem fila e sem conta.',
    icon: Download,
  },
];

type HowItWorksProps = {
  steps?: Step[];
  className?: string;
};

/**
 * Bloco horizontal minimalista — 3 etapas ilustradas (estilo iLovePDF).
 */
export function HowItWorks({ steps = DEFAULT_STEPS, className = '' }: HowItWorksProps) {
  return (
    <section
      className={`scroll-mt-8 ${className}`}
      aria-labelledby="how-it-works-heading"
      id="como-funciona"
    >
      <div className="mb-8 text-center">
        <h2
          id="how-it-works-heading"
          className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
        >
          Como funciona
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
          Três passos simples. Zero upload. Resultado no seu dispositivo.
        </p>
      </div>

      <ol className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className="relative flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              {i < steps.length - 1 && (
                <span
                  className="pointer-events-none absolute right-0 top-1/2 hidden h-px w-6 translate-x-full bg-gradient-to-r from-slate-300 to-transparent sm:block dark:from-slate-600"
                  aria-hidden
                />
              )}
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/80 dark:text-brand-400">
                <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
