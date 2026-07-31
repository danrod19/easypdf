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
  /** ISO date YYYY-MM-DD (datePublished) */
  date: string;
  /**
   * ISO date YYYY-MM-DD (dateModified). Se omitido, schema usa `date`.
   */
  dateModified?: string;
  /** Ex.: "6 min" */
  readTime: string;
  /** Tags opcionais para UI */
  tags?: string[];
};

export const blogPosts: BlogPostMeta[] = [
  {
    id: 'marca-dagua-pdf-sem-upload',
    slug: 'marca-dagua-pdf-sem-upload',
    title:
      "Marca d'água em PDF sem upload: texto no navegador",
    excerpt:
      "Adicione marca d'água de texto em PDF no navegador, grátis e sem cadastro. Sem upload — opacidade e estilo locais.",
    seoTitle: "Marca d'água em PDF sem upload | Grátis",
    seoDescription:
      "Coloque marca d'água em PDF grátis no navegador, sem upload e sem cadastro. Texto em todas as páginas com privacidade local.",
    date: '2026-08-01',
    readTime: '8 min',
    tags: ["Marca d'água", 'Privacidade', 'Sem upload'],
  },
  {
    id: 'desenhar-pdf-online-sem-upload',
    slug: 'desenhar-pdf-online-sem-upload',
    title:
      'Desenhar em PDF online sem upload: anotar e assinar no navegador',
    excerpt:
      'Anote ou assine PDF à mão livre na página 1 — no navegador, sem upload e sem cadastro. Simples, não é editor Adobe.',
    seoTitle: 'Desenhar em PDF online sem upload | Grátis',
    seoDescription:
      'Desenhe ou assine PDF grátis no navegador, sem upload e sem cadastro. Anotação na página 1 — honesto sobre o que a tool faz.',
    date: '2026-08-01',
    readTime: '8 min',
    tags: ['Desenhar PDF', 'Assinatura', 'Sem upload'],
  },
  {
    id: 'imagem-para-pdf-sem-upload',
    slug: 'imagem-para-pdf-sem-upload',
    title:
      'Converter imagem para PDF sem upload: JPG e PNG no navegador',
    excerpt:
      'Transforme JPG, PNG ou WebP em PDF no navegador. Várias fotos, ordem personalizada, grátis e sem cadastro.',
    seoTitle: 'Imagem para PDF sem upload | JPG PNG grátis',
    seoDescription:
      'Converta JPG e PNG para PDF grátis no navegador, sem upload e sem cadastro. Várias imagens em um arquivo com privacidade local.',
    date: '2026-08-01',
    readTime: '8 min',
    tags: ['Imagem para PDF', 'JPG', 'Sem upload'],
  },
  {
    id: 'girar-pdf-online-sem-upload',
    slug: 'girar-pdf-online-sem-upload',
    title:
      'Girar PDF online sem upload: corrigir páginas no navegador',
    excerpt:
      'Rotacione páginas de PDF 90° no navegador, sem upload e sem cadastro. Corrija PDF de cabeça para baixo com privacidade local.',
    seoTitle: 'Girar PDF online sem upload | Easy PDF Local',
    seoDescription:
      'Gire PDF no navegador sem upload e sem cadastro. 90° esquerda/direita, todas as páginas ou intervalo — limites honestos.',
    date: '2026-07-31',
    readTime: '8 min',
    tags: ['Girar PDF', 'Privacidade', 'Sem upload'],
  },
  {
    id: 'remover-paginas-pdf-sem-upload',
    slug: 'remover-paginas-pdf-sem-upload',
    title:
      'Remover páginas de PDF sem upload: apagar folhas no navegador',
    excerpt:
      'Exclua páginas de PDF com miniaturas no navegador, grátis e sem cadastro. Sem upload — limites honestos e original preservado.',
    seoTitle: 'Remover páginas de PDF sem upload | Grátis',
    seoDescription:
      'Apague páginas de PDF online grátis no navegador, sem upload e sem cadastro. Miniaturas locais e cópia nova do arquivo.',
    date: '2026-07-31',
    readTime: '8 min',
    tags: ['Remover Páginas', 'Privacidade', 'Sem upload'],
  },
  {
    id: 'desbloquear-pdf-senha-conhecida-sem-upload',
    slug: 'desbloquear-pdf-senha-conhecida-sem-upload',
    title:
      'Desbloquear PDF com senha sem upload (você precisa saber a senha)',
    excerpt:
      'Remova senha de PDF no navegador quando já a conhece. Sem upload, sem cadastro — não quebramos senha esquecida.',
    seoTitle: 'Desbloquear PDF com senha sem upload | Grátis',
    seoDescription:
      'Desbloqueie PDF grátis no navegador se souber a senha. Sem upload e sem cadastro. Não recuperamos nem quebramos senhas.',
    date: '2026-07-31',
    readTime: '8 min',
    tags: ['Desbloquear PDF', 'Senha', 'Privacidade'],
  },
  {
    id: 'dividir-pdf-online-sem-upload',
    slug: 'dividir-pdf-online-sem-upload',
    title:
      'Dividir PDF online sem upload: extrair páginas no navegador',
    excerpt:
      'Extraia páginas de PDF sem enviar o arquivo à nuvem. Sem cadastro, intervalos (1, 3-5) e limites honestos no navegador.',
    seoTitle: 'Dividir PDF online sem upload | Easy PDF Local',
    seoDescription:
      'Divida PDF e extraia páginas no navegador sem upload e sem cadastro. Passo a passo, privacidade local e limites reais.',
    date: '2026-07-30',
    readTime: '8 min',
    tags: ['Dividir PDF', 'Privacidade', 'Sem upload'],
  },
  {
    id: 'extrair-texto-pdf-sem-upload-ocr',
    slug: 'extrair-texto-pdf-sem-upload-ocr',
    title:
      'Extrair texto de PDF sem upload: nativo e OCR no navegador',
    excerpt:
      'Copie texto de PDF digital ou use OCR em português em scans — tudo no navegador, sem upload e sem cadastro.',
    seoTitle: 'Extrair texto de PDF sem upload | OCR no navegador',
    seoDescription:
      'Extraia texto de PDF sem upload: modo nativo ou OCR em português no navegador. Limites honestos, sem cadastro e privacidade local.',
    date: '2026-07-30',
    readTime: '9 min',
    tags: ['Extrair Texto', 'OCR', 'Sem upload'],
  },
  {
    id: 'proteger-pdf-senha-sem-upload',
    slug: 'proteger-pdf-senha-sem-upload',
    title:
      'Proteger PDF com senha sem upload: cifrar no navegador',
    excerpt:
      'Coloque senha em PDF no navegador, grátis e sem cadastro. Criptografia local — sem enviar o arquivo para a nuvem.',
    seoTitle: 'Proteger PDF com senha sem upload | Grátis',
    seoDescription:
      'Proteja PDF com senha grátis no navegador, sem upload e sem cadastro. Criptografia local e o que a senha resolve de verdade.',
    date: '2026-07-30',
    readTime: '8 min',
    tags: ['Proteger PDF', 'Senha', 'Privacidade'],
  },
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
