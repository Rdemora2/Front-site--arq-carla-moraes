import React from "react";
import PropTypes from "prop-types";
import tw from "twin.macro";
import styled from "styled-components";
import { RefreshCw, AlertTriangle, Home } from "react-feather";

const ErrorContainer = styled.div`
  ${tw`flex flex-col items-center justify-center min-h-screen p-5 text-center bg-gray-500`}
`;

const ErrorIcon = styled.div`
  ${tw`mb-4 text-red-500`}
  svg {
    ${tw`w-16 h-16`}
  }
`;

const ErrorTitle = styled.h2`
  ${tw`mb-2 text-2xl font-bold text-gray-800`}
`;

const ErrorMessage = styled.p`
  ${tw`mb-6 text-gray-600 max-w-md`}
`;

const ErrorDetails = styled.details`
  ${tw`mb-6 p-4 bg-gray-100 rounded-lg text-left max-w-2xl`}
`;

const Button = styled.button`
  ${tw`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200`}

  &:disabled {
    ${tw`opacity-50 cursor-not-allowed`}
  }

  svg {
    ${tw`w-4 h-4 mr-2`}
  }
`;

const RetryButton = styled(Button)`
  ${tw`mr-3 bg-primary-600 hover:bg-primary-700 focus:ring-primary-500`}
`;

const HomeButton = styled(Button)`
  ${tw`bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500`}
  svg {
    ${tw`w-4 h-4 mr-2`}
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = Date.now().toString();

    // Em desenvolvimento, mostra detalhes completos
    if (process.env.NODE_ENV === "development") {
      console.group(`🚨 Error Boundary [${errorId}]`);
      console.error("Error:", error);
      console.error("Error Info:", errorInfo);
      console.error("Component Stack:", errorInfo.componentStack);
      console.groupEnd();
    }

    this.reportError(error, errorInfo, errorId);

    this.setState({
      error,
      errorInfo,
      errorId,
    });
  }

  reportError(_error, _errorInfo, _errorId) {
    // Integração futura com Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === "production") {
      // Exemplo: window.Sentry?.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry() {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  }

  handleGoHome() {
    window.location.href = "/";
  }

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === "development";

      return (
        <ErrorContainer role="alert">
          <ErrorIcon>
            <AlertTriangle />
          </ErrorIcon>

          <ErrorTitle>Ops! Algo deu errado</ErrorTitle>

          <ErrorMessage>
            Encontramos um erro inesperado. Nossos desenvolvedores foram
            notificados e estão trabalhando para resolver isso.
          </ErrorMessage>

          {isDevelopment && this.state.error && (
            <ErrorDetails>
              <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                Detalhes do erro (somente em desenvolvimento)
              </summary>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "12px",
                  marginTop: "10px",
                  color: "#dc2626",
                }}
              >
                {this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </ErrorDetails>
          )}

          <div className="flex space-x-3">
            <RetryButton onClick={this.handleRetry}>
              <RefreshCw />
              Tentar Novamente
            </RetryButton>

            <HomeButton onClick={this.handleGoHome}>
              <Home />
              Voltar ao Início
            </HomeButton>
          </div>

          {isDevelopment && this.state.errorId && (
            <p className="text-xs text-gray-400 mt-4">
              ID do erro: {this.state.errorId}
            </p>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.func,
  onError: PropTypes.func,
  showDetails: PropTypes.bool,
};

ErrorBoundary.defaultProps = {
  children: null,
  fallback: null,
  onError: null,
  showDetails: process.env.NODE_ENV === "development",
};

export default ErrorBoundary;
