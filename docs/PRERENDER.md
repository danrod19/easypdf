# Pré-renderização (SEO) — Easy PDF Local

## Por que existe

A app é uma SPA (Vite + React Router). Sem prerender, qualquer URL (`/juntar-pdf`, etc.) devolve o mesmo `index.html` da home até o JavaScript rodar. Crawlers e sites novos indexam pior.

## Como funciona

1. `vite build` gera o bundle e o shell em `dist/`.
2. `scripts/prerender.mjs` sobe um HTTP server local do `dist/`.
3. Playwright (Chromium) abre cada rota em `scripts/prerender-routes.mjs`.
4. Espera: conteúdo no `#root`, `<h1>`, `link[rel=canonical]` da rota, e (em posts) corpo do artigo.
5. Grava HTML em:
   - `/` → `dist/index.html`
   - `/juntar-pdf` → `dist/juntar-pdf/index.html`
   - `/blog/slug` → `dist/blog/slug/index.html`
6. Reescreve URLs `http://127.0.0.1:PORT` → paths root-relative (`/assets/...`).

O React no browser continua com `createRoot` (não é SSR/hidratação React 18). O HTML estático serve crawlers e o first paint; o JS re-monta a app normalmente.

## Comandos

```bash
# Instalar browser (1ª vez / CI)
npm run playwright:install

# Build completo (tsc + vite + prerender)
npm run build

# Só prerender (dist já existe)
npm run prerender

# Build sem prerender
npm run build:skip-prerender
# ou
SKIP_PRERENDER=1 npm run build
```

## Adicionar uma rota nova

1. Crie a rota em `src/App.tsx`.
2. (Opcional) SEO em `src/data/seo.ts` / página com `<Seo />`.
3. Adicione o path em `scripts/prerender-routes.mjs` (`PRERENDER_ROUTES`).
4. Se for post de blog: `blogPosts.ts` + `src/data/posts/{slug}.md` + path `/blog/{slug}`.
5. `npm run build` e confira o arquivo em `dist/.../index.html`.

## Validar

```bash
# Marcador + title + canonical
findstr /i "easypdf-prerender title canonical" dist\juntar-pdf\index.html

# Não deve haver host de build
findstr /i "127.0.0.1" dist\juntar-pdf\index.html
# (esperado: sem matches)
```

Ou abra `dist/juntar-pdf/index.html` no editor e confira:

- `<!-- easypdf-prerender: /juntar-pdf -->`
- `<title>Juntar PDF Online e Seguro | …</title>`
- `<link rel="canonical" href="https://easypdflocal.com.br/juntar-pdf">`
- `<h1>…Juntar PDF…</h1>`
- JSON-LD (`application/ld+json`) se a página injeta

Preview local (após build):

```bash
npx serve dist
# abra http://localhost:3000/juntar-pdf e “Ver código-fonte”
```

## Cloudflare Pages

| Campo | Valor |
|-------|--------|
| Build command | `npm ci && npx playwright install chromium && npm run build` |
| Output directory | `dist` |
| Node | 18+ recomendado |

Arquivos em `dist/juntar-pdf/index.html` têm prioridade sobre qualquer fallback SPA.

## Limitações

- Requer Chromium no ambiente de build (~200 MB download na 1ª vez).
- HTML capturado inclui UI atual (banner de privacidade, placeholders de ad, cookie se visível).
- Conteúdo que só existe após upload/processamento do usuário **não** é pré-renderizado.
- Não é hidratação SSR: pode haver um breve re-paint quando o JS monta (aceitável para SEO).
- Service Worker da PWA é bloqueado **durante** o capture; em produção o SW precacheia os HTML gerados.
- Rotas 404 dinâmicas não entram na lista (correto).
