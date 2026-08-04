import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Combine,
  FileArchive,
  FileType2,
  HeartHandshake,
  Laptop,
  ServerOff,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { Seo } from '../components/Seo';
import { JsonLd } from '../components/JsonLd';
import { getSeoForPath } from '../data/seo';
import {
  buildBreadcrumbListSchema,
  buildWebPageSchema,
} from '../data/schema';

const mainTools = [
  {
    path: '/juntar-pdf',
    label: 'Juntar PDF',
    description: 'Unir vários PDFs na ordem certa',
    icon: Combine,
  },
  {
    path: '/comprimir-pdf',
    label: 'Comprimir PDF',
    description: 'Reduzir tamanho no navegador',
    icon: FileArchive,
  },
  {
    path: '/word-para-pdf',
    label: 'Word para PDF',
    description: 'DOCX → PDF sem instalar Word',
    icon: FileType2,
  },
] as const;

/**
 * /sobre — página institucional (E-E-A-T / confiança).
 * Sem equipe fictícia, CNPJ inventado, prêmios ou números de usuários.
 */
export default function SobrePage() {
  const seo = getSeoForPath('/sobre');

  const pageSchema = buildWebPageSchema({
    name: seo.title,
    description: seo.description,
    path: '/sobre',
    type: 'AboutPage',
  });

  const breadcrumbSchema = buildBreadcrumbListSchema([
    { name: 'Início', path: '/' },
    { name: 'Sobre', path: '/sobre' },
  ]);

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />
      <JsonLd id="about-page" data={pageSchema} />
      <JsonLd id="about-breadcrumb" data={breadcrumbSchema} />

      <article className="card mx-auto max-w-3xl">
        <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Sobre o Easy PDF Local
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Ferramentas de PDF grátis no navegador — com privacidade de verdade,
            sem upload do seu arquivo para processar.
          </p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {/* 1. O que é */}
          <section aria-labelledby="sobre-o-que-e">
            <h2
              id="sobre-o-que-e"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              O que é o Easy PDF Local
            </h2>
            <p className="mt-2">
              O Easy PDF Local é um site de ferramentas para manipular PDFs (e
              alguns formatos relacionados, como DOCX e imagens){' '}
              <strong>direto no seu navegador</strong>. Você abre a página,
              escolhe a ferramenta, seleciona o arquivo no dispositivo e
              processa localmente — sem criar conta e sem enviar o documento a
              um servidor nosso para “converter na nuvem”.
            </p>
            <p className="mt-2">
              O objetivo é simples: oferecer utilidade real (juntar, dividir,
              comprimir, converter, proteger, etc.) com um modelo que reduz o
              risco de exposição desnecessária de contratos, laudos, currículos
              e arquivos pessoais.
            </p>
          </section>

          {/* 2. Propósito */}
          <aside
            className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50 p-5 dark:border-emerald-500/30 dark:bg-emerald-950/40"
            aria-labelledby="sobre-proposito"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white dark:bg-emerald-500">
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2
                  id="sobre-proposito"
                  className="text-lg font-bold text-emerald-900 dark:text-emerald-100"
                >
                  Propósito: privacidade no processamento
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-emerald-900/90 dark:text-emerald-100/90">
                  A maioria dos “PDF online” pede upload. O arquivo sobe, é
                  processado em um servidor e volta no download. Funciona, mas
                  o conteúdo passa por um ambiente que você não controla. Aqui
                  o fluxo é o inverso: o processamento roda no seu dispositivo
                  (client-side). Usamos a rede para carregar a página e as
                  bibliotecas —{' '}
                  <strong>não para enviar o conteúdo do seu PDF</strong> a um
                  pipeline de conversão nosso. Saiba mais em{' '}
                  <Link
                    to="/pdf-sem-upload"
                    className="font-semibold underline underline-offset-2 hover:no-underline"
                  >
                    PDF sem upload
                  </Link>
                  .
                </p>
              </div>
            </div>
          </aside>

          {/* 3. O que faz / não faz */}
          <section aria-labelledby="sobre-expectativa">
            <h2
              id="sobre-expectativa"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              O que o site faz — e o que não faz
            </h2>
            <p className="mt-2">
              Expectativa honesta importa mais do que marketing. Resumo
              transparente:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                <p className="flex items-center gap-2 font-semibold text-emerald-900 dark:text-emerald-100">
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                  O que fazemos
                </p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-slate-700 dark:text-slate-300">
                  <li>
                    Ferramentas de PDF no navegador (merge, split, compressão,
                    conversões, senha, OCR, etc.).
                  </li>
                  <li>
                    Processamento local do arquivo que você seleciona no
                    dispositivo.
                  </li>
                  <li>
                    Uso gratuito das tools principais, sem cadastro
                    obrigatório.
                  </li>
                  <li>
                    Limites técnicos claros (tamanho/páginas) para o navegador
                    não travar — sobretudo no celular.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <p className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                  <XCircle className="h-4 w-4 shrink-0" aria-hidden />
                  O que não fazemos
                </p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-slate-700 dark:text-slate-300">
                  <li>
                    Não pedimos upload do seu PDF para processar em servidor
                    nosso.
                  </li>
                  <li>
                    Não armazenamos o conteúdo dos documentos que você processa
                    nas tools.
                  </li>
                  <li>
                    Não somos suíte desktop corporativa nem “Adobe online”.
                    Algumas operações têm trade-offs (ex.: compressão por
                    imagem pode remover texto selecionável).
                  </li>
                  <li>
                    Não prometemos layout idêntico ao Word em 100% dos DOCX, nem
                    compressão mágica sem perda.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Quem mantém */}
          <section aria-labelledby="sobre-quem">
            <h2
              id="sobre-quem"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              Quem mantém o projeto
            </h2>
            <p className="mt-2">
              O Easy PDF Local é um{' '}
              <strong>projeto mantido de forma independente</strong>, idealizado
              e cuidado por um profissional brasileiro com experiência em
              suporte técnico, redes e sistemas de telecomunicações. Não há
              “equipe de dezenas de pessoas”, sede fictícia ou CNPJ inventado
              nesta página — o que importa é a responsabilidade pelo produto e
              a clareza sobre como ele funciona.
            </p>
            <p className="mt-2">
              No dia a dia de TI, o risco de vazar um PDF sensível em um
              conversor de terceiros é concreto. Essa experiência molda o
              produto: menos dependência de nuvem para processar arquivo, mais
              transparência e zero conta obrigatória para as ferramentas
              principais. Dúvidas ou feedback: página de{' '}
              <Link
                to="/contato"
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                Contato
              </Link>
              .
            </p>
          </section>

          {/* 5. Princípios */}
          <section aria-labelledby="sobre-principios">
            <h2
              id="sobre-principios"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              Princípios de uso
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              <li className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40">
                <Laptop
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400"
                  aria-hidden
                />
                <span>
                  <strong className="block text-slate-900 dark:text-white">
                    100% no navegador
                  </strong>
                  O trabalho pesado roda no seu dispositivo, não em um data
                  center nosso para processar o arquivo.
                </span>
              </li>
              <li className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40">
                <ServerOff
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400"
                  aria-hidden
                />
                <span>
                  <strong className="block text-slate-900 dark:text-white">
                    Sem upload para processar
                  </strong>
                  Seus PDFs e imagens não sobem para um pipeline de conversão
                  nosso.
                </span>
              </li>
              <li className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40">
                <HeartHandshake
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400"
                  aria-hidden
                />
                <span>
                  <strong className="block text-slate-900 dark:text-white">
                    Grátis, sem cadastro
                  </strong>
                  As tools principais não exigem conta. Anúncios (quando
                  ativos) podem ajudar a manter o site no ar.
                </span>
              </li>
              <li className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40">
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400"
                  aria-hidden
                />
                <span>
                  <strong className="block text-slate-900 dark:text-white">
                    Limites honestos
                  </strong>
                  Há tetos de tamanho e páginas (memória do navegador). Não
                  prometemos “ilimitado” no celular ou no desktop.
                </span>
              </li>
            </ul>
            <p className="mt-3">
              Métricas e anúncios (quando ativos) tratam de navegação e cookies
              — <strong>não do conteúdo dos arquivos</strong> processados nas
              tools. Detalhes em{' '}
              <Link
                to="/privacidade"
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                Política de Privacidade
              </Link>{' '}
              e{' '}
              <Link
                to="/termos"
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                Termos de Uso
              </Link>
              .
            </p>
          </section>

          {/* 6. Links tools + hub + blog */}
          <section aria-labelledby="sobre-onde-comecar">
            <h2
              id="sobre-onde-comecar"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              Por onde começar
            </h2>
            <p className="mt-2">
              Ferramentas mais usadas, o hub de privacidade e o blog com guias
              práticos:
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {mainTools.map((tool) => (
                <li key={tool.path}>
                  <Link
                    to={tool.path}
                    className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:bg-brand-50/40 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-brand-700 dark:hover:bg-brand-950/30"
                  >
                    <tool.icon
                      className="h-5 w-5 text-brand-600 dark:text-brand-400"
                      aria-hidden
                    />
                    <span className="mt-2 font-semibold text-slate-900 dark:text-white">
                      {tool.label}
                    </span>
                    <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {tool.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <li>
                <Link
                  to="/pdf-sem-upload"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-900 transition hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100 dark:hover:bg-emerald-950/50"
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                  Hub: PDF sem upload
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:border-brand-300 hover:bg-brand-50/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-brand-700"
                >
                  <BookOpen className="h-4 w-4" aria-hidden />
                  Blog e guias
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:border-brand-300 hover:bg-brand-50/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-brand-700"
                >
                  Todas as ferramentas
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <footer className="mt-10 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-6 text-sm dark:border-slate-800">
          <Link
            to="/contato"
            className="font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            Contato
          </Link>
          <Link
            to="/privacidade"
            className="font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            Privacidade
          </Link>
          <Link
            to="/termos"
            className="font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            Termos de Uso
          </Link>
          <Link
            to="/pdf-sem-upload"
            className="font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            PDF sem upload
          </Link>
          <Link
            to="/"
            className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400"
          >
            Voltar ao início
          </Link>
        </footer>
      </article>
    </>
  );
}
