# Quando o PDF no navegador falha (memória, OCR, celular)

Processar PDF no navegador reduz uma coisa concreta: o arquivo não precisa subir para um servidor *nosso* só para ser unido, comprimido ou lido. Isso não transforma o Chrome no Adobe, nem o celular numa workstation. O Easy PDF Local **recusa** arquivos e operações que costumam derrubar a aba. Este texto documenta esses tetos — os mesmos da validação do código — e o que fazer quando a ferramenta diz não.

Os números abaixo vêm dos limites técnicos do cliente (`FILE_LIMITS`): **50 MB** por arquivo; no juntar, **20** PDFs e cerca de **80 MB** somados; **OCR 30 páginas**; **compressão 50 páginas**. Operações mais leves (dividir, girar, etc.) têm uma proteção extra na casa de **~150 páginas**. Não são cotas de “plano grátis”. Não existe modo ilimitado nesta suíte.

Para o modelo (o que sobe, o que não sobe, cookies), o hub é [PDF sem upload](/pdf-sem-upload).

## O que “local” garante e o que não garante

**Garante, no fluxo das tools:** o PDF, DOCX ou imagem que você seleciona fica na memória da aba enquanto a operação corre. O download parte do dispositivo. Fechar a aba libera essa memória. Não criamos uma cópia do documento num pipeline nosso de conversão.

**Não garante:**

- que qualquer tamanho de arquivo “cabe” no aparelho;
- que OCR de scan ruim vira texto perfeito;
- que comprimir preserve texto selecionável;
- que o celular de 4 GB de RAM se comporte como um desktop;
- trilha de auditoria corporativa, DLP ou parecer de LGPD.

A rede ainda existe para carregar a página, os scripts e, na primeira vez do OCR, o modelo de idioma. Anúncios e métricas, quando ativos, são navegação — não leem o conteúdo do arquivo na ferramenta. Depois do download, e-mail, Drive e WhatsApp continuam sendo decisão sua.

Quem procura um conversor “que nunca recusa” está procurando **outro produto**: servidor com fila, disco e, em geral, upload. Aqui a recusa é o produto funcionando.

## Arquivo grande / muita página — o que a UI recusa e por quê

Antes de processar, a validação no cliente mede tamanho (e, em alguns fluxos, quantidade e páginas). Se passar do teto, a operação **não começa**. Isso evita o cenário clássico: a aba congela, o telefone esquenta, às vezes o sistema mata o navegador.

Na prática:

- **Qualquer arquivo** acima de **50 MB** é recusado no seletor.
- **Juntar PDF** (e o empacotamento de várias imagens): até **20** arquivos e cerca de **80 MB** no total da fila, além dos 50 MB por item.
- **Comprimir:** até **50 páginas** — cada uma vira bitmap.
- **OCR:** até **30 páginas** no modo Tesseract + canvas.
- **Girar, dividir, remover páginas** e afins: proteção extra em torno de **150 páginas**. Em aparelho fraco, o teto teórico ainda pode ser demais.

Por que esses números e não “o máximo que o JS aguenta”? Porque o heap típico de um navegador no celular é estreito, e PDF rasterizado **multiplica** o tamanho em RAM. Um scan de 40 MB no disco não é 40 MB no canvas. Recusar cedo é mais honesto do que deixar a aba morrer no meio da barra de progresso.

O que fazer quando a UI recusa:

1. **Lotes.** Junte 8 arquivos, baixe, junte o resultado com o próximo lote.
2. **Menos páginas.** Extraia o capítulo que importa; comprima ou faça OCR só nesse trecho.
3. **Menos resolução.** Foto de 12 MP no PDF de comprovante raramente precisa de 12 MP.
4. **Outro computador.** O mesmo PDF que falha no telefone muitas vezes passa no desktop.

Não adianta recarregar a página e esperar um “modo turbo”. O teto é o mesmo.

## OCR em scan vs texto nativo

Extrair texto não é uma operação só. Há dois caminhos, e misturá-los gera decepção.

**Texto nativo.** O PDF já tem uma camada de caracteres (exportado de Word, de um sistema, de uma impressora virtual). A extração lê essa camada. É relativamente leve. Se o modo nativo devolver vazio, o arquivo provavelmente é **imagem de página** — foto, scan, “imprimir para PDF” que rasterizou tudo.

**OCR.** Cada página vira figura; o Tesseract (português, no próprio site) tenta ler. Isso usa CPU e RAM de verdade. Por isso o teto é **30 páginas**, não 150. Acima disso a ferramenta bloqueia.

OCR falha — ou erra feio — quando:

- o scan está torto, escuro, ou com carimbo em cima da letra;
- a letra é manuscrita;
- a tabela é densa e o que você queria era “excel”, não um parágrafo torto;
- você forçou OCR num PDF que **já tinha** texto nativo (mais lento, pior qualidade).

