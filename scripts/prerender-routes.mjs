/**
 * Rotas públicas a pré-renderizar no build (SEO).
 *
 * Como adicionar uma rota nova:
 * 1. Garanta que a rota existe no React Router (src/App.tsx)
 * 2. Inclua o path abaixo (com barra inicial, sem trailing slash, exceto "/")
 * 3. Rode `npm run build` e confira dist{path}/index.html
 *
 * Blog: adicione `/blog/seu-slug` quando criar o post em blogPosts + .md
 */

/** @type {readonly string[]} */
export const PRERENDER_ROUTES = [
  // —— Alta prioridade ——
  '/',
  '/juntar-pdf',
  '/comprimir-pdf',
  '/word-para-pdf',
  '/pdf-sem-upload',
  '/extrair-texto',
  '/dividir-pdf',
  '/girar-pdf',
  '/blog',
  '/blog/juntar-pdf-online-sem-upload',
  '/blog/comprimir-pdf-online-celular-sem-app',
  '/blog/word-para-pdf-online-sem-instalar',
  '/blog/dividir-pdf-online-sem-upload',
  '/blog/extrair-texto-pdf-sem-upload-ocr',
  '/blog/proteger-pdf-senha-sem-upload',
  '/blog/girar-pdf-online-sem-upload',
  '/blog/remover-paginas-pdf-sem-upload',
  '/blog/desbloquear-pdf-senha-conhecida-sem-upload',

  // —— Média prioridade (tools restantes + institucionais) ——
  '/marca-dagua',
  '/desenhar-pdf',
  '/imagem-para-pdf',
  '/proteger-pdf',
  '/desbloquear-pdf',
  '/remover-paginas',
  '/blog/infraestrutura-nuvem-vs-local',
  '/sobre',
  '/contato',
  '/privacidade',
  '/termos',
];
