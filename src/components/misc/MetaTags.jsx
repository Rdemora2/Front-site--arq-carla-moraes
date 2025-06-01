import { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { config, getAbsoluteUrl } from "../../config/environment";

const MetaTags = ({
  title = "Carla Moraes - Arquitetura paisagística",
  description = "Há mais de 25 anos criando projetos paisagísticos exclusivos que harmonizam arquitetura e natureza. Do conceito à execução, trazemos beleza e propósito para cada ambiente.",
  image = "/images/logo/logo_full.webp",
  url = "",
  type = "website",
  keywords = "arquitetura paisagística, paisagismo, jardins, design exterior, projetos paisagísticos, Carla Moraes, São Paulo",
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
  // Garantindo que títulos longos sejam truncados para SEO
  const processedData = {
    title: title.length > 60 ? `${title.substring(0, 57)}...` : title,
    description:
      description.length > 160
        ? `${description.substring(0, 157)}...`
        : description,
    image: getAbsoluteUrl(image),
    url: getAbsoluteUrl(url),
  };

  // Criando dados estruturados aprimorados para SEO
  const jsonLdData = structuredData || {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteName,
    description: processedData.description,
    image: processedData.image,
    url: processedData.url || getAbsoluteUrl("/"),
    telephone: contactPoint.telephone,
    email: contactPoint.email,
    openingHours,
    address: {
      "@type": "PostalAddress",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-23.5505",
      longitude: "-46.6333",
    },
    sameAs: [
      "https://www.facebook.com/carlamoraesarquiteturapaisagistica",
      "https://www.instagram.com/carlamoraes_paisagismo/",
    ],
  };

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
    // Atualizar título
    document.title = processedData.title;

    // Atualizar meta tags básicas
    updateMetaTag('meta[name="description"]', processedData.description);
    updateMetaTag('meta[name="keywords"]', keywords);
    updateMetaTag('meta[name="author"]', author);
    updateMetaTag('meta[name="robots"]', robots);
    updateMetaTag('meta[name="viewport"]', viewport);
    updateMetaTag('meta[name="theme-color"]', themeColor);

    // Meta tags Open Graph
    updateMetaTag('meta[property="og:title"]', processedData.title);
    updateMetaTag('meta[property="og:description"]', processedData.description);
    updateMetaTag('meta[property="og:image"]', processedData.image);
    updateMetaTag('meta[property="og:url"]', processedData.url);
    updateMetaTag('meta[property="og:type"]', type);
    updateMetaTag('meta[property="og:locale"]', locale);
    updateMetaTag('meta[property="og:site_name"]', siteName);

    // Meta tags Twitter
    updateMetaTag('meta[name="twitter:card"]', twitterCardType);
    updateMetaTag('meta[name="twitter:title"]', processedData.title);
    updateMetaTag(
      'meta[name="twitter:description"]',
      processedData.description
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
    updateLinkTag("icon", "/images/favicon/favicon.ico", {
      type: "image/x-icon",
    });
    updateLinkTag("apple-touch-icon", "/images/favicon/apple-touch-icon.png", {
      sizes: "180x180",
    });
    updateLinkTag("icon", "/images/favicon/favicon-32x32.png", {
      type: "image/png",
      sizes: "32x32",
    });
    updateLinkTag("icon", "/images/favicon/favicon-16x16.png", {
      type: "image/png",
      sizes: "16x16",
    });
    updateLinkTag("manifest", "/manifest.json");

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
        'script[data-type="breadcrumb-jsonld"]'
      );
      if (!breadcrumbScript) {
        breadcrumbScript = document.createElement("script");
        breadcrumbScript.type = "application/ld+json";
        breadcrumbScript.setAttribute("data-type", "breadcrumb-jsonld");
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
    type: PropTypes.oneOf(["website", "article", "product", "profile"]),
    keywords: PropTypes.string,
    author: PropTypes.string,
    locale: PropTypes.string,
    siteName: PropTypes.string,
    twitterCardType: PropTypes.oneOf([
      "summary",
      "summary_large_image",
      "app",
      "player",
    ]),
    structuredData: PropTypes.object,
    robots: PropTypes.string,
    viewport: PropTypes.string,
    themeColor: PropTypes.string,
    alternates: PropTypes.arrayOf(
      PropTypes.shape({
        href: PropTypes.string.isRequired,
        hreflang: PropTypes.string.isRequired,
      })
    ),
    openingHours: PropTypes.string,
    contactPoint: PropTypes.shape({
      telephone: PropTypes.string,
      email: PropTypes.string,
      address: PropTypes.string,
    }),
    breadcrumbs: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })
    ),
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
