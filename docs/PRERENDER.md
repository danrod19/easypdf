# Pré-renderização (SEO) — Easy PDF Local

## Por que existe

A app é uma SPA (Vite + React Router). Sem prerender, qualquer URL (`/juntar-pdf`, etc.) devolve o mesmo `index.html` da home até o JavaScript rodar. Crawlers e sites novos indexam pior.

## Trailing slash (regra canônica)

**Formato canônico: SEM barra final**, exceto a home `/`.

| Superfície | Formato |
|------------|--------|
| `normalizeSeoPath` / `buildCanonicalUrl` (`src/data/seo.ts`) | `/juntar-pdf` |
| `canonical` + `og:url` (prerender + runtime) | `https://easypdflocal.com.br/juntar-pdf` |
| `scripts/prerender-routes.mjs` | `/juntar-pdf` (sem `/` final) |
| `public/sitemap.xml` (gerado) | `…/juntar-pdf` |
| Links React Router (`<Link to=…>`) | sem barra final |

### Por que o 307 acontecia em produção

O prerender grava **pastas** `dist/{rota}/index.html` (padrão estático comum).

No Cloudflare Workers **Assets**, o default é:

```toml
html_handling = "auto-trailing-slash"   # implícito se omitido
```

Com isso a plataforma trata o *folder index* como URL **com** barra:

| Request | Resposta (auto) |
|---------|-----------------|
| `/juntar-pdf` | **307** → `/juntar-pdf/` |
| `/juntar-pdf/` | **200** + HTML prerender |

Enquanto o HTML 200 tinha `canonical` **sem** barra → GSC: “Página alternativa com tag canônica adequada” na variante com `/`, e “redirecionamento” na sem `/`. **URL final ≠ canonical.**

### Decisão e correção (wrangler)

Não é inviável servir 200 sem barra: o Workers Assets expõe `drop-trailing-slash`.

```toml
# wrangler.toml
[assets]
directory = "./dist"
html_handling = "drop-trailing-slash"
not_found_handling = "single-page-application"
```

| Request | Resposta (drop-trailing-slash) | Asset |
|---------|--------------------------------|--------|
| `/juntar-pdf` | **200** | `dist/juntar-pdf/index.html` |
| `/juntar-pdf/` | **307** → `/juntar-pdf` | — |

**Limitação da plataforma:** o redirect de trailing slash do Assets é **307** (não 301/308). Para SEO o essencial é: **uma** URL final (sem `/`), 200 com HTML prerender, e canonical/sitemap/links iguais a ela. Não inverter para “com barra” só por causa do status 307.

### Validar em produção (após deploy)

```bash
# Canônica (sem barra): 200 + prerender
curl -sI "https://easypdflocal.com.br/juntar-pdf"
# → HTTP/1.1 200

# Variante com barra: redirect para sem barra
curl -sI "https://easypdflocal.com.br/juntar-pdf/"
# → HTTP/1.1 307  Location: /juntar-pdf

# Canonical no HTML 200 (view-source ou):
curl -s "https://easypdflocal.com.br/juntar-pdf" | findstr /i "canonical og:url easypdf-prerender"
# → canonical …/juntar-pdf   (SEM barra no final do path)
# → og:url igual
# → <!-- easypdf-prerender: /juntar-pdf -->
```

**Não aceitar:** 307 sem→com **e** canonical apontando para a outra variante.

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

## Fail-soft no CI (GitHub Actions / Worker)

O deploy de produção **não** usa Cloudflare Pages. O CI oficial é **GitHub Actions** com imagem Playwright (`mcr.microsoft.com/playwright:…`). Em ambientes sem Chromium/libs, o script pode fail-soft.

Comportamento de `scripts/prerender.mjs`:

| Situação | Local (Playwright OK) | CI genérico (sem browser) | Action de produção (`PRERENDER_STRICT=1`) |
|----------|------------------------|---------------------------|------------------------------------------|
| Chromium lança e todas as rotas OK | exit 0, HTML por rota | exit 0, HTML por rota | exit 0, HTML por rota |
| Chromium **não lança** | exit 1 (corrija install) | **exit 0 + AVISO** (SPA Vite) | **exit 1** (não deploya SEO fraco) |
| Browser OK, mas rota falha (title/H1/canonical) | exit 1 | exit 1 | exit 1 |
| `SKIP_PRERENDER=1` | pula, exit 0 | pula, exit 0 | evita no Action de prod |

### Variáveis de ambiente

