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

## Fail-soft no CI (Cloudflare Pages)

O Cloudflare **não** oferece `sudo` / `playwright install-deps`. O Chromium do Playwright costuma falhar ao lançar por **libs de sistema ausentes**.

Comportamento de `scripts/prerender.mjs`:

| Situação | Local (Playwright OK) | CI (`CF_PAGES` / `CI` / …) |
|----------|------------------------|----------------------------|
| Chromium lança e todas as rotas OK | exit 0, HTML por rota | exit 0, HTML por rota |
| Chromium **não lança** (deps / browser missing) | exit 1 (corrija install) | **exit 0 + AVISO** — deploy com SPA Vite |
| Browser OK, mas rota falha (title/H1/canonical) | exit 1 | exit 1 (bug de conteúdo) |
| `SKIP_PRERENDER=1` | pula, exit 0 | pula, exit 0 |

### Variáveis de ambiente

| Variável | Efeito |
|----------|--------|
| `SKIP_PRERENDER=1` | Não tenta Playwright |
| `PRERENDER_SOFT=1` | Fail-soft de browser **também em máquina local** |
| `PRERENDER_STRICT=1` | Fail **hard** mesmo em CI se o browser não subir |
| `PRERENDER_PORT` | Porta do server local (default `4179`) |

Detecção de CI (entre outras): `CI`, `CF_PAGES`, `CF_PAGES_COMMIT_SHA`, `GITHUB_ACTIONS`, `VERCEL`, `GITLAB_CI`.

### Log típico no Cloudflare (browser não sobe)

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

O `npm run build` termina com **sucesso**; o site no ar continua SPA (canonical/title via JS + o que o Googlebot renderizar).

### Build command recomendado (Cloudflare Pages)

```bash
npm ci && npm run build
```

Opcional (baixa o browser, mas **ainda pode falhar** sem libs do SO — o fail-soft cobre isso):

```bash
npm ci && npx playwright install chromium && npm run build
```

**Não** dependa de `playwright install-deps` no Cloudflare (sem sudo).

### Gerar HTML pré-renderizado “de verdade” (recomendado: GitHub Actions)

O painel Cloudflare **não** é o lugar certo para o prerender. Use o workflow:

**`.github/workflows/deploy.yml`**

1. Roda em `mcr.microsoft.com/playwright:v1.49.1-jammy` (Chromium + libs).
2. `npm ci` → `npm run build` com `PRERENDER_STRICT=1` (sem fail-soft).
3. `npm run validate:prerender` (exige `easypdf-prerender` + title/canonical em rotas-chave).
4. `wrangler pages deploy dist` com secrets.

#### Secrets no GitHub

Repo → **Settings** → **Secrets and variables** → **Actions** → New repository secret:

| Secret | Onde obter |
|--------|------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → Create Token → template **Edit Cloudflare Pages** (ou custom: Account → Cloudflare Pages → Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | Dashboard → qualquer domínio/Workers → sidebar **Account ID** |
| `CLOUDFLARE_PAGES_PROJECT_NAME` | *(opcional)* Nome do projeto Pages (default no workflow: `easypdflocal`) |

#### Desative o deploy automático duplicado no Cloudflare

Se o projeto Pages estiver ligado ao GitHub com **Builds** ativos, o CF pode fazer um segundo deploy (`npm run build` **sem** Chromium) e **sobrescrever** o dist pré-renderizado do Action.

No painel **Cloudflare Pages → seu projeto → Settings → Builds & deployments**:

1. **Desative builds automáticos** (Disconnect do repositório **ou** pause automatic deployments), **ou**
2. Mantenha o repo só para o **GitHub Action** fazer o deploy via Wrangler (recomendado).

Não commite a pasta `dist/` no git.

#### Validar após o primeiro Action verde

1. GitHub → Actions → workflow verde.
2. Abra `https://easypdflocal.com.br/juntar-pdf` → **Ver código-fonte** (não Inspecionar).
3. Deve conter:
   - `<!-- easypdf-prerender: /juntar-pdf -->`
   - `<title>` com “Juntar PDF” (não só o title genérico da home)
   - `canonical` …`/juntar-pdf`
   - `<h1>` da ferramenta
4. Se ainda for shell da home: o deploy do painel CF está ganhando do Action — desative o build automático do painel.

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
4. Se for post de blog: `blogPosts.ts` + `src/data/posts/{slug}.md` + path `/blog/{slug}`.
5. `npm run build` (local com Chromium) e confira `dist/.../index.html`.

## Validar

```bash
# Marcador + title + canonical (após prerender bem-sucedido)
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

- No Cloudflare, o fail-soft pode deixar o deploy **sem** HTML por rota (SEO menos ideal, site funciona).
- HTML capturado inclui UI atual (banner de privacidade, placeholders de ad, cookie se visível).
- Conteúdo que só existe após upload/processamento do usuário **não** é pré-renderizado.
- Não é hidratação SSR: pode haver um breve re-paint quando o JS monta.
- Service Worker da PWA é bloqueado **durante** o capture; em produção o SW precacheia os HTML gerados (quando existirem).
- Rotas 404 dinâmicas não entram na lista (correto).
