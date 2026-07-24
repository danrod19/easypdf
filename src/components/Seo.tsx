import { useSEO, type UseSEOOptions } from '../hooks/useSEO';

export type SeoProps = UseSEOOptions;

/**
 * Componente fino sobre o hook useSEO.
 * Preferível em JSX: <Seo title="..." description="..." path="/juntar-pdf" />
 * Em lógica/hooks customizados, use useSEO() diretamente.
 */
export function Seo({ title, description, path, ogType }: SeoProps) {
  useSEO({ title, description, path, ogType });
  return null;
}
