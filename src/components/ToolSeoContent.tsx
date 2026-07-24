import type { ToolSeoBlock } from '../data/toolSeoContent';

type ToolSeoContentProps = {
  content: ToolSeoBlock;
  className?: string;
};

/**
 * Bloco de texto semântico para SEO On-Page (abaixo da UI da ferramenta).
 * Usa H2 (passo a passo), H3 (benefícios e FAQ) e parágrafos legíveis pelo Googlebot.
 */
export function ToolSeoContent({
  content,
  className = '',
}: ToolSeoContentProps) {
  const {
    howToTitle,
    howToIntro,
    steps,
    benefitsTitle,
    benefitsIntro,
    benefits,
    faqTitle,
    faqs,
  } = content;

  return (
    <div
      className={`space-y-10 border-t border-slate-200 pt-10 dark:border-slate-800 ${className}`}
    >
      {/* Passo a passo */}
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
          {steps.map((step) => (
            <li key={step.title} className="pl-1">
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
        <h3
          id="seo-benefits-heading"
          className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-50"
        >
          {benefitsTitle}
        </h3>
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
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {b.title}
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {b.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ em texto (visível para crawlers sem depender só de JS accordion) */}
      <section className="space-y-4" aria-labelledby="seo-faq-heading">
        <h3
          id="seo-faq-heading"
          className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-50"
        >
          {faqTitle}
        </h3>
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
    </div>
  );
}
