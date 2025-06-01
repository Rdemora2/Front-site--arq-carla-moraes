import { useEffect, useCallback } from "react";
import { useEnvironment } from "../../hooks/useEnvironment";
import usePerformanceMonitoring from "@/hooks/usePerformanceMonitoring";

/**
 * Componente Analytics melhorado com:
 * - Carregamento otimizado
 * - Tratamento de erros
 * - Suporte a múltiplos provedores
 * - Integração com métricas do Lighthouse
 * - Configuração condicional
 */
const Analytics = () => {
  const {
    googleAnalyticsId,
    facebookPixelId,
    isProduction,
    log,
    isFeatureEnabled,
    hasValidAnalytics,
    shouldLoadAnalytics,
    hasValidGoogleAnalytics,
    hasValidFacebookPixel,
  } = useEnvironment();

  const isAnalyticsEnabled = isFeatureEnabled("analytics");
  const isPerformanceTrackingEnabled = isFeatureEnabled("performanceTracking");

  const shouldInitializeAnalytics = shouldLoadAnalytics && hasValidAnalytics;

  const loadGoogleAnalytics = useCallback(() => {
    if (!googleAnalyticsId || !hasValidGoogleAnalytics()) {
      log("Google Analytics não configurado ou inválido");
      return;
    }

    try {
      log("Carregando Google Analytics:", googleAnalyticsId);

      const preconnect = document.createElement("link");
      preconnect.rel = "preconnect";
      preconnect.href = "https://www.googletagmanager.com";
      document.head.appendChild(preconnect);

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
      script.onerror = () => {
        console.error("Erro ao carregar Google Analytics");
      };
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }

      gtag("js", new Date());
      gtag("config", googleAnalyticsId, {
        anonymize_ip: true,
        cookie_flags: "max-age=7200;secure;samesite=strict",
        send_page_view: true,
      });

      window.gtag = gtag;

      log("Google Analytics carregado com sucesso");
    } catch (error) {
      console.error("Erro ao configurar Google Analytics:", error);
    }
  }, [googleAnalyticsId, log]);

  const loadFacebookPixel = useCallback(() => {
    if (!facebookPixelId || !hasValidFacebookPixel()) {
      log("Facebook Pixel não configurado ou inválido");
      return;
    }

    try {
      log("Carregando Facebook Pixel:", facebookPixelId);

      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        t.onerror = () => {
          console.error("Erro ao carregar Facebook Pixel");
        };
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js"
      );

      window.fbq("init", facebookPixelId);
      window.fbq("track", "PageView");
      log("Facebook Pixel carregado com sucesso");
    } catch (error) {
      console.error("Erro ao configurar Facebook Pixel:", error);
    }
  }, [facebookPixelId, log]);

  const {
    metrics,
    performanceScore,
    getTTI,
    getFCP,
    getLCP,
    getCLS,
    getFID,
    getTTFB,
  } = usePerformanceMonitoring();

  const trackPerformanceMetrics = useCallback(() => {
    if (!window.gtag || !isProduction || !isPerformanceTrackingEnabled) return;

    try {
      if (performanceScore > 0) {
        window.gtag("event", "lighthouse_score", {
          event_category: "Performance",
          event_label: "Performance Score",
          value: performanceScore,
        });
      }

      const coreWebVitals = {
        LCP: getLCP(),
        FID: getFID(),
        CLS: getCLS(),
        FCP: getFCP(),
        TTI: getTTI(),
        TTFB: getTTFB(),
      };

      Object.entries(coreWebVitals).forEach(([metricName, value]) => {
        if (value !== null && value !== undefined) {
          window.gtag("event", "web_vital", {
            event_category: "Web Vitals",
            event_label: metricName,
            value:
              metricName === "CLS"
                ? Math.round(value * 1000)
                : Math.round(value),
            metric_rating: getRating(metricName, value),
          });
        }
      });

      log("Métricas de performance enviadas para Analytics");
    } catch (error) {
      console.error("Erro ao enviar métricas de performance:", error);
    }
  }, [
    performanceScore,
    getTTI,
    getFCP,
    getLCP,
    getCLS,
    getFID,
    getTTFB,
    isProduction,
    log,
  ]);

  const getRating = (metricName, value) => {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTI: { good: 3800, poor: 7300 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metricName];
    if (!threshold) return "unknown";

    if (value <= threshold.good) return "good";
    if (value <= threshold.poor) return "needs-improvement";
    return "poor";
  };

  useEffect(() => {
    if (!shouldInitializeAnalytics) {
      if (!window.__ANALYTICS_LOG_SHOWN__) {
        log("Analytics não será carregado:", {
          isProduction,
          isAnalyticsEnabled,
          hasValidAnalytics,
          shouldLoadAnalytics,
        });
        window.__ANALYTICS_LOG_SHOWN__ = true;
      }
      return;
    }

    const timeoutId = setTimeout(() => {
      loadGoogleAnalytics();
      loadFacebookPixel();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [shouldInitializeAnalytics, loadGoogleAnalytics, loadFacebookPixel, log]);

  useEffect(() => {
    if (!isProduction || !isPerformanceTrackingEnabled) return;

    const handleLoad = () => {
      setTimeout(trackPerformanceMetrics, 10000);
    };

    if (document.readyState === "complete") {
      setTimeout(trackPerformanceMetrics, 10000);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, [isProduction, trackPerformanceMetrics]);

  useEffect(() => {
    if (!isProduction || !window.gtag || !isAnalyticsEnabled) return;

    const handleRouteChange = () => {
      window.gtag("config", googleAnalyticsId, {
        page_path: window.location.pathname + window.location.search,
      });
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [isProduction, isAnalyticsEnabled, googleAnalyticsId]);

  return null;
};

export const trackEvent = (
  action,
  category = "engagement",
  label = "",
  value = 0
) => {
  try {
    if (window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }

    if (window.fbq) {
      window.fbq("track", "CustomEvent", {
        action,
        category,
        label,
        value,
      });
    }
  } catch (error) {
    console.error("Erro ao rastrear evento:", error);
  }
};

export const trackPageView = (page_title, page_location) => {
  try {
    if (window.gtag && window.GA_MEASUREMENT_ID) {
      window.gtag("config", window.GA_MEASUREMENT_ID, {
        page_title,
        page_location,
      });
    }

    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  } catch (error) {
    console.error("Erro ao rastrear page view:", error);
  }
};

export const trackConversion = (conversionData = {}) => {
  try {
    const {
      action = "conversion",
      value = 0,
      currency = "BRL",
    } = conversionData;

    if (window.gtag) {
      window.gtag("event", "purchase", {
        transaction_id: conversionData.transaction_id,
        value: value,
        currency: currency,
        items: conversionData.items || [],
      });
    }

    if (window.fbq) {
      window.fbq("track", "Purchase", {
        value: value,
        currency: currency,
        ...conversionData,
      });
    }
  } catch (error) {
    console.error("Erro ao rastrear conversão:", error);
  }
};

export function exportLighthouseReport() {
  try {
    const perf = usePerformanceMonitoring();

    const data = perf.exportLighthouseData();

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `lighthouse-report-${new Date().toISOString().slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return data;
  } catch (error) {
    console.error("Erro ao exportar relatório do Lighthouse:", error);
    return null;
  }
}

export default Analytics;
