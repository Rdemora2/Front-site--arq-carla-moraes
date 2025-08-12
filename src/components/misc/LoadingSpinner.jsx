/* eslint-disable react/prop-types */
import React from "react";
import styled, { keyframes } from "styled-components";
import tw from "twin.macro";

// Animações
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
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

// Conteúdo do loading
const LoadingContent = styled.div`
  ${tw`text-center p-8 rounded-lg`}
  background: rgba(255, 255, 255, 0.9);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

// Spinner principal
const Spinner = styled.div`
  width: 64px;
  height: 64px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3e4d2c;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 1.5rem auto;
`;

// Texto principal
const LoadingText = styled.div`
  ${tw`text-lg font-semibold mb-2`}
  color: #3e4d2c;
  animation: ${pulse} 2s ease-in-out infinite;
`;

// Subtexto
const LoadingSubtext = styled.div`
  ${tw`text-sm opacity-75`}
  color: #6b7280;
`;

// Dots animados
const DotsContainer = styled.div`
  ${tw`flex justify-center mt-4 space-x-1`}
`;

const Dot = styled.div`
  ${tw`w-2 h-2 rounded-full`}
  background-color: #3e4d2c;
  animation: ${pulse} 1.4s ease-in-out infinite both;
  animation-delay: ${(props) => props.delay || "0s"};
`;

// Componente principal
const LoadingSpinner = ({
  text = "Carregando...",
  subtext = "Aguarde um momento",
  showDots = true,
  size = "normal",
  overlay = true,
}) => {
  const spinnerSize =
    size === "small" ? "32px" : size === "large" ? "80px" : "64px";

  if (!overlay) {
    return (
      <LoadingContent>
        <Spinner style={{ width: spinnerSize, height: spinnerSize }} />
        <LoadingText>{text}</LoadingText>
        <LoadingSubtext>{subtext}</LoadingSubtext>
        {showDots && (
          <DotsContainer>
            <Dot delay="0s" />
            <Dot delay="0.2s" />
            <Dot delay="0.4s" />
          </DotsContainer>
        )}
      </LoadingContent>
    );
  }

  return (
    <LoadingContainer>
      <LoadingContent>
        <Spinner style={{ width: spinnerSize, height: spinnerSize }} />
        <LoadingText>{text}</LoadingText>
        <LoadingSubtext>{subtext}</LoadingSubtext>
        {showDots && (
          <DotsContainer>
            <Dot delay="0s" />
            <Dot delay="0.2s" />
            <Dot delay="0.4s" />
          </DotsContainer>
        )}
      </LoadingContent>
    </LoadingContainer>
  );
};

// Loading específico para páginas
export const PageLoadingSpinner = () => (
  <LoadingSpinner
    text="Carregando página..."
    subtext="Preparando o conteúdo para você"
    size="large"
  />
);

// Loading específico para componentes
export const ComponentLoadingSpinner = () => (
  <LoadingSpinner
    text="Carregando..."
    subtext="Aguarde um momento"
    size="normal"
    overlay={false}
  />
);

// Loading específico para imagens
export const ImageLoadingSpinner = () => (
  <LoadingSpinner
    text="Carregando imagem..."
    subtext=""
    size="small"
    showDots={false}
    overlay={false}
  />
);

export default LoadingSpinner;
