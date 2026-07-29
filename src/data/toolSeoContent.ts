/**
 * Conteúdo semântico (H2/H3/P) para SEO de conteúdo nas páginas de ferramentas.
 * O Google precisa de texto legível — não só botões e UI.
 */

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
  /**
   * Nome da ferramenta para schema WebApplication / breadcrumb
   * (ex.: "Juntar PDF").
   */
  toolName?: string;
  /**
   * Parágrafos de visão geral (abaixo da UI, antes do passo a passo).
   * Preferir 2–4 blocos para profundidade SEO sem wall of text.
   */
  overview?: string[];
  /** Para quem é a ferramenta */
  audienceTitle?: string;
  audience?: string;
  /** Casos de uso práticos */
  useCasesTitle?: string;
  useCases?: SeoUseCase[];
  /** H2 principal do bloco (passo a passo) */
  howToTitle: string;
  /** Intro opcional sob o H2 */
  howToIntro?: string;
  steps: SeoStep[];
  /** H3 benefícios */
  benefitsTitle: string;
  benefitsIntro?: string;
  benefits: SeoBenefit[];
  /** Limites técnicos honestos */
  limitsTitle?: string;
  limitsIntro?: string;
  /** Itens curtos de limite (rótulo + valor/texto) */
  limits?: { label: string; text: string }[];
  /** H3 FAQ textual (além do accordion, se houver) */
  faqTitle: string;
  faqs: SeoFaq[];
  /** Links internos para tools/posts relacionados */
  relatedTitle?: string;
  related?: SeoRelatedLink[];
  /**
   * Descrição curta para schema WebApplication
   * (fallback: howToIntro).
   */
  schemaDescription?: string;
};

/** Home — bloco de conteúdo SEO abaixo do hero/grid */
export const homeSeoContent: ToolSeoBlock = {
  howToTitle: 'Como editar e converter PDFs de forma segura',
  howToIntro:
    'O Easy PDF Local reúne as principais ferramentas de PDF em um só lugar, com um fluxo simples e sem cadastro. Todo o trabalho acontece no seu navegador.',
  steps: [
    {
      title: 'Escolha a ferramenta',
      description:
        'Na página inicial, selecione Juntar, Dividir, Girar, Proteger, Comprimir, Remover páginas, Marca d\'água, Desenhar, Word/Imagem para PDF ou OCR — de acordo com a sua necessidade.',
    },
    {
      title: 'Adicione seus arquivos no dispositivo',
      description:
        'Arraste ou selecione PDFs, imagens ou DOCX. Os arquivos ficam apenas na memória do navegador; nada é enviado para servidores da Easy PDF Local.',
    },
    {
      title: 'Processe localmente e baixe o resultado',
      description:
        'O processamento roda com JavaScript e WebAssembly no seu CPU. Ao terminar, o download parte direto do seu dispositivo — sem fila na nuvem.',
    },
  ],
  benefitsTitle: 'Por que usar o Easy PDF Local?',
  benefitsIntro:
    'Diferente de conversores que pedem upload, aqui a privacidade é o produto: seus documentos confidenciais não trafegam pela internet.',
  benefits: [
    {
      title: 'Processamento 100% client-side',
      description:
        'Usamos bibliotecas no navegador (pdf-lib, jsPDF, Tesseract.js e outras). O merge, a divisão, a rotação e as conversões acontecem no seu aparelho, não em um data center.',
    },
    {
      title: 'Sem upload = sem risco de vazamento no servidor',
      description:
        'Se o arquivo não sobe para a nuvem, não há cópia nossa para vazar, indexar ou reter. Ideal para contratos, exames, documentos pessoais e material de trabalho.',
    },
    {
      title: 'Grátis, sem conta e sem instalação',
      description:
        'Abra o site, use a ferramenta e feche a aba. Não pedimos e-mail, cartão nem app nativo — funciona em desktop e mobile modernos.',
    },
    {
      title: 'Resultado na hora',
      description:
        'Sem filas de servidor: a velocidade depende do seu hardware e do tamanho do arquivo, não da carga de um serviço remoto.',
    },
  ],
  faqTitle: 'Perguntas rápidas sobre privacidade e uso',
  faqs: [
    {
      question: 'Meus arquivos são enviados para a internet?',
      answer:
        'Não. Os documentos selecionados permanecem no seu navegador. Apenas a página (HTML/JS) e, em alguns casos, assets públicos (como modelos de OCR na primeira carga) usam a rede — nunca o conteúdo do seu PDF ou imagem.',
    },
    {
      question: 'Posso usar offline?',
      answer:
        'Depois que a página e as bibliotecas forem carregadas, o processamento em si não depende de enviar seus arquivos. Para a primeira visita (e OCR na primeira vez), é preciso internet para baixar o site e o modelo de idioma. Em seguida, a manipulação dos arquivos é local.',
    },
    {
      question: 'É realmente grátis?',
      answer:
        'Sim. As ferramentas principais são gratuitas e sem cadastro. Anúncios podem ajudar a manter o serviço no ar sem cobrar do usuário final.',
    },
  ],
};

