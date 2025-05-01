import { useRef, useMemo, useEffect } from "react";
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
  const isInView = useInViewFromFramer(ref, {
    once,
    margin,
    amount,
  });

  useEffect(() => {
    return () => {};
  }, []);

  return [ref, isInView];
}
