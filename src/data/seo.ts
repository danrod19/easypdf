/**
 * Metadados SEO On-Page por rota.
 * Títulos otimizados para intenção de busca + diferencial (local / sem upload).
 * Descrições ~150–160 caracteres, com CTA implícito de privacidade.
 */

export type SeoMeta = {
  /** <title> completo (não concatenar sufixo no hook) */
  title: string;
  /** meta name="description" */
  description: string;
  /** path canônico, ex: /juntar-pdf (opcional) */
  path?: string;
};

export const SITE_ORIGIN = 'https://easypdflocal.com.br';
export const SITE_NAME = 'Easy PDF Local';

/**
 * Normaliza path para canonical self-referencing:
 * - sem query/hash (pathname puro)
 * - sem barra final (exceto home "/")
 * - sempre começa com /
 *
 * Regra de site (alinhada a sitemap, prerender-routes e wrangler
 * `html_handling = "drop-trailing-slash"`): URL canônica SEM trailing slash.
 * Docs: docs/PRERENDER.md § Trailing slash
 */
export function normalizeSeoPath(pathname: string): string {
  let p = (pathname || '/').trim();
  // remove query/hash se alguém passar URL parcial
  const q = p.indexOf('?');
  if (q >= 0) p = p.slice(0, q);
  const h = p.indexOf('#');
  if (h >= 0) p = p.slice(0, h);
  if (!p.startsWith('/')) p = `/${p}`;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p || '/';
}

/** URL canônica absoluta HTTPS, ex: https://easypdflocal.com.br/word-para-pdf */
export function buildCanonicalUrl(pathname: string): string {
  const path = normalizeSeoPath(pathname);
  return path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}

