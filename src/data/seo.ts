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
    title: 'Dividir PDF Online Grátis | Processamento Local Seguro',
    description:
      'Extraia páginas ou intervalos de um PDF no navegador. Sem envio para servidores: divisão 100% local, rápida e privada. Grátis e sem conta.',
    path: '/dividir-pdf',
  },
  '/girar-pdf': {
    title: 'Girar PDF Online Grátis | Rotação Local e Segura',
    description:
      'Gire páginas de PDF 90° à esquerda ou à direita, todas ou por intervalo. Processamento local no navegador — sem upload e sem perda de qualidade.',
    path: '/girar-pdf',
  },
  '/marca-dagua': {
    title: "Marca d'água em PDF Online | Texto Local e Privado",
    description:
      "Adicione marca d'água de texto (ex.: CONFIDENCIAL) em todas as páginas do PDF. 100% no navegador, sem upload para a nuvem. Grátis e seguro.",
    path: '/marca-dagua',
  },
  '/desenhar-pdf': {
    title: 'Desenhar e Assinar PDF Online | 100% no Navegador',
    description:
      'Assine ou desenhe livremente no PDF direto no navegador. Sem upload de arquivos — processamento local com privacidade total. Grátis.',
    path: '/desenhar-pdf',
  },
  '/word-para-pdf': {
    title: 'Word para PDF Online Grátis | Sem Upload e Sem Instalar',
    description:
      'Converta Word (DOCX) para PDF grátis no navegador, sem instalar programa, sem upload e sem cadastro. Conversão 100% local.',
    path: '/word-para-pdf',
  },
  '/imagem-para-pdf': {
    title: 'Imagem para PDF Online Grátis | JPG/PNG sem Upload',
    description:
      'Transforme JPG, PNG ou WebP em PDF no navegador. Várias imagens em um arquivo, ordem personalizada, zero envio para a nuvem.',
    path: '/imagem-para-pdf',
  },
  '/extrair-texto': {
    title: 'Extrair Texto de PDF Online | Nativo e OCR Local Seguro',
    description:
      'Extraia texto de PDF no navegador com pdf.js ou OCR (Tesseract) em scans. 100% local, sem upload. Português, grátis e sem cadastro.',
    path: '/extrair-texto',
  },
  '/proteger-pdf': {
    title: 'Proteger PDF com Senha Online | Criptografia Local Segura',
    description:
      'Bloqueie PDF com senha no navegador, sem upload. Criptografia client-side, grátis e privada — seus arquivos não sobem para a nuvem.',
    path: '/proteger-pdf',
  },
  '/desbloquear-pdf': {
    title: 'Desbloquear PDF Online | Remover Senha Local e Seguro',
    description:
      'Remova a senha de um PDF no navegador quando você já a conhece. Sem upload, grátis e privado — desbloqueio 100% local.',
    path: '/desbloquear-pdf',
  },
  '/remover-paginas': {
    title: 'Remover Páginas de PDF Online | Exclusão Local Grátis',
    description:
      'Apague páginas indesejadas do PDF com miniaturas no navegador. Sem upload: remoção 100% local com pdf-lib. Grátis e sem cadastro.',
    path: '/remover-paginas',
  },
  '/comprimir-pdf': {
    title: 'Comprimir PDF Online Grátis | Sem Upload no Navegador',
    description:
      'Comprima PDF grátis no navegador ou no celular, sem app, sem upload e sem cadastro. Reduza tamanho com privacidade local.',
    path: '/comprimir-pdf',
  },
  '/pdf-sem-upload': {
    title: 'PDF sem Upload | Ferramentas Locais no Navegador',
    description:
      'Processe PDFs no navegador sem enviar arquivos para a nuvem. Privacidade, LGPD e ferramentas grátis sem cadastro — Easy PDF Local.',
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
    title: 'Sobre o Easy PDF Local | Nossa Missão de Privacidade',
    description:
      'Idealizado por profissional brasileiro de TI, redes e telecom. PDF 100% no navegador, sem upload — compromisso com privacidade pessoal e corporativa.',
    path: '/sobre',
  },
  '/contato': {
    title: 'Contato | Easy PDF Local — Feedback e Suporte',
    description:
      'Envie feedback, reporte bugs ou fale sobre parcerias. A comunidade ajuda a melhorar o Easy PDF Local. Contato por e-mail, resposta humana.',
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
