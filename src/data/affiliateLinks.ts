export interface AffiliateLink {
  id: string;
  title: string;
  description: string;
  url: string;
  badge: string;
  ctaText: string;
  platform: 'amazon' | 'ml';
  /** Path local em /public/affiliates (self-hosted, WebP) */
  imageUrl: string;
  price?: string;
  originalPrice?: string;
}

/**
 * Catálogo de afiliados.
 * Imagens self-hosted em public/affiliates/*.webp — sem hotlink.
 * URLs de oferta (url) permanecem nos programas de afiliado.
 */
export const affiliateLinks: AffiliateLink[] = [
  {
    id: 'kindle-unlimited',
    title: 'Milhões de e-books com Kindle Unlimited',
    description:
      'Acesse uma biblioteca infinita de apostilas, guias e livros. Teste grátis liberado.',
    url: 'https://link.amazon/A0dMy6VNK',
    badge: 'Recompensa Amazon',
    ctaText: 'Testar Grátis',
    platform: 'amazon',
    imageUrl: '/affiliates/kindle-unlimited.webp',
    price: '30 Dias Grátis',
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
    imageUrl: '/affiliates/amazon-prime.webp',
    price: '30 Dias Grátis',
  },
  {
    id: 'amazon-music',
    title: 'Foco Absoluto: Amazon Music Unlimited',
    description:
      'Músicas sem anúncios e em HD para máxima concentração no trabalho ou estudos.',
    url: 'https://link.amazon/A04ysmY9U',
    badge: 'Recompensa Amazon',
    ctaText: 'Ouvir Agora',
    platform: 'amazon',
    imageUrl: '/affiliates/amazon-music.webp',
    price: '30 Dias Grátis',
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
    imageUrl: '/affiliates/mouse-vertical.webp',
    price: 'R$ 42,78',
    originalPrice: 'R$ 78,90',
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
    imageUrl: '/affiliates/pc-completo.webp',
    price: 'R$ 1.458,59',
    originalPrice: 'R$ 2.095,00',
  },
  {
    id: 'mouse-rgb',
    title: 'Mouse Sem Fio Bluetooth 2.4GHz RGB',
    description:
      'Design moderno, recarregável e botões silenciosos. Excelente custo-benefício.',
    url: 'https://link.amazon/B0gMSy0SE',
    badge: 'Acessório',
    ctaText: 'Ver na Amazon',
    platform: 'amazon',
    imageUrl: '/affiliates/mouse-rgb.webp',
    price: 'R$ 21,56',
    originalPrice: 'R$ 23,90',
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
    imageUrl: '/affiliates/meias-puma.webp',
    price: 'R$ 63,26',
    originalPrice: 'R$ 124,00',
  },
  {
    id: 'lista-bebe',
    title: 'Lista do Bebê Amazon',
    description:
      'Crie sua lista de enxoval na Amazon, compartilhe com a família e ganhe benefícios.',
    url: 'https://link.amazon/B0bUc4sfU',
    badge: 'Maternidade',
    ctaText: 'Criar Lista',
    platform: 'amazon',
    imageUrl: '/affiliates/lista-bebe.webp',
    price: 'Grátis',
  },
];
