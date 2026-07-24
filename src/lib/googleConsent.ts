/**
 * Google Consent Mode v2 — helpers para SPA + CMP do AdSense (Funding Choices).
 * Defaults "denied" devem ser definidos o mais cedo possível (ver index.html).
 */

export type ConsentValue = 'granted' | 'denied';

export type ConsentState = {
  analytics_storage: ConsentValue;
  ad_storage: ConsentValue;
  ad_user_data: ConsentValue;
  ad_personalization: ConsentValue;
};

export const CONSENT_DEFAULT_DENIED: ConsentState = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    googlefc?: {
      callbackQueue?: Array<Record<string, () => void> | (() => void)>;
      [key: string]: unknown;
    };
    __tcfapi?: (
      command: string,
      version: number,
      callback: (tcData: TcfData | null, success: boolean) => void,
      parameter?: unknown
    ) => void;
  }
}

/** Subconjunto TCF v2 usado para decidir analytics. */
type TcfData = {
  eventStatus?: string;
  gdprApplies?: boolean;
  purpose?: { consents?: Record<string | number, boolean | undefined> };
  vendor?: { consents?: Record<string | number, boolean | undefined> };
};

function ensureDataLayerAndGtag(): void {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag(...args: unknown[]) {
      // Mesmo formato do snippet oficial (Arguments-like)
      window.dataLayer.push(args);
    };
  }
}

/**
 * Garante defaults denied (idempotente se o snippet do index.html já rodou).
 * Inclui wait_for_update para a CMP do Google atualizar a tempo.
 */
export function ensureConsentDefaultsDenied(): void {
  ensureDataLayerAndGtag();
  window.gtag('consent', 'default', {
    ...CONSENT_DEFAULT_DENIED,
    // tempo (ms) para a CMP atualizar antes de tags “avançadas” enviarem pings
    wait_for_update: 500,
  });
}

/** Atualiza Consent Mode (ex.: após aceite confirmado). */
export function updateConsent(partial: Partial<ConsentState>): void {
  ensureDataLayerAndGtag();
  window.gtag('consent', 'update', partial);
}

export function isAnalyticsGranted(state: Partial<ConsentState> | null | undefined): boolean {
  return state?.analytics_storage === 'granted';
}

/**
 * Lê o estado atual de analytics_storage via gtag (se já houver tag carregada).
 * Callback assíncrono; se indisponível, chama com null.
 */
export function queryAnalyticsStorage(
  measurementId: string,
  cb: (value: ConsentValue | null) => void
): void {
  ensureDataLayerAndGtag();
  try {
    // gtag get só funciona depois que o config/ID existe
    window.gtag('get', measurementId, 'analytics_storage', (value: unknown) => {
      if (value === 'granted' || value === 'denied') {
        cb(value);
      } else {
        cb(null);
      }
    });
  } catch {
    cb(null);
  }
}

type ConsentChangeListener = (granted: boolean, source: string) => void;

/**
 * Observa a CMP do Google (TCF + Funding Choices + dataLayer) e notifica
 * quando analytics_storage passa a granted/denied.
 *
 * @returns função de cleanup
 */