/** /juntar-pdf — conteúdo SEO expandido (tool top) */
export const juntarPdfSeoContent: ToolSeoBlock = {
  toolName: 'Juntar PDF',
  schemaDescription:
    'Junte vários PDFs grátis no navegador, sem upload e sem cadastro. Merge local com pdf-lib no seu dispositivo.',
  overview: [
    'Juntar PDF (também chamado de unir ou mesclar PDFs) é a operação de combinar dois ou mais arquivos em um único documento, na ordem que você definir. No Easy PDF Local isso acontece 100% no navegador: você seleciona os PDFs no computador ou no celular, reordena a fila se precisar e gera o arquivo unificado sem enviar nada para um servidor nosso.',
    'A maioria dos sites “juntar PDF online” pede upload. O arquivo sobe, é processado na nuvem e volta no download. Funciona, mas contratos, laudos, material de estudo e documentos pessoais passam por um ambiente que você não controla. Aqui o modelo é o inverso: a ferramenta roda no seu dispositivo; o diferencial é privacidade e simplicidade — grátis e sem cadastro.',
    'O merge usa pdf-lib em JavaScript (com Web Worker quando disponível, e fallback na thread principal). As páginas originais são copiadas para o PDF final: não é uma reimpressão por imagem, então a qualidade de texto e vetores em geral se mantém. Depois você confere a pré-visualização e baixa quando quiser.',
  ],
  audienceTitle: 'Para quem serve juntar PDF sem upload',
  audience:
    'Profissionais que montam propostas com anexos; estudantes que unem capítulos e listas; quem recebe vários PDFs no WhatsApp e precisa de um só arquivo; suporte e administrativo que consolidam comprovantes. Também quem lida com LGPD ou política interna de não enviar documentos a conversores de terceiros.',
  useCasesTitle: 'Casos de uso práticos',
  useCases: [
    {
      title: 'Proposta + anexos técnicos',
      description:
        'Una a apresentação, o escopo e os apêndices em um único PDF na ordem certa antes de enviar ao cliente.',
    },
    {
      title: 'Material de estudo',
      description:
        'Junte slides, resumos e exercícios em um arquivo para revisar offline no tablet ou no celular.',
    },
    {
      title: 'Comprovantes e formulários',
      description:
        'Reúna boletos, RG digitalizado e formulários preenchidos em um pacote único para protocolo.',
    },
    {
      title: 'No celular, sem instalar app',
      description:
        'Abra a página no navegador, selecione os PDFs da pasta Downloads e baixe o resultado — sem conta e sem app extra.',
    },
  ],
  howToTitle: 'Como juntar PDFs no navegador (passo a passo)',
  howToIntro:
    'O fluxo fica no topo da página. Em poucos passos você une os arquivos localmente, sem cadastro e sem upload para a nuvem da ferramenta.',
  steps: [
    {
      title: 'Adicione 2 ou mais PDFs',
      description:
        'Arraste os arquivos ou clique para escolher no dispositivo. Só PDF; a validação de tipo e tamanho roda no navegador.',
    },
    {
      title: 'Reordene a lista',
      description:
        'Use subir/descer para definir a sequência das páginas no arquivo final. O primeiro da fila será o início do PDF unido.',
    },
    {
      title: 'Clique em juntar',
      description:
        'O merge roda no seu aparelho (Worker quando possível). Acompanhe o progresso na barra; em arquivos grandes pode demorar conforme a CPU e a RAM.',
    },
    {
      title: 'Pré-visualize e baixe',
      description:
        'Confira o resultado no modal e salve o PDF no dispositivo. O original de cada arquivo permanece onde estava — você só cria uma cópia unificada.',
    },
  ],
  benefitsTitle: 'Por que juntar PDF aqui (sem upload e sem cadastro)',
  benefitsIntro:
    'Unir PDFs “online” não precisa significar entregar o documento a um data center. O valor está no processamento local e no fluxo sem atrito.',
  benefits: [
    {
      title: 'Seu arquivo não sobe para processar',
      description:
        'Os PDFs ficam na memória do navegador durante o merge. Não há armazenamento do conteúdo em servidor nosso para “juntar na nuvem”.',
    },
    {
      title: 'Controle total da ordem',
      description:
        'A fila editável evita o erro clássico de anexo na ordem errada — comum quando se unem arquivos às pressas.',
    },
    {
      title: 'Grátis, no navegador, sem conta',
      description:
        'Sem e-mail obrigatório, sem trial e sem instalar suíte desktop só para um merge pontual.',
    },
    {
      title: 'Qualidade das páginas preservada no merge',
      description:
        'Ao copiar páginas com pdf-lib, o fluxo não rasteriza o documento só por unir — diferente da compressão por imagem desta suíte.',
    },
  ],
  limitsTitle: 'Limites técnicos (para o navegador não travar)',
  limitsIntro:
    'Como tudo roda no seu aparelho, há tetos de segurança — não são “cota de plano pago”, e sim proteção de memória (sobretudo no celular).',
  limits: [
    { label: 'Por arquivo', text: 'Até cerca de 50 MB cada PDF.' },
    { label: 'Quantidade', text: 'Até 20 arquivos por operação de merge.' },
    { label: 'Total da fila', text: 'Até cerca de 80 MB somados.' },
    {
      label: 'Se passar do limite',
      text: 'Junte em lotes menores ou comprima scans pesados antes. Em PCs fracos, prefira menos arquivos por vez.',
    },
  ],
  faqTitle: 'Perguntas frequentes sobre juntar PDF',
  faqs: [
    {
      question: 'Juntar PDF online aqui envia meu arquivo para a nuvem?',
      answer:
        'Não para processar o merge. Os PDFs permanecem no navegador; o algoritmo de união roda no dispositivo e o download parte dali. A rede só é usada para carregar a página e os scripts da ferramenta.',
    },
    {
      question: 'Preciso me cadastrar ou pagar?',
      answer:
        'Não. A ferramenta é grátis e sem cadastro. Pode haver anúncios no site para manter o serviço; o uso do merge em si não exige conta.',
    },
    {
      question: 'Quantos PDFs posso unir de uma vez?',
      answer:
        'Até 20 arquivos, com cerca de 50 MB cada e 80 MB no total da fila. São limites técnicos do cliente, não de “plano”.',
    },
    {
      question: 'A qualidade cai ao juntar?',
      answer:
        'No merge com pdf-lib as páginas são copiadas; não há recompressão obrigatória só por unir. Texto e imagens embutidas tendem a se manter como no original.',
    },
    {
      question: 'Funciona no celular?',
      answer:
        'Sim, no navegador do telefone. Em aparelhos com pouca RAM, use menos arquivos ou tamanhos menores por operação.',
    },
    {
      question: 'E se um PDF tiver senha?',
      answer:
        'Arquivos protegidos costumam precisar ser desbloqueados antes (com a senha correta) na ferramenta Desbloquear PDF; depois você junta as cópias liberadas.',
    },
  ],
  relatedTitle: 'Próximos passos e guias',
  related: [
    {
      path: '/comprimir-pdf',
      label: 'Comprimir PDF',
      description: 'Reduzir tamanho após unir scans pesados',
    },
    {
      path: '/dividir-pdf',
      label: 'Dividir PDF',
      description: 'Extrair só as páginas que importam',
    },
    {
      path: '/blog/juntar-pdf-online-sem-upload',
      label: 'Guia: juntar PDF sem upload',
      description: 'Artigo completo no blog',
    },
    {
      path: '/pdf-sem-upload',
      label: 'PDF sem upload',
      description: 'Como funciona o modelo local',
    },
  ],
};

