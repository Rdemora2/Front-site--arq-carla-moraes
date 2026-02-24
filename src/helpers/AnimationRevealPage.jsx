/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import tw from "twin.macro";
import styled from "styled-components";

import { motion } from "framer-motion";
import useInView from "helpers/useInView";

const generateStableKey = (child, index) => {
  if (child && child.type) {
    const componentName =
      child.type.displayName || child.type.name || "Component";
    const hasKey = child.key;
    return hasKey ? `${componentName}-${hasKey}` : `${componentName}-${index}`;
  }
  return `child-${index}`;
};

const StyledDiv = styled.div`
  ${tw`font-display min-h-screen overflow-hidden`}
  padding: 2rem;
  color: var(--color-primary-text);

  @media (max-width: 1023px) {
    padding: 1rem;
  }

  @media (max-width: 639px) {
    padding: 0.75rem;
  }
`;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function AnimationReveal({ disabled = false, children = null }) {
  const isMobile = useIsMobile();

  if (disabled) {
    return <>{children}</>;
  }

  if (!Array.isArray(children)) children = [children];

  const directions = ["left", "right"];
  const childrenWithAnimation = children.map((child, index) => {
    const direction = directions[index % directions.length];

    return (
      <AnimatedSlideInComponent
        key={generateStableKey(child, index)}
        direction={direction}
        isMobile={isMobile}
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
  isMobile = false,
}) {
  const [ref, inView] = useInView({
    margin: `-${offset}px 0px 0px 0px`,
    once: true,
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  const isVisible = Boolean(inView);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isVisible, hasAnimated]);

  const shouldAnimate = isVisible || hasAnimated;

  // Mobile: fade-up animation (no horizontal slide to avoid overflow)
  // Desktop: original slide-in from left/right
  if (isMobile) {
    return (
      <div ref={ref}>
        <motion.section
          initial={{ y: 40, opacity: 0 }}
          animate={{
            y: shouldAnimate ? 0 : 40,
            opacity: shouldAnimate ? 1 : 0,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          {children}
        </motion.section>
      </div>
    );
  }

  const x = { target: "0%" };
  if (direction === "left") x.initial = "-150%";
  else x.initial = "150%";

  return (
    <div ref={ref}>
      <motion.section
        initial={{ x: x.initial }}
        animate={{
          x: shouldAnimate ? x.target : x.initial,
          transitionEnd: {
            x: shouldAnimate ? 0 : undefined,
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
