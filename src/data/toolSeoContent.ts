/**
 * SEO abaixo da UI — só o que é específico da operação.
 * Intro/quando não usar: toolAboveFold (não repetir aqui).
 * Sem “para quem”, casos clonados, “por que sem upload” nem bloco de privacidade.
 */

import {
  LIMIT_NUMBERS,
  buildSeoLimitsBlock,
} from './fileLimitsCopy';

const MAX_FILE_MB = LIMIT_NUMBERS.maxFileMb;
const MAX_MERGE_TOTAL_MB = LIMIT_NUMBERS.maxMergeTotalMb;
const MAX_MERGE_FILES = LIMIT_NUMBERS.maxMergeFiles;
const MAX_COMPRESS_PAGES = LIMIT_NUMBERS.maxCompressPages;
const MAX_OCR_PAGES = LIMIT_NUMBERS.maxOcrPages;
const MAX_PDF_PAGES_GENERAL = LIMIT_NUMBERS.maxPdfPagesGeneral;

export type SeoStep = {
  title: string;
  description: string;
};

export type SeoBenefit = {
  title: string;
  description: string;
};

export type SeoFaq = {
  question: string;
  answer: string;
};

export type SeoUseCase = {
  title: string;
  description: string;
};

export type SeoRelatedLink = {
  path: string;
  label: string;
  description?: string;
};

export type ToolSeoBlock = {
  toolName?: string;
  overviewTitle?: string;
  overview?: string[];
  audienceTitle?: string;
  audience?: string;
  useCasesTitle?: string;
  useCases?: SeoUseCase[];
  howToTitle?: string;
  howToIntro?: string;
  steps?: SeoStep[];
  benefitsTitle?: string;
  benefitsIntro?: string;
  benefits?: SeoBenefit[];
  privacyTitle?: string;
  privacy?: string;
  limitsTitle?: string;
  limitsIntro?: string;
  limits?: { label: string; text: string }[];
  faqTitle?: string;
  faqs?: SeoFaq[];
  relatedTitle?: string;
  related?: SeoRelatedLink[];
  schemaDescription?: string;
  /** Ordem das seções — evita o mesmo esqueleto em todas as tools */
  lead?: 'howto' | 'limits' | 'overview';
};

/** Home — hub, não clone de tool */
export const homeSeoContent: ToolSeoBlock = {
  lead: 'overview',
  overviewTitle: 'O que este site faz (e o que deixa no aparelho)',
  overview: [
    'Cada ferramenta abre no navegador, lê o arquivo na memória da aba e devolve um download. Não há conta para as tools principais. Há tetos de tamanho e páginas para o aparelho não travar.',
    'Detalhe do modelo (cookies, o que sobe e o que não sobe) está em PDF sem upload — não repetimos isso em cada operação.',
  ],
  howToTitle: 'Como usar o site',
  howToIntro:
    'Fluxo único: escolha a operação, selecione o arquivo no dispositivo, processe, baixe. A velocidade depende do seu hardware.',
  steps: [
    {
      title: 'Escolha a ferramenta',
      description:
        'Juntar, dividir, girar, comprimir, converter, senha, OCR, etc. — cada página descreve o que aquela operação não faz.',
    },
    {
      title: 'Selecione o arquivo no dispositivo',
      description:
        'Arraste ou abra o seletor. A validação de tipo e tamanho roda no cliente.',
    },
    {
      title: 'Baixe o resultado',
      description:
        'O original no disco não é sobrescrito sozinho. Você cria uma cópia.',
    },
  ],
  faqTitle: 'Cookies e quando o navegador não dá conta',
  faqs: [
    {
      question: 'O site usa cookies? Eles leem o conteúdo do meu PDF?',
      answer:
        'Cookies e scripts de medição/publicidade (quando ativos e com o consentimento exigido) tratam de navegação e anúncios — não leem o PDF, DOCX ou imagem na ferramenta. Preferências no rodapé. Detalhes na Política de Privacidade.',
    },
    {
      question: 'Quando o processamento local falha?',
      answer: `No celular com pouca RAM, em arquivos acima de ${MAX_FILE_MB} MB, no merge acima de ${MAX_MERGE_FILES} arquivos / ${MAX_MERGE_TOTAL_MB} MB no total, no OCR acima de ${MAX_OCR_PAGES} páginas ou na compressão acima de ${MAX_COMPRESS_PAGES} páginas o site recusa ou trava. Não há modo ilimitado no cliente — use lotes menores, desktop, ou outro programa.`,
    },
  ],
};

