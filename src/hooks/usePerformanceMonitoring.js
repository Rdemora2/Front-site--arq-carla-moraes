import { useState, useEffect, useRef, useCallback } from "react";
import { useWebVitals } from "./useWebVitals";
import { useEnvironment } from "./useEnvironment";

const usePerformanceMonitoring = () => {
  const { isFeatureEnabled } = useEnvironment();

  const isPerformanceTrackingEnabled = isFeatureEnabled("performanceTracking");
  const isWebVitalsEnabled = isFeatureEnabled("webVitals");
  const isMemoryMonitoringEnabled = isFeatureEnabled("memoryMonitoring");

  const [metrics, setMetrics] = useState({
    tti: null,
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    ttfb: null,
    si: null,
    tbt: null,
  });

  const [lighthouseScores, setLighthouseScores] = useState({
    performance: null,
    accessibility: null,
    bestPractices: null,
    seo: null,
  });

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
  const longTasksRef = useRef([]);

  useEffect(() => {
    if (!isPerformanceTrackingEnabled) return;

    let longTaskObserver;

    if (
      typeof PerformanceObserver !== "undefined" &&
      PerformanceObserver.supportedEntryTypes &&
      PerformanceObserver.supportedEntryTypes.includes("longtask")
    ) {
      try {
        longTaskObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          longTasksRef.current = [...longTasksRef.current, ...entries];

          if (longTasksRef.current.length > 100) {
            longTasksRef.current = longTasksRef.current.slice(-100);
          }
        });

        longTaskObserver.observe({ entryTypes: ["longtask"] });
      } catch (error) {
        console.warn(
          "Erro ao configurar PerformanceObserver para longtasks:",
          error
        );
      }
    }

    return () => {
      if (longTaskObserver) {
        longTaskObserver.disconnect();
      }
    };
  }, [isPerformanceTrackingEnabled]);

  const webVitals = useWebVitals({
    enableAnalytics: isWebVitalsEnabled && isFeatureEnabled("analytics"),
    enableConsoleLog: isWebVitalsEnabled && isFeatureEnabled("consoleLogging"),
    enableLocalStorage: isWebVitalsEnabled && isFeatureEnabled("localStorage"),
  });

  const calculateTTI = useCallback(() => {
    try {
      if (!performance.getEntriesByType) return null;

      const navigationEntry = performance.getEntriesByType("navigation")[0];
      if (!navigationEntry) return null;

      const domContentLoaded = navigationEntry.domContentLoadedEventEnd;
      const loadComplete = navigationEntry.loadEventEnd;

      return Math.round(loadComplete - navigationEntry.startTime);
    } catch (error) {
      console.warn("Erro ao calcular TTI:", error);
      return null;
    }
  }, []);

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

      setTimeout(() => {
        observer.disconnect();
      }, 5000);

      return lcpValue;
    } catch (error) {
      console.warn("Erro ao calcular LCP:", error);
      return null;
    }
  }, []);
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

  const calculateSI = useCallback(() => {
    try {
      const navigationEntry = performance.getEntriesByType("navigation")[0];
      const paintEntries = performance.getEntriesByType("paint");

      if (!navigationEntry || !paintEntries.length) return null;

      // Basicamente, uma média ponderada de eventos de renderização
      const fcp = paintEntries.find(
        (entry) => entry.name === "first-contentful-paint"
      );

      if (!fcp) return null;

      const domComplete = navigationEntry.domComplete;
      const loadEventEnd = navigationEntry.loadEventEnd;

      return Math.round(
        fcp.startTime * 0.25 + domComplete * 0.5 + loadEventEnd * 0.25
      );
    } catch (error) {
      console.warn("Erro ao calcular Speed Index:", error);
      return null;
    }
  }, []);

  const calculateTBT = useCallback(() => {
    try {
      const fcpEntry = performance
        .getEntriesByType("paint")
        .find((entry) => entry.name === "first-contentful-paint");

      const navigationEntry = performance.getEntriesByType("navigation")[0];

      if (!fcpEntry || !navigationEntry) return null;

      const interactive = navigationEntry.domInteractive;
      const fcp = fcpEntry.startTime;

      // Usar apenas as longtasks coletadas pelo PerformanceObserver
      let longTasks = longTasksRef.current || [];

      const totalBlockingTime = longTasks.reduce((total, task) => {
        if (task.startTime > fcp) {
          const blockingTime = Math.max(0, task.duration - 50);
          return total + blockingTime;
        }
        return total;
      }, 0);

      return longTasks.length > 0
        ? Math.round(totalBlockingTime)
        : Math.round(Math.max(0, (interactive - fcp) * 0.3)); // 30% do tempo entre FCP e interatividade
    } catch (error) {
      console.warn("Erro ao calcular Total Blocking Time:", error);
      return null;
    }
  }, []);
  const calculatePerformanceScore = useCallback((metricsData) => {
    const weights = {
      fcp: 0.1,
      si: 0.1,
      lcp: 0.25,
      ttfb: 0.05,
      tbt: 0.3,
      cls: 0.15,
      tti: 0.05,
    };

    const scores = {
      fcp: calculateMetricScore("fcp", metricsData.fcp),
      si: calculateMetricScore("si", metricsData.si),
      lcp: calculateMetricScore("lcp", metricsData.lcp),
      ttfb: calculateMetricScore("ttfb", metricsData.ttfb),
      tbt: calculateMetricScore("tbt", metricsData.tbt),
      cls: calculateMetricScore("cls", metricsData.cls),
      tti: calculateMetricScore("tti", metricsData.tti),
    };

    let finalScore = 0;
    let weightSum = 0;

    Object.entries(scores).forEach(([metric, score]) => {
      if (score !== null) {
        finalScore += score * weights[metric];
        weightSum += weights[metric];
      }
    });

    if (weightSum > 0) {
      finalScore = finalScore / weightSum;
    }

    return Math.round(finalScore);
  }, []);

  const calculateMetricScore = useCallback((metric, value) => {
    if (value === null || value === undefined) return null;

    const thresholds = {
      fcp: [1800, 3000, 4500], // ms
      si: [3400, 5800, 8500], // ms
      lcp: [2500, 4000, 6000], // ms
      ttfb: [600, 1000, 1500], // ms
      tbt: [200, 600, 1000], // ms
      cls: [0.1, 0.25, 0.4], // score
      tti: [3800, 7300, 12500], // ms
    };

    if (!thresholds[metric]) return 50;

    const [good, medium, poor] = thresholds[metric];

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

  const calculateLighthouseScores = useCallback(() => {
    return {
      performance: performanceScore,

      accessibility: estimateAccessibilityScore(),
      bestPractices: estimateBestPracticesScore(),
      seo: estimateSEOScore(),
    };
  }, [performanceScore]);

  const estimateAccessibilityScore = useCallback(() => {
    let score = 90;

    try {
      const images = document.querySelectorAll("img");
      const imagesWithoutAlt = Array.from(images).filter(
        (img) => !img.hasAttribute("alt")
      );
      if (imagesWithoutAlt.length > 0) {
        score -= Math.min(15, imagesWithoutAlt.length * 2);
      }

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
      if (window.location.protocol !== "https:") {
        score -= 20;
      }

      if (window.console && window.console.error) {
        const originalError = window.console.error;
        let errorCount = 0;

        window.console.error = function () {
          errorCount++;
          originalError.apply(console, arguments);
        };

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
  useEffect(() => {
    if (!isPerformanceTrackingEnabled) {
      setLoading(false);
      return;
    }

    const collectMetrics = () => {
      try {
        if (document.readyState === "complete") {
          const webVitalsMetrics = isWebVitalsEnabled
            ? webVitals.getMetrics()
            : [];
          const webVitalsMap = {};

          webVitalsMetrics.forEach((metric) => {
            const name = metric.name.toLowerCase();
            webVitalsMap[name] = metric.value;
          });

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

          const perfScore = calculatePerformanceScore(metricsData);
          setPerformanceScore(perfScore);

          const lighthouseScores = {
            performance: perfScore,
            accessibility: estimateAccessibilityScore(),
            bestPractices: estimateBestPracticesScore(),
            seo: estimateSEOScore(),
          };

          setLighthouseScores(lighthouseScores);
          setLoading(false);

          timersRef.current.updateTimer = setTimeout(() => {
            collectMetrics();
          }, 5000);
        } else {
          timersRef.current.ttiTimer = setTimeout(collectMetrics, 100);
        }
      } catch (error) {
        console.warn("Erro na coleta de métricas:", error);
        setLoading(false);
      }
    };

    if (isPerformanceTrackingEnabled) {
      timersRef.current.ttiTimer = setTimeout(collectMetrics, 1000);
    }

    return () => {
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
    isPerformanceTrackingEnabled,
    isWebVitalsEnabled,
  ]);
  const refreshMetrics = useCallback(() => {
    if (!isPerformanceTrackingEnabled) {
      setLoading(false);
      return;
    }

    setLoading(true);

    Object.keys(timersRef.current).forEach((key) => {
      if (timersRef.current[key]) {
        clearTimeout(timersRef.current[key]);
        timersRef.current[key] = null;
      }
    });

    timersRef.current.ttiTimer = setTimeout(() => {
      const webVitalsMetrics = isWebVitalsEnabled ? webVitals.getMetrics() : [];
      const webVitalsMap = {};

      webVitalsMetrics.forEach((metric) => {
        const name = metric.name.toLowerCase();
        webVitalsMap[name] = metric.value;
      });

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

      const perfScore = calculatePerformanceScore(metricsData);
      setPerformanceScore(perfScore);

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
    isPerformanceTrackingEnabled,
    isWebVitalsEnabled,
  ]);

  const getMetrics = useCallback(() => {
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

  const getRating = useCallback((name, value) => {
    if (value === null || value === undefined) return "unknown";

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
    metrics: isPerformanceTrackingEnabled ? metrics : {},
    performanceScore: isPerformanceTrackingEnabled ? performanceScore : 0,
    lighthouseScores: isPerformanceTrackingEnabled ? lighthouseScores : {},
    loading: isPerformanceTrackingEnabled ? loading : false,

    isPerformanceTrackingEnabled,
    isWebVitalsEnabled,
    isMemoryMonitoringEnabled,

    refreshMetrics,
    getMetrics,
    getLighthouseScores: () =>
      isPerformanceTrackingEnabled ? lighthouseScores : {},
    exportLighthouseData,

    getTTI: () => (isPerformanceTrackingEnabled ? metrics.tti : null),
    getFCP: () => (isPerformanceTrackingEnabled ? metrics.fcp : null),
    getLCP: () => (isPerformanceTrackingEnabled ? metrics.lcp : null),
    getTTFB: () => (isPerformanceTrackingEnabled ? metrics.ttfb : null),
    getCLS: () => (isPerformanceTrackingEnabled ? metrics.cls : null),
    getFID: () => (isPerformanceTrackingEnabled ? metrics.fid : null),
    getSI: () => (isPerformanceTrackingEnabled ? metrics.si : null),
    getTBT: () => (isPerformanceTrackingEnabled ? metrics.tbt : null),
  };
};

export default usePerformanceMonitoring;
