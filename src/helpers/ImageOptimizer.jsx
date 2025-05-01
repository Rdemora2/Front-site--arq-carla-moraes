import React from "react";
import { useInView } from "framer-motion";

export const OptimizedImage = ({
  src,
  alt,
  className,
  sizes = "100vw",
  width,
  height,
  onLoad,
  priority = false,
  ...props
}) => {
  const internalRef = React.useRef(null);
  const isInView = useInView(internalRef, { once: true, margin: "200px 0px" });

  const isExternal = src.startsWith("http");

  // Gerar srcset apenas para imagens internas
  const srcSet =
    !isExternal && src.match(/\.(jpe?g|png)$/i)
      ? `${src.replace(/\.(jpe?g|png)$/i, ".webp")} 1x, ${src.replace(
          /\.(jpe?g|png)$/i,
          "@2x.webp"
        )} 2x`
      : undefined;

  return (
    <img
      ref={internalRef}
      src={
        isInView || priority
          ? src
          : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
      }
      srcSet={isInView || priority ? srcSet : undefined}
      alt={alt || ""}
      className={className || ""}
      loading={priority ? "eager" : "lazy"}
      fetchpriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      sizes={sizes}
      width={width}
      height={height}
      onLoad={onLoad}
      {...props}
    />
  );
};

export default OptimizedImage;
