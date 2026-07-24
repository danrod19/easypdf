import { useCallback, useId, useState } from 'react';
import { Eye, EyeOff, KeyRound, Loader2, Unlock } from 'lucide-react';
import { Seo } from '../components/Seo';
import { getSeoForPath } from '../data/seo';
import { AdSlot } from '../components/AdSlot';
import { ProgressBar } from '../components/ProgressBar';
import { DropZone } from '../components/merge/DropZone';
import { FaqAccordion } from '../components/FaqAccordion';
import { StickyCta } from '../components/StickyCta';
import { SuccessAction } from '../components/SuccessAction';
import { ToolSeoContent } from '../components/ToolSeoContent';
import { PdfPreviewModal } from '../components/PdfPreviewModal';
import { desbloquearPdfSeoContent } from '../data/toolSeoContent';
import {
  unlockPdfWithPassword,
  unlockedFileName,
} from '../lib/unlockPdf';
import { downloadBlob, formatBytes } from '../lib/format';
import type { FaqItem } from '../data/faq';

const unlockFaqItems: FaqItem[] = [
  {
    id: 'senha-correta',
    question: 'Preciso saber a senha para desbloquear?',
    answer:
      'Sim. Esta ferramenta remove a proteção quando você já conhece a senha de abertura. Não fazemos “quebra” de senha nem contornamos a criptografia sem a chave correta.',
  },
  {
    id: 'seguro',
    question: 'A senha ou o PDF sobem para algum servidor?',
    answer:
      'Não. Tudo roda no navegador: a senha só é usada localmente para abrir o arquivo e gerar uma cópia sem proteção. Nada é enviado à nuvem da Easy PDF Local.',
  },
  {
    id: 'qualidade',
    question: 'O PDF desbloqueado fica idêntico ao original?',
    answer:
      'PDFs já abertos sem senha são regravados com pdf-lib (estrutura nativa). PDFs com senha de usuário são validados com pdf.js e reconstruídos página a página em alta qualidade — o visual é preservado; texto pode deixar de ser selecionável no resultado (vira imagem).',
  },
  {
    id: 'errado',
    question: 'O que acontece se a senha estiver errada?',
    answer:
      'Mostramos um aviso claro (“Senha incorreta…”) e não geramos download. Confira maiúsculas, espaços e tente de novo.',
  },
];

/**
 * Página /desbloquear-pdf — remove senha de abertura (client-side).
 */
