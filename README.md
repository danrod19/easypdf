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

## Build estático (Azure SWA)

```bash
npm run build
```

A pasta `dist/` contém os arquivos estáticos. O `public/staticwebapp.config.json` configura o fallback de SPA para deep-links.

### Azure Static Web Apps

- **App location**: `/` (raiz do repo ou `pdf-local`)
- **Output location**: `dist`
- **API location**: (vazio — sem backend)

## Privacidade

Banner fixo em todas as páginas:

> Processamento 100% local. Seus arquivos não são enviados para nenhum servidor.

## Monetização

Placeholders com classe `adsense-slot` e `data-adsense-placement`:

- laterais (desktop): `sidebar-left`, `sidebar-right`
- abaixo do CTA (mobile): `below-cta`

## Licença

Uso livre para o projeto do autor.