| Variável | Efeito |
|----------|--------|
| `SKIP_PRERENDER=1` | Não tenta Playwright |
| `PRERENDER_SOFT=1` | Fail-soft de browser **também em máquina local** |
| `PRERENDER_STRICT=1` | Fail **hard** se o browser não subir (usado no Action) |
| `PRERENDER_PORT` | Porta do server local (default `4179`) |

Detecção de CI (entre outras): `CI`, `GITHUB_ACTIONS`, e flags legadas (`CF_PAGES`, `VERCEL`, …) só para fail-soft em ambientes de build estático genéricos.

### Log típico se o browser não sobe (fail-soft)

```text
[prerender] Servindo .../dist em http://127.0.0.1:4179
[prerender] Ambiente: CI | soft-browser-fail: sim
[prerender] ══════════════════════════════════════════════════
[prerender] AVISO: pré-render PULADO (fail-soft) — build NÃO falha
[prerender] Motivo: Chromium/Playwright não lançou (deps de sistema ou browser ausente)
[prerender] Detalhe: ... host system is missing dependencies ...
[prerender] Deploy segue com dist do Vite (SPA). HTML por rota não gerado.
[prerender] Local: npm run playwright:install  |  docs/PRERENDER.md
[prerender] ══════════════════════════════════════════════════
```

Em produção SEO use o **Action com imagem Playwright + `PRERENDER_STRICT=1`**, não o fail-soft.

### Deploy de produção (GitHub Actions + Worker) — caminho ativo

**Deploy canônico:** GitHub Actions → build com Playwright → `validate:prerender` → **`wrangler deploy`** do Worker **`easypdf`** (`wrangler.toml` + `[assets] directory = "./dist"`).

**Não** use `wrangler pages deploy` nem o build command de um projeto Cloudflare Pages como fluxo principal.

| | (Legado / não usar) Pages | **Este projeto (Worker + assets)** |
|--|---------------------------|-------------------------------------|
| Painel | Workers & Pages → tipo Pages | Workers & Pages → Worker **`easypdf`** |
| Deploy CLI | ~~`wrangler pages deploy dist`~~ | **`wrangler deploy`** |
| Config | `pages_build_output_dir` | `wrangler.toml` + `[assets]` |
| Erro se misturar | — | `Project not found [code: 8000007]` com `pages deploy` |

**Workflow:** `.github/workflows/deploy.yml`

1. Container `mcr.microsoft.com/playwright:v1.49.1-jammy`
2. `npm ci` → `npm test` → `PRERENDER_STRICT=1 npm run build`
3. `npm run validate:prerender`
4. **`npx wrangler@3 deploy --name easypdf --config wrangler.toml`**

#### Secrets no GitHub

Repo → **Settings** → **Secrets and variables** → **Actions**:

| Secret | Obrigatório | Valor |
|--------|-------------|--------|
| `CLOUDFLARE_API_TOKEN` | sim | Token com **Account → Workers Scripts → Edit** (e leitura da conta). Template “Edit Cloudflare Workers” ou custom. |
| `CLOUDFLARE_ACCOUNT_ID` | sim | Account ID no dashboard |
| `CLOUDFLARE_WORKER_NAME` | não | Default: **`easypdf`** |

> Token de “só Pages” não publica o Worker `easypdf`.

#### Deploy local (após build com Playwright)

```bash
npm run playwright:install
npm run build
npm run validate:prerender
npx wrangler deploy
# ou: npx wrangler deploy --name easypdf --config wrangler.toml
```

Variáveis de ambiente (shell): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

Não commite a pasta `dist/` no git.

#### Validar após o primeiro Action verde

1. GitHub → Actions → workflow verde (step **Deploy to Cloudflare Worker**).
2. Headers (trailing slash — ver § Trailing slash):
   - `curl -sI https://easypdflocal.com.br/juntar-pdf` → **200**
   - `curl -sI https://easypdflocal.com.br/juntar-pdf/` → **307** `Location: /juntar-pdf`
3. `https://easypdflocal.com.br/juntar-pdf` → **Ver código-fonte**:
   - `<!-- easypdf-prerender: /juntar-pdf -->`
   - `<title>` com “Juntar PDF”
   - `canonical` …`/juntar-pdf` (**sem** barra final)
   - `og:url` igual à canonical
   - `<h1>` da ferramenta
4. Se ainda for shell da home: outro pipeline antigo pode estar sobrescrevendo — use só este Action + `wrangler deploy` no Worker `easypdf`.
5. Se ainda redirecionar **sem**→**com** barra: confira `html_handling = "drop-trailing-slash"` no `wrangler.toml` deployado.

