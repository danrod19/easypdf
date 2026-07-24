import { useCallback, useId, useState } from 'react';
import { Images, Loader2 } from 'lucide-react';
import { Seo } from '../components/Seo';
import { getSeoForPath } from '../data/seo';
import { AdSlot } from '../components/AdSlot';
import { ProgressBar } from '../components/ProgressBar';
import { DropZone } from '../components/merge/DropZone';
import { FaqAccordion } from '../components/FaqAccordion';
import { StickyCta } from '../components/StickyCta';
import { ToolSeoContent } from '../components/ToolSeoContent';
import { imagemParaPdfSeoContent } from '../data/toolSeoContent';
import { SuccessAction } from '../components/SuccessAction';
import {
  ImageFileList,
  type ImageItem,
} from '../components/image/ImageFileList';
import {
  convertAndDownloadImagesToPdf,
  getImageAcceptAttr,
  isSupportedImageFile,
} from '../lib/imageToPdf';
import type { FaqItem } from '../data/faq';

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const imagePdfFaqItems: FaqItem[] = [
  {
    id: 'juntar-varias',
    question: 'Como juntar várias imagens em um único PDF?',
    answer:
      'Envie múltiplos arquivos JPG ou PNG de uma vez no DropZone (ou adicione em etapas). As miniaturas aparecem em grade — use Subir/Descer para reordenar e defina a sequência das páginas. Clique em “Gerar PDF”: cada imagem vira uma página no mesmo arquivo, com pdf-lib no seu navegador.',
  },
  {
    id: 'qualidade',
    question: 'Meus JPGs perdem qualidade?',
    answer:
      'Não. JPEG e PNG são embutidos nativamente no PDF (embedJpg / embedPng), sem recompactação destrutiva. A página usa as dimensões exatas da imagem original — não redimensionamos para A4. Assim a nitidez e a compressão do arquivo de origem são preservadas.',
  },
  {
    id: 'tamanho-pagina',
    question: 'A página do PDF fica no tamanho A4?',
    answer:
      'Não. Adotamos a abordagem “página = tamanho da imagem”: cada página tem width e height iguais aos pixels da imagem embutida. Isso evita bordas brancas e distorção. Visualizadores de PDF escalam a visualização; a impressão em A4 pode exigir “ajustar à página” no diálogo de impressão.',
  },
  {
    id: 'seguro',
    question: 'É seguro converter imagens em PDF aqui?',
    answer:
      'Sim. Todo o processamento roda 100% offline no navegador. Suas imagens nunca são enviadas a servidores — ficam só na memória do dispositivo até o download de imagens-convertidas.pdf.',
  },
  {
    id: 'formatos',
    question: 'Quais formatos de imagem são aceitos?',
    answer:
      'Principalmente JPEG (.jpg/.jpeg) e PNG (.png). Arquivos WebP podem ser aceitos e convertidos internamente para PNG antes do embed. Outros formatos (GIF, BMP, HEIC) não são suportados nesta ferramenta.',
  },
];

/**
 * Página /imagem-para-pdf — 1..N imagens → um PDF (pdf-lib).
 * Reordenação, exclusão e download 100% no navegador.
 */
