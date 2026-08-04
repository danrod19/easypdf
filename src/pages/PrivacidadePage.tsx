import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, ServerOff, Eye } from 'lucide-react';
import { Seo } from '../components/Seo';
import { getSeoForPath } from '../data/seo';
import { CONTACT_EMAIL, contactMailto } from '../data/siteContact';

const LAST_UPDATED = '27 de julho de 2026';

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
              Como a maioria dos sites, podemos utilizar cookies, pixels e
              tecnologias semelhantes (incluindo armazenamento local do
              navegador) para:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Métricas e análise de uso</strong> (Google Analytics 4 —
                ver seção 3).
              </li>
              <li>
                <strong>Anúncios</strong> (como o Google AdSense), que podem usar
                cookies para exibir publicidade e, em alguns casos, anúncios
                personalizados conforme as políticas do Google e suas preferências
                de cookies.
              </li>
              <li>
                <strong>Links de afiliados</strong> (Amazon, Mercado Livre e
                similares — ver seção 4), que podem registrar a origem do clique
                para fins de comissão.
              </li>
              <li>
                <strong>Preferências locais</strong>, como o aceite do banner de
                cookies (salvo em{' '}
                <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                  localStorage
                </code>
                ), para não exibir o aviso novamente.
              </li>
            </ul>
            <p className="mt-2">
              Esses mecanismos <strong>
                não incluem o conteúdo dos PDFs ou documentos que você processa
              </strong>
              . Cookies de publicidade, métricas e afiliados{' '}
              <strong>não têm acesso aos arquivos</strong> que você carrega nas
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

          <section aria-labelledby="sec-ga4">
            <h2 id="sec-ga4" className="text-lg font-semibold text-slate-900 dark:text-white">
              3. Coleta de dados e Analytics (Google Analytics 4)
            </h2>
            <p className="mt-2">
              Utilizamos o <strong>Google Analytics 4 (GA4)</strong>, serviço de
              análise da Google LLC, para obter{' '}
              <strong>métricas de uso do site</strong> (em geral de forma agregada
              e estatística) e melhorar a experiência. Respeitamos as{' '}
              <strong>configurações e preferências de cookies</strong> do usuário
              (banner de consentimento / CMP e opções do navegador). O GA4 pode
              processar, entre outros:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Páginas visitadas, caminhos de navegação e duração aproximada da
                sessão (incluindo eventos de <em>page_view</em> em nossa aplicação
                de página única).
              </li>
              <li>
                Informações técnicas do dispositivo e do navegador (por exemplo,
                tipo de aparelho, resolução aproximada, idioma, sistema
                operacional).
              </li>
              <li>
                Origem do tráfego (como referência de site, campanha ou meio, quando
                disponível).
              </li>
              <li>
                Identificadores e cookies de analytics definidos pelo Google, quando
                o tratamento for permitido pelo seu consentimento e pela configuração
                do navegador.
              </li>
              <li>
                Eventos de interação que configuramos (por exemplo, clique em
                links de afiliados), sem incluir o conteúdo dos seus arquivos PDF.
              </li>
            </ul>
            <p className="mt-2">
              <strong>Base e controle de cookies:</strong> adotamos o{' '}
              <strong>Google Consent Mode v2</strong> com padrões restritivos
              (armazenamento de analytics e publicidade iniciam como{' '}
              <em>denied</em>) até que a ferramenta de consentimento (CMP) ou as
              suas preferências permitam o uso. Você pode recusar ou gerenciar
              cookies pelo banner do site, pelas configurações do navegador ou pelas
              ferramentas do Google (por exemplo,{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                complemento de desativação do Google Analytics
              </a>
              , quando aplicável).
            </p>
            <p className="mt-2">
              Os dados de analytics são processados pelo Google conforme a{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                Política de Privacidade do Google
              </a>{' '}
              e os{' '}
              <a
                href="https://support.google.com/analytics/answer/6004245"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                termos de proteção de dados do Google Analytics
              </a>
              . Esses dados <strong>não incluem o conteúdo dos documentos</strong>{' '}
              que você processa no Easy PDF Local.
            </p>
          </section>

          <section aria-labelledby="sec-afiliados">
            <h2
              id="sec-afiliados"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              4. Monetização e links de afiliados
            </h2>
            <p className="mt-2">
              Com total transparência: o Easy PDF Local pode exibir{' '}
              <strong>links e banners de afiliados</strong> (por exemplo,
              programas da Amazon, Mercado Livre ou outros parceiros comerciais).
              Quando você clica nesses links e realiza uma compra ou ação elegível
              no site do parceiro, <strong>podemos receber uma comissão</strong>.
              Isso <strong>não gera nenhum custo extra para você</strong> em
              relação ao preço praticado pelo vendedor e ajuda a manter a
              ferramenta <strong>100% gratuita e com processamento local</strong>.
            </p>
            <p className="mt-2">
              O que isso implica para a privacidade:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Ao clicar, você é redirecionado para o site de terceiros, que passa
                a ser o responsável pelo tratamento dos dados naquela jornada
                (cadastro, pagamento, cookies próprios etc.).
              </li>
              <li>
                Parceiros de afiliados podem usar cookies, parâmetros na URL ou
                tecnologias semelhantes para{' '}
                <strong>atribuir a origem do clique</strong> e calcular comissões.
              </li>
              <li>
                Podemos registrar, de forma técnica e agregada no nosso analytics,
                eventos como <em>affiliate_click</em> (identificador do link e
                plataforma), <strong>sem enviar o conteúdo dos seus PDFs</strong>.
              </li>
              <li>
                Não controlamos as práticas de privacidade dos sites de destino.
                Recomendamos ler a política de privacidade e os termos do Amazon,
                Mercado Livre ou do parceiro em questão antes de comprar.
              </li>
            </ul>
            <p className="mt-2">
              Links de afiliados são uma forma de manter o serviço gratuito. Eles
              não alteram o fato de que o processamento dos seus documentos
              continua 100% no navegador.
            </p>
          </section>

          <section aria-labelledby="sec-finalidade">
            <h2 id="sec-finalidade" className="text-lg font-semibold text-slate-900 dark:text-white">
              5. Finalidade do tratamento
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Oferecer as ferramentas de PDF de forma gratuita e funcional.</li>
              <li>
                Medir audiência e desempenho do site (Google Analytics 4) de forma
                agregada.
              </li>
              <li>Exibir anúncios (ex.: Google AdSense) que ajudam a manter o serviço.</li>
              <li>
                Divulgar ofertas de parceiros via links de afiliados e, quando
                aplicável, receber comissões por indicação.
              </li>
              <li>Atender contatos e solicitações enviadas por você.</li>
              <li>Cumprir obrigações legais, quando aplicável.</li>
            </ul>
          </section>

          <section aria-labelledby="sec-compartilhamento">
            <h2 id="sec-compartilhamento" className="text-lg font-semibold text-slate-900 dark:text-white">
              6. Compartilhamento de dados
            </h2>
            <p className="mt-2">
              <strong>Não vendemos seus dados pessoais.</strong> Em relação aos
              arquivos processados nas ferramentas: como eles não são enviados a
              nossos servidores, também não os compartilhamos com ninguém.
            </p>
            <p className="mt-2">
              Podemos compartilhar ou permitir o acesso a dados técnicos de
              navegação por:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Google</strong> (Analytics, AdSense e serviços relacionados),
                conforme cookies e consentimento;
              </li>
              <li>
                <strong>Parceiros de afiliados</strong> (ex.: Amazon, Mercado Livre),
                quando você clica em links de indicação e interage com os sites
                deles;
              </li>
              <li>
                Autoridades, se houver obrigação legal.
              </li>
            </ul>
            <p className="mt-2">
              Recomendamos consultar a{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                Política de Privacidade do Google
              </a>
              , as opções de personalização de anúncios e as políticas dos programas
              de afiliados dos parceiros.
            </p>
          </section>

          <section aria-labelledby="sec-retencao">
            <h2 id="sec-retencao" className="text-lg font-semibold text-slate-900 dark:text-white">
              7. Retenção
            </h2>
            <p className="mt-2">
              Não armazenamos os arquivos processados em servidores. Dados de
              cookies e preferências ficam no seu dispositivo até você limpá-los
              ou até o prazo definido pelo provedor do cookie (Google, parceiros de
              afiliados etc.). Relatórios no Google Analytics seguem os prazos de
              retenção configurados na conta GA4. Mensagens enviadas por e-mail
              podem ser mantidas pelo tempo necessário para atendimento e registro
              legítimo.
            </p>
          </section>

          <section aria-labelledby="sec-direitos">
            <h2 id="sec-direitos" className="text-lg font-semibold text-slate-900 dark:text-white">
              8. Seus direitos (LGPD)
            </h2>
            <p className="mt-2">
              Se você estiver no Brasil, a Lei Geral de Proteção de Dados (LGPD)
              pode garantir direitos como confirmação de tratamento, acesso,
              correção, anonimização, portabilidade, eliminação de dados
              desnecessários, informação sobre compartilhamentos e revogação de
              consentimento quando o tratamento se basear nele. Como o
              processamento de arquivos é local, grande parte dos dados sensíveis
              do uso das ferramentas <strong>nunca chega a nós</strong>.
            </p>
            <p className="mt-2">
              Para exercer direitos relativos a dados que tenhamos (por exemplo,
              e-mails de contato) ou dúvidas sobre cookies, analytics e afiliados,
              escreva para{' '}
              <a
                href={contactMailto('Privacidade - Easy PDF Local')}
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                {CONTACT_EMAIL}
              </a>
              . Pedidos relacionados a dados tratados exclusivamente pelo Google
              ou por marketplaces devem ser, em muitos casos, exercidos também
              junto a esses controladores.
            </p>
          </section>

          <section aria-labelledby="sec-seguranca">
            <h2 id="sec-seguranca" className="text-lg font-semibold text-slate-900 dark:text-white">
              9. Segurança
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
              10. Menores de idade
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
              11. Alterações nesta política
            </h2>
            <p className="mt-2">
              Podemos atualizar esta Política de Privacidade para refletir
              melhorias no serviço, mudanças legais ou de parceiros (publicidade,
              analytics, afiliados). A data no topo da página indica a versão
              vigente. Recomendamos revisitar esta página periodicamente.
            </p>
          </section>

          <section aria-labelledby="sec-contato">
            <h2 id="sec-contato" className="text-lg font-semibold text-slate-900 dark:text-white">
              12. Contato
            </h2>
            <p className="mt-2">
              Dúvidas sobre privacidade, cookies, Google Analytics ou links de
              afiliados:{' '}
              <a
                href={contactMailto('Privacidade - Easy PDF Local')}
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                {CONTACT_EMAIL}
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
