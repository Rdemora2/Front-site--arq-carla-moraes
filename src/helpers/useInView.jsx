import { useRef, useMemo } from "react";
import { useInView as useInViewFromFramer } from "framer-motion";

/**
 * Hook customizado para detectar quando elementos entram na viewport
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

  // Configurações otimizadas para o IntersectionObserver
  const options = useMemo(
    () => ({
      once,
      margin,
      amount,
      // Root: null (o viewport padrão)
      // rootMargin: margin, calculado internamente pelo framer-motion
      // threshold: amount, calculado internamente pelo framer-motion
    }),
    [once, margin, amount]
  );

  const isInView = useInViewFromFramer(ref, options);

  return [ref, isInView];
}
