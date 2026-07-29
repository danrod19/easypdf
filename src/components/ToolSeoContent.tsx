import { Link, useLocation } from 'react-router-dom';
import type { ToolSeoBlock } from '../data/toolSeoContent';
import {
  buildBreadcrumbListSchema,
  buildFaqPageSchema,
  buildHowToSchema,
  buildToolWebApplicationSchema,
} from '../data/schema';
import { JsonLd } from './JsonLd';

type ToolSeoContentProps = {
  content: ToolSeoBlock;
  className?: string;
  /**
   * Path canônico da ferramenta (ex: /juntar-pdf).
   * Default: location.pathname.
   */
  path?: string;
  /** Nome do item no breadcrumb (default: toolName ou howToTitle) */
  breadcrumbLabel?: string;
};

/**
 * Bloco de texto semântico para SEO On-Page (abaixo da UI da ferramenta).
 * Injeta JSON-LD: HowTo + FAQPage + BreadcrumbList + WebApplication (quando toolName).
 */
export function ToolSeoContent({
  content,
  className = '',
  path: pathProp,
  breadcrumbLabel,
}: ToolSeoContentProps) {
  const location = useLocation();
  const path = pathProp ?? location.pathname;
  const routeKey = path.replace(/\//g, '-') || 'home';

  const {
    toolName,
    overview,
    audienceTitle,
    audience,
    useCasesTitle,
    useCases,
    howToTitle,
    howToIntro,
    steps,
    benefitsTitle,
    benefitsIntro,
    benefits,
    limitsTitle,
    limitsIntro,
    limits,
    faqTitle,
    faqs,
    relatedTitle,
    related,
    schemaDescription,
  } = content;

  const crumbName =
    breadcrumbLabel ?? toolName ?? howToTitle.replace(/^Como /i, '');

  const howToSchema = buildHowToSchema({
    name: howToTitle,
    description: howToIntro,
    steps,
    path,
  });

  const faqSchema =
    faqs.length > 0 ? buildFaqPageSchema(faqs) : null;

  const breadcrumbSchema =
    path !== '/'
      ? buildBreadcrumbListSchema([
          { name: 'Início', path: '/' },
          { name: crumbName, path },
        ])
      : null;

  const toolAppSchema =
    toolName != null
      ? buildToolWebApplicationSchema({
          name: `${toolName} | Easy PDF Local`,
          description:
            schemaDescription ??
            howToIntro ??
            `${toolName} 100% no navegador, sem upload.`,
          path,
        })
      : null;

  return (
    <div
      className={`space-y-10 border-t border-slate-200 pt-10 dark:border-slate-800 ${className}`}
    >
      <JsonLd id={`howto${routeKey}`} data={howToSchema} />
      {faqSchema && <JsonLd id={`faq${routeKey}`} data={faqSchema} />}
      {breadcrumbSchema && (
        <JsonLd id={`breadcrumb${routeKey}`} data={breadcrumbSchema} />
      )}
      {toolAppSchema && (
        <JsonLd id={`webapp${routeKey}`} data={toolAppSchema} />
      )}

      {/* Visão geral — profundidade de conteúdo */}
      {overview && overview.length > 0 && (
        <section className="space-y-3" aria-labelledby="seo-overview-heading">
          <h2
            id="seo-overview-heading"
            className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-50"
          >
            {toolName
              ? `O que é ${toolName} no Easy PDF Local`
              : 'Sobre esta ferramenta'}
          </h2>
          {overview.map((para) => (
            <p
              key={para.slice(0, 48)}
              className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400"
            >
              {para}
            </p>
          ))}
        </section>
      )}

      {/* Público */}
      {audience && (
        <section className="space-y-2" aria-labelledby="seo-audience-heading">
          <h2
            id="seo-audience-heading"
            className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-50"
          >
            {audienceTitle ?? 'Para quem é'}
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            {audience}
          </p>
        </section>
      )}

      {/* Casos de uso */}
      {useCases && useCases.length > 0 && (
        <section className="space-y-4" aria-labelledby="seo-usecases-heading">
          <h2
            id="seo-usecases-heading"
            className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-50"
          >
            {useCasesTitle ?? 'Casos de uso práticos'}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {useCases.map((uc) => (
              <li
                key={uc.title}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {uc.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {uc.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Passo a passo — espelha o HowTo schema */}
      <section className="space-y-4" aria-labelledby="seo-howto-heading">
        <h2
          id="seo-howto-heading"
          className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-50"
        >
          {howToTitle}
        </h2>
        {howToIntro && (
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            {howToIntro}
          </p>
        )}
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
          {steps.map((step, index) => (
            <li
              key={step.title}
              id={`passo-${index + 1}`}
              className="scroll-mt-8 pl-1"
            >
              <strong className="font-semibold text-slate-800 dark:text-slate-200">
                {step.title}.
              </strong>{' '}
              {step.description}
            </li>
          ))}
        </ol>
      </section>

      {/* Benefícios / diferencial técnico */}
      <section className="space-y-4" aria-labelledby="seo-benefits-heading">
        <h2
          id="seo-benefits-heading"
          className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-50"
        >
          {benefitsTitle}
        </h2>
        {benefitsIntro && (
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            {benefitsIntro}
          </p>
        )}
        <ul className="grid gap-4 sm:grid-cols-2">
          {benefits.map((b) => (
            <li
              key={b.title}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {b.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {b.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Limites honestos */}
      {(limitsIntro || (limits && limits.length > 0)) && (
        <section className="space-y-3" aria-labelledby="seo-limits-heading">
          <h2
            id="seo-limits-heading"
            className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-50"
          >
            {limitsTitle ?? 'Limites técnicos (honestos)'}
          </h2>
          {limitsIntro && (
            <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
              {limitsIntro}
            </p>
          )}
          {limits && limits.length > 0 && (
            <dl className="grid gap-2 sm:grid-cols-2">
              {limits.map((lim) => (
                <div
                  key={lim.label}
                  className="rounded-xl border border-amber-200/80 bg-amber-50/50 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-950/20"
                >
                  <dt className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                    {lim.label}
                  </dt>
                  <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {lim.text}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      )}

      {/* FAQ em texto (visível para crawlers) */}
      <section className="space-y-4" aria-labelledby="seo-faq-heading">
        <h2
          id="seo-faq-heading"
          className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-50"
        >
          {faqTitle}
        </h2>
        <dl className="space-y-4">
          {faqs.map((item) => (
            <div
              key={item.question}
              className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <dt className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item.question}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Relacionados */}
      {related && related.length > 0 && (
        <section className="space-y-3" aria-labelledby="seo-related-heading">
          <h2
            id="seo-related-heading"
            className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-50"
          >
            {relatedTitle ?? 'Ferramentas e guias relacionados'}
          </h2>
          <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {related.map((r) => (
              <li key={r.path}>
                <Link
                  to={r.path}
                  className="inline-flex flex-col rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition hover:border-brand-300 hover:bg-brand-50/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-700 dark:hover:bg-brand-950/30"
                >
                  <span className="font-semibold text-brand-700 dark:text-brand-300">
                    {r.label}
                  </span>
                  {r.description && (
                    <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {r.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
