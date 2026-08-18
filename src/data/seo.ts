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
    title:
      'Easy PDF Local | Ferramentas de PDF 100% Seguras e Sem Upload',
    description:
      'Junte, divida, gire e converta PDFs grátis no navegador. Processamento 100% local — seus arquivos nunca sobem para a nuvem. Sem cadastro.',
    path: '/',
  },
  '/juntar-pdf': {
    title: 'Juntar PDF Online Grátis | Sem Upload e Sem Cadastro',
    description:
      'Junte vários PDFs grátis no navegador, sem upload e sem cadastro. Merge local, ordem das páginas e privacidade total no seu dispositivo.',
    path: '/juntar-pdf',
  },
  '/dividir-pdf': {
    title: 'Dividir PDF Online Grátis | Sem Upload e Sem Cadastro',
    description:
      'Extraia páginas de PDF grátis no navegador, sem upload e sem cadastro. Intervalos (1, 3-5) com privacidade local.',
    path: '/dividir-pdf',
  },
  '/girar-pdf': {
    title: 'Girar PDF Online Grátis | Virar Página Sem Upload',
    description:
      'Como girar um PDF ou virar página de cabeça para baixo no navegador. 90° esquerda/direita, grátis, sem upload e sem cadastro.',
    path: '/girar-pdf',
  },
  '/marca-dagua': {
    title: "Marca d'água em PDF Grátis | Sem Upload e Sem Cadastro",
    description:
      "Adicione marca d'água de texto grátis no navegador, sem upload e sem cadastro. Opacidade e estilo 100% locais.",
    path: '/marca-dagua',
  },
  '/desenhar-pdf': {
    title: 'Desenhar e Assinar PDF Grátis | Sem Upload no Navegador',
    description:
      'Assine ou desenhe no PDF grátis no navegador, sem upload e sem cadastro. Mouse ou toque — processamento local.',
    path: '/desenhar-pdf',
  },
  '/word-para-pdf': {
    title: 'Word para PDF Online Grátis | Sem Upload e Sem Instalar',
    description:
      'Converta Word (DOCX) para PDF grátis no navegador, sem instalar programa, sem upload e sem cadastro. Conversão 100% local.',
    path: '/word-para-pdf',
  },
  '/imagem-para-pdf': {
    title: 'Imagem para PDF Online Grátis | Sem Upload e Sem Cadastro',
    description:
      'Converta JPG, PNG ou WebP em PDF grátis no navegador, sem upload e sem cadastro. Várias imagens, ordem personalizada.',
    path: '/imagem-para-pdf',
  },
  '/extrair-texto': {
    title: 'Extrair Texto de PDF Grátis | Sem Upload no Navegador',
    description:
      'Extraia texto de PDF grátis no navegador, sem upload e sem cadastro. Nativo (pdf.js) ou OCR em português local.',
    path: '/extrair-texto',
  },
  '/proteger-pdf': {
    title: 'Proteger PDF com Senha Grátis | Sem Upload e Sem Cadastro',
    description:
      'Proteja PDF com senha grátis no navegador, sem upload e sem cadastro. Criptografia local no seu dispositivo.',
    path: '/proteger-pdf',
  },
  '/desbloquear-pdf': {
    title: 'Desbloquear PDF Online Grátis | Sem Upload e Sem Cadastro',
    description:
      'Remova senha de PDF grátis no navegador quando já a conhece. Sem upload, sem cadastro — desbloqueio 100% local.',
    path: '/desbloquear-pdf',
  },
  '/remover-paginas': {
    title: 'Remover Páginas de PDF Grátis | Sem Upload e Sem Cadastro',
    description:
      'Apague páginas de PDF grátis no navegador, sem upload e sem cadastro. Miniaturas locais e cópia nova com o que restar.',
    path: '/remover-paginas',
  },
  '/comprimir-pdf': {
    title: 'Comprimir PDF Online Grátis | Sem Upload no Navegador',
    description:
      'Comprima PDF grátis no navegador ou no celular, sem app, sem upload e sem cadastro. Reduza tamanho com privacidade local.',
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
    title: 'Blog | Easy PDF Local — Privacidade e PDF Local',
    description:
      'Artigos sobre processamento de PDF no navegador, segurança de documentos, LGPD e produtividade sem upload para a nuvem.',
    path: '/blog',
  },
};

export const defaultSeo: SeoMeta = {
  title: 'Easy PDF Local | Ferramentas de PDF 100% Seguras e Sem Upload',
  description:
    'Uma suíte completa e segura para manipular PDFs direto no seu navegador. Nenhuma imagem ou documento é enviado para a nuvem. 100% gratuito e privado.',
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