export const juntarPdfSeoContent: ToolSeoBlock = {
  toolName: 'Juntar PDF',
  lead: 'howto',
  schemaDescription: `Unir PDFs na ordem da lista, no navegador. Até ${MAX_MERGE_FILES} arquivos e ${MAX_MERGE_TOTAL_MB} MB no total.`,
  howToTitle: 'Unir a fila: ordem e botão Juntar',
  howToIntro:
    'A lista no topo é o PDF final. Primeiro item = primeira página. Não precisa de dois arquivos iguais: precisa de pelo menos dois PDFs distintos na fila.',
  steps: [
    {
      title: 'Adicione 2 ou mais PDFs',
      description: `Só PDF. Até ${MAX_FILE_MB} MB cada e ${MAX_MERGE_FILES} na operação.`,
    },
    {
      title: 'Suba ou desça os itens',
      description:
        'A ordem da fila é a ordem das páginas. Ajuste antes de mesclar.',
    },
    {
      title: 'Junte e pré-visualize',
      description: `Total da fila até ${MAX_MERGE_TOTAL_MB} MB. Confira a ordem na pré-visualização e baixe a cópia — os originais ficam no disco.`,
    },
  ],
  ...buildSeoLimitsBlock('merge_pdf', {
    title: 'Teto do merge (fila, não “plano”)',
  }),
  faqTitle: 'Dúvidas do merge',
  faqs: [
    {
      question: 'Quantos PDFs e qual o tamanho?',
      answer: `Até ${MAX_MERGE_FILES} arquivos, ${MAX_FILE_MB} MB cada, ${MAX_MERGE_TOTAL_MB} MB somados. Acima disso a validação recusa.`,
    },
    {
      question: 'A ordem da lista importa?',
      answer:
        'Sim: é a ordem das páginas no arquivo unido. Use subir/descer antes de juntar.',
    },
    {
      question: 'E se um PDF tiver senha?',
      answer:
        'Desbloqueie antes (com a senha correta) e junte as cópias abertas. Senha na fila costuma falhar o merge.',
    },
  ],
  relatedTitle: 'Depois de unir',
  related: [
    {
      path: '/comprimir-pdf',
      label: 'Comprimir PDF',
      description: 'Se o arquivo unido ficou pesado (páginas viram JPEG)',
    },
    {
      path: '/girar-pdf',
      label: 'Girar PDF',
      description: 'Corrigir folhas de lado antes ou depois',
    },
  ],
};

export const dividirPdfSeoContent: ToolSeoBlock = {
  toolName: 'Dividir PDF',
  lead: 'howto',
  schemaDescription:
    'Extrair páginas por intervalo (ex.: 1, 3-5) para um PDF novo, no navegador.',
  howToTitle: 'Extrair com intervalo (1, 3-5, 8)',
  howToIntro:
    'Não fatia em N arquivos iguais nem gera ZIP. Você informa as páginas e baixa um PDF só com esse trecho. O original no disco permanece.',
  steps: [
    {
      title: 'Selecione um PDF',
      description: 'A contagem de páginas é lida no navegador.',
    },
    {
      title: 'Digite páginas ou faixas',
      description:
        'Exemplos: 1 · 3-5 · 1, 3-5, 8. Numeração a partir de 1. Intervalo inválido é recusado na hora.',
    },
    {
      title: 'Extraia e baixe',
      description:
        'Pré-visualize o recorte. Um único PDF de saída — não é um pacote de arquivos separados.',
    },
  ],
  limitsTitle: 'O que a extração não faz',
  limitsIntro: `Teto de ${MAX_FILE_MB} MB. Operações leves na casa de ~${MAX_PDF_PAGES_GENERAL} páginas. Saída = um PDF, não ZIP.`,
  limits: [
    { label: 'Tamanho', text: `Até ${MAX_FILE_MB} MB.` },
    {
      label: 'Saída',
      text: 'Um arquivo com as páginas pedidas — não divide em um PDF por página automaticamente.',
    },
    {
      label: 'Senha',
      text: 'PDF protegido: desbloqueie antes.',
    },
  ],
  faqTitle: 'Intervalos e original',
  faqs: [
    {
      question: 'Como escrevo o intervalo?',
      answer:
        'Páginas avulsas e faixas no mesmo campo: 1, 3-5, 8. A primeira página é 1.',
    },
    {
      question: 'O PDF original some?',
      answer:
        'Não. Só a cópia extraída é baixada.',
    },
    {
      question: 'Gera vários PDFs de uma vez?',
      answer:
        'Não nesta ferramenta. Um intervalo → um arquivo. Para outro trecho, rode de novo.',
    },
  ],
  relatedTitle: 'Outras operações de página',
  related: [
    {
      path: '/remover-paginas',
      label: 'Remover páginas',
      description: 'Marcar miniaturas em vez de digitar intervalo',
    },
    {
      path: '/juntar-pdf',
      label: 'Juntar PDF',
      description: 'Unir trechos de volta',
    },
  ],
};

