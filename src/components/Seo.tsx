import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description: string;
};

/**
 * Atualiza title e meta description por rota (SPA).
 * Para SEO avançado em SWA, considere pré-render ou prerender.io no futuro.
 */
export function Seo({ title, description }: SeoProps) {
  useEffect(() => {
    document.title = `${title} | Easy PDF`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);
  }, [title, description]);

  return null;
}
