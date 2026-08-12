# PDF Local

Aplicação web utilitária de processamento de PDFs **100% no cliente**. Nenhum arquivo do usuário é enviado a um servidor backend.

## Stack

- **React 18 + Vite** — build estático (`dist/`) publicado como **Cloudflare Worker + Assets**
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

## Build e deploy (fonte de verdade)

**Deploy canônico:** push em `main` → GitHub Actions (`.github/workflows/deploy.yml`) → `npm test` → `npm run build` (prerender) → `validate:prerender` → **`wrangler deploy`** do Worker **`easypdf`** (`wrangler.toml`, `[assets] directory = "./dist"`). Não use `wrangler pages deploy` nem Azure SWA como caminho de produção.

```bash
# Local (prerender completo): instalar Chromium uma vez
npm run playwright:install
npm run build
# Deploy (requer CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID):
npx wrangler deploy
```

`npm run build` = `tsc` + **sitemap** (`scripts/generate-sitemap.mjs`) + `vite build` + **prerender** (`scripts/prerender.mjs`).

A pasta `dist/` contém:
- assets JS/CSS do Vite
- **HTML pré-renderizado por rota** (quando o Playwright sobe) — ex.: `dist/juntar-pdf/index.html`

| Item | Detalhe |
|------|---------|
| Workflow | [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) |
| Trigger | push em `main` + `workflow_dispatch` |
| Deploy | `wrangler deploy` → Worker **`easypdf`** + static assets |
| Secrets | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (+ opcional `CLOUDFLARE_WORKER_NAME=easypdf`) |
| CI | `npm test` **antes** do build; depois `validate:prerender` (7 rotas — ver `docs/PRERENDER.md`) |
| Config | [`wrangler.toml`](wrangler.toml) · [`docs/PRERENDER.md`](docs/PRERENDER.md) |

**Fail-soft:** build sem Chromium (ex.: ambiente pobre) avisa e não quebra o exit code — **não** use isso como deploy de produção SEO. O Action usa `PRERENDER_STRICT=1`.

Pular prerender de propósito: `npm run build:skip-prerender` ou `SKIP_PRERENDER=1 npm run build`.

### Pré-render (SEO)

| Item | Detalhe |
|------|---------|
| Como funciona | Pós-build: server local + Playwright grava HTML por rota |
| Lista de rotas | `scripts/prerender-routes.mjs` |
| Nova rota | 1) `App.tsx` 2) `PRERENDER_ROUTES` 3) build com Playwright |
| Validar | `dist/juntar-pdf/index.html` → `easypdf-prerender`, title, canonical, H1 |
| Produção | GitHub Action + `wrangler deploy` (Worker) |
| SPA client | Inalterada (`createRoot`) |

### Artefatos legados (não são o deploy ativo)

| Arquivo | Status |
|---------|--------|
| `public/staticwebapp.config.json` | **LEGADO Azure SWA** — copiado para `dist/`, ignorado pelo Worker |
| `public/_headers` | Formato original Pages; **no Worker, CSP/HSTS vêm da config de produção** (validar com `curl -sI` no domínio) |

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

- **Formato canônico: SEM barra final** (exceto home `/`). Ex.: `https://easypdflocal.com.br/juntar-pdf`.
- `index.html` tem canonical **self-referencing da home** (visível sem JS).
- Rotas internas: `useSEO` / `<Seo path="…" />` atualizam `<link rel="canonical">` e `og:url` no cliente; o prerender grava o mesmo no HTML estático.
- **Worker Assets:** `html_handling = "drop-trailing-slash"` em `wrangler.toml` — `/rota` = 200 com HTML prerender; `/rota/` redireciona para `/rota`. Ver [`docs/PRERENDER.md`](docs/PRERENDER.md) § Trailing slash.
- **Sitemap:** gerado no build a partir de `tools.ts` (ready) + `blogPosts.ts` + páginas institucionais — `npm run sitemap` ou via `npm run build`. Ver [`docs/SITEMAP.md`](docs/SITEMAP.md).
- Prerender multi-page: HTML por rota quando Playwright está disponível (CI de produção).

## Monetização

Placeholders com classe `adsense-slot` e `data-adsense-placement`:

- laterais (desktop): `sidebar-left`, `sidebar-right`
- abaixo do CTA (mobile): `below-cta`

## Licença

Uso livre para o projeto do autor.
