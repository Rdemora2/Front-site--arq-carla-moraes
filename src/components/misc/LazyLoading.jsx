import React, { Suspense, lazy } from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import tw from "twin.macro";

// Animação para o skeleton loading
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

// Skeleton loader para componentes
const SkeletonLoader = styled.div`
  ${tw`rounded-lg`}
  width: ${props => props.width || "100%"};
  height: ${props => props.height || "200px"};
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

// Componente de loading específico para diferentes tipos de conteúdo
const LoadingFallback = ({ type = "default", className }) => {
  const renderSkeleton = () => {
    switch (type) {
      case "hero":
        return (
          <div className={`space-y-6 p-8 ${className || ""}`}>
            <SkeletonLoader height="60px" width="70%" />
            <SkeletonLoader height="100px" />
            <SkeletonLoader height="40px" width="200px" />
          </div>
        );
        
      case "card":
        return (
          <div className={`space-y-4 p-4 ${className || ""}`}>
            <SkeletonLoader height="200px" />
            <SkeletonLoader height="24px" width="80%" />
            <SkeletonLoader height="16px" />
            <SkeletonLoader height="16px" width="60%" />
          </div>
        );
        
      case "form":
        return (
          <div className={`space-y-4 p-6 ${className || ""}`}>
            <SkeletonLoader height="40px" />
            <SkeletonLoader height="40px" />
            <SkeletonLoader height="120px" />
            <SkeletonLoader height="48px" width="150px" />
          </div>
        );
        
      case "list":
        return (
          <div className={`space-y-3 ${className || ""}`}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4 p-3">
                <SkeletonLoader height="60px" width="60px" />
                <div className="flex-1 space-y-2">
                  <SkeletonLoader height="20px" width="70%" />
                  <SkeletonLoader height="16px" />
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return (
          <div className={`space-y-4 p-6 ${className || ""}`}>
            <SkeletonLoader height="40px" width="60%" />
            <SkeletonLoader height="20px" />
            <SkeletonLoader height="20px" width="80%" />
            <SkeletonLoader height="20px" width="90%" />
          </div>
        );
    }
  };

  return (
    <div 
      className="animate-pulse"
      role="status" 
      aria-label="Carregando conteúdo..."
    >
      {renderSkeleton()}
    </div>
  );
};

LoadingFallback.propTypes = {
  type: PropTypes.oneOf(["default", "hero", "card", "form", "list"]),
  className: PropTypes.string,
};

// Higher-order component para lazy loading
export const withLazyLoading = (importFunc, fallbackType = "default") => {
  const LazyComponent = lazy(importFunc);
  
  const WrappedComponent = (props) => (
    <Suspense fallback={<LoadingFallback type={fallbackType} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
  
  WrappedComponent.displayName = `LazyLoaded(${LazyComponent.displayName || LazyComponent.name || "Component"})`;
  
  return WrappedComponent;
};

// Função para criar lazy components com loading personalizado
export const createLazyComponent = (importFunc, options = {}) => {
  const {
    fallbackType = "default",
    fallbackComponent: CustomFallback,
    errorBoundary = true,
    retryCount = 3,
  } = options;

  const LazyComponent = lazy(() => {
    let attempts = 0;
    
    const loadComponent = () => {
      attempts++;
      return importFunc().catch((error) => {
        if (attempts < retryCount) {
          console.warn(`Tentativa ${attempts} falhou, tentando novamente...`);
          return new Promise((resolve) => {
            setTimeout(() => resolve(loadComponent()), 1000 * attempts);
          });
        }
        throw error;
      });
    };
    
    return loadComponent();
  });

  const WrappedComponent = (props) => {
    const fallback = CustomFallback 
      ? <CustomFallback />
      : <LoadingFallback type={fallbackType} />;

    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };

  WrappedComponent.displayName = `LazyComponent(${LazyComponent.displayName || "Component"})`;
  
  return WrappedComponent;
};

// Preloader para componentes críticos
export class ComponentPreloader {
  static preloadedComponents = new Set();

  static preload(importFunc, componentName) {
    if (this.preloadedComponents.has(componentName)) {
      return;
    }

    this.preloadedComponents.add(componentName);
    
    // Preload durante idle time
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => {
        importFunc().catch(() => {
          // Falha silenciosa no preload
        });
      });
    } else {
      // Fallback para browsers sem requestIdleCallback
      setTimeout(() => {
        importFunc().catch(() => {
          // Falha silenciosa no preload
        });
      }, 100);
    }
  }

  static preloadRoute(routeImports) {
    Object.entries(routeImports).forEach(([name, importFunc]) => {
      this.preload(importFunc, name);
    });
  }
}

// Hook para lazy loading com estado
export const useLazyLoading = (shouldLoad = true) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (shouldLoad && !isLoaded) {
      setIsLoaded(true);
    }
  }, [shouldLoad, isLoaded]);

  const loadComponent = React.useCallback((importFunc) => {
    return importFunc()
      .then((module) => {
        setError(null);
        return module;
      })
      .catch((err) => {
        setError(err);
        throw err;
      });
  }, []);

  return { isLoaded, error, loadComponent };
};

export default LoadingFallback;
