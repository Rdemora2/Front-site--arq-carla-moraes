import { useRef, useState, useEffect } from "react";

/**
 * Hook customizado para detectar quando elementos entram na viewport
 * Usa Intersection Observer API nativo para máxima compatibilidade
 * @param {Object} options Opções de configuração
 * @param {boolean} options.once Se verdadeiro, dispara apenas uma vez
 * @param {string} options.margin Margem de observação
 * @param {number} options.amount Quanto do elemento deve estar visível [0-1]
 * @returns {Array} [ref, isInView] - Ref para anexar ao elemento e booleano indicando visibilidade
 */
export default function useInView({
  once = true,
  margin = "-30px 0px 0px 0px",
  amount = 0.1,
} = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Verificar se Intersection Observer está disponível
    if (!window.IntersectionObserver) {
      // Fallback para navegadores antigos
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      {
        rootMargin: margin,
        threshold: amount,
      },
    );

    observer.observe(element);

    return () => {
      if (element && observer) {
        observer.unobserve(element);
      }
    };
  }, [margin, amount, once]);

  return [ref, isInView];
}
