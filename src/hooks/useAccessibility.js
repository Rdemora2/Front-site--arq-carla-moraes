import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Hook para melhorar a acessibilidade em componentes
 * Inclui gestão de foco, navegação por teclado e ARIA
 */

/**
 * Hook para gestão de foco
 */
export const useFocusManagement = () => {
  const focusableElementsSelector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const trapFocus = useCallback((container) => {
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      focusableElementsSelector
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);

    // Focar no primeiro elemento
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  }, []);

  const restoreFocus = useCallback((element) => {
    if (element && typeof element.focus === "function") {
      element.focus();
    }
  }, []);

  const getFocusableElements = useCallback((container) => {
    if (!container) return [];
    return Array.from(container.querySelectorAll(focusableElementsSelector));
  }, []);

  return {
    trapFocus,
    restoreFocus,
    getFocusableElements,
  };
};

/**
 * Hook para navegação por teclado em listas/grids
 */
export const useKeyboardNavigation = (items, options = {}) => {
  const {
    orientation = "vertical", // 'vertical', 'horizontal', 'grid'
    loop = true,
    onSelect,
    gridColumns = 1,
  } = options;

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const moveNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= items.length) {
        return loop ? 0 : prev;
      }
      return nextIndex;
    });
  }, [items.length, loop]);

  const movePrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      const prevIndex = prev - 1;
      if (prevIndex < 0) {
        return loop ? items.length - 1 : prev;
      }
      return prevIndex;
    });
  }, [items.length, loop]);

  const moveUp = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = prev - gridColumns;
      if (newIndex < 0) {
        return loop ? items.length + newIndex : prev;
      }
      return newIndex;
    });
  }, [gridColumns, items.length, loop]);

  const moveDown = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = prev + gridColumns;
      if (newIndex >= items.length) {
        return loop ? newIndex - items.length : prev;
      }
      return newIndex;
    });
  }, [gridColumns, items.length, loop]);

  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (orientation === "vertical" || orientation === "grid") {
            orientation === "vertical" ? moveNext() : moveDown();
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (orientation === "vertical" || orientation === "grid") {
            orientation === "vertical" ? movePrevious() : moveUp();
          }
          break;

        case "ArrowRight":
          e.preventDefault();
          if (orientation === "horizontal" || orientation === "grid") {
            orientation === "horizontal" ? moveNext() : moveNext();
          }
          break;

        case "ArrowLeft":
          e.preventDefault();
          if (orientation === "horizontal" || orientation === "grid") {
            orientation === "horizontal" ? movePrevious() : movePrevious();
          }
          break;

        case "Home":
          e.preventDefault();
          setCurrentIndex(0);
          break;

        case "End":
          e.preventDefault();
          setCurrentIndex(items.length - 1);
          break;

        case "Enter":
        case " ":
          e.preventDefault();
          if (onSelect) {
            onSelect(items[currentIndex], currentIndex);
          }
          break;
      }
    },
    [
      orientation,
      moveNext,
      movePrevious,
      moveUp,
      moveDown,
      onSelect,
      items,
      currentIndex,
    ]
  );

  // Focus no item atual
  useEffect(() => {
    if (containerRef.current) {
      const currentItem = containerRef.current.children[currentIndex];
      if (currentItem && typeof currentItem.focus === "function") {
        currentItem.focus();
      }
    }
  }, [currentIndex]);

  return {
    currentIndex,
    setCurrentIndex,
    handleKeyDown,
    containerRef,
  };
};

/**
 * Hook para anúncios de screen reader
 */
export const useScreenReaderAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const announcementRef = useRef(null);

  const announce = useCallback((message, priority = "polite") => {
    const id = Date.now();
    const announcement = {
      id,
      message,
      priority,
      timestamp: new Date(),
    };

    setAnnouncements((prev) => [...prev, announcement]);

    // Remove o anúncio após um tempo
    setTimeout(() => {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }, 5000);
  }, []);

  const clearAnnouncements = useCallback(() => {
    setAnnouncements([]);
  }, []);

  // Componente para renderizar os anúncios
  const LiveRegion = () => {
    return (
      <>
        <div
          ref={announcementRef}
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {announcements
            .filter((a) => a.priority === "polite")
            .map((a) => (
              <div key={a.id}>{a.message}</div>
            ))}
        </div>
        <div aria-live="assertive" aria-atomic="true" className="sr-only">
          {announcements
            .filter((a) => a.priority === "assertive")
            .map((a) => (
              <div key={a.id}>{a.message}</div>
            ))}
        </div>
      </>
    );
  };

  return {
    announce,
    clearAnnouncements,
    LiveRegion,
    announcements,
  };
};

