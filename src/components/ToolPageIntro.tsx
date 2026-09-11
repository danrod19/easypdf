import { toolAboveFoldByPath } from '../data/toolAboveFold';

type ToolPageIntroProps = {
  /** Path canônico da ferramenta, ex.: /juntar-pdf */
  path: string;
};

const DEFAULT_EYEBROW =
  'text-sm font-medium text-brand-600 dark:text-brand-400';

/**
 * H1 + 2–4 frases antes do DropZone (o que faz / quando não usar / limite).
 * Eyebrow “Sem upload” fica só no selo — o corpo não repete o mesmo parágrafo de privacidade.
 */
export function ToolPageIntro({ path }: ToolPageIntroProps) {
  const block = toolAboveFoldByPath[path];
  if (!block) return null;

  return (
    <header className="space-y-2">
      <p className={block.eyebrowClassName ?? DEFAULT_EYEBROW}>
        Ferramenta gratuita · Sem upload
      </p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {block.title}
      </h1>
      <div className="max-w-2xl space-y-2 text-slate-600 dark:text-slate-400">
        {block.paragraphs.map((para) => (
          <p key={para.slice(0, 48)} className="text-sm leading-relaxed sm:text-base">
            {para}
          </p>
        ))}
      </div>
    </header>
  );
}
