/**
 * Contato público do site — único ponto de verdade para e-mail de suporte.
 * Usado em /contato, /privacidade, /termos e páginas institucionais.
 *
 * Override opcional: VITE_CONTACT_EMAIL (sem vazar segredos de infra).
 */

const DEFAULT_CONTACT_EMAIL = 'easypdf19@gmail.com';

function resolveContactEmail(): string {
  const fromEnv = (
    import.meta.env.VITE_CONTACT_EMAIL as string | undefined
  )?.trim();
  if (fromEnv && fromEnv.includes('@') && !fromEnv.includes('XXXX')) {
    return fromEnv;
  }
  return DEFAULT_CONTACT_EMAIL;
}

/** E-mail público para feedback, bugs e privacidade */
export const CONTACT_EMAIL = resolveContactEmail();

/** Nome amigável do destinatário (exibição) */
export const CONTACT_LABEL = 'Easy PDF Local';

/**
 * Monta um link mailto com assunto opcional.
 */
export function contactMailto(subject?: string): string {
  const base = `mailto:${CONTACT_EMAIL}`;
  if (!subject?.trim()) return base;
  return `${base}?subject=${encodeURIComponent(subject.trim())}`;
}
