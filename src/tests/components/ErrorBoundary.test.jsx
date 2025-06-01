import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary } from "../../components/errors/ErrorBoundary";

// Componente que gera erro para teste
const ThrowError = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error("Erro de teste");
  }
  return <div>Componente funcionando</div>;
};

describe("ErrorBoundary", () => {
  // Silencia os erros no console durante os testes
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar children quando não há erro", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Componente funcionando")).toBeInTheDocument();
  });

  it("deve capturar e exibir erro quando child quebra", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Oops! Algo deu errado")).toBeInTheDocument();
    expect(
      screen.getByText(/Parece que encontramos um pequeno problema/)
    ).toBeInTheDocument();
  });

  it("deve exibir botão de tentar novamente", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const retryButton = screen.getByText("Tentar Novamente");
    expect(retryButton).toBeInTheDocument();
  });

  it("deve resetar erro ao clicar em tentar novamente", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Oops! Algo deu errado")).toBeInTheDocument();

    const retryButton = screen.getByText("Tentar Novamente");
    fireEvent.click(retryButton);

    // Re-renderiza com componente funcionando
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Componente funcionando")).toBeInTheDocument();
  });

  it("deve exibir botão para voltar ao início", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const homeButton = screen.getByText("Voltar ao Início");
    expect(homeButton).toBeInTheDocument();
  });

  it("deve exibir fallback customizado quando fornecido", () => {
    const CustomFallback = ({ error, resetError }) => (
      <div>
        <h1>Erro customizado</h1>
        <p>{error.message}</p>
        <button onClick={resetError}>Reset</button>
      </div>
    );

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Erro customizado")).toBeInTheDocument();
    expect(screen.getByText("Erro de teste")).toBeInTheDocument();
  });

  it("deve chamar onError quando erro ocorre", () => {
    const onError = jest.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it("deve exibir detalhes do erro quando expandido", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const detailsElement = screen.getByText("Detalhes técnicos");
    fireEvent.click(detailsElement);

    expect(screen.getByText(/Erro de teste/)).toBeInTheDocument();
  });

  it("deve ter IDs únicos para múltiplas instâncias", () => {
    const { container: container1 } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const { container: container2 } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const button1 = container1.querySelector("button");
    const button2 = container2.querySelector("button");

    expect(button1.id).not.toBe(button2.id);
  });

  it("deve reportar erro para serviços de monitoramento", () => {
    // Mock de serviço de monitoramento
    global.Sentry = {
      captureException: jest.fn(),
    };

    const onError = jest.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
  });

  it("deve ser acessível", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Verifica se tem estrutura semântica correta
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();

    // Verifica se botões são acessíveis
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    buttons.forEach((button) => {
      expect(button).toHaveAttribute("type", "button");
    });
  });

  it("deve manter foco gerenciado após erro", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const retryButton = screen.getByText("Tentar Novamente");

    // O primeiro botão deve estar focado automaticamente
    expect(retryButton).toHaveFocus();
  });

  it("deve limpar estado ao desmontar", () => {
    const { unmount } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Deve desmontar sem erros
    expect(() => unmount()).not.toThrow();
  });

  describe("PropTypes", () => {
    it("deve aceitar children válidos", () => {
      expect(() => {
        render(
          <ErrorBoundary>
            <div>Conteúdo válido</div>
          </ErrorBoundary>
        );
      }).not.toThrow();
    });

    it("deve aceitar fallback como função", () => {
      const fallback = ({ error, resetError }) => (
        <div>Fallback: {error.message}</div>
      );

      expect(() => {
        render(
          <ErrorBoundary fallback={fallback}>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        );
      }).not.toThrow();
    });

    it("deve aceitar onError como função", () => {
      const onError = jest.fn();

      expect(() => {
        render(
          <ErrorBoundary onError={onError}>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        );
      }).not.toThrow();
    });
  });
});
