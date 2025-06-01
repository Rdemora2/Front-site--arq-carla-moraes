import { useState, useEffect, useCallback, useMemo, useRef } from "react";

export const useIntersectionObserver = (options = {}) => {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;

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
export const useLazyImage = (src, options = {}) => {
  const { placeholder = "", threshold = 0.1, fallback = "" } = options;

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
      console.error("Erro ao carregar componente:", err);
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

export const useThrottle = (callback, delay) => {
  const lastCall = useRef(0);

  return useCallback(
    (...args) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  );
};

export const useCache = (key, fetcher, ttl = 300000) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCacheKey = (key) => `cache_${key}`;
  const getTimestampKey = (key) => `cache_timestamp_${key}`;

  const isExpired = (timestamp, ttl) => {
    return Date.now() - timestamp > ttl;
  };

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      const cacheKey = getCacheKey(key);
      const timestampKey = getTimestampKey(key);

      if (!forceRefresh) {
        const cachedData = localStorage.getItem(cacheKey);
        const timestamp = localStorage.getItem(timestampKey);

        if (cachedData && timestamp && !isExpired(parseInt(timestamp), ttl)) {
          try {
            setData(JSON.parse(cachedData));
            return;
          } catch (e) {}
        }
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await fetcher();
        setData(result);

        localStorage.setItem(cacheKey, JSON.stringify(result));
        localStorage.setItem(timestampKey, Date.now().toString());
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [key, fetcher, ttl]
  );

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

export const useAdvancedMemo = (factory, deps, options = {}) => {
  const {
    compare = (a, b) => JSON.stringify(a) === JSON.stringify(b),
    maxSize = 10,
  } = options;

  const cache = useRef(new Map());
  const cacheOrder = useRef([]);

  return useMemo(() => {
    const cacheKey = JSON.stringify(deps);

    if (cache.current.has(cacheKey)) {
      const index = cacheOrder.current.indexOf(cacheKey);
      if (index > -1) {
        cacheOrder.current.splice(index, 1);
        cacheOrder.current.push(cacheKey);
      }
      return cache.current.get(cacheKey);
    }

    const value = factory();

    cache.current.set(cacheKey, value);
    cacheOrder.current.push(cacheKey);

    while (cacheOrder.current.length > maxSize) {
      const oldestKey = cacheOrder.current.shift();
      cache.current.delete(oldestKey);
    }

    return value;
  }, deps);
};

export const useResourceHints = () => {
  const preloadResource = useCallback((href, as, type = null) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    if (type) link.type = type;

    const existing = document.querySelector(
      `link[rel="preload"][href="${href}"]`
    );
    if (!existing) {
      document.head.appendChild(link);
    }
  }, []);

  const prefetchResource = useCallback((href) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;

    const existing = document.querySelector(
      `link[rel="prefetch"][href="${href}"]`
    );
    if (!existing) {
      document.head.appendChild(link);
    }
  }, []);

  const preconnectOrigin = useCallback((origin, crossorigin = false) => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = origin;
    if (crossorigin) link.crossOrigin = "anonymous";

    const existing = document.querySelector(
      `link[rel="preconnect"][href="${origin}"]`
    );
    if (!existing) {
      document.head.appendChild(link);
    }
  }, []);

  const dnsPrefetch = useCallback((origin) => {
    const link = document.createElement("link");
    link.rel = "dns-prefetch";
    link.href = origin;

    const existing = document.querySelector(
      `link[rel="dns-prefetch"][href="${origin}"]`
    );
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
  }, 16);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    scrollElementRef,
    handleScroll,
  };
};

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
        connection:
          navigator.connection ||
          navigator.mozConnection ||
          navigator.webkitConnection,
        memory: navigator.deviceMemory,
        cores: navigator.hardwareConcurrency,
        touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
          .matches,
      });
    };

    updateCapabilities();

    if (navigator.connection) {
      navigator.connection.addEventListener("change", updateCapabilities);
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", updateCapabilities);

    return () => {
      if (navigator.connection) {
        navigator.connection.removeEventListener("change", updateCapabilities);
      }
      mediaQuery.removeEventListener("change", updateCapabilities);
    };
  }, []);

  const isLowEnd = useMemo(() => {
    const { connection, memory, cores } = capabilities;

    return (
      (memory && memory < 4) ||
      (cores && cores < 4) ||
      (connection && ["slow-2g", "2g"].includes(connection.effectiveType))
    );
  }, [capabilities]);

  return {
    ...capabilities,
    isLowEnd,
  };
};