#### Local (alternativa)

```bash
npm run playwright:install
npm run build
npm run validate:prerender
# confira dist/juntar-pdf/index.html
```

## Comandos

```bash
# 1ª vez (local)
npm run playwright:install

# Build completo (tsc + vite + prerender)
npm run build

# Só prerender (dist já existe)
npm run prerender

# Build sem tentar Playwright
npm run build:skip-prerender
# ou
SKIP_PRERENDER=1 npm run build
```

## Adicionar uma rota nova

1. Crie a rota em `src/App.tsx`.
2. (Opcional) SEO em `src/data/seo.ts` / página com `<Seo />`.
3. Adicione o path em `scripts/prerender-routes.mjs` (`PRERENDER_ROUTES`).
4. Se for **tool ready** ou **post de blog**, o sitemap entra automaticamente no build (`npm run sitemap` / `docs/SITEMAP.md`) — não edite `public/sitemap.xml` à mão.
5. Se for post de blog: `blogPosts.ts` + `src/data/posts/{slug}.md` + path `/blog/{slug}`.
6. Se a rota for **crítica para SEO** (top tool, hub, institucional, post pilar), considere adicioná-la a `REQUIRED_CHECKS` em `scripts/validate-prerender.mjs`.
7. `npm run build` (local com Chromium) + `npm run validate:prerender` e confira `dist/.../index.html`.

## Validação CI (`npm run validate:prerender`)

Script: `scripts/validate-prerender.mjs` — **só lê arquivos em `dist/`** (sem browser, ~ms).

Roda no workflow **antes** do `wrangler deploy` (`.github/workflows/deploy.yml`).  
Se qualquer check falhar → **exit 1** → deploy não sobe.

### Checklist obrigatório

| Rota | O que exige |
|------|-------------|
| `/` | marker `easypdf-prerender: /`, title com “Easy PDF Local”, canonical `…/` |
| `/juntar-pdf` | marker, title com “Juntar”, H1 com “Juntar”, canonical **sem** barra |
| `/comprimir-pdf` | idem (Comprimir) |
| `/word-para-pdf` | idem (Word) |
| `/pdf-sem-upload` | title “sem Upload”, H1 com “upload”, canonical hub |
| `/sobre` | title/H1 “Sobre” |
| `/blog/juntar-pdf-online-sem-upload` | title “Juntar PDF”, corpo de artigo (não “Carregando…”), canonical do post |

Em **todas** (exceto home): title **não** pode ser o genérico da home  
(`Easy PDF Local | Ferramentas de PDF 100% Seguras…`).

Canonical: path **sem trailing slash** (exceto `/`), host `easypdflocal.com.br`.

Não valida as ~32 rotas de `prerender-routes.mjs` linha a linha (frágil e ruidoso).  
O mínimo acima cobre home, top tools, hub, institucional e 1 post — o que o GSC/AdSense mais usam. Amostragem extra é opcional (adicione em `REQUIRED_CHECKS` no script se precisar).

### Como rodar

```bash
# Após build com Playwright
npm run build
npm run validate:prerender

# Só o validador (dist já existe)
npm run validate:prerender
```

### Exemplo de falha

```text
[validate-prerender] ✗ /word-para-pdf (word-para-pdf/index.html): arquivo ausente — prerender não gerou HTML …
[validate-prerender] ✗ /sobre (sobre/index.html): title é o genérico da home ("Easy PDF Local | Ferramentas…")
[validate-prerender] FALHA: 2 problema(s) em 2/7 rota(s).
```

### Smoke manual (opcional)

```bash
# Marcador + title + canonical
findstr /i "easypdf-prerender title canonical" dist\juntar-pdf\index.html

# Não deve haver host de build
findstr /i "127.0.0.1" dist\juntar-pdf\index.html
# (esperado: sem matches)
```

Preview local (após build):

```bash
npx serve dist
# abra http://localhost:3000/juntar-pdf e “Ver código-fonte”
```

## Limitações

- Fora do Action oficial, o fail-soft pode deixar o `dist` **sem** HTML por rota (SEO menos ideal; o site SPA ainda funciona).
- HTML capturado inclui UI atual (banner de privacidade, placeholders de ad, cookie se visível).
- Conteúdo que só existe após upload/processamento do usuário **não** é pré-renderizado.
- Não é hidratação SSR: pode haver um breve re-paint quando o JS monta.
- Service Worker da PWA é bloqueado **durante** o capture; em produção o SW precacheia os HTML gerados (quando existirem).
- Rotas 404 dinâmicas não entram na lista (correto).
