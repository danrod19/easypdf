import { useCallback, useId, useState } from 'react';
import { Eye, EyeOff, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { Seo } from '../components/Seo';
import { getSeoForPath } from '../data/seo';
import { AdSlot } from '../components/AdSlot';
import { ProgressBar } from '../components/ProgressBar';
import { DropZone } from '../components/merge/DropZone';
import { FaqAccordion } from '../components/FaqAccordion';
import { StickyCta } from '../components/StickyCta';
import { SuccessAction } from '../components/SuccessAction';
import { ToolSeoContent } from '../components/ToolSeoContent';
import { protegerPdfSeoContent } from '../data/toolSeoContent';
import { TOOL_NAMES } from '../data/toolNames';
import { useToolAnalytics } from '../hooks/useToolAnalytics';
import { useFileIntake } from '../hooks/useFileIntake';
import { dropZoneLimitHint } from '../lib/fileValidation';
import {
  protectPdfWithPassword,
  protectedFileName,
  validatePasswords,
} from '../lib/protectPdf';
import { getPdfPageCount } from '../lib/splitPdf';
import { downloadBlob, formatBytes } from '../lib/format';
import type { FaqItem } from '../data/faq';

const protectFaqItems: FaqItem[] = [
  {
    id: 'como-abre',
    question: 'Como alguém abre o PDF protegido?',
    answer:
      'Quem receber o arquivo precisará da senha que você definiu. Visualizadores de PDF (Adobe, Chrome, Preview, etc.) pedem a senha ao abrir. Sem a senha, o conteúdo permanece cifrado.',
  },
  {
    id: 'seguro',
    question: 'A senha é enviada para algum servidor?',
    answer:
      'Não. A criptografia roda 100% no seu navegador. O PDF e a senha ficam só na memória do dispositivo até o download. Nada é enviado à nuvem da Easy PDF Local.',
  },
  {
    id: 'remover-senha',
    question: 'Posso remover a senha depois?',
    answer:
      'Sim. Use a ferramenta Desbloquear PDF (/desbloquear-pdf) com a mesma senha para gerar uma cópia sem proteção — também 100% no navegador. Guarde a senha em local seguro: não recuperamos senhas esquecidas.',
  },
  {
    id: 'forca',
    question: 'Qual senha devo usar?',
    answer:
      'Use pelo menos 4 caracteres; recomendamos 8+ com letras e números. Evite senhas óbvias (1234, data de nascimento). A mesma senha serve como user e owner password neste fluxo.',
  },
];

/**
 * Página /proteger-pdf — criptografa PDF com senha (client-side).
 */
export default function ProtegerPdfPage() {
  const errorId = useId();
  const passwordId = useId();
  const confirmId = useId();
  const ga = useToolAnalytics(TOOL_NAMES.PROTEGER_PDF);
  const intake = useFileIntake(TOOL_NAMES.PROTEGER_PDF, 'pdf_single');

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetResult = useCallback(() => {
    setError(null);
    setSuccess(null);
    setProgress(0);
    setProgressMsg('');
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setPageCount(null);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    resetResult();
  }, [resetResult]);

  const handleFiles = useCallback(
    async (files: File[]) => {
      const next = files[0];
      if (!next) return;

      const gate = await intake([next]);
      if (!gate.ok) {
        setError(gate.message);
        return;
      }
      const accepted = gate.files[0] ?? next;

      setIsLoadingMeta(true);
      resetResult();
      setFile(accepted);
      setPageCount(null);
      setPassword('');
      setConfirmPassword('');

      try {
        const count = await getPdfPageCount(accepted);
        setPageCount(count);
        ga.trackUpload(gate.files);
      } catch (err) {
        setFile(null);
        setPageCount(null);
        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível ler o PDF.'
        );
      } finally {
        setIsLoadingMeta(false);
      }
    },
    [ga, intake, resetResult]
  );

  const handleProtect = async () => {
    if (!file) {
      setError('Envie um arquivo PDF primeiro.');
      return;
    }

    try {
      validatePasswords(password, confirmPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Senha inválida.');
      setSuccess(null);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setProgress(0);
    setProgressMsg('Iniciando criptografia…');

    const startedAt = ga.startProcess(1);

    try {
      const bytes = await protectPdfWithPassword(
        file,
        password,
        confirmPassword,
        ({ percent, message }) => {
          setProgress(percent);
          setProgressMsg(message);
        }
      );

      const outName = protectedFileName(file.name);
      const blob = new Blob([new Uint8Array(bytes)], {
        type: 'application/pdf',
      });
      downloadBlob(blob, outName);
      ga.trackDownload(outName);
      ga.endProcess(true, startedAt);

      setSuccess(
        'PDF criptografado com sucesso. O download deve ter iniciado. Guarde a senha com segurança.'
      );
      // Limpa senhas da UI após sucesso (não ficam na tela)
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Falha inesperada ao proteger o PDF.'
      );
      setProgress(0);
      setProgressMsg('');
      ga.endProcess(false, startedAt);
    } finally {
      setIsProcessing(false);
    }
  };

  const busy = isProcessing || isLoadingMeta;
  const canProtect =
    !!file &&
    pageCount != null &&
    pageCount > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    !busy;

  const seo = getSeoForPath('/proteger-pdf');

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Ferramenta gratuita · Sem upload
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Proteger PDF
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Defina uma senha e criptografe o PDF no navegador. Quem abrir o
            arquivo precisará da senha — sem enviar o documento para a nuvem.
          </p>
        </header>

        {!file ? (
          <DropZone
            onFiles={handleFiles}
            disabled={busy}
            multiple={false}
            onReject={(msg) => setError(msg)}
            labels={{
              idle: 'Arraste e solte seu PDF',
              dragging: 'Solte o PDF aqui',
              hint: `ou clique para escolher · ${dropZoneLimitHint('pdf_single')}`,
              ariaLabel: 'Selecionar PDF para proteger',
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
                  {formatBytes(file.size)}
                  {pageCount != null && (
                    <>
                      {' · '}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {pageCount} página{pageCount === 1 ? '' : 's'}
                      </span>
                    </>
                  )}
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary shrink-0"
                disabled={busy}
                onClick={clearFile}
              >
                Trocar arquivo
              </button>
            </div>

            <div className="space-y-4 border-t border-slate-200 pt-5 dark:border-slate-700">
              <div className="flex items-start gap-2 rounded-xl border border-brand-200 bg-brand-50/80 px-3 py-2.5 text-sm text-brand-900 dark:border-brand-900/50 dark:bg-brand-950/40 dark:text-brand-100">
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden
                />
                <p>
                  A senha é usada só neste dispositivo para cifrar o PDF.
                  Nunca a compartilhamos e não a recuperamos se você esquecer.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor={passwordId}
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id={passwordId}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-3 pr-11 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                      placeholder="Mínimo 4 caracteres"
                      value={password}
                      disabled={busy}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        resetResult();
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

                <div className="space-y-1.5">
                  <label
                    htmlFor={confirmId}
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Confirmar senha
                  </label>
                  <input
                    id={confirmId}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    placeholder="Repita a senha"
                    value={confirmPassword}
                    disabled={busy}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      resetResult();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && canProtect) {
                        void handleProtect();
                      }
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                className="btn-primary w-full sm:w-auto sm:min-w-[240px]"
                disabled={!canProtect}
                onClick={() => void handleProtect()}
                aria-describedby={error ? errorId : undefined}
                aria-busy={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Criptografando…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" aria-hidden />
                    Criptografar e Baixar
                  </>
                )}
              </button>
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

        {success && (
          <SuccessAction message={success} toolName={TOOL_NAMES.PROTEGER_PDF} />
        )}

        <ProgressBar
          visible={isProcessing || progress === 100}
          percent={progress}
          message={progressMsg || 'Criptografando PDF…'}
        />

        <div className="lg:hidden">
          <AdSlot placement="below-cta" />
        </div>

        <section className="card text-sm text-slate-600 dark:text-slate-400">
          <h2 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
            Como funciona
          </h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Envie 1 PDF (sem senha prévia).</li>
            <li>Defina e confirme a senha de abertura.</li>
            <li>
              Clique em <em>Criptografar e Baixar</em> — a proteção é aplicada
              no navegador (fork pdf-lib com encriptação).
            </li>
            <li>
              Baixe o arquivo{' '}
              <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                nome-protegido-….pdf
              </code>
              .
            </li>
          </ol>
        </section>

        <ToolSeoContent content={protegerPdfSeoContent} />

        <FaqAccordion
          title="Perguntas frequentes sobre Proteger PDF"
          subtitle="Senha, privacidade e como abrir o arquivo protegido."
          items={protectFaqItems}
        />
      </div>

      <StickyCta />
    </>
  );
}
