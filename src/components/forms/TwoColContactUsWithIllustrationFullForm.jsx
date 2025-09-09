"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import tw from "twin.macro";
import styled, { css, keyframes } from "styled-components";
import { useFormValidation } from "../../hooks/useFormValidation";
import { FormInput, FormTextArea } from "./FormElements";
import { trackEvent } from "../misc/Analytics";
import ReactModalAdapter from "../../helpers/ReactModalAdapter";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideInUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 0.99; }
`;

// Removido 'pulse' pois não estava sendo usado

// Container principal do formulário

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
`;

const Container = styled.div`
  ${tw`relative -mt-2 mb-4`}
  animation: ${fadeIn} 0.6s ease-out;
`;

const Content = tw.div`max-w-screen-xl mx-auto py-4 lg:py-8`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;

const LeftColumn = styled(Column)`
  ${tw`md:w-6/12 lg:pr-12 md:pr-6 flex flex-col justify-center`}
  animation: ${fadeIn} 0.8s ease-out;
`;

const RightColumn = styled(Column)`
  ${tw`md:w-5/12 mt-6 md:mt-0`}
  animation: ${slideInUp} 0.5s ease-out forwards;
`;

const Heading = styled.h2`
  ${tw`text-3xl sm:text-4xl font-bold`}
  color: var(--color-primary-text);

  &:hover {
    text-shadow: 0 0 15px rgba(107, 121, 89, 0.3);
    transition: text-shadow 0.3s ease;
  }
`;

const Description = tw.p`mt-3 text-base text-gray-600 max-w-md`;

const InfoBlock = styled.div`
  ${tw`flex items-center mt-5`}
  animation: ${fadeIn} 0.6s ease-out;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(5px);
  }
`;

const IconContainer = styled.div`
  ${tw`flex items-center justify-center p-3 rounded-full transition-all duration-300`}
  background-color: var(--color-secondary);
  color: var(--color-primary-text);

  svg {
    ${tw`w-6 h-6`}
    transition: transform 0.3s ease;
  }

  &:hover {
    background-color: var(--color-primary);
    box-shadow: 0 5px 15px rgba(107, 121, 89, 0.3);

    svg {
      transform: scale(1.15);
      color: white;
    }
  }
`;

const InfoText = tw.div`ml-4`;
const InfoTitle = tw.h6`text-lg font-semibold`;
const InfoValue = tw.p`text-gray-600`;

const Form = tw.form`mt-4 md:mt-6 text-sm flex flex-col`;

const SubmitButton = styled.button`
  ${tw`inline-block px-10 py-3 font-bold rounded transition duration-300 w-full`}
  animation: ${slideInUp} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: 0.6s;

  ${(props) =>
    props.disabled
      ? tw`bg-gray-300 text-gray-500 cursor-not-allowed`
      : css`
          background-color: var(--color-primary);
          color: white;
          position: relative;
          overflow: hidden;

          &:before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.2),
              transparent
            );
            transition: all 0.6s ease;
          }

          &:hover {
            background-color: var(--color-primary-text);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(62, 77, 44, 0.3);

            &:before {
              left: 100%;
            }
          }

          &:active {
            transform: translateY(0);
            box-shadow: none;
          }

          &:focus {
            box-shadow: 0 0 0 2px var(--color-secondary);
          }
        `}
`;

// Mensagens de feedback
const SuccessMessage = styled.div`
  ${tw`flex items-start p-4 mb-4 rounded-lg border`}
  background-color: #f0fdf4;
  border-color: #10b981;
  color: #065f46;
  animation: ${fadeIn} 0.5s ease-out;

  svg {
    ${tw`w-5 h-5 mr-3 flex-shrink-0`}
    margin-top: 0.125rem;
    color: #10b981;
  }

  p {
    ${tw`mt-1 text-sm`}
  }
`;

const ErrorMessage = styled.div`
  ${tw`flex items-start p-4 mb-4 rounded-lg border`}
  background-color: #fef2f2;
  border-color: #ef4444;
  color: #991b1b;
  animation: ${shake} 0.4s ease-in-out;

  svg {
    ${tw`w-5 h-5 mr-3 flex-shrink-0`}
    margin-top: 0.125rem;
    color: #ef4444;
  }

  p {
    ${tw`mt-1 text-sm`}
  }
`;

// Spinner de loading
const LoadingSpinner = styled.div`
  ${tw`inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2`}
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Ícones para mensagens
const SuccessIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const DevelopmentModal = styled(ReactModalAdapter)`
  .ReactModal__Overlay {
    ${tw`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4`}
    z-index: 9999 !important;
    animation: ${fadeIn} 0.3s ease-out;
  }

  .ReactModal__Content {
    ${tw`bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative border-none outline-none`}
    animation: ${slideInUp} 0.4s ease-out;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-height: 90vh;
    overflow-y: auto;
    position: relative !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    margin: 0 !important;
  }
`;

const ModalHeader = styled.div`
  ${tw`text-center mb-6`}
