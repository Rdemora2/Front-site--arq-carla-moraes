import { useEffect } from "react";
import { trackScrollDepth } from "../utils/analytics";

export const useScrollDepthTracking = () => {
  useEffect(() => {
    const thresholds = [25, 50, 75, 100];
    const tracked = new Set();

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const scrollPercent = Math.round(
        (scrollTop / (documentHeight - windowHeight)) * 100
      );

      thresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !tracked.has(threshold)) {
          trackScrollDepth(threshold);
          tracked.add(threshold);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
};
