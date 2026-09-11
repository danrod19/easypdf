# Nuvem vs. processamento local: o que muda quando o PDF não sobe

Se você precisa juntar dois contratos ou comprimir um relatório, a primeira busca costuma ser um “PDF online”. Quase todos pedem o mesmo passo: **upload**. O arquivo sai do seu disco, atravessa a internet, é processado num servidor e volta no download.

Isso é conveniente. Também é uma decisão de arquitetura: durante a operação, existe uma cópia do documento fora da sua máquina. Para um flyer, pouco importa. Para contrato, laudo ou folha com dados pessoais, importa.

Este texto compara o modelo com upload e o processamento **no navegador** (client-side), com limites reais — não com promessa de que o local substitui a nuvem em qualquer tamanho de arquivo.

## O que acontece no upload

No conversor clássico, o PDF é enviado a um serviço. Mesmo com HTTPS, o operador precisa **descriptografar o trânsito** para juntar páginas, comprimir ou converter. Nesse intervalo o conteúdo está no ambiente dele: disco temporário, fila, log, backup — o que a política da empresa disser, se disser.

Você em geral não vê o contrato de operador, o prazo de retenção nem o subprocessador. Não é automaticamente um vazamento. É uma exposição que você não controla. Para documento sob NDA ou dado pessoal de terceiro, muita equipe de TI trata isso como destino não aprovado.

Há ainda o custo de banda: o arquivo sobe e desce. Em link ruim, a espera é a da rede, não a da CPU.

## O que acontece no processamento local

Ferramentas como o Easy PDF Local invertem o sentido: o navegador baixa o **código** da ferramenta; o **arquivo** permanece no aparelho. Merge, rotação, compressão e conversões rodam em JavaScript (e, quando cabe, WebAssembly) no seu CPU. O download do resultado parte da aba.

A rede ainda existe para carregar a página, os scripts e, no OCR, o modelo de idioma na primeira vez. Cookies e anúncios, quando ativos, são outro assunto (navegação). O ponto do documento é este: **não há pipeline nosso que receba o PDF para “converter na nuvem”**.

Isso reduz a superfície no *momento do processamento*. Não apaga e-mail, Drive, WhatsApp nem o PC compartilhado. Também não gera trilha de auditoria corporativa — não há login obrigatório nas tools principais.

## LGPD e segurança: o que dá para afirmar

Menos uma cópia em servidor de conversor desconhecido é um ganho de minimização. Ajuda quando a alternativa era mandar o dossiê para o primeiro site do Google.

Não é conformidade automática. A LGPD continua valendo para a base legal do seu arquivo, para o envio posterior e para incidentes no *seu* ambiente. O local não emite certificado, não substitui DPO e não impede print screen. Quem precisa de parecer jurídico não vai encontrá-lo num site de PDF.

O artigo [PDF no navegador, privacidade e LGPD](/blog/pdf-no-navegador-privacidade-lgpd) aprofunda trabalho, documentos pessoais e o que a lei não é.

## Limites do navegador (não são “plano grátis”)

Processar no cliente usa a RAM e a CPU **do aparelho**. Por isso existem tetos — iguais aos da validação do site, não números de marketing:

- até **50 MB** por arquivo;
- **juntar:** até 20 PDFs e cerca de **80 MB** somados na fila;
- **comprimir:** até **50 páginas** (rasterizar é pesado);
- **OCR:** até **30 páginas**;
- operações mais leves: proteção extra na casa de **~150 páginas**.

Acima disso a ferramenta recusa, de propósito, para não travar a aba — sobretudo no celular. Não há modo ilimitado no cliente. Um PDF enorme não “processa instantâneo” só porque não houve upload: o gargalo passa a ser o hardware.

Compressão troca qualidade (páginas viram JPEG; texto em geral deixa de ser selecionável). OCR erra em scan ruim. Word → PDF pode divergir em layout complexo. Isso é o produto, não letra miúda.

## Quando a nuvem ainda faz sentido

A nuvem é adequada para colaboração, histórico, backup e arquivos que a organização **escolheu** hospedar com contrato. Também é o caminho quando o documento não cabe na memória do navegador ou quando você precisa de OCR de volume, edição pesada ou fluxo com identidade corporativa.

O erro é usar o mesmo reflexo — upload em site genérico — para um PDF que não deveria sair da máquina só para girar uma página ou unir dois anexos.

## Na prática

Se a tarefa é pontual e o arquivo cabe nos limites, processe no navegador e baixe a cópia. O original permanece no disco. Se a tarefa estoura 50 MB, dezenas de páginas de OCR ou compressão no telefone, use outro programa ou o fluxo interno da empresa.

Privacidade aqui é engenharia simples: menos uma cópia em trânsito para converter. Não é revolução, não é ferramenta de elite e não substitui política de segurança. É um limite consciente de onde o arquivo existe enquanto você trabalha nele.

Comece pelo hub [PDF sem upload](/pdf-sem-upload) ou pela operação [Juntar PDF](/juntar-pdf).