export const seoByPath: Record<string, SeoMeta> = {
  '/': {
    title: 'Easy PDF Local | PDF no navegador, com limites honestos',
    description:
      'Junte, divida, gire e converta PDFs no navegador. Processamento no dispositivo, sem cadastro — com tetos de tamanho e páginas para não travar.',
    path: '/',
  },
  '/juntar-pdf': {
    title: 'Juntar PDF: unir na ordem da lista (até 20 arquivos)',
    description:
      'Una PDFs na ordem da fila, no navegador. Até 20 arquivos, 50 MB cada e 80 MB no total. Originais no disco permanecem.',
    path: '/juntar-pdf',
  },
  '/dividir-pdf': {
    title: 'Dividir PDF: extrair páginas (1, 3-5) no navegador',
    description:
      'Informe o intervalo e baixe um PDF só com esse trecho. Um arquivo de saída, não ZIP. Original no disco intacto.',
    path: '/dividir-pdf',
  },
  '/girar-pdf': {
    title: 'Girar PDF: virar 90° ou de cabeça para baixo',
    description:
      'Orientação de página em passos de 90°. Não endireita foto torta nem faz OCR. Salvar aplica os ângulos no arquivo.',
    path: '/girar-pdf',
  },
  '/marca-dagua': {
    title: "Marca d'água de texto em todas as páginas do PDF",
    description:
      "Sobreponha um texto (ex.: CONFIDENCIAL) em todas as páginas. É marca visual — não é senha nem DRM.",
    path: '/marca-dagua',
  },
  '/desenhar-pdf': {
    title: 'Desenhar no PDF: anotar a página 1 (não é editor Adobe)',
    description:
      'Traço à mão na folha 1, mouse ou toque. Sem anotar as outras páginas, sem texto tipográfico, sem ICP-Brasil.',
    path: '/desenhar-pdf',
  },
  '/word-para-pdf': {
    title: 'Word para PDF: converter DOCX no navegador',
    description:
      'DOCX → PDF sem instalar Word. Layout do dia a dia; tabelas e artes complexas podem divergir. Não abre .doc antigo.',
    path: '/word-para-pdf',
  },
  '/imagem-para-pdf': {
    title: 'Imagem para PDF: JPG/PNG em páginas, na sua ordem',
    description:
      'Cada imagem vira uma página no tamanho da foto — sem A4 forçado. Até 20 arquivos. Sem HEIC nesta ferramenta.',
    path: '/imagem-para-pdf',
  },
  '/extrair-texto': {
    title: 'Extrair texto de PDF: nativo ou OCR em português',
    description:
      'Camada de texto com pdf.js, ou Tesseract no CPU em scans. OCR até 30 páginas; revise erros em foto torta e manuscrito.',
    path: '/extrair-texto',
  },
  '/proteger-pdf': {
    title: 'Proteger PDF: senha de abertura no dispositivo',
    description:
      'Cifra o PDF no navegador. Esqueceu a senha: não há recuperação. Não impede print screen.',
    path: '/proteger-pdf',
  },
  '/desbloquear-pdf': {
    title: 'Desbloquear PDF: só se você já souber a senha',
    description:
      'Gera uma cópia aberta com a senha correta. Não quebramos senha esquecida nem testamos combinações.',
    path: '/desbloquear-pdf',
  },
  '/remover-paginas': {
    title: 'Remover páginas de PDF: marcar miniaturas e baixar cópia',
    description:
      'Marque as folhas na grade e baixe um PDF novo. O original no disco não muda. Precisa restar ao menos uma página.',
    path: '/remover-paginas',
  },
  '/comprimir-pdf': {
    title: 'Comprimir PDF: reduzir tamanho (página vira imagem)',
    description:
      'Rasteriza cada página em JPEG. Texto em geral deixa de ser selecionável. Até 50 MB e 50 páginas.',
    path: '/comprimir-pdf',
  },
  '/pdf-sem-upload': {
    title: 'PDF sem Upload | Processamento Local no Navegador',
    description:
      'O que é PDF sem upload: ferramentas grátis no navegador, sem enviar o arquivo para processar. Privacidade, limites honestos e links para juntar, comprimir e converter.',
    path: '/pdf-sem-upload',
  },
  '/privacidade': {
    title: 'Política de Privacidade | Easy PDF Local',
    description:
      'Como o Easy PDF Local protege seus dados: processamento 100% no navegador, sem upload de documentos e sem armazenamento de arquivos.',
    path: '/privacidade',
  },
  '/termos': {
    title: 'Termos de Uso | Easy PDF Local',
    description:
      'Termos de uso do Easy PDF Local — ferramentas de PDF gratuitas com processamento local no navegador.',
    path: '/termos',
  },
  '/sobre': {
    title: 'Sobre o Easy PDF Local | Privacidade e PDF no Navegador',
    description:
      'Conheça o Easy PDF Local: ferramentas de PDF grátis, sem cadastro e sem upload para processar. Projeto independente com foco em privacidade no navegador.',
    path: '/sobre',
  },
  '/contato': {
    title: 'Contato | Easy PDF Local — Feedback e Privacidade',
    description:
      'Fale com o mantenedor do Easy PDF Local: bugs, sugestões ou dúvidas de privacidade. E-mail humano — as tools processam PDF no navegador, não por e-mail.',
    path: '/contato',
  },
  '/blog': {
    title: 'Blog | PDF no navegador, privacidade e LGPD',
    description:
      'Artigos sobre processar PDF no navegador sem upload: privacidade e LGPD, e nuvem vs. processamento local — limites reais, sem tutoriais em massa.',
    path: '/blog',
  },
};

export const defaultSeo: SeoMeta = {
  title: 'Easy PDF Local | PDF no navegador, com limites honestos',
  description:
    'Ferramentas de PDF no navegador: juntar, dividir, comprimir e converter no dispositivo. Sem cadastro — com limites técnicos de tamanho e páginas.',
  path: '/',
};

export function getSeoForPath(pathname: string): SeoMeta {
  const normalized = normalizeSeoPath(pathname);
  const meta = seoByPath[normalized] ?? defaultSeo;
  // Garante path canônico sempre presente (self-referencing)
  return {
    ...meta,
    path: meta.path ? normalizeSeoPath(meta.path) : normalized,
  };
}