/** /dividir-pdf */
export const dividirPdfSeoContent: ToolSeoBlock = {
  howToTitle: 'Como dividir um PDF de forma segura',
  howToIntro:
    'Com a ferramenta Dividir PDF do Easy PDF Local você extrai páginas ou intervalos de um documento e gera um novo arquivo — tudo no navegador, sem upload para a nuvem.',
  steps: [
    {
      title: 'Selecione o PDF no seu dispositivo',
      description:
        'Arraste o arquivo para a área de envio ou clique para escolher. O PDF fica apenas na memória do navegador; a contagem de páginas é lida localmente com pdf-lib.',
    },
    {
      title: 'Informe as páginas ou o intervalo',
      description:
        'Digite páginas avulsas ou intervalos (ex.: 1-3, 5, 8-10). A extração usa só o que você pediu — o restante do documento original não é alterado no seu disco até você baixar o resultado.',
    },
    {
      title: 'Extraia e baixe o novo PDF',
      description:
        'Clique para processar. A divisão roda 100% no cliente; o PDF gerado é baixado automaticamente no seu aparelho, sem passar por servidores da Easy PDF Local.',
    },
  ],
  benefitsTitle: 'Benefícios de dividir PDF no navegador (sem upload)',
  benefitsIntro:
    'Extrair páginas “online” em sites tradicionais costuma enviar o arquivo inteiro para um servidor. Aqui o recorte acontece no seu dispositivo.',
  benefits: [
    {
      title: 'Processamento client-side com pdf-lib',
      description:
        'A leitura do número de páginas e a montagem do PDF parcial usam JavaScript no navegador. Não há fila de servidor nem cópia temporária dos seus documentos conosco.',
    },
    {
      title: 'Privacidade para contratos e laudos',
      description:
        'Ideal quando você precisa enviar só um anexo (páginas específicas) sem expor o dossiê completo a um conversor na nuvem.',
    },
    {
      title: 'Controle fino do intervalo',
      description:
        'Escolha páginas isoladas ou faixas contínuas. O resultado é um PDF novo só com o trecho solicitado, pronto para compartilhar ou arquivar.',
    },
    {
      title: 'Grátis e sem cadastro',
      description:
        'Use a divisão quantas vezes precisar, sem criar conta e sem instalar programa. A velocidade depende do seu hardware e do tamanho do arquivo.',
    },
  ],
  faqTitle: 'FAQ: dividir PDF com segurança',
  faqs: [
    {
      question: 'Meus arquivos são enviados para a internet?',
      answer:
        'Não. O PDF selecionado permanece na memória do navegador. A extração de páginas e a geração do arquivo final ocorrem localmente; nossos servidores não recebem o conteúdo do documento.',
    },
    {
      question: 'Posso usar offline?',
      answer:
        'Após carregar o site (e as bibliotecas JS), a divisão em si não envia o PDF pela rede. Você precisa de internet na primeira carga da página; o processamento do arquivo é local.',
    },
    {
      question: 'O PDF original é apagado ou modificado?',
      answer:
        'Não. A ferramenta gera um arquivo novo com as páginas escolhidas. O PDF original no seu disco só muda se você o substituir manualmente ao salvar o download.',
    },
    {
      question: 'Qual o formato do intervalo de páginas?',
      answer:
        'Em geral você pode combinar números e faixas, por exemplo 1-3, 5, 8-10. A validação ocorre no navegador antes de extrair; páginas inválidas ou fora do total geram aviso sem enviar dados a um servidor.',
    },
  ],
};

/** /girar-pdf */
export const girarPdfSeoContent: ToolSeoBlock = {
  howToTitle: 'Como girar páginas de um PDF com segurança',
  howToIntro:
    'Com a ferramenta Girar PDF do Easy PDF Local você corrige a orientação de páginas (90° à esquerda ou à direita), no documento inteiro ou só em um intervalo — sem upload.',
  steps: [
    {
      title: 'Abra o PDF no navegador',
      description:
        'Selecione o arquivo no computador ou celular. A contagem de páginas e o estado de rotação ficam só na sessão local do navegador.',
    },
    {
      title: 'Escolha todas as páginas ou um intervalo',
      description:
        'Gire o documento completo ou informe páginas específicas (ex.: 2, 4-6). Ajuste 90° à esquerda ou à direita até a orientação ficar correta.',
    },
    {
      title: 'Salve o PDF rotacionado',
      description:
        'Ao confirmar, o pdf-lib aplica a rotação localmente e inicia o download. Nada do arquivo trafega para a nuvem da Easy PDF Local.',
    },
  ],
  benefitsTitle: 'Benefícios de girar PDF localmente (client-side)',
  benefitsIntro:
    'Scans de celular e documentos digitalizados costumam vir de lado. Corrigir a rotação sem enviar o PDF a um site de terceiros protege dados sensíveis.',
  benefits: [
    {
      title: 'Rotação sem recompactar o conteúdo',
      description:
        'No PDF, a orientação é metadado de página. Em geral não há reprocessamento destrutivo de imagens: o conteúdo vetorial e as imagens embutidas permanecem intactos.',
    },
    {
      title: 'Zero upload = privacidade total',
      description:
        'O processamento roda no seu CPU via JavaScript. Ideal para exames, contratos e documentos de identidade digitalizados na orientação errada.',
    },
    {
      title: 'Páginas específicas ou o arquivo inteiro',
      description:
        'Corrija só a folha 3 de um relatório de 20 páginas, ou gire tudo de uma vez — flexibilidade sem instalar Adobe Reader ou app desktop.',
    },
    {
      title: 'Grátis, rápido e sem conta',
      description:
        'Sem fila de servidor: o tempo depende do tamanho do PDF e do aparelho. Não pedimos login nem cartão.',
    },
  ],
  faqTitle: 'FAQ: girar PDF com segurança',
  faqs: [
    {
      question: 'Meus arquivos são enviados para a internet?',
      answer:
        'Não. O PDF fica na memória do navegador. A rotação e o download do arquivo corrigido acontecem no seu dispositivo, sem envio do conteúdo para nossos servidores.',
    },
    {
      question: 'Posso usar offline?',
      answer:
        'Sim, no sentido de que a rotação não faz upload. Carregue a página uma vez com internet; depois o ajuste de orientação e o save são locais.',
    },
    {
      question: 'Girar o PDF reduz a qualidade?',
      answer:
        'Em condições normais, não. A rotação de página no PDF não é o mesmo que “girar e reexportar como imagem”. O conteúdo original é preservado com o novo ângulo de visualização.',
    },
    {
      question: 'Consigo girar só uma página?',
      answer:
        'Sim. Use o campo de intervalo com o número da página (ou faixas) e aplique a rotação apenas a esse subconjunto antes de salvar o PDF completo.',
    },
  ],
};

/** /marca-dagua */
export const marcaDaguaSeoContent: ToolSeoBlock = {
  howToTitle: "Como adicionar marca d'água em PDF de forma segura",
  howToIntro:
    "Com a ferramenta Marca d'água do Easy PDF Local você aplica texto (ex.: CONFIDENCIAL, RASCUNHO ou seu nome) em todas as páginas, com opacidade e estilo — 100% no navegador.",
  steps: [
    {
      title: 'Selecione o PDF',
      description:
        'Envie o arquivo pela área de seleção local. O documento não sobe para a nuvem: só a aba do navegador tem acesso ao conteúdo durante o processo.',
    },
    {
      title: "Configure o texto da marca d'água",
      description:
        'Digite o texto, ajuste opacidade, tamanho e estilo conforme as opções da tela. A pré-visualização e a aplicação usam processamento no cliente.',
    },
    {
      title: "Aplique e baixe o PDF com marca d'água",
      description:
        "Clique para gravar. O pdf-lib desenha o texto nas páginas localmente e o download do arquivo marcado inicia no seu dispositivo.",
    },
  ],
  benefitsTitle: "Benefícios de marca d'água local (sem upload)",
  benefitsIntro:
    "Proteger rascunhos e cópias de revisão com marca d'água não deveria exigir enviar o PDF a um servidor de terceiros.",
  benefits: [
    {
      title: 'Processamento client-side com privacidade',
      description:
        "A aplicação da marca d'água ocorre via JavaScript no navegador. Contratos, propostas e materiais internos não ficam armazenados em servidores nossos.",
    },
    {
      title: 'Identifique cópias e reduza uso indevido',
      description:
        "Textos como CONFIDENCIAL, CÓPIA ou o e-mail do destinatário deixam claro que o arquivo é controlado — útil em compartilhamentos por e-mail ou drive.",
    },
    {
      title: 'Opacidade e estilo sob seu controle',
      description:
        'Equilibre legibilidade do documento e visibilidade da marca. Ajustes finos sem instalar software de edição profissional.',
    },
    {
      title: 'Grátis e sem cadastro',
      description:
        "Use quantas vezes precisar no fluxo de trabalho. Sem plano pago obrigatório para a marca d'água básica de texto.",
    },
  ],
  faqTitle: "FAQ: marca d'água em PDF com segurança",
  faqs: [
    {
      question: 'Meus arquivos são enviados para a internet?',
      answer:
        "Não. O PDF e o texto da marca d'água são processados na memória do navegador. O arquivo final baixado não transitou por um backend que armazene o documento.",
    },
    {
      question: 'Posso usar offline?',
      answer:
        'Depois de carregar a aplicação no navegador, a aplicação da marca não depende de upload. Internet é necessária sobretudo para abrir o site na primeira vez.',
    },
    {
      question: "A marca d'água vai em todas as páginas?",
      answer:
        'Sim — a ferramenta aplica o texto configurado em todas as páginas do PDF selecionado, de forma uniforme, conforme as opções definidas na interface.',
    },
    {
      question: "Consigo remover a marca d'água depois?",
      answer:
        "A marca d'água de texto é incorporada ao PDF gerado. Para um original limpo, guarde o arquivo sem marca; não há “desfazer na nuvem” porque não guardamos o seu PDF.",
    },
  ],
};

