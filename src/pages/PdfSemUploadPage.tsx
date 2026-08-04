import { Link } from 'react-router-dom';
import {
  BookOpen,
  Combine,
  Cookie,
  FileArchive,
  FileType2,
  HardDrive,
  Images,
  Lock,
  PenTool,
  RotateCw,
  ScanText,
  Scissors,
  ServerOff,
  ShieldCheck,
  Smartphone,
  Stamp,
  Trash2,
  Unlock,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Seo } from '../components/Seo';
import { JsonLd } from '../components/JsonLd';
import { FileLimitsNotice } from '../components/FileLimitsNotice';
import { getSeoForPath } from '../data/seo';
import {
  buildBreadcrumbListSchema,
  buildFaqPageSchema,
  buildWebPageSchema,
} from '../data/schema';
import { tools } from '../data/tools';
import {
  getHomeLimitsFaqAnswer,
  getLimitsOverviewOneLiner,
} from '../data/fileLimitsCopy';

const hubFaqs = [
  {
    question: 'O arquivo sobe para a internet para ser processado?',
    answer:
      'Não. Nas ferramentas do Easy PDF Local, o conteúdo do PDF (ou DOCX/imagem) fica no seu navegador durante o processamento. Usamos a rede para carregar a página, scripts e, em alguns casos, assets públicos (como modelo de OCR na primeira vez) — não para enviar o seu documento a um servidor nosso de conversão.',
  },
  {
    question: 'O que fica no meu dispositivo e o que não guardamos?',
    answer:
      'Durante o uso, o arquivo fica na memória da aba do navegador. Ao baixar o resultado, a cópia salva fica onde o sistema grava downloads. Não armazenamos o conteúdo dos documentos processados em servidores nossos. Fechar a aba libera a memória local da sessão.',
  },
  {
    question: 'E cookies, Google Analytics e AdSense?',
    answer:
      'Cookies e scripts de medição/publicidade (quando ativos e com o consentimento exigido) tratam de navegação e anúncios — não leem o conteúdo do PDF que você processa na ferramenta. Você pode gerenciar preferências de cookies no rodapé. Detalhes na Política de Privacidade.',
  },
  {
    question: 'Há limites de tamanho ou páginas? É “ilimitado”?',
    answer: getHomeLimitsFaqAnswer(),
  },
  {
    question: 'Isso substitui toda a LGPD?',
    answer:
      'Não. O modelo local reduz a exposição no momento do processamento (menos uma cópia em servidor de conversor de terceiros). A LGPD ainda envolve base legal, segurança do seu e-mail, compartilhamento com clientes, etc. Privacidade no navegador é uma camada útil — não um certificado jurídico automático.',
  },
  {
    question: 'Preciso de conta? Funciona no celular?',
    answer:
      'Não precisa de cadastro para as tools principais. No celular, use o navegador; em aparelhos com pouca RAM, prefira arquivos menores ou menos páginas por operação.',
  },
];

const iconByTool: Record<string, LucideIcon> = {
  merge: Combine,
  split: Scissors,
  rotate: RotateCw,
  watermark: Stamp,
  draw: PenTool,
  word: FileType2,
  image: Images,
  ocr: ScanText,
  lock: Lock,
  unlock: Unlock,
  trash: Trash2,
  compress: FileArchive,
};

