import React from "react";
import { createGlobalStyle } from "styled-components";
import tw, { GlobalStyles as BaseStyles } from "twin.macro";

const CustomStyles = createGlobalStyle`
  :root {
    --color-primary: #8c9b7a;
    --color-primary-text: #3e4d2c;
    --color-background: #fcfaf7;
    --color-gold: #c2b280;
    --color-secondary: #b1c0a8;
  }

  body {
    -webkit-tap-highlight-color: transparent;
    ${tw`antialiased`}
    background-color: var(--color-background);
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: var(--color-primary-text);
  }
  
  .primary-button {
    background-color: var(--color-primary);
    &:hover {
      background-color: var(--color-primary-text);
    }
  }
  
  .accent-text {
    color: var(--color-gold);
  }
  
  .secondary-bg {
    background-color: var(--color-secondary);
  }
`;

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
);

export default GlobalStyles;
