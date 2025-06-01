"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import tw from "twin.macro";
import styled, { css, keyframes } from "styled-components";
import { useFormValidation } from "../../hooks/useFormValidation";
import { FormInput, FormTextArea, FormCheckbox } from "./FormElements";
import { trackEvent } from "../misc/Analytics";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideInUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 0.99; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

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

const ContactForm = ({
  heading = "Entre em contato conosco",
  description = "Estamos disponíveis para responder suas dúvidas e transformar seu projeto em realidade.",
  submitButtonText = "Enviar mensagem",
  formAction = "#",
  formMethod = "POST",
  phoneNumber = "(11) 99985-4345",
  emailAddress = "arq.carlamoraes@gmail.com",
}) => {
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  // Configuração do formulário com validação
  const form = useFormValidation(
    {
      nome: "",
      email: "",
      telefone: "",
      mensagem: "",
      privacy: false,
    },
    {
      // Configurações específicas do formulário
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
            if (!value) return null;
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

  // Simular envio do formulário
  const handleFormSubmit = async (formData) => {
    try {
      setSubmitStatus(null);

      // Track evento de tentativa de envio
      trackEvent("form_submit_attempt", "contact", "contact_form");

      // Simular delay de envio
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Aqui você integraria com sua API
      console.log("Dados do formulário:", formData);

      // Simular sucesso (90% das vezes)
      if (Math.random() > 0.1) {
        setSubmitStatus("success");
        form.resetForm();

        // Track evento de sucesso
        trackEvent("form_submit_success", "contact", "contact_form");
      } else {
        throw new Error("Erro simulado");
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setSubmitStatus("error");

      // Track evento de erro
      trackEvent("form_submit_error", "contact", "contact_form");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await form.handleSubmit(handleFormSubmit);
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
                placeholder="(11) 99999-9999"
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

              <FormCheckbox
                name="privacy"
                checked={form.values.privacy}
                onChange={form.handleChange}
                error={form.errors.privacy}
                delay="0.5s"
                label='Ao enviar, você concorda com nossa <a href="/privacy-policy" target="_blank">política de privacidade</a> e <a href="/terms" target="_blank">termos de serviço</a>.'
              />

              {submitStatus === "success" && (
                <SuccessMessage>
                  <SuccessIcon />
                  <div>
                    <strong>Mensagem enviada com sucesso!</strong>
                    <p>Entraremos em contato em breve.</p>
                  </div>
                </SuccessMessage>
              )}

              {submitStatus === "error" && (
                <ErrorMessage>
                  <ErrorIcon />
                  <div>
                    <strong>Erro ao enviar mensagem</strong>
                    <p>Tente novamente ou entre em contato por telefone.</p>
                  </div>
                </ErrorMessage>
              )}

              <SubmitButton
                type="submit"
                disabled={!form.isFormValid || form.isSubmitting}
                isLoading={form.isSubmitting}
              >
                {form.isSubmitting ? (
                  <>
                    <LoadingSpinner />
                    Enviando...
                  </>
                ) : (
                  submitButtonText
                )}
              </SubmitButton>
            </Form>
          </RightColumn>
        </TwoColumn>
      </Content>
    </Container>
  );
};

// PropTypes para o componente
ContactForm.propTypes = {
  heading: PropTypes.string,
  description: PropTypes.string,
  submitButtonText: PropTypes.string,
  formAction: PropTypes.string,
  formMethod: PropTypes.string,
  illustrationImageSrc: PropTypes.string,
  className: PropTypes.string,
  onSubmitSuccess: PropTypes.func,
  onSubmitError: PropTypes.func,
  showIllustration: PropTypes.bool,
  customValidation: PropTypes.object,
  trackingEnabled: PropTypes.bool,
};

ContactForm.defaultProps = {
  heading: "Entre em contato conosco",
  description:
    "Estamos aqui para transformar seus sonhos em realidade através de projetos paisagísticos únicos e personalizados.",
  submitButtonText: "Enviar Mensagem",
  formAction: "https://formspree.io/f/mzzbowjl",
  formMethod: "POST",
  illustrationImageSrc: "/images/components/forms/email-illustration.svg",
  showIllustration: true,
  trackingEnabled: true,
};

export default ContactForm;
