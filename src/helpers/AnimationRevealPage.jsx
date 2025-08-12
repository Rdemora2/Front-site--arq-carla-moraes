/* eslint-disable react/prop-types */
import React from "react";
import tw from "twin.macro";
import styled from "styled-components";

import { motion } from "framer-motion";
import useInView from "helpers/useInView";

// Função auxiliar para gerar IDs únicos
const generateUniqueId = () => `anim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const StyledDiv = styled.div`
  ${tw`font-display min-h-screen p-8 overflow-hidden`}
  color: var(--color-primary-text);
`;
function AnimationReveal({ disabled = false, children = null }) {
  if (disabled) {
    return <>{children}</>;
  }

  if (!Array.isArray(children)) children = [children];

  const directions = ["left", "right"];
  const childrenWithAnimation = children.map((child) => {
    return (
      <AnimatedSlideInComponent
        key={generateUniqueId()}
        direction={directions[Math.floor(Math.random() * directions.length)]}
      >
        {child}
      </AnimatedSlideInComponent>
    );
  });
  return <>{childrenWithAnimation}</>;
}

function AnimatedSlideInComponent({
  direction = "left",
  offset = 30,
  children = null,
}) {
  const [ref, inView] = useInView({ margin: `-${offset}px 0px 0px 0px` });

  const x = { target: "0%" };

  if (direction === "left") x.initial = "-150%";
  else x.initial = "150%";

  // Garantir que inView seja um booleano válido
  const isVisible = Boolean(inView);

  return (
    <div ref={ref}>
      <motion.section
        initial={{ x: x.initial }}
        animate={{
          x: isVisible ? x.target : x.initial,
          transitionEnd: {
            x: isVisible ? 0 : undefined,
          },
        }}
        transition={{ type: "spring", damping: 19 }}
      >
        {children}
      </motion.section>
    </div>
  );
}

export default (props) => (
  <StyledDiv className="App">
    <AnimationReveal {...props} />
  </StyledDiv>
);
