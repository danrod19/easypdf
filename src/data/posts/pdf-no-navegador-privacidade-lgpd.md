# PDF no navegador: privacidade, documentos e LGPD

Há uma diferença prática, e fácil de ignorar, entre **abrir um site de PDF** e **enviar o arquivo para alguém processar**. No primeiro caso, o navegador baixa uma página e uns scripts. No segundo, o conteúdo do contrato, do exame ou do comprovante atravessa a internet e fica, por algum tempo, num servidor que você não administra.

Este texto trata dessa diferença no dia a dia — trabalho, documentos pessoais e a Lei Geral de Proteção de Dados (LGPD) — sem transformar o tema em pânico jurídico e sem vender o processamento local como solução universal. O Easy PDF Local é um conjunto de ferramentas que rodam no navegador. Elas ajudam em muita coisa. Também falham, e isso entra no mesmo raciocínio.

Se você quer o resumo operacional do modelo (o que sobe, o que não sobe, cookies), o ponto de partida é o hub [PDF sem upload](/pdf-sem-upload).

## O que “processar no navegador” quer dizer na prática

Quando um conversor clássico pede *upload*, o fluxo costuma ser: você escolhe o arquivo → ele vai para um servidor → o serviço junta, comprime ou converte → você baixa o resultado. Funciona. É o modelo de quase todo “PDF online” antigo. O custo invisível é a **cópia fora do seu aparelho** durante o processamento — e, dependendo do fornecedor, o tempo em que essa cópia permanece, os logs, o subprocessador, o país do data center.

No modelo local, o navegador baixa o *programa* (HTML, JavaScript, às vezes WebAssembly). O PDF, o DOCX ou a imagem que você seleciona fica na memória da aba. A união de páginas, a rotação ou a extração de texto acontecem no seu CPU. O download do resultado parte do dispositivo.

Isso não significa “zero internet”. A primeira visita precisa da rede para carregar o site. No OCR, o modelo de idioma em português também é baixado do próprio site na primeira vez. Anúncios e métricas, quando ativos e com o consentimento exigido, tratam de *navegação* — não leem o conteúdo do PDF que está na ferramenta. A distinção que importa para o documento é outra: **o arquivo de trabalho não sobe para um pipeline nosso de conversão**.

E-mail, WhatsApp e Drive depois do download continuam sendo decisões suas. Processar localmente reduz uma exposição específica (o conversor de terceiros). Não apaga as outras.

## Upload vs. arquivo que fica no aparelho

“Subir um PDF” vira problema quando o arquivo **não é inofensivo**: contrato de cliente, laudo, holerite, exame, IR, procuração — ou quando a política do trabalho já trata conversor online como destino não aprovado.

A pergunta útil não é “o site é HTTPS?”. HTTPS protege o *trânsito*. Não decide se o operador deveria ter visto o arquivo, por quanto tempo, nem se um incidente lá vira incidente seu.

O processamento no navegador responde de forma estreita: durante a operação, o conteúdo não precisa atravessar a WAN só para ser manipulado. Se a tarefa exige OCR de livro inteiro ou layout de editora, o navegador provavelmente não é a ferramenta certa — aí um software instalado, ou o fluxo interno da empresa, faz mais sentido.

## Trabalho: contratos, laudos e política interna

No expediente, PDF é o formato do “manda aí”. Proposta + anexos, dossiê de admissão, comprovante para reembolso, capítulo de apostila, scan de identidade. A pressa empurra para o primeiro Google de “juntar pdf online”.

Três critérios práticos, sem jargão de compliance:

- **Quem é o titular dos dados na folha?** Se há CPF, saúde, salário, menor de idade, segredo industrial, trate o upload para conversor genérico como exceção, não como padrão.
- **A empresa já tem ferramenta homologada?** Se o jurídico ou o TI indicam um caminho, use esse caminho. Um site local na internet pública não substitui política interna, DLP nem pasta de rede.
- **O que você precisa fazer cabe no navegador?** Unir dez PDFs leves, girar um scan, tirar duas páginas — sim, na maior parte dos desktops. Comprimir um dossiê de 80 páginas no celular da empresa no intervalo — provavelmente não.

O Easy PDF Local não pede conta para as ferramentas principais. Isso é conveniente e também é um lembrete: **não há pasta na nuvem nossa com o seu dossiê**. O arquivo que importa é o que está no disco, no download e no e-mail que você for mandar depois. Se a política da firma exige registro de quem mexeu no documento, um site sem login não gera essa trilha — e não deveria fingir que gera.

Para unir anexos sem mandar o pacote a um merge remoto, a operação direta é [Juntar PDF](/juntar-pdf).

## Documentos pessoais: o que costuma ser demais para a nuvem alheia

Fora do trabalho o critério muda, mas o mecanismo é o mesmo. Pessoas usam conversor online para:

- juntar RG, comprovante e formulário de matrícula;
- comprimir exame para caber no e-mail do convênio;
- extrair texto de um boleto ou de um contrato de aluguel;
- colocar senha num PDF antes de enviar.

Nada disso é crime nem descuido automático. O ponto é proporcionalidade. Um flyer de evento numa ferramenta com upload é uma coisa. Um PDF com endereço, documento e dado de saúde é outra.

O modelo local não “anonimiza” o arquivo. Ele só evita **mais um intermediário** no momento de editar ou converter. Depois que você baixa o resultado, o risco volta a ser o canal seguinte: e-mail sem senha, grupo de família, nuvem pessoal com link público.

