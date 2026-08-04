# PDF Local

Aplicação web utilitária de processamento de PDFs **100% no cliente**. Nenhum arquivo do usuário é enviado a um servidor backend.

## Stack

- **React 18 + Vite** — build estático puro (Azure Static Web Apps)
- **Tailwind CSS** — UI moderna, responsiva, Dark/Light mode
- **pdf-lib** — merge, split, rotação e metadados
- **mammoth.js** — DOCX → HTML (Word para PDF)
- **jsPDF / html2pdf.js** — HTML → PDF (Word para PDF)
- **tesseract.js** — OCR (preparado)

## Rotas

| Rota | Função | Status |
|------|--------|--------|
| `/` | Home | ✅ |
| `/juntar-pdf` | Merge de PDFs | ✅ completo |
| `/dividir-pdf` | Split | ✅ completo |
| `/word-para-pdf` | DOCX → PDF | ✅ completo (mammoth + html2pdf.js) |
| `/imagem-para-pdf` | JPG/PNG → PDF | ✅ completo |
| `/extrair-texto` | OCR | ✅ completo |
| `/proteger-pdf` | PDF + senha | ✅ completo (pdf-lib-plus-encrypt) |
| `/desbloquear-pdf` | Remover senha | ✅ completo (pdf.js + pdf-lib) |
| `/remover-paginas` | Excluir páginas | ✅ completo (thumbs + pdf-lib) |
| `/comprimir-pdf` | Reduzir tamanho | ✅ completo (raster pdf.js + pdf-lib) |

## Desenvolvimento

```bash
cd pdf-local
npm install
npm run dev
```

## Build estático (Cloudflare Pages / Azure SWA)

```bash
# Local (prerender completo): instalar Chromium uma vez
npm run playwright:install
npm run build
```

`npm run build` = `tsc` + **sitemap** (`scripts/generate-sitemap.mjs`) + `vite build` + **prerender** (`scripts/prerender.mjs`).

A pasta `dist/` contém:
- assets JS/CSS do Vite
- **HTML pré-renderizado por rota** (quando o Playwright sobe) — ex.: `dist/juntar-pdf/index.html`

### Deploy em produção (HTML por rota de verdade)

**Este site roda como Cloudflare Worker + static assets** (`wrangler.toml`, Worker **`easypdf`**), **não** como projeto Cloudflare Pages.

| Item | Detalhe |
|------|---------|
| Workflow | [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) |
| Trigger | push em `main` + `workflow_dispatch` |
| Deploy | `wrangler deploy` (Worker) — **não** `wrangler pages deploy` |
| Secrets | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (+ opcional `CLOUDFLARE_WORKER_NAME=easypdf`) |
| Validação | `npm run validate:prerender` |
| Docs | [`docs/PRERENDER.md`](docs/PRERENDER.md) · [`wrangler.toml`](wrangler.toml) |

**Fail-soft:** build sem Chromium (ex.: ambiente pobre) avisa e não quebra o exit code — **não** use isso como deploy de produção SEO. O Action usa `PRERENDER_STRICT=1`.

Pular prerender de propósito: `npm run build:skip-prerender` ou `SKIP_PRERENDER=1 npm run build`.

### Pré-render (SEO)

| Item | Detalhe |
|------|---------|
| Como funciona | Pós-build: server local + Playwright grava HTML por rota |
| Lista de rotas | `scripts/prerender-routes.mjs` |
| Nova rota | 1) `App.tsx` 2) `PRERENDER_ROUTES` 3) build com Playwright |
| Validar | `dist/juntar-pdf/index.html` → `easypdf-prerender`, title, canonical, H1 |
| Produção | GitHub Action (não o build command do painel CF) |
| SPA client | Inalterada (`createRoot`) |

### Azure Static Web Apps

- **App location**: `/` (raiz do repo ou `pdf-local`)
- **Output location**: `dist`
- **API location**: (vazio — sem backend)
- `public/staticwebapp.config.json` — fallback SPA só quando o arquivo da rota **não** existe (prerender tem prioridade)

## Privacidade

Banner fixo em todas as páginas:

> Processamento 100% local. Seus arquivos não são enviados para nenhum servidor.

## Performance (Web Workers)

| Operação | Thread | Abort no unmount |
|----------|--------|------------------|
| Juntar PDF | Web Worker (`pdfWorker`) + fallback main | ✅ |
| Girar PDF | Web Worker + fallback main | ✅ |
| Dividir PDF | Web Worker + fallback main | ✅ |
| Comprimir PDF | **Main thread** (pdf.js + canvas; sem OffscreenCanvas no worker genérico) | ✅ (cancela entre páginas) |
| Extrair texto / OCR | Main + Tesseract worker (abort) | ✅ |

Helpers: `src/lib/runPdfWorker.ts`, `src/lib/pdfOpsWorker.ts`, `src/lib/mergePdfsWorker.ts`.

### Limitações documentadas

- Compressão **não** usa o worker pdf-lib: depende de Canvas 2D + pdf.js no DOM.
- Abort em compressão é cooperativo (entre páginas), não mid-render de uma página.
- Fallback na main thread se o Worker falhar (ex.: ambiente sem `Worker`).

## SEO / Canonical (SPA)

- `index.html` tem canonical **self-referencing da home** (visível sem JS).
- Rotas internas: `useSEO` / `<Seo path="…" />` atualizam `<link rel="canonical">` e `og:url` no cliente para a URL absoluta correta (`https://easypdflocal.com.br/…`).
- Deploy estático (Cloudflare Pages / SWA): **sem HTML pré-renderizado por rota**; crawlers que não executam JS veem a canonical da home. Googlebot com JS vê a canonical por rota.
- **Sitemap:** gerado no build a partir de `tools.ts` (ready) + `blogPosts.ts` + páginas institucionais — `npm run sitemap` ou via `npm run build`. Ver [`docs/SITEMAP.md`](docs/SITEMAP.md).
- Prerender multi-page: HTML por rota quando Playwright está disponível (CI de produção).

## Monetização

Placeholders com classe `adsense-slot` e `data-adsense-placement`:

- laterais (desktop): `sidebar-left`, `sidebar-right`
- abaixo do CTA (mobile): `below-cta`

## Licença

Uso livre para o projeto do autor.
