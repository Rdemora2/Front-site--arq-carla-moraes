import { useState, useCallback, useEffect } from "react";

// Fullscreen mobile nav toggler with body scroll lock
export default function useAnimatedNavToggler() {
  const [showNavLinks, setShowNavLinks] = useState(false);

  const toggleNavbar = useCallback(() => {
    setShowNavLinks((prev) => !prev);
  }, []);

  const closeNavbar = useCallback(() => {
    setShowNavLinks(false);
  }, []);

  // Lock/unlock body scroll when nav is open
  useEffect(() => {
    if (showNavLinks) {
      document.body.classList.add("nav-open");
    } else {
      document.body.classList.remove("nav-open");
    }
    return () => {
      document.body.classList.remove("nav-open");
    };
  }, [showNavLinks]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && showNavLinks) {
        closeNavbar();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showNavLinks, closeNavbar]);

  return { showNavLinks, toggleNavbar, closeNavbar };
}
