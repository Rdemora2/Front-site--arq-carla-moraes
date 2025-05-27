/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  readonly VITE_API_URL: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_PWA: string;
  readonly VITE_ENABLE_PERFORMANCE_MONITOR: string;
  readonly VITE_ENABLE_ANALYZER: string;
  readonly VITE_ENABLE_SOURCEMAP: string;
  readonly MODE: 'development' | 'production' | 'test';
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.ico' {
  const src: string;
  export default src;
}

// Styled Components
declare module 'styled-components' {
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
      '2xl': string;
    };
  }
}

// Global window extensions
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    webkitRequestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    mozRequestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    msRequestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  }

  interface Navigator {
    connection?: {
      effectiveType: '2g' | '3g' | '4g';
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
