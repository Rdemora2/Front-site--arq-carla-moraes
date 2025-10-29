import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Picture = styled.picture`
  display: contents;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${(props) => props.$objectFit || "cover"};
  background-image: ${(props) =>
    props.$blurDataUrl ? `url(${props.$blurDataUrl})` : "none"};
  background-size: cover;
  background-position: center;
`;

const OptimizedImage = ({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  width,
  height,
  className = "",
  objectFit = "cover",
  blurDataUrl = null,
  loading,
}) => {
  const basePath = src.replace(/\.[^/.]+$/, "");
  const originalExt = src.match(/\.[^/.]+$/)?.[0] || ".jpg";

  const actualLoading = loading || (priority ? "eager" : "lazy");

  const buildSrcSet = (format) => {
    const variants = ["320w", "640w"];
    return variants
      .map((size) => `${basePath}-${size}.${format} ${size}`)
      .join(", ");
  };

  const avifSrcSet = buildSrcSet("avif");
  const webpSrcSet = buildSrcSet("webp");
  const jpgSrcSet = buildSrcSet("jpg");

  const fallbackSrc = `${basePath}${originalExt}`;

  return (
    <Picture>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <source type="image/jpeg" srcSet={jpgSrcSet} sizes={sizes} />
      <Img
        src={fallbackSrc}
        alt={alt}
        loading={actualLoading}
        fetchpriority={priority ? "high" : "low"}
        decoding="async"
        width={width}
        height={height}
        className={className}
        $objectFit={objectFit}
        $blurDataUrl={blurDataUrl}
        onError={(e) => {
          if (!e.target.dataset.fallbackAttempted) {
            console.warn(
              `[OptimizedImage] Imagem não encontrada, usando fallback: ${fallbackSrc}`
            );
            e.target.dataset.fallbackAttempted = "true";
            e.target.src = fallbackSrc;
          }
        }}
      />
    </Picture>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  priority: PropTypes.bool,
  sizes: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  objectFit: PropTypes.oneOf([
    "cover",
    "contain",
    "fill",
    "none",
    "scale-down",
  ]),
  blurDataUrl: PropTypes.string,
  loading: PropTypes.oneOf(["lazy", "eager"]),
};

export default OptimizedImage;
