export interface AffiliateLink {
  id: string;
  title: string;
  description: string;
  url: string;
  badge: string;
  ctaText: string;
  platform: 'amazon' | 'ml';
}

export const affiliateLinks: AffiliateLink[] = [
  {
    id: 'kindle-unlimited',
    title: 'Milhões de e-books com Kindle Unlimited',
    description:
      'Acesse uma biblioteca infinita de apostilas, guias e livros. 30 dias de teste gratuito.',
    url: 'https://link.amazon/A0dMy6VNK',
    badge: 'Recompensa Amazon',
    ctaText: 'Testar Grátis',
    platform: 'amazon',
  },
  {
    id: 'amazon-prime',
    title: 'Amazon Prime: Frete Grátis e Filmes',
    description:
      'Teste 30 dias grátis e tenha acesso a frete expresso, Prime Video, Músicas e Leitura.',
    url: 'https://link.amazon/B0gKcBu8i',
    badge: 'Recompensa Amazon',
    ctaText: 'Assinar Prime',
    platform: 'amazon',
  },
  {
    id: 'amazon-music',
    title: 'Foco Absoluto: Amazon Music Unlimited',
    description:
      'Músicas sem anúncios e em HD para máxima concentração no trabalho ou estudos. Teste grátis.',
    url: 'https://link.amazon/A04ysmY9U',
    badge: 'Recompensa Amazon',
    ctaText: 'Ouvir Agora',
    platform: 'amazon',
  },
  {
    id: 'mouse-vertical',
    title: 'Mouse Vertical Ergonômico Sem Fio',
    description:
      'Evite dores no punho trabalhando no computador. Bateria recarregável e clique silencioso.',
    url: 'https://meli.la/1knuc4a',
    badge: 'Saúde no Home Office',
    ctaText: 'Ver Oferta no ML',
    platform: 'ml',
  },
  {
    id: 'pc-completo',
    title: 'PC Computador Completo Intel Core i5',
    description:
      'Máquina robusta para trabalho e estudos (16GB RAM, SSD 480GB + Monitor 19").',
    url: 'https://meli.la/32q3sxb',
    badge: 'Setup Profissional',
    ctaText: 'Ver Oferta no ML',
    platform: 'ml',
  },
  {
    id: 'mouse-rgb',
    title: 'Mouse Sem Fio Bluetooth RGB',
    description:
      'Design moderno, recarregável e botões silenciosos. Excelente custo-benefício.',
    url: 'https://link.amazon/B0gMSy0SE',
    badge: 'Acessório',
    ctaText: 'Ver na Amazon',
    platform: 'amazon',
  },
  {
    id: 'meias-puma',
    title: 'Kit 9 Pares Meias Puma Originais',
    description:
      'Conforto diário com durabilidade. Pacote com excelente custo-benefício na loja oficial.',
    url: 'https://meli.la/2a9prM3',
    badge: 'Mais Vendidos',
    ctaText: 'Ver Oferta no ML',
    platform: 'ml',
  },
  {
    id: 'lista-bebe',
    title: 'Lista do Bebê Amazon',
    description:
      'Crie sua lista de enxoval na Amazon, compartilhe com a família e ganhe benefícios exclusivos.',
    url: 'https://link.amazon/B0bUc4sfU',
    badge: 'Maternidade',
    ctaText: 'Criar Lista',
    platform: 'amazon',
  },
];