`;

const ModalIcon = styled.div`
  ${tw`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center`}
  background-color: #fef3cd;
  color: #d69e2e;
`;

const ModalTitle = styled.h3`
  ${tw`text-xl font-bold mb-2`}
  color: var(--color-primary-text);
`;

const ModalText = styled.p`
  ${tw`text-gray-600 text-sm leading-relaxed mb-6`}
`;

const ModalButtons = styled.div`
  ${tw`flex flex-col gap-3`}
`;

const WhatsAppButton = styled.button`
  ${tw`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2`}
  background-color: #25d366;

  &:hover {
    background-color: #128c7e;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(37, 211, 102, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CloseButton = styled.button`
  ${tw`w-full py-3 px-6 rounded-lg font-semibold border-2 transition-all duration-300`}
  color: var(--color-primary-text);
  border-color: var(--color-primary-text);

  &:hover {
    background-color: var(--color-primary-text);
    color: white;
  }
`;

const CloseIconButton = styled.button`
  ${tw`absolute w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200`}
  top: 1rem;
  right: 1rem;
  color: #6b7280;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

const InfoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
);

const ContactForm = ({
  heading = "Entre em contato conosco",
  description = "Estamos aqui para transformar seus sonhos em realidade através de projetos paisagísticos únicos e personalizados.",
  submitButtonText = "Enviar Mensagem",
  phoneNumber = "(11) 99985-4345",
  emailAddress = "arq.carlamoraes@gmail.com",
}) => {
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);

  const openWhatsApp = () => {
    const userMessage =
      form.values.mensagem?.trim() ||
      "solicitar informações sobre os serviços de arquitetura paisagística";
    const fullMessage = `Olá! Vim por meio do formulário do website e gostaria de falar do seguinte tema: ${userMessage}`;
    const message = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://wa.me/5511999854345?text=${message}`;
    window.open(whatsappUrl, "_blank");
    setShowDevelopmentModal(false);
  };

  const closeDevelopmentModal = () => {
    setShowDevelopmentModal(false);
  };

  const form = useFormValidation(
    {
      nome: "",
      email: "",
      telefone: "",
      mensagem: "",
      privacy: false,
    },
    {
      nome: {
        rules: [
          (value) => (!value?.trim() ? "Nome é obrigatório" : null),
          (value) =>
            value?.trim().length < 2
              ? "Nome deve ter pelo menos 2 caracteres"
              : null,
          (value) => (value?.trim().length > 100 ? "Nome muito longo" : null),
        ],
        sanitize: (value) => value?.trim().replace(/\s+/g, " "),
      },
      email: {
        rules: [
          (value) => (!value?.trim() ? "Email é obrigatório" : null),
          (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return value && !emailRegex.test(value) ? "Email inválido" : null;
          },
        ],
        sanitize: (value) => value?.trim().toLowerCase(),
      },
      telefone: {
        rules: [
          (value) => {
            if (!value || !value.trim()) return null;
            const phoneRegex =
              /^(\+55\s?)?(\(?[0-9]{2}\)?\s?)?[0-9]{4,5}[\s-]?[0-9]{4}$/;
            return !phoneRegex.test(value.replace(/\s/g, ""))
              ? "Telefone inválido"
              : null;
          },
        ],
        format: (value) => {
          if (!value) return "";
          const digits = value.replace(/\D/g, "");
          if (digits.length === 11) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
          }
          return value;
        },
      },
      mensagem: {
        rules: [
          (value) => (!value?.trim() ? "Mensagem é obrigatória" : null),
          (value) =>
            value?.trim().length < 10
              ? "Mensagem muito curta (mínimo 10 caracteres)"
              : null,
          (value) =>
            value?.trim().length > 2000
              ? "Mensagem muito longa (máximo 2000 caracteres)"
              : null,
        ],
        sanitize: (value) => value?.trim(),
      },
      privacy: {
        rules: [
          (value) =>
            !value ? "Você deve aceitar nossa política de privacidade" : null,
        ],
      },
    }
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.isFormValid) {
      const firstError = Object.keys(form.errors).find(
        (key) => form.errors[key]
      );
      if (firstError) {
        const element = document.querySelector(`[name="${firstError}"]`);
        if (element) element.focus();
      }
      return;
    }

    // Abre o modal de desenvolvimento
    setShowDevelopmentModal(true);

    // Track evento de tentativa de envio
    trackEvent("form_submit_attempt", "contact", "contact_form_dev_modal");
  };

  return (
    <Container>
      <Content>
        <TwoColumn>
          <LeftColumn>
            <Heading>{heading}</Heading>
            <Description>{description}</Description>

            <InfoBlock>
              <IconContainer>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                </svg>
              </IconContainer>
              <InfoText>
                <InfoTitle>Telefone</InfoTitle>
                <InfoValue>{phoneNumber}</InfoValue>
              </InfoText>
            </InfoBlock>

            <InfoBlock>
              <IconContainer>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </IconContainer>
              <InfoText>
                <InfoTitle>Email</InfoTitle>
                <InfoValue>{emailAddress}</InfoValue>
              </InfoText>
            </InfoBlock>
          </LeftColumn>

          <RightColumn>
            <Form onSubmit={onSubmit}>
              <FormInput
                type="text"
                name="nome"
                label="Seu Nome"
                value={form.getFormattedValue("nome")}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.nome}
                showSuccess={true}
                delay="0.1s"
                maxLength={100}
                showCharCount={false}
                required
                aria-describedby="nome-help"
              />

              <FormInput
                type="email"
                name="email"
                label="Seu Email"
                value={form.getFormattedValue("email")}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.email}
                showSuccess={true}
                delay="0.2s"
                maxLength={320}
                showCharCount={false}
                required
                aria-describedby="email-help"
              />

              <FormInput
                type="tel"
                name="telefone"
                label="Seu Telefone (opcional)"
                value={form.getFormattedValue("telefone")}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.telefone}
                showSuccess={true}
                delay="0.3s"
                helperText="Formato: (11) 99999-9999"
              />

              <FormTextArea
                name="mensagem"
                label="Sua Mensagem"
                value={form.getFormattedValue("mensagem")}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.mensagem}
                showSuccess={true}
                delay="0.4s"
                rows={6}
                maxLength={2000}
                showCharCount={true}
                required
                helperText="Conte-nos sobre seu projeto paisagístico"
              />

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                  }}
                >
                  <input
                    type="checkbox"
                    name="privacy"
                    checked={form.values.privacy}
                    onChange={form.handleChange}
                    style={{
                      width: "18px",
                      height: "18px",
                      marginTop: "2px",
                      flexShrink: 0,
                      cursor: "pointer",
                      accentColor: "var(--color-primary)",
                    }}
                  />
                  <span
                    style={{
                      color: form.errors.privacy ? "#ef4444" : "#374151",
                    }}
                  >
                    Ao enviar, você concorda com nossa{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      style={{
                        color: "var(--color-primary)",
                        fontWeight: "500",
                        textDecoration: "underline",
                      }}
                    >
                      política de privacidade
                    </a>{" "}
                    e{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      style={{
                        color: "var(--color-primary)",
                        fontWeight: "500",
                        textDecoration: "underline",
                      }}
                    >
                      termos de serviço
                    </a>
                    .
                  </span>
                </label>
                {form.errors.privacy && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "0.875rem",
                      marginTop: "0.5rem",
                      marginLeft: "2.25rem",
                    }}
                  >
                    {form.errors.privacy}
                  </div>
                )}
              </div>

              <SubmitButton type="submit" disabled={!form.isFormValid}>
                {submitButtonText}
              </SubmitButton>
            </Form>
          </RightColumn>
        </TwoColumn>
      </Content>

      {/* Modal de desenvolvimento */}
      <DevelopmentModal
        isOpen={showDevelopmentModal}
        onRequestClose={closeDevelopmentModal}
        className="development-modal"
        overlayClassName="development-modal-overlay"
        closeTimeoutMS={300}
        ariaHideApp={false}
        style={{
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          },
          content: {
            position: "relative",
            top: "auto",
            left: "auto",
            right: "auto",
            bottom: "auto",
            border: "none",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "16px",
            outline: "none",
            padding: "32px",
            maxWidth: "448px",
            width: "100%",
            maxHeight: "90vh",
            margin: "0",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        }}
      >
        <CloseIconButton onClick={closeDevelopmentModal} aria-label="Fechar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
          </svg>
        </CloseIconButton>

        <ModalHeader>
          <ModalIcon>
            <InfoIcon />
          </ModalIcon>
          <ModalTitle>Formulário em Desenvolvimento</ModalTitle>
        </ModalHeader>

        <ModalText>
          Nosso formulário de contato ainda está em desenvolvimento. Por
          enquanto, você pode entrar em contato conosco diretamente pelo
          WhatsApp para discutir seu projeto ou tirar suas dúvidas.
        </ModalText>

        <ModalButtons>
          <WhatsAppButton onClick={openWhatsApp}>
            <WhatsAppIcon />
            Falar no WhatsApp
          </WhatsAppButton>
          <CloseButton onClick={closeDevelopmentModal}>Entendi</CloseButton>
        </ModalButtons>
      </DevelopmentModal>
    </Container>
  );
};

ContactForm.propTypes = {
  heading: PropTypes.string,
  description: PropTypes.string,
  submitButtonText: PropTypes.string,
  phoneNumber: PropTypes.string,
  emailAddress: PropTypes.string,
};

ContactForm.defaultProps = {
  heading: "Entre em contato conosco",
  description:
    "Estamos aqui para transformar seus sonhos em realidade através de projetos paisagísticos únicos e personalizados.",
  submitButtonText: "Enviar Mensagem",
  phoneNumber: "(11) 99985-4345",
  emailAddress: "arq.carlamoraes@gmail.com",
};

export default ContactForm;