const howSteps = [
  {
    title: 'A página e as bibliotecas carregam',
    description:
      'O navegador baixa HTML, CSS e JavaScript (e, se preciso, modelos auxiliares). Isso usa a rede — como qualquer site.',
  },
  {
    title: 'Você escolhe o arquivo no dispositivo',
    description:
      'O PDF/DOCX/imagem é lido localmente (seletor ou arrastar e soltar). Não há etapa “enviar para a nuvem processar”.',
  },
  {
    title: 'O processamento roda no cliente',
    description:
      'Bibliotecas no navegador (pdf-lib, pdf.js, etc.) manipulam o arquivo na memória do aparelho. A velocidade depende da sua CPU e RAM.',
  },
  {
    title: 'Você baixa o resultado',
    description:
      'O download parte do dispositivo. O original no disco não é sobrescrito sozinho; você decide o que salvar.',
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    t: 'Sigilo e minimização de dados',
    d: 'Contratos, laudos e dados pessoais não precisam atravessar a internet só para editar ou converter PDF em um servidor alheio.',
  },
  {
    icon: Smartphone,
    t: 'Celular sem app obrigatório',
    d: 'Navegador atualizado basta. Útil quando o único aparelho à mão é o telefone — com limites de memória honestos.',
  },
  {
    icon: Zap,
    t: 'Sem fila de servidor de arquivo',
    d: 'Não dependemos de uma fila remota para processar o seu PDF. O gargalo é o hardware local e o tamanho do arquivo.',
  },
  {
    icon: Lock,
    t: 'Grátis, sem cadastro — com limites',
    d: 'Tools principais sem conta. Há tetos técnicos de tamanho e páginas; não prometemos “ilimitado” no navegador.',
  },
];

/**
 * Hub SEO/confiança: PDF sem upload / privacidade / processamento local.
 */
