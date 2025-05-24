import { useEffect } from "react";
import { useEnvironment } from "../../hooks/useEnvironment";

const Analytics = () => {
  const { googleAnalyticsId, facebookPixelId, isProduction, log } =
    useEnvironment();

  useEffect(() => {
    if (!isProduction) {
      log("Analytics desabilitado em desenvolvimento");
      return;
    }

    if (googleAnalyticsId) {
      log("Carregando Google Analytics:", googleAnalyticsId);

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", googleAnalyticsId);

      window.gtag = gtag;
    }

    if (facebookPixelId) {
      log("Carregando Facebook Pixel:", facebookPixelId);

      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js"
      );

      window.fbq("init", facebookPixelId);
      window.fbq("track", "PageView");
    }
  }, [googleAnalyticsId, facebookPixelId, isProduction]);

  return null;
};

export const trackEvent = (
  action,
  category = "engagement",
  label = "",
  value = 0
) => {
  if (window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  if (window.fbq) {
    window.fbq("track", "CustomEvent", {
      action,
      category,
      label,
      value,
    });
  }
};

export const trackPageView = (page_title, page_location) => {
  if (window.gtag) {
    window.gtag("config", window.GA_MEASUREMENT_ID, {
      page_title,
      page_location,
    });
  }

  if (window.fbq) {
    window.fbq("track", "PageView");
  }
};

export default Analytics;
