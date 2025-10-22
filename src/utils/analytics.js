export const trackEvent = (category, action, label = "", value = undefined) => {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }

  if (window.clarity) {
    window.clarity("event", action);
  }

  if (window.fbq) {
    window.fbq("trackCustom", action, {
      category,
      label,
      value,
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${category} - ${action}`, { label, value });
  }
};

export const trackFormField = (fieldName, action) => {
  trackEvent("Form Interaction", action, fieldName);
};

export const trackScrollDepth = (depth) => {
  trackEvent("User Engagement", "Scroll Depth", `${depth}%`, depth);
};

export const trackCTAClick = (ctaText, location) => {
  trackEvent("Conversion", "CTA Click", ctaText, location);
};

export const trackPageView = (path, title) => {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("config", window.GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
    });
  }

  if (window.fbq) {
    window.fbq("track", "PageView");
  }
};

export const trackFormSubmit = (formName, success = true) => {
  trackEvent(
    "Form Submission",
    success ? "Submit Success" : "Submit Error",
    formName
  );

  if (success && window.gtag) {
    window.gtag("event", "generate_lead", {
      currency: "BRL",
      value: 0,
    });
  }
};

export const trackOutboundLink = (url, label) => {
  trackEvent("Outbound Link", "Click", label || url);
};

export const trackFileDownload = (fileName) => {
  trackEvent("Download", "File Download", fileName);
};

export const trackVideoPlay = (videoName) => {
  trackEvent("Video", "Play", videoName);
};

export const trackSearchQuery = (query) => {
  if (window.gtag) {
    window.gtag("event", "search", {
      search_term: query,
    });
  }
  trackEvent("Search", "Query", query);
};