export default function PdfSemUploadPage() {
  const seo = getSeoForPath('/pdf-sem-upload');
  const readyTools = tools.filter((t) => t.status === 'ready');

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
        {/* 1. H1 + intro */}
        <header className="space-y-4 text-center sm:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Privacidade · Processamento local
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            PDF sem upload: privacidade no navegador, arquivo no seu dispositivo
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
            “PDF sem upload” não é slogan vazio: significa que o Easy PDF Local
            processa juntar, comprimir, converter e outras operações{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              no seu navegador
            </strong>
            , sem enviar o documento para a nossa nuvem para manipular o
            arquivo. Grátis, sem cadastro obrigatório — com limites técnicos
            honestos.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <Link to="/juntar-pdf" className="btn-primary">
              <Zap className="h-4 w-4" aria-hidden />
              Começar: Juntar PDF
            </Link>
            <Link to="/comprimir-pdf" className="btn-secondary">
              Comprimir PDF
            </Link>
            <Link to="/word-para-pdf" className="btn-secondary">
              Word para PDF
            </Link>
          </div>
        </header>

        {/* 2. Problema vs. modelo */}
        <section className="card space-y-4" aria-labelledby="problema-upload">
          <h2
            id="problema-upload"
            className="text-xl font-bold text-slate-900 dark:text-slate-50"
          >
            O problema dos conversores com upload
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            Em muitos sites “PDF online”, o fluxo é clássico: você faz upload →
            o arquivo vai a um servidor → o serviço processa → você baixa o
            resultado. Funciona para tarefas rápidas, mas o conteúdo passa por
            um ambiente que você não controla. Para contratos, laudos, folha de
            pagamento ou documentos com dados pessoais, isso nem sempre é
            aceitável — por política interna, por bom senso ou por preocupação
            com LGPD e sigilo.
          </p>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            O Easy PDF Local inverte a prioridade: a utilidade (merge, split,
            compressão, conversão) roda onde o arquivo já está — no seu
            dispositivo — em vez de pedir que ele suba “só para processar”.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <ServerOff
                  className="h-4 w-4 text-slate-500 dark:text-slate-400"
                  aria-hidden
                />
                Modelo comum (upload)
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Arquivo → servidor de terceiros → processamento remoto →
                download. Há cópia temporária fora do seu aparelho.
              </p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/30">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                <HardDrive
                  className="h-4 w-4 text-emerald-700 dark:text-emerald-300"
                  aria-hidden
                />
                Modelo local (Easy PDF Local)
              </p>
              <p className="mt-2 text-xs leading-relaxed text-emerald-950/85 dark:text-emerald-100/85">
                Página carrega → você escolhe o arquivo → JavaScript no
                navegador processa → download local. Sem pipeline nosso de
                “converter na nuvem”.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Como funciona */}
        <section aria-labelledby="como-funciona-hub">
          <h2
            id="como-funciona-hub"
            className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-50"
          >
            Como funciona no Easy PDF Local
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            Client-side significa: o trabalho pesado no arquivo acontece no seu
            CPU. Ainda há internet para servir o site — o que não há é o upload
            do documento para processar o conteúdo em servidor nosso.
          </p>
          <ol className="space-y-3">
            {howSteps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 4. Benefícios */}
        <section aria-labelledby="beneficios-hub">
          <h2
            id="beneficios-hub"
            className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-50"
          >
            Benefícios práticos (sem promessa vazia)
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {benefits.map((item) => (
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
          <FileLimitsNotice
            profile="overview"
            title="Limites técnicos (visão geral)"
            intro={`Proteção de memória do navegador — não “plano free”. ${getLimitsOverviewOneLiner()} Rasterizar muitas páginas, OCR e merges grandes consomem RAM; em arquivos enormes o site pode recusar ou demorar, sobretudo no celular.`}
            headingLevel="h3"
            headingId="limites-hub-overview"
            className="mt-4"
          />
        </section>

        {/* 5. Grid de tools */}
        <section
          id="ferramentas"
          className="scroll-mt-8"
          aria-labelledby="tools-hub"
        >
          <h2
            id="tools-hub"
            className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-50"
          >
            Ferramentas principais (todas no navegador)
          </h2>
          <p className="mb-5 text-sm text-slate-600 dark:text-slate-400">
            Cada página processa localmente — o mesmo princípio de PDF sem
            upload. Escolha o que precisa agora:
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {readyTools.map((tool) => {
              const Icon = iconByTool[tool.icon] ?? Combine;
              return (
                <li key={tool.path}>
                  <Link
                    to={tool.path}
                    className="flex h-full gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {tool.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {tool.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 6. FAQ */}
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
          <p className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-500">
            <Cookie className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            Preferências de cookies e detalhes de analytics/anúncios:{' '}
            <Link
              to="/privacidade"
              className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </section>

        {/* 7. CTAs + 8. Links institucionais e blog */}
        <section
          className="card space-y-4 border-brand-200 bg-brand-50/40 dark:border-brand-900/40 dark:bg-brand-950/20"
          aria-labelledby="cta-hub"
        >
          <h2
            id="cta-hub"
            className="text-lg font-bold text-slate-900 dark:text-slate-50"
          >
            Comece sem enviar o arquivo
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Escolha uma das ferramentas mais usadas e processe no navegador:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/juntar-pdf" className="btn-primary">
              Juntar PDF
            </Link>
            <Link to="/comprimir-pdf" className="btn-secondary">
              Comprimir PDF
            </Link>
            <Link to="/word-para-pdf" className="btn-secondary">
              Word para PDF
            </Link>
            <Link to="/" className="btn-secondary">
              Todas as ferramentas
            </Link>
          </div>
        </section>

        <section aria-labelledby="hub-links">
          <h2
            id="hub-links"
            className="mb-3 text-lg font-bold text-slate-900 dark:text-slate-50"
          >
            Continuar lendo
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            <li>
              <Link
                to="/sobre"
                className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
              >
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Sobre o Easy PDF Local
                </span>
                <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Quem mantém o projeto e o que o site faz (e não faz)
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/privacidade"
                className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
              >
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Política de Privacidade
                </span>
                <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Cookies, analytics, anúncios e dados de contato
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/blog/juntar-pdf-online-sem-upload"
                className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
              >
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden />
                  Guia: juntar PDF sem upload
                </span>
                <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Artigo prático no blog
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/blog/infraestrutura-nuvem-vs-local"
                className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
              >
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden />
                  Nuvem vs. processamento local
                </span>
                <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Por que o modelo client-side importa
                </span>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
