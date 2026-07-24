export interface ProtectProgress {
  /** 0–100 */
  percent: number;
  message: string;
}

export type ProtectProgressCallback = (progress: ProtectProgress) => void;

const MIN_PASSWORD_LENGTH = 4;
const MAX_PASSWORD_LENGTH = 128;

/**
 * Valida a senha e a confirmação antes de criptografar.
 * Lança Error com mensagem amigável em português.
 */
export function validatePasswords(
  password: string,
  confirmPassword: string
): void {
  if (!password) {
    throw new Error('Digite uma senha para proteger o PDF.');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`
    );
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new Error(
      `A senha deve ter no máximo ${MAX_PASSWORD_LENGTH} caracteres.`
    );
  }
  if (password !== confirmPassword) {
    throw new Error('A senha e a confirmação não coincidem.');
  }
}

/**
 * Nome sugerido para o download do PDF protegido.
 */
export function protectedFileName(originalName: string): string {
  const stamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, '-');
  const base = originalName.replace(/\.pdf$/i, '') || 'documento';
  return `${base}-protegido-${stamp}.pdf`;
}

/**
 * Criptografa um PDF com senha de abertura (user + owner iguais).
 *
 * Nota técnica: a `pdf-lib` oficial (Hopding) **não** grava senha em `save()`.
 * Usamos o fork `pdf-lib-plus-encrypt`, que expõe:
 *   await pdfDoc.encrypt({ userPassword, ownerPassword })
 *   await pdfDoc.save()
 * Equivalente conceitual ao pedido `save({ userPassword, ownerPassword })`.
 * Lazy-load: não entope o bundle das outras rotas.
 */
export async function protectPdfWithPassword(
  file: File,
  password: string,
  confirmPassword: string,
  onProgress?: ProtectProgressCallback
): Promise<Uint8Array> {
  validatePasswords(password, confirmPassword);

  onProgress?.({ percent: 5, message: 'Carregando criptografia…' });

  const { PDFDocument } = await import('pdf-lib-plus-encrypt');

  onProgress?.({ percent: 12, message: `Lendo ${file.name}…` });

  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    throw new Error(`Não foi possível ler o arquivo "${file.name}".`);
  }

  onProgress?.({ percent: 30, message: 'Carregando documento…' });

  let pdfDoc: Awaited<ReturnType<typeof PDFDocument.load>>;
  try {
    pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: false });
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (/encrypt/i.test(msg)) {
      throw new Error(
        'Este PDF já está protegido por senha. Remova a proteção no leitor original antes de aplicar uma nova senha aqui.'
      );
    }
    throw new Error(
      `O arquivo "${file.name}" não é um PDF válido ou está protegido por senha.`
    );
  }

  if (pdfDoc.getPageCount() < 1) {
    throw new Error('O PDF não possui páginas.');
  }

  onProgress?.({ percent: 55, message: 'Aplicando criptografia…' });

  try {
    // userPassword + ownerPassword (mesma senha) — proteção de abertura
    await pdfDoc.encrypt({
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: true,
        documentAssembly: false,
      },
    });
  } catch {
    throw new Error(
      'Não foi possível criptografar o PDF. Tente outra senha ou um arquivo menor.'
    );
  }

  onProgress?.({ percent: 85, message: 'Gerando PDF protegido…' });

  let out: Uint8Array;
  try {
    out = await pdfDoc.save();
  } catch {
    throw new Error('Falha ao salvar o PDF criptografado.');
  }

  onProgress?.({ percent: 100, message: 'Concluído!' });
  return out;
}