export const girarPdfSeoContent: ToolSeoBlock = {
  toolName: 'Girar PDF',
  lead: 'howto',
  schemaDescription:
    'Girar páginas 90° (todas ou intervalo). Orientação de página, não reimpressão.',
  howToTitle: 'Giros de 90° e o botão Salvar',
  howToIntro:
    'Cada clique soma 90°. Cabeça para baixo = dois cliques (180°). Os botões só mudam o estado; Salvar aplica no PDF.',
  steps: [
    {
      title: 'Abra o PDF',
      description: 'Selecione no dispositivo. Ângulos ficam na sessão até salvar.',
    },
    {
      title: 'Todas as páginas ou intervalo',
      description:
        'Folhas invertidas: informe 1, 3-5. Documento inteiro: gire todas.',
    },
    {
      title: 'Salve a cópia',
      description:
        'pdf-lib grava a orientação. Não reexporta como foto — texto e vetores tendem a permanecer.',
    },
  ],
  limitsTitle: 'O que girar não corrige',
  limitsIntro:
    'Não endireita foto torta, não faz OCR e não rotaciona em graus livres (só 90°).',
  limits: [
    { label: 'Tamanho', text: `Até ${MAX_FILE_MB} MB.` },
    {
      label: 'Ângulo',
      text: 'Passos de 90° na UI. Sem rotação livre tipo 15°.',
    },
    {
      label: 'Scan torto',
      text: 'Página fotografada em diagonal continua torta — isso é recorte/deskew, não metadado de página.',
    },
  ],
  faqTitle: 'Virar página — perguntas',
  faqs: [
    {
      question: 'Como virar de cabeça para baixo?',
      answer:
        'Dois giros de 90° (180°) nas páginas invertidas, depois Salvar.',
    },
    {
      question: 'A qualidade cai?',
      answer:
        'Em geral não: é orientação de página, não compactar de novo como JPEG.',
    },
    {
      question: 'Por que preciso clicar em Salvar?',
      answer:
        'Girar à esquerda/direita só acumula o ângulo. Salvar gera o arquivo para download.',
    },
  ],
  relatedTitle: 'Antes de enviar o scan',
  related: [
    {
      path: '/remover-paginas',
      label: 'Remover páginas',
      description: 'Tirar folhas em branco depois de orientar',
    },
    {
      path: '/juntar-pdf',
      label: 'Juntar PDF',
      description: 'Unir depois de padronizar a orientação',
    },
  ],
};

