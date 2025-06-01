export const config = {
  siteName: import.meta.env.VITE_SITE_NAME,
  siteDescription: import.meta.env.VITE_SITE_DESCRIPTION,

  // ================================
  // CONFIGURAÇÕES DE AMBIENTE
  // ================================
  isProduction: import.meta.env.MODE === "production",
  isDevelopment: import.meta.env.MODE === "development",
  isStaging: import.meta.env.MODE === "staging",
  isLocalhost: import.meta.env.MODE === "localhost",
  currentMode: import.meta.env.MODE,

  // ================================
  // URLs DINÂMICAS POR AMBIENTE
  // ================================
  baseUrl: (() => {
    switch (import.meta.env.MODE) {
      case "production":
        return import.meta.env.VITE_PROD_URL;
      case "staging":
        return import.meta.env.VITE_STAGING_URL;
      case "localhost":
        return "http://localhost:5173";
      default:
        return import.meta.env.VITE_DEV_URL || "http://localhost:5173";
    }
  })(),

  // ================================
  // ANALYTICS E TRACKING
  // ================================
  googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  facebookPixelId: import.meta.env.VITE_FACEBOOK_PIXEL_ID,

  // ================================
  // FEATURE FLAGS
  // ================================
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  enablePerformanceTracking:
    import.meta.env.VITE_ENABLE_PERFORMANCE_TRACKING === "true",
  enableWebVitals: import.meta.env.VITE_ENABLE_WEB_VITALS === "true",
  enableLighthouseMonitor:
    import.meta.env.VITE_ENABLE_LIGHTHOUSE_MONITOR === "true",
  enableMemoryMonitoring:
    import.meta.env.VITE_ENABLE_MEMORY_MONITORING === "true",
  enableConsoleLogs: import.meta.env.VITE_ENABLE_CONSOLE_LOGS === "true",
  enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === "true",

  // ================================
  // CONFIGURAÇÕES LOCAIS
  // ================================
  localStoragePrefix: import.meta.env.VITE_LOCAL_STORAGE_PREFIX || "app_",

  // ================================
  // VALIDAÇÕES DE SEGURANÇA
  // ================================
  hasValidGoogleAnalytics() {
    const id = this.googleAnalyticsId;
    return Boolean(id && id.trim() !== "" && id.startsWith("G-"));
  },

  hasValidFacebookPixel() {
    const id = this.facebookPixelId;
    return Boolean(id && id.trim() !== "" && /^\d+$/.test(id));
  },

  shouldEnableAnalytics() {
    return (
      this.enableAnalytics &&
      this.isProduction &&
      this.hasValidGoogleAnalytics()
    );
  },

  shouldEnablePerformanceMonitoring() {
    return this.enablePerformanceTracking || this.isDevelopment;
  },

  // ================================
  // CONFIGURAÇÕES DE DEBUG
  // ================================
  logLevel: (() => {
    if (import.meta.env.MODE === "production") return "error";
    if (import.meta.env.MODE === "staging") return "warn";
    return "debug";
  })(),

  // ================================
  // CONFIGURAÇÕES DE DESENVOLVIMENTO
  // ================================
  get isDev() {
    return this.isDevelopment;
  },

  get isProd() {
    return this.isProduction;
  },
};

// ================================
// VALIDAÇÃO DE AMBIENTE
// ================================
export const validateEnvironment = () => {
  const errors = [];

  if (!config.siteName) {
    errors.push("VITE_SITE_NAME é obrigatório");
  }

  if (!config.siteDescription) {
    errors.push("VITE_SITE_DESCRIPTION é obrigatório");
  }

  if (!config.baseUrl) {
    errors.push("URL base não configurada para o ambiente atual");
  }

  if (
    config.isProduction &&
    config.enableAnalytics &&
    !config.hasValidGoogleAnalytics()
  ) {
    console.warn(
      "Analytics habilitado em produção mas Google Analytics ID não é válido"
    );
  }

  if (errors.length > 0) {
    console.error("Erros de configuração de ambiente:", errors);
    return {
      isValid: false,
      errors: errors,
    };
  }

  return {
    isValid: true,
    errors: [],
  };
};

// ================================
// UTILITÁRIOS
// ================================
export const getAbsoluteUrl = (path = "") => {
  const baseUrl = config.baseUrl;
  if (!baseUrl) return path;

  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${cleanBaseUrl}${cleanPath}`;
};

export const isProduction = () => config.isProduction;

export const isDevelopment = () => config.isDevelopment;

export const isAnalyticsConfigured = () => {
  return config.hasValidGoogleAnalytics() || config.hasValidFacebookPixel();
};

export const logEnvironmentStatus = () => {
  if (
    config.enableConsoleLogs &&
    config.isDevelopment &&
    !window.__ENV_LOGGED__
  ) {
    window.__ENV_LOGGED__ = true;
  }
};

export const getEnvironmentInfo = () => ({
  mode: config.currentMode,
  baseUrl: config.baseUrl,
  analytics: config.shouldEnableAnalytics(),
  performance: config.shouldEnablePerformanceMonitoring(),
  debug: config.enableDebugMode,
  logLevel: config.logLevel,
});

// Validação automática em desenvolvimento - executar apenas uma vez
if (config.isDevelopment && !window.__ENV_VALIDATED__) {
  try {
    validateEnvironment();
    console.log("✅ Configuração de ambiente validada:", getEnvironmentInfo());
    window.__ENV_VALIDATED__ = true;
  } catch (error) {
    console.error("❌ Erro na configuração de ambiente:", error.message);
  }
}