/**
 * Hook para detectar modo de navegação (mouse vs teclado)
 */
export const useNavigationMode = () => {
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        setIsKeyboardNavigation(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardNavigation(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return isKeyboardNavigation;
};

/**
 * Hook para reduzir movimento (prefers-reduced-motion)
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook para alto contraste
 */
export const useHighContrast = () => {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-contrast: high)");
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersHighContrast(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Fallback para navegadores mais antigos
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersHighContrast;
};

/**
 * Hook para verificar conformidade ARIA
 */
export const useARIAAttributes = (element) => {
  const validateARIA = useCallback(() => {
    if (!element) return [];

    const issues = [];

    // Verificar labels
    if (
      element.tagName === "INPUT" ||
      element.tagName === "TEXTAREA" ||
      element.tagName === "SELECT"
    ) {
      const hasLabel = element.labels && element.labels.length > 0;
      const hasAriaLabel = element.hasAttribute("aria-label");
      const hasAriaLabelledBy = element.hasAttribute("aria-labelledby");

      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        issues.push("Form element missing accessible label");
      }
    }

    // Verificar role
    if (element.hasAttribute("role")) {
      const role = element.getAttribute("role");
      const validRoles = [
        "alert",
        "button",
        "checkbox",
        "dialog",
        "grid",
        "gridcell",
        "link",
        "log",
        "marquee",
        "menuitem",
        "menuitemcheckbox",
        "menuitemradio",
        "option",
        "progressbar",
        "radio",
        "scrollbar",
        "slider",
        "spinbutton",
        "status",
        "tab",
        "tabpanel",
        "textbox",
        "timer",
        "tooltip",
        "treeitem",
      ];

      if (!validRoles.includes(role)) {
        issues.push(`Invalid ARIA role: ${role}`);
      }
    }

    // Verificar contraste de cor (básico)
    const styles = window.getComputedStyle(element);
    const backgroundColor = styles.backgroundColor;
    const color = styles.color;

    if (backgroundColor === "rgba(0, 0, 0, 0)" && color === "rgb(0, 0, 0)") {
      // Não há contraste suficiente (muito básico)
      issues.push("Possible low color contrast");
    }

    return issues;
  }, [element]);

  return { validateARIA };
};

/**
 * Hook principal que combina todas as funcionalidades de acessibilidade
 */
export const useAccessibility = (options = {}) => {
  const {
    announceChanges = true,
    validateARIA = false,
    manageSkipLinks = true,
  } = options;

  const focusManagement = useFocusManagement();
  const screenReader = useScreenReaderAnnouncements();
  const isKeyboardNavigation = useNavigationMode();
  const prefersReducedMotion = useReducedMotion();
  const prefersHighContrast = useHighContrast();

  // Gerenciar skip links
  useEffect(() => {
    if (!manageSkipLinks) return;

    const skipLink = document.querySelector(".skip-link");
    if (!skipLink) {
      // Criar skip link se não existir
      const link = document.createElement("a");
      link.href = "#main-content";
      link.textContent = "Pular para o conteúdo principal";
      link.className =
        "skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50";
      document.body.insertBefore(link, document.body.firstChild);
    }
  }, [manageSkipLinks]);

  // Adicionar classes CSS para estados de acessibilidade
  useEffect(() => {
    document.documentElement.classList.toggle(
      "keyboard-navigation",
      isKeyboardNavigation
    );
    document.documentElement.classList.toggle(
      "reduced-motion",
      prefersReducedMotion
    );
    document.documentElement.classList.toggle(
      "high-contrast",
      prefersHighContrast
    );
  }, [isKeyboardNavigation, prefersReducedMotion, prefersHighContrast]);

  return {
    focusManagement,
    screenReader,
    isKeyboardNavigation,
    prefersReducedMotion,
    prefersHighContrast,
    announceChanges,
    validateARIA,
  };
};

export default useAccessibility;
