/**
 * Texto acima da dobra (antes do DropZone) — único por ferramenta.
 * O que faz / quando NÃO usar / limite crítico. Sem o mesmo parágrafo de privacidade.
 */

import { LIMIT_NUMBERS } from './fileLimitsCopy';

const n = LIMIT_NUMBERS;

export type ToolAboveFold = {
  title: string;
  /** Classes do eyebrow (default: brand) */
  eyebrowClassName?: string;
  /** 2–4 frases visíveis antes do DropZone */
  paragraphs: string[];
};

export const toolAboveFoldByPath: Record<string, ToolAboveFold> = {
  '/juntar-pdf': {
    title: 'Juntar PDF online e seguro',
    paragraphs: [
      `Une dois ou mais PDFs na ordem da lista: o primeiro item vira o início do arquivo final.`,
      `Não use para um único arquivo, nem para PDF ainda com senha — desbloqueie antes, se souber a senha.`,
      `Limite crítico: até ${n.maxMergeFiles} arquivos, ${n.maxFileMb} MB cada e ${n.maxMergeTotalMb} MB no total da fila. Acima disso a validação recusa para o navegador não travar.`,
    ],
  },
  '/dividir-pdf': {
    title: 'Dividir PDF',
    paragraphs: [
      'Extrai as páginas que você indicar (ex.: 1, 3-5, 8) e gera um PDF novo só com esse trecho.',
      'Não fatia o arquivo automaticamente em N partes iguais: você precisa informar o intervalo. O original no disco não é apagado.',
      `Limite crítico: ${n.maxFileMb} MB por PDF. Em aparelhos com pouca RAM, documentos longos (cerca de ${n.maxPdfPagesGeneral} páginas) podem falhar — extraia menos páginas por vez.`,
    ],
  },
  '/girar-pdf': {
    title: 'Girar PDF online',
    eyebrowClassName:
      'text-sm font-medium text-orange-600 dark:text-orange-400',
    paragraphs: [
      'Gira páginas 90° à esquerda ou à direita — todas ou só um intervalo (ex.: 1, 3-5). A orientação é metadado do PDF, não uma reimpressão.',
      'Não endireita foto torta, não faz OCR e não recorta a folha. Se a página está de cabeça para baixo, use 180° (dois cliques de 90°).',
      `Limite crítico: ${n.maxFileMb} MB. Em PDFs muito longos, prefira desktop; o teto geral de páginas leves é da ordem de ${n.maxPdfPagesGeneral}.`,
    ],
  },
  '/marca-dagua': {
    title: "Marca d'água PDF",
    eyebrowClassName: 'text-sm font-medium text-cyan-600 dark:text-cyan-400',
    paragraphs: [
      "Sobreponha um texto (ex.: CONFIDENCIAL) em todas as páginas, com opacidade, cor e posição.",
      "Não é DRM nem senha: a marca é visual e não impede copiar o arquivo. Emojis e símbolos raros podem sumir na fonte padrão.",
      `Limite crítico: ${n.maxFileMb} MB por PDF. Em aparelhos fracos, evite documentos enormes — a aplicação percorre cada página.`,
    ],
  },
  '/desenhar-pdf': {
    title: 'Desenhar no PDF',
    eyebrowClassName: 'text-sm font-medium text-pink-600 dark:text-pink-400',
    paragraphs: [
      'Desenhe ou assine à mão livre na página 1: mouse, toque ou stylus. Os traços entram como linhas no PDF, sem rasterizar a folha inteira.',
      'Não é editor Adobe: não anota as páginas seguintes, não insere texto tipográfico e não gera assinatura ICP-Brasil.',
      `Limite crítico: ${n.maxFileMb} MB. O canvas consome RAM — no celular, PDFs pesados ou de alta resolução podem travar.`,
    ],
  },
  '/word-para-pdf': {
    title: 'Word para PDF',
    paragraphs: [
      'Converte DOCX em PDF no navegador, sem instalar o Word. Serve para textos, listas e documentos do dia a dia.',
      'Não abre .doc antigo (salve como DOCX antes). Tabelas complexas, cabeçalhos elaborados e objetos embutidos podem divergir do Word desktop — revise o resultado.',
      `Limite crítico: ${n.maxFileMb} MB. DOCX com muitas imagens pede mais memória; se falhar no celular, tente no desktop.`,
    ],
  },
  '/imagem-para-pdf': {
    title: 'Imagem para PDF',
    eyebrowClassName:
      'text-sm font-medium text-emerald-600 dark:text-emerald-400',
    paragraphs: [
      'Cada JPG, PNG ou WebP vira uma página. Várias imagens entram no mesmo PDF, na ordem da lista — o tamanho da página segue a imagem, não um A4 forçado.',
      'Não faz OCR, não junta PDFs existentes e não aceita HEIC/GIF/BMP nesta ferramenta.',
      `Limite crítico: até ${n.maxMergeFiles} imagens e ${n.maxFileMb} MB cada. Fotos enormes: reduza a resolução antes se o aparelho for fraco.`,
    ],
  },
  '/extrair-texto': {
    title: 'Extrair texto de PDF',
    paragraphs: [
      'Copia texto de PDF digital (camada de texto) ou usa OCR em português em scans — o resultado sai para você colar ou baixar.',
      'Não reconstrução fiel de tabelas complexas. OCR erra em manuscrito, foto torta, baixa resolução e carimbos por cima da letra.',
      `Limite crítico: ${n.maxFileMb} MB; no fluxo OCR, até ${n.maxOcrPages} páginas. Acima disso o site bloqueia — o Tesseract no navegador pesa CPU e RAM.`,
    ],
  },
  '/proteger-pdf': {
    title: 'Proteger PDF',
    paragraphs: [
      'Define uma senha de abertura e cifra o PDF no próprio navegador. Quem receber o arquivo precisa da senha para ver o conteúdo.',
      'Não é cofre corporativo nem impede print screen. Se esquecer a senha, não há recuperação aqui — o arquivo fica inacessível.',
      `Limite crítico: ${n.maxFileMb} MB. PDF que já tem senha precisa ser desbloqueado antes (com a senha atual) para aplicar uma nova.`,
    ],
  },
  '/desbloquear-pdf': {
    title: 'Desbloquear PDF',
    paragraphs: [
      'Remove a senha de abertura quando você já a conhece, gerando uma cópia sem proteção.',
      'Não quebra senha esquecida, não testa combinações e não contorna a criptografia sem a chave correta.',
      `Limite crítico: ${n.maxFileMb} MB. Senha errada: o site avisa e não gera download. Confira maiúsculas e espaços.`,
    ],
  },
  '/remover-paginas': {
    title: 'Remover Páginas',
    paragraphs: [
      'Mostra miniaturas, você marca as folhas a excluir e baixa um PDF novo só com o que restar.',
      'O original no disco não é alterado. Não dá para deixar zero páginas — precisa ficar pelo menos uma.',
      `Limite crítico: ${n.maxFileMb} MB. Miniaturas de PDFs longos consomem memória; no celular, prefira arquivos menores.`,
    ],
  },
  '/comprimir-pdf': {
    title: 'Comprimir PDF',
    paragraphs: [
      'Reduz tamanho rasterizando cada página em JPEG e montando um PDF novo. Útil em scans e fotos pesadas.',
      'Não use se precisar manter texto selecionável ou vetores nítidos: em geral o texto deixa de ser pesquisável. PDFs já leves podem encolher pouco.',
      `Limite crítico: ${n.maxFileMb} MB e até ${n.maxCompressPages} páginas. É a operação mais pesada da suíte — no celular, menos páginas por vez.`,
    ],
  },
};