Se o objetivo for só reduzir tamanho de um scan pesado para caber num anexo, [Comprimir PDF](/comprimir-pdf) faz isso no aparelho — com o trade-off honesto de rasterizar páginas (o texto em geral deixa de ser selecionável). Se o PDF já é leve, a compressão encolhe pouco; o site mostra o resultado real, não uma promessa de “90% menor”.

## LGPD: o que o modelo local ajuda — e o que ele não resolve

A LGPD (Lei nº 13.709/2018) trata de tratamento de dados pessoais: base legal, finalidade, segurança, direitos do titular, contratos com operadores, incidentes. Não é um selo que um site de PDF emite. Também não é um bicho de sete cabeças que se resolve com um parágrafo de blog.

**O que o processamento local ajuda:**

- Menos uma transferência do documento para um operador de conversão que você não contratou com cláusula nenhuma.
- Menos uma cópia temporária cujo prazo de retenção você não controla.
- Alinhamento razoável com *minimização*: se a tarefa dá para fazer no aparelho, não é obrigatório mandar o arquivo para fora só para girar uma página.

**O que o processamento local não resolve:**

- A base legal do *seu* tratamento (por que você tem aquele PDF de cliente na pasta).
- O e-mail, o WhatsApp, o Drive, o backup, o computador compartilhado da família.
- Cookies e publicidade no site da ferramenta — são outro tratamento, de navegação, descritos na [Política de Privacidade](/privacidade). Não misture “o PDF não sobe” com “este domínio não usa nenhum dado”.
- Um certificado de conformidade, um DPO ou um relatório de impacto. Este projeto não oferece isso. Quem precisa de parecer jurídico deve procurar quem possa assinar um.

Frase honesta: **privacidade no navegador é uma camada útil no instante do processamento. Não é a LGPD inteira.** Usar um conversor com upload também não é, por si só, “ilegal” — depende do dado, da finalidade, do contrato. Deste lado, o que dá para afirmar é o fluxo: o arquivo selecionado na ferramenta não vai a um servidor nosso para ser convertido.

Se a empresa pediu “ferramenta LGPD-friendly para PDF”, traduza: evitar upload para conversor desconhecido, ou fornecedor com contrato de operador e SLA? Só a primeira cabe aqui.

## Quando o local falha: 50 MB, RAM, OCR e o celular

O limite não é “plano grátis”. É memória e CPU do navegador, sobretudo no telefone. Os tetos atuais do Easy PDF Local vêm da validação no cliente:

- **até 50 MB por arquivo** (teto geral);
- **juntar PDF:** até 20 arquivos e cerca de 80 MB somados na fila;
- **comprimir:** até 50 páginas (rasterizar página a página é caro);
- **OCR / extrair texto no modo OCR:** até 30 páginas;
- **operações mais leves** (dividir, girar, etc.): proteção extra na casa de ~150 páginas.

Acima disso o site avisa e **não processa**, de propósito. Empurrar um PDF de 200 MB num celular de 4 GB de RAM não é “otimismo”. É travar a aba, às vezes o aparelho.

Outras falhas previsíveis, que não são bug de marketing:

- **OCR.** Tesseract no navegador lê português em scans razoáveis. Manuscrito, foto torta, carimbo em cima da letra e tabela densa geram lixo. Não há milagre de “IA que entende o documento”.
- **Compressão.** Páginas viram JPEG. Texto pesquisável some. Qualidade visual cai no nível alto. PDF já otimizado quase não encolhe.
- **Word → PDF.** DOCX do dia a dia costuma ir bem. Layout de revista, objetos complexos e `.doc` antigo, não.
- **Desenhar / assinar.** Nesta suíte, o traço é na página 1. Não é Adobe, não é certificado digital.
- **Senha.** Proteger cifra no cliente. Esqueceu a senha: não há recuperação. Desbloquear exige a senha correta — não há quebra.

Quando o local falha, as saídas honestas são: dividir o trabalho em lotes, comprimir scans *antes* de juntar, usar desktop em vez do celular, ou um programa instalado (LibreOffice, ferramenta interna, leitor com OCR de verdade). Fingir que o navegador substitui tudo isso só produz decepção — e conteúdo vazio.

## Como usar este site com expectativa realista

Confirme se a tarefa é pontual (unir, girar, extrair um trecho, reduzir um scan). Leia o limite *antes* de arrastar o arquivo. Processe, pré-visualize, baixe: o original no disco permanece. Trate o arquivo de saída como sempre — pasta, senha se fizer sentido, canal de envio.

Não é preciso criar conta. Não há cota diária. Há teto técnico. Anúncios, quando ativos, financiam o site; cookies de medição não são o conteúdo do seu PDF.

Mapa do modelo (cookies, cadastro, o que a LGPD não é): [PDF sem upload](/pdf-sem-upload). Operação mais comum no trabalho: [Juntar PDF](/juntar-pdf). Scan pesado: [Comprimir PDF](/comprimir-pdf), ciente do trade-off de qualidade.

## Fechamento

Documentos no navegador versus upload não é uma guerra de “nuvem do mal” contra “web do bem”. É uma escolha de **onde a cópia existe** enquanto você junta páginas ou lê um scan. No trabalho e na vida pessoal, essa escolha pesa mais quando o PDF carrega dado de terceiros ou dado que você não quer espalhar. Na LGPD, o modelo local reduz uma transferência; não assina conformidade por você.

Use a ferramenta quando o arquivo cabe na memória e a operação é a que o site realmente faz. Quando não cabe — 50 MB, RAM, OCR, cinquenta páginas de compressão — o caminho adulto é outro programa, não um slogan de ilimitado.
