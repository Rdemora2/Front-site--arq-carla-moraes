export const config = {
  siteName:
    import.meta.env.VITE_SITE_NAME || "Carla Moraes - Arquitetura Paisagística",
  siteDescription:
    import.meta.env.VITE_SITE_DESCRIPTION ||
    "Projetos paisagísticos exclusivos há mais de 25 anos",

  baseUrl: (() => {
    if (import.meta.env.MODE === "production") {
      return import.meta.env.VITE_PROD_URL || "https://arqcarlamoraes.com.br/";
    } else if (import.meta.env.MODE === "staging") {
      return (
        import.meta.env.VITE_STAGING_URL ||
        "https://front-site-arq-carla-moraes.vercel.app/"
      );
    } else {
      return import.meta.env.VITE_DEV_URL || "http://localhost:3000";
    }
  })(),

  apiUrl: import.meta.env.VITE_API_URL || "",

  isProduction: import.meta.env.MODE === "production",
  isDevelopment: import.meta.env.MODE === "development",

  googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  facebookPixelId: import.meta.env.VITE_FACEBOOK_PIXEL_ID,

  enableAnalyzer: import.meta.env.VITE_ENABLE_ANALYZER === "true",
  enableSourcemap: import.meta.env.VITE_ENABLE_SOURCEMAP === "true",
};

export const getAbsoluteUrl = (path = "") => {
  return `${config.baseUrl.replace(/\/$/, "")}${
    path.startsWith("/") ? path : `/${path}`
  }`;
};

export const isProduction = () => config.isProduction;

export const isDevelopment = () => config.isDevelopment;

export default config;
