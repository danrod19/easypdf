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

export type ToolSeoBlock = {
  /** H2 principal do bloco (passo a passo) */
  howToTitle: string;
  /** Intro opcional sob o H2 */
  howToIntro?: string;
  steps: SeoStep[];
  /** H3 benefícios */
  benefitsTitle: string;
  benefitsIntro?: string;
  benefits: SeoBenefit[];
  /** H3 FAQ textual (além do accordion, se houver) */
  faqTitle: string;
  faqs: SeoFaq[];
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

/** /juntar-pdf — modelo de conteúdo SEO para página de ferramenta */
export const juntarPdfSeoContent: ToolSeoBlock = {
  howToTitle: 'Como juntar arquivos PDF de forma segura',
  howToIntro:
    'Com a ferramenta Juntar PDF do Easy PDF Local você une dois ou mais documentos em um único arquivo, na ordem que escolher, sem enviar nada para a nuvem.',
  steps: [
    {
      title: 'Adicione 2 ou mais PDFs',
      description:
        'Arraste os arquivos para a área de upload ou clique para selecioná-los no computador ou celular. Aceitamos apenas PDF; a validação ocorre no navegador.',
    },
    {
      title: 'Reordene a lista (opcional)',
      description:
        'Use as setas para definir a sequência das páginas no PDF final. O primeiro da lista será o início do documento unificado.',
    },
    {
      title: 'Clique em Juntar e baixe o resultado',
      description:
        'O merge roda localmente com pdf-lib. Em segundos (conforme o tamanho), o PDF unificado é gerado e o download inicia no seu dispositivo.',
    },
  ],
  benefitsTitle: 'Benefícios de juntar PDF no navegador (sem upload)',
  benefitsIntro:
    'Unir PDFs online costuma significar enviar contratos e dados sensíveis a um servidor. Aqui o fluxo é o oposto: o servidor não recebe o arquivo.',
  benefits: [
    {
      title: 'Privacidade total com processamento client-side',
      description:
        'O merge acontece via JavaScript (pdf-lib) na memória do navegador. Não há upload para a Easy PDF Local nem armazenamento temporário em nuvem.',
    },
    {
      title: 'Controle da ordem das páginas',
      description:
        'Antes de mesclar, você organiza a lista. Ideal para relatórios, apostilas, anexos de proposta comercial e documentos digitalizados em partes.',
    },
    {
      title: 'Sem cadastro e sem limite de “conta”',
      description:
        'Não criamos usuário nem exigimos login. Use quantas vezes precisar no dia a dia — o freemium não trava o merge básico por número de usos.',
    },
    {
      title: 'Adequado a arquivos confidenciais',
      description:
        'Como o PDF não trafega para nossos servidores, o risco de interceptação ou retenção do documento no backend deixa de existir neste fluxo.',
    },
  ],
  faqTitle: 'FAQ: juntar PDF com segurança',
  faqs: [
    {
      question: 'Meus arquivos são enviados para a internet?',
      answer:
        'Não. Ao selecionar os PDFs, eles ficam na memória local do navegador. O algoritmo de união (pdf-lib) roda no seu dispositivo e o arquivo final é baixado dali. Nossos servidores não recebem o conteúdo dos documentos.',
    },
    {
      question: 'Posso usar offline?',
      answer:
        'Sim, no sentido de que o merge em si não envia arquivos. Você precisa carregar o site uma vez (com internet) para baixar a aplicação. Depois disso, a junção dos PDFs não depende de upload. Em abas já abertas, o processamento continua local.',
    },
    {
      question: 'Quantos PDFs posso juntar de uma vez?',
      answer:
        'O limite prático é a memória e a performance do seu aparelho. Para dezenas de arquivos grandes, um computador com mais RAM costuma ser mais confortável. Não há cota de servidor porque não usamos fila na nuvem.',
    },
    {
      question: 'A qualidade do PDF cai ao juntar?',
      answer:
        'Não. O merge com pdf-lib preserva as páginas originais (texto, vetores e imagens embutidas) na ordem definida — sem recomprimir o conteúdo só por unir os arquivos.',
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

/** /word-para-pdf */
export const wordParaPdfSeoContent: ToolSeoBlock = {
  howToTitle: 'Como converter Word (DOCX) para PDF com segurança',
  howToIntro:
    'Com a ferramenta Word para PDF do Easy PDF Local você transforma documentos DOCX em PDF direto no navegador, sem enviar o arquivo para servidores de conversão.',
  steps: [
    {
      title: 'Selecione o arquivo DOCX',
      description:
        'Escolha o documento Word (.docx) no seu dispositivo. Formatos antigos .doc podem não ser suportados; o DOCX é lido localmente no navegador.',
    },
    {
      title: 'Inicie a conversão local',
      description:
        'O conteúdo é processado no cliente (bibliotecas JS no navegador) e montado em PDF — sem fila na nuvem e sem conta obrigatória.',
    },
    {
      title: 'Baixe o PDF gerado',
      description:
        'Ao concluir, o download do PDF parte do seu dispositivo. O DOCX original permanece onde estava; nada fica armazenado conosco.',
    },
  ],
  benefitsTitle: 'Benefícios de converter Word para PDF no navegador',
  benefitsIntro:
    'Conversores online clássicos fazem upload do DOCX. Currículos, contratos e trabalhos acadêmicos merecem um fluxo sem depósito em servidor de terceiros.',
  benefits: [
    {
      title: 'Conversão client-side (sem upload do documento)',
      description:
        'O processamento ocorre no seu aparelho com JavaScript. Reduz a exposição de textos confidenciais em trânsito para APIs de conversão.',
    },
    {
      title: 'PDF estável para envio e impressão',
      description:
        'Gere um PDF para anexar em e-mail, protocolo ou impressão, mantendo o DOCX editável no seu disco como fonte.',
    },
    {
      title: 'Sem instalar Microsoft Word ou suíte desktop',
      description:
        'Útil em computadores compartilhados ou quando você só precisa de um PDF rápido a partir do DOCX já baixado.',
    },
    {
      title: 'Grátis e sem cadastro',
      description:
        'Converta sob demanda, sem trial nem cartão. Limites práticos vêm da complexidade do documento e da memória do navegador.',
    },
  ],
  faqTitle: 'FAQ: Word para PDF com segurança',
  faqs: [
    {
      question: 'Meus arquivos são enviados para a internet?',
      answer:
        'Não. O DOCX é lido e convertido na memória do navegador. O PDF resultante é baixado localmente; nossos servidores não recebem o texto do documento.',
    },
    {
      question: 'Posso usar offline?',
      answer:
        'Depois de carregar o site, a conversão não faz upload do DOCX. Internet é necessária para a primeira carga da aplicação web.',
    },
    {
      question: 'A formatação fica idêntica ao Word?',
      answer:
        'A conversão client-side via HTML/JS cobre bem textos e estruturas comuns, mas layouts muito complexos (campos avançados, alguns objetos) podem divergir. Para diagramação crítica, revise o PDF antes de enviar.',
    },
    {
      question: 'Aceita arquivos .doc antigos?',
      answer:
        'O foco é DOCX (Office Open XML). Se tiver .doc legado, abra no Word ou LibreOffice e salve como DOCX antes de converter aqui.',
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

/** /comprimir-pdf */
export const comprimirPdfSeoContent: ToolSeoBlock = {
  howToTitle: 'Como comprimir PDF com segurança no navegador',
  howToIntro:
    'Com a ferramenta Comprimir PDF do Easy PDF Local você reduz o peso de documentos pesados (scans, fotos, capturas) sem enviar o arquivo para servidores de compressão.',
  steps: [
    {
      title: 'Envie o PDF',
      description:
        'Arraste ou selecione o arquivo no seu dispositivo. O conteúdo permanece na memória do navegador — sem upload para a nuvem.',
    },
    {
      title: 'Escolha o nível de compressão',
      description:
        'Baixa prioriza nitidez; Média equilibra tamanho e qualidade (recomendado); Alta gera o menor arquivo possível, com mais perda visual.',
    },
    {
      title: 'Comprima e baixe',
      description:
        'Clique em Comprimir PDF, acompanhe o progresso por página e baixe a cópia menor. Veja o tamanho final e a porcentagem de redução na tela.',
    },
  ],
  benefitsTitle: 'Benefícios de comprimir PDF localmente',
  benefitsIntro:
    'Servidores de compressão online exigem upload. Aqui o fluxo é client-side: útil para laudos, contratos digitalizados e PDFs com imagens grandes que precisam caber em e-mail ou formulários.',
  benefits: [
    {
      title: 'Sem upload — privacidade total',
      description:
        'pdf.js e pdf-lib rodam no seu aparelho. O PDF original não é armazenado em nossos servidores; só você baixa a versão comprimida.',
    },
    {
      title: 'Ideal para scans e fotos pesadas',
      description:
        'A rasterização (páginas → JPEG) costuma reduzir muito arquivos escaneados ou com imagens em alta resolução, onde a compressão vetorial clássica ajuda pouco.',
    },
    {
      title: 'Controle de qualidade em 3 níveis',
      description:
        'Ajuste qualidade JPEG e escala de renderização conforme o uso: impressão (Baixa), uso geral (Média) ou envio rápido (Alta).',
    },
    {
      title: 'Grátis e sem cadastro',
      description:
        'Comprima sob demanda, sem trial. Limites práticos vêm da memória do navegador e do número de páginas do documento.',
    },
  ],
  faqTitle: 'FAQ: comprimir PDF com rasterização local',
  faqs: [
    {
      question: 'Por que o texto deixa de ser selecionável?',
      answer:
        'Para garantir privacidade e compressão 100% no navegador (sem Ghostscript no servidor), cada página vira imagem JPEG. O visual permanece; texto pesquisável e links embutidos não são preservados. É o trade-off deste método client-side.',
    },
    {
      question: 'Meus arquivos sobem para a internet?',
      answer:
        'Não. A compressão ocorre na memória do navegador. Nossos servidores não recebem o conteúdo do PDF.',
    },
    {
      question: 'O arquivo sempre fica menor?',
      answer:
        'Na maioria dos scans e PDFs com fotos, sim. PDFs já leves, só com texto vetorial ou bem otimizados podem ficar parecidos ou até um pouco maiores — a tela mostra o tamanho e a % de redução honestamente.',
    },
    {
      question: 'Funciona em PDF com senha?',
      answer:
        'Não diretamente. Remova a senha em Desbloquear PDF (com a senha correta) e depois comprima a cópia sem proteção.',
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