export const marcaDaguaSeoContent: ToolSeoBlock = {
  toolName: "Marca d'água",
  lead: 'overview',
  schemaDescription:
    "Texto sobreposto em todas as páginas. Visual, não é senha nem DRM.",
  overviewTitle: "Marca de texto — não é proteção criptográfica",
  overview: [
    "O texto (ex.: CONFIDENCIAL) vai para todas as páginas, com opacidade e posição. Quem copiar o arquivo ainda copia o PDF. Para senha de abertura use Proteger PDF.",
    'Fonte padrão Helvetica: acentos ok; emojis e símbolos raros podem sumir.',
  ],
  howToTitle: "Aplicar o texto em todas as páginas",
  steps: [
    {
      title: 'Selecione o PDF',
      description: `Até ${MAX_FILE_MB} MB.`,
    },
    {
      title: 'Texto, opacidade, posição',
      description:
        'Ajuste no formulário. A marca é a mesma em cada página do arquivo.',
    },
    {
      title: 'Baixe a cópia marcada',
      description:
        'Guarde o original sem marca se ainda precisar de uma versão limpa.',
    },
  ],
  limitsTitle: "Limites da marca d'água",
  limitsIntro: 'Texto embutido. Não é carimbo de imagem complexo nem certificado.',
  limits: [
    { label: 'Tamanho', text: `Até ${MAX_FILE_MB} MB.` },
    {
      label: 'Tipo',
      text: 'Texto — não sobrepõe logo em PNG nesta ferramenta.',
    },
    {
      label: 'Remoção',
      text: 'A marca entra no PDF gerado; não há “desfazer marca” sobre o original.',
    },
  ],
  faqTitle: "Perguntas da marca d'água",
  faqs: [
    {
      question: 'Vai em todas as páginas?',
      answer: 'Sim. Uniforme no arquivo selecionado.',
    },
    {
      question: 'Isso impede copiar o PDF?',
      answer:
        'Não. É marca visual. Senha de abertura: Proteger PDF.',
    },
    {
      question: 'Posso usar emoji?',
      answer:
        'Pode desaparecer na sanitização da fonte. Prefira letras, números e pontuação.',
    },
  ],
  relatedTitle: 'Marcar vs. cifrar',
  related: [
    {
      path: '/proteger-pdf',
      label: 'Proteger PDF',
      description: 'Senha para abrir o arquivo',
    },
    {
      path: '/desenhar-pdf',
      label: 'Desenhar no PDF',
      description: 'Rabisco na página 1, não texto em todas',
    },
  ],
};

export const desenharPdfSeoContent: ToolSeoBlock = {
  toolName: 'Desenhar no PDF',
  lead: 'limits',
  schemaDescription:
    'Traço à mão na página 1. Não é editor Adobe nem assinatura ICP-Brasil.',
  howToTitle: 'Rabiscar na pré-visualização e exportar',
  steps: [
    {
      title: 'Carregue o PDF',
      description: 'A pré-visualização mostra a página 1 (pdf.js).',
    },
    {
      title: 'Cor, espessura, desfazer',
      description:
        'Mouse, toque ou stylus. “Desfazer” tira o último traço; “Limpar” zera a sessão.',
    },
    {
      title: 'Exporte',
      description:
        'Linhas vetoriais no PDF. As outras páginas saem intactas.',
    },
  ],
  ...buildSeoLimitsBlock('pdf_single', {
    title: 'Só a página 1 — o que não é esta tool',
    intro: `Até ${MAX_FILE_MB} MB. Desenho apenas na folha 1. Sem texto tipográfico, sem campos de formulário, sem certificado digital.`,
    extraItems: [
      {
        label: 'Página',
        text: 'Se a assinatura está na folha 3, coloque essa folha na frente (dividir/juntar) antes.',
      },
      {
        label: 'Assinatura legal',
        text: 'Não emite ICP-Brasil. Validade de um traço manuscrito depende do contexto, não deste site.',
      },
    ],
  }),
  faqTitle: 'Anotar PDF — dúvidas',
  faqs: [
    {
      question: 'Em qual página desenho?',
      answer:
        'Na 1. Reordene o PDF se a folha alvo não for a primeira.',
    },
    {
      question: 'Posso desenhar no celular?',
      answer: 'Sim: toque ou stylus. PDFs pesados consomem RAM no canvas.',
    },
    {
      question: 'O traço vira imagem da página inteira?',
      answer:
        'Não. São linhas sobre o conteúdo; o resto da página não é rasterizado só por assinar.',
    },
  ],
  relatedTitle: 'Se a folha não for a primeira',
  related: [
    {
      path: '/dividir-pdf',
      label: 'Dividir PDF',
      description: 'Isolar a página da assinatura',
    },
    {
      path: '/juntar-pdf',
      label: 'Juntar PDF',
      description: 'Remontar depois de assinar a folha 1',
    },
  ],
};

