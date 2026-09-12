import { LIMIT_NUMBERS } from './fileLimitsCopy';

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const n = LIMIT_NUMBERS;

/**
 * FAQ institucional — cookies e teto do cliente.
 * Sem “é seguro editar meus PDFs?” / “preciso pagar?” (boilerplate das tools).
 */
export const defaultFaqItems: FaqItem[] = [
  {
    id: 'cookies',
    question: 'O site usa cookies? Eles leem o conteúdo do meu PDF?',
    answer:
      'Cookies e scripts de medição/publicidade (quando ativos e com o consentimento exigido) tratam de navegação e anúncios — não leem o PDF, DOCX ou imagem que você processa na ferramenta. Preferências ficam no rodapé. Detalhes na Política de Privacidade.',
  },
  {
    id: 'navegador-nao-da-conta',
    question: 'Quando o processamento local falha?',
    answer: `Quando o arquivo ou a operação passam da memória do navegador. Tetos atuais: ${n.maxFileMb} MB por arquivo; merge até ${n.maxMergeFiles} arquivos / ${n.maxMergeTotalMb} MB no total; OCR ${n.maxOcrPages} páginas; compressão ${n.maxCompressPages} páginas. Acima disso o site recusa ou o aparelho trava — não há modo ilimitado no cliente.`,
  },
];
