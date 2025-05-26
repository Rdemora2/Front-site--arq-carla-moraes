import { useMemo } from "react";
import {
  config,
  getAbsoluteUrl,
  isProduction,
  isDevelopment,
} from "../config/environment";

/**
 * Hook para acessar configurações de ambiente
 * @returns {object} Configurações e funções utilitárias
 */
export const useEnvironment = () => {
  return useMemo(
    () => ({
      ...config,

      getAbsoluteUrl,
      isProduction,
      isDevelopment,

      shouldShowAnalyzer: config.enableAnalyzer && config.isDevelopment,
      shouldGenerateSourcemaps: config.enableSourcemap,

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

      log: (...args) => {
        if (config.isDevelopment) {
          console.log("[ENV]", ...args);
        }
      },

      isFeatureEnabled: (feature) => {
        switch (feature) {
          case "analyzer":
            return config.enableAnalyzer && config.isDevelopment;
          case "sourcemap":
            return config.enableSourcemap;
          case "analytics":
            return (
              config.isProduction &&
              (config.googleAnalyticsId || config.facebookPixelId)
            );
          default:
            return false;
        }
      },
    }),
    []
  );
};

export default useEnvironment;
