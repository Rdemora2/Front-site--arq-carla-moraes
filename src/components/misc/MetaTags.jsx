import { useEffect } from "react";
import { config, getAbsoluteUrl } from "../../config/environment";

const MetaTags = ({
  title = "Carla Moraes - Arquitetura paisagística",
  description = "Há mais de 25 anos criando projetos paisagísticos exclusivos que harmonizam arquitetura e natureza",
  image = "/images/logo/logo_full.webp",
  url = "",
  type = "website",
}) => {
  useEffect(() => {
    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", getAbsoluteUrl(url));
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", title);
    }

    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (ogDescription) {
      ogDescription.setAttribute("content", description);
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute("content", getAbsoluteUrl(image));
    }

    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) {
      ogType.setAttribute("content", type);
    }

    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.setAttribute("content", getAbsoluteUrl(url));
    }

    const twitterTitle = document.querySelector(
      'meta[property="twitter:title"]'
    );
    if (twitterTitle) {
      twitterTitle.setAttribute("content", title);
    }

    const twitterDescription = document.querySelector(
      'meta[property="twitter:description"]'
    );
    if (twitterDescription) {
      twitterDescription.setAttribute("content", description);
    }

    const twitterImage = document.querySelector(
      'meta[property="twitter:image"]'
    );
    if (twitterImage) {
      twitterImage.setAttribute("content", getAbsoluteUrl(image));
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = getAbsoluteUrl(url);
  }, [title, description, image, url, type]);

  return null;
};

export default MetaTags;
