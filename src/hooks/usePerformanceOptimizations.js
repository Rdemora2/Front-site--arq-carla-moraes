import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

/**
 * Hook para observar elementos entrando na viewport
 * Útil para lazy loading e animações
 */
export const useIntersectionObserver = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasIntersected]);

  return {
    targetRef,
    isIntersecting,
    hasIntersected,
  };
};

/**
 * Hook para lazy loading de imagens
 */
export const useLazyImage = (src, options = {}) => {
  const {
    placeholder = '',
    threshold = 0.1,
    fallback = '',
  } = options;

  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { targetRef, hasIntersected } = useIntersectionObserver({ threshold });

  useEffect(() => {
    if (!hasIntersected || !src) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setHasError(false);
    };

    img.onerror = () => {
      setImageSrc(fallback || placeholder);
      setHasError(true);
      setIsLoaded(true);
    };

    img.src = src;
  }, [hasIntersected, src, placeholder, fallback]);

  return {
    targetRef,
    imageSrc,
    isLoaded,
    hasError,
    hasIntersected,
  };
};

/**
 * Hook para lazy loading de componentes
 */
export const useLazyComponent = (importFunc, fallback = null) => {
  const [Component, setComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadComponent = useCallback(async () => {
    if (Component || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const module = await importFunc();
      setComponent(() => module.default || module);
    } catch (err) {
      setError(err);
      console.error('Erro ao carregar componente:', err);
    } finally {
      setIsLoading(false);
    }
  }, [importFunc, Component, isLoading]);

  return {
    Component,
    isLoading,
    error,
    loadComponent,
    fallback,
  };
};

/**
 * Hook para debounce de valores
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook para throttle de funções
 */
export const useThrottle = (callback, delay) => {
  const lastCall = useRef(0);

  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  }, [callback, delay]);
};

/**
 * Hook para cache com expiração
 */
export const useCache = (key, fetcher, ttl = 300000) => { // 5 minutos default
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCacheKey = (key) => `cache_${key}`;
  const getTimestampKey = (key) => `cache_timestamp_${key}`;

  const isExpired = (timestamp, ttl) => {
    return Date.now() - timestamp > ttl;
  };

  const fetchData = useCallback(async (forceRefresh = false) => {
    const cacheKey = getCacheKey(key);
    const timestampKey = getTimestampKey(key);
    
    // Verificar cache primeiro
    if (!forceRefresh) {
      const cachedData = localStorage.getItem(cacheKey);
      const timestamp = localStorage.getItem(timestampKey);
      
      if (cachedData && timestamp && !isExpired(parseInt(timestamp), ttl)) {
        try {
          setData(JSON.parse(cachedData));
          return;
        } catch (e) {
          // Cache inválido, continuar com fetch
        }
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      
      // Salvar no cache
      localStorage.setItem(cacheKey, JSON.stringify(result));
      localStorage.setItem(timestampKey, Date.now().toString());
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, ttl]);

  const invalidateCache = useCallback(() => {
    localStorage.removeItem(getCacheKey(key));
    localStorage.removeItem(getTimestampKey(key));
  }, [key]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: () => fetchData(true),
    invalidateCache,
  };
};

/**
 * Hook para memoização avançada
 */
export const useAdvancedMemo = (factory, deps, options = {}) => {
  const {
    compare = (a, b) => JSON.stringify(a) === JSON.stringify(b),
    maxSize = 10,
  } = options;

  const cache = useRef(new Map());
  const cacheOrder = useRef([]);

  return useMemo(() => {
    // Criar chave do cache baseada nas dependências
    const cacheKey = JSON.stringify(deps);
    
    // Verificar se existe no cache
    if (cache.current.has(cacheKey)) {
      // Mover para o final (LRU)
      const index = cacheOrder.current.indexOf(cacheKey);
      if (index > -1) {
        cacheOrder.current.splice(index, 1);
        cacheOrder.current.push(cacheKey);
      }
      return cache.current.get(cacheKey);
    }

    // Calcular novo valor
    const value = factory();
    
    // Adicionar ao cache
    cache.current.set(cacheKey, value);
    cacheOrder.current.push(cacheKey);
    
    // Remover itens antigos se exceder o tamanho máximo
    while (cacheOrder.current.length > maxSize) {
      const oldestKey = cacheOrder.current.shift();
      cache.current.delete(oldestKey);
    }
    
    return value;
  }, deps);
};

/**
 * Hook para resource hints (preload, prefetch, etc.)
 */
export const useResourceHints = () => {
  const preloadResource = useCallback((href, as, type = null) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    
    // Evitar duplicatas
    const existing = document.querySelector(`link[rel="preload"][href="${href}"]`);
    if (!existing) {
      document.head.appendChild(link);
    }
  }, []);

  const prefetchResource = useCallback((href) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    
    // Evitar duplicatas
    const existing = document.querySelector(`link[rel="prefetch"][href="${href}"]`);
    if (!existing) {
      document.head.appendChild(link);
    }
  }, []);

  const preconnectOrigin = useCallback((origin, crossorigin = false) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    if (crossorigin) link.crossOrigin = 'anonymous';
    
    // Evitar duplicatas
    const existing = document.querySelector(`link[rel="preconnect"][href="${origin}"]`);
    if (!existing) {
      document.head.appendChild(link);
    }
  }, []);

  const dnsPrefetch = useCallback((origin) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = origin;
    
    // Evitar duplicatas
    const existing = document.querySelector(`link[rel="dns-prefetch"][href="${origin}"]`);
    if (!existing) {
      document.head.appendChild(link);
    }
  }, []);

  return {
    preloadResource,
    prefetchResource,
    preconnectOrigin,
    dnsPrefetch,
  };
};

