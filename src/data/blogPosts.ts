/**
 * Metadados do blog (listagem / SEO).
 * O corpo de cada post fica em src/data/posts/{slug}.md
 */

export type BlogPostMeta = {
  /** Identificador estável (igual ao slug na prática) */
  id: string;
  /** URL: /blog/{slug} */
  slug: string;
  /** Título editorial (listagem / H1 do MD) */
  title: string;
  /** Resumo na listagem do blog */
  excerpt: string;
  /**
   * Title tag SEO (~60 chars). Se omitido, usa `title` + sufixo no BlogPostPage.
   */
  seoTitle?: string;
  /**
   * Meta description SEO (~155 chars). Se omitido, usa `excerpt`.
   */
  seoDescription?: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  /** Ex.: "6 min" */
  readTime: string;
  /** Tags opcionais para UI */
  tags?: string[];
};

export const blogPosts: BlogPostMeta[] = [
  {
    id: 'juntar-pdf-online-sem-upload',
    slug: 'juntar-pdf-online-sem-upload',
    title:
      'Juntar PDF online sem enviar o arquivo: unir vários PDFs no navegador',
    excerpt:
      'Como juntar vários PDFs sem upload e sem cadastro. Privacidade no navegador, passo a passo e limites honestos de tamanho.',
    seoTitle: 'Juntar PDF online sem upload | Easy PDF Local',
    seoDescription:
      'Junte vários PDFs no navegador sem enviar arquivos à nuvem. Sem cadastro, 100% local. Veja o passo a passo e os limites honestos.',
    date: '2026-07-29',
    readTime: '8 min',
    tags: ['Juntar PDF', 'Privacidade', 'Sem upload'],
  },
  {
    id: 'comprimir-pdf-online-celular-sem-app',
    slug: 'comprimir-pdf-online-celular-sem-app',
    title:
      'Comprimir PDF online no celular (sem app e sem upload)',
    excerpt:
      'Reduza o tamanho de PDFs no navegador do celular. Níveis de compressão, o que esperar da qualidade e privacidade local.',
    seoTitle: 'Comprimir PDF online no celular sem app',
    seoDescription:
      'Comprima PDF no navegador do celular sem instalar app e sem upload. Níveis de qualidade, privacidade local e limites reais.',
    date: '2026-07-29',
    readTime: '8 min',
    tags: ['Comprimir PDF', 'Celular', 'Sem upload'],
  },
  {
    id: 'word-para-pdf-online-sem-instalar',
    slug: 'word-para-pdf-online-sem-instalar',
    title:
      'Word para PDF online sem instalar programa (e sem upload)',
    excerpt:
      'Converta DOCX para PDF no navegador sem instalar suíte Office e sem enviar o arquivo para servidor de conversão.',
    seoTitle: 'Word para PDF online sem instalar | Easy PDF Local',
    seoDescription:
      'Converta Word (DOCX) para PDF no navegador sem instalar programa e sem upload. Privacidade local e dicas de layout.',
    date: '2026-07-29',
    readTime: '8 min',
    tags: ['Word para PDF', 'DOCX', 'Sem instalação'],
  },
  {
    id: 'infraestrutura-nuvem-vs-local',
    slug: 'infraestrutura-nuvem-vs-local',
    title:
      'Nuvem vs. processamento local: por que PDFs sensíveis não deveriam sair da sua máquina',
    excerpt:
      'Comparativo entre conversores online que pedem upload e ferramentas 100% no navegador. Segurança, LGPD e o risco real de vazar contratos na nuvem.',
    date: '2026-07-27',
    readTime: '7 min',
    tags: ['Privacidade', 'PDF', 'Client-side'],
  },
];

/** Posts mais recentes primeiro */
export function getBlogPostsSorted(): BlogPostMeta[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogPostBySlug(slug: string): BlogPostMeta | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function formatBlogDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso + 'T12:00:00'));
  } catch {
    return iso;
  }
}
