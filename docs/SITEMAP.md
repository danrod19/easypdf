# Sitemap (gerado no build)

O arquivo `public/sitemap.xml` **não deve ser editado à mão** como lista de rotas.
Ele é gerado por `scripts/generate-sitemap.mjs` a partir das fontes de verdade do código.

## Como gerar

```bash
npm run sitemap
# ou como parte do build:
npm run build
```

Pipeline de build:

1. `tsc --noEmit`
2. **`generate-sitemap.mjs`** → grava `public/sitemap.xml`
3. `vite build` (copia `public/` → `dist/`, incluindo o sitemap)
4. `prerender.mjs` (HTML por rota; não altera o sitemap)

Se `dist/` já existir quando o script roda, também atualiza `dist/sitemap.xml`
(útil ao rodar `npm run sitemap` isolado após um build).

## Fontes de URL

| Fonte | O que entra |
|--------|-------------|
| Lista estática no script | `/`, `/pdf-sem-upload`, `/blog`, `/sobre`, `/contato`, `/privacidade`, `/termos` |
| `src/data/tools.ts` | Paths com `status: 'ready'` |
| `src/data/blogPosts.ts` | `/blog/{slug}` para cada post |

Ordem no XML: **home + institucionais → tools (A–Z) → posts (slug A–Z)**.

## lastmod / priority

- **Posts:** `lastmod` = `dateModified` se existir, senão `date` (YYYY-MM-DD).
- **Tools e páginas estáticas:** sem `lastmod` (evita data de build artificial).
- **priority / changefreq:** honestos (home 1.0; hub e tools top 0.9; demais tools 0.8; blog posts 0.65; legal ~0.4).

## Nova tool ou post

1. Crie a rota em `App.tsx` (e a página).
2. **Tool:** adicione em `tools.ts` com `status: 'ready'`.
3. **Post:** adicione em `blogPosts.ts` + markdown em `src/data/posts/`.
4. Rode `npm run build` (ou `npm run sitemap`).
5. (SEO HTML) Inclua a rota em `scripts/prerender-routes.mjs` se quiser pré-render.

Não invente URLs no sitemap que não existam no router.

## Validar

```bash
npm run sitemap
# Conferir:
# public/sitemap.xml
# (após build) dist/sitemap.xml

# Deve conter origem canônica:
findstr /i "easypdflocal.com.br/juntar-pdf" public\sitemap.xml
findstr /i "easypdflocal.com.br/blog/" public\sitemap.xml
```

Origem fixa: `https://easypdflocal.com.br` (igual a `SITE_ORIGIN` em `src/data/seo.ts`).

## Trailing slash

Todas as `<loc>` (exceto a home `…/`) são **sem barra final**, alinhadas a:

- `normalizeSeoPath` / `buildCanonicalUrl` em `src/data/seo.ts`
- `scripts/prerender-routes.mjs`
- `html_handling = "drop-trailing-slash"` em `wrangler.toml` (URL final 200 sem `/`)

Detalhes e checklist de produção: [`docs/PRERENDER.md`](./PRERENDER.md) § Trailing slash.