/**
 * Hook para otimizar renderização de listas grandes
 */
export const useVirtualList = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef(null);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length - 1
  );

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      ...item,
      index: startIndex + index,
    }));
  }, [items, startIndex, endIndex]);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useThrottle((e) => {
    setScrollTop(e.target.scrollTop);
  }, 16); // ~60fps

  return {
    visibleItems,
    totalHeight,
    offsetY,
    scrollElementRef,
    handleScroll,
  };
};

/**
 * Hook para detectar capabilities do dispositivo
 */
export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    connection: null,
    memory: null,
    cores: null,
    touchSupport: false,
    reducedMotion: false,
  });

  useEffect(() => {
    const updateCapabilities = () => {
      setCapabilities({
        connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection,
        memory: navigator.deviceMemory,
        cores: navigator.hardwareConcurrency,
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      });
    };

    updateCapabilities();

    // Observar mudanças na conexão
    if (navigator.connection) {
      navigator.connection.addEventListener('change', updateCapabilities);
    }

    // Observar mudanças no prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', updateCapabilities);

    return () => {
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', updateCapabilities);
      }
      mediaQuery.removeEventListener('change', updateCapabilities);
    };
  }, []);

  const isLowEnd = useMemo(() => {
    const { connection, memory, cores } = capabilities;
    
    // Considerar dispositivo low-end se:
    // - Memória < 4GB
    // - Cores < 4
    // - Conexão slow-2g ou 2g
    return (
      (memory && memory < 4) ||
      (cores && cores < 4) ||
      (connection && ['slow-2g', '2g'].includes(connection.effectiveType))
    );
  }, [capabilities]);

  return {
    ...capabilities,
    isLowEnd,
  };
};

/**
 * Hook para cache em memória
 */
export const useMemoryCache = (maxSize = 50) => {
  const cache = useRef(new Map());
  const accessOrder = useRef([]);

  const set = useCallback((key, value) => {
    const stringKey = JSON.stringify(key);
    
    // Remove da lista de acesso se já existe
    const existingIndex = accessOrder.current.indexOf(stringKey);
    if (existingIndex > -1) {
      accessOrder.current.splice(existingIndex, 1);
    }

    // Adiciona no final (mais recente)
    accessOrder.current.push(stringKey);
    cache.current.set(stringKey, value);

    // Remove itens antigos se exceder o limite
    while (cache.current.size > maxSize) {
      const oldestKey = accessOrder.current.shift();
      cache.current.delete(oldestKey);
    }
  }, [maxSize]);

  const get = useCallback((key) => {
    const stringKey = JSON.stringify(key);
    const value = cache.current.get(stringKey);
    
    if (value !== undefined) {
      // Move para o final (mais recente)
      const existingIndex = accessOrder.current.indexOf(stringKey);
      if (existingIndex > -1) {
        accessOrder.current.splice(existingIndex, 1);
        accessOrder.current.push(stringKey);
      }
    }
    
    return value;
  }, []);

  const has = useCallback((key) => {
    const stringKey = JSON.stringify(key);
    return cache.current.has(stringKey);
  }, []);

  const clear = useCallback(() => {
    cache.current.clear();
    accessOrder.current = [];
  }, []);

  const remove = useCallback((key) => {
    const stringKey = JSON.stringify(key);
    const existingIndex = accessOrder.current.indexOf(stringKey);
    if (existingIndex > -1) {
      accessOrder.current.splice(existingIndex, 1);
    }
    return cache.current.delete(stringKey);
  }, []);

  const size = cache.current.size;

  return {
    set,
    get,
    has,
    clear,
    remove,
    size,
  };
};

/**
 * Hook principal para performance
 */
export const usePerformanceOptimizations = (options = {}) => {
  const {
    enableVirtualization = false,
    enableResourceHints = true,
    enableCache = true,
    adaptToDevice = true,
  } = options;

  const resourceHints = useResourceHints();
  const deviceCapabilities = useDeviceCapabilities();

  // Adaptar configurações baseado no dispositivo
  const adaptiveOptions = useMemo(() => {
    if (!adaptToDevice) return options;

    const { isLowEnd, reducedMotion } = deviceCapabilities;
    
    return {
      ...options,
      enableAnimations: !reducedMotion && !isLowEnd,
      enableHeavyFeatures: !isLowEnd,
      cacheSize: isLowEnd ? 5 : 20,
      imageQuality: isLowEnd ? 'low' : 'high',
    };
  }, [options, adaptToDevice, deviceCapabilities]);

  // Precarregar recursos críticos
  useEffect(() => {
    if (!enableResourceHints) return;

    // Preconnect para fontes
    resourceHints.preconnectOrigin('https://fonts.googleapis.com');
    resourceHints.preconnectOrigin('https://fonts.gstatic.com', true);

    // Prefetch para recursos comuns
    resourceHints.dnsPrefetch('https://www.google-analytics.com');
    resourceHints.dnsPrefetch('https://connect.facebook.net');
  }, [enableResourceHints, resourceHints]);
  const memoryCache = useMemoryCache();

  return {
    deviceCapabilities,
    adaptiveOptions,
    resourceHints,
    isLowEndDevice: deviceCapabilities.isLowEnd,
    useMemoryCache: () => memoryCache,
  };
};

export default usePerformanceOptimizations;
