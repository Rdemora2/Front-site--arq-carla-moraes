import React from "react";
import { useInView } from "framer-motion";

/**
 * Componente para otimizar carregamento de imagens
 * - Implementa lazy loading com IntersectionObserver (via useInView)
 * - Suporta diferentes tamanhos de imagem (srcSet)
 * - Inclui fallback para navegadores que não suportam
 */
export const OptimizedImage = ({
  src,
  alt,
  className,
  sizes = "100vw",
  width,
  height,
  onLoad,
  imgRef,
  ...props
}) => {
  const internalRef = React.useRef(null);
  const isInView = useInView(internalRef, { once: true, margin: "200px 0px" });

  // Determinar referência final para a imagem
  const ref = imgRef || internalRef;

  // Extrair nome do arquivo e extensão para gerar srcSet
  const generateSrcSet = (src) => {
    if (!src || typeof src !== "string") return null;
    if (src.startsWith("http") || !src.match(/\.(jpe?g|png|webp)$/i))
      return null;

    const [path, ext] = src.split(/\.(?=[^\.]+$)/);
    return {
      srcSet: `${path}-400.${ext} 400w, ${path}-800.${ext} 800w, ${path}.${ext} 1200w`,
      src: isInView ? src : "",
    };
  };

  const srcSetData = generateSrcSet(src);

  return (
    <img
      ref={ref}
      src={isInView ? src : ""}
      {...(srcSetData && { srcSet: isInView ? srcSetData.srcSet : "" })}
      alt={alt || ""}
      className={className || ""}
      loading="lazy"
      sizes={sizes}
      width={width}
      height={height}
      onLoad={onLoad}
      {...props}
    />
  );
};

export default OptimizedImage;
