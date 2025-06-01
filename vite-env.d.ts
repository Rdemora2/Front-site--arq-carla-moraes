/// <reference types="vite/client" />

interface ImportMetaEnv {
  // ================================
  // INFORMAÇÕES BÁSICAS DO SITE
  // ================================
  readonly VITE_SITE_NAME: string;
  readonly VITE_SITE_DESCRIPTION: string;

  // ================================
  // URLs
  // ================================
  readonly VITE_PROD_URL: string;
  readonly VITE_STAGING_URL: string;
  readonly VITE_DEV_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_LOCAL_API_URL: string;

  // ================================
  // ANALYTICS E TRACKING (SENSÍVEIS)
  // ================================
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  readonly VITE_FACEBOOK_PIXEL_ID: string;

  // ================================
  // CHAVES DE API (SENSÍVEIS)
  // ================================
  readonly VITE_API_KEY: string;
  readonly VITE_MAPS_API_KEY: string;
  readonly VITE_CONTACT_FORM_ENDPOINT: string;
  readonly VITE_EMAIL_SERVICE_KEY: string;
  readonly VITE_WEBHOOK_URL: string;

  // ================================
  // FEATURE FLAGS - ANALYTICS
  // ================================
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_PERFORMANCE_MONITOR: string;
  readonly VITE_ENABLE_WEB_VITALS: string;
  readonly VITE_ENABLE_LIGHTHOUSE_MONITOR: string;
  readonly VITE_ENABLE_MEMORY_MONITORING: string;

  // ================================
  // FEATURE FLAGS - DESENVOLVIMENTO
  // ================================
  readonly VITE_ENABLE_ANALYZER: string;
  readonly VITE_ENABLE_SOURCEMAP: string;
  readonly VITE_ENABLE_HOT_RELOAD: string;
  readonly VITE_ENABLE_CONSOLE_LOGS: string;
  readonly VITE_ENABLE_DEBUG_MODE: string;
  readonly VITE_ENABLE_VERBOSE_LOGGING: string;

  // ================================
  // FEATURE FLAGS - APLICAÇÃO
  // ================================
  readonly VITE_ENABLE_MOCK_API: string;
  readonly VITE_ENABLE_SERVICE_WORKER: string;
  readonly VITE_ENABLE_PWA: string;
  readonly VITE_ENABLE_OFFLINE_MODE: string;

  // ================================
  // FEATURE FLAGS - MONITORAMENTO
  // ================================
  readonly VITE_ENABLE_ERROR_BOUNDARY: string;
  readonly VITE_ENABLE_PERFORMANCE_TRACKING: string;

  // ================================
  // FEATURE FLAGS - CACHE
  // ================================
  readonly VITE_ENABLE_CACHE: string;
  readonly VITE_CACHE_DURATION: string;

  // ================================
  // FEATURE FLAGS - UI/UX
  // ================================
  readonly VITE_ENABLE_TRANSITIONS: string;
  readonly VITE_ENABLE_ANIMATIONS: string;
  readonly VITE_ENABLE_LOADING_STATES: string;
  readonly VITE_ENABLE_SKELETON_LOADING: string;

  // ================================
  // FEATURE FLAGS - TESTE
  // ================================
  readonly VITE_ENABLE_TEST_IDS: string;
  readonly VITE_ENABLE_ACCESSIBILITY_CHECKS: string;
  readonly VITE_ENABLE_PERFORMANCE_TESTS: string;

  // ================================
  // FEATURE FLAGS - SEGURANÇA
  // ================================
  readonly VITE_ENABLE_SECURITY_HEADERS: string;
  readonly VITE_ENABLE_CORS_VALIDATION: string;
  readonly VITE_ENABLE_CSP: string;

  // ================================
  // CONFIGURAÇÕES DE STORAGE
  // ================================
  readonly VITE_LOCAL_STORAGE_PREFIX: string;

  // ================================
  // FEATURE FLAGS - BUILD
  // ================================
  readonly VITE_BUILD_OPTIMIZATION: string;
  readonly VITE_ENABLE_TREE_SHAKING: string;
  readonly VITE_ENABLE_CODE_SPLITTING: string;

  // ================================
  // FEATURE FLAGS - SEO
  // ================================
  readonly VITE_ENABLE_META_TAGS: string;
  readonly VITE_ENABLE_STRUCTURED_DATA: string;
  readonly VITE_ENABLE_SITEMAP: string;
  readonly VITE_ENABLE_ROBOTS_TXT: string;

  // ================================
  // FEATURE FLAGS - COMPRESSÃO
  // ================================
  readonly VITE_ENABLE_COMPRESSION: string;
  readonly VITE_ENABLE_GZIP: string;
  readonly VITE_ENABLE_BROTLI: string;

  // ================================
  // FEATURE FLAGS - DESENVOLVIMENTO LOCAL
  // ================================
  readonly VITE_ENABLE_FAST_REFRESH: string;
  readonly VITE_ENABLE_ERROR_OVERLAY: string;
  readonly VITE_ENABLE_MOCK_DATA: string;
  readonly VITE_ENABLE_DEV_TOOLS: string;

  // ================================
  // CONFIGURAÇÕES DE REDE
  // ================================
  readonly VITE_DEV_PORT: string;
  readonly VITE_DEV_HOST: string;
  readonly VITE_ENABLE_NETWORK_ACCESS: string;

  // ================================
  // CONFIGURAÇÕES DE PROXY
  // ================================
  readonly VITE_ENABLE_PROXY: string;
  readonly VITE_PROXY_TARGET: string;

  // ================================
  // CONFIGURAÇÕES DE PREVIEW
  // ================================
  readonly VITE_ENABLE_PREVIEW_MODE: string;
  readonly VITE_ENABLE_DRAFT_CONTENT: string;
  readonly VITE_ENABLE_EXPERIMENTAL_FEATURES: string;

  // ================================
  // CONFIGURAÇÕES PADRÃO DO VITE
  // ================================
  readonly MODE: "development" | "production" | "staging" | "localhost";
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;

  // ================================
  // CHAVES DE SEGURANÇA (SENSÍVEIS)
  // ================================
  readonly VITE_ENCRYPTION_KEY: string;
  readonly VITE_JWT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.svg" {
  import * as React from "react";
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.ico" {
  const src: string;
  export default src;
}

// Styled Components
declare module "styled-components" {
  export interface DefaultTheme {
    primaryColor: string;
    primaryColorDark: string;
    primaryColorLight: string;
    secondaryColor: string;
    textColor: string;
    textColorLight: string;
    backgroundColor: string;
    borderColor: string;
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      "2xl": string;
    };
  }
}

// Global window extensions
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    webkitRequestIdleCallback?: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions
    ) => number;
    mozRequestIdleCallback?: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions
    ) => number;
    msRequestIdleCallback?: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions
    ) => number;
  }

  interface Navigator {
    connection?: {
      effectiveType: "2g" | "3g" | "4g";
      downlink: number;
      rtt: number;
      saveData: boolean;
    };
    deviceMemory?: number;
    hardwareConcurrency?: number;
  }

  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}

export {};