O modelo de idioma baixa na primeira vez (asset público em `/tesseract/`). Isso não é o seu PDF indo para a nuvem. Continua sendo trabalho pesado **no aparelho**.

Se o documento tem 80 páginas de scan, este site não é o leitor. Use um programa de OCR no desktop, ou recorte as 10 páginas que importam e rode o OCR só nelas — [Extrair texto](/extrair-texto) existe para o segundo caso, não para o livro inteiro.

## Comprimir: página vira imagem

Comprimir aqui **não** é o mesmo que “otimizar fontes e streams” de um Distiller. O fluxo desenha cada página e grava JPEG no PDF novo. Consequências honestas:

- o arquivo **pode** ficar menor, sobretudo em scan inflado;
- o texto em geral **deixa de ser selecionável e pesquisável**;
- vetores e tipografia viram bitmap; no nível alto a perda de nitidez é visível;
- PDF **já leve** (texto nativo, pouca imagem) encolhe pouco — a interface mostra o tamanho real.

Teto: **50 MB** e **50 páginas**. É a operação mais cara da suíte. No celular, 40 páginas de scan em “alta” é convite a travar mesmo dentro do limite.

Se você precisa manter texto pesquisável (contrato para buscar cláusula, apostila para copiar citação), **não comprima neste modo**. Se o e-mail só aceita 8 MB e o scan tem 25 MB, o trade-off pode valer — desde que você aceite o JPEG. A ferramenta é [Comprimir PDF](/comprimir-pdf).

## Celular vs desktop (RAM)

O mesmo teto de 50 MB “cabe” de formas diferentes:

- **Desktop** com 16 GB e aba única: merge de 15 PDFs leves e compressão de 30 páginas costumam terminar.
- **Celular** com 4–6 GB, WhatsApp aberto, PWA no Safari/Chrome: o teto de páginas ainda pode ser alto demais. Canvas + Tesseract competem com o resto do sistema. O navegador mata a aba sem uma mensagem bonita.

Regras de bolso, não milagre:

- no telefone, prefira **menos arquivos por vez** e **menos páginas** no OCR/compressão;
- se a barra de progresso parar e o aparelho esquentar, cancele e tente no computador;
- “funciona no celular” nesta suíte significa *navegador atualizado, arquivo pequeno*, não *substitui o app nativo para dossiê*.

O limite de **20** arquivos no merge também é defesa de RAM: vinte PDFs abertos na memória não são vinte ícones na lista.

## Quando faz sentido NÃO usar este site

Use **outro caminho** quando:

- o arquivo passa de **50 MB**, ou o merge passaria de **80 MB** / **20** itens, e você não pode fatiar;
- precisa OCR de dezenas de páginas com qualidade de produção;
- precisa **editar** layout (Adobe, LibreOffice, app nativo), não só girar/unir/recortar;
- a política da empresa **exige** ferramenta homologada, log de quem mexeu, pasta de rede;
- o DOCX é diagramação complexa e o PDF “quase igual ao Word” é requisito, não desejo;
- você está no ônibus, com 15% de bateria, tentando comprimir 50 páginas de exame.

Nesses casos: Acrobat ou equivalente no PC, app de PDF do fabricante, máquina com mais RAM, ou o conversor interno que o TI já aprovou. Upload para um serviço de nuvem *contratado* pela organização é uma decisão de arquitetura — diferente de jogar o dossiê no primeiro “pdf online” do Google. Este artigo não declara o Easy PDF Local vencedor em todos os cenários. Declara **onde ele para**.

## FAQ: quando a ferramenta recusa

**Por que 50 MB se o meu PDF “não é tão grande”?**  
50 MB no disco ainda pode explodir em RAM na rasterização. O teto é de estabilidade, não de marketing.

**A compressão falhou ou quase não reduziu. Está quebrada?**  
PDFs de texto nativo já compactos quase não encolhem. Scans pesados encolhem mais — e perdem texto selecionável. Olhe os megabytes na tela, não a expectativa de “sempre 90% menor”.

**Posso forçar OCR nas 80 páginas se eu esperar?**  
Não neste site. O fluxo de OCR para em **30 páginas**. Divida o arquivo ou use OCR de desktop.

**O celular travou mesmo abaixo do limite. É bug?**  
Pode ser teto de RAM do aparelho, não do número na validação. Feche abas, tente menos páginas, ou use um computador. O site não inventa memória.

## O que fazer agora

Se a tarefa **cabe** nos tetos: processe, pré-visualize, baixe. Se **não cabe**, não insista na mesma aba.

- Modelo e limites gerais: [PDF sem upload](/pdf-sem-upload)
- Scan pesado que ainda cabe em 50 páginas: [Comprimir PDF](/comprimir-pdf)
- Texto de um trecho de scan (até 30 páginas): [Extrair texto](/extrair-texto)

Local é uma restrição consciente: menos uma cópia em trânsito, **e** menos capacidade do que um servidor. Os dois lados da frase são verdade.
