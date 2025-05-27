import { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { config, getAbsoluteUrl } from "../../config/environment";

const MetaTags = ({
  title = "Carla Moraes - Arquitetura paisagística",
  description = "Há mais de 25 anos criando projetos paisagísticos exclusivos que harmonizam arquitetura e natureza",
  image = "/images/logo/logo_full.webp",
  url = "",
  type = "website",
  keywords = "arquitetura paisagística, paisagismo, jardins, design exterior, projetos paisagísticos",
  author = "Carla Moraes",
  locale = "pt_BR",
  siteName = "Carla Moraes Arquitetura Paisagística",
  twitterCardType = "summary_large_image",
  structuredData = null,
  robots = "index, follow",
  viewport = "width=device-width, initial-scale=1.0",
  themeColor = "#2D5A27",
  alternates = [],
  openingHours = "Mo-Fr 09:00-18:00",
  contactPoint = {
    telephone: "+55-11-99985-4345",
    email: "contato@carlamoraes.com.br",
  },
}) => {
  const processedData = useMemo(() => {
    const absoluteUrl = getAbsoluteUrl(url);
    const absoluteImage = getAbsoluteUrl(image);

    const validTitle =
      title?.trim() || "Carla Moraes - Arquitetura paisagística";
    const validDescription =
      description?.trim() ||
      "Há mais de 25 anos criando projetos paisagísticos exclusivos";

    const truncatedTitle =
      validTitle.length > 60 ? validTitle.substring(0, 57) + "..." : validTitle;
    const truncatedDescription =
      validDescription.length > 160
        ? validDescription.substring(0, 157) + "..."
        : validDescription;

    return {
      title: truncatedTitle,
      description: truncatedDescription,
      url: absoluteUrl,
      image: absoluteImage,
      keywords: keywords?.trim() || "",
    };
  }, [title, description, url, image, keywords]);

  const jsonLdData = useMemo(() => {
    if (structuredData) return structuredData;

    return {
      "@context": "https://schema.org",
      "@type": type === "website" ? "Organization" : "WebPage",
      name: siteName,
      url: processedData.url,
      description: processedData.description,
      image: processedData.image,
      author: {
        "@type": "Person",
        name: author,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: contactPoint.telephone,
        email: contactPoint.email,
        contactType: "customer service",
      },
      openingHours: openingHours,
      sameAs: [
        "https://www.instagram.com/carlamoraesarq",
        "https://www.linkedin.com/in/carlamoraes",
      ],
      address: {
        "@type": "PostalAddress",
        addressCountry: "BR",
        addressLocality: "São Paulo",
      },
    };
  }, [
    structuredData,
    type,
    siteName,
    processedData,
    author,
    contactPoint,
    openingHours,
  ]);

  const updateMetaTag = (selector, content, property = null) => {
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      if (property) {
        element.setAttribute(
          property.startsWith("twitter:") ? "name" : "property",
          property
        );
      }
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };

  const updateLinkTag = (rel, href, attributes = {}) => {
    let element = document.querySelector(`link[rel="${rel}"]`);
    if (!element) {
      element = document.createElement("link");
      element.rel = rel;
      document.head.appendChild(element);
    }
    element.href = href;

    // Adicionar atributos extras
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  };

  useEffect(() => {
    // Title tag
    document.title = processedData.title;

    // Basic Meta Tags
    updateMetaTag('meta[name="description"]', processedData.description);
    updateMetaTag('meta[name="keywords"]', processedData.keywords);
    updateMetaTag('meta[name="author"]', author);
    updateMetaTag('meta[name="robots"]', robots);
    updateMetaTag('meta[name="viewport"]', viewport);
    updateMetaTag('meta[name="theme-color"]', themeColor);
    updateMetaTag('meta[name="language"]', locale);

    // Open Graph Tags
    updateMetaTag('meta[property="og:url"]', processedData.url, "og:url");
    updateMetaTag('meta[property="og:title"]', processedData.title, "og:title");
    updateMetaTag(
      'meta[property="og:description"]',
      processedData.description,
      "og:description"
    );
    updateMetaTag('meta[property="og:image"]', processedData.image, "og:image");
    updateMetaTag('meta[property="og:image:width"]', "1200", "og:image:width");
    updateMetaTag('meta[property="og:image:height"]', "630", "og:image:height");
    updateMetaTag(
      'meta[property="og:image:alt"]',
      processedData.title,
      "og:image:alt"
    );
    updateMetaTag('meta[property="og:type"]', type, "og:type");
    updateMetaTag('meta[property="og:site_name"]', siteName, "og:site_name");
    updateMetaTag('meta[property="og:locale"]', locale, "og:locale");

    // Twitter Card Tags
    updateMetaTag('meta[name="twitter:card"]', twitterCardType, "twitter:card");
    updateMetaTag('meta[name="twitter:url"]', processedData.url, "twitter:url");
    updateMetaTag(
      'meta[name="twitter:title"]',
      processedData.title,
      "twitter:title"
    );
    updateMetaTag(
      'meta[name="twitter:description"]',
      processedData.description,
      "twitter:description"
    );
    updateMetaTag(
      'meta[name="twitter:image"]',
      processedData.image,
      "twitter:image"
    );
    updateMetaTag(
      'meta[name="twitter:image:alt"]',
      processedData.title,
      "twitter:image:alt"
    );

    // Canonical URL
    updateLinkTag("canonical", processedData.url);

    // Preconnect para melhorar performance
    updateLinkTag("preconnect", "https://fonts.googleapis.com");
    updateLinkTag("preconnect", "https://fonts.gstatic.com", {
      crossorigin: "",
    });

    // DNS Prefetch para recursos externos
    updateLinkTag("dns-prefetch", "https://www.google-analytics.com");
    updateLinkTag("dns-prefetch", "https://connect.facebook.net");

    // Favicon e ícones
    updateLinkTag("icon", "/favicon.ico", { type: "image/x-icon" });
    updateLinkTag("apple-touch-icon", "/apple-touch-icon.png", {
      sizes: "180x180",
    });
    updateLinkTag("icon", "/favicon-32x32.png", {
      type: "image/png",
      sizes: "32x32",
    });
    updateLinkTag("icon", "/favicon-16x16.png", {
      type: "image/png",
      sizes: "16x16",
    });
    updateLinkTag("manifest", "/site.webmanifest");

    // Alternates para idiomas
    alternates.forEach(({ hreflang, href }) => {
      updateLinkTag("alternate", href, { hreflang });
    });

    // JSON-LD Structured Data
    let jsonLdScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (!jsonLdScript) {
      jsonLdScript = document.createElement("script");
      jsonLdScript.type = "application/ld+json";
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(jsonLdData);

    // Adicionar breadcrumb JSON-LD se estivermos em uma página interna
    if (url && url !== "/" && url !== "") {
      const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: getAbsoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: processedData.title,
            item: processedData.url,
          },
        ],
      };

      let breadcrumbScript = document.querySelector(
        'script[data-type="breadcrumb"]'
      );
      if (!breadcrumbScript) {
        breadcrumbScript = document.createElement("script");
        breadcrumbScript.type = "application/ld+json";
        breadcrumbScript.setAttribute("data-type", "breadcrumb");
        document.head.appendChild(breadcrumbScript);
      }
      breadcrumbScript.textContent = JSON.stringify(breadcrumbData);
    }
  }, [
    processedData,
    type,
    author,
    locale,
    siteName,
    twitterCardType,
    robots,
    viewport,
    themeColor,
    alternates,
    jsonLdData,
  ]);

  // PropTypes para validação
  MetaTags.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string,
    type: PropTypes.oneOf(['website', 'article', 'product', 'profile']),
    keywords: PropTypes.string,
    author: PropTypes.string,
    locale: PropTypes.string,
    siteName: PropTypes.string,
    twitterCardType: PropTypes.oneOf(['summary', 'summary_large_image', 'app', 'player']),
    structuredData: PropTypes.object,
    robots: PropTypes.string,
    viewport: PropTypes.string,
    themeColor: PropTypes.string,
    alternates: PropTypes.arrayOf(PropTypes.shape({
      href: PropTypes.string.isRequired,
      hreflang: PropTypes.string.isRequired,
    })),
    openingHours: PropTypes.string,
    contactPoint: PropTypes.shape({
      telephone: PropTypes.string,
      email: PropTypes.string,
      address: PropTypes.string,
    }),
    breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })),
    article: PropTypes.shape({
      publishedTime: PropTypes.string,
      modifiedTime: PropTypes.string,
      author: PropTypes.string,
      section: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
    product: PropTypes.shape({
      price: PropTypes.string,
      currency: PropTypes.string,
      availability: PropTypes.string,
      condition: PropTypes.string,
    }),
  };

  return null;
};

export default MetaTags;
