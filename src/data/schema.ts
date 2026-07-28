/**
 * Builders de JSON-LD (Schema.org) para rich results.
 * Usados por JsonLd + Layout / ToolSeoContent.
 */

import { SITE_NAME, SITE_ORIGIN } from './seo';
import type { SeoStep } from './toolSeoContent';

/**
 * SoftwareApplication — app gratuito no navegador.
 * Sem AggregateRating / reviews inventados (conformidade Google Rich Results).
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
    browserRequirements: 'Requires JavaScript. Works offline after first load (PWA).',
  } as const;
}

type HowToSchemaInput = {
  name: string;
  description?: string;
  steps: SeoStep[];
  /** Path canônico, ex: /juntar-pdf */
  path?: string;
};

/** HowTo — rich snippet passo a passo na SERP */
export function buildHowToSchema({
  name,
  description,
  steps,
  path,
}: HowToSchemaInput) {
  const url =
    path != null
      ? `${SITE_ORIGIN}${path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`}`
      : undefined;

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
