import { useMemo } from 'react';

type JsonLdProps = {
  /** ID único do script (ex.: software-app, howto-juntar) */
  id: string;
  /** Objeto ou array JSON-LD (Schema.org) */
  data: object | object[];
};

/**
 * Emite <script type="application/ld+json"> no HTML do React.
 *
 * Importante para SEO + prerender: o script entra no DOM na primeira
 * renderização (sem depender só de useEffect no <head>), então o HTML
 * estático capturado pelo Playwright já contém o schema.
 */
export function JsonLd({ id, data }: JsonLdProps) {
  const serialized = useMemo(() => JSON.stringify(data), [data]);

  return (
    <script
      id={`json-ld-${id}`}
      type="application/ld+json"
      // Conteúdo controlado por nós (schema builders) — não é input de usuário
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}
