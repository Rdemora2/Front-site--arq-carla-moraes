import React, { useState, useRef, useEffect, memo, useCallback } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import tw from "twin.macro";

// Container da imagem com lazy loading
const ImageContainer = styled.div`
  ${tw`relative overflow-hidden`}
  ${props => props.aspectRatio && `aspect-ratio: ${props.aspectRatio};`}
`;

// Imagem com transições suaves
const StyledImage = styled.img`
  ${tw`w-full h-full object-cover transition-all duration-300`}
  opacity: ${props => props.loaded ? 1 : 0};
  transform: ${props => props.loaded ? 'scale(1)' : 'scale(1.05)'};
  filter: ${props => {
    if (!props.loaded) return 'blur(5px)';
    if (props.isLowQuality) return 'blur(1px)';
    return 'none';
  }};
`;

// Placeholder com gradiente
const Placeholder = styled.div`
  ${tw`absolute inset-0 flex items-center justify-center`}
  background: ${props => props.bgGradient || 'linear-gradient(45deg, #f0f0f0, #e0e0e0)'};
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

// Spinner de loading
const LoadingSpinner = styled.div`
  ${tw`w-8 h-8 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin`}
`;

// Error placeholder
const ErrorPlaceholder = styled.div`
  ${tw`absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400`}
`;

/**
 * Componente de imagem otimizada com lazy loading, fallbacks e Progressive Enhancement
 */
const OptimizedImage = memo(({
  src,
  alt,
  width,
  height,
  aspectRatio,
  className,
  fallbackSrc,
  placeholder = true,
  lazyLoad = true,
  quality = "high",
  format = "auto",
  sizes,
  srcSet,
  loading = "lazy",
  critical = false,
  onLoad,
  onError,
  blurDataURL,
  priority = false,
  ...props
}) => {
  const [loaded, setLoaded] = useState(!lazyLoad || critical);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(critical ? src : null);
  const [isLowQuality, setIsLowQuality] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Gerar srcSet automático baseado na imagem original
  const generateSrcSet = useCallback((originalSrc) => {
    if (srcSet) return srcSet;
    
    const extensions = ['webp', 'jpg', 'png'];
    const sizes = [320, 640, 960, 1280, 1920];
    
    return sizes.map(size => {
      const ext = extensions.find(e => originalSrc.includes(e)) || 'jpg';
      const baseName = originalSrc.replace(/\.[^/.]+$/, "");
      return `${baseName}-${size}w.${ext} ${size}w`;
    }).join(', ');
  }, [srcSet]);

  // Otimizar URL da imagem baseado no formato e qualidade
  const optimizeImageUrl = useCallback((url, opts = {}) => {
    if (!url || url.startsWith('data:')) return url;
    
    const {
      width: w,
      height: h,
      quality: q = quality === 'low' ? 50 : quality === 'medium' ? 75 : 90,
      format: f = format,
    } = opts;

    // Para Vercel/Next.js Image Optimization (se disponível)
    if (url.startsWith('/') && process.env.NODE_ENV === 'production') {
      const params = new URLSearchParams();
      if (w) params.set('w', w);
      if (h) params.set('h', h);
      if (q !== 90) params.set('q', q);
      if (f !== 'auto') params.set('f', f);
      
      return `/_next/image?url=${encodeURIComponent(url)}&${params.toString()}`;
    }
    
    return url;
  }, [quality, format]);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (!lazyLoad || loaded || critical) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSrc(src);
            setLoaded(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
      observerRef.current = observer;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, lazyLoad, loaded, critical]);

  // Handler para carregamento da imagem
  const handleLoad = useCallback((e) => {
    setLoaded(true);
    setError(false);
    setIsLowQuality(false);
    onLoad?.(e);
  }, [onLoad]);

  // Handler para erro na imagem
  const handleError = useCallback((e) => {
    setError(true);
    
    // Tentar fallback
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setError(false);
      return;
    }

    onError?.(e);
  }, [fallbackSrc, currentSrc, onError]);

  // Progressive loading: carregar versão low-quality primeiro
  useEffect(() => {
    if (!currentSrc || critical) return;

    const lowQualitySrc = optimizeImageUrl(currentSrc, { quality: 20 });
    if (lowQualitySrc !== currentSrc) {
      setIsLowQuality(true);
      
      const img = new Image();
      img.onload = () => {
        // Depois carregar a versão full quality
        const fullQualityImg = new Image();
        fullQualityImg.onload = () => {
          setIsLowQuality(false);
        };
        fullQualityImg.src = optimizeImageUrl(currentSrc);
      };
      img.src = lowQualitySrc;
    }
  }, [currentSrc, critical, optimizeImageUrl]);

  // Preload imagens críticas
  useEffect(() => {
    if (critical || priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimizeImageUrl(src);
      if (srcSet || generateSrcSet(src)) {
        link.imageSrcset = srcSet || generateSrcSet(src);
      }
      if (sizes) {
        link.imageSizes = sizes;
      }
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [critical, priority, src, srcSet, sizes, generateSrcSet, optimizeImageUrl]);

  return (
    <ImageContainer 
      ref={imgRef} 
      aspectRatio={aspectRatio} 
      className={className}
      {...props}
    >
      {/* Placeholder com blur data URL */}
      {placeholder && (
        <Placeholder visible={!loaded || isLowQuality}>
          {blurDataURL ? (
            <img 
              src={blurDataURL} 
              alt="" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                filter: 'blur(10px)',
                transform: 'scale(1.1)',
              }}
            />
          ) : !loaded ? (
            <LoadingSpinner />
          ) : null}
        </Placeholder>
      )}

      {/* Imagem principal */}
      {currentSrc && !error && (
        <StyledImage
          src={isLowQuality ? optimizeImageUrl(currentSrc, { quality: 20 }) : optimizeImageUrl(currentSrc)}
          alt={alt}
          width={width}
          height={height}
          loading={critical ? "eager" : loading}
          srcSet={srcSet || generateSrcSet(currentSrc)}
          sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          loaded={loaded && !isLowQuality}
          isLowQuality={isLowQuality}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
        />
      )}

      {/* Error state */}
      {error && (
        <ErrorPlaceholder>
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Imagem não encontrada</p>
          </div>
        </ErrorPlaceholder>
      )}
    </ImageContainer>
  );
});

OptimizedImage.displayName = "OptimizedImage";

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  aspectRatio: PropTypes.string,
  className: PropTypes.string,
  fallbackSrc: PropTypes.string,
  placeholder: PropTypes.bool,
  lazyLoad: PropTypes.bool,
  quality: PropTypes.oneOf(['low', 'medium', 'high']),
  format: PropTypes.oneOf(['auto', 'webp', 'jpg', 'png']),
  sizes: PropTypes.string,
  srcSet: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  critical: PropTypes.bool,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  blurDataURL: PropTypes.string,
  priority: PropTypes.bool,
};

OptimizedImage.defaultProps = {
  placeholder: true,
  lazyLoad: true,
  quality: 'high',
  format: 'auto',
  loading: 'lazy',
  critical: false,
  priority: false,
};

export default OptimizedImage;
