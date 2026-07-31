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

/** /dividir-pdf — conteúdo SEO expandido */
export const dividirPdfSeoContent: ToolSeoBlock = {
  toolName: 'Dividir PDF',
  schemaDescription:
    'Extraia páginas de PDF grátis no navegador, sem upload e sem cadastro. Divisão local com intervalos (ex.: 1, 3-5).',
  overview: [
    'Dividir PDF aqui significa extrair páginas ou intervalos de um documento e gerar um PDF novo só com o trecho escolhido. Você informa algo como 1, 3-5, 8 e baixa o resultado — sem enviar o arquivo para um servidor nosso.',
    'Diferente de sites que pedem upload do PDF inteiro para “cortar na nuvem”, o Easy PDF Local conta as páginas e copia as escolhidas com pdf-lib no navegador. O original no seu disco não é sobrescrito; só a cópia extraída é baixada.',
    'É grátis, sem cadastro e útil quando você precisa compartilhar só um anexo (capítulo, laudo, capa) sem expor o dossiê completo.',
  ],
  audienceTitle: 'Para quem serve',
  audience:
    'Quem recebe um PDF longo e precisa enviar só algumas páginas; estudantes que recortam capítulos; suporte e RH que separam anexos de um pacote; quem prefere não subir contratos a conversores online.',
  useCasesTitle: 'Casos de uso práticos',
  useCases: [
    {
      title: 'Enviar só o anexo certo',
      description:
        'Extraia o contrato ou o relatório sem o restante do dossiê de 40 páginas.',
    },
    {
      title: 'Material de estudo',
      description:
        'Separe um capítulo ou lista de exercícios para revisar no celular.',
    },
    {
      title: 'Antes de comprimir',
      description:
        'Recorte as páginas que importam e só então comprima — menos páginas, menos peso.',
    },
    {
      title: 'Privacidade seletiva',
      description:
        'Compartilhe o trecho necessário sem divulgar páginas com dados sensíveis.',
    },
  ],
  howToTitle: 'Como dividir PDF no navegador (passo a passo)',
  howToIntro:
    'Ferramenta no topo da página: selecione o PDF, digite o intervalo e extraia localmente — grátis e sem cadastro.',
  steps: [
    {
      title: 'Selecione o PDF no dispositivo',
      description:
        'Arraste ou escolha o arquivo. A contagem de páginas é lida no navegador; o PDF fica só na memória da sessão.',
    },
    {
      title: 'Informe páginas ou intervalos',
      description:
        'Exemplos: 1 · 3-5 · 1, 3-5, 8. A numeração começa em 1. Intervalos inválidos são rejeitados localmente.',
    },
    {
      title: 'Extraia e confira a pré-visualização',
      description:
        'O merge parcial roda no cliente (Worker quando possível). Veja o PDF gerado antes de baixar.',
    },
    {
      title: 'Baixe a cópia',
      description:
        'Salve o arquivo no dispositivo. O original permanece intacto no seu disco.',
    },
  ],
  benefitsTitle: 'Por que dividir PDF aqui (sem upload)',
  benefitsIntro:
    'Extrair páginas “online” costuma significar upload. Aqui o recorte é client-side e a privacidade acompanha o fluxo.',
  benefits: [
    {
      title: 'Arquivo não sobe para processar',
      description:
        'pdf-lib no navegador. Sem cópia temporária do seu PDF em servidor nosso de divisão.',
    },
    {
      title: 'Intervalos flexíveis',
      description:
        'Páginas avulsas e faixas no mesmo campo — controle fino do que entra no PDF final.',
    },
    {
      title: 'Grátis e sem conta',
      description:
        'Sem login e sem cota diária inventada. Limites vêm do tamanho do arquivo e da memória do aparelho.',
    },
    {
      title: 'Qualidade das páginas preservada',
      description:
        'As páginas são copiadas, não reimpressas como imagem — texto e vetores tendem a se manter.',
    },
  ],
  limitsTitle: 'Limites técnicos honestos',
  limitsIntro:
    'Processamento local tem teto de memória. Os limites abaixo protegem o navegador (especialmente no celular).',
  limits: [
    { label: 'Tamanho', text: 'Até cerca de 50 MB por PDF.' },
    {
      label: 'Páginas (geral)',
      text: 'Ordem de até cerca de 150 páginas em operações leves — em aparelhos fracos, prefira arquivos menores.',
    },
    {
      label: 'Saída',
      text: 'Um único PDF com as páginas escolhidas (não gera ZIP de arquivos separados).',
    },
    {
      label: 'Senha',
      text: 'PDFs protegidos costumam precisar ser desbloqueados antes.',
    },
  ],
  faqTitle: 'Perguntas frequentes sobre dividir PDF',
  faqs: [
    {
      question: 'Dividir PDF online aqui faz upload?',
      answer:
        'Não para processar. O PDF fica no navegador; a extração e o download são locais.',
    },
    {
      question: 'Preciso me cadastrar?',
      answer:
        'Não. Grátis e sem cadastro para usar a ferramenta.',
    },
    {
      question: 'Como digito o intervalo?',
      answer:
        'Use vírgulas e hífens, por exemplo 1, 3-5, 8. A validação ocorre no navegador antes de extrair.',
    },
    {
      question: 'O original é apagado?',
      answer:
        'Não. Geramos um PDF novo; o arquivo original permanece no seu dispositivo.',
    },
    {
      question: 'Funciona no celular?',
      answer:
        'Sim, no navegador. Em PDFs muito grandes, um desktop com mais RAM costuma ser mais confortável.',
    },
    {
      question: 'E se o PDF tiver senha?',
      answer:
        'Desbloqueie primeiro (com a senha correta) na ferramenta Desbloquear PDF e depois extraia as páginas da cópia liberada.',
    },
  ],
  relatedTitle: 'Ferramentas e guias relacionados',
  related: [
    {
      path: '/juntar-pdf',
      label: 'Juntar PDF',
      description: 'Unir trechos ou arquivos de novo',
    },
    {
      path: '/remover-paginas',
      label: 'Remover páginas',
      description: 'Excluir com miniaturas visuais',
    },
    {
      path: '/blog/dividir-pdf-online-sem-upload',
      label: 'Guia: dividir PDF sem upload',
      description: 'Artigo completo no blog',
    },
    {
      path: '/pdf-sem-upload',
      label: 'PDF sem upload',
      description: 'Como funciona o modelo local',
    },
  ],
};

