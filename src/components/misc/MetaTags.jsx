import { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { getAbsoluteUrl } from "../../config/environment";

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
  contactPoint = {
    telephone: "+55-11-99985-4345",
    email: "contato@carlamoraes.com.br",
  },
}) => {
  const processedData = useMemo(
    () => ({
      title: title.length > 60 ? `${title.substring(0, 57)}...` : title,
      description:
        description.length > 160
          ? `${description.substring(0, 157)}...`
          : description,
      image: getAbsoluteUrl(image),
      url: getAbsoluteUrl(url),
    }),
    [title, description, image, url]
  );

  const jsonLdData = useMemo(() => {
    if (structuredData) return structuredData;

    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "@id": `${getAbsoluteUrl("/")}#organization`,
          name: siteName,
          image: processedData.image,
          description: processedData.description,
          url: processedData.url || getAbsoluteUrl("/"),
          telephone: contactPoint.telephone,
          email: contactPoint.email,
          priceRange: "$$$",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "127",
            bestRating: "5",
            worstRating: "5",
          },
          address: {
            "@type": "PostalAddress",
            streetAddress: "São Paulo",
            addressLocality: "São Paulo",
            addressRegion: "SP",
            postalCode: "01001-000",
            addressCountry: "BR",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "-23.5507",
            longitude: "-46.6333",
          },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
          sameAs: [
            "https://www.linkedin.com/in/carla-m-b47a0554/",
            "https://www.instagram.com/arqcamoraes",
          ],
        },
        {
          "@type": "Service",
          "@id": `${getAbsoluteUrl("/")}#service`,
          serviceType: "Arquitetura Paisagística",
          name: "Projetos Paisagísticos Exclusivos",
          description:
            "Projetos paisagísticos personalizados para residências, condomínios e espaços corporativos de alto padrão",
          provider: {
            "@id": `${getAbsoluteUrl("/")}#organization`,
          },
          areaServed: [
            {
              "@type": "City",
              name: "São Paulo",
            },
            {
              "@type": "State",
              name: "São Paulo",
            },
          ],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Serviços de Paisagismo",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Projeto Paisagístico Residencial",
                  description:
                    "Desenvolvimento completo de projetos paisagísticos para residências de alto padrão",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Consultoria em Paisagismo",
                  description:
                    "Consultoria especializada em arquitetura paisagística e design de jardins",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Paisagismo Corporativo",
                  description:
                    "Projetos paisagísticos para ambientes corporativos e comerciais",
                },
              },
            ],
          },
        },
        {
          "@type": "WebSite",
          "@id": `${getAbsoluteUrl("/")}#website`,
          url: getAbsoluteUrl("/"),
          name: siteName,
          description: processedData.description,
          publisher: {
            "@id": `${getAbsoluteUrl("/")}#organization`,
          },
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${getAbsoluteUrl("/")}?s={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        },
      ],
    };
  }, [structuredData, siteName, processedData, contactPoint]);

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
    document.title = processedData.title;

    updateMetaTag('meta[name="description"]', processedData.description);
    updateMetaTag('meta[name="keywords"]', keywords);
    updateMetaTag('meta[name="author"]', author);
    updateMetaTag('meta[name="robots"]', robots);
    updateMetaTag('meta[name="viewport"]', viewport);
    updateMetaTag('meta[name="theme-color"]', themeColor);

    updateMetaTag('meta[property="og:title"]', processedData.title);
    updateMetaTag('meta[property="og:description"]', processedData.description);
    updateMetaTag('meta[property="og:image"]', processedData.image);
    updateMetaTag('meta[property="og:url"]', processedData.url);
    updateMetaTag('meta[property="og:type"]', type);
    updateMetaTag('meta[property="og:locale"]', locale);
    updateMetaTag('meta[property="og:site_name"]', siteName);

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

    updateLinkTag("canonical", processedData.url);

    updateLinkTag("preconnect", "https://fonts.googleapis.com");
    updateLinkTag("preconnect", "https://fonts.gstatic.com", {
      crossorigin: "",
    });

    updateLinkTag("dns-prefetch", "https://www.google-analytics.com");
    updateLinkTag("dns-prefetch", "https://connect.facebook.net");

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

    let jsonLdScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (!jsonLdScript) {
      jsonLdScript = document.createElement("script");
      jsonLdScript.type = "application/ld+json";
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(jsonLdData);

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
    keywords,
    url,
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
