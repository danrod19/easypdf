import { useEffect } from 'react';
import { SITE_ORIGIN } from '../data/seo';

export type UseSEOOptions = {
  /** Conteúdo completo do <title> (já otimizado para a rota) */
  title: string;
  /** meta name="description" */
  description: string;
  /**
   * Path canônico relativo, ex: "/juntar-pdf".
   * Gera <link rel="canonical"> e og:url com SITE_ORIGIN.
   */
  path?: string;
  /** Open Graph type (default: website) */
  ogType?: string;
};

function upsertMeta(
  attr: 'name' | 'property',
  key: string,
  content: string
): void {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Hook de SEO dinâmico para SPA (React Router).
 * Atualiza title, meta description, Open Graph e canonical na rota ativa.
 *
 * @example
 * useSEO({
 *   title: 'Juntar PDF Online e Seguro | Sem Upload para a Nuvem',
 *   description: 'Una vários PDFs…',
 *   path: '/juntar-pdf',
 * });
 *
 * // ou via dados centralizados:
 * import { getSeoForPath } from '../data/seo';
 * const meta = getSeoForPath('/juntar-pdf');
 * useSEO(meta);
 */
export function useSEO({
  title,
  description,
  path,
  ogType = 'website',
}: UseSEOOptions): void {
  useEffect(() => {
    if (!title && !description) return;

    if (title) {
      document.title = title;
      upsertMeta('property', 'og:title', title);
      upsertMeta('name', 'twitter:title', title);
    }

    if (description) {
      upsertMeta('name', 'description', description);
      upsertMeta('property', 'og:description', description);
      upsertMeta('name', 'twitter:description', description);
    }

    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:site_name', 'Easy PDF Local');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta(
      'property',
      'og:image',
      `${SITE_ORIGIN}/og-image.png`
    );
    upsertMeta(
      'name',
      'twitter:image',
      `${SITE_ORIGIN}/og-image.png`
    );

    if (path != null) {
      const normalized =
        path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`;
      const url = `${SITE_ORIGIN}${normalized === '/' ? '/' : normalized}`;
      upsertCanonical(url);
      upsertMeta('property', 'og:url', url);
    }
  }, [title, description, path, ogType]);
}