/** /girar-pdf — conteúdo SEO expandido */
export const girarPdfSeoContent: ToolSeoBlock = {
  toolName: 'Girar PDF',
  schemaDescription:
    'Gire páginas de PDF grátis no navegador, sem upload e sem cadastro. 90° esquerda/direita, todas ou por intervalo.',
  overview: [
    'Girar PDF corrige páginas deitadas ou de cabeça para baixo — comum em scans de celular e digitalizações. No Easy PDF Local você gira 90° à esquerda ou à direita, em todas as páginas ou só em um intervalo, e salva uma cópia — sem upload para a nuvem da ferramenta.',
    'A rotação no PDF é, em geral, metadado de orientação: o conteúdo não precisa ser reimpresso como imagem. Texto e vetores tendem a manter a qualidade. O fluxo é grátis, sem cadastro e 100% no navegador.',
    'Você pode combinar várias rotações (estado local) e só então clicar em salvar para aplicar com pdf-lib e baixar o arquivo.',
  ],
  audienceTitle: 'Para quem serve',
  audience:
    'Quem digitaliza documentos no celular; escritórios que recebem PDFs tortos; estudantes com apostilas escaneadas; qualquer pessoa que precise corrigir orientação sem instalar Adobe ou app pago.',
  useCasesTitle: 'Casos de uso práticos',
  useCases: [
    {
      title: 'Scan de celular de lado',
      description:
        'Gire todas as páginas 90° e baixe o PDF legível na vertical.',
    },
    {
      title: 'Só uma página errada',
      description:
        'Use o intervalo (ex.: 3 ou 2-4) para girar apenas o que está invertido.',
    },
    {
      title: 'Antes de juntar ou enviar',
      description:
        'Padronize a orientação e depois una arquivos ou anexe no e-mail.',
    },
    {
      title: 'Documentos sensíveis',
      description:
        'Exames e contratos corrigidos localmente, sem upload a um site de terceiros.',
    },
  ],
  howToTitle: 'Como girar PDF no navegador (passo a passo)',
  howToIntro:
    'A UI fica no topo: carregue o PDF, escolha o modo (todas ou intervalo), gire e salve localmente.',
  steps: [
    {
      title: 'Abra o PDF no dispositivo',
      description:
        'Selecione o arquivo. A contagem de páginas e o estado de rotação ficam na sessão do navegador.',
    },
    {
      title: 'Escolha todas as páginas ou um intervalo',
      description:
        'Gire o documento inteiro ou informe páginas (ex.: 1, 3-5). Use esquerda ou direita em passos de 90°.',
    },
    {
      title: 'Ajuste quantas vezes precisar',
      description:
        'As rotações ficam pendentes até você salvar — combine giros antes de gerar o arquivo.',
    },
    {
      title: 'Salve e baixe',
      description:
        'pdf-lib aplica os ângulos no cliente. Confira a pré-visualização e baixe a cópia rotacionada.',
    },
  ],
  benefitsTitle: 'Por que girar PDF sem upload',
  benefitsIntro:
    'Corrigir orientação não deveria exigir enviar o documento a um servidor. Aqui o processamento é local e transparente.',
  benefits: [
    {
      title: 'Sem perda típica de “reexportar imagem”',
      description:
        'Rotação de página no PDF preserva conteúdo embutido na maioria dos casos — não é o mesmo que capturar tela e girar JPEG.',
    },
    {
      title: 'Privacidade no dispositivo',
      description:
        'Arquivo e ângulos ficam no navegador até o download da cópia.',
    },
    {
      title: 'Grátis e sem cadastro',
      description:
        'Sem conta e sem instalar leitor desktop só para um ajuste pontual.',
    },
    {
      title: 'Controle por página',
      description:
        'Intervalos permitem corrigir só o que está errado em relatórios longos.',
    },
  ],
  limitsTitle: 'Limites técnicos honestos',
  limitsIntro:
    'Como nas outras tools, há tetos de arquivo e páginas para estabilidade no navegador.',
  limits: [
    { label: 'Tamanho', text: 'Até cerca de 50 MB por PDF.' },
    {
      label: 'Páginas',
      text: 'Ordem de até cerca de 150 páginas em operações gerais — aparelhos fracos preferem menos.',
    },
    {
      label: 'Ângulos',
      text: 'Passos de 90° (esquerda/direita), não rotação livre em graus arbitrários na UI.',
    },
    {
      label: 'Senha',
      text: 'PDFs protegidos devem ser desbloqueados antes, se necessário.',
    },
  ],
  faqTitle: 'Perguntas frequentes sobre girar PDF',
  faqs: [
    {
      question: 'Girar PDF online aqui envia o arquivo?',
      answer:
        'Não para processar. A rotação roda no navegador; o download parte do seu dispositivo.',
    },
    {
      question: 'A qualidade cai?',
      answer:
        'Em condições normais, não: orientação de página não equivale a recompactar tudo como imagem.',
    },
    {
      question: 'Consigo girar só uma página?',
      answer:
        'Sim. Use o modo de páginas específicas com o número ou intervalo desejado.',
    },
    {
      question: 'Preciso de cadastro?',
      answer: 'Não. Grátis e sem conta.',
    },
    {
      question: 'Funciona no celular?',
      answer:
        'Sim. Toque e botões de 90° funcionam no navegador mobile.',
    },
    {
      question: 'Por que preciso clicar em Salvar?',
      answer:
        'Os botões de girar ajustam o estado local; “Salvar” aplica tudo de uma vez e gera o PDF para download.',
    },
  ],
  relatedTitle: 'Ferramentas e guias relacionados',
  related: [
    {
      path: '/juntar-pdf',
      label: 'Juntar PDF',
      description: 'Unir após padronizar orientação',
    },
    {
      path: '/dividir-pdf',
      label: 'Dividir PDF',
      description: 'Recortar páginas antes ou depois',
    },
    {
      path: '/remover-paginas',
      label: 'Remover páginas',
      description: 'Tirar folhas em branco',
    },
    {
      path: '/blog/girar-pdf-online-sem-upload',
      label: 'Guia: girar PDF sem upload',
      description: 'Artigo completo no blog',
    },
    {
      path: '/pdf-sem-upload',
      label: 'PDF sem upload',
      description: 'Modelo local e privacidade',
    },
  ],
};

