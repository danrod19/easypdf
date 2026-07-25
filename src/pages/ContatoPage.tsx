import { Link } from 'react-router-dom';
import { Mail, Bug, Lightbulb, Handshake, MessageCircle } from 'lucide-react';
import { Seo } from '../components/Seo';
import { getSeoForPath } from '../data/seo';

const CONTACT_EMAIL = 'easypdf19@gmail.com';
const MAILTO = `mailto:${CONTACT_EMAIL}?subject=Contato%20-%20Easy%20PDF%20Local`;

export default function ContatoPage() {
  const seo = getSeoForPath('/contato');

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <article className="card mx-auto max-w-3xl">
        <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Contato
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            O feedback da comunidade é essencial para melhorar o Easy PDF Local.
          </p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <section aria-labelledby="contato-intro">
            <h2
              id="contato-intro"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              Queremos ouvir você
            </h2>
            <p className="mt-2">
              O Easy PDF Local é feito para pessoas reais: quem precisa juntar
              um contrato com pressa, comprimir um laudo ou converter um
              documento sem arriscar a privacidade. Por isso, o{' '}
              <strong>feedback da comunidade é essencial</strong> para
              melhorar a ferramenta — seja um bug, uma ideia de usabilidade ou
              um relato de como você usa o site no trabalho ou em casa.
            </p>
            <p className="mt-2">
              Escreva com tranquilidade. Respondemos de forma humana e direta,
              o mais breve possível. Não é necessário cadastro: basta o e-mail.
            </p>
          </section>

          <section aria-labelledby="contato-motivos">
            <h2
              id="contato-motivos"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              Em que podemos ajudar
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              <li className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  <Bug className="h-4 w-4" aria-hidden />
                </span>
                <p className="mt-3 font-semibold text-slate-900 dark:text-white">
                  Reportar bugs
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Conte o navegador, a ferramenta usada e o que deu errado.
                  Isso acelera a correção.
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
                  Novas funções, textos mais claros ou melhorias de acessibilidade
                  e experiência.
                </p>
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                  <Handshake className="h-4 w-4" aria-hidden />
                </span>
                <p className="mt-3 font-semibold text-slate-900 dark:text-white">
                  Parcerias
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Colaborações, conteúdo ou propostas alinhadas à privacidade
                  e ao uso ético da ferramenta.
                </p>
              </li>
            </ul>
          </section>

          <section
            aria-labelledby="contato-cta"
            className="rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center dark:border-brand-900/40 dark:bg-brand-950/30"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm dark:bg-brand-500">
              <MessageCircle className="h-6 w-6" aria-hidden />
            </span>
            <h2
              id="contato-cta"
              className="mt-4 text-lg font-bold text-slate-900 dark:text-white"
            >
              Enviar E-mail
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
              Clique no botão abaixo para abrir o seu aplicativo de e-mail com o
              destinatário já preenchido. Se preferir, copie o endereço e envie
              quando quiser.
            </p>
            <a
              href={MAILTO}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:bg-brand-500 dark:hover:bg-brand-400"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Enviar E-mail
            </a>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
              Destinatário:{' '}
              <a
                href={MAILTO}
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>

          <section aria-labelledby="contato-privacidade">
            <h2
              id="contato-privacidade"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              Privacidade no contato
            </h2>
            <p className="mt-2">
              Ao nos escrever, usamos o endereço de e-mail e o conteúdo da
              mensagem apenas para responder e melhorar o serviço. Não enviamos
              spam. Para saber como tratamos dados no site, leia a{' '}
              <Link
                to="/privacidade"
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                Política de Privacidade
              </Link>
              .
            </p>
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