/** /desenhar-pdf */
export const desenharPdfSeoContent: ToolSeoBlock = {
  howToTitle: 'Como desenhar ou assinar um PDF de forma segura',
  howToIntro:
    'Com a ferramenta Desenhar no PDF do Easy PDF Local você rabisca, destaca ou assina à mão livre na primeira página — mouse ou toque — sem enviar o arquivo para a nuvem.',
  steps: [
    {
      title: 'Carregue o PDF localmente',
      description:
        'Selecione o arquivo no dispositivo. A pré-visualização da página usa pdf.js no navegador; o conteúdo não é transmitido para nossos servidores.',
    },
    {
      title: 'Desenhe com o dedo ou o mouse',
      description:
        'Escolha cor e espessura do pincel e desenhe sobre a página 1. Ideal para assinaturas simples, circulados ou anotações rápidas.',
    },
    {
      title: 'Exporte o PDF com o desenho',
      description:
        'Ao salvar, o traço é mesclado ao PDF via pdf-lib no cliente e o download começa no seu aparelho — processamento 100% local.',
    },
  ],
  benefitsTitle: 'Benefícios de assinar/desenhar PDF no navegador',
  benefitsIntro:
    'Assinatura e anotações “online” em muitos sites implicam upload. Aqui o canvas e a exportação rodam só no seu dispositivo.',
  benefits: [
    {
      title: 'pdf.js + pdf-lib 100% no cliente',
      description:
        'Visualização e gravação do desenho acontecem no navegador (JavaScript). Não há storage remoto do seu PDF assinado ou anotado.',
    },
    {
      title: 'Funciona com mouse e toque',
      description:
        'Use no desktop ou no celular para uma assinatura rápida em contratos e formulários, sem instalar app de assinatura.',
    },
    {
      title: 'Privacidade em documentos sensíveis',
      description:
        'Propostas, autorizações e papéis pessoais permanecem no aparelho durante todo o fluxo de desenho e exportação.',
    },
    {
      title: 'Grátis e sem conta',
      description:
        'Sem cadastro para rabiscar e baixar. Perfeito para uso pontual quando você só precisa assinar uma folha.',
    },
  ],
  faqTitle: 'FAQ: desenhar no PDF com segurança',
  faqs: [
    {
      question: 'Meus arquivos são enviados para a internet?',
      answer:
        'Não. O PDF e os traços ficam na sessão do navegador. A exportação mescla o desenho localmente; o servidor da Easy PDF Local não recebe o documento.',
    },
    {
      question: 'Posso usar offline?',
      answer:
        'Após carregar a página e as bibliotecas, desenhar e exportar não exigem upload do PDF. A primeira visita ao site precisa de conexão para baixar o app web.',
    },
    {
      question: 'Em qual página posso desenhar?',
      answer:
        'A ferramenta foca na primeira página do PDF (página 1), ideal para capas de assinatura e formulários de uma folha. Planeje o arquivo com a página alvo na frente se necessário.',
    },
    {
      question: 'A assinatura é juridicamente válida?',
      answer:
        'Trata-se de uma assinatura manuscrita digitalizada no PDF, útil no dia a dia. Validade legal depende da legislação e do contexto do documento — a ferramenta não emite certificado ICP-Brasil nem e-sign qualificado.',
    },
  ],
};

