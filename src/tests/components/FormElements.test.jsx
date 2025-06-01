import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  FormInput,
  FormTextArea,
  FormCheckbox,
} from "../../components/forms/FormElements";
import { customRender } from "../utils/test-utils";

describe("FormElements", () => {
  describe("FormInput", () => {
    it("deve renderizar input básico", () => {
      customRender(
        <FormInput id="test-input" label="Nome" value="" onChange={() => {}} />
      );

      expect(screen.getByLabelText("Nome")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("deve mostrar label flutuante", async () => {
      const user = userEvent.setup();

      customRender(
        <FormInput id="test-input" label="Email" value="" onChange={() => {}} />
      );

      const input = screen.getByRole("textbox");

      await user.click(input);

      // Label deve estar posicionada como flutuante quando focado
      expect(screen.getByText("Email")).toBeInTheDocument();
    });

    it("deve exibir mensagem de erro", () => {
      customRender(
        <FormInput
          id="test-input"
          label="Email"
          value="email-inválido"
          error="Email inválido"
          onChange={() => {}}
        />
      );

      expect(screen.getByText("Email inválido")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveClass("error");
    });

    it("deve mostrar indicador de campo válido", () => {
      customRender(
        <FormInput
          id="test-input"
          label="Email"
          value="teste@email.com"
          isValid={true}
          onChange={() => {}}
        />
      );

      expect(screen.getByRole("textbox")).toHaveClass("valid");
    });

    it("deve mostrar contador de caracteres", () => {
      customRender(
        <FormInput
          id="test-input"
          label="Nome"
          value="João"
          maxLength={50}
          showCharacterCount={true}
          onChange={() => {}}
        />
      );

      expect(screen.getByText("4/50")).toBeInTheDocument();
    });

    it("deve chamar onChange corretamente", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      customRender(
        <FormInput
          id="test-input"
          label="Nome"
          value=""
          onChange={handleChange}
        />
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "João");

      expect(handleChange).toHaveBeenCalledTimes(4); // Uma chamada por caractere
    });

    it("deve aplicar máscara de telefone", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      customRender(
        <FormInput
          id="test-input"
          label="Telefone"
          value=""
          mask="phone"
          onChange={handleChange}
        />
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "11999999999");

      // Deve chamar onChange com valor formatado
      expect(handleChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "(11) 99999-9999",
          }),
        })
      );
    });

    it("deve ser acessível", () => {
      customRender(
        <FormInput
          id="test-input"
          label="Nome"
          value=""
          required={true}
          onChange={() => {}}
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-required", "true");
      expect(input).toHaveAttribute("id", "test-input");
      expect(screen.getByLabelText("Nome")).toBe(input);
    });

    it("deve suportar diferentes tipos", () => {
      customRender(
        <FormInput
          id="test-input"
          label="Senha"
          type="password"
          value=""
          onChange={() => {}}
        />
      );

      expect(screen.getByLabelText("Senha")).toHaveAttribute(
        "type",
        "password"
      );
    });
  });

  describe("FormTextArea", () => {
    it("deve renderizar textarea", () => {
      customRender(
        <FormTextArea
          id="test-textarea"
          label="Mensagem"
          value=""
          onChange={() => {}}
        />
      );

      expect(screen.getByLabelText("Mensagem")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("deve redimensionar automaticamente", async () => {
      const user = userEvent.setup();

      customRender(
        <FormTextArea
          id="test-textarea"
          label="Mensagem"
          value=""
          autoResize={true}
          onChange={() => {}}
        />
      );

      const textarea = screen.getByRole("textbox");
      const initialHeight = textarea.style.height;

      await user.type(textarea, "Linha 1\nLinha 2\nLinha 3\nLinha 4");

      // Altura deve ter aumentado
      expect(textarea.style.height).not.toBe(initialHeight);
    });

    it("deve mostrar contador de caracteres", () => {
      customRender(
        <FormTextArea
          id="test-textarea"
          label="Mensagem"
          value="Olá mundo"
          maxLength={100}
          showCharacterCount={true}
          onChange={() => {}}
        />
      );

      expect(screen.getByText("9/100")).toBeInTheDocument();
    });

    it("deve respeitar limite de caracteres", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      customRender(
        <FormTextArea
          id="test-textarea"
          label="Mensagem"
          value=""
          maxLength={10}
          onChange={handleChange}
        />
      );

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "12345678901234567890"); // 20 caracteres

      // Deve truncar para 10 caracteres
      expect(handleChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "1234567890",
          }),
        })
      );
    });
  });

  describe("FormCheckbox", () => {
    it("deve renderizar checkbox", () => {
      customRender(
        <FormCheckbox
          id="test-checkbox"
          label="Aceito os termos"
          checked={false}
          onChange={() => {}}
        />
      );

      expect(screen.getByLabelText("Aceito os termos")).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("deve alternar estado quando clicado", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      customRender(
        <FormCheckbox
          id="test-checkbox"
          label="Aceito os termos"
          checked={false}
          onChange={handleChange}
        />
      );

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            checked: true,
          }),
        })
      );
    });

    it("deve exibir como obrigatório", () => {
      customRender(
        <FormCheckbox
          id="test-checkbox"
          label="Aceito os termos"
          checked={false}
          required={true}
          onChange={() => {}}
        />
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-required", "true");
    });

    it("deve mostrar estado de erro", () => {
      customRender(
        <FormCheckbox
          id="test-checkbox"
          label="Aceito os termos"
          checked={false}
          error="Campo obrigatório"
          onChange={() => {}}
        />
      );

      expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });

    it("deve ser acessível com navegação por teclado", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      customRender(
        <FormCheckbox
          id="test-checkbox"
          label="Aceito os termos"
          checked={false}
          onChange={handleChange}
        />
      );

      const checkbox = screen.getByRole("checkbox");
      checkbox.focus();

      await user.keyboard(" "); // Espaço deve alternar o checkbox

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe("Integração e comportamentos avançados", () => {
    it("deve aplicar delay de animação", () => {
      customRender(
        <FormInput
          id="test-input"
          label="Nome"
          value=""
          delay="0.2s"
          onChange={() => {}}
        />
      );

      const container = screen.getByRole("textbox").closest("div");
      expect(container).toHaveStyle("animation-delay: 0.2s");
    });

    it("deve suportar ref forwarding", () => {
      const ref = React.createRef();

      customRender(
        <FormInput
          ref={ref}
          id="test-input"
          label="Nome"
          value=""
          onChange={() => {}}
        />
      );

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("deve validar PropTypes", () => {
      // Mock console.error para capturar warnings do PropTypes
      const originalError = console.error;
      console.error = jest.fn();

      // Renderiza com props inválidas
      customRender(
        <FormInput
          id={123} // Deve ser string
          label="Nome"
          value=""
          onChange="invalid" // Deve ser função
        />
      );

      expect(console.error).toHaveBeenCalled();
      console.error = originalError;
    });

    it("deve manter performance com muitos campos", () => {
      const start = performance.now();

      customRender(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <FormInput
              key={i}
              id={`input-${i}`}
              label={`Campo ${i}`}
              value=""
              onChange={() => {}}
            />
          ))}
        </div>
      );

      const end = performance.now();
      const renderTime = end - start;

      // Deve renderizar 100 campos em menos de 100ms
      expect(renderTime).toBeLessThan(100);
    });
  });
});
