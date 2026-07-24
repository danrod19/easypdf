import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, ServerOff, Eye } from 'lucide-react';
import { Seo } from '../components/Seo';
import { getSeoForPath } from '../data/seo';

const LAST_UPDATED = '22 de julho de 2026';

export default function PrivacidadePage() {
  const seo = getSeoForPath('/privacidade');

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <article className="card mx-auto max-w-3xl">
        <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Política de Privacidade
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Última atualização: {LAST_UPDATED}
          </p>
        </header>

        {/* Destaque principal — processamento local */}
        <aside
          className="mb-8 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50 p-5 dark:border-emerald-500/30 dark:bg-emerald-950/40"
          aria-labelledby="privacidade-destaque"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white dark:bg-emerald-500">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2
                id="privacidade-destaque"
                className="text-lg font-bold text-emerald-900 dark:text-emerald-100"
              >
                Easy PDF é seguro: processamento 100% local
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-emerald-900/90 dark:text-emerald-100/90">
                <strong>
                  Todo o processamento dos seus arquivos ocorre exclusivamente no
                  navegador do seu dispositivo (client-side).
                </strong>{' '}
                Seus PDFs, imagens e documentos{' '}
                <strong>nunca são enviados (upload) para servidores nossos ou de
                terceiros</strong> para serem convertidos, unidos, divididos ou
                editados. O arquivo permanece no seu computador ou celular do
                início ao fim.
              </p>
            </div>
          </div>

          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            <li className="flex items-start gap-2 rounded-xl bg-white/70 p-3 text-sm text-emerald-950 dark:bg-slate-900/50 dark:text-emerald-50">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
              <span>
                <strong className="block">Sem upload de arquivos</strong>
                Os documentos não saem do seu dispositivo.
              </span>
            </li>
            <li className="flex items-start gap-2 rounded-xl bg-white/70 p-3 text-sm text-emerald-950 dark:bg-slate-900/50 dark:text-emerald-50">
              <ServerOff className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
              <span>
                <strong className="block">Sem armazenamento em nuvem</strong>
                Não guardamos cópias dos seus PDFs em servidores.
              </span>
            </li>
            <li className="flex items-start gap-2 rounded-xl bg-white/70 p-3 text-sm text-emerald-950 dark:bg-slate-900/50 dark:text-emerald-50">
              <Eye className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
              <span>
                <strong className="block">Sem acesso ao conteúdo</strong>
                Não lemos, analisamos nem compartilhamos o conteúdo dos arquivos.
              </span>
            </li>
          </ul>
        </aside>

        <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <section aria-labelledby="sec-quem">
            <h2 id="sec-quem" className="text-lg font-semibold text-slate-900 dark:text-white">
              1. Quem somos
            </h2>
            <p className="mt-2">
              O <strong>Easy PDF</strong> (easypdflocal.com.br) é um conjunto de
              ferramentas gratuitas para manipular arquivos PDF e formatos
              relacionados diretamente no navegador. O serviço é oferecido com
              ênfase em privacidade e praticidade, sem necessidade de cadastro
              para usar as ferramentas.
            </p>
          </section>

          <section aria-labelledby="sec-dados">
            <h2 id="sec-dados" className="text-lg font-semibold text-slate-900 dark:text-white">
              2. Quais dados tratamos
            </h2>
            <p className="mt-2">
              Distinguimos claramente o que acontece com os{' '}
              <strong>arquivos que você processa</strong> e os{' '}
              <strong>dados técnicos do site</strong>:
            </p>

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
              2.1. Seus arquivos (PDF, imagens, Word etc.)
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                São processados <strong>apenas na memória do seu navegador</strong>,
                usando JavaScript e bibliotecas que rodam no lado do cliente.
              </li>
              <li>
                <strong>Não fazemos upload</strong> desses arquivos para nossos
                servidores nem para APIs de conversão de terceiros.
              </li>
              <li>
                Ao fechar a aba ou limpar a página, o conteúdo em memória deixa de
                estar disponível para a aplicação. O resultado final só permanece
                se você o baixar e salvar no seu dispositivo.
              </li>
            </ul>

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
              2.2. Dados de navegação e cookies
            </h3>
            <p className="mt-2">
              Como a maioria dos sites, podemos utilizar cookies e tecnologias
              semelhantes para:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Métricas e análise de uso</strong> (por exemplo, páginas
                visitadas, tipo de dispositivo, origem do tráfego), de forma
                agregada, para entender como o site é usado e melhorar a
                experiência.
              </li>
              <li>
                <strong>Anúncios</strong> (como o Google AdSense), que podem usar
                cookies para exibir publicidade e, em alguns casos, anúncios
                personalizados conforme as políticas do Google e suas preferências
                de cookies.
              </li>
              <li>
                <strong>Preferências locais</strong>, como o aceite do banner de
                cookies (salvo em <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">localStorage</code>),
                para não exibir o aviso novamente.
              </li>
            </ul>
            <p className="mt-2">
              Esses mecanismos <strong>não incluem o conteúdo dos PDFs ou
              documentos que você processa</strong>. Cookies de publicidade e
              métricas não têm acesso aos arquivos que você carrega nas
              ferramentas.
            </p>

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
              2.3. Contato por e-mail
            </h3>
            <p className="mt-2">
              Se você nos escrever (por exemplo, para sugestões ou relato de
              falhas), trataremos o endereço de e-mail e o conteúdo da mensagem
              apenas para responder e melhorar o serviço.
            </p>
          </section>

          <section aria-labelledby="sec-finalidade">
            <h2 id="sec-finalidade" className="text-lg font-semibold text-slate-900 dark:text-white">
              3. Finalidade do tratamento
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Oferecer as ferramentas de PDF de forma gratuita e funcional.</li>
              <li>Medir audiência e desempenho do site de forma agregada.</li>
              <li>Exibir anúncios que ajudam a manter o serviço gratuito.</li>
              <li>Atender contatos e solicitações enviadas por você.</li>
              <li>Cumprir obrigações legais, quando aplicável.</li>
            </ul>
          </section>

          <section aria-labelledby="sec-compartilhamento">
            <h2 id="sec-compartilhamento" className="text-lg font-semibold text-slate-900 dark:text-white">
              4. Compartilhamento de dados
            </h2>
            <p className="mt-2">
              <strong>Não vendemos seus dados pessoais.</strong> Em relação aos
              arquivos processados nas ferramentas: como eles não são enviados a
              nossos servidores, também não os compartilhamos com ninguém.
            </p>
            <p className="mt-2">
              Parceiros de publicidade e análise (como o Google) podem receber
              dados técnicos de navegação conforme suas próprias políticas e os
              cookies aceitos no seu navegador. Recomendamos consultar a{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                Política de Privacidade do Google
              </a>{' '}
              e as opções de personalização de anúncios.
            </p>
          </section>

          <section aria-labelledby="sec-retencao">
            <h2 id="sec-retencao" className="text-lg font-semibold text-slate-900 dark:text-white">
              5. Retenção
            </h2>
            <p className="mt-2">
              Não armazenamos os arquivos processados em servidores. Dados de
              cookies e preferências ficam no seu dispositivo até você limpá-los
              ou até o prazo definido pelo provedor do cookie. Mensagens enviadas
              por e-mail podem ser mantidas pelo tempo necessário para atendimento
              e registro legítimo.
            </p>
          </section>

          <section aria-labelledby="sec-direitos">
            <h2 id="sec-direitos" className="text-lg font-semibold text-slate-900 dark:text-white">
              6. Seus direitos (LGPD)
            </h2>
            <p className="mt-2">
              Se você estiver no Brasil, a Lei Geral de Proteção de Dados (LGPD)
              pode garantir direitos como confirmação de tratamento, acesso,
              correção, anonimização, portabilidade, eliminação de dados
              desnecessários e informação sobre compartilhamentos. Como o
              processamento de arquivos é local, grande parte dos dados sensíveis
              do uso das ferramentas <strong>nunca chega a nós</strong>.
            </p>
            <p className="mt-2">
              Para exercer direitos relativos a dados que tenhamos (por exemplo,
              e-mails de contato), escreva para{' '}
              <a
                href="mailto:easypdf19@gmail.com"
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                easypdf19@gmail.com
              </a>
              .
            </p>
          </section>

          <section aria-labelledby="sec-seguranca">
            <h2 id="sec-seguranca" className="text-lg font-semibold text-slate-900 dark:text-white">
              7. Segurança
            </h2>
            <p className="mt-2">
              A principal medida de segurança do Easy PDF é o{' '}
              <strong>modelo 100% client-side</strong>: ao não transmitir seus
              documentos para a nuvem para processamento, reduzimos
              significativamente o risco de interceptação ou vazamento do conteúdo
              em nossos servidores — porque o conteúdo não é armazenado neles.
              Também utilizamos HTTPS no site sempre que disponível.
            </p>
            <p className="mt-2">
              Lembre-se: a segurança do dispositivo e do navegador (atualizações,
              antivírus, uso de redes confiáveis) continua sendo sua
              responsabilidade ao manipular arquivos sensíveis.
            </p>
          </section>

          <section aria-labelledby="sec-menores">
            <h2 id="sec-menores" className="text-lg font-semibold text-slate-900 dark:text-white">
              8. Menores de idade
            </h2>
            <p className="mt-2">
              O serviço não é direcionado a crianças. Não coletamos
              intencionalmente dados pessoais de menores. Se você for responsável
              legal e acreditar que um menor nos enviou dados, entre em contato
              para solicitarmos a remoção do que estiver sob nosso controle.
            </p>
          </section>

          <section aria-labelledby="sec-alteracoes">
            <h2 id="sec-alteracoes" className="text-lg font-semibold text-slate-900 dark:text-white">
              9. Alterações nesta política
            </h2>
            <p className="mt-2">
              Podemos atualizar esta Política de Privacidade para refletir
              melhorias no serviço, mudanças legais ou de parceiros (como
              publicidade). A data no topo da página indica a versão vigente.
              Recomendamos revisitar esta página periodicamente.
            </p>
          </section>

          <section aria-labelledby="sec-contato">
            <h2 id="sec-contato" className="text-lg font-semibold text-slate-900 dark:text-white">
              10. Contato
            </h2>
            <p className="mt-2">
              Dúvidas sobre privacidade:{' '}
              <a
                href="mailto:easypdf19@gmail.com?subject=Privacidade%20-%20Easy%20PDF"
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                easypdf19@gmail.com
              </a>
              .
            </p>
          </section>
        </div>

        <footer className="mt-10 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-6 text-sm dark:border-slate-800">
          <Link
            to="/termos"
            className="font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            Termos de Uso
          </Link>
          <Link to="/" className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400">
            Voltar ao início
          </Link>
        </footer>
      </article>
    </>
  );
}