export const wordParaPdfSeoContent: ToolSeoBlock = {
  toolName: 'Word para PDF',
  lead: 'overview',
  schemaDescription:
    'Converter DOCX no navegador. Layout do dia a dia — não é Word desktop.',
  overviewTitle: 'DOCX no navegador ≠ layout idêntico ao Word',
  overview: [
    'Textos, listas e documentos simples costumam ir bem. Caixas flutuantes, tabelas densas e artes complexas podem divergir. Revise o PDF.',
    'Não abre .doc antigo: salve como DOCX antes. Macros não rodam aqui.',
  ],
  howToTitle: 'Do DOCX ao PDF (mammoth → html2pdf)',
  steps: [
    {
      title: 'Use .docx',
      description: `.doc legado: converta noutro editor. Teto ${MAX_FILE_MB} MB.`,
    },
    {
      title: 'Converta e espere o aparelho',
      description:
        'Muitas imagens = mais RAM. No celular, DOCX pesado pode falhar — tente no desktop.',
    },
    {
      title: 'Revise e baixe',
      description:
        'Olhe títulos, listas e quebras. O DOCX original permanece no disco.',
    },
  ],
  ...buildSeoLimitsBlock('docx', {
    title: 'Teto do DOCX e expectativa de layout',
  }),
  faqTitle: 'Conversão Word — perguntas',
  faqs: [
    {
      question: 'Preciso ter o Microsoft Word instalado?',
      answer:
        'Não. Precisa do arquivo DOCX no dispositivo e de um navegador que aguente a conversão.',
    },
    {
      question: 'O PDF fica igual ao Word?',
      answer:
        'Não garantimos pixel-perfect. Documentos simples: ok. Layout de revista: pode divergir.',
    },
    {
      question: 'Aceita .doc?',
      answer:
        'Foco em DOCX. Salve o .doc antigo como DOCX antes.',
    },
  ],
  relatedTitle: 'Depois do PDF',
  related: [
    {
      path: '/comprimir-pdf',
      label: 'Comprimir PDF',
      description: 'Se o portal limitar megabytes (texto deixa de ser selecionável)',
    },
    {
      path: '/juntar-pdf',
      label: 'Juntar PDF',
      description: 'Unir o PDF a anexos',
    },
  ],
};

export const imagemParaPdfSeoContent: ToolSeoBlock = {
  toolName: 'Imagem para PDF',
  lead: 'howto',
  schemaDescription:
    'Cada JPG/PNG/WebP vira uma página no tamanho da imagem, não um A4 forçado.',
  howToTitle: 'Uma imagem, uma página — na ordem da lista',
  howToIntro:
    'A página do PDF segue a dimensão da foto (sem moldura A4 automática). Na impressão, use “ajustar à página” se quiser papel padrão.',
  steps: [
    {
      title: 'Adicione JPG, PNG ou WebP',
      description: `Até ${MAX_MERGE_FILES} imagens, ${MAX_FILE_MB} MB cada. Sem HEIC/GIF/BMP nesta tool.`,
    },
    {
      title: 'Reordene',
      description: 'A primeira da lista é a página 1.',
    },
    {
      title: 'Gere o PDF',
      description:
        'JPEG/PNG entram embutidos; a nitidez segue o arquivo de origem.',
    },
  ],
  ...buildSeoLimitsBlock('merge_images', {
    title: 'Quantas fotos cabem nesta operação',
  }),
  faqTitle: 'Fotos no PDF — dúvidas',
  faqs: [
    {
      question: 'A página fica A4?',
      answer:
        'Não. Largura e altura = a da imagem. Evita borda branca; a impressão A4 é ajuste no diálogo de imprimir.',
    },
    {
      question: 'A qualidade do JPG cai?',
      answer:
        'JPEG e PNG são embutidos sem recomprimir de propósito. A qualidade é a do arquivo que você enviou.',
    },
    {
      question: 'Posso misturar com PDFs?',
      answer:
        'Não nesta tela. Gere o PDF das fotos e, se quiser, junte com outro PDF em Juntar.',
    },
  ],
  relatedTitle: 'Depois das fotos',
  related: [
    {
      path: '/comprimir-pdf',
      label: 'Comprimir PDF',
      description: 'Se o PDF de fotos passou do limite do e-mail',
    },
    {
      path: '/juntar-pdf',
      label: 'Juntar PDF',
      description: 'Unir o resultado a outros PDFs',
    },
  ],
};