/** /word-para-pdf — conteúdo SEO expandido (tool top) */
export const wordParaPdfSeoContent: ToolSeoBlock = {
  toolName: 'Word para PDF',
  schemaDescription:
    'Converta Word (DOCX) para PDF grátis no navegador, sem instalar programa e sem upload. Conversão local e sem cadastro.',
  overview: [
    'Converter Word para PDF é o caminho usual quando você precisa enviar um documento com layout mais estável: currículo, trabalho acadêmico, ofício, proposta ou relatório. O PDF reduz surpresas de fonte e formatação entre Windows, Mac e celular.',
    'No Easy PDF Local a conversão de DOCX para PDF roda no navegador. O arquivo não é enviado a um servidor nosso de conversão: a leitura do DOCX e a geração do PDF acontecem no seu dispositivo. É grátis, sem cadastro e sem instalar Microsoft Word no computador atual.',
    'O fluxo prático usa bibliotecas client-side (leitura do DOCX e montagem do PDF). Documentos de texto do dia a dia costumam sair bem. Layouts muito complexos, campos avançados ou diagramação editorial podem divergir do Word desktop — por isso a recomendação é sempre revisar o PDF antes de prazos críticos.',
  ],
  audienceTitle: 'Para quem converter Word para PDF no navegador',
  audience:
    'Estudantes sem suíte Office no PC da biblioteca; candidatos enviando currículo; profissionais que precisam de PDF somente leitura; quem está no celular com um DOCX baixado do e-mail e precisa anexar em PDF; quem não quer subir textos sensíveis a conversores com upload.',
  useCasesTitle: 'Casos de uso práticos',
  useCases: [
    {
      title: 'Currículo e carta de apresentação',
      description:
        'Gere PDF a partir do DOCX para portais de emprego e e-mail, sem instalar Word no PC emprestado.',
    },
    {
      title: 'Trabalho da faculdade',
      description:
        'Exporte o texto final em PDF para o prazo do professor, revisando quebras de página antes de enviar.',
    },
    {
      title: 'Documentos internos e checklists',
      description:
        'Transforme procedimentos em PDF para distribuição somente leitura na equipe.',
    },
    {
      title: 'Privacidade de dados pessoais',
      description:
        'Textos com CPF, endereço ou cláusulas contratuais não precisam atravessar a internet só para mudar de extensão.',
    },
  ],
  howToTitle: 'Como converter Word (DOCX) para PDF sem instalar',
  howToIntro:
    'Ferramenta no topo da página: selecione o DOCX, converta no navegador e baixe o PDF. Sem conta e sem upload de processamento.',
  steps: [
    {
      title: 'Selecione o arquivo DOCX',
      description:
        'Escolha o .docx no dispositivo. O foco é DOCX (Office Open XML); .doc legado pode precisar ser salvo como DOCX antes.',
    },
    {
      title: 'Inicie a conversão local',
      description:
        'O conteúdo é interpretado no cliente e montado em PDF — sem fila em servidor de conversão e sem cadastro.',
    },
    {
      title: 'Revise e baixe',
      description:
        'Abra o PDF no leitor do sistema, confira layout e imagens, e só então envie a terceiros. O DOCX original permanece no seu disco.',
    },
  ],
  benefitsTitle: 'Por que converter aqui (sem upload e sem programa)',
  benefitsIntro:
    'Conversores clássicos pedem upload do DOCX. Para currículos e textos sensíveis, o modelo local reduz exposição desnecessária.',
  benefits: [
    {
      title: 'Sem instalar suíte desktop',
      description:
        'O navegador é o runtime. Útil em máquinas gerenciadas, labs e empréstimos de notebook.',
    },
    {
      title: 'Documento não sobe para “converter na nuvem”',
      description:
        'Processamento client-side: o texto do DOCX não precisa depositar-se em API de terceiros só para virar PDF.',
    },
    {
      title: 'Grátis e sem cadastro',
      description:
        'Sem trial com cartão e sem “3 conversões por dia” amarradas a login neste fluxo.',
    },
    {
      title: 'Encaixa no restante da suíte local',
      description:
        'Depois você pode comprimir, juntar anexos ou proteger o PDF — sempre no mesmo modelo sem upload de processamento.',
    },
  ],
  limitsTitle: 'Limites e expectativas honestas',
  limitsIntro:
    'Conversão no navegador tem teto de memória e fidelidade de layout — melhor ser transparente do que prometer “pixel perfect” em qualquer DOCX.',
  limits: [
    {
      label: 'Formato',
      text: 'Foco em DOCX. Arquivos .doc antigos: salve como DOCX em outro editor antes.',
    },
    {
      label: 'Tamanho',
      text: 'Ordem de até cerca de 50 MB por arquivo (limite geral do site).',
    },
    {
      label: 'Layout',
      text: 'Textos, títulos e listas do dia a dia costumam ir bem; caixas flutuantes e artes complexas podem divergir.',
    },
    {
      label: 'Celular',
      text: 'DOCX muito pesados (muitas imagens) pedem mais RAM — em falha, tente no desktop.',
    },
  ],
  faqTitle: 'Perguntas frequentes sobre Word para PDF',
  faqs: [
    {
      question: 'Posso converter sem instalar o Microsoft Word?',
      answer:
        'Sim. A conversão roda no navegador. Você precisa do arquivo DOCX acessível no dispositivo, não da suíte instalada.',
    },
    {
      question: 'O DOCX é enviado para a nuvem?',
      answer:
        'No Easy PDF Local o processamento é client-side: não usamos o modelo “upload → servidor converte → download” para o seu documento.',
    },
    {
      question: 'Precisa de cadastro?',
      answer:
        'Não. Grátis e sem conta para usar a ferramenta nesta página.',
    },
    {
      question: 'O PDF fica idêntico ao Word?',
      answer:
        'Para o uso cotidiano, em geral fica adequado. Layouts avançados podem divergir — revise sempre antes de prazos importantes.',
    },
    {
      question: 'Aceita .doc antigo?',
      answer:
        'O fluxo é pensado para DOCX. Converta .doc para DOCX em outro programa se necessário.',
    },
    {
      question: 'E se o PDF ficar grande demais?',
      answer:
        'Use em seguida a ferramenta Comprimir PDF, ciente de que a compressão por imagem afeta a seleção de texto no arquivo gerado.',
    },
  ],
  relatedTitle: 'Próximos passos e guias',
  related: [
    {
      path: '/comprimir-pdf',
      label: 'Comprimir PDF',
      description: 'Se o portal limitar o tamanho do anexo',
    },
    {
      path: '/juntar-pdf',
      label: 'Juntar PDF',
      description: 'Unir o PDF a anexos extras',
    },
    {
      path: '/blog/word-para-pdf-online-sem-instalar',
      label: 'Guia: Word para PDF sem instalar',
      description: 'Artigo no blog',
    },
    {
      path: '/pdf-sem-upload',
      label: 'PDF sem upload',
      description: 'Privacidade e modelo local',
    },
  ],
};

/** /imagem-para-pdf */
export const imagemParaPdfSeoContent: ToolSeoBlock = {
  howToTitle: 'Como converter imagens em PDF de forma segura',
  howToIntro:
    'Com a ferramenta Imagem para PDF do Easy PDF Local você transforma JPG, PNG ou WebP em um único PDF — uma página por imagem — sem enviar fotos para a nuvem.',
  steps: [
    {
      title: 'Adicione uma ou mais imagens',
      description:
        'Arraste ou selecione JPG, PNG ou WebP. As imagens ficam na memória do navegador; você pode reordenar a lista antes de gerar o PDF.',
    },
    {
      title: 'Organize a ordem das páginas',
      description:
        'Defina a sequência das fotos ou scans. A primeira da lista será a página 1 do PDF final.',
    },
    {
      title: 'Gere e baixe o PDF',
      description:
        'A montagem do PDF roda no cliente. O arquivo é baixado no seu dispositivo — ideal para digitalizações e comprovantes sem upload.',
    },
  ],
  benefitsTitle: 'Benefícios de imagem para PDF local (sem upload)',
  benefitsIntro:
    'Juntar prints e fotos em PDF em sites com upload expõe imagens pessoais. Aqui o empacotamento é client-side.',
  benefits: [
    {
      title: 'Processamento no navegador',
      description:
        'As imagens são embutidas em PDF no seu aparelho. Não há armazenamento das fotos em servidores da Easy PDF Local.',
    },
    {
      title: 'Várias imagens, um só arquivo',
      description:
        'Perfeito para envio de documentos digitalizados, portfólios simples, recibos e conjuntos de prints em um único anexo.',
    },
    {
      title: 'Ordem personalizada',
      description:
        'Reorganize páginas antes de exportar — essencial quando o celular tira fotos fora de ordem.',
    },
    {
      title: 'Grátis, sem conta e sem app',
      description:
        'Funciona no navegador do celular ou PC. Sem instalar conversor nativo só para “juntar imagens em PDF”.',
    },
  ],
  faqTitle: 'FAQ: imagem para PDF com segurança',
  faqs: [
    {
      question: 'Meus arquivos são enviados para a internet?',
      answer:
        'Não. JPG, PNG e WebP permanecem no navegador durante a conversão. O PDF gerado é baixado localmente, sem upload do conteúdo das imagens.',
    },
    {
      question: 'Posso usar offline?',
      answer:
        'Após carregar a ferramenta, a conversão não depende de enviar as imagens pela rede. A primeira abertura do site precisa de conexão.',
    },
    {
      question: 'Quais formatos de imagem são aceitos?',
      answer:
        'Em geral JPEG/JPG, PNG e WebP. Outros formatos podem ser convertidos antes (por exemplo, HEIC → JPG no próprio celular) e então adicionados aqui.',
    },
    {
      question: 'A qualidade da imagem cai no PDF?',
      answer:
        'O fluxo prioriza embutir as imagens sem “passar por servidor”. A nitidez final depende da resolução original e de como o visualizador renderiza o PDF; evite recompactar demais as fotos na origem.',
    },
  ],
};

