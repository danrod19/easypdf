export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

/**
 * Perguntas frequentes reutilizáveis — foco em privacidade offline e freemium.
 * Otimizadas para SEO e conversão comercial.
 */
export const defaultFaqItems: FaqItem[] = [
  {
    id: 'seguro',
    question: 'É seguro editar meus PDFs aqui?',
    answer:
      'Sim. Toda a edição e conversão rodam 100% offline no seu navegador. Seus arquivos nunca saem do dispositivo: não há upload para servidores, nem armazenamento em nuvem. O processamento usa bibliotecas JavaScript locais (pdf-lib, jsPDF, Tesseract.js e outras). Ao fechar a aba, nada permanece conosco.',
  },
  {
    id: 'pagar',
    question: 'Preciso pagar para usar?',
    answer:
      "Não. As ferramentas principais — Juntar PDF, Dividir PDF, Girar PDF, Marca d'água, Desenhar no PDF, Word para PDF, Imagem para PDF e OCR — são gratuitas e sem cadastro. Não há plano pago nem cota diária de uso por conta. Há limites técnicos do navegador (por exemplo tamanho do arquivo e, em OCR/compressão, número de páginas) para o processamento local permanecer estável, especialmente no celular. Eventuais anúncios ajudam a manter o serviço no ar sem cobrar do usuário.",
  },
  {
    id: 'limites-tecnicos',
    question: 'Existe limite de tamanho ou de páginas?',
    answer:
      'Sim — limites técnicos para proteger a memória do seu navegador, não cotas de “conta”. Em geral: até cerca de 50 MB por arquivo; no juntar PDF, até 20 arquivos e cerca de 80 MB no total; OCR até 30 páginas; compressão até 50 páginas. Arquivos dentro desses tetos costumam funcionar bem; acima disso o site avisa e bloqueia o processamento para evitar travamentos.',
  },
  {
    id: 'sem-servidor',
    question: 'Como o site funciona sem carregar arquivos para um servidor?',
    answer:
      'Ao selecionar um arquivo, ele fica apenas na memória do seu navegador. Scripts WebAssembly e JavaScript processam o documento localmente no seu CPU/GPU. O resultado (PDF unido, dividido, convertido ou texto OCR) é gerado no cliente e o download parte direto do seu dispositivo — nenhum byte do arquivo é transmitido para nossos servidores.',
  },
  {
    id: 'internet',
    question: 'Preciso de internet durante o processamento?',
    answer:
      'A conexão é necessária apenas para carregar a página e (em OCR) o modelo de idioma do Tesseract na primeira utilização. Depois disso, a manipulação dos seus PDFs e imagens ocorre no dispositivo. Seus documentos em si nunca são enviados pela rede.',
  },
  {
    id: 'quais-formatos',
    question: 'Quais formatos são aceitos?',
    answer:
      "Dependendo da ferramenta: PDF para juntar, dividir, girar, marca d'água, desenhar e extrair texto; DOCX para Word → PDF; JPEG, PNG e WebP para Imagem → PDF. Tudo com validação no navegador antes do processamento.",
  },
];