export const extrairTextoSeoContent: ToolSeoBlock = {
  toolName: 'Extrair texto',
  lead: 'overview',
  schemaDescription: `Texto nativo (pdf.js) ou OCR Tesseract em português. OCR até ${MAX_OCR_PAGES} páginas.`,
  overviewTitle: 'Texto nativo ou OCR — são dois caminhos',
  overview: [
    'Se o PDF já tem camada de texto, o modo nativo é leve. Scan/foto precisa de OCR: cada página vira canvas e o Tesseract roda no CPU.',
    'OCR erra em manuscrito, foto torta, baixa resolução e carimbo em cima da letra. Revise números e nomes. Não reconstrói tabela complexa fielmente.',
  ],
  howToTitle: 'Copiar ou baixar .txt',
  steps: [
    {
      title: 'Selecione o PDF',
      description: `Até ${MAX_FILE_MB} MB.`,
    },
    {
      title: 'Nativo ou Forçar OCR',
      description: `OCR só se o nativo vier vazio. Teto de ${MAX_OCR_PAGES} páginas no OCR.`,
    },
    {
      title: 'Revise e exporte',
      description: 'Copie ou baixe o texto. Sair da página cancela o job.',
    },
  ],
  ...buildSeoLimitsBlock('ocr', {
    title: 'Teto do Tesseract (e do celular)',
  }),
  faqTitle: 'OCR e texto nativo',
  faqs: [
    {
      question: 'Quando usar Forçar OCR?',
      answer:
        'Quando o modo nativo não devolve texto e o PDF é scan ou foto. É bem mais lento e pesado.',
    },
    {
      question: 'Quantas páginas no OCR?',
      answer: `Até ${MAX_OCR_PAGES}. Acima disso o site bloqueia de propósito.`,
    },
    {
      question: 'O OCR erra?',
      answer:
        'Sim, com frequência em scan ruim. Não use o resultado cego para valores críticos.',
    },
  ],
  relatedTitle: 'Se o scan estiver enorme',
  related: [
    {
      path: '/dividir-pdf',
      label: 'Dividir PDF',
      description: 'OCR só no trecho necessário',
    },
    {
      path: '/comprimir-pdf',
      label: 'Comprimir PDF',
      description: 'Outra operação — rasteriza; não substitui OCR',
    },
  ],
};

export const protegerPdfSeoContent: ToolSeoBlock = {
  toolName: 'Proteger PDF',
  lead: 'howto',
  schemaDescription:
    'Senha de abertura no cliente. Esqueceu a senha: não há recuperação.',
  howToTitle: 'Definir senha e baixar a cópia cifrada',
  howToIntro:
    'Quem abrir o arquivo no leitor vai precisar da senha. Print screen e copiar arquivo ainda existem — não é cofre corporativo.',
  steps: [
    {
      title: 'PDF ainda sem senha',
      description:
        'Se já estiver protegido, desbloqueie com a senha atual antes de aplicar outra.',
    },
    {
      title: 'Senha e confirmação',
      description:
        'Mínimo prático de 4 caracteres; prefira senha longa. User e owner usam a mesma string nesta UI.',
    },
    {
      title: 'Baixe e anote a senha',
      description:
        'Não recuperamos senha esquecida. A cópia cifrada é o download; o original no disco não muda sozinho.',
    },
  ],
  limitsTitle: 'O que a senha de abertura não impede',
  limitsIntro: `Até ${MAX_FILE_MB} MB. Senha pede o arquivo ao abrir. Não impede captura de tela nem “encaminhar o PDF” para quem já tem a senha.`,
  limits: [
    { label: 'Tamanho', text: `Até ${MAX_FILE_MB} MB.` },
    {
      label: 'Esqueci a senha',
      text: 'Não há recuperação neste site.',
    },
    {
      label: 'Já protegido',
      text: 'Desbloqueie antes de aplicar uma senha nova.',
    },
  ],
  faqTitle: 'Senha de abertura',
  faqs: [
    {
      question: 'E se eu esquecer a senha?',
      answer:
        'O arquivo fica inacessível por aqui. Use um gerenciador de senhas.',
    },
    {
      question: 'A senha sobe para a internet?',
      answer:
        'Não. A cifra roda no navegador.',
    },
    {
      question: 'Isso impede tudo?',
      answer:
        'Não. Impede abrir sem a senha no leitor. Não é DRM contra print ou compartilhamento da senha.',
    },
  ],
  relatedTitle: 'Ciclo da senha',
  related: [
    {
      path: '/desbloquear-pdf',
      label: 'Desbloquear PDF',
      description: 'Cópia aberta — só com a senha correta',
    },
    {
      path: '/marca-dagua',
      label: "Marca d'água",
      description: 'Marcação visual, sem cifrar',
    },
  ],
};

