import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { defaultFaqItems, type FaqItem } from '../data/faq';

type FaqAccordionProps = {
  items?: FaqItem[];
  title?: string;
  subtitle?: string;
  className?: string;
  /** ID âncora para SEO / sticky CTA (default: faq) */
  id?: string;
};

/**
 * FAQ sanfona reutilizável — rodapé de ferramentas e Home.
 * Transições suaves com Tailwind; acessível (aria-expanded / region).
 */
export function FaqAccordion({
  items = defaultFaqItems,
  title = 'Perguntas frequentes',
  subtitle = 'Privacidade, preço e como o processamento local funciona.',
  className = '',
  id = 'faq',
}: FaqAccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  const toggle = (itemId: string) => {
    setOpenId((prev) => (prev === itemId ? null : itemId));
  };

  return (
    <section
      id={id}
      className={`scroll-mt-8 ${className}`}
      aria-labelledby={`${baseId}-heading`}
    >
      <div className="mb-6 max-w-2xl">
        <h2
          id={`${baseId}-heading`}
          className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
        {items.map((item, index) => {
          const isOpen = openId === item.id;
          const panelId = `${baseId}-panel-${item.id}`;
          const buttonId = `${baseId}-btn-${item.id}`;

          return (
            <div key={item.id} className="group">
              <h3 className="m-0">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(item.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 dark:hover:bg-slate-800/60 sm:px-6 sm:py-5"
                >
                  <span className="flex min-w-0 items-start gap-3">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                      aria-hidden
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 sm:text-base dark:text-slate-100">
                      {item.question}
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ease-out ${
                      isOpen ? 'rotate-180 text-brand-600 dark:text-brand-400' : ''
                    }`}
                    aria-hidden
                  />
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pl-[3.25rem] text-sm leading-relaxed text-slate-600 sm:px-6 sm:pb-6 sm:pl-[3.5rem] dark:text-slate-400">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
