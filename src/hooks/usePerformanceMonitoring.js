import { useState, useEffect, useRef, useCallback } from "react";
import { useWebVitals } from "./useWebVitals";

const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    tti: null,
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    ttfb: null,
    si: null, // Speed Index
    tbt: null, // Total Blocking Time
  });

  const [lighthouseScores, setLighthouseScores] = useState({
    performance: null,
    accessibility: null,
    bestPractices: null,
    seo: null,
  });

  // Usar useRef para manter referências persistentes dos timers
  const timersRef = useRef({
    ttiTimer: null,
    fcpTimer: null,
    lcpTimer: null,
    ttfbTimer: null,
    siTimer: null,
    tbtTimer: null,
  });

  const [performanceScore, setPerformanceScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Integração com Web Vitals para dados mais precisos
  const webVitals = useWebVitals({
    enableAnalytics: false,
    enableConsoleLog: false,
  });

  // Função para calcular TTI
  const calculateTTI = useCallback(() => {
    try {
      if (!performance.getEntriesByType) return null;

      const navigationEntry = performance.getEntriesByType("navigation")[0];
      if (!navigationEntry) return null;

      const domContentLoaded = navigationEntry.domContentLoadedEventEnd;
      const loadComplete = navigationEntry.loadEventEnd;

      // TTI aproximado baseado no carregamento completo
      return Math.round(loadComplete - navigationEntry.startTime);
    } catch (error) {
      console.warn("Erro ao calcular TTI:", error);
      return null;
    }
  }, []);

  // Função para calcular FCP
  const calculateFCP = useCallback(() => {
    try {
      const fcpEntries = performance.getEntriesByType("paint");
      const fcpEntry = fcpEntries.find(
        (entry) => entry.name === "first-contentful-paint"
      );
      return fcpEntry ? Math.round(fcpEntry.startTime) : null;
    } catch (error) {
      console.warn("Erro ao calcular FCP:", error);
      return null;
    }
  }, []);

  // Função para calcular LCP
  const calculateLCP = useCallback(() => {
    try {
      if (!window.PerformanceObserver) return null;

      let lcpValue = null;

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          lcpValue = Math.round(lastEntry.startTime);
        }
      });

      observer.observe({ entryTypes: ["largest-contentful-paint"] });

      // Cleanup observer após 5 segundos
      setTimeout(() => {
        observer.disconnect();
      }, 5000);

      return lcpValue;
    } catch (error) {
      console.warn("Erro ao calcular LCP:", error);
      return null;
    }
  }, []);
  // Função para calcular TTFB
  const calculateTTFB = useCallback(() => {
    try {
      const navigationEntry = performance.getEntriesByType("navigation")[0];
      if (!navigationEntry) return null;

      return Math.round(
        navigationEntry.responseStart - navigationEntry.requestStart
      );
    } catch (error) {
      console.warn("Erro ao calcular TTFB:", error);
      return null;
    }
  }, []);

  // Função para calcular Speed Index (estimado)
  const calculateSI = useCallback(() => {
    try {
      const navigationEntry = performance.getEntriesByType("navigation")[0];
      const paintEntries = performance.getEntriesByType("paint");

      if (!navigationEntry || !paintEntries.length) return null;

      // Speed Index é complexo, esta é uma aproximação simplificada
      // Basicamente, uma média ponderada de eventos de renderização
      const fcp = paintEntries.find(
        (entry) => entry.name === "first-contentful-paint"
      );

      if (!fcp) return null;

      const domComplete = navigationEntry.domComplete;
      const loadEventEnd = navigationEntry.loadEventEnd;

      // Fórmula simplificada para estimar o Speed Index
      return Math.round(
        fcp.startTime * 0.25 + domComplete * 0.5 + loadEventEnd * 0.25
      );
    } catch (error) {
      console.warn("Erro ao calcular Speed Index:", error);
      return null;
    }
  }, []);

  // Função para calcular Total Blocking Time (estimado)
  const calculateTBT = useCallback(() => {
    try {
      // TBT é complexo e requer análise detalhada das tarefas do thread principal
      // Esta é uma implementação simplificada baseada em eventos de performance

      const fcpEntry = performance
        .getEntriesByType("paint")
        .find((entry) => entry.name === "first-contentful-paint");

      const navigationEntry = performance.getEntriesByType("navigation")[0];

      if (!fcpEntry || !navigationEntry) return null;

      // Calcular uma aproximação do TBT baseado no tempo entre FCP e domInteractive
      const interactive = navigationEntry.domInteractive;
      const fcp = fcpEntry.startTime;

      // Extrair apenas o tempo de bloqueio significativo (>50ms)
      // Esta é uma estimativa, o valor real requer análise de cada tarefa
      const longTasks = performance.getEntriesByType("longtask") || [];
      const totalBlockingTime = longTasks.reduce((total, task) => {
        // Apenas considerar tarefas após o FCP
        if (task.startTime > fcp) {
          // Apenas o tempo além de 50ms é considerado bloqueante
          const blockingTime = Math.max(0, task.duration - 50);
          return total + blockingTime;
        }
        return total;
      }, 0);

      // Se não tivermos dados de longTask, fazer uma estimativa
      return longTasks.length > 0
        ? Math.round(totalBlockingTime)
        : Math.round(Math.max(0, (interactive - fcp) * 0.3)); // 30% do tempo entre FCP e interatividade
    } catch (error) {
      console.warn("Erro ao calcular Total Blocking Time:", error);
      return null;
    }
  }, []);
  // Calcula pontuação de performance segundo critérios do Lighthouse
  const calculatePerformanceScore = useCallback((metricsData) => {
    // Pesos aproximados baseados no Lighthouse 6+
    const weights = {
      fcp: 0.1, // First Contentful Paint: 10%
      si: 0.1, // Speed Index: 10%
      lcp: 0.25, // Largest Contentful Paint: 25%
      ttfb: 0.05, // Time to First Byte: 5% (implícito no Lighthouse)
      tbt: 0.3, // Total Blocking Time: 30%
      cls: 0.15, // Cumulative Layout Shift: 15%
      tti: 0.05, // Time to Interactive: 5% (menos peso nas versões mais recentes)
    };

    // Notas para cada métrica (0-100)
    const scores = {
      fcp: calculateMetricScore("fcp", metricsData.fcp),
      si: calculateMetricScore("si", metricsData.si),
      lcp: calculateMetricScore("lcp", metricsData.lcp),
      ttfb: calculateMetricScore("ttfb", metricsData.ttfb),
      tbt: calculateMetricScore("tbt", metricsData.tbt),
      cls: calculateMetricScore("cls", metricsData.cls),
      tti: calculateMetricScore("tti", metricsData.tti),
    };

    // Calcular pontuação ponderada final
    let finalScore = 0;
    let weightSum = 0;

    Object.entries(scores).forEach(([metric, score]) => {
      if (score !== null) {
        finalScore += score * weights[metric];
        weightSum += weights[metric];
      }
    });

    // Ajustar para os pesos disponíveis
    if (weightSum > 0) {
      finalScore = finalScore / weightSum;
    }

    return Math.round(finalScore);
  }, []);

  // Função auxiliar para calcular pontuação de cada métrica individual
  const calculateMetricScore = useCallback((metric, value) => {
    if (value === null || value === undefined) return null;

    // Limiares baseados no Lighthouse (valor bom, médio, ruim)
    const thresholds = {
      fcp: [1800, 3000, 4500], // ms
      si: [3400, 5800, 8500], // ms
      lcp: [2500, 4000, 6000], // ms
      ttfb: [600, 1000, 1500], // ms
      tbt: [200, 600, 1000], // ms
      cls: [0.1, 0.25, 0.4], // score
      tti: [3800, 7300, 12500], // ms
    };

    // Se não temos limiares definidos para esta métrica
    if (!thresholds[metric]) return 50;

    const [good, medium, poor] = thresholds[metric];

    // Fórmula baseada no Lighthouse para pontuação
    // https://web.dev/performance-scoring/
    if (value <= good) {
      return 90 + (10 * (good - value)) / good; // 90-100
    } else if (value <= medium) {
      return 75 + (15 * (medium - value)) / (medium - good); // 75-90
    } else if (value <= poor) {
      return 50 + (25 * (poor - value)) / (poor - medium); // 50-75
    } else {
      return Math.max(0, (50 * poor) / value); // 0-50
    }
  }, []);

  // Função para calcular escores adicionais do Lighthouse
  const calculateLighthouseScores = useCallback(() => {
    return {
      // Performance baseado nas métricas Web Vitals
      performance: performanceScore,

      // Os outros escores são estimados ou podem ser configurados estaticamente
      // Na implementação real, estes viriam de auditorias reais
      accessibility: estimateAccessibilityScore(),
      bestPractices: estimateBestPracticesScore(),
      seo: estimateSEOScore(),
    };
  }, [performanceScore]);

  // Funções para estimar outros scores do Lighthouse
  // Estas poderiam ser implementadas com verificações reais em uma versão completa
  const estimateAccessibilityScore = useCallback(() => {
    // Verificar se temos elementos com problemas de acessibilidade básicos
    let score = 90; // Começa com score alto

    try {
      // Verificar atributos alt nas imagens
      const images = document.querySelectorAll("img");
      const imagesWithoutAlt = Array.from(images).filter(
        (img) => !img.hasAttribute("alt")
      );
      if (imagesWithoutAlt.length > 0) {
        score -= Math.min(15, imagesWithoutAlt.length * 2);
      }

      // Verificar contraste de cores (simplificado)
      // Verificar headings em ordem (simplificado)
      // Verificar labels em formulários
      const inputs = document.querySelectorAll("input, select, textarea");
      const inputsWithoutLabels = Array.from(inputs).filter((input) => {
        const id = input.getAttribute("id");
        if (!id) return true;
        return !document.querySelector(`label[for="${id}"]`);
      });

      if (inputsWithoutLabels.length > 0) {
        score -= Math.min(20, inputsWithoutLabels.length * 5);
      }
    } catch (e) {
      console.warn("Erro ao estimar score de acessibilidade:", e);
    }

    return Math.max(50, score);
  }, []);

  const estimateBestPracticesScore = useCallback(() => {
    let score = 95;

    try {
      // Verificar uso de HTTPS
      if (window.location.protocol !== "https:") {
        score -= 20;
      }

      // Verificar console errors
      if (window.console && window.console.error) {
        const originalError = window.console.error;
        let errorCount = 0;

        window.console.error = function () {
          errorCount++;
          originalError.apply(console, arguments);
        };

        // Restaurar após 1 segundo
        setTimeout(() => {
          window.console.error = originalError;
          if (errorCount > 0) {
            score -= Math.min(30, errorCount * 5);
          }
        }, 1000);
      }
    } catch (e) {
      console.warn("Erro ao estimar score de boas práticas:", e);
    }

    return Math.max(50, score);
  }, []);

  const estimateSEOScore = useCallback(() => {
    let score = 90;

    try {
      // Verificar title e meta description
      if (!document.title) {
        score -= 15;
      } else if (document.title.length < 10 || document.title.length > 70) {
        score -= 7;
      }

      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (!metaDescription) {
        score -= 10;
      } else {
        const content = metaDescription.getAttribute("content");
        if (!content || content.length < 50 || content.length > 160) {
          score -= 5;
        }
      }

      // Verificar links
      const links = document.querySelectorAll("a");
      const linksWithoutText = Array.from(links).filter((link) => {
        const text = link.textContent.trim();
        const ariaLabel = link.getAttribute("aria-label");
        return !text && !ariaLabel;
      });

      if (linksWithoutText.length > 0) {
        score -= Math.min(15, linksWithoutText.length * 3);
      }
    } catch (e) {
      console.warn("Erro ao estimar score de SEO:", e);
    }

    return Math.max(50, score);
  }, []);
  // Effect principal para coleta de métricas
  useEffect(() => {
    const collectMetrics = () => {
      try {
        // Aguardar o carregamento completo da página
        if (document.readyState === "complete") {
          // Obter métricas do Web Vitals quando disponíveis
          const webVitalsMetrics = webVitals.getMetrics();
          const webVitalsMap = {};

          // Converter métricas do Web Vitals para nosso formato
          webVitalsMetrics.forEach((metric) => {
            // Padronizar nome da métrica (minúsculo)
            const name = metric.name.toLowerCase();
            webVitalsMap[name] = metric.value;
          });

          // Mesclar as métricas coletadas pelo Web Vitals com nossas métricas calculadas
          const metricsData = {
            ttfb: webVitalsMap.ttfb || calculateTTFB(),
            fcp: webVitalsMap.fcp || calculateFCP(),
            lcp: webVitalsMap.lcp || calculateLCP(),
            tti: calculateTTI(),
            cls: webVitalsMap.cls || 0,
            fid: webVitalsMap.fid || null,
            si: calculateSI(),
            tbt: calculateTBT(),
          };

          // Atualizar estado de métricas
          setMetrics(metricsData);

          // Calcular pontuação de performance
          const perfScore = calculatePerformanceScore(metricsData);
          setPerformanceScore(perfScore);

          // Calcular outros escores do Lighthouse
          const lighthouseScores = {
            performance: perfScore,
            accessibility: estimateAccessibilityScore(),
            bestPractices: estimateBestPracticesScore(),
            seo: estimateSEOScore(),
          };

          setLighthouseScores(lighthouseScores);
          setLoading(false);

          // Agendar próxima atualização para dados dinâmicos (como CLS)
          // que podem continuar mudando mesmo após o carregamento inicial
          timersRef.current.updateTimer = setTimeout(() => {
            collectMetrics();
          }, 5000); // Atualizar a cada 5 segundos
        } else {
          // Se a página ainda não carregou completamente, agendar nova tentativa
          timersRef.current.ttiTimer = setTimeout(collectMetrics, 100);
        }
      } catch (error) {
        console.warn("Erro na coleta de métricas:", error);
        setLoading(false);
      }
    };

    // Iniciar coleta após um pequeno delay para garantir que os recursos de performance API estejam disponíveis
    timersRef.current.ttiTimer = setTimeout(collectMetrics, 1000);

    // Cleanup function
    return () => {
      // Limpar todos os timers usando as referências
      Object.keys(timersRef.current).forEach((key) => {
        if (timersRef.current[key]) {
          clearTimeout(timersRef.current[key]);
          timersRef.current[key] = null;
        }
      });
    };
  }, [
    calculateTTI,
    calculateFCP,
    calculateLCP,
    calculateTTFB,
    calculateSI,
    calculateTBT,
    calculatePerformanceScore,
    estimateAccessibilityScore,
    estimateBestPracticesScore,
    estimateSEOScore,
    webVitals,
  ]);
  // Função para refazer a coleta de métricas
  const refreshMetrics = useCallback(() => {
    setLoading(true);

    // Limpar timers existentes
    Object.keys(timersRef.current).forEach((key) => {
      if (timersRef.current[key]) {
        clearTimeout(timersRef.current[key]);
        timersRef.current[key] = null;
      }
    });

    // Reagendar coleta
    timersRef.current.ttiTimer = setTimeout(() => {
      // Obter métricas do Web Vitals quando disponíveis
      const webVitalsMetrics = webVitals.getMetrics();
      const webVitalsMap = {};

      // Converter métricas do Web Vitals para nosso formato
      webVitalsMetrics.forEach((metric) => {
        // Padronizar nome da métrica (minúsculo)
        const name = metric.name.toLowerCase();
        webVitalsMap[name] = metric.value;
      });

      // Mesclar as métricas
      const metricsData = {
        ttfb: webVitalsMap.ttfb || calculateTTFB(),
        fcp: webVitalsMap.fcp || calculateFCP(),
        lcp: webVitalsMap.lcp || calculateLCP(),
        tti: calculateTTI(),
        cls: webVitalsMap.cls || 0,
        fid: webVitalsMap.fid || null,
        si: calculateSI(),
        tbt: calculateTBT(),
      };

      setMetrics(metricsData);

      // Calcular scores
      const perfScore = calculatePerformanceScore(metricsData);
      setPerformanceScore(perfScore);

      // Atualizar Lighthouse scores
      setLighthouseScores({
        performance: perfScore,
        accessibility: estimateAccessibilityScore(),
        bestPractices: estimateBestPracticesScore(),
        seo: estimateSEOScore(),
      });

      setLoading(false);
    }, 100);
  }, [
    calculateTTI,
    calculateFCP,
    calculateLCP,
    calculateTTFB,
    calculateSI,
    calculateTBT,
    calculatePerformanceScore,
    estimateAccessibilityScore,
    estimateBestPracticesScore,
    estimateSEOScore,
    webVitals,
  ]);

  // Função para converter as métricas para o formato esperado pelo componente LighthouseMetrics
  const getMetrics = useCallback(() => {
    // Transformar nossas métricas num formato compatível com o componente de UI
    const formattedMetrics = [
      {
        name: "LCP",
        value: metrics.lcp,
        unit: "ms",
        rating: getRating("LCP", metrics.lcp),
      },
      {
        name: "FID",
        value: metrics.fid || 0,
        unit: "ms",
        rating: getRating("FID", metrics.fid || 0),
      },
      {
        name: "CLS",
        value: metrics.cls,
        unit: "",
        rating: getRating("CLS", metrics.cls),
      },
      {
        name: "FCP",
        value: metrics.fcp,
        unit: "ms",
        rating: getRating("FCP", metrics.fcp),
      },
      {
        name: "TTFB",
        value: metrics.ttfb,
        unit: "ms",
        rating: getRating("TTFB", metrics.ttfb),
      },
      {
        name: "TTI",
        value: metrics.tti,
        unit: "ms",
        rating: getRating("TTI", metrics.tti),
      },
      {
        name: "SI",
        value: metrics.si,
        unit: "ms",
        rating: getRating("SI", metrics.si),
      },
      {
        name: "TBT",
        value: metrics.tbt,
        unit: "ms",
        rating: getRating("TBT", metrics.tbt),
      },
    ].filter((metric) => metric.value !== null && metric.value !== undefined);

    return formattedMetrics;
  }, [metrics]);

  // Função para classificar cada métrica
  const getRating = useCallback((name, value) => {
    if (value === null || value === undefined) return "unknown";

    // Limiares para classificação (bom, precisa melhorar, ruim)
    const thresholds = {
      LCP: [2500, 4000], // ms
      FID: [100, 300], // ms
      CLS: [0.1, 0.25], // score
      FCP: [1800, 3000], // ms
      TTI: [3800, 7300], // ms
      TTFB: [600, 1000], // ms
      SI: [3400, 5800], // ms
      TBT: [200, 600], // ms
    };

    const [good, poor] = thresholds[name] || [0, 0];

    if (value <= good) return "good";
    if (value <= poor) return "needs-improvement";
    return "poor";
  }, []);

  // Exportar dados completos para relatórios ou análise externa
  const exportLighthouseData = useCallback(() => {
    return {
      timestamp: Date.now(),
      url: window.location.href,
      metrics: {
        ttfb: metrics.ttfb,
        fcp: metrics.fcp,
        lcp: metrics.lcp,
        fid: metrics.fid,
        cls: metrics.cls,
        tti: metrics.tti,
        si: metrics.si,
        tbt: metrics.tbt,
      },
      scores: lighthouseScores,
      userAgent: navigator.userAgent,
    };
  }, [metrics, lighthouseScores]);

  return {
    // Dados brutos
    metrics,
    performanceScore,
    lighthouseScores,
    loading,

    // Funções auxiliares
    refreshMetrics,
    getMetrics,
    getLighthouseScores: () => lighthouseScores,
    exportLighthouseData,

    // Funções utilitárias para acessar métricas individualmente
    getTTI: () => metrics.tti,
    getFCP: () => metrics.fcp,
    getLCP: () => metrics.lcp,
    getTTFB: () => metrics.ttfb,
    getCLS: () => metrics.cls,
    getFID: () => metrics.fid,
    getSI: () => metrics.si,
    getTBT: () => metrics.tbt,
  };
};

export default usePerformanceMonitoring;