export const removerPaginasSeoContent: ToolSeoBlock = {
  toolName: 'Remover páginas',
  lead: 'howto',
  schemaDescription:
    'Marcar miniaturas e baixar um PDF novo. Original no disco intacto. Pelo menos uma página resta.',
  howToTitle: 'Marcar miniaturas e gerar a cópia',
  howToIntro:
    'Clique na lixeira da folha. Clique de novo para desmarcar. Não dá para deixar zero páginas.',
  steps: [
    {
      title: 'Carregue o PDF',
      description:
        'Miniaturas com pdf.js. Arquivos longos no celular pesam RAM.',
    },
    {
      title: 'Marque o que sai',
      description: 'Folhas em vermelho saem da cópia.',
    },
    {
      title: 'Gere o novo PDF',
      description:
        'pdf-lib copia o que restou. O arquivo de origem no disco não é apagado.',
    },
  ],
  limitsTitle: 'Mínimo de uma página e teto de arquivo',
  limitsIntro: `Até ${MAX_FILE_MB} MB. Thumbs de PDFs enormes podem falhar no telefone.`,
  limits: [
    { label: 'Tamanho', text: `Até ${MAX_FILE_MB} MB.` },
    {
      label: 'Mínimo',
      text: 'O PDF final precisa de ao menos uma página.',
    },
    {
      label: 'Senha',
      text: 'Desbloqueie antes se houver senha de abertura.',
    },
  ],
  faqTitle: 'Excluir folhas',
  faqs: [
    {
      question: 'O original no disco muda?',
      answer: 'Não. Só a cópia baixada vem sem as páginas marcadas.',
    },
    {
      question: 'Posso apagar todas?',
      answer: 'Não. Desmarque pelo menos uma miniatura.',
    },
    {
      question: 'Qual a diferença para Dividir PDF?',
      answer:
        'Dividir pede intervalo numérico e gera um recorte. Aqui você vê thumbs e tira folhas do meio.',
    },
  ],
  relatedTitle: 'Recortar de outro jeito',
  related: [
    {
      path: '/dividir-pdf',
      label: 'Dividir PDF',
      description: 'Intervalo 1, 3-5 em vez de miniaturas',
    },
    {
      path: '/juntar-pdf',
      label: 'Juntar PDF',
      description: 'Reunir depois de limpar',
    },
  ],
};

