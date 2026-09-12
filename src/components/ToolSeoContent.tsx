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
  path?: string;
  breadcrumbLabel?: string;
};

/**
 * Texto semântico abaixo da UI.
 * Só renderiza seções presentes no bloco — tools não compartilham o mesmo esqueleto.
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
    overviewTitle,
    overview,
    howToTitle,
    howToIntro,
    steps,
    limitsTitle,
    limitsIntro,
    limits,
    faqTitle,
    faqs,
    relatedTitle,
    related,
    schemaDescription,
    lead = 'howto',
  } = content;

  const crumbName =
    breadcrumbLabel ??
    toolName ??
    howToTitle?.replace(/^Como /i, '') ??
    'Ferramenta';

  const hasHowTo = Boolean(howToTitle && steps && steps.length > 0);
  const hasLimits = Boolean(limitsIntro || (limits && limits.length > 0));
  const hasFaq = Boolean(faqTitle && faqs && faqs.length > 0);
  const hasOverview = Boolean(overview && overview.length > 0);
  const hasRelated = Boolean(related && related.length > 0);

  const howToSchema =
    hasHowTo && howToTitle && steps
      ? buildHowToSchema({
          name: howToTitle,
          description: howToIntro,
          steps,
          path,
        })
      : null;

  const faqSchema = hasFaq && faqs ? buildFaqPageSchema(faqs) : null;

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
            `${toolName} no navegador, no seu dispositivo.`,
          path,
        })
      : null;

  const overviewEl = hasOverview ? (
    <section className="space-y-3" aria-labelledby="seo-overview-heading">
      <h2
        id="seo-overview-heading"
        className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-50"
      >
        {overviewTitle ?? (toolName ? `${toolName}: o que esta tela faz` : 'Sobre')}
      </h2>
      {overview!.map((para) => (
        <p
          key={para.slice(0, 48)}
          className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400"
        >
          {para}
        </p>
      ))}
    </section>
  ) : null;

  const howToEl = hasHowTo ? (
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
        {steps!.map((step, index) => (
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
  ) : null;

  const limitsEl = hasLimits ? (
    <section className="space-y-3" aria-labelledby="seo-limits-heading">
      <h2
        id="seo-limits-heading"
        className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-50"
      >
        {limitsTitle ?? 'Limites desta operação'}
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
  ) : null;

  const faqEl = hasFaq ? (
    <section className="space-y-4" aria-labelledby="seo-faq-heading">
      <h2
        id="seo-faq-heading"
        className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-50"
      >
        {faqTitle}
      </h2>
      <dl className="space-y-4">
        {faqs!.map((item) => (
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
  ) : null;

  const relatedEl = hasRelated ? (
    <section className="space-y-3" aria-labelledby="seo-related-heading">
      <h2
        id="seo-related-heading"
        className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-50"
      >
        {relatedTitle ?? 'Em seguida'}
      </h2>
      <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {related!.slice(0, 2).map((r) => (
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
  ) : null;

  const body =
    lead === 'limits'
      ? [limitsEl, howToEl, overviewEl, faqEl, relatedEl]
      : lead === 'overview'
        ? [overviewEl, howToEl, limitsEl, faqEl, relatedEl]
        : [howToEl, limitsEl, overviewEl, faqEl, relatedEl];

  return (
    <div
      className={`space-y-10 border-t border-slate-200 pt-10 dark:border-slate-800 ${className}`}
    >
      {howToSchema && <JsonLd id={`howto${routeKey}`} data={howToSchema} />}
      {faqSchema && <JsonLd id={`faq${routeKey}`} data={faqSchema} />}
      {breadcrumbSchema && (
        <JsonLd id={`breadcrumb${routeKey}`} data={breadcrumbSchema} />
      )}
      {toolAppSchema && (
        <JsonLd id={`webapp${routeKey}`} data={toolAppSchema} />
      )}
      {body}
    </div>
  );
}
