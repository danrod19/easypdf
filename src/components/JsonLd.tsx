import { useEffect, useMemo } from 'react';

type JsonLdProps = {
  /** ID único do script no <head> (ex.: software-app, howto-juntar) */
  id: string;
  /** Objeto ou array JSON-LD (Schema.org) */
  data: object | object[];
};

/**
 * Injeta <script type="application/ld+json"> no document.head.
 * Remove o script no unmount (SPA / troca de rota).
 */
export function JsonLd({ id, data }: JsonLdProps) {
  const serialized = useMemo(() => JSON.stringify(data), [data]);

  useEffect(() => {
    const scriptId = `json-ld-${id}`;

    let el = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = scriptId;
      document.head.appendChild(el);
    }
    el.textContent = serialized;

    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [id, serialized]);

  return null;
}
