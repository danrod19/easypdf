# Fontes locais (self-host)

## Inter

Arquivos em `public/fonts/inter/`:

| Arquivo | Peso | Uso no site |
|---------|------|-------------|
| `inter-latin-400-normal.woff2` | 400 | Corpo / default |
| `inter-latin-500-normal.woff2` | 500 | `font-medium` |
| `inter-latin-600-normal.woff2` | 600 | `font-semibold` |
| `inter-latin-700-normal.woff2` | 700 | `font-bold` |
| `inter-latin-800-normal.woff2` | 800 | `font-extrabold` (logo, destaques) |

Subset **latin** (woff2). Declarados em `src/index.css` com `font-display: swap`.

Origem dos arquivos: [Fontsource Inter](https://fontsource.org/fonts/inter) (licença OFL).

## Adicionar um peso novo

1. Baixe o woff2 latin, por exemplo:
   ```bash
   # PowerShell (exemplo peso 300)
   Invoke-WebRequest `
     -Uri "https://cdn.jsdelivr.net/fontsource/fonts/inter@5.2.5/latin-300-normal.woff2" `
     -OutFile "public/fonts/inter/inter-latin-300-normal.woff2"
   ```
2. Adicione um bloco `@font-face` em `src/index.css` (mesmo `unicode-range`, `font-display: swap`).
3. Use no Tailwind (`font-light` = 300, etc.).
4. Não reintroduza `fonts.googleapis.com` / `fonts.gstatic.com`.

## Validar

DevTools → Network → filtro `font` ou `googleapis`:

- Deve aparecer `/fonts/inter/*.woff2` na mesma origem.
- **Nenhuma** requisição a `fonts.googleapis.com` ou `fonts.gstatic.com`.
