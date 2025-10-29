/* eslint-disable react/prop-types */
import React from "react";
import styled, { keyframes } from "styled-components";
import tw from "twin.macro";

// Animações
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Container principal do loading
const LoadingContainer = styled.div`
  ${tw`fixed inset-0 flex items-center justify-center z-50`}
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  animation: ${fadeIn} 0.3s ease-in-out;
`;

// Spinner principal
const Spinner = styled.div`
  width: 64px;
  height: 64px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3e4d2c;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// Componente principal
const LoadingSpinner = ({ size = "normal", overlay = true }) => {
  const spinnerSize =
    size === "small" ? "32px" : size === "large" ? "80px" : "64px";

  if (!overlay) {
    return <Spinner style={{ width: spinnerSize, height: spinnerSize }} />;
  }

  return (
    <LoadingContainer>
      <Spinner style={{ width: spinnerSize, height: spinnerSize }} />
    </LoadingContainer>
  );
};

// Loading específico para páginas
export const PageLoadingSpinner = () => <LoadingSpinner size="large" />;

// Loading específico para componentes
export const ComponentLoadingSpinner = () => (
  <LoadingSpinner size="normal" overlay={false} />
);

// Loading específico para imagens
export const ImageLoadingSpinner = () => (
  <LoadingSpinner size="small" overlay={false} />
);

export default LoadingSpinner;