/** /extrair-texto (PDF nativo + OCR) */
export const extrairTextoSeoContent: ToolSeoBlock = {
  howToTitle: 'Como extrair texto de PDF de forma segura',
  howToIntro:
    'Com a ferramenta Extrair Texto do Easy PDF Local você copia texto de PDFs digitais (pdf.js) ou usa OCR (Tesseract.js, português) em PDFs escaneados — 100% no navegador, sem upload.',
  steps: [
    {
      title: 'Selecione o PDF no dispositivo',
      description:
        'Arraste ou escolha um arquivo PDF. Ele permanece na memória do navegador; nada é enviado para servidores da Easy PDF Local.',
    },
    {
      title: 'Escolha o modo: nativo ou Forçar OCR',
      description:
        'Deixe o OCR desligado para PDFs com texto selecionável (rápido, getTextContent). Ative “Forçar OCR” só em scans — cada página é renderizada em canvas e lida com Tesseract.',
    },
    {
      title: 'Extraia, revise e baixe como .txt',
      description:
        'Acompanhe “Lendo página X de Y…”, edite o resultado se preciso, copie para a área de transferência ou baixe um arquivo de texto.',
    },
  ],
  benefitsTitle: 'Benefícios da extração local (pdf.js + Tesseract)',
  benefitsIntro:
    'Extrair texto “online” em muitos sites implica upload do PDF. Aqui o fluxo é client-side: nativo para documentos digitais e OCR opcional para papel digitalizado.',
  benefits: [
    {
      title: 'Modo nativo rápido com pdf.js',
      description:
        'PDFs gerados por Word, sistemas e impressoras virtuais costumam ter camada de texto. A leitura por página com getTextContent é leve e precisa.',
    },
    {
      title: 'OCR opcional para scans',
      description:
        'Com Forçar OCR, cada página vira imagem no canvas e o Tesseract reconhece em português (por) no seu CPU — sem API de OCR na nuvem.',
    },
    {
      title: 'Privacidade total',
      description:
        'Contratos, boletos e laudos não precisam atravessar a internet só para virar texto editável. O download .txt parte do seu dispositivo.',
    },
    {
      title: 'Grátis e sem cadastro',
      description:
        'Use sob demanda. OCR é mais lento e depende da nitidez do scan; o modo nativo é o padrão recomendado sempre que o texto for selecionável.',
    },
  ],
  faqTitle: 'FAQ: extrair texto de PDF com segurança',
  faqs: [
    {
      question: 'Meus arquivos são enviados para a internet?',
      answer:
        'Não. O PDF fica no navegador. A extração nativa e o OCR rodam localmente. No OCR, só o modelo público de idioma do Tesseract pode ser baixado na primeira vez — o conteúdo do seu PDF não sobe para nossos servidores.',
    },
    {
      question: 'Posso usar offline?',
      answer:
        'Após carregar o site (e, no OCR, o modelo de idioma em cache), a extração não envia o PDF pela rede. A primeira visita e o primeiro OCR podem precisar de internet para assets da aplicação.',
    },
    {
      question: 'Quando devo ativar Forçar OCR?',
      answer:
        'Somente se o PDF for imagem de scanner/foto e o modo normal retornar vazio ou quase nada. OCR é bem mais lento e pode errar em textos tortos ou de baixa resolução.',
    },
    {
      question: 'O OCR é 100% preciso?',
      answer:
        'Não. Revise números, nomes e valores críticos. Melhore scans (nitidez, contraste, páginas retas) para resultados melhores.',
    },
  ],
};

/** /proteger-pdf */
export const protegerPdfSeoContent: ToolSeoBlock = {
  howToTitle: 'Como proteger PDF com senha com segurança',
  howToIntro:
    'Com a ferramenta Proteger PDF do Easy PDF Local você criptografa o documento com senha de abertura direto no navegador, sem enviar o arquivo para serviços de conversão na nuvem.',
  steps: [
    {
      title: 'Selecione o PDF',
      description:
        'Escolha o arquivo no seu dispositivo. O PDF deve estar sem senha prévia para que a nova proteção possa ser aplicada localmente.',
    },
    {
      title: 'Defina e confirme a senha',
      description:
        'Digite a senha desejada e repita no campo de confirmação. Use pelo menos 4 caracteres; prefira combinações mais longas e difíceis de adivinhar.',
    },
    {
      title: 'Criptografe e baixe',
      description:
        'Clique em Criptografar e Baixar. A proteção é aplicada no cliente e o download do PDF cifrado inicia no seu dispositivo.',
    },
  ],
  benefitsTitle: 'Benefícios de proteger PDF no navegador',
  benefitsIntro:
    'Proteger contratos, laudos e documentos pessoais com senha reduz o risco de leitura por terceiros — especialmente se o arquivo for anexado por e-mail ou compartilhado em pastas.',
  benefits: [
    {
      title: 'Criptografia client-side (sem upload)',
      description:
        'O PDF e a senha processam só na memória do navegador. Nossos servidores não recebem o conteúdo nem a senha escolhida.',
    },
    {
      title: 'Senha de abertura em leitores comuns',
      description:
        'O arquivo protegido pede senha ao abrir no Adobe Reader, Chrome, Preview e outros visualizadores compatíveis com PDF padrão.',
    },
    {
      title: 'Controle de permissões básicas',
      description:
        'Além da senha de usuário, o fluxo aplica restrições de edição e cópia no nível do documento (conforme o handler de segurança do PDF).',
    },
    {
      title: 'Grátis e sem cadastro',
      description:
        'Proteja sob demanda, sem trial e sem instalar software desktop. Ideal para uso pontual em computadores compartilhados.',
    },
  ],
  faqTitle: 'FAQ: proteger PDF com senha',
  faqs: [
    {
      question: 'Meus arquivos ou a senha sobem para a internet?',
      answer:
        'Não. A criptografia roda no navegador. O PDF original e a senha não são enviados aos servidores da Easy PDF Local.',
    },
    {
      question: 'E se eu esquecer a senha?',
      answer:
        'Não recuperamos senhas. Guarde-a em gerenciador de senhas ou local seguro. Sem a senha, leitores padrão não abrem o conteúdo cifrado.',
    },
    {
      question: 'Posso proteger um PDF que já tem senha?',
      answer:
        'Não neste fluxo. Remova a proteção no leitor original (com a senha atual) e salve uma cópia sem senha antes de aplicar uma nova proteção aqui.',
    },
    {
      question: 'A senha é a mesma para usuário e proprietário?',
      answer:
        'Sim. Por simplicidade, userPassword e ownerPassword usam a mesma string que você digita — abrem o documento e definem o dono no handler de segurança.',
    },
  ],
};

