import { useEffect, useCallback } from "react";
import { useEnvironment } from "../../hooks/useEnvironment";

/**
 * Componente Analytics melhorado com:
 * - Carregamento otimizado
 * - Tratamento de erros
 * - Suporte a múltiplos provedores
 * - Configuração condicional
 */
const Analytics = () => {
  const { googleAnalyticsId, facebookPixelId, isProduction, log } = useEnvironment();

  // Função para carregar Google Analytics de forma otimizada
  const loadGoogleAnalytics = useCallback(() => {
    if (!googleAnalyticsId) return;

    try {
      log("Carregando Google Analytics:", googleAnalyticsId);

      // Preconnect para melhorar performance
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://www.googletagmanager.com';
      document.head.appendChild(preconnect);

      // Carregar script do GA
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
      script.onerror = () => {
        console.error('Erro ao carregar Google Analytics');
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
        cookie_flags: 'max-age=7200;secure;samesite=strict',
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
          console.error('Erro ao carregar Facebook Pixel');
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
      window.fbq("track", "PageView");      log("Facebook Pixel carregado com sucesso");
    } catch (error) {
      console.error("Erro ao configurar Facebook Pixel:", error);
    }
  }, [facebookPixelId, log]);

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

  // Monitorar mudanças de rota para SPA
  useEffect(() => {
    if (!isProduction || !window.gtag) return;

    const handleRouteChange = () => {
      window.gtag('config', googleAnalyticsId, {
        page_path: window.location.pathname + window.location.search,
      });
    };

    // Listen para mudanças de URL (para SPA)
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
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
    const { action = 'conversion', value = 0, currency = 'BRL' } = conversionData;

    // Google Analytics
    if (window.gtag) {
      window.gtag("event", "purchase", {
        transaction_id: conversionData.transaction_id,
        value: value,
        currency: currency,
        items: conversionData.items || []
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq("track", "Purchase", {
        value: value,
        currency: currency,
        ...conversionData
      });
    }
  } catch (error) {
    console.error("Erro ao rastrear conversão:", error);
  }
};

export default Analytics;
