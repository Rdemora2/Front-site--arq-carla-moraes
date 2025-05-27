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
  const { googleAnalyticsId, facebookPixelId, isProduction, log } =
    useEnvironment();

  // Função para carregar Google Analytics de forma otimizada
  const loadGoogleAnalytics = useCallback(() => {
    if (!googleAnalyticsId) return;

    try {
      log("Carregando Google Analytics:", googleAnalyticsId);

      // Preconnect para melhorar performance
      const preconnect = document.createElement("link");
      preconnect.rel = "preconnect";
      preconnect.href = "https://www.googletagmanager.com";
      document.head.appendChild(preconnect);

      // Carregar script do GA
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
      script.onerror = () => {
        console.error("Erro ao carregar Google Analytics");
      };
      document.head.appendChild(script);

      // Configurar gtag
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }

      gtag("js", new Date());
      gtag("config", googleAnalyticsId, {
        // Configurações de privacidade
        anonymize_ip: true,
        cookie_flags: "max-age=7200;secure;samesite=strict",
        // Melhorar performance
        send_page_view: true,
      });

      // Disponibilizar globalmente
      window.gtag = gtag;

      log("Google Analytics carregado com sucesso");
    } catch (error) {
      console.error("Erro ao configurar Google Analytics:", error);
    }
  }, [googleAnalyticsId, log]);

  // Função para carregar Facebook Pixel de forma otimizada
  const loadFacebookPixel = useCallback(() => {
    if (!facebookPixelId) return;

    try {
      log("Carregando Facebook Pixel:", facebookPixelId);

      // Implementação otimizada do Facebook Pixel
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

      // Configurar pixel
      window.fbq("init", facebookPixelId);
      window.fbq("track", "PageView");
      log("Facebook Pixel carregado com sucesso");
    } catch (error) {
      console.error("Erro ao configurar Facebook Pixel:", error);
    }
  }, [facebookPixelId, log]);

  // Hook para monitoramento de performance - usando as funções corretas
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

  // Função para enviar métricas de performance para analytics
  const trackPerformanceMetrics = useCallback(() => {
    if (!window.gtag || !isProduction) return;

    try {
      // Enviar pontuação geral para Google Analytics
      if (performanceScore > 0) {
        window.gtag("event", "lighthouse_score", {
          event_category: "Performance",
          event_label: "Performance Score",
          value: performanceScore,
        });
      }

      // Enviar métricas Core Web Vitals usando as funções do hook
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

  // Função auxiliar para classificar métricas
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

  // Carregar analytics apenas em produção
  useEffect(() => {
    if (!isProduction) {
      log("Analytics desabilitado em desenvolvimento");
      return;
    }

    // Carregar analytics com delay para não impactar performance inicial
    const timeoutId = setTimeout(() => {
      loadGoogleAnalytics();
      loadFacebookPixel();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [isProduction, loadGoogleAnalytics, loadFacebookPixel, log]);

  // Enviar métricas de performance quando a página estiver totalmente carregada
  useEffect(() => {
    if (!isProduction) return;

    // Aguardar o carregamento completo da página e mais 10 segundos
    // para que todas as métricas sejam coletadas adequadamente
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

  // Monitorar mudanças de rota para SPA
  useEffect(() => {
    if (!isProduction || !window.gtag) return;

    const handleRouteChange = () => {
      window.gtag("config", googleAnalyticsId, {
        page_path: window.location.pathname + window.location.search,
      });
    };

    // Listen para mudanças de URL (para SPA)
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [isProduction, googleAnalyticsId]);

  // Não renderiza nada - componente apenas para side effects
  return null;
};

/**
 * Função utilitária para tracking de eventos
 * Suporta múltiplos provedores de analytics
 */
export const trackEvent = (
  action,
  category = "engagement",
  label = "",
  value = 0
) => {
  try {
    // Google Analytics
    if (window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }

    // Facebook Pixel
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

/**
 * Função utilitária para tracking de page views
 * Útil para SPAs com roteamento client-side
 */
export const trackPageView = (page_title, page_location) => {
  try {
    // Google Analytics
    if (window.gtag && window.GA_MEASUREMENT_ID) {
      window.gtag("config", window.GA_MEASUREMENT_ID, {
        page_title,
        page_location,
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  } catch (error) {
    console.error("Erro ao rastrear page view:", error);
  }
};

/**
 * Função para tracking de conversões
 * Útil para e-commerce e lead generation
 */
export const trackConversion = (conversionData = {}) => {
  try {
    const {
      action = "conversion",
      value = 0,
      currency = "BRL",
    } = conversionData;

    // Google Analytics
    if (window.gtag) {
      window.gtag("event", "purchase", {
        transaction_id: conversionData.transaction_id,
        value: value,
        currency: currency,
        items: conversionData.items || [],
      });
    }

    // Facebook Pixel
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

/**
 * Exporta métricas do Lighthouse no formato JSON
 * Útil para armazenar resultados ou enviar para sistemas de monitoramento
 * Função modificada para usar o hook de performance diretamente
 */
export function exportLighthouseReport() {
  try {
    // Criar uma instância temporária do hook para obter as métricas
    const perf = usePerformanceMonitoring();

    // Obter dados do relatório
    const data = perf.exportLighthouseData();
    
    // Criar um Blob com os dados JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    // Criar URL para o blob
    const url = URL.createObjectURL(blob);

    // Criar link para download
    const link = document.createElement("a");
    link.href = url;
    link.download = `lighthouse-report-${new Date().toISOString().slice(0, 10)}.json`;

    // Adicionar o link ao documento e clicar automaticamente
    document.body.appendChild(link);
    link.click();

    // Limpar
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return data;
  } catch (error) {
    console.error("Erro ao exportar relatório do Lighthouse:", error);
    return null;
  }
}

export default Analytics;