export function subscribeGoogleCmpAnalyticsConsent(
  onChange: ConsentChangeListener
): () => void {
  ensureDataLayerAndGtag();

  let lastGranted: boolean | null = null;
  const emit = (granted: boolean, source: string) => {
    if (lastGranted === granted) return;
    lastGranted = granted;
    onChange(granted, source);
  };

  // —— 1) Intercepta dataLayer (CMP do Google empurra consent update via gtag) ——
  const dl = window.dataLayer;
  const originalPush = dl.push.bind(dl);

  const inspectPushArgs = (args: unknown) => {
    const update = extractConsentUpdate(args);
    if (!update) return;
    if (update.analytics_storage === 'granted') {
      emit(true, 'dataLayer:consent:update');
    } else if (update.analytics_storage === 'denied') {
      emit(false, 'dataLayer:consent:update');
    }
  };

  dl.push = function consentAwarePush(...args: unknown[]) {
    // gtag() costuma fazer dataLayer.push(arguments) — 1 arg tipo Arguments
    if (args.length === 1) {
      inspectPushArgs(args[0]);
    } else {
      inspectPushArgs(args);
    }
    return originalPush(...(args as Parameters<typeof originalPush>));
  };

  // Varre entradas já existentes no dataLayer (race com CMP)
  try {
    for (const entry of dl) {
      inspectPushArgs(entry);
    }
  } catch {
    // ignore
  }

  // —— 2) TCF v2 (__tcfapi) — padrão da CMP Google / Funding Choices na EEA ——
  const tcfListener = (tcData: TcfData | null, success: boolean) => {
    if (!success || !tcData) return;

    const status = tcData.eventStatus;
    if (
      status !== 'tcloaded' &&
      status !== 'useractioncomplete' &&
      status !== 'cmpuishown'
    ) {
      return;
    }

    // Fora do GDPR: muitos CMPs liberam analytics
    if (tcData.gdprApplies === false) {
      emit(true, 'tcf:gdpr-not-applies');
      return;
    }

    // Purpose 1 = Store and/or access information on a device (base para cookies)
    // Sem purpose 1, analytics_storage não deve ser granted.
    const purpose1 = tcData.purpose?.consents?.[1] === true;
    if (status === 'cmpuishown' && !purpose1) {
      // UI aberta sem aceite ainda
      emit(false, 'tcf:cmpuishown');
      return;
    }
    emit(purpose1, 'tcf');
  };

  let tcfAttached = false;
  const tryAttachTcf = () => {
    if (tcfAttached || typeof window.__tcfapi !== 'function') return false;
    window.__tcfapi('addEventListener', 2, tcfListener);
    tcfAttached = true;
    return true;
  };
  tryAttachTcf();

  // —— 3) Google Funding Choices (googlefc) ——
  window.googlefc = window.googlefc || {};
  window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
  const fcPayload = {
    CONSENT_DATA_READY: () => {
      // Quando o FC está pronto, o Consent Mode costuma já ter sido atualizado
      // pelo próprio Google; reavaliamos via dataLayer + TCF
      tryAttachTcf();
      if (typeof window.__tcfapi === 'function') {
        window.__tcfapi('getTCData', 2, tcfListener);
      }
    },
  };
  window.googlefc.callbackQueue.push(fcPayload);

  // —— 4) Poll leve: TCF pode carregar depois do React ——
  const pollId = window.setInterval(() => {
    tryAttachTcf();
  }, 500);

  // Para o poll após 15s (CMP já deveria ter carregado)
  const stopPollId = window.setTimeout(() => {
    window.clearInterval(pollId);
  }, 15_000);

  // —— 5) Evento custom opcional (documentação / testes manuais) ——
  const onCustom = (ev: Event) => {
    const detail = (ev as CustomEvent<{ analytics_storage?: ConsentValue }>)
      .detail;
    if (detail?.analytics_storage === 'granted') {
      emit(true, 'custom:easypdf-consent');
    } else if (detail?.analytics_storage === 'denied') {
      emit(false, 'custom:easypdf-consent');
    }
  };
  window.addEventListener('easypdf-consent', onCustom);

  return () => {
    window.clearInterval(pollId);
    window.clearTimeout(stopPollId);
    dl.push = originalPush;
    window.removeEventListener('easypdf-consent', onCustom);
    if (tcfAttached && typeof window.__tcfapi === 'function') {
      try {
        window.__tcfapi('removeEventListener', 2, tcfListener);
      } catch {
        // algumas CMPs não implementam remove
      }
    }
  };
}

/** Extrai objeto de `gtag('consent', 'update', { ... })` de um push do dataLayer. */
function extractConsentUpdate(
  args: unknown
): Partial<ConsentState> | null {
  if (args == null) return null;

  // Array-like (Arguments ou array)
  const list = toArrayLike(args);
  if (!list || list.length < 3) return null;
  if (list[0] !== 'consent') return null;
  if (list[1] !== 'update' && list[1] !== 'default') return null;

  const payload = list[2];
  if (!payload || typeof payload !== 'object') return null;

  return payload as Partial<ConsentState>;
}

function toArrayLike(value: unknown): unknown[] | null {
  if (Array.isArray(value)) return value;
  if (typeof value === 'object' && value !== null && 'length' in value) {
    try {
      return Array.from(value as ArrayLike<unknown>);
    } catch {
      return null;
    }
  }
  return null;
}
