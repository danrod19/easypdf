/**
 * Metadados do blog (listagem / SEO).
 * O corpo de cada post fica em src/data/posts/{slug}.md
 */

export type BlogPostMeta = {
  /** Identificador estável (igual ao slug na prática) */
  id: string;
  /** URL: /blog/{slug} */
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  /** Ex.: "6 min" */
  readTime: string;
  /** Tags opcionais para UI */
  tags?: string[];
};

export const blogPosts: BlogPostMeta[] = [
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
