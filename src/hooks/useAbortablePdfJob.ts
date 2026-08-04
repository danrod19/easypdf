import { useCallback, useEffect, useRef } from 'react';
import { isAbort } from '../lib/runPdfWorker';

/**
 * Contrato de cancelamento de jobs PDF pesados (merge, OCR, compress, etc.):
 *
 * - `beginJob()` cancela o job anterior (se houver) e devolve um `AbortSignal` novo.
 * - Passe esse `signal` às libs/workers (`mergePdfFilesPreferWorker`, `compressPdf`, …).
 * - No `unmount` da rota, o controller atual é abortado (worker terminate / loops cooperativos).
 * - No `finally` do job, chame `endJob(signal)` para limpar o ref sem abortar um job mais novo.
 * - `isAbortError(err)` → cancelamento; **não** mostre como erro vermelho de negócio.
 *
 * Não altera a lógica de PDF — só padroniza lifecycle do AbortController.
 */
export function useAbortablePdfJob() {
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
      controllerRef.current = null;
    };
  }, []);

  /** Aborta o job em andamento (se houver). */
  const abort = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  /**
   * Inicia um job: cancela o anterior e retorna o signal do novo controller.
   */
  const beginJob = useCallback((): AbortSignal => {
    controllerRef.current?.abort();
    const ac = new AbortController();
    controllerRef.current = ac;
    return ac.signal;
  }, []);

  /**
   * Limpa o ref se ainda apontar para o signal deste job.
   * Seguro no `finally` mesmo se um job mais novo já tiver começado.
   */
  const endJob = useCallback((signal?: AbortSignal) => {
    const cur = controllerRef.current;
    if (!cur) return;
    if (!signal || cur.signal === signal) {
      controllerRef.current = null;
    }
  }, []);

  /** Signal do job atual, ou null se não há job. */
  const getSignal = useCallback(
    (): AbortSignal | null => controllerRef.current?.signal ?? null,
    []
  );

  return {
    beginJob,
    endJob,
    abort,
    getSignal,
    /** Alias estável de `isAbort` (DOMException | Error name AbortError). */
    isAbortError: isAbort,
  } as const;
}

export type AbortablePdfJob = ReturnType<typeof useAbortablePdfJob>;

/** Re-export para páginas que só precisam do type guard. */
export { isAbort as isAbortError };
