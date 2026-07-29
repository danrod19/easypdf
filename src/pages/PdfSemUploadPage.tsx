import { Link } from 'react-router-dom';
import {
  Combine,
  FileArchive,
  FileType2,
  Images,
  Lock,
  RotateCw,
  ScanText,
  Scissors,
  ShieldCheck,
  Smartphone,
  Zap,
} from 'lucide-react';
import { Seo } from '../components/Seo';
import { JsonLd } from '../components/JsonLd';
import { getSeoForPath } from '../data/seo';
import {
  buildBreadcrumbListSchema,
  buildFaqPageSchema,
  buildWebPageSchema,
} from '../data/schema';

const hubFaqs = [
  {
    question: 'O que significa “PDF sem upload”?',
    answer:
      'Significa que o processamento do seu arquivo (juntar, comprimir, converter, etc.) acontece no navegador do seu dispositivo. O conteúdo do PDF não é enviado a um servidor nosso para ser manipulado na nuvem.',
  },
  {
    question: 'Vocês armazenam meus documentos?',
    answer:
      'Não armazenamos o conteúdo dos PDFs, DOCX ou imagens que você processa nas ferramentas. Os arquivos ficam na memória local da sessão do navegador até você baixar o resultado ou fechar a aba.',
  },
  {
    question: 'Ainda preciso de internet?',
    answer:
      'Sim, para carregar a página e os scripts da aplicação (e, na primeira vez, assets como modelos de OCR). O que não fazemos é o upload do seu documento para “processar na nuvem”. Depois de carregada, a manipulação do arquivo é local.',
  },
  {
    question: 'É grátis e sem cadastro?',
    answer:
      'Sim. As ferramentas principais são gratuitas e não exigem conta. Podem existir anúncios no site para manter o serviço. Há limites técnicos de tamanho e páginas para o navegador não travar.',
  },
  {
    question: 'Isso ajuda com LGPD e documentos sensíveis?',
    answer:
      'Reduz a exposição: se o arquivo não sobe para um conversor de terceiros, você evita uma cópia temporária em servidor alheio. A LGPD envolve outros deveres (base legal, segurança do seu próprio envio por e-mail, etc.) — o modelo local é uma camada forte de minimização de dados no momento do processamento.',
  },
  {
    question: 'Funciona no celular?',
    answer:
      'Sim, no navegador do telefone. Em aparelhos com pouca memória, prefira arquivos menores ou menos páginas por operação.',
  },
];

const tools = [
  {
    path: '/juntar-pdf',
    title: 'Juntar PDF',
    desc: 'Una vários PDFs na ordem certa, sem upload.',
    icon: Combine,
  },
  {
    path: '/comprimir-pdf',
    title: 'Comprimir PDF',
    desc: 'Reduza o tamanho no navegador ou no celular.',
    icon: FileArchive,
  },
  {
    path: '/word-para-pdf',
    title: 'Word para PDF',
    desc: 'DOCX → PDF sem instalar programa.',
    icon: FileType2,
  },
  {
    path: '/dividir-pdf',
    title: 'Dividir PDF',
    desc: 'Extraia páginas ou intervalos localmente.',
    icon: Scissors,
  },
  {
    path: '/girar-pdf',
    title: 'Girar PDF',
    desc: 'Corrija orientação sem reenviar o arquivo.',
    icon: RotateCw,
  },
  {
    path: '/extrair-texto',
    title: 'Extrair texto / OCR',
    desc: 'Texto nativo ou OCR em português no dispositivo.',
    icon: ScanText,
  },
  {
    path: '/imagem-para-pdf',
    title: 'Imagem para PDF',
    desc: 'JPG/PNG em PDF sem subir fotos para a nuvem.',
    icon: Images,
  },
  {
    path: '/proteger-pdf',
    title: 'Proteger PDF',
    desc: 'Senha no navegador, criptografia local.',
    icon: Lock,
  },
];

/**
 * Hub SEO/conversão: PDF sem upload / privacidade / processamento local.
 */
