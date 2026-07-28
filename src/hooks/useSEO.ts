import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  SITE_ORIGIN,
  buildCanonicalUrl,
  normalizeSeoPath,
} from '../data/seo';

export type UseSEOOptions = {
  /** Conteúdo completo do <title> (já otimizado para a rota) */
  title: string;
  /** meta name="description" */
  description: string;
  /**
   * Path canônico relativo, ex: "/juntar-pdf".
   * Se omitido, usa location.pathname (self-referencing da rota atual).
   * Query string e hash são ignorados na URL canônica.
   */
  path?: string;
  /** Open Graph type (default: website) */
  ogType?: string;
  /** Se true, adiciona robots noindex,nofollow (ex.: 404) */
  noIndex?: boolean;
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

function upsertRobots(content: string | null): void {
  const existing = document.head.querySelector<HTMLMetaElement>(
    'meta[name="robots"]'
  );
  if (content == null) {
    existing?.remove();
    return;
  }
  let el = existing;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', 'robots');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Hook de SEO dinâmico para SPA (React Router).
 * Atualiza title, meta description, Open Graph e **sempre** a tag
 * <link rel="canonical"> self-referencing absoluta (SITE_ORIGIN).
 */
export function useSEO({
  title,
  description,
  path,
  ogType = 'website',
  noIndex = false,
}: UseSEOOptions): void {
  const location = useLocation();
  // path explícito ou rota atual (sem query) → self-referencing
  const effectivePath = normalizeSeoPath(path ?? location.pathname);

  useEffect(() => {
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
    upsertMeta('property', 'og:image', `${SITE_ORIGIN}/og-image.png`);
    upsertMeta('name', 'twitter:image', `${SITE_ORIGIN}/og-image.png`);

    // Canonical self-referencing (sempre)
    const canonicalUrl = buildCanonicalUrl(effectivePath);
    upsertCanonical(canonicalUrl);
    upsertMeta('property', 'og:url', canonicalUrl);

    upsertRobots(noIndex ? 'noindex, nofollow' : null);
  }, [title, description, effectivePath, ogType, noIndex]);
}
