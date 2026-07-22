/**
 * Configuração central de monetização.
 */
export const donationConfig = {
  /** Chave PIX (e-mail, telefone, CPF/CNPJ ou aleatória) */
  pixKey: 'easypdf19@gmail.com',
  /** Nome exibido ao copiar / transferir */
  pixRecipient: 'Easy PDF',
  /** Link Buy Me a Coffee / Ko-fi / similar (opcional) */
  coffeeUrl: 'https://buymeacoffee.com/easypdf19',
} as const;

export const affiliateConfig = {
  mercadoLivre: {
    name: 'Mercado Livre',
    href: 'https://meli.la/1GK6w1X',
    message:
      'Ajude a página realizando suas compras do Mercado Livre pelo nosso link',
    rel: 'noopener noreferrer sponsored',
  },
} as const;
