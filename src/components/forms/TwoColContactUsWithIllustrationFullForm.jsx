"use client";

import React, { useState } from "react";
import tw from "twin.macro";
import styled, { css, keyframes } from "styled-components";

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

const inputStyles = css`
  ${tw`border-2 px-5 py-3 rounded focus:outline-none font-medium transition duration-300 border-gray-300 mb-5`}
  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 1px var(--color-primary);
  }
  &:hover {
    border-color: var(--color-secondary);
  }
`;

const Input = styled.input`
  ${inputStyles}
  animation: ${slideInUp} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: ${(props) => props.delay || "0s"};
`;

const TextArea = styled.textarea`
  ${inputStyles}
  ${tw`h-32 resize-none`}
  animation: ${slideInUp} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: 0.3s;
`;

const CheckboxContainer = styled.div`
  ${tw`flex items-center mb-5`}
  animation: ${slideInUp} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: 0.4s;

  &:hover label {
    color: var(--color-primary-text);
  }
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  ${tw`mr-2`}
  &:checked {
    accent-color: var(--color-primary);
  }

  &:hover {
    cursor: pointer;
    transform: scale(1.2);
    transition: transform 0.2s ease;
  }
`;

const CheckboxLabel = styled.label`
  ${tw`text-gray-600 cursor-pointer select-none`}
  transition: color 0.3s ease;
`;

const PrivacyPolicy = styled.a`
  color: var(--color-primary);
  ${tw`font-bold`}
  transition: all 0.3s ease;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -2px;
    left: 0;
    background-color: var(--color-gold);
    transition: width 0.3s ease;
  }

  &:hover {
    color: var(--color-gold);

    &:after {
      width: 100%;
    }
  }
`;

const SubmitButton = styled.button`
  ${tw`inline-block px-10 py-3 font-bold rounded transition duration-300`}
  animation: ${slideInUp} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: 0.5s;

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

const ContactForm = ({
  heading = "Entre em contato conosco",
  description = "Estamos disponíveis para responder suas dúvidas e transformar seu projeto em realidade.",
  submitButtonText = "Enviar mensagem",
  formAction = "#",
  formMethod = "POST",
  phoneNumber = "(11) 99985-4345",
  emailAddress = "arq.carlamoraes@gmail.com",
}) => {
  const [agreed, setAgreed] = useState(false);

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
            <Form action={formAction} method={formMethod}>
              <Input
                type="text"
                name="nome"
                placeholder="Seu Nome"
                delay="0.1s"
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Seu Email"
                delay="0.2s"
                required
              />
              <Input
                type="tel"
                name="telefone"
                placeholder="Seu Telefone"
                delay="0.3s"
              />
              <TextArea
                name="mensagem"
                placeholder="Sua Mensagem"
                defaultValue=""
                rows={6}
                required
              />
              <CheckboxContainer>
                <Checkbox
                  id="privacy"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <CheckboxLabel htmlFor="privacy">
                  Ao enviar, você concorda com nossa{" "}
                  <PrivacyPolicy href="#">
                    política de privacidade
                  </PrivacyPolicy>
                  .
                </CheckboxLabel>
              </CheckboxContainer>
              <SubmitButton type="submit" disabled={!agreed}>
                {submitButtonText}
              </SubmitButton>
            </Form>
          </RightColumn>
        </TwoColumn>
      </Content>
    </Container>
  );
};

export default ContactForm;
