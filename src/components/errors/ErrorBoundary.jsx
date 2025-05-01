import React from "react";
import tw from "twin.macro";
import styled from "styled-components";

const ErrorContainer = styled.div`
  ${tw`flex flex-col items-center justify-center min-h-screen p-5 text-center bg-red-50`}
`;

const ErrorHeading = styled.h1`
  ${tw`text-2xl font-bold text-red-700 mb-4`}
`;

const ErrorMessage = styled.div`
  ${tw`text-gray-700 mb-6`}
`;

const RetryButton = styled.button`
  ${tw`bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-300`}
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error boundary capturou um erro:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorHeading>Algo deu errado</ErrorHeading>
          <ErrorMessage>
            Pedimos desculpas pelo inconveniente. Nossa equipe foi notificada e
            está trabalhando para resolver o problema.
          </ErrorMessage>
          <RetryButton onClick={() => window.location.reload()}>
            Tente Novamente
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
