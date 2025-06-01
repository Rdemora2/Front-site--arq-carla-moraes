import React, {
  lazy,
  Suspense,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  forwardRef,
} from "react";
import { useInView } from "react-intersection-observer";
import styled, { keyframes } from "styled-components";
import { useLogger } from "../../utils/logger";

// Cache global para componentes carregados
const componentCache = new Map();
const imageCache = new Set();

// Animação de loading
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const LoadingPlaceholder = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.875rem;
  min-height: 100px;
  width: 100%;
`;

const ErrorBoundary = styled.div`
  padding: 20px;
  border: 2px dashed #ff6b6b;
  border-radius: 8px;
  background: #fff5f5;
  color: #c53030;
  text-align: center;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  button {
    margin-top: 10px;
    padding: 8px 16px;
    background: #c53030;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;

    &:hover {
      background: #9c2828;
    }
  }
`;

// Hook para lazy loading de componentes
export const useLazyComponent = (importFn, options = {}) => {
  const [loadingState, setLoadingState] = useState("idle");
  const [error, setError] = useState(null);
  const retryCountRef = useRef(0);
  const maxRetries = options.maxRetries || 3;
  const retryDelay = options.retryDelay || 1000;
  const { logger } = useLogger();

  const LazyComponent = useMemo(() => {
    const cacheKey = importFn.toString();

    if (componentCache.has(cacheKey)) {
      return componentCache.get(cacheKey);
    }
    const Component = lazy(async () => {
      setLoadingState("loading");
      const startTime = performance.now();

      try {
        const module = await importFn();
        const loadTime = performance.now() - startTime;
        // Component loaded successfully
        logger.info("Component loaded successfully", {
          loadTime,
          component: cacheKey.slice(0, 50),
          retryCount: retryCountRef.current,
        });

        setLoadingState("loaded");
        return module;
      } catch (error) {
        // Component loading failed
        logger.error("Component loading failed", {
          error: error.message,
          component: cacheKey.slice(0, 50),
          retryCount: retryCountRef.current,
        });

        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          setLoadingState("retrying");

          // Delay antes do retry
          await new Promise((resolve) =>
            setTimeout(resolve, retryDelay * retryCountRef.current)
          );

          // Recursively retry
          return useLazyComponent(importFn, options).LazyComponent;
        }

        setLoadingState("error");
        setError(error);
        throw error;
      }
    });
    componentCache.set(cacheKey, Component);
    return Component;
  }, [importFn, maxRetries, retryDelay]);

  const retry = useCallback(() => {
    setError(null);
    setLoadingState("idle");
    retryCountRef.current = 0;
    // Clear from cache to force reload
    const cacheKey = importFn.toString();
    componentCache.delete(cacheKey);
  }, [importFn]);

  return {
    LazyComponent,
    loadingState,
    error,
    retry,
  };
};

// Componente wrapper para lazy loading com Suspense
export const LazyComponentWrapper = ({
  importFn,
  fallback,
  errorFallback,
  onLoad,
  onError,
  ...props
}) => {
  const { LazyComponent, loadingState, error, retry } =
    useLazyComponent(importFn);
  const { logger } = useLogger();

  useEffect(() => {
    if (loadingState === "loaded" && onLoad) {
      onLoad();
    }
    if (loadingState === "error" && onError) {
      onError(error);
    }
  }, [loadingState, error, onLoad, onError]);

  const defaultFallback = (
    <LoadingPlaceholder>
      {loadingState === "loading" && "Carregando componente..."}
      {loadingState === "retrying" && "Tentando novamente..."}
      {loadingState === "idle" && "Preparando..."}
    </LoadingPlaceholder>
  );

  const defaultErrorFallback = (
    <ErrorBoundary>
      <div>❌ Erro ao carregar componente</div>
      <div style={{ fontSize: "0.75rem", marginTop: "5px", opacity: 0.8 }}>
        {error?.message || "Erro desconhecido"}
      </div>
      <button onClick={retry}>Tentar Novamente</button>
    </ErrorBoundary>
  );

  if (error) {
    return errorFallback || defaultErrorFallback;
  }

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Hook para lazy loading de imagens
export const useLazyImage = (src, options = {}) => {
  const [imageState, setImageState] = useState("idle");
  const [imageSrc, setImageSrc] = useState(options.placeholder || "");
  const [error, setError] = useState(null);
  const { logger } = useLogger();

  const {
    threshold = 0.1,
    rootMargin = "50px",
    preload = false,
    retryCount = 3,
  } = options;

  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  const shouldLoad = preload || inView;

  useEffect(() => {
    if (!shouldLoad || !src || imageCache.has(src)) {
      if (imageCache.has(src)) {
        setImageSrc(src);
        setImageState("loaded");
      }
      return;
    }

    let attempts = 0;

    const loadImage = () => {
      setImageState("loading");

      const img = new Image();

      img.onload = () => {
        setImageSrc(src);
        setImageState("loaded");
        imageCache.add(src);

        logger.info("Image loaded successfully", {
          src: src.slice(-50), // Log apenas os últimos 50 chars
          attempts: attempts + 1,
          cached: false,
        });
      };

      img.onerror = () => {
        attempts++;

        if (attempts < retryCount) {
          logger.warn("Image loading failed, retrying", {
            src: src.slice(-50),
            attempt: attempts,
            maxRetries: retryCount,
          });

          // Retry com backoff exponencial
          setTimeout(loadImage, Math.pow(2, attempts) * 1000);
        } else {
          setError(new Error("Failed to load image"));
          setImageState("error");

          logger.error("Image loading failed permanently", {
            src: src.slice(-50),
            totalAttempts: attempts,
          });
        }
      };

      img.src = src;
    };

    loadImage();
  }, [shouldLoad, src, retryCount, logger]);

  return {
    ref,
    src: imageSrc,
    imageState,
    error,
    isInView: inView,
  };
};

// Componente para lazy loading de imagens
const LazyImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  background: #f5f5f5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease;

    &.loading {
      opacity: 0.5;
    }

    &.loaded {
      opacity: 1;
    }

    &.error {
      opacity: 0.3;
    }
  }
`;

const PlaceholderDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.75rem;
`;

export const LazyImage = forwardRef(
  (
    { src, alt, placeholder, className, style, onLoad, onError, ...imageProps },
    forwardedRef
  ) => {
    const isLazyLoadingEnabled = true; // Sempre habilitado

    const {
      ref: inViewRef,
      src: imageSrc,
      imageState,
      error,
    } = useLazyImage(src, {
      placeholder,
      preload: !isLazyLoadingEnabled,
    });

    // Combine refs
    const combinedRef = useCallback(
      (node) => {
        inViewRef(node);
        if (forwardedRef) {
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else {
            forwardedRef.current = node;
          }
        }
      },
      [inViewRef, forwardedRef]
    );

    useEffect(() => {
      if (imageState === "loaded" && onLoad) {
        onLoad();
      }
      if (imageState === "error" && onError) {
        onError(error);
      }
    }, [imageState, error, onLoad, onError]);

    return (
      <LazyImageContainer ref={combinedRef} className={className} style={style}>
        {imageState === "loading" && (
          <PlaceholderDiv>Carregando...</PlaceholderDiv>
        )}

        {imageState === "error" && (
          <PlaceholderDiv style={{ background: "#ffebee", color: "#c62828" }}>
            ❌ Erro ao carregar
          </PlaceholderDiv>
        )}

        {imageSrc && (
          <img
            src={imageSrc}
            alt={alt}
            className={imageState}
            style={{ display: imageState === "loaded" ? "block" : "none" }}
            {...imageProps}
          />
        )}
      </LazyImageContainer>
    );
  }
);

LazyImage.displayName = "LazyImage";

// HOC para lazy loading de componentes
export const withLazyLoading = (importFn, options = {}) => {
  return (props) => (
    <LazyComponentWrapper importFn={importFn} {...options} {...props} />
  );
};

// Hook para preloading de recursos
export const usePreloader = () => {
  const { logger } = useLogger();

  const preloadComponent = useCallback(
    async (importFn) => {
      const cacheKey = importFn.toString();

      if (componentCache.has(cacheKey)) {
        return; // Já está em cache
      }

      try {
        const startTime = performance.now();
        await importFn();
        const loadTime = performance.now() - startTime;

        logger.info("Component preloaded successfully", {
          loadTime,
          component: cacheKey.slice(0, 50),
        });
      } catch (error) {
        logger.warn("Component preloading failed", {
          error: error.message,
          component: cacheKey.slice(0, 50),
        });
      }
    },
    [logger]
  );

  const preloadImage = useCallback(
    (src) => {
      if (imageCache.has(src)) {
        return Promise.resolve(); // Já está em cache
      }

      return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
          imageCache.add(src);
          logger.info("Image preloaded successfully", {
            src: src.slice(-50),
          });
          resolve();
        };

        img.onerror = () => {
          logger.warn("Image preloading failed", {
            src: src.slice(-50),
          });
          reject(new Error("Failed to preload image"));
        };

        img.src = src;
      });
    },
    [logger]
  );

  const preloadResources = useCallback(
    async (resources) => {
      const promises = resources.map((resource) => {
        if (typeof resource === "function") {
          return preloadComponent(resource);
        } else if (typeof resource === "string") {
          return preloadImage(resource);
        }
        return Promise.resolve();
      });

      try {
        await Promise.allSettled(promises);
        logger.info("Resource preloading completed", {
          resourceCount: resources.length,
        });
      } catch (error) {
        logger.warn("Some resources failed to preload", {
          error: error.message,
        });
      }
    },
    [preloadComponent, preloadImage, logger]
  );

  return {
    preloadComponent,
    preloadImage,
    preloadResources,
  };
};

// Componente para preloading automático baseado em scroll
export const ScrollBasedPreloader = ({
  resources,
  triggerOffset = 1000,
  children,
}) => {
  const { preloadResources } = usePreloader();
  const [hasPreloaded, setHasPreloaded] = useState(false);

  const { ref } = useInView({
    rootMargin: `${triggerOffset}px`,
    triggerOnce: true,
    onChange: (inView) => {
      if (inView && !hasPreloaded) {
        preloadResources(resources);
        setHasPreloaded(true);
      }
    },
  });

  return <div ref={ref}>{children}</div>;
};

// Utility para limpeza de cache
export const clearLazyLoadingCache = () => {
  componentCache.clear();
  imageCache.clear();
  console.log("Lazy loading cache cleared");
};

// Utility para obter estatísticas de cache
export const getLazyLoadingStats = () => {
  return {
    componentsInCache: componentCache.size,
    imagesInCache: imageCache.size,
    totalCacheSize: componentCache.size + imageCache.size,
  };
};
