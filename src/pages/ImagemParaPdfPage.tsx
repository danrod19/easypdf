import { useCallback, useId, useState } from 'react';
import { Images, Loader2 } from 'lucide-react';
import { Seo } from '../components/Seo';
import { AdSlot } from '../components/AdSlot';
import { ProgressBar } from '../components/ProgressBar';
import { DropZone } from '../components/merge/DropZone';
import { FaqAccordion } from '../components/FaqAccordion';
import { StickyCta } from '../components/StickyCta';
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
      'Envie múltiplos arquivos JPG ou PNG de uma vez no DropZone (ou adicione em etapas). As miniaturas aparecem em grade — use as setas para reordenar e defina a sequência das páginas. Clique em “Gerar PDF”: cada imagem vira uma página no mesmo arquivo, com pdf-lib no seu navegador.',
  },
  {
    id: 'qualidade',
    question: 'Meus JPGs perdem qualidade?',
    answer:
      'Não. JPEG e PNG são embutidos nativamente no PDF (embedJpg / embedPng), sem recompactação destrutiva. A página usa as dimensões exatas da imagem original. Assim a nitidez e a compressão do arquivo de origem são preservadas.',
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
  {
    id: 'uma-ou-varias',
    question: 'Posso converter só uma imagem?',
    answer:
      'Sim. Com uma única imagem o PDF terá uma página do tamanho dela. Com várias, o mesmo fluxo “junta” tudo em um único PDF multipágina, na ordem do grid.',
  },
];

/**
 * Página /imagem-para-pdf — 1..N imagens → um PDF (pdf-lib).
 * Suporta conversão unitária e mesclagem de múltiplas imagens.
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

  const moveItem = useCallback((id: string, direction: 'back' | 'forward') => {
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === id);
      if (index < 0) return prev;
      const target = direction === 'back' ? index - 1 : index + 1;
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

  return (
    <>
      <Seo
        title="Imagem para PDF — Juntar imagens JPG/PNG"
        description="Junte várias imagens JPG/PNG em um único PDF, 100% no navegador. Reordene, converta e baixe sem enviar arquivos para a nuvem."
      />

      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Ferramenta gratuita
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Imagem para PDF
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Converta uma imagem ou{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              junte várias JPG/PNG
            </strong>{' '}
            em um único PDF. Cada arquivo vira uma página no tamanho original —
            processamento com{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              pdf-lib no seu navegador
            </strong>
            , sem upload.
          </p>
        </header>

        <DropZone
          onFiles={addFiles}
          disabled={isProcessing}
          multiple={true}
          accept={getImageAcceptAttr()}
          acceptFile={isSupportedImageFile}
          onReject={() =>
            setError('Apenas imagens JPEG ou PNG são aceitas.')
          }
          labels={{
            idle: 'Arraste e solte suas imagens',
            dragging: 'Solte as imagens aqui',
            hint: 'ou clique para escolher · múltiplos arquivos · JPEG e PNG · processamento local',
            ariaLabel: 'Selecionar imagens JPEG ou PNG',
            rejectMessage: 'Apenas imagens JPEG ou PNG são aceitas.',
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
              {items.length} imagens serão mescladas em um único PDF.
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
            <li>Arraste ou selecione uma ou várias imagens JPEG/PNG.</li>
            <li>
              Reordene no grid com as setas — a ordem define as páginas do PDF.
            </li>
            <li>
              Clique em <em>Gerar PDF</em> — cada imagem é embutida com pdf-lib
              em uma página do tamanho original (sem redimensionar para A4).
            </li>
            <li>
              O arquivo{' '}
              <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                imagens-convertidas.pdf
              </code>{' '}
              é baixado automaticamente.
            </li>
          </ol>
        </section>

        <FaqAccordion
          items={imagePdfFaqItems}
          title="Perguntas frequentes sobre Imagem para PDF"
          subtitle="Juntar várias imagens, qualidade JPG e privacidade offline."
        />
      </div>

      <StickyCta />
    </>
  );
}