export default function DesbloquearPdfPage() {
  const errorId = useId();
  const passwordId = useId();

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewBytes, setPreviewBytes] = useState<Uint8Array | null>(null);
  const [previewFileName, setPreviewFileName] = useState('');

  const resetPreview = useCallback(() => {
    setIsModalOpen(false);
    setPreviewBytes(null);
    setPreviewFileName('');
  }, []);

  const resetResult = useCallback(() => {
    setError(null);
    setSuccess(null);
    setProgress(0);
    setProgressMsg('');
    resetPreview();
  }, [resetPreview]);

  const clearFile = useCallback(() => {
    setFile(null);
    setPassword('');
    setShowPassword(false);
    resetResult();
  }, [resetResult]);

  const handleFiles = useCallback(
    (files: File[]) => {
      const next = files[0];
      if (!next) return;
      resetResult();
      setFile(next);
      setPassword('');
    },
    [resetResult]
  );

  const handleUnlock = async () => {
    if (!file) {
      setError('Envie um arquivo PDF primeiro.');
      return;
    }
    if (!password.trim()) {
      setError('Digite a senha atual do PDF.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setProgress(0);
    setProgressMsg('Iniciando…');
    resetPreview();

    try {
      const bytes = await unlockPdfWithPassword(
        file,
        password,
        ({ percent, message }) => {
          setProgress(percent);
          setProgressMsg(message);
        }
      );

      const stableBytes = new Uint8Array(bytes);
      const fileName = unlockedFileName(file.name);

      setPreviewBytes(stableBytes);
      setPreviewFileName(fileName);
      setIsModalOpen(true);

      setSuccess(
        'PDF desbloqueado com sucesso. Confira a pré-visualização (sem cadeado) e baixe quando quiser.'
      );
      setPassword('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Falha inesperada ao remover a senha.'
      );
      setProgress(0);
      setProgressMsg('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClosePreview = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleDownloadFromPreview = useCallback(() => {
    if (!previewBytes) return;
    const blob = new Blob([new Uint8Array(previewBytes)], {
      type: 'application/pdf',
    });
    downloadBlob(blob, previewFileName || 'pdf-desbloqueado.pdf');
    setIsModalOpen(false);
    setSuccess('Download iniciado. O arquivo permanece só no seu dispositivo.');
  }, [previewBytes, previewFileName]);

  const canUnlock = !!file && password.trim().length > 0 && !isProcessing;
  const seo = getSeoForPath('/desbloquear-pdf');

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Ferramenta gratuita · Sem upload
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Desbloquear PDF
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Remova a senha de abertura de um PDF quando você já a conhece.
            Processamento 100% no navegador — sem envio do arquivo para a
            nuvem.
          </p>
        </header>

        {!file ? (
          <DropZone
            onFiles={handleFiles}
            disabled={isProcessing}
            multiple={false}
            labels={{
              idle: 'Arraste e solte seu PDF protegido',
              dragging: 'Solte o PDF aqui',
              hint: 'ou clique para escolher · 1 arquivo · desbloqueio local com senha',
              ariaLabel: 'Selecionar PDF para desbloquear',
            }}
          />
        ) : (
          <div className="card space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Arquivo carregado
                </p>
                <p className="truncate font-semibold text-slate-800 dark:text-slate-100">
                  {file.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {formatBytes(file.size)} · PDF
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary shrink-0"
                disabled={isProcessing}
                onClick={clearFile}
              >
                Trocar arquivo
              </button>
            </div>

            <div className="space-y-4 border-t border-slate-200 pt-5 dark:border-slate-700">
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2.5 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
                <KeyRound className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <p>
                  Informe a <strong className="font-semibold">senha atual</strong>{' '}
                  do documento. Sem a senha correta não é possível remover a
                  proteção — não há recuperação de senha esquecida.
                </p>
              </div>

              <div className="space-y-1.5 sm:max-w-md">
                <label
                  htmlFor={passwordId}
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Senha do PDF
                </label>
                <div className="relative">
                  <input
                    id={passwordId}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-3 pr-11 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    placeholder="Senha de abertura do arquivo"
                    value={password}
                    disabled={isProcessing}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      resetResult();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && canUnlock) {
                        void handleUnlock();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? 'Ocultar senha' : 'Mostrar senha'
                    }
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  className="btn-primary w-full sm:w-auto sm:min-w-[260px]"
                  disabled={!canUnlock}
                  onClick={() => void handleUnlock()}
                  aria-describedby={error ? errorId : undefined}
                  aria-busy={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Removendo senha…
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4" aria-hidden />
                      Remover Senha
                    </>
                  )}
                </button>
                {previewBytes && !isModalOpen && (
                  <button
                    type="button"
                    className="btn-secondary w-full sm:w-auto"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Ver pré-visualização
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div
            id={errorId}
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          >
            {error}
          </div>
        )}

        {success && <SuccessAction message={success} />}

        <ProgressBar
          visible={isProcessing || progress === 100}
          percent={progress}
          message={progressMsg || 'Desbloqueando PDF…'}
        />

        <div className="lg:hidden">
          <AdSlot placement="below-cta" />
        </div>

        <section className="card text-sm text-slate-600 dark:text-slate-400">
          <h2 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
            Como funciona
          </h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Envie o PDF protegido por senha.</li>
            <li>Digite a senha de abertura correta.</li>
            <li>
              Clique em <em>Remover Senha</em> — a validação e a geração do
              arquivo sem proteção ocorrem no navegador.
            </li>
            <li>
              Confira a pré-visualização (prova visual de que o cadeado saiu) e
              baixe{' '}
              <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                nome-desbloqueado-….pdf
              </code>
              .
            </li>
          </ol>
        </section>

        <ToolSeoContent content={desbloquearPdfSeoContent} />

        <FaqAccordion
          title="Perguntas frequentes sobre Desbloquear PDF"
          subtitle="Senha, privacidade e o que esperar do arquivo final."
          items={unlockFaqItems}
        />
      </div>

      <StickyCta />

      <PdfPreviewModal
        isOpen={isModalOpen}
        pdfBytes={previewBytes}
        fileName={previewFileName}
        onClose={handleClosePreview}
        onDownload={handleDownloadFromPreview}
      />
    </>
  );
}
