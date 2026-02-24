import React from "react";
import { createGlobalStyle } from "styled-components";
import tw, { GlobalStyles as BaseStyles } from "twin.macro";

const ModalStyles = `
  /* Below animations are for modal created using React-Modal */
  .ReactModal__Overlay {
    transition: transform 300ms ease-in-out;
    transition-delay: 100ms;
    transform: scale(0);
  }
  .ReactModal__Overlay--after-open{
    transform: scale(1);
  }
  .ReactModal__Overlay--before-close{
    transform: scale(0);
  }
`;

const CustomStyles = createGlobalStyle([
  `
  :root {
    --color-primary: #6b7959;
    --color-primary-text: #3e4d2c;
    --color-background: #fcfaf7;
    --color-gold: #a99960;
    --color-secondary: #91a082;
  }

  html {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    -webkit-text-size-adjust: 100%;
  }

  body {
    -webkit-tap-highlight-color: transparent;
    `,
  tw`antialiased`,
  `
    background-color: var(--color-background);
    overflow-x: hidden;
  }

  body.nav-open {
    overflow: hidden;
    position: fixed;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 1023px) {
    * {
      -webkit-tap-highlight-color: transparent;
    }
    
    button, a, input, textarea, select {
      min-height: 44px;
      min-width: 44px;
    }
    
    input, textarea, select {
      font-size: 16px !important; /* Prevents iOS zoom on focus */
    }
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

  `,
  ModalStyles,
  `
`,
]);

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
);

export default GlobalStyles;
