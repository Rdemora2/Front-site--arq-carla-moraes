import { useMemo, useEffect } from "react";
import {
  config,
  getAbsoluteUrl,
  isProduction,
  isDevelopment,
  validateEnvironment,
  isAnalyticsConfigured,
  logEnvironmentStatus,
} from "../config/environment";

export const useEnvironment = () => {
  useEffect(() => {
    if (config.isDevelopment && !window.__ENV_HOOK_INITIALIZED__) {
      const validation = validateEnvironment();
      if (!validation.isValid) {
        console.warn(
          "⚠️ Problemas de configuração encontrados:",
          validation.errors?.join(", ") || "Erros não especificados"
        );
      }
      logEnvironmentStatus();
      window.__ENV_HOOK_INITIALIZED__ = true;
    }
  }, []);

  return useMemo(
    () => ({
      ...config,

      getAbsoluteUrl,
      isProduction,
      isDevelopment,
      validateEnvironment,
      isAnalyticsConfigured,
      hasValidAnalytics: isAnalyticsConfigured(),
      shouldLoadAnalytics:
        config.enableAnalytics &&
        isAnalyticsConfigured() &&
        config.isProduction,
      shouldShowAnalyzer: config.enableAnalyzer && config.isDevelopment,
      shouldGenerateSourcemaps: config.enableSourcemap,
      shouldEnableAnalytics: config.enableAnalytics && config.isProduction,
      shouldShowPerformanceMonitor: config.enablePerformanceMonitor,
      shouldUseServiceWorker: config.enableServiceWorker,
      shouldEnableCache: config.enableCache,
      log: (...args) => {
        if (config.enableConsoleLogs) {
          console.log("[ENV]", ...args);
        }
      },

      debug: (...args) => {
        if (config.enableDebugMode) {
          console.debug("[ENV:DEBUG]", ...args);
        }
      },

      warn: (...args) => {
        if (config.enableVerboseLogging) {
          console.warn("[ENV:WARN]", ...args);
        }
      },

      error: (...args) => {
        console.error("[ENV:ERROR]", ...args);
      },
      getShareUrls: (path = "", title = "", description = "") => ({
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          getAbsoluteUrl(path)
        )}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          getAbsoluteUrl(path)
        )}&text=${encodeURIComponent(title)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          getAbsoluteUrl(path)
        )}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(
          `${title} - ${getAbsoluteUrl(path)}`
        )}`,
      }),

      isFeatureEnabled: (feature) => {
        const featureMap = {
          analytics: config.enableAnalytics,
          performanceMonitor: config.enablePerformanceMonitor,
          webVitals: config.enableWebVitals,
          lighthouseMonitor: config.enableLighthouseMonitor,
          memoryMonitoring: config.enableMemoryMonitoring,

          analyzer: config.enableAnalyzer,
          sourcemap: config.enableSourcemap,
          hotReload: config.enableHotReload,
          consoleLogs: config.enableConsoleLogs,
          debugMode: config.enableDebugMode,
          verboseLogging: config.enableVerboseLogging,

          mockApi: config.enableMockApi,
          serviceWorker: config.enableServiceWorker,
          pwa: config.enablePwa,
          offlineMode: config.enableOfflineMode,

          errorBoundary: config.enableErrorBoundary,
          performanceTracking: config.enablePerformanceTracking,

          cache: config.enableCache,

          transitions: config.enableTransitions,
          animations: config.enableAnimations,
          loadingStates: config.enableLoadingStates,
          skeletonLoading: config.enableSkeletonLoading,

          testIds: config.enableTestIds,
          accessibilityChecks: config.enableAccessibilityChecks,
          performanceTests: config.enablePerformanceTests,

          securityHeaders: config.enableSecurityHeaders,
          corsValidation: config.enableCorsValidation,
          csp: config.enableCsp,

          buildOptimization: config.buildOptimization,
          treeShaking: config.enableTreeShaking,
          codeSplitting: config.enableCodeSplitting,

          metaTags: config.enableMetaTags,
          structuredData: config.enableStructuredData,
          sitemap: config.enableSitemap,
          robotsTxt: config.enableRobotsTxt,

          compression: config.enableCompression,
          gzip: config.enableGzip,
          brotli: config.enableBrotli,
        };

        return featureMap[feature] ?? false;
      },
      getStorageKey: (key) => `${config.localStoragePrefix}${key}`,
      getCacheDuration: () => config.cacheDuration,
      getApiUrl: (endpoint = "") => {
        const baseApi =
          config.enableMockApi && config.isDevelopment
            ? config.localApiUrl
            : config.apiUrl;

        return endpoint ? `${baseApi}/${endpoint.replace(/^\//, "")}` : baseApi;
      },
      getEnvironmentInfo: () => ({
        mode: config.currentMode,
        isProduction: config.isProduction,
        isDevelopment: config.isDevelopment,
        isStaging: config.isStaging,
        enabledFeatures: Object.keys({
          analytics: config.enableAnalytics,
          performanceMonitor: config.enablePerformanceMonitor,
          analyzer: config.enableAnalyzer,
          sourcemap: config.enableSourcemap,
          cache: config.enableCache,
          pwa: config.enablePwa,
          serviceWorker: config.enableServiceWorker,
        }).filter(
          (key) => config[`enable${key.charAt(0).toUpperCase() + key.slice(1)}`]
        ),
      }),
    }),
    []
  );
};

export default useEnvironment;