export default function ImagemParaPdfPage() {
  const errorId = useId();
  const [items, setItems] = useState<ImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addFiles = useCallback((files: File[]) => {
    setError(null);
    setSuccess(false);
    setItems((prev) => {
      const next = [...prev];
      for (const file of files) {
        if (!isSupportedImageFile(file)) continue;
        const exists = next.some(
          (p) =>
            p.file.name === file.name &&
            p.file.size === file.size &&
            p.file.lastModified === file.lastModified
        );
        if (!exists) next.push({ id: createId(), file });
      }
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setError(null);
    setSuccess(false);
  }, []);

  const moveItem = useCallback((id: string, direction: 'up' | 'down') => {
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === id);
      if (index < 0) return prev;
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      copy.splice(target, 0, removed);
      return copy;
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    setError(null);
    setSuccess(false);
    setProgress(0);
    setProgressMsg('');
  }, []);

  const handleConvert = async () => {
    if (items.length < 1) {
      setError('Adicione pelo menos 1 imagem (JPEG ou PNG).');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setProgress(0);
    setProgressMsg('Iniciando…');

    try {
      // Ordem da lista = ordem das páginas
      const files = items.map((i) => i.file);
      await convertAndDownloadImagesToPdf(files, ({ percent, message }) => {
        setProgress(percent);
        setProgressMsg(message);
      });

      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Falha inesperada ao converter as imagens.';
      setError(message);
      setProgress(0);
      setProgressMsg('');
    } finally {
      setIsProcessing(false);
    }
  };

  const canConvert = items.length >= 1 && !isProcessing;
  const seo = getSeoForPath('/imagem-para-pdf');

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Ferramenta gratuita · Sem upload
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Imagem para PDF
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Converta uma imagem ou{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              junte várias JPG/PNG
            </strong>{' '}
            em um único PDF. Cada arquivo vira uma página no{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              tamanho original da imagem
            </strong>{' '}
            — processamento com pdf-lib no navegador, sem upload.
          </p>
        </header>

        <DropZone
          onFiles={addFiles}
          disabled={isProcessing}
          multiple={true}
          accept={getImageAcceptAttr()}
          acceptFile={isSupportedImageFile}
          onReject={() =>
            setError('Apenas imagens JPEG (.jpg/.jpeg) ou PNG (.png) são aceitas.')
          }
          labels={{
            idle: 'Arraste e solte suas imagens',
            dragging: 'Solte as imagens aqui',
            hint: 'ou clique para escolher · múltiplos arquivos · PNG, JPG, JPEG · processamento local',
            ariaLabel: 'Selecionar imagens PNG ou JPEG',
            rejectMessage:
              'Apenas imagens JPEG (.jpg/.jpeg) ou PNG (.png) são aceitas.',
          }}
        />

        <ImageFileList
          items={items}
          disabled={isProcessing}
          onRemove={removeItem}
          onMove={moveItem}
          onClear={clearAll}
        />

        {error && (
          <div
            id={errorId}
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          >
            {error}
          </div>
        )}

        {success && (
          <SuccessAction message="Arquivo processado e baixado com sucesso!" />
        )}

        <ProgressBar
          visible={isProcessing || progress === 100}
          percent={progress}
          message={progressMsg}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            className="btn-primary w-full sm:w-auto sm:min-w-[220px] !bg-emerald-600 hover:!bg-emerald-700 focus-visible:!ring-emerald-500"
            disabled={!canConvert}
            onClick={() => void handleConvert()}
            aria-describedby={error ? errorId : undefined}
            aria-busy={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Gerando PDF…
              </>
            ) : (
              <>
                <Images className="h-4 w-4" aria-hidden />
                Gerar PDF
                {items.length > 0 ? ` (${items.length})` : ''}
              </>
            )}
          </button>

          {items.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Adicione uma ou várias imagens para habilitar a conversão.
            </p>
          )}
          {items.length === 1 && !isProcessing && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              1 imagem → PDF de 1 página. Adicione mais para juntar.
            </p>
          )}
          {items.length > 1 && !isProcessing && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {items.length} imagens serão mescladas em um único PDF, na ordem
              da lista.
            </p>
          )}
        </div>

        <div className="lg:hidden">
          <AdSlot placement="below-cta" />
        </div>

        <section className="card text-sm text-slate-600 dark:text-slate-400">
          <h2 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
            Como funciona
          </h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Arraste ou selecione uma ou várias imagens PNG/JPG/JPEG.</li>
            <li>
              Reordene no grid com <em>Subir</em> / <em>Descer</em> — a ordem
              define as páginas do PDF. Use a lixeira para excluir.
            </li>
            <li>
              Clique em <em>Gerar PDF</em> — cada imagem é embutida com pdf-lib
              (<code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                embedJpg
              </code>{' '}
              /{' '}
              <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                embedPng
              </code>
              ) em uma página do <strong>tamanho original da imagem</strong>{' '}
              (não A4).
            </li>
            <li>
              O arquivo{' '}
              <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                imagens-convertidas.pdf
              </code>{' '}
              é baixado automaticamente no seu dispositivo.
            </li>
          </ol>
        </section>

        <ToolSeoContent content={imagemParaPdfSeoContent} />

        <FaqAccordion
          items={imagePdfFaqItems}
          title="Perguntas frequentes sobre Imagem para PDF"
          subtitle="Juntar várias imagens, qualidade JPG, tamanho de página e privacidade."
        />
      </div>

      <StickyCta />
    </>
  );
}
