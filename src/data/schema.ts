/**
 * Builders de JSON-LD (Schema.org) — ponto central para evitar drift.
 * Usados por JsonLd + Layout / ToolSeoContent / Blog / hub.
 *
 * Regras:
 * - Sem AggregateRating / reviewCount inventados
 * - URLs absolutas (SITE_ORIGIN)
 * - Dados alinhados ao conteúdo visível
 * - Sem SearchAction se não houver busca interna real
 */

import { SITE_NAME, SITE_ORIGIN, buildCanonicalUrl } from './seo';
import type { SeoFaq, SeoStep } from './toolSeoContent';
import type { BlogPostMeta } from './blogPosts';

export type BreadcrumbItem = {
  name: string;
  /** Path relativo, ex: /juntar-pdf — omitir no último item se for a página atual */
  path?: string;
};

/** Absolute URL helper */
export function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  return buildCanonicalUrl(pathOrUrl || '/');
}

/**
 * Organization — entidade do site (home e author em Articles).
 */
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/pwa-512x512.png`,
    description:
      'Ferramentas de PDF 100% no navegador — processamento local, sem upload de documentos, grátis e sem cadastro.',
    sameAs: [] as string[],
  };
}

/**
 * WebSite — home.
 * Sem SearchAction: não há busca interna real no site.
 */
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_ORIGIN,
    description:
      'Junte, divida, comprima e converta PDFs grátis no navegador. Processamento 100% local — seus arquivos não sobem para a nuvem.',
    inLanguage: 'pt-BR',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
  };
}

/**
 * SoftwareApplication — app global (Layout / home).
 * Sem AggregateRating.
 */
export function buildSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'UtilitiesApplication',
    applicationSubCategory: 'PDF Tools',
    operatingSystem: 'Web Browser (Chrome, Firefox, Edge, Safari)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
    description:
      'Ferramentas de PDF 100% no navegador — juntar, dividir, comprimir e converter sem upload. Privacidade total, grátis e sem cadastro.',
    url: SITE_ORIGIN,
    image: `${SITE_ORIGIN}/pwa-512x512.png`,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
    featureList: [
      'Processamento 100% client-side',
      'Sem upload de arquivos',
      'Grátis, sem cadastro e sem cota diária de uso',
      'Privacidade total no dispositivo',
    ],
    browserRequirements:
      'Requires JavaScript. Works offline after first load (PWA).',
  };
}

/**
 * WebApplication — ferramenta específica (opcional, por página).
 */
export function buildToolWebApplicationSchema(input: {
  name: string;
  description: string;
  path: string;
}) {
  const url = absoluteUrl(input.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: input.name,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
    description: input.description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
  };
}

export function buildBreadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const position = index + 1;
      const entry: Record<string, unknown> = {
        '@type': 'ListItem',
        position,
        name: item.name,
      };
      if (item.path != null) {
        entry.item = absoluteUrl(item.path);
      }
      return entry;
    }),
  };
}

export function buildFaqPageSchema(faqs: SeoFaq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

type HowToSchemaInput = {
  name: string;
  description?: string;
  steps: SeoStep[];
  path?: string;
};

/** HowTo — rich snippet passo a passo */
export function buildHowToSchema({
  name,
  description,
  steps,
  path,
}: HowToSchemaInput) {
  const url = path != null ? absoluteUrl(path) : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description:
      description ??
      'Processamento 100% local no navegador — seus arquivos não saem do dispositivo.',
    ...(url ? { url } : {}),
    totalTime: 'PT2M',
    tool: {
      '@type': 'HowToTool',
      name: SITE_NAME,
    },
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
      url: url ? `${url}#passo-${index + 1}` : undefined,
    })),
  };
}

/**
 * BlogPosting / Article para posts do blog.
 */
export function buildBlogPostingSchema(post: BlogPostMeta) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const image = `${SITE_ORIGIN}/og-image.png`;
  const description = post.seoDescription ?? post.excerpt;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    datePublished: post.date,
    dateModified: post.dateModified ?? post.date,
    image: [image],
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_ORIGIN,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}/pwa-512x512.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    inLanguage: 'pt-BR',
    isPartOf: {
      '@type': 'Blog',
      name: `Blog ${SITE_NAME}`,
      url: absoluteUrl('/blog'),
    },
  };
}

/**
 * WebPage / CollectionPage / AboutPage / ContactPage
 * (hubs, institucionais — alinhado ao conteúdo visível).
 */
export function buildWebPageSchema(input: {
  name: string;
  description: string;
  path: string;
  type?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage';
}) {
  const url = absoluteUrl(input.path);
  return {
    '@context': 'https://schema.org',
    '@type': input.type ?? 'WebPage',
    name: input.name,
    description: input.description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
    inLanguage: 'pt-BR',
  };
}

/** @graph helper — vários nós no mesmo script (opcional) */
export function buildGraph(nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.map((node) => {
      // Remove @context aninhado se presente
      if (node && typeof node === 'object' && '@context' in node) {
        const { ['@context']: _c, ...rest } = node as Record<string, unknown>;
        return rest;
      }
      return node;
    }),
  };
}