/** /remover-paginas */
export const removerPaginasSeoContent: ToolSeoBlock = {
  howToTitle: 'Como remover páginas de um PDF com segurança',
  howToIntro:
    'Com a ferramenta Remover Páginas do Easy PDF Local você exclui páginas indesejadas visualmente, com miniaturas, e baixa um PDF novo — sem upload para a nuvem.',
  steps: [
    {
      title: 'Envie o PDF',
      description:
        'Arraste ou selecione o arquivo. As miniaturas de cada página são geradas no navegador com pdf.js para você revisar o conteúdo.',
    },
    {
      title: 'Marque as páginas a excluir',
      description:
        'Clique no ícone de lixeira em cada miniatura que deseja remover. Páginas marcadas ficam destacadas; clique de novo para desmarcar.',
    },
    {
      title: 'Gere o novo PDF',
      description:
        'Clique em Gerar Novo PDF. O pdf-lib remove as páginas selecionadas (mantendo ao menos uma) e inicia o download do arquivo resultante.',
    },
  ],
  benefitsTitle: 'Benefícios de apagar páginas de PDF no navegador',
  benefitsIntro:
    'Remover capas em branco, anexos errados ou páginas confidenciais antes de enviar o documento é mais seguro quando o processamento não passa por servidores de terceiros.',
  benefits: [
    {
      title: 'Seleção visual com miniaturas',
      description:
        'Em vez de digitar intervalos numéricos, você vê cada página e marca exatamente o que deve sair do arquivo final.',
    },
    {
      title: 'Processamento 100% local',
      description:
        'pdf.js (miniaturas) e pdf-lib (remoção) rodam no dispositivo. O original não é sobrescrito; só o novo PDF é baixado.',
    },
    {
      title: 'Sem perder o restante do documento',
      description:
        'As páginas não marcadas permanecem na ordem original, com conteúdo e qualidade preservados (sem re-rasterizar o PDF inteiro).',
    },
    {
      title: 'Grátis e sem cadastro',
      description:
        'Use sob demanda em qualquer navegador moderno. Ideal para limpar scans e PDFs de e-mail antes de arquivar ou compartilhar.',
    },
  ],
  faqTitle: 'FAQ: remover páginas de PDF',
  faqs: [
    {
      question: 'O arquivo original é alterado no disco?',
      answer:
        'Não. Geramos um PDF novo com as páginas restantes. O original permanece onde estava no seu dispositivo.',
    },
    {
      question: 'Posso remover todas as páginas?',
      answer:
        'Não. É obrigatório manter ao menos uma página no documento final. Desmarque alguma miniatura se tiver marcado todas.',
    },
    {
      question: 'Meus arquivos são enviados para a internet?',
      answer:
        'Não. Miniaturas e remoção ocorrem na memória do navegador. Nada do conteúdo do PDF sobe para nossos servidores.',
    },
    {
      question: 'Funciona em PDF com senha?',
      answer:
        'PDFs já criptografados precisam ser abertos/desprotegidos antes. Esta ferramenta trabalha com PDFs legíveis sem senha de abertura.',
    },
  ],
};

/** /desbloquear-pdf */
export const desbloquearPdfSeoContent: ToolSeoBlock = {
  howToTitle: 'Como desbloquear PDF (remover senha) com segurança',
  howToIntro:
    'Com a ferramenta Desbloquear PDF do Easy PDF Local você remove a senha de abertura quando já a conhece — sem enviar o arquivo para servidores de conversão.',
  steps: [
    {
      title: 'Envie o PDF protegido',
      description:
        'Selecione o arquivo com senha de abertura no seu dispositivo. O processamento permanece no navegador.',
    },
    {
      title: 'Informe a senha atual',
      description:
        'Digite a senha correta do documento. Sem ela não é possível abrir nem gerar a cópia desprotegida — não há quebra de senha.',
    },
    {
      title: 'Baixe o PDF sem proteção',
      description:
        'Clique em Remover Senha e Baixar. Uma cópia sem senha de abertura é gerada localmente e o download inicia no seu dispositivo.',
    },
  ],
  benefitsTitle: 'Benefícios de remover senha de PDF no navegador',
  benefitsIntro:
    'Útil quando você precisa reenviar, arquivar ou editar um PDF que protegeu antes e ainda tem a senha em mãos — sem depender de software desktop pago.',
  benefits: [
    {
      title: 'Processamento client-side (sem upload)',
      description:
        'PDF e senha ficam na memória do navegador. Nossos servidores não recebem o conteúdo nem a senha digitada.',
    },
    {
      title: 'Complemento do Proteger PDF',
      description:
        'Fecha o ciclo de segurança da suíte: proteja com senha em /proteger-pdf e remova depois em /desbloquear-pdf, quando fizer sentido.',
    },
    {
      title: 'Aviso claro se a senha estiver errada',
      description:
        'Senhas incorretas geram mensagem amigável — você pode corrigir e tentar de novo sem recarregar a página.',
    },
    {
      title: 'Grátis e sem cadastro',
      description:
        'Desbloqueie sob demanda, sem trial e sem instalar suítes desktop. Ideal em computadores compartilhados.',
    },
  ],
  faqTitle: 'FAQ: desbloquear PDF com senha conhecida',
  faqs: [
    {
      question: 'Vocês recuperam senhas esquecidas?',
      answer:
        'Não. Só removemos a proteção quando a senha correta é informada. Guarde senhas em local seguro ou gerenciador de senhas.',
    },
    {
      question: 'Meus arquivos sobem para a internet?',
      answer:
        'Não. A validação da senha e a geração do PDF sem proteção ocorrem no navegador. O conteúdo não é enviado à Easy PDF Local.',
    },
    {
      question: 'O PDF final abre em qualquer leitor?',
      answer:
        'Sim. O download é um PDF sem senha de usuário, legível em Adobe, Chrome, Preview e outros leitores comuns.',
    },
    {
      question: 'Posso usar offline?',
      answer:
        'Depois de carregar o site, o desbloqueio não faz upload do PDF. Internet é necessária para a primeira carga da aplicação.',
    },
  ],
};

