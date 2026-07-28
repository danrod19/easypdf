import { useSEO, type UseSEOOptions } from '../hooks/useSEO';

export type SeoProps = UseSEOOptions;

/**
 * SEO On-Page + canonical self-referencing.
 *
 * @example
 * <Seo title="..." description="..." path="/word-para-pdf" />
 * // path omitido → usa a rota atual (useLocation)
 */
export function Seo({
  title,
  description,
  path,
  ogType,
  noIndex,
}: SeoProps) {
  useSEO({ title, description, path, ogType, noIndex });
  return null;
}
