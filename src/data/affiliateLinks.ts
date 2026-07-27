export interface AffiliateLink {
  id: string;
  title: string;
  description: string;
  url: string;
  badge: string;
  ctaText: string;
  platform: 'amazon' | 'ml';
  imageUrl: string;
  price?: string;
  originalPrice?: string;
}

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
    imageUrl:
      'https://editorialge.com/wp-content/uploads/2023/04/Amazon-kindle-unlimited-1024x532.jpeg',
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
    imageUrl:
      'https://tse3.mm.bing.net/th/id/OIP.SRI5lFYPZasfwH490xc9XQHaEM?r=0&pid=Api&P=0&h=180',
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
    imageUrl:
      'https://tse4.mm.bing.net/th/id/OIP.hXi4HjpQ20NbOYV2i60xJwHaE7?r=0&pid=Api&P=0&h=180',
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
    imageUrl:
      'https://http2.mlstatic.com/D_NQ_NP_2X_760268-MLA112165982538_062026-F.webp',
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
    imageUrl:
      'https://http2.mlstatic.com/D_NQ_NP_2X_777241-MLB94692583816_102025-F-pc-computador-completo-intel-i5-16gb-ssd-480gb-monitor-19.webp',
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
    imageUrl: 'https://m.media-amazon.com/images/I/71-EbJpLi8L._AC_SL1500_.jpg',
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
    imageUrl:
      'https://http2.mlstatic.com/D_NQ_NP_2X_746099-MLB80308965401_102024-F-kit-9-pares-meias-puma-soquete-cano-curto-sapatilha-original.webp',
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
    imageUrl:
      'https://mamaepechincha.com.br/wp-content/uploads/2022/08/voce-sabia-que-e-possivel-criar-uma-lista-de-produtos-essenciais-para-a-chegada-do-seu-bebe-na-amazon.webp',
    price: 'Grátis',
  },
];