export const useMemoryCache = (maxSize = 50) => {
  const cache = useRef(new Map());
  const accessOrder = useRef([]);

  const set = useCallback(
    (key, value) => {
      const stringKey = JSON.stringify(key);

      const existingIndex = accessOrder.current.indexOf(stringKey);
      if (existingIndex > -1) {
        accessOrder.current.splice(existingIndex, 1);
      }

      accessOrder.current.push(stringKey);
      cache.current.set(stringKey, value);

      while (cache.current.size > maxSize) {
        const oldestKey = accessOrder.current.shift();
        cache.current.delete(oldestKey);
      }
    },
    [maxSize]
  );

  const get = useCallback((key) => {
    const stringKey = JSON.stringify(key);
    const value = cache.current.get(stringKey);

    if (value !== undefined) {
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

export const usePerformanceOptimizations = (options = {}) => {
  const {
    enableVirtualization = false,
    enableResourceHints = true,
    enableCache = true,
    adaptToDevice = true,
  } = options;

  const resourceHints = useResourceHints();
  const deviceCapabilities = useDeviceCapabilities();

  const adaptiveOptions = useMemo(() => {
    if (!adaptToDevice) return options;

    const { isLowEnd, reducedMotion } = deviceCapabilities;

    return {
      ...options,
      enableAnimations: !reducedMotion && !isLowEnd,
      enableHeavyFeatures: !isLowEnd,
      cacheSize: isLowEnd ? 5 : 20,
      imageQuality: isLowEnd ? "low" : "high",
    };
  }, [options, adaptToDevice, deviceCapabilities]);

  useEffect(() => {
    if (!enableResourceHints) return;

    resourceHints.preconnectOrigin("https://fonts.googleapis.com");
    resourceHints.preconnectOrigin("https://fonts.gstatic.com", true);

    resourceHints.dnsPrefetch("https://www.google-analytics.com");
    resourceHints.dnsPrefetch("https://connect.facebook.net");
  }, [enableResourceHints, resourceHints]);
  const memoryCache = useMemoryCache();

  const useLazyLoading = (rootMargin = "200px 0px", threshold = 0.1) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
      if (typeof window === "undefined" || !window.IntersectionObserver) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin, threshold }
      );

      const currentRef = ref.current;
      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, [rootMargin, threshold]);

    return { ref, isVisible };
  };

  const preloadCriticalImages = useCallback((imagePaths = []) => {
    if (!imagePaths || !imagePaths.length) return;

    const loadImage = (path) => {
      if (!path) return;

      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = path;
      document.head.appendChild(link);

      const img = new Image();
      img.src = path;
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        imagePaths.forEach(loadImage);
      });
    } else {
      setTimeout(() => {
        imagePaths.forEach(loadImage);
      }, 200);
    }
  }, []);

  const optimizeImage = useCallback((src, options = {}) => {
    if (!src) return "";

    const { width, quality = 80, format = "webp" } = options;

    if (process.env.NODE_ENV === "production" && src.startsWith("/")) {
      const params = [];

      if (width) params.push(`w=${width}`);
      if (quality) params.push(`q=${quality}`);
      if (format) params.push(`fmt=${format}`);

      if (params.length > 0) {
        return `${src}?${params.join("&")}`;
      }
    }

    return src;
  }, []);

  return {
    deviceCapabilities,
    adaptiveOptions,
    resourceHints,
    isLowEndDevice: deviceCapabilities.isLowEnd,
    useMemoryCache: () => memoryCache,
    useLazyLoading,
    preloadCriticalImages,
    optimizeImage,
  };
};

export default usePerformanceOptimizations;