/** /comprimir-pdf — conteúdo SEO expandido (tool top) */
export const comprimirPdfSeoContent: ToolSeoBlock = {
  toolName: 'Comprimir PDF',
  schemaDescription:
    'Comprima PDF grátis no navegador, sem upload e sem app. Reduza tamanho no celular ou PC — processamento local e sem cadastro.',
  overview: [
    'Comprimir PDF significa gerar uma cópia mais leve para caber em e-mail, WhatsApp, portal de RH ou formulário com limite de megabytes. No Easy PDF Local a compressão roda no navegador — inclusive no celular, sem instalar app e sem enviar o arquivo para um servidor de compressão nosso.',
    'O método local é deliberado: cada página é renderizada (pdf.js), convertida em JPEG conforme o nível (baixa, média ou alta compressão) e remontada em um PDF novo (pdf-lib). Isso costuma reduzir muito scans e PDFs com fotos. Em troca, as páginas viram imagem: o texto em geral deixa de ser selecionável ou pesquisável no arquivo gerado.',
    'Não prometemos “mesma qualidade de gráfica com 90% menos tamanho” em todos os casos. PDFs já leves ou só de texto vetorial podem encolher pouco — a tela mostra tamanho original, final e porcentagem de redução com honestidade. O arquivo original no seu disco não é apagado automaticamente.',
  ],
  audienceTitle: 'Para quem comprimir PDF sem upload',
  audience:
    'Quem precisa enviar laudo ou contrato digitalizado; estudantes com apostila pesada; quem só tem o celular e um PDF grande na pasta Downloads; profissionais que esbarram em limite de anexo sem querer subir o documento a um compressor na nuvem.',
  useCasesTitle: 'Casos de uso práticos',
  useCases: [
    {
      title: 'E-mail e WhatsApp',
      description:
        'Reduza scans e capturas para o anexo ser aceito ou enviar mais rápido no celular.',
    },
    {
      title: 'Portais e formulários',
      description:
        'Muitos sistemas públicos e de RH limitam MB — a compressão local evita upload intermediário só para “passar no limite”.',
    },
    {
      title: 'Antes de juntar vários PDFs',
      description:
        'Comprimir scans pesados antes do merge reduz o uso de memória ao unir arquivos.',
    },
    {
      title: 'Documentos pessoais sensíveis',
      description:
        'Exames e identidade digitalizada não precisam atravessar a internet só para ficarem menores.',
    },
  ],
  howToTitle: 'Como comprimir PDF no navegador (passo a passo)',
  howToIntro:
    'A ferramenta fica no topo. Escolha o nível, comprima localmente e compare os tamanhos antes de baixar — grátis e sem cadastro.',
  steps: [
    {
      title: 'Selecione o PDF no dispositivo',
      description:
        'Arraste ou escolha o arquivo. Ele permanece na memória do navegador durante o processo.',
    },
    {
      title: 'Escolha o nível de compressão',
      description:
        'Baixa (melhor nitidez), Média (equilíbrio recomendado) ou Alta (menor arquivo, mais perda visual).',
    },
    {
      title: 'Comprima e acompanhe as páginas',
      description:
        'Cada página é processada no aparelho. Em PDFs longos ou celulares modestos pode demorar — a CPU local faz o trabalho.',
    },
    {
      title: 'Compare tamanhos e baixe a cópia',
      description:
        'Veja MB original vs. comprimido e a % de redução. Baixe só se estiver satisfeito; o original não é sobrescrito sozinho.',
    },
  ],
  benefitsTitle: 'Por que comprimir PDF localmente',
  benefitsIntro:
    'Compressores online pedem upload. Aqui o fluxo é client-side: privacidade e uso no celular sem app nativo obrigatório.',
  benefits: [
    {
      title: 'Sem upload de processamento',
      description:
        'pdf.js e canvas rodam no seu dispositivo. Não depositamos o PDF em servidor nosso para comprimir.',
    },
    {
      title: 'Três níveis de qualidade',
      description:
        'Você escolhe o trade-off entre nitidez e tamanho — útil para impressão vs. envio rápido.',
    },
    {
      title: 'Funciona no celular sem app',
      description:
        'Navegador atualizado basta. Menos instalação e menos permissões de app de PDF.',
    },
    {
      title: 'Grátis e sem cadastro',
      description:
        'Sem conta para liberar download. Limites vêm da memória do aparelho e do número de páginas.',
    },
  ],
  limitsTitle: 'Limites técnicos e trade-offs',
  limitsIntro:
    'Rasterizar páginas é pesado. Por isso há tetos — e o texto vira imagem. Isso é o preço de comprimir 100% no cliente com privacidade.',
  limits: [
    { label: 'Tamanho do arquivo', text: 'Até cerca de 50 MB.' },
    { label: 'Páginas', text: 'Até cerca de 50 páginas na compressão.' },
    {
      label: 'Texto selecionável',
      text: 'Em geral não permanece: páginas viram JPEG no PDF de saída.',
    },
    {
      label: 'PDFs já leves',
      text: 'Podem encolher pouco ou, em casos raros, ficar parecidos/maiores — a UI mostra o resultado real.',
    },
  ],
  faqTitle: 'Perguntas frequentes sobre comprimir PDF',
  faqs: [
    {
      question: 'Comprimir PDF online aqui faz upload?',
      answer:
        'Não para o processamento. A compressão ocorre no navegador; o arquivo não sobe para um servidor nosso de otimização.',
    },
    {
      question: 'Preciso de aplicativo no celular?',
      answer:
        'Não. Use o navegador nesta página — grátis e sem cadastro.',
    },
    {
      question: 'Vou perder qualidade?',
      answer:
        'Há perda controlada típica de JPEG, maior no nível alto. Comece em Média e só suba para Alta se ainda estiver acima do limite do destino.',
    },
    {
      question: 'Por que o texto não seleciona mais?',
      answer:
        'O método local transforma cada página em imagem para comprimir sem servidor. Se você precisa copiar texto depois, prefira extrair páginas ou não rasterizar.',
    },
    {
      question: 'Qual o limite de páginas?',
      answer:
        'Cerca de 50 páginas e 50 MB por arquivo. Acima disso, divida o PDF ou use um PC com mais memória.',
    },
    {
      question: 'O original é apagado?',
      answer:
        'Não. Você baixa uma cópia comprimida; o arquivo original permanece no dispositivo salvo se você o substituir manualmente.',
    },
  ],
  relatedTitle: 'Próximos passos e guias',
  related: [
    {
      path: '/juntar-pdf',
      label: 'Juntar PDF',
      description: 'Unir arquivos depois de aliviar o peso',
    },
    {
      path: '/dividir-pdf',
      label: 'Dividir PDF',
      description: 'Comprimir só o trecho necessário',
    },
    {
      path: '/blog/comprimir-pdf-online-celular-sem-app',
      label: 'Guia: comprimir no celular',
      description: 'Artigo no blog',
    },
    {
      path: '/pdf-sem-upload',
      label: 'PDF sem upload',
      description: 'Privacidade e modelo local',
    },
  ],
};

/** Mapa path → bloco SEO */
export const toolSeoByPath: Record<string, ToolSeoBlock> = {
  '/': homeSeoContent,
  '/juntar-pdf': juntarPdfSeoContent,
  '/dividir-pdf': dividirPdfSeoContent,
  '/girar-pdf': girarPdfSeoContent,
  '/marca-dagua': marcaDaguaSeoContent,
  '/desenhar-pdf': desenharPdfSeoContent,
  '/word-para-pdf': wordParaPdfSeoContent,
  '/imagem-para-pdf': imagemParaPdfSeoContent,
  '/extrair-texto': extrairTextoSeoContent,
  '/proteger-pdf': protegerPdfSeoContent,
  '/desbloquear-pdf': desbloquearPdfSeoContent,
  '/remover-paginas': removerPaginasSeoContent,
  '/comprimir-pdf': comprimirPdfSeoContent,
};