/** /marca-dagua — conteúdo SEO expandido */
export const marcaDaguaSeoContent: ToolSeoBlock = {
  toolName: "Marca d'água",
  schemaDescription:
    "Adicione marca d'água de texto em PDF grátis no navegador, sem upload e sem cadastro. Opacidade e estilo locais.",
  overview: [
    "Marca d'água em PDF serve para marcar rascunhos, cópias controladas ou documentos confidenciais com um texto visível (ex.: CONFIDENCIAL, RASCUNHO, seu nome). No Easy PDF Local a aplicação é 100% no navegador: o arquivo não sobe para processar em servidor nosso.",
    'Você configura o texto e opções de estilo/opacidade na interface; o pdf-lib desenha a marca nas páginas localmente e você baixa a cópia marcada. O original no disco permanece intacto se você não o substituir.',
    'Grátis e sem cadastro — adequado para fluxos de revisão e compartilhamento em que a privacidade do PDF importa.',
  ],
  audienceTitle: 'Para quem serve',
  audience:
    'Escritórios que enviam rascunhos; freelancers que marcam propostas; times jurídicos e de compliance; quem compartilha PDFs e quer deixar claro o status do documento.',
  useCasesTitle: 'Casos de uso práticos',
  useCases: [
    {
      title: 'Rascunho / não final',
      description:
        'Marque “RASCUNHO” ou “CÓPIA” antes de enviar para revisão.',
    },
    {
      title: 'Confidencial',
      description:
        'Texto “CONFIDENCIAL” em relatórios e contratos em circulação interna.',
    },
    {
      title: 'Identificar destinatário',
      description:
        'Inclua nome ou e-mail na marca para rastrear cópias compartilhadas.',
    },
    {
      title: 'Sem instalar editor pago',
      description:
        'Ajuste no navegador e baixe — sem suíte desktop só para um texto.',
    },
  ],
  howToTitle: "Como adicionar marca d'água no navegador",
  howToIntro:
    'Ferramenta no topo: selecione o PDF, configure o texto e baixe a cópia marcada — sem upload e sem conta.',
  steps: [
    {
      title: 'Selecione o PDF',
      description:
        'Escolha o arquivo no dispositivo. O conteúdo fica na memória do navegador durante o processo.',
    },
    {
      title: "Configure a marca d'água",
      description:
        'Digite o texto e ajuste opacidade, tamanho e estilo conforme as opções da tela.',
    },
    {
      title: 'Aplique e baixe',
      description:
        'O pdf-lib desenha o texto nas páginas no cliente. Baixe o PDF marcado e guarde o original limpo se precisar.',
    },
  ],
  benefitsTitle: "Por que marca d'água sem upload",
  benefitsIntro:
    'Marcar documentos sensíveis em sites com upload cria uma cópia temporária alheia. Aqui o fluxo é local.',
  benefits: [
    {
      title: 'Processamento no dispositivo',
      description:
        'Texto e PDF não precisam depositar-se em servidor nosso para receber a marca.',
    },
    {
      title: 'Todas as páginas de forma uniforme',
      description:
        'A marca configurada é aplicada em todas as páginas do documento selecionado.',
    },
    {
      title: 'Grátis e sem cadastro',
      description: 'Sem trial e sem login obrigatório para o uso típico.',
    },
    {
      title: 'Controle visual',
      description:
        'Opacidade e estilo ajudam a equilibrar legibilidade e visibilidade da marca.',
    },
  ],
  limitsTitle: 'Limites técnicos honestos',
  limitsIntro:
    'Marca de texto embutida; não é DRM avançado nem certificado digital.',
  limits: [
    { label: 'Tamanho', text: 'Até cerca de 50 MB por PDF.' },
    {
      label: 'Tipo de marca',
      text: "Texto configurável — não é marca d'água de imagem complexa nesta ferramenta.",
    },
    {
      label: 'Escopo',
      text: 'Aplicação em todas as páginas do arquivo selecionado.',
    },
    {
      label: 'Remoção',
      text: 'A marca entra no PDF gerado; guarde o original sem marca se precisar de cópia limpa.',
    },
  ],
  faqTitle: "Perguntas frequentes sobre marca d'água",
  faqs: [
    {
      question: "A marca d'água sobe o PDF para a nuvem?",
      answer:
        'Não para processar. Tudo roda no navegador; você baixa a cópia marcada no dispositivo.',
    },
    {
      question: 'Preciso de cadastro?',
      answer: 'Não. Grátis e sem conta.',
    },
    {
      question: "Vai em todas as páginas?",
      answer:
        'Sim. O texto configurado é aplicado de forma uniforme em todas as páginas do PDF.',
    },
    {
      question: "Consigo remover depois?",
      answer:
        'Não há “desfazer na nuvem”. Mantenha o arquivo original sem marca se precisar de versão limpa.',
    },
    {
      question: 'Funciona no celular?',
      answer: 'Sim, no navegador, com os mesmos limites de tamanho de arquivo.',
    },
    {
      question: 'Isso impede cópia do PDF?',
      answer:
        'Não é proteção criptográfica. A marca é visual; para senha de abertura use Proteger PDF.',
    },
  ],
  relatedTitle: 'Ferramentas e guias relacionados',
  related: [
    {
      path: '/proteger-pdf',
      label: 'Proteger PDF',
      description: 'Senha de abertura no arquivo',
    },
    {
      path: '/blog/marca-dagua-pdf-sem-upload',
      label: "Guia: marca d'água sem upload",
      description: 'Artigo completo no blog',
    },
    {
      path: '/desenhar-pdf',
      label: 'Desenhar no PDF',
      description: 'Assinatura ou anotações à mão',
    },
    {
      path: '/pdf-sem-upload',
      label: 'PDF sem upload',
      description: 'Privacidade e modelo local',
    },
  ],
};

