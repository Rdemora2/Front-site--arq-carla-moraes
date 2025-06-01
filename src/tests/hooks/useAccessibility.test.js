import { renderHook, act } from "@testing-library/react";
import { useAccessibility } from "../../hooks/useAccessibility";

// Mock do document.activeElement
Object.defineProperty(document, "activeElement", {
  value: null,
  writable: true,
});

describe("useAccessibility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";
  });

  describe("useFocusManagement", () => {
    it("deve gerenciar foco corretamente", () => {
      const { result } = renderHook(() =>
        useAccessibility().useFocusManagement()
      );

      const element = document.createElement("button");
      document.body.appendChild(element);

      act(() => {
        result.current.setFocus(element);
      });

      expect(result.current.focusedElement).toBe(element);
    });

    it("deve restaurar foco anterior", () => {
      const { result } = renderHook(() =>
        useAccessibility().useFocusManagement()
      );

      const button1 = document.createElement("button");
      const button2 = document.createElement("button");
      document.body.appendChild(button1);
      document.body.appendChild(button2);

      act(() => {
        result.current.setFocus(button1);
        result.current.setFocus(button2);
        result.current.restoreFocus();
      });

      expect(result.current.focusedElement).toBe(button1);
    });

    it("deve capturar foco em container", () => {
      const { result } = renderHook(() =>
        useAccessibility().useFocusManagement()
      );

      const container = document.createElement("div");
      const button = document.createElement("button");
      container.appendChild(button);
      document.body.appendChild(container);

      act(() => {
        result.current.trapFocus(container);
      });

      expect(result.current.isFocusTrapped).toBe(true);
    });

    it("deve liberar captura de foco", () => {
      const { result } = renderHook(() =>
        useAccessibility().useFocusManagement()
      );

      const container = document.createElement("div");
      document.body.appendChild(container);

      act(() => {
        result.current.trapFocus(container);
        result.current.releaseFocus();
      });

      expect(result.current.isFocusTrapped).toBe(false);
    });
  });

  describe("useKeyboardNavigation", () => {
    it("deve navegar com teclado", () => {
      const { result } = renderHook(() =>
        useAccessibility().useKeyboardNavigation()
      );

      const button1 = document.createElement("button");
      const button2 = document.createElement("button");
      button1.tabIndex = 0;
      button2.tabIndex = 0;
      document.body.appendChild(button1);
      document.body.appendChild(button2);

      act(() => {
        result.current.setFocusableElements([button1, button2]);
        result.current.focusNext();
      });

      expect(result.current.currentIndex).toBe(1);
    });

    it("deve navegar para elemento anterior", () => {
      const { result } = renderHook(() =>
        useAccessibility().useKeyboardNavigation()
      );

      const elements = [
        document.createElement("button"),
        document.createElement("button"),
      ];

      elements.forEach((el) => {
        el.tabIndex = 0;
        document.body.appendChild(el);
      });

      act(() => {
        result.current.setFocusableElements(elements);
        result.current.setCurrentIndex(1);
        result.current.focusPrevious();
      });

      expect(result.current.currentIndex).toBe(0);
    });

    it("deve lidar com navegação circular", () => {
      const { result } = renderHook(() =>
        useAccessibility().useKeyboardNavigation({ circular: true })
      );

      const elements = [
        document.createElement("button"),
        document.createElement("button"),
      ];

      elements.forEach((el) => {
        el.tabIndex = 0;
        document.body.appendChild(el);
      });

      act(() => {
        result.current.setFocusableElements(elements);
        result.current.setCurrentIndex(1);
        result.current.focusNext(); // Deve voltar para o primeiro
      });

      expect(result.current.currentIndex).toBe(0);
    });
  });

  describe("useScreenReader", () => {
    it("deve anunciar mensagens", () => {
      const { result } = renderHook(() => useAccessibility().useScreenReader());

      act(() => {
        result.current.announce("Mensagem de teste");
      });

      const announcer = document.querySelector('[aria-live="polite"]');
      expect(announcer).toBeTruthy();
      expect(announcer.textContent).toBe("Mensagem de teste");
    });

    it("deve anunciar mensagens urgentes", () => {
      const { result } = renderHook(() => useAccessibility().useScreenReader());

      act(() => {
        result.current.announceUrgent("Erro crítico");
      });

      const announcer = document.querySelector('[aria-live="assertive"]');
      expect(announcer).toBeTruthy();
      expect(announcer.textContent).toBe("Erro crítico");
    });

    it("deve limpar anúncios", () => {
      const { result } = renderHook(() => useAccessibility().useScreenReader());

      act(() => {
        result.current.announce("Mensagem de teste");
        result.current.clearAnnouncement();
      });

      const announcer = document.querySelector('[aria-live="polite"]');
      expect(announcer.textContent).toBe("");
    });
  });

  describe("useKeyboardShortcuts", () => {
    it("deve registrar atalho de teclado", () => {
      const callback = jest.fn();

      const { result } = renderHook(() =>
        useAccessibility().useKeyboardShortcuts()
      );

      act(() => {
        result.current.registerShortcut("ctrl+s", callback);
      });

      // Simula pressionamento da tecla
      const event = new KeyboardEvent("keydown", {
        key: "s",
        ctrlKey: true,
      });

      act(() => {
        document.dispatchEvent(event);
      });

      expect(callback).toHaveBeenCalled();
    });

    it("deve desregistrar atalho", () => {
      const callback = jest.fn();

      const { result } = renderHook(() =>
        useAccessibility().useKeyboardShortcuts()
      );

      act(() => {
        result.current.registerShortcut("ctrl+s", callback);
        result.current.unregisterShortcut("ctrl+s");
      });

      const event = new KeyboardEvent("keydown", {
        key: "s",
        ctrlKey: true,
      });

      act(() => {
        document.dispatchEvent(event);
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("useNavigationMode", () => {
    it("deve detectar navegação por teclado", () => {
      const { result } = renderHook(() =>
        useAccessibility().useNavigationMode()
      );

      expect(result.current.isKeyboardNavigation).toBe(false);

      const event = new KeyboardEvent("keydown", { key: "Tab" });

      act(() => {
        document.dispatchEvent(event);
      });

      expect(result.current.isKeyboardNavigation).toBe(true);
    });

    it("deve voltar para navegação por mouse", () => {
      const { result } = renderHook(() =>
        useAccessibility().useNavigationMode()
      );

      // Ativa navegação por teclado
      const keyEvent = new KeyboardEvent("keydown", { key: "Tab" });
      act(() => {
        document.dispatchEvent(keyEvent);
      });

      expect(result.current.isKeyboardNavigation).toBe(true);

      // Volta para mouse
      const mouseEvent = new MouseEvent("mousedown");
      act(() => {
        document.dispatchEvent(mouseEvent);
      });

      expect(result.current.isKeyboardNavigation).toBe(false);
    });
  });

  describe("useReducedMotion", () => {
    it("deve detectar preferência por movimento reduzido", () => {
      // Mock da media query
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        })),
      });

      const { result } = renderHook(() =>
        useAccessibility().useReducedMotion()
      );

      expect(result.current.prefersReducedMotion).toBe(true);
    });
  });

  describe("useHighContrast", () => {
    it("deve detectar modo de alto contraste", () => {
      // Mock da media query
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === "(prefers-contrast: high)",
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        })),
      });

      const { result } = renderHook(() => useAccessibility().useHighContrast());

      expect(result.current.prefersHighContrast).toBe(true);
    });
  });

  describe("useAriaAttributes", () => {
    it("deve gerar atributos ARIA corretos", () => {
      const { result } = renderHook(() =>
        useAccessibility().useAriaAttributes()
      );

      const attributes = result.current.getComboboxAttributes("search", true, [
        { id: "1", value: "Option 1" },
        { id: "2", value: "Option 2" },
      ]);

      expect(attributes.role).toBe("combobox");
      expect(attributes["aria-expanded"]).toBe(true);
      expect(attributes["aria-haspopup"]).toBe("listbox");
    });

    it("deve gerar atributos para modal", () => {
      const { result } = renderHook(() =>
        useAccessibility().useAriaAttributes()
      );

      const attributes = result.current.getModalAttributes("Modal Title");

      expect(attributes.role).toBe("dialog");
      expect(attributes["aria-modal"]).toBe(true);
      expect(attributes["aria-labelledby"]).toContain("modal-title");
    });

    it("deve gerar atributos para toast", () => {
      const { result } = renderHook(() =>
        useAccessibility().useAriaAttributes()
      );

      const attributes = result.current.getToastAttributes("error");

      expect(attributes.role).toBe("alert");
      expect(attributes["aria-live"]).toBe("assertive");
    });
  });

  describe("integração completa", () => {
    it("deve funcionar com todos os hooks juntos", () => {
      const { result } = renderHook(() => {
        const focusManagement = useAccessibility().useFocusManagement();
        const screenReader = useAccessibility().useScreenReader();
        const keyboardNav = useAccessibility().useKeyboardNavigation();

        return { focusManagement, screenReader, keyboardNav };
      });

      expect(result.current.focusManagement).toBeDefined();
      expect(result.current.screenReader).toBeDefined();
      expect(result.current.keyboardNav).toBeDefined();
    });
  });
});
