/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** Google Analytics 4 Measurement ID (ex.: G-ABC123XYZ) */
  readonly VITE_GA_MEASUREMENT_ID?: string;
  /** Google AdSense Publisher ID (ca-pub-…) */
  readonly VITE_ADSENSE_CLIENT?: string;
  /** data-ad-slot — banner topo */
  readonly VITE_ADSENSE_SLOT_TOP?: string;
  /** data-ad-slot — banner rodapé */
  readonly VITE_ADSENSE_SLOT_BOTTOM?: string;
  /** data-ad-slot — abaixo do CTA (mobile) */
  readonly VITE_ADSENSE_SLOT_BELOW_CTA?: string;
  /** data-ad-slot — sidebar esquerda */
  readonly VITE_ADSENSE_SLOT_SIDEBAR_LEFT?: string;
  /** data-ad-slot — sidebar direita */
  readonly VITE_ADSENSE_SLOT_SIDEBAR_RIGHT?: string;
  /** data-ad-slot — inline genérico */
  readonly VITE_ADSENSE_SLOT_INLINE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Markdown importado como string (Vite ?raw) */
declare module '*.md?raw' {
  const content: string;
  export default content;
}

declare module '*.md' {
  const content: string;
  export default content;
}

