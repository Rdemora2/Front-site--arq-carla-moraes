import React from "react";
import { createGlobalStyle } from "styled-components";
import tw, { GlobalStyles as BaseStyles } from "twin.macro";

const CustomStyles = createGlobalStyle`
  :root {
    --color-primary: #6b7959; /* Tom mais escuro para maior contraste */
    --color-primary-text: #3e4d2c;
    --color-background: #fcfaf7;
    --color-gold: #a99960; /* Tom mais escuro para maior contraste */
    --color-secondary: #91a082; /* Tom mais escuro para maior contraste */
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

  /* Adicionar estilos específicos para botões primários para garantir contraste */
  .primaryAction {
    background-color: #4d593c; /* Versão mais escura da cor primária */
    color: #ffffff;
    &:hover {
      background-color: #3b452e;
    }
  }
  
  /* Garantir que textos tenham contraste suficiente */
  p, .Description-BbZVu {
    color: #333333; /* Texto mais escuro para melhor contraste */
  }
`;

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
);

export default GlobalStyles;
