import { Link } from 'react-router-dom';
import {
  Combine,
  FileType2,
  FileArchive,
  Images,
  Lock,
  PenTool,
  RotateCw,
  ScanText,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stamp,
  Trash2,
  Unlock,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Seo } from '../components/Seo';
import { HowItWorks } from '../components/HowItWorks';
import { FaqAccordion } from '../components/FaqAccordion';
import { ToolSeoContent } from '../components/ToolSeoContent';
import { getSeoForPath } from '../data/seo';
import { homeSeoContent } from '../data/toolSeoContent';
import { tools, toolAccentStyles } from '../data/tools';

const iconComponents: Record<string, LucideIcon> = {
  merge: Combine,
  split: Scissors,
  rotate: RotateCw,
  watermark: Stamp,
  draw: PenTool,
  word: FileType2,
  image: Images,
  ocr: ScanText,
  lock: Lock,
  unlock: Unlock,
  trash: Trash2,
  compress: FileArchive,
};

export default function HomePage() {
  const seo = getSeoForPath('/');

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <div className="space-y-16 pb-8 sm:space-y-20">
        {/* Hero + Grid de ferramentas */}
        <section className="space-y-10" aria-labelledby="home-hero">
          <div className="mx-auto max-w-3xl space-y-5 text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:border-brand-800 dark:bg-brand-950/60 dark:text-brand-300">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              100% no navegador · Zero upload
            </p>

            <h1
              id="home-hero"
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-slate-50"
            >
              Ferramentas de PDF 100% seguras e sem upload
            </h1>

            <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-400">
              Junte, divida, gire e converta PDFs grátis no navegador.
              Processamento local no seu dispositivo — sem conta, sem fila e
              sem enviar arquivos para a nuvem.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="#ferramentas" className="btn-primary">
                <Zap className="h-4 w-4" aria-hidden />
                Ver ferramentas
              </a>
              <a href="#como-funciona" className="btn-secondary">
                Como funciona
              </a>
            </div>
          </div>

          {/* Grid de cards táteis */}
          <div id="ferramentas" className="scroll-mt-8">
            <div className="mb-5 flex items-end justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Todas as ferramentas
              </h2>
              <p className="hidden text-sm text-slate-500 sm:block dark:text-slate-400">
                {tools.length} ferramentas gratuitas
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => {
                const Icon = iconComponents[tool.icon] ?? Combine;
                const accent = toolAccentStyles[tool.accent];
                const isSoon = tool.status === 'soon';

                const cardClass = `card group relative flex h-full flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${accent.ring} ${
                  isSoon ? 'opacity-80' : ''
                }`;

                const body = (
                  <>
                    <div
                      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${accent.iconBg} ${accent.iconText} transition-transform duration-200 group-hover:scale-105`}
                    >
                      <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                    </div>

                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700 dark:text-slate-50 dark:group-hover:text-brand-300">
                        {tool.title}
                      </h3>
                      {isSoon && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          Em breve
                        </span>
                      )}
                    </div>

                    <p className="flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {tool.description}
                    </p>

                    <span
                      className={`mt-4 inline-flex text-sm font-semibold ${accent.iconText}`}
                    >
                      {isSoon ? 'Em desenvolvimento' : 'Usar agora →'}
                    </span>
                  </>
                );

                if (isSoon) {
                  return (
                    <div key={tool.path} className={cardClass} aria-disabled>
                      {body}
                    </div>
                  );
                }

                return (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className={cardClass}
                  >
                    {body}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <HowItWorks />

        {/* Diferenciais comerciais */}
        <section
          className="grid gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 sm:grid-cols-3 sm:p-8 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
          aria-label="Diferenciais"
        >
          {[
            {
              icon: ShieldCheck,
              t: 'Privacidade total',
              d: 'Arquivos processados só no seu navegador. Nada sobe para a nuvem.',
            },
            {
              icon: Zap,
              t: 'Resultado na hora',
              d: 'Sem filas de servidor. A conversão roda no seu dispositivo.',
            },
            {
              icon: Sparkles,
              t: 'Grátis e sem conta',
              d: 'Use as 5 ferramentas principais sem cadastro e sem cartão.',
            },
          ].map((item) => (
            <div key={item.t} className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                <item.icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                  {item.t}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {item.d}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Conteúdo semântico para Googlebot (H2/H3/P) */}
        <ToolSeoContent content={homeSeoContent} />

        {/* FAQ interativo */}
        <FaqAccordion />
      </div>
    </>
  );
}