export default function PdfSemUploadPage() {
  const seo = getSeoForPath('/pdf-sem-upload');

  const pageSchema = buildWebPageSchema({
    name: seo.title,
    description: seo.description,
    path: '/pdf-sem-upload',
    type: 'CollectionPage',
  });
  const breadcrumbSchema = buildBreadcrumbListSchema([
    { name: 'Início', path: '/' },
    { name: 'PDF sem upload', path: '/pdf-sem-upload' },
  ]);
  const faqSchema = buildFaqPageSchema(hubFaqs);

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />
      <JsonLd id="webpage-pdf-sem-upload" data={pageSchema} />
      <JsonLd id="breadcrumb-pdf-sem-upload" data={breadcrumbSchema} />
      <JsonLd id="faq-pdf-sem-upload" data={faqSchema} />

      <div className="mx-auto max-w-3xl space-y-12 pb-8">
        <header className="space-y-4 text-center sm:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Privacidade · Processamento local
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            PDF sem upload: ferramentas no navegador, arquivo no seu dispositivo
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
            O Easy PDF Local processa PDFs{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              100% no cliente
            </strong>
            . Você não envia o documento para a nossa nuvem para juntar,
            comprimir ou converter — o trabalho roda no seu CPU, grátis e sem
            cadastro.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <Link to="/juntar-pdf" className="btn-primary">
              <Zap className="h-4 w-4" aria-hidden />
              Começar: Juntar PDF
            </Link>
            <Link to="/comprimir-pdf" className="btn-secondary">
              Comprimir PDF
            </Link>
            <a href="#ferramentas" className="btn-secondary">
              Ver todas
            </a>
          </div>
        </header>

        <section className="card space-y-4" aria-labelledby="modelo-local">
          <h2
            id="modelo-local"
            className="text-xl font-bold text-slate-900 dark:text-slate-50"
          >
            Como funciona o modelo local (sem servidor de arquivo)
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            Em conversores tradicionais, o fluxo é: upload → processamento no
            data center → download. No Easy PDF Local o fluxo é: carregar a
            página (HTML/JS) → você escolhe o arquivo no disco → JavaScript e
            WebAssembly no navegador manipulam o PDF → você baixa o resultado.
          </p>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            Isso significa que{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              não há armazenamento do conteúdo do seu documento em servidores
              nossos
            </strong>{' '}
            para executar o merge, a compressão ou a conversão. A privacidade
            deixa de ser só um texto de política e passa a ser uma escolha de
            arquitetura.
          </p>
        </section>

        <section aria-labelledby="beneficios-hub">
          <h2
            id="beneficios-hub"
            className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-50"
          >
            Benefícios práticos
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: ShieldCheck,
                t: 'Sigilo e minimização de dados',
                d: 'Contratos, laudos e dados pessoais não precisam atravessar a internet só para “editar PDF”.',
              },
              {
                icon: Smartphone,
                t: 'Celular sem app extra',
                d: 'Navegador atualizado basta. Ideal quando o único aparelho à mão é o telefone.',
              },
              {
                icon: Zap,
                t: 'Sem fila de servidor',
                d: 'A velocidade depende do seu hardware e do tamanho do arquivo, não da carga de um serviço remoto.',
              },
              {
                icon: Lock,
                t: 'Sem cadastro obrigatório',
                d: 'Abriu, usou, baixou. Grátis para o uso típico das ferramentas, com limites técnicos honestos.',
              },
            ].map((item) => (
              <li
                key={item.t}
                className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.t}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.d}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="ferramentas" className="scroll-mt-8" aria-labelledby="tools-hub">
          <h2
            id="tools-hub"
            className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-50"
          >
            Ferramentas principais (todas locais)
          </h2>
          <p className="mb-5 text-sm text-slate-600 dark:text-slate-400">
            Escolha o que precisa fazer agora. Cada página processa no navegador
            — o mesmo princípio de PDF sem upload.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {tools.map((tool) => (
              <li key={tool.path}>
                <Link
                  to={tool.path}
                  className="flex h-full gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
                    <tool.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {tool.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {tool.desc}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4" aria-labelledby="faq-hub">
          <h2
            id="faq-hub"
            className="text-xl font-bold text-slate-900 dark:text-slate-50"
          >
            FAQ: privacidade e segurança
          </h2>
          <dl className="space-y-3">
            {hubFaqs.map((item) => (
              <div
                key={item.question}
                className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <dt className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {item.question}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="card space-y-4 border-brand-200 bg-brand-50/40 text-center dark:border-brand-900/40 dark:bg-brand-950/20 sm:text-left">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Pronto para processar PDF sem enviar o arquivo?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Escolha uma ferramenta e comece agora. Se quiser entender o
            contraste com a nuvem, leia também o{' '}
            <Link
              to="/blog/infraestrutura-nuvem-vs-local"
              className="font-medium text-brand-700 underline-offset-2 hover:underline dark:text-brand-300"
            >
              artigo sobre nuvem vs. local
            </Link>{' '}
            ou a página{' '}
            <Link
              to="/sobre"
              className="font-medium text-brand-700 underline-offset-2 hover:underline dark:text-brand-300"
            >
              Sobre nós
            </Link>
            .
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
            <Link to="/" className="btn-primary">
              Ver todas as ferramentas
            </Link>
            <Link to="/blog" className="btn-secondary">
              Ir ao blog
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
