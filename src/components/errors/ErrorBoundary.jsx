import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { RefreshCw, AlertTriangle, Home } from "react-feather";

const ErrorContainer = styled.div`
  ${tw`flex flex-col items-center justify-center min-h-screen p-5 text-center bg-gray-50`}
`;

const ErrorIcon = styled.div`
  ${tw`mb-6 text-red-500`}
  svg {
    ${tw`w-16 h-16`}
  }
`;

const ErrorHeading = styled.h1`
  ${tw`text-2xl font-bold text-gray-800 mb-4`}
`;

const ErrorMessage = styled.div`
  ${tw`text-gray-600 mb-8 max-w-md leading-relaxed`}
`;

const ErrorDetails = styled.details`
  ${tw`mb-8 max-w-md text-left`}
  summary {
    ${tw`cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2`}
  }
  pre {
    ${tw`text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32 text-red-600`}
  }
`;

const ButtonGroup = styled.div`
  ${tw`flex gap-4 flex-col sm:flex-row`}
`;

const Button = styled.button`
  ${tw`px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
`;

const RetryButton = styled(Button)`
  ${tw`bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500`}
  svg {
    ${tw`w-4 h-4 mr-2`}
  }
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
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = Date.now().toString();
    
    // Log detalhado do erro
    console.group(`🚨 Error Boundary [${errorId}]`);
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
    console.error("Component Stack:", errorInfo.componentStack);
    console.groupEnd();

    // Reportar erro para serviço de monitoramento (se configurado)
    this.reportError(error, errorInfo, errorId);

    this.setState({
      error,
      errorInfo,
      errorId,
    });
  }

  reportError = (error, errorInfo, errorId) => {
    // Integração futura com Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // Exemplo: window.Sentry?.captureException(error, { extra: errorInfo });
    }
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, errorId: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return (
        <ErrorContainer role="alert">
          <ErrorIcon>
            <AlertTriangle />
          </ErrorIcon>
          
          <ErrorHeading>Oops! Algo deu errado</ErrorHeading>
          
          <ErrorMessage>
            Pedimos desculpas pelo inconveniente. Ocorreu um erro inesperado 
            e nossa equipe foi notificada automaticamente.
          </ErrorMessage>

          {isDevelopment && this.state.error && (
            <ErrorDetails>
              <summary>Detalhes técnicos (desenvolvimento)</summary>
              <pre>
                {this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </ErrorDetails>
          )}

          <ButtonGroup>
            <RetryButton onClick={this.handleRetry}>
              <RefreshCw />
              Tente Novamente
            </RetryButton>
            
            <HomeButton onClick={this.handleGoHome}>
              <Home />
              Voltar ao Início
            </HomeButton>
          </ButtonGroup>

          {this.state.errorId && (
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

export default ErrorBoundary;
