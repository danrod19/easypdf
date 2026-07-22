import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

const LAST_UPDATED = '22 de julho de 2026';

export default function TermosPage() {
  return (
    <>
      <Seo
        title="Termos de Uso"
        description="Termos de Uso do Easy PDF (easypdflocal.com.br). Regras de utilização das ferramentas de PDF 100% no navegador."
      />

      <article className="card mx-auto max-w-3xl">
        <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Termos de Uso
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Última atualização: {LAST_UPDATED}
          </p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <section aria-labelledby="termos-aceitacao">
            <h2
              id="termos-aceitacao"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              1. Aceitação dos termos
            </h2>
            <p className="mt-2">
              Ao acessar ou utilizar o site <strong>Easy PDF</strong>{' '}
              (easypdflocal.com.br) e suas ferramentas, você concorda com estes
              Termos de Uso e com a nossa{' '}
              <Link
                to="/privacidade"
                className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                Política de Privacidade
              </Link>
              . Se não concordar, não utilize o serviço.
            </p>
          </section>

          <section aria-labelledby="termos-servico">
            <h2
              id="termos-servico"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              2. Descrição do serviço
            </h2>
            <p className="mt-2">
              O Easy PDF oferece ferramentas gratuitas para manipular arquivos
              PDF e formatos relacionados (por exemplo: juntar, dividir, girar,
              marca d&apos;água, conversões e extração de texto), executadas{' '}
              <strong>no navegador do usuário (client-side)</strong>. Não é
              necessário criar conta para usar as funcionalidades principais.
            </p>
            <p className="mt-2">
              O serviço é fornecido &quot;como está&quot; e pode ser alterado,
              ampliado ou descontinuado a qualquer momento, sem aviso prévio
              obrigatório.
            </p>
          </section>

          <section aria-labelledby="termos-local">
            <h2
              id="termos-local"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              3. Processamento local e responsabilidade pelos arquivos
            </h2>
            <p className="mt-2">
              O processamento dos arquivos ocorre no seu dispositivo. Você é o
              único responsável por:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Ter direitos legítimos sobre os documentos que processa.</li>
              <li>
                Manter cópias de segurança dos arquivos originais antes de
                qualquer edição.
              </li>
              <li>
                Verificar o resultado baixado (qualidade, páginas, conteúdo)
                antes de usá-lo para fins importantes.
              </li>
              <li>
                Não utilizar o serviço para fins ilícitos, ofensivos ou que
                violem direitos de terceiros.
              </li>
            </ul>
          </section>

          <section aria-labelledby="termos-uso">
            <h2
              id="termos-uso"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              4. Uso permitido e proibido
            </h2>
            <p className="mt-2">É permitido:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Usar as ferramentas para fins pessoais, educacionais ou
                profissionais lícitos.
              </li>
              <li>
                Compartilhar o link do site com outras pessoas de boa-fé.
              </li>
            </ul>
            <p className="mt-3">É proibido:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Tentar comprometer a segurança, disponibilidade ou integridade
                do site (ataques, exploração de falhas, sobrecarga intencional).
              </li>
              <li>
                Utilizar robôs, scrapers ou automação de forma abusiva que
                prejudique o serviço ou outros usuários.
              </li>
              <li>
                Remover, ocultar ou interferir em anúncios, marcas ou avisos
                legais do site, salvo com autorização.
              </li>
              <li>
                Usar o Easy PDF para processar ou disseminar conteúdo ilegal,
                difamatório, discriminatório ou que viole propriedade
                intelectual de terceiros.
              </li>
              <li>
                Representar-se como operador do site ou sugerir parceria
                oficial inexistente.
              </li>
            </ul>
          </section>

          <section aria-labelledby="termos-pi">
            <h2
              id="termos-pi"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              5. Propriedade intelectual
            </h2>
            <p className="mt-2">
              O nome Easy PDF, o layout, textos, identidade visual e código da
              aplicação (salvo bibliotecas de terceiros com suas próprias
              licenças) são protegidos por direitos de propriedade intelectual.
              Você não adquire qualquer direito de cópia, sublicença ou
              exploração comercial do site além do uso normal das ferramentas.
            </p>
            <p className="mt-2">
              Os arquivos que você carrega e o resultado gerado no seu
              dispositivo continuam sob a titularidade e responsabilidade que
              você já possuía; o Easy PDF não reivindica direitos sobre o
              conteúdo desses documentos.
            </p>
          </section>

          <section aria-labelledby="termos-anuncios">
            <h2
              id="termos-anuncios"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              6. Publicidade e financiamento
            </h2>
            <p className="mt-2">
              O site pode exibir anúncios (incluindo Google AdSense) e outras
              formas de apoio (como doações) para manter o serviço gratuito.
              Anúncios de terceiros estão sujeitos às políticas dos respectivos
              fornecedores. Não nos responsabilizamos pelo conteúdo de sites
              externos acessados a partir de anúncios.
            </p>
          </section>

          <section aria-labelledby="termos-garantias">
            <h2
              id="termos-garantias"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              7. Isenção de garantias
            </h2>
            <p className="mt-2">
              As ferramentas são oferecidas de forma gratuita e sem garantia de
              disponibilidade ininterrupta, ausência de erros, compatibilidade
              com todos os arquivos ou navegadores, ou adequação a um propósito
              específico. Resultados de conversão, OCR, união ou edição podem
              variar conforme o arquivo de origem e o navegador utilizado.
            </p>
          </section>

          <section aria-labelledby="termos-limitacao">
            <h2
              id="termos-limitacao"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              8. Limitação de responsabilidade
            </h2>
            <p className="mt-2">
              Na máxima extensão permitida pela lei aplicável, o Easy PDF e seus
              operadores não se responsabilizam por danos diretos, indiretos,
              lucros cessantes, perda de dados, falhas de conversão ou
              quaisquer prejuízos decorrentes do uso ou da impossibilidade de
              uso do serviço. Sempre mantenha backups dos arquivos originais.
            </p>
          </section>

          <section aria-labelledby="termos-links">
            <h2
              id="termos-links"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              9. Links externos
            </h2>
            <p className="mt-2">
              O site pode conter links para páginas de terceiros (políticas do
              Google, e-mail, etc.). Não controlamos o conteúdo nem as práticas
              desses sites e não nos responsabilizamos por eles.
            </p>
          </section>

          <section aria-labelledby="termos-alteracoes">
            <h2
              id="termos-alteracoes"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              10. Alterações dos termos
            </h2>
            <p className="mt-2">
              Podemos modificar estes Termos a qualquer momento. A versão
              vigente será a publicada nesta página, com a data de atualização
              no topo. O uso continuado do site após a publicação constitui
              aceitação das alterações.
            </p>
          </section>

          <section aria-labelledby="termos-lei">
            <h2
              id="termos-lei"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              11. Lei aplicável
            </h2>
            <p className="mt-2">
              Estes Termos são interpretados de acordo com as leis da República
              Federativa do Brasil. Eventuais controvérsias deverão ser
              dirimidas no foro competente, ressalvados direitos imperativos do
              consumidor.
            </p>
          </section>

          <section aria-labelledby="termos-contato">
            <h2
              id="termos-contato"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              12. Contato
            </h2>
            <p className="mt-2">
              Dúvidas sobre estes Termos:{' '}
              <a
                href="mailto:easypdf19@gmail.com?subject=Termos%20de%20Uso%20-%20Easy%20PDF"
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
            to="/privacidade"
            className="font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            Política de Privacidade
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
