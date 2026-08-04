import { Link } from 'react-router-dom';
import {
  Bug,
  Handshake,
  Lightbulb,
  Mail,
  MessageCircle,
  ServerOff,
  Shield,
} from 'lucide-react';
import { Seo } from '../components/Seo';
import { JsonLd } from '../components/JsonLd';
import { getSeoForPath } from '../data/seo';
import {
  buildBreadcrumbListSchema,
  buildWebPageSchema,
} from '../data/schema';
import { CONTACT_EMAIL, contactMailto } from '../data/siteContact';

const MAILTO = contactMailto('Contato - Easy PDF Local');
const MAILTO_BUG = contactMailto('Bug - Easy PDF Local');
const MAILTO_PRIVACY = contactMailto('Privacidade - Easy PDF Local');

/**
 * /contato — canal humano com o mantenedor.
 * Sem formulário de backend, sem SLA corporativo, sem processar PDF por e-mail.
 */
export default function ContatoPage() {
  const seo = getSeoForPath('/contato');

  const pageSchema = buildWebPageSchema({
    name: seo.title,
    description: seo.description,
    path: '/contato',
    type: 'ContactPage',
  });

  const breadcrumbSchema = buildBreadcrumbListSchema([
    { name: 'Início', path: '/' },
    { name: 'Contato', path: '/contato' },
  ]);

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />
      <JsonLd id="contact-page" data={pageSchema} />
      <JsonLd id="contact-breadcrumb" data={breadcrumbSchema} />

      <article className="card mx-auto max-w-3xl">
        <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Contato
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Fale com quem mantém o Easy PDF Local — bugs, sugestões ou dúvidas
            de privacidade. Resposta humana, sem promessa de prazo de suporte
            corporativo.
          </p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <section aria-labelledby="contato-intro">
            <h2
              id="contato-intro"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              Como falar com o mantenedor
            </h2>
            <p className="mt-2">
              O canal principal é o e-mail abaixo. Não há chat 24h nem fila de
              atendimento empresarial: o projeto é mantido de forma
              independente. Respondemos quando for possível, com clareza — sem
              spam e sem newsletter forçada.
            </p>
          </section>

          {/* CTA e-mail — legível no mobile */}
          <section
            aria-labelledby="contato-cta"
            className="rounded-2xl border border-brand-200 bg-brand-50 p-5 sm:p-6 dark:border-brand-900/40 dark:bg-brand-950/30"
          >
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-5 sm:text-left">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm dark:bg-brand-500">
                <MessageCircle className="h-6 w-6" aria-hidden />
              </span>
              <div className="mt-4 min-w-0 flex-1 sm:mt-0">
                <h2
                  id="contato-cta"
                  className="text-lg font-bold text-slate-900 dark:text-white"
                >
                  E-mail de contato
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Toque no botão para abrir o app de e-mail do seu celular ou
                  computador com o destinatário preenchido. Se preferir, copie o
                  endereço e envie quando quiser.
                </p>
                <a
                  href={MAILTO}
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:w-auto dark:bg-brand-500 dark:hover:bg-brand-400"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  Escrever e-mail
                </a>
                <p className="mt-3 break-all text-sm">
                  <span className="text-slate-500 dark:text-slate-500">
                    Destinatário:{' '}
                  </span>
                  <a
                    href={MAILTO}
                    className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                  Atalhos:{' '}
                  <a
                    href={MAILTO_BUG}
                    className="text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
                  >
                    reportar bug
                  </a>
                  {' · '}
                  <a
                    href={MAILTO_PRIVACY}
                    className="text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
                  >
                    dúvida de privacidade
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Aviso: não processar PDF por e-mail */}
          <aside
            className="rounded-xl border border-amber-200/90 bg-amber-50/70 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-950/25"
            aria-labelledby="contato-aviso-pdf"
          >
            <div className="flex items-start gap-3">
              <ServerOff
                className="mt-0.5 h-5 w-5 shrink-0 text-amber-800 dark:text-amber-200"
                aria-hidden
              />
              <div>
                <h2
                  id="contato-aviso-pdf"
                  className="text-sm font-semibold text-amber-950 dark:text-amber-100"
                >
                  Não enviamos (nem processamos) PDF por e-mail
                </h2>
                <p className="mt-1 text-sm text-amber-950/85 dark:text-amber-100/85">
                  As ferramentas do site rodam no navegador. Se você precisar
                  juntar, comprimir ou converter um arquivo, use a página da
                  ferramenta — não anexe o documento neste e-mail pedindo
                  processamento. O contato serve para feedback, bugs e
                  privacidade, não como “suporte de conversão manual”.
                </p>
              </div>
            </div>
          </aside>

          <section aria-labelledby="contato-motivos">
            <h2
              id="contato-motivos"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              Para que serve este contato
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              <li className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  <Bug className="h-4 w-4" aria-hidden />
                </span>
                <p className="mt-3 font-semibold text-slate-900 dark:text-white">
                  Bugs e erros
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Informe o navegador (Chrome, Safari, etc.), a ferramenta
                  usada e o que aconteceu. Capturas de tela de erro (sem o
                  conteúdo do seu PDF) ajudam.
                </p>
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  <Lightbulb className="h-4 w-4" aria-hidden />
                </span>
                <p className="mt-3 font-semibold text-slate-900 dark:text-white">
                  Sugestões
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Ideias de usabilidade, textos mais claros, acessibilidade ou
                  novas funções alinhadas ao modelo local.
                </p>
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <Shield className="h-4 w-4" aria-hidden />
                </span>
                <p className="mt-3 font-semibold text-slate-900 dark:text-white">
                  Privacidade
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Dúvidas sobre cookies, analytics, anúncios ou o modelo sem
                  upload. A política completa está em{' '}
                  <Link
                    to="/privacidade"
                    className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
                  >
                    /privacidade
                  </Link>
                  .
                </p>
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                  <Handshake className="h-4 w-4" aria-hidden />
                </span>
                <p className="mt-3 font-semibold text-slate-900 dark:text-white">
                  Parcerias (opcional)
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Propostas alinhadas à privacidade e ao uso ético das
                  ferramentas. Não há canal comercial dedicado nem prazo
                  garantido de resposta.
                </p>
              </li>
            </ul>
          </section>

          <section aria-labelledby="contato-expectativa">
            <h2
              id="contato-expectativa"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              O que esperar da resposta
            </h2>
            <p className="mt-2">
              Respondemos de forma humana e direta quando for possível. Não
              prometemos SLA de suporte corporativo, chat em tempo real nem
              atendimento 24 horas. Se o e-mail for spam, fora de contexto ou
              pedir processamento de arquivo anexado, pode não haver resposta
              útil — use as tools do site para o trabalho com PDF.
            </p>
          </section>

          <section aria-labelledby="contato-privacidade-msg">
            <h2
              id="contato-privacidade-msg"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              Privacidade na mensagem
            </h2>
            <p className="mt-2">
              Ao nos escrever, usamos o endereço de e-mail e o conteúdo da
              mensagem para responder e, se fizer sentido, melhorar o serviço.
              Evite enviar documentos confidenciais desnecessariamente. Mais
              detalhes na{' '}
              <Link
                to="/privacidade"
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="contato-links">
            <h2
              id="contato-links"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              Links úteis
            </h2>
            <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <li>
                <Link
                  to="/sobre"
                  className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:border-brand-300 hover:bg-brand-50/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-brand-700"
                >
                  Sobre o projeto
                </Link>
              </li>
              <li>
                <Link
                  to="/pdf-sem-upload"
                  className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:border-brand-300 hover:bg-brand-50/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-brand-700"
                >
                  PDF sem upload
                </Link>
              </li>
              <li>
                <Link
                  to="/privacidade"
                  className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:border-brand-300 hover:bg-brand-50/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-brand-700"
                >
                  Privacidade
                </Link>
              </li>
              <li>
                <Link
                  to="/termos"
                  className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:border-brand-300 hover:bg-brand-50/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-brand-700"
                >
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:border-brand-300 hover:bg-brand-50/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-brand-700"
                >
                  Ferramentas
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <footer className="mt-10 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-6 text-sm dark:border-slate-800">
          <Link
            to="/sobre"
            className="font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            Sobre o Easy PDF Local
          </Link>
          <Link
            to="/privacidade"
            className="font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            Privacidade
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
