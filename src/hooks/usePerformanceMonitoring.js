import { useEffect, useRef, useCallback } from 'react';
import { useEnvironment } from './useEnvironment';

/**
 * Hook para monitoramento de performance da aplicação
 * Coleta métricas de Web Vitals e outras métricas importantes
 */
export const usePerformanceMonitoring = () => {
  const { isDevelopment, log } = useEnvironment();
  const metricsRef = useRef({});

  // Função para reportar métricas
  const reportMetric = useCallback((name, value, unit = 'ms') => {
    const metric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      url: window.location.pathname,
    };

    metricsRef.current[name] = metric;

    if (isDevelopment) {
      log(`📊 Performance Metric: ${name} = ${value}${unit}`);
    }

    // Em produção, enviar para serviço de monitoramento
    if (!isDevelopment) {
      // Exemplo: Analytics.track('performance_metric', metric);
    }
  }, [isDevelopment, log]);

  // Monitorar Web Vitals
  useEffect(() => {
    // First Contentful Paint (FCP)
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          reportMetric('FCP', Math.round(entry.startTime));
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      // Fallback para navegadores que não suportam
      log('Performance Observer não suportado');
    }

    return () => observer.disconnect();
  }, [reportMetric, log]);

  // Monitorar Largest Contentful Paint (LCP)
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      reportMetric('LCP', Math.round(lastEntry.startTime));
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      log('LCP Observer não suportado');
    }

    return () => observer.disconnect();
  }, [reportMetric, log]);

  // Monitorar Cumulative Layout Shift (CLS)
  useEffect(() => {
    let clsValue = 0;
    let clsEntries = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      }
      reportMetric('CLS', Math.round(clsValue * 1000) / 1000, '');
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      log('CLS Observer não suportado');
    }

    return () => observer.disconnect();
  }, [reportMetric, log]);

  // Monitorar tempo de carregamento de recursos
  const measureResourceTiming = useCallback((resourceName) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      reportMetric(`Resource_${resourceName}`, Math.round(duration));
    };
  }, [reportMetric]);

  // Monitorar tempo de componentes
  const measureComponentRender = useCallback((componentName) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      reportMetric(`Component_${componentName}_Render`, Math.round(duration));
    };
  }, [reportMetric]);

  // Função para marcar eventos customizados
  const markEvent = useCallback((eventName, data = {}) => {
    performance.mark(eventName);
    reportMetric(`Event_${eventName}`, performance.now());
    
    if (isDevelopment) {
      log(`🎯 Event Marked: ${eventName}`, data);
    }
  }, [reportMetric, isDevelopment, log]);

  // Obter todas as métricas coletadas
  const getMetrics = useCallback(() => {
    return { ...metricsRef.current };
  }, []);

  return {
    reportMetric,
    measureResourceTiming,
    measureComponentRender,
    markEvent,
    getMetrics,
  };
};

export default usePerformanceMonitoring;