/** /desenhar-pdf — conteúdo SEO expandido */
export const desenharPdfSeoContent: ToolSeoBlock = {
  toolName: 'Desenhar no PDF',
  schemaDescription:
    'Desenhe ou assine PDF grátis no navegador, sem upload e sem cadastro. Mouse ou toque na página 1 — processamento local.',
  overview: [
    'Desenhar no PDF serve para anotações rápidas, circulados e assinaturas à mão livre. No Easy PDF Local você carrega o arquivo, desenha com mouse ou toque e exporta — sem upload do documento para um servidor nosso.',
    'A pré-visualização usa pdf.js; o traço é mesclado ao PDF com pdf-lib no cliente. O foco da ferramenta é a **primeira página** (página 1) — ideal para capas de assinatura e formulários de uma folha.',
    'É grátis e sem cadastro. Não substitui assinatura digital com certificado (ICP-Brasil): é uma assinatura/anotação manuscrita embutida no PDF, útil no dia a dia.',
  ],
  audienceTitle: 'Para quem serve',
  audience:
    'Quem precisa assinar um formulário simples; professores que marcam provas digitalizadas; profissionais em celular que querem um “ok” visual sem app de assinatura; quem evita upload de contratos a sites de e-sign desconhecidos.',
  useCasesTitle: 'Casos de uso práticos',
  useCases: [
    {
      title: 'Assinatura rápida na página 1',
      description:
        'Coloque a página de assinatura na frente do PDF e assine com o dedo no celular.',
    },
    {
      title: 'Circulares e destaques',
      description:
        'Marque trechos visualmente antes de devolver o arquivo por e-mail.',
    },
    {
      title: 'Sem instalar app de assinatura',
      description:
        'Navegador basta — útil em PCs emprestados ou restritos.',
    },
    {
      title: 'Documentos pessoais',
      description:
        'Autorizações e papéis que não devem subir a um serviço de nuvem só para rabiscar.',
    },
  ],
  howToTitle: 'Como desenhar ou assinar PDF no navegador',
  howToIntro:
    'Ferramenta no topo: carregue o PDF, desenhe na página 1 e exporte localmente — grátis e sem conta.',
  steps: [
    {
      title: 'Carregue o PDF no dispositivo',
      description:
        'Selecione o arquivo. A pré-visualização da página 1 usa pdf.js no navegador.',
    },
    {
      title: 'Desenhe com mouse ou toque',
      description:
        'Escolha cor e espessura do pincel e desenhe sobre a página. Ideal para assinatura e anotações rápidas.',
    },
    {
      title: 'Exporte o PDF com o desenho',
      description:
        'Ao salvar, o traço é mesclado no cliente e o download começa no seu aparelho.',
    },
  ],
  benefitsTitle: 'Por que desenhar PDF sem upload',
  benefitsIntro:
    'Muitos “assine online” pedem conta e upload. Aqui o canvas e a exportação são locais.',
  benefits: [
    {
      title: 'Processamento no dispositivo',
      description:
        'PDF e traços não são enviados a servidor nosso para assinar ou anotar.',
    },
    {
      title: 'Desktop e celular',
      description: 'Mouse ou dedo — mesmo fluxo no navegador.',
    },
    {
      title: 'Grátis e sem cadastro',
      description: 'Sem trial para um rabisco pontual.',
    },
    {
      title: 'Transparência do que a tool faz',
      description:
        'Página 1 e assinatura manuscrita embutida — sem prometer ICP-Brasil.',
    },
  ],
  limitsTitle: 'Limites técnicos honestos',
  limitsIntro:
    'Ferramenta focada e simples — saiba o que ela não faz.',
  limits: [
    {
      label: 'Página',
      text: 'Desenho na página 1 do PDF. Coloque a folha alvo na frente se precisar.',
    },
    { label: 'Tamanho', text: 'Até cerca de 50 MB por arquivo.' },
    {
      label: 'Assinatura legal',
      text: 'Não emite certificado digital; validade jurídica depende do contexto e da lei.',
    },
    {
      label: 'Edição avançada',
      text: 'Não é editor completo de formulários AcroForm ou multi-página de anotações.',
    },
  ],
  faqTitle: 'Perguntas frequentes sobre desenhar no PDF',
  faqs: [
    {
      question: 'O PDF sobe para a nuvem?',
      answer:
        'Não para processar. Desenho e exportação rodam no navegador.',
    },
    {
      question: 'Em qual página desenho?',
      answer:
        'Na página 1. Reordene o PDF (dividir/juntar) se a assinatura estiver em outra folha.',
    },
    {
      question: 'A assinatura vale juridicamente?',
      answer:
        'É manuscrita digitalizada. Validade depende do caso — não é e-sign com certificado ICP-Brasil.',
    },
    {
      question: 'Preciso de cadastro?',
      answer: 'Não. Grátis e sem conta.',
    },
    {
      question: 'Funciona no celular?',
      answer: 'Sim, com toque no canvas da página 1.',
    },
    {
      question: 'Posso desfazer o traço?',
      answer:
        'Use os controles da interface (desfazer/limpar) antes de exportar, conforme disponíveis na tela.',
    },
  ],
  relatedTitle: 'Ferramentas e guias relacionados',
  related: [
    {
      path: '/proteger-pdf',
      label: 'Proteger PDF',
      description: 'Senha após assinar',
    },
    {
      path: '/blog/desenhar-pdf-online-sem-upload',
      label: 'Guia: desenhar em PDF sem upload',
      description: 'Artigo completo no blog',
    },
    {
      path: '/marca-dagua',
      label: "Marca d'água",
      description: 'Texto em todas as páginas',
    },
    {
      path: '/pdf-sem-upload',
      label: 'PDF sem upload',
      description: 'Privacidade local',
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

/** /imagem-para-pdf — conteúdo SEO expandido */
export const imagemParaPdfSeoContent: ToolSeoBlock = {
  toolName: 'Imagem para PDF',
  schemaDescription:
    'Converta JPG, PNG ou WebP em PDF grátis no navegador, sem upload e sem cadastro. Várias imagens, uma página cada.',
  overview: [
    'Imagem para PDF transforma fotos e scans em um único arquivo PDF — uma página por imagem — na ordem que você definir. No Easy PDF Local o empacotamento roda no navegador: as imagens não sobem para um servidor nosso de conversão.',
    'Aceita formatos comuns como JPG/JPEG, PNG e WebP. Ideal para juntar comprovantes fotografados no celular, digitalizações e prints em um anexo estável para e-mail ou protocolo.',
    'Grátis e sem cadastro. Limites de quantidade e tamanho existem para o navegador não travar (especialmente no mobile).',
  ],
  audienceTitle: 'Para quem serve',
  audience:
    'Quem tira foto de documentos no celular; quem monta um PDF de recibos; estudantes que digitalizam folhas; profissionais que precisam de um único anexo a partir de várias imagens.',
  useCasesTitle: 'Casos de uso práticos',
  useCases: [
    {
      title: 'Documentos fotografados',
      description:
        'RG, comprovante e formulário em fotos → um PDF ordenado.',
    },
    {
      title: 'Scans e recibos',
      description:
        'Várias imagens de gastos ou notas em um arquivo para reembolso.',
    },
    {
      title: 'Prints de tela',
      description:
        'Empacote capturas em PDF para enviar por e-mail sem pasta zip.',
    },
    {
      title: 'Sem app nativo',
      description:
        'Conversão no navegador do telefone, sem instalar “foto para PDF”.',
    },
  ],
  howToTitle: 'Como converter imagens em PDF no navegador',
  howToIntro:
    'Ferramenta no topo: adicione imagens, ordene e gere o PDF localmente — sem upload e sem conta.',
  steps: [
    {
      title: 'Adicione uma ou mais imagens',
      description:
        'Arraste ou selecione JPG, PNG ou WebP. As imagens ficam na memória do navegador.',
    },
    {
      title: 'Organize a ordem das páginas',
      description:
        'Reordene a lista: a primeira imagem será a página 1 do PDF.',
    },
    {
      title: 'Gere e baixe o PDF',
      description:
        'A montagem roda no cliente. Baixe o arquivo no dispositivo — uma página por imagem.',
    },
  ],
  benefitsTitle: 'Por que imagem para PDF sem upload',
  benefitsIntro:
    'Sites com upload recebem suas fotos. Aqui o empacotamento é client-side e a privacidade acompanha o fluxo.',
  benefits: [
    {
      title: 'Fotos não sobem para converter',
      description:
        'Processamento no aparelho; download do PDF parte da sessão local.',
    },
    {
      title: 'Várias imagens, um arquivo',
      description: 'Um anexo em vez de dezenas de fotos soltas.',
    },
    {
      title: 'Ordem sob controle',
      description: 'Corrija a sequência antes de gerar o PDF.',
    },
    {
      title: 'Grátis e sem cadastro',
      description: 'Sem conta e sem app obrigatório no celular.',
    },
  ],
  limitsTitle: 'Limites técnicos honestos',
  limitsIntro:
    'Memória do navegador limita quantas imagens grandes cabem de uma vez.',
  limits: [
    {
      label: 'Por imagem',
      text: 'Até cerca de 50 MB cada (mesmo teto geral de arquivo).',
    },
    {
      label: 'Quantidade',
      text: 'Até cerca de 20 imagens por operação (mesmo espírito do merge).',
    },
    {
      label: 'Formatos',
      text: 'JPG/JPEG, PNG, WebP. HEIC e outros: converta no aparelho antes.',
    },
    {
      label: 'Layout',
      text: 'Uma página por imagem; não é diagramador de revista.',
    },
  ],
  faqTitle: 'Perguntas frequentes sobre imagem para PDF',
  faqs: [
    {
      question: 'As fotos sobem para a internet?',
      answer:
        'Não para processar. Ficam no navegador até você baixar o PDF gerado.',
    },
    {
      question: 'Quais formatos aceita?',
      answer:
        'Em geral JPG, PNG e WebP. Outros formatos devem ser convertidos antes.',
    },
    {
      question: 'A qualidade cai?',
      answer:
        'O fluxo embute as imagens; a nitidez final depende da resolução original e do visualizador.',
    },
    {
      question: 'Preciso de cadastro?',
      answer: 'Não. Grátis e sem conta.',
    },
    {
      question: 'Funciona no celular?',
      answer:
        'Sim. Em muitas fotos pesadas, o aparelho pode demorar ou falhar por memória — use menos imagens por vez.',
    },
    {
      question: 'Posso misturar com PDFs?',
      answer:
        'Esta tool é imagem → PDF. Para unir PDFs depois, use Juntar PDF.',
    },
  ],
  relatedTitle: 'Ferramentas e guias relacionados',
  related: [
    {
      path: '/juntar-pdf',
      label: 'Juntar PDF',
      description: 'Unir o PDF gerado a outros arquivos',
    },
    {
      path: '/blog/imagem-para-pdf-sem-upload',
      label: 'Guia: imagem para PDF sem upload',
      description: 'Artigo completo no blog',
    },
    {
      path: '/comprimir-pdf',
      label: 'Comprimir PDF',
      description: 'Se o PDF de fotos ficar pesado',
    },
    {
      path: '/pdf-sem-upload',
      label: 'PDF sem upload',
      description: 'Modelo local e privacidade',
    },
  ],
};

/** /extrair-texto — conteúdo SEO expandido (nativo + OCR) */
export const extrairTextoSeoContent: ToolSeoBlock = {
  toolName: 'Extrair Texto',
  schemaDescription:
    'Extraia texto de PDF grátis no navegador, sem upload e sem cadastro. Modo nativo (pdf.js) ou OCR em português (Tesseract) local.',
  overview: [
    'Extrair texto de PDF serve para copiar conteúdo, indexar trechos ou reaproveitar texto de documentos digitais e scans. No Easy PDF Local o fluxo é local: o PDF não sobe para uma API de OCR na nuvem nossa.',
    'Há dois caminhos: **nativo** (pdf.js lê a camada de texto — rápido e preciso em PDFs “digitais”) e **OCR** (Tesseract.js em português, páginas renderizadas em canvas — para scans). O OCR é mais lento e tem limite de páginas.',
    'Grátis e sem cadastro. Você pode editar o resultado, copiar ou baixar como .txt. Sempre revise nomes e números críticos após o OCR.',
  ],
  audienceTitle: 'Para quem serve',
  audience:
    'Quem precisa copiar trechos de contratos e relatórios; estudantes com apostilas digitais; quem recebe scan e precisa de texto editável; times que não podem enviar laudos a serviços de OCR na nuvem.',
  useCasesTitle: 'Casos de uso práticos',
  useCases: [
    {
      title: 'PDF com texto selecionável',
      description:
        'Modo nativo: extração rápida página a página sem OCR.',
    },
    {
      title: 'Scan ou foto de documento',
      description:
        'Ative Forçar OCR (português) e revise o resultado com calma.',
    },
    {
      title: 'Copiar valores e cláusulas',
      description:
        'Gere .txt e cole em planilha ou editor — com checagem humana.',
    },
    {
      title: 'Privacidade de laudos e RH',
      description:
        'Texto reconhecido no dispositivo, sem API de nuvem para o conteúdo.',
    },
  ],
  howToTitle: 'Como extrair texto de PDF no navegador',
  howToIntro:
    'Ferramenta no topo: selecione o PDF, escolha nativo ou OCR e baixe o texto — sem upload e sem conta.',
  steps: [
    {
      title: 'Selecione o PDF no dispositivo',
      description:
        'O arquivo fica na memória do navegador. Validação de tamanho e páginas ocorre localmente.',
    },
    {
      title: 'Escolha nativo ou Forçar OCR',
      description:
        'Nativo para texto embutido. OCR só em scans — cada página vira imagem e o Tesseract roda no CPU.',
    },
    {
      title: 'Extraia, revise e exporte',
      description:
        'Acompanhe o progresso, edite se quiser, copie ou baixe .txt.',
    },
  ],
  benefitsTitle: 'Por que extrair texto sem upload',
  benefitsIntro:
    'OCR na nuvem envia o documento inteiro. Aqui nativo e Tesseract são client-side; o modelo de idioma é asset público, não o seu PDF.',
  benefits: [
    {
      title: 'Dois modos honestos',
      description:
        'Rápido quando há texto; OCR opcional quando é imagem — sem misturar as expectativas.',
    },
    {
      title: 'Português no OCR',
      description:
        'Modelo por/pt disponível no fluxo local (primeira carga pode baixar o asset de idioma).',
    },
    {
      title: 'Privacidade do conteúdo',
      description:
        'O texto do seu PDF não é processado em servidor nosso de OCR.',
    },
    {
      title: 'Grátis e sem cadastro',
      description: 'Sem conta para copiar ou baixar o .txt.',
    },
  ],
  limitsTitle: 'Limites técnicos honestos',
  limitsIntro:
    'OCR é pesado. Por isso há tetos claros — não use “forçar OCR” em dezenas de páginas no celular de entrada sem expectativa de tempo.',
  limits: [
    { label: 'Tamanho do PDF', text: 'Até cerca de 50 MB.' },
    {
      label: 'OCR',
      text: 'Até cerca de 30 páginas no fluxo de OCR (Tesseract + canvas).',
    },
    {
      label: 'Precisão do OCR',
      text: 'Não é 100%. Revise números, nomes e valores críticos.',
    },
    {
      label: 'Performance',
      text: 'OCR depende da CPU; scans tortos ou escuros pioram o resultado.',
    },
  ],
  faqTitle: 'Perguntas frequentes sobre extrair texto',
  faqs: [
    {
      question: 'O PDF sobe para a internet?',
      answer:
        'Não para extrair. Nativo e OCR rodam no navegador. Assets públicos (ex.: modelo de idioma) podem ser baixados na primeira vez — o conteúdo do seu PDF não vai para nossos servidores.',
    },
    {
      question: 'Quando usar Forçar OCR?',
      answer:
        'Só se o modo nativo vier vazio e o PDF for scan/foto. OCR é bem mais lento.',
    },
    {
      question: 'Quantas páginas no OCR?',
      answer:
        'Cerca de 30 páginas no limite do produto. Acima disso, divida o PDF ou use desktop com mais recursos.',
    },
    {
      question: 'O OCR erra?',
      answer:
        'Sim, especialmente em baixa resolução. Sempre revise antes de usar o texto em produção.',
    },
    {
      question: 'Preciso de cadastro?',
      answer: 'Não. Grátis e sem conta.',
    },
    {
      question: 'Funciona offline?',
      answer:
        'Após carregar o site e o modelo de idioma (OCR), a extração do PDF não faz upload do documento.',
    },
  ],
  relatedTitle: 'Ferramentas e guias relacionados',
  related: [
    {
      path: '/dividir-pdf',
      label: 'Dividir PDF',
      description: 'OCR só nas páginas necessárias',
    },
    {
      path: '/blog/extrair-texto-pdf-sem-upload-ocr',
      label: 'Guia: extrair texto sem upload',
      description: 'Artigo completo no blog',
    },
    {
      path: '/word-para-pdf',
      label: 'Word para PDF',
      description: 'Caminho inverso: texto → PDF',
    },
    {
      path: '/pdf-sem-upload',
      label: 'PDF sem upload',
      description: 'Privacidade e modelo local',
    },
  ],
};

/** /proteger-pdf — conteúdo SEO expandido */
export const protegerPdfSeoContent: ToolSeoBlock = {
  toolName: 'Proteger PDF',
  schemaDescription:
    'Proteja PDF com senha grátis no navegador, sem upload e sem cadastro. Criptografia local no seu dispositivo.',
  overview: [
    'Proteger PDF com senha de abertura reduz o risco de leitura por quem intercepta um e-mail ou encontra o arquivo em um pen drive. No Easy PDF Local a criptografia roda no navegador: o documento e a senha não sobem para um servidor nosso.',
    'Você escolhe o PDF (sem senha prévia), define e confirma a senha e baixa a cópia cifrada. Leitores comuns (Chrome, Adobe, Preview) pedem a senha ao abrir.',
    'Grátis e sem cadastro. Se esquecer a senha, não há recuperação conosco — guarde-a com cuidado. Para remover senha quando você ainda a conhece, use Desbloquear PDF.',
  ],
  audienceTitle: 'Para quem serve',
  audience:
    'Quem envia contratos e laudos por e-mail; freelancers que protegem propostas; RH e jurídico; qualquer pessoa que queira uma camada simples de senha sem instalar software desktop.',
  useCasesTitle: 'Casos de uso práticos',
  useCases: [
    {
      title: 'Anexo de e-mail',
      description:
        'Cifre o PDF antes de enviar; informe a senha por outro canal.',
    },
    {
      title: 'Documentos pessoais',
      description:
        'Exames e identidade digitalizada com senha de abertura.',
    },
    {
      title: 'Compartilhamento em pastas',
      description:
        'Reduz leitura casual se o arquivo for copiado sem autorização.',
    },
    {
      title: 'PC compartilhado',
      description:
        'Proteja e baixe sem instalar suíte paga no computador da empresa.',
    },
  ],
  howToTitle: 'Como proteger PDF com senha no navegador',
  howToIntro:
    'Ferramenta no topo: selecione o PDF, defina a senha e baixe a cópia cifrada — sem upload e sem conta.',
  steps: [
    {
      title: 'Selecione o PDF sem senha',
      description:
        'O arquivo deve estar legível (sem proteção prévia) para aplicar a nova senha localmente.',
    },
    {
      title: 'Defina e confirme a senha',
      description:
        'Mínimo prático de 4 caracteres; prefira senhas longas e únicas. Confirme no segundo campo.',
    },
    {
      title: 'Criptografe e baixe',
      description:
        'A proteção é aplicada no cliente. Guarde a senha — não a recuperamos.',
    },
  ],
  benefitsTitle: 'Por que proteger PDF sem upload',
  benefitsIntro:
    'Criptografar “online” com upload expõe o arquivo no momento em que você quer mais sigilo. Aqui o processo é local.',
  benefits: [
    {
      title: 'Senha e PDF só no dispositivo',
      description:
        'Nada disso é enviado a backend nosso para “proteger na nuvem”.',
    },
    {
      title: 'Compatível com leitores comuns',
      description:
        'Senha de abertura no padrão PDF — Adobe, Chrome, Preview etc.',
    },
    {
      title: 'Grátis e sem cadastro',
      description: 'Sem trial e sem instalar desktop só para uma senha.',
    },
    {
      title: 'Ciclo com Desbloquear',
      description:
        'Depois, se precisar da cópia aberta e ainda souber a senha, use Desbloquear PDF.',
    },
  ],
  limitsTitle: 'Limites técnicos honestos',
  limitsIntro:
    'Proteção útil no dia a dia — não é cofre militar nem recuperação de senha.',
  limits: [
    { label: 'Tamanho', text: 'Até cerca de 50 MB por PDF.' },
    {
      label: 'PDF já com senha',
      text: 'Desbloqueie/salve sem senha antes de aplicar uma nova proteção aqui.',
    },
    {
      label: 'Recuperação',
      text: 'Não recuperamos senhas esquecidas.',
    },
    {
      label: 'Modelo de senha',
      text: 'Por simplicidade, user e owner usam a mesma string na UI atual.',
    },
  ],
  faqTitle: 'Perguntas frequentes sobre proteger PDF',
  faqs: [
    {
      question: 'A senha sobe para a internet?',
      answer:
        'Não. Criptografia no navegador; não enviamos PDF nem senha a servidores nossos.',
    },
    {
      question: 'E se eu esquecer a senha?',
      answer:
        'Não há recuperação. Use gerenciador de senhas ou anote em local seguro.',
    },
    {
      question: 'Preciso de cadastro?',
      answer: 'Não. Grátis e sem conta.',
    },
    {
      question: 'Posso proteger PDF que já tem senha?',
      answer:
        'Não neste fluxo. Remova a senha atual (com a senha conhecida) e depois proteja de novo.',
    },
    {
      question: 'Funciona no celular?',
      answer: 'Sim, no navegador, com os limites de tamanho de arquivo.',
    },
    {
      question: 'Isso impede tudo?',
      answer:
        'É senha de abertura padrão PDF. Boas práticas de compartilhamento ainda importam (canal da senha, permissões da pasta, etc.).',
    },
  ],
  relatedTitle: 'Ferramentas e guias relacionados',
  related: [
    {
      path: '/desbloquear-pdf',
      label: 'Desbloquear PDF',
      description: 'Remover senha quando você a conhece',
    },
    {
      path: '/blog/proteger-pdf-senha-sem-upload',
      label: 'Guia: proteger PDF com senha',
      description: 'Artigo completo no blog',
    },
    {
      path: '/marca-dagua',
      label: "Marca d'água",
      description: 'Marcação visual além da senha',
    },
    {
      path: '/pdf-sem-upload',
      label: 'PDF sem upload',
      description: 'Privacidade e modelo local',
    },
  ],
};

/** /remover-paginas — conteúdo SEO expandido */
export const removerPaginasSeoContent: ToolSeoBlock = {
  toolName: 'Remover Páginas',
  schemaDescription:
    'Remova páginas de PDF grátis no navegador, sem upload e sem cadastro. Miniaturas locais e PDF novo com o que restar.',
  overview: [
    'Remover páginas de PDF serve para tirar capas em branco, anexos errados ou folhas confidenciais antes de enviar o arquivo. No Easy PDF Local você marca páginas nas miniaturas e baixa um PDF novo — sem upload para a nuvem da ferramenta.',
    'As miniaturas usam pdf.js no navegador; a montagem do arquivo final usa pdf-lib. O original no disco não é apagado automaticamente. É obrigatório manter ao menos uma página no resultado.',
    'Grátis e sem cadastro. Alternativa visual ao “dividir por intervalo” quando você prefere ver o conteúdo página a página.',
  ],
  audienceTitle: 'Para quem serve',
  audience:
    'Quem limpa scans com folhas extras; quem remove anexos errados de um pacote; quem precisa ocultar páginas sensíveis antes de compartilhar; quem prefere UI com miniaturas a digitar intervalos.',
  useCasesTitle: 'Casos de uso práticos',
  useCases: [
    {
      title: 'Capas e páginas em branco',
      description: 'Marque e exclua folhas vazias de um scan.',
    },
    {
      title: 'Tirar anexo errado',
      description:
        'Remova páginas que entraram no PDF por engano antes de enviar.',
    },
    {
      title: 'Privacidade seletiva',
      description:
        'Tire páginas com dados pessoais e compartilhe só o restante.',
    },
    {
      title: 'Limpar antes de comprimir ou juntar',
      description:
        'Menos páginas = arquivo mais leve e merge mais simples.',
    },
  ],
  howToTitle: 'Como remover páginas de PDF no navegador',
  howToIntro:
    'Ferramenta no topo: carregue o PDF, marque as miniaturas e gere a cópia — grátis e sem conta.',
  steps: [
    {
      title: 'Envie o PDF',
      description:
        'Arraste ou selecione. Miniaturas são geradas localmente com pdf.js.',
    },
    {
      title: 'Marque o que excluir',
      description:
        'Clique na lixeira de cada miniatura. Clique de novo para desmarcar. Deixe ao menos uma página.',
    },
    {
      title: 'Gere o novo PDF',
      description:
        'pdf-lib monta o arquivo sem as páginas marcadas. Baixe a cópia; o original permanece no disco.',
    },
  ],
  benefitsTitle: 'Por que remover páginas sem upload',
  benefitsIntro:
    'Apagar páginas “online” com upload expõe o documento inteiro. Aqui seleção e geração são locais.',
  benefits: [
    {
      title: 'Seleção visual',
      description: 'Veja o conteúdo antes de excluir — menos erro de número de página.',
    },
    {
      title: 'Original preservado',
      description: 'Só a cópia nova é baixada; o arquivo de origem não é sobrescrito sozinho.',
    },
    {
      title: 'Qualidade das páginas restantes',
      description:
        'Páginas mantidas são copiadas, sem re-rasterizar o PDF inteiro só por remover folhas.',
    },
    {
      title: 'Grátis e sem cadastro',
      description: 'Sem conta para limpar um scan pontual.',
    },
  ],
  limitsTitle: 'Limites técnicos honestos',
  limitsIntro:
    'Miniaturas consomem memória — PDFs enormes no celular podem demorar.',
  limits: [
    { label: 'Tamanho', text: 'Até cerca de 50 MB por PDF.' },
    {
      label: 'Páginas',
      text: 'Ordem de até cerca de 150 páginas em operações gerais; UI com thumbs pode pesar em aparelhos fracos.',
    },
    {
      label: 'Mínimo',
      text: 'É obrigatório manter ao menos uma página no PDF final.',
    },
    {
      label: 'Senha',
      text: 'PDFs com senha de abertura precisam ser desbloqueados antes.',
    },
  ],
  faqTitle: 'Perguntas frequentes sobre remover páginas',
  faqs: [
    {
      question: 'O original é alterado no disco?',
      answer:
        'Não. Geramos um PDF novo com as páginas restantes.',
    },
    {
      question: 'Posso apagar todas as páginas?',
      answer:
        'Não. Deve restar ao menos uma página no arquivo final.',
    },
    {
      question: 'Faz upload?',
      answer:
        'Não para processar. Miniaturas e remoção rodam no navegador.',
    },
    {
      question: 'Preciso de cadastro?',
      answer: 'Não. Grátis e sem conta.',
    },
    {
      question: 'Diferença para Dividir PDF?',
      answer:
        'Dividir extrai por intervalo de texto; Remover usa miniaturas e descarta o que você marcar. Ambos geram um PDF novo.',
    },
    {
      question: 'Funciona no celular?',
      answer:
        'Sim, com ressalva de memória em PDFs longos com muitas thumbs.',
    },
  ],
  relatedTitle: 'Ferramentas e guias relacionados',
  related: [
    {
      path: '/dividir-pdf',
      label: 'Dividir PDF',
      description: 'Extrair por intervalo numérico',
    },
    {
      path: '/blog/remover-paginas-pdf-sem-upload',
      label: 'Guia: remover páginas sem upload',
      description: 'Artigo completo no blog',
    },
    {
      path: '/juntar-pdf',
      label: 'Juntar PDF',
      description: 'Reunir após limpar',
    },
    {
      path: '/pdf-sem-upload',
      label: 'PDF sem upload',
      description: 'Modelo local',
    },
  ],
};

/** /desbloquear-pdf — conteúdo SEO expandido */
export const desbloquearPdfSeoContent: ToolSeoBlock = {
  toolName: 'Desbloquear PDF',
  schemaDescription:
    'Desbloqueie PDF com senha conhecida grátis no navegador, sem upload e sem cadastro. Remove proteção localmente — não quebra senha.',
  overview: [
    'Desbloquear PDF aqui significa **remover a senha de abertura quando você já a conhece**, gerando uma cópia sem proteção no navegador. Não é serviço de “quebrar senha” nem recuperação de senha esquecida.',
    'O fluxo é o complemento de Proteger PDF: você protegeu o arquivo antes, ainda tem a senha, e precisa de uma cópia aberta para editar, arquivar ou reenviar. Tudo roda no dispositivo — sem upload do PDF nem da senha para servidor nosso.',
    'Grátis e sem cadastro. Senha errada gera aviso local; senha correta gera download da cópia legível em leitores comuns.',
  ],
  audienceTitle: 'Para quem serve',
  audience:
    'Quem protegeu o próprio PDF e esqueceu de guardar uma cópia aberta; quem recebeu um PDF com senha que já foi compartilhada; quem precisa desproteger antes de juntar, comprimir ou editar em outra tool.',
  useCasesTitle: 'Casos de uso práticos',
  useCases: [
    {
      title: 'Cópia aberta para arquivar',
      description:
        'Gere versão sem senha para pasta interna, mantendo a cifrada para envio externo.',
    },
    {
      title: 'Antes de outras tools',
      description:
        'Desbloqueie e depois junte, comprima ou remova páginas.',
    },
    {
      title: 'Reenvio sem digitar senha toda vez',
      description:
        'Quando o destinatário já é confiável e a senha se tornou atrito.',
    },
    {
      title: 'Sem software desktop',
      description:
        'Remoção local no navegador, sem instalar suíte paga.',
    },
  ],
  howToTitle: 'Como desbloquear PDF no navegador',
  howToIntro:
    'Ferramenta no topo: PDF + senha correta → cópia sem proteção. Grátis, sem cadastro e sem upload.',
  steps: [
    {
      title: 'Selecione o PDF protegido',
      description:
        'Escolha o arquivo no dispositivo. O processamento permanece na sessão do navegador.',
    },
    {
      title: 'Informe a senha atual',
      description:
        'Digite a senha correta. Sem ela não há desbloqueio — não tentamos força bruta.',
    },
    {
      title: 'Baixe o PDF sem proteção',
      description:
        'Gere a cópia aberta localmente e salve no dispositivo.',
    },
  ],
  benefitsTitle: 'Por que desbloquear sem upload',
  benefitsIntro:
    'Remover senha “na nuvem” envia o arquivo e a senha a terceiros. Aqui ambos ficam no cliente.',
  benefits: [
    {
      title: 'Senha e PDF no dispositivo',
      description:
        'Validação e geração da cópia aberta no navegador.',
    },
    {
      title: 'Par com Proteger PDF',
      description:
        'Ciclo completo de senha de abertura na mesma suíte local.',
    },
    {
      title: 'Grátis e sem cadastro',
      description: 'Sem conta para um desbloqueio pontual.',
    },
    {
      title: 'Feedback de senha errada',
      description:
        'Mensagem clara para corrigir e tentar de novo.',
    },
  ],
  limitsTitle: 'Limites técnicos honestos',
  limitsIntro:
    'Ferramenta de remoção com senha conhecida — não de cracking.',
  limits: [
    { label: 'Tamanho', text: 'Até cerca de 50 MB por PDF.' },
    {
      label: 'Senha esquecida',
      text: 'Não recuperamos nem quebramos senhas.',
    },
    {
      label: 'Tipos de proteção',
      text: 'Foco em senha de abertura que o fluxo local consiga validar; casos exóticos de DRM podem falhar.',
    },
    {
      label: 'Segurança',
      text: 'A cópia baixada fica sem senha — trate-a com o mesmo cuidado de qualquer PDF aberto.',
    },
  ],
  faqTitle: 'Perguntas frequentes sobre desbloquear PDF',
  faqs: [
    {
      question: 'Vocês recuperam senha esquecida?',
      answer:
        'Não. Só removemos a proteção com a senha correta informada por você.',
    },
    {
      question: 'O PDF ou a senha sobem para a internet?',
      answer:
        'Não para processar. Validação e download da cópia aberta são locais.',
    },
    {
      question: 'Preciso de cadastro?',
      answer: 'Não. Grátis e sem conta.',
    },
    {
      question: 'O PDF final abre em qualquer leitor?',
      answer:
        'Sim — sem senha de usuário, legível em leitores comuns.',
    },
    {
      question: 'Funciona no celular?',
      answer: 'Sim, no navegador, com os limites de tamanho.',
    },
    {
      question: 'E se a senha estiver errada?',
      answer:
        'A interface avisa. Corrija e tente de novo; nada é enviado a um servidor de “tentativas”.',
    },
  ],
  relatedTitle: 'Ferramentas e guias relacionados',
  related: [
    {
      path: '/proteger-pdf',
      label: 'Proteger PDF',
      description: 'Aplicar senha de abertura',
    },
    {
      path: '/blog/desbloquear-pdf-senha-conhecida-sem-upload',
      label: 'Guia: desbloquear PDF (senha conhecida)',
      description: 'Artigo completo no blog',
    },
    {
      path: '/juntar-pdf',
      label: 'Juntar PDF',
      description: 'Unir após desbloquear',
    },
    {
      path: '/pdf-sem-upload',
      label: 'PDF sem upload',
      description: 'Privacidade e modelo local',
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
