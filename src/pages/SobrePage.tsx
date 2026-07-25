import { Link } from 'react-router-dom';
import { ShieldCheck, Laptop, Network, ServerOff, HeartHandshake } from 'lucide-react';
import { Seo } from '../components/Seo';
import { getSeoForPath } from '../data/seo';

export default function SobrePage() {
  const seo = getSeoForPath('/sobre');

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <article className="card mx-auto max-w-3xl">
        <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Sobre o Easy PDF Local
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Nossa missão de privacidade: ferramentas de PDF que processam tudo
            no seu navegador — sem upload para a nuvem.
          </p>
        </header>

        <aside
          className="mb-8 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50 p-5 dark:border-emerald-500/30 dark:bg-emerald-950/40"
          aria-labelledby="sobre-missao-destaque"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white dark:bg-emerald-500">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2
                id="sobre-missao-destaque"
                className="text-lg font-bold text-emerald-900 dark:text-emerald-100"
              >
                Privacidade primeiro — sempre
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-emerald-900/90 dark:text-emerald-100/90">
                Nós criamos o Easy PDF Local para que contratos, laudos,
                comprovantes e arquivos confidenciais possam ser manipulados{' '}
                <strong>sem sair da sua máquina</strong>. Processamento 100% no
                navegador (client-side): seus documentos não são enviados para
                servidores nossos nem de terceiros.
              </p>
            </div>
          </div>
        </aside>

        <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <section aria-labelledby="sobre-origem">
            <h2
              id="sobre-origem"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              De onde veio a ideia
            </h2>
            <p className="mt-2">
              A ferramenta foi idealizada por um{' '}
              <strong>
                profissional brasileiro da área de suporte técnico, redes e
                sistemas de telecomunicações
              </strong>
              . No dia a dia, lidando com infraestrutura de TI, redes e dados
              sensíveis de empresas e usuários, ficou cada vez mais clara uma
              lacuna: a maioria dos &quot;conversores de PDF online&quot; pede
              upload do arquivo para a nuvem — e, com isso, abre mão do controle
              sobre o conteúdo.
            </p>
            <p className="mt-2">
              Nós conhecemos, na prática, o risco real de vazar informação
              corporativa: um PDF de RH, um contrato, um relatório interno. Uma
              vez enviado a um servidor de terceiros, você deixa de ser o único
              guardião daquele arquivo. Por isso decidimos construir uma
              alternativa em que o processamento acontece{' '}
              <strong>apenas no navegador do usuário</strong>.
            </p>
          </section>

          <section aria-labelledby="sobre-experiencia">
            <h2
              id="sobre-experiencia"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              Experiência que guia o produto
            </h2>
            <div className="mt-3 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white dark:bg-brand-500">
                <Network className="h-5 w-5" aria-hidden />
              </span>
              <p>
                Quem mantém este projeto trabalha com suporte técnico, redes e
                telecomunicações — áreas em que privacidade, disponibilidade e
                integridade dos dados não são teoria: são requisito diário. Essa
                experiência molda cada decisão do Easy PDF Local: menos
                dependência de nuvem, mais transparência e zero necessidade de
                cadastro para usar as ferramentas principais.
              </p>
            </div>
          </section>

          <section aria-labelledby="sobre-como-funciona">
            <h2
              id="sobre-como-funciona"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              Como funciona o nosso diferencial
            </h2>
            <p className="mt-2">
              Ao abrir uma ferramenta (juntar, dividir, comprimir, converter
              etc.), o arquivo é lido e processado na memória do{' '}
              <strong>seu navegador</strong>, com JavaScript e bibliotecas
              client-side. Não há etapa de &quot;enviar para o servidor
              processar&quot;. O resultado só permanece se você baixar e salvar
              no seu dispositivo.
            </p>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              <li className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40">
                <Laptop
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400"
                  aria-hidden
                />
                <span>
                  <strong className="block text-slate-900 dark:text-white">
                    100% client-side
                  </strong>
                  O trabalho pesado roda no seu dispositivo, não em um data
                  center nosso.
                </span>
              </li>
              <li className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40">
                <ServerOff
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400"
                  aria-hidden
                />
                <span>
                  <strong className="block text-slate-900 dark:text-white">
                    Sem upload de documentos
                  </strong>
                  Seus PDFs e imagens não sobem para servidores de conversão de
                  terceiros.
                </span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="sobre-compromisso">
            <h2
              id="sobre-compromisso"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              Nosso compromisso com a privacidade
            </h2>
            <p className="mt-2">
              Comprometemo-nos com a{' '}
              <strong>privacidade corporativa e pessoal</strong>. Seja um
              freela, uma PME, um escritório jurídico ou alguém organizando
              documentos em casa: o Easy PDF Local existe para reduzir o risco
              de exposição desnecessária de conteúdo sensível.
            </p>
            <p className="mt-2">
              Também somos transparentes sobre o site em si: métricas e anúncios
              (quando ativos) tratam de navegação e cookies,{' '}
              <strong>não do conteúdo dos arquivos</strong> que você processa
              nas ferramentas. Detalhes na nossa{' '}
              <Link
                to="/privacidade"
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                Política de Privacidade
              </Link>{' '}
              e nos{' '}
              <Link
                to="/termos"
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                Termos de Uso
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="sobre-comunidade">
            <h2
              id="sobre-comunidade"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              Construído com responsabilidade
            </h2>
            <div className="mt-3 flex items-start gap-3">
              <HeartHandshake
                className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400"
                aria-hidden
              />
              <p>
                O projeto é mantido com foco em utilidade real, clareza e
                feedback da comunidade. Se quiser reportar um problema, sugerir
                uma melhoria ou falar sobre parceria, use a página de{' '}
                <Link
                  to="/contato"
                  className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
                >
                  Contato
                </Link>
                . Sua mensagem ajuda a evoluir o Easy PDF Local com segurança e
                bom senso.
              </p>
            </div>
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
