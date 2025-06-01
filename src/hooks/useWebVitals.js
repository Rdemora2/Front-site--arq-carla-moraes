import { useEffect, useCallback, useRef } from "react";
import { useEnvironment } from "./useEnvironment";

export const useWebVitals = (options = {}) => {
  const { isFeatureEnabled } = useEnvironment();

  const {
    enableAnalytics = isFeatureEnabled("analytics"),
    enableConsoleLog = isFeatureEnabled("consoleLogging"),
    enableLocalStorage = isFeatureEnabled("localStorage"),
    thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 },
    },
    onMetric = null,
  } = options;

  const metricsRef = useRef(new Map());
  const observersRef = useRef([]);

  const getMetricRating = useCallback(
    (name, value) => {
      const threshold = thresholds[name];
      if (!threshold) return "unknown";

      if (value <= threshold.good) return "good";
      if (value <= threshold.poor) return "needs-improvement";
      return "poor";
    },
    [thresholds]
  );

  const reportMetric = useCallback(
    (metric) => {
      const { name, value, rating } = metric;

      metricsRef.current.set(name, metric);

      if (enableConsoleLog) {
        console.log(`[Web Vitals] ${name}:`, {
          value: Math.round(value * 100) / 100,
          rating,
          ...metric,
        });
      }

      if (enableLocalStorage) {
        try {
          const webVitalsData = JSON.parse(
            localStorage.getItem("webVitals") || "{}"
          );
          webVitalsData[name] = {
            value: Math.round(value * 100) / 100,
            rating,
            timestamp: Date.now(),
            url: window.location.href,
          };
          localStorage.setItem("webVitals", JSON.stringify(webVitalsData));
        } catch (error) {
          console.warn("[Web Vitals] Erro ao salvar no localStorage:", error);
        }
      }

      if (enableAnalytics && typeof gtag !== "undefined") {
        gtag("event", "web_vitals", {
          event_category: "Web Vitals",
          event_label: name,
          value: Math.round(value),
          custom_map: { metric_rating: rating },
        });
      }

      if (onMetric && typeof onMetric === "function") {
        onMetric(metric);
      }
    },
    [enableAnalytics, enableConsoleLog, enableLocalStorage, onMetric]
  );

  const createMetricObserver = useCallback((entryType, callback) => {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries && entries.length > 0) {
          callback(entries);
        }
      });

      observer.observe({ entryTypes: [entryType] });
      observersRef.current.push(observer);

      return observer;
    } catch (error) {
      console.warn(
        `[Web Vitals] Observer para ${entryType} não suportado:`,
        error
      );
      return null;
    }
  }, []);

  const observeLCP = useCallback(() => {
    let lcpValue = 0;

    const handleLCP = (entries) => {
      if (entries && entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        if (lastEntry && lastEntry.startTime !== undefined) {
          lcpValue = lastEntry.startTime;
        }
      }
    };

    createMetricObserver("largest-contentful-paint", handleLCP);

    const reportLCP = () => {
      if (lcpValue > 0) {
        const rating = getMetricRating("LCP", lcpValue);
        reportMetric({
          name: "LCP",
          value: lcpValue,
          rating,
          entries: [],
          id: "LCP",
          delta: lcpValue,
        });
      }
    };

    addEventListener("visibilitychange", reportLCP, { once: true });
    addEventListener("pagehide", reportLCP, { once: true });
  }, [createMetricObserver, getMetricRating, reportMetric]);

  const observeFID = useCallback(() => {
    const handleFID = (entries) => {
      if (entries && entries.length > 0) {
        entries.forEach((entry) => {
          if (
            entry &&
            entry.name === "first-input" &&
            entry.startTime !== undefined &&
            entry.processingStart !== undefined
          ) {
            const fidValue = entry.processingStart - entry.startTime;
            const rating = getMetricRating("FID", fidValue);

            reportMetric({
              name: "FID",
              value: fidValue,
              rating,
              entries: [entry],
              id: "FID",
              delta: fidValue,
            });
          }
        });
      }
    };

    createMetricObserver("first-input", handleFID);
  }, [createMetricObserver, getMetricRating, reportMetric]);

  const observeCLS = useCallback(() => {
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries = [];

    const handleLayoutShift = (entries) => {
      if (entries && entries.length > 0) {
        entries.forEach((entry) => {
          if (
            entry &&
            !entry.hadRecentInput &&
            entry.startTime !== undefined &&
            entry.value !== undefined
          ) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            if (
              sessionValue &&
              lastSessionEntry &&
              entry.startTime - lastSessionEntry.startTime > 1000
            ) {
              sessionValue = 0;
              sessionEntries = [];
            }

            if (
              sessionValue &&
              firstSessionEntry &&
              entry.startTime - firstSessionEntry.startTime > 5000
            ) {
              sessionValue = 0;
              sessionEntries = [];
            }

            sessionValue += entry.value;
            sessionEntries.push(entry);

            clsValue = Math.max(clsValue, sessionValue);
          }
        });
      }
    };

    createMetricObserver("layout-shift", handleLayoutShift);

    const reportCLS = () => {
      if (clsValue > 0) {
        const rating = getMetricRating("CLS", clsValue);
        reportMetric({
          name: "CLS",
          value: clsValue,
          rating,
          entries: sessionEntries,
          id: "CLS",
          delta: clsValue,
        });
      }
    };

    addEventListener("visibilitychange", reportCLS);
    addEventListener("pagehide", reportCLS);
  }, [createMetricObserver, getMetricRating, reportMetric]);

  const observeFCP = useCallback(() => {
    const handleFCP = (entries) => {
      if (entries && entries.length > 0) {
        entries.forEach((entry) => {
          if (
            entry &&
            entry.name === "first-contentful-paint" &&
            entry.startTime !== undefined
          ) {
            const fcpValue = entry.startTime;
            const rating = getMetricRating("FCP", fcpValue);

            reportMetric({
              name: "FCP",
              value: fcpValue,
              rating,
              entries: [entry],
              id: "FCP",
              delta: fcpValue,
            });
          }
        });
      }
    };

    createMetricObserver("paint", handleFCP);
  }, [createMetricObserver, getMetricRating, reportMetric]);

  const observeTTFB = useCallback(() => {
    const navigationEntry = performance.getEntriesByType("navigation")[0];

    if (navigationEntry) {
      const ttfbValue =
        navigationEntry.responseStart - navigationEntry.fetchStart;
      const rating = getMetricRating("TTFB", ttfbValue);

      reportMetric({
        name: "TTFB",
        value: ttfbValue,
        rating,
        entries: [navigationEntry],
        id: "TTFB",
        delta: ttfbValue,
      });
    }
  }, [getMetricRating, reportMetric]);

  useEffect(() => {
    if (document.readyState === "complete") {
      observeLCP();
      observeFID();
      observeCLS();
      observeFCP();
      observeTTFB();
    } else {
      addEventListener("load", () => {
        observeLCP();
        observeFID();
        observeCLS();
        observeFCP();
        observeTTFB();
      });
    }

    return () => {
      observersRef.current.forEach((observer) => {
        try {
          observer.disconnect();
        } catch (error) {
          console.warn("[Web Vitals] Erro ao desconectar observer:", error);
        }
      });
      observersRef.current = [];
    };
  }, [observeLCP, observeFID, observeCLS, observeFCP, observeTTFB]);

  const getMetrics = useCallback(() => {
    return Array.from(metricsRef.current.values());
  }, []);

  const getMetricByName = useCallback((name) => {
    return metricsRef.current.get(name);
  }, []);

  const getOverallScore = useCallback(() => {
    const metrics = getMetrics();
    if (metrics.length === 0) return null;

    const scores = metrics.map((metric) => {
      switch (metric.rating) {
        case "good":
          return 100;
        case "needs-improvement":
          return 50;
        case "poor":
          return 0;
        default:
          return 50;
      }
    });

    return Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    );
  }, [getMetrics]);

  const exportData = useCallback(() => {
    const metrics = getMetrics();
    const exportData = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: metrics.reduce((acc, metric) => {
        acc[metric.name] = {
          value: metric.value,
          rating: metric.rating,
        };
        return acc;
      }, {}),
      overallScore: getOverallScore(),
    };

    return exportData;
  }, [getMetrics, getOverallScore]);

  return {
    getMetrics,
    getMetricByName,
    getOverallScore,
    exportData,
    isSupported: typeof PerformanceObserver !== "undefined",
  };
};