export const desbloquearPdfSeoContent: ToolSeoBlock = {
  toolName: 'Desbloquear PDF',
  lead: 'overview',
  schemaDescription:
    'Remove senha de abertura se você já a conhece. Não quebra senha.',
  overviewTitle: 'Só com a senha que você já tem',
  overview: [
    'Não há força bruta, recuperação nem “PDF unlocker” mágico. Senha errada: o site avisa e não gera download.',
    'A cópia baixada fica aberta — trate-a como qualquer PDF sem senha.',
  ],
  howToTitle: 'PDF + senha correta → cópia aberta',
  steps: [
    {
      title: 'Selecione o arquivo protegido',
      description: `Até ${MAX_FILE_MB} MB.`,
    },
    {
      title: 'Digite a senha',
      description: 'Maiúsculas e espaços contam. Sem chute de combinações.',
    },
    {
      title: 'Baixe a cópia sem proteção',
      description: 'O original protegido permanece onde estava.',
    },
  ],
  limitsTitle: 'Fora de escopo: senha esquecida',
  limitsIntro: 'Não crackeamos PDF. DRM exótico pode falhar mesmo com senha.',
  limits: [
    { label: 'Tamanho', text: `Até ${MAX_FILE_MB} MB.` },
    {
      label: 'Esqueci a senha',
      text: 'Não há o que fazer nesta página.',
    },
  ],
  faqTitle: 'Desbloquear — o que esta tela faz',
  faqs: [
    {
      question: 'Vocês recuperam senha esquecida?',
      answer: 'Não.',
    },
    {
      question: 'O que acontece se a senha estiver errada?',
      answer:
        'Aviso na tela, sem download. Confira maiúsculas e tente de novo.',
    },
    {
      question: 'O PDF final abre em qualquer leitor?',
      answer:
        'A cópia sem senha de abertura deve abrir nos leitores comuns. Visual costuma se manter; em alguns fluxos o texto pode deixar de ser selecionável.',
    },
  ],
  relatedTitle: 'Voltar a proteger',
  related: [
    {
      path: '/proteger-pdf',
      label: 'Proteger PDF',
      description: 'Aplicar senha de novo',
    },
    {
      path: '/juntar-pdf',
      label: 'Juntar PDF',
      description: 'Unir depois de abrir o arquivo',
    },
  ],
};

export const comprimirPdfSeoContent: ToolSeoBlock = {
  toolName: 'Comprimir PDF',
  lead: 'overview',
  schemaDescription: `Rasteriza páginas em JPEG. Até ${MAX_FILE_MB} MB e ${MAX_COMPRESS_PAGES} páginas. Texto em geral deixa de ser selecionável.`,
  overviewTitle: 'Reduzir tamanho = página vira imagem',
  overview: [
    'Cada página é desenhada em canvas e gravada como JPEG no PDF novo. Útil em scan pesado. Texto pesquisável some. Vetores viram bitmap.',
    'PDF já leve pode encolher pouco — a UI mostra o tamanho real, não uma promessa de “90% menor”.',
  ],
  howToTitle: 'Escolher o nível e comparar megabytes',
  steps: [
    {
      title: 'Selecione o PDF',
      description: `Até ${MAX_FILE_MB} MB e ${MAX_COMPRESS_PAGES} páginas.`,
    },
    {
      title: 'Baixa, média ou alta',
      description:
        'Alta = menor arquivo e mais perda visual. Todos os níveis rasterizam.',
    },
    {
      title: 'Compare e baixe',
      description:
        'Veja MB original vs. final. O original no disco não é sobrescrito.',
    },
  ],
  ...buildSeoLimitsBlock('compress', {
    title: 'Compressão: teto e trade-off',
  }),
  faqTitle: 'Qualidade e texto selecionável',
  faqs: [
    {
      question: 'Vou perder o texto selecionável?',
      answer:
        'Em geral sim: as páginas viram JPEG. Se precisar pesquisar texto, não use esta compressão.',
    },
    {
      question: 'Qual o limite de páginas?',
      answer: `Até ${MAX_COMPRESS_PAGES} páginas e ${MAX_FILE_MB} MB. É a operação mais pesada da suíte.`,
    },
    {
      question: 'E se o PDF já for leve?',
      answer:
        'Pode quase não encolher. A tela mostra o resultado; não há “modo mágico”.',
    },
  ],
  relatedTitle: 'Se ainda estiver grande',
  related: [
    {
      path: '/dividir-pdf',
      label: 'Dividir PDF',
      description: 'Comprimir só o trecho que vai no e-mail',
    },
    {
      path: '/remover-paginas',
      label: 'Remover páginas',
      description: 'Menos folhas antes de rasterizar',
    },
  ],
};
