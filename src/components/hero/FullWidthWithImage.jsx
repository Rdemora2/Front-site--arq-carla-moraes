import React from "react";
import tw from "twin.macro";
import styled from "styled-components";

import Header, {
  LogoLink,
  NavLinks,
  NavLink as NavLinkBase,
} from "../navbar/navbar.jsx";

const StyledHeader = styled(Header)`
  ${tw`justify-between py-4`}
  ${LogoLink} {
    ${tw`mr-8 pb-0`}
  }  @media (max-width: 1024px) {
    background-color: rgba(249, 245, 239, 0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    position: relative;
    z-index: 20;
    padding: 0.625rem 1.875rem;
    width: calc(100% + 4rem);
    margin-left: -2rem;
    margin-right: -2rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
  }
  nav:first-child {
    @media (min-width: 1024px) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
  & > div:last-child {
    @media (max-width: 1024px) {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0;
      padding: 0;
    }
      ${LogoLink} {
      @media (max-width: 1024px) {
        margin-right: 0;
        flex-shrink: 0;
      }
    }
  }
`;

const NavLink = tw(NavLinkBase)`
  sm:text-sm sm:mx-6
`;

const Container = tw.div`relative -mx-8 -mt-8 min-h-screen`;
const TwoColumn = tw.div`flex flex-col lg:flex-row min-h-screen`;
const LeftColumn = styled.div`
  ${tw`ml-8 mr-8 xl:pl-10 flex flex-col justify-center relative z-10`}  @media (max-width: 1024px) {
    margin-left: 0;
    margin-right: 0;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 0;
    padding-bottom: 0;
    position: relative;
    height: calc(100vh - 4.5rem);
    display: flex;
    flex-direction: column;
    
    &::before {
      content: "";
      position: absolute;
      top: -4.5rem;
      left: -2rem;
      right: -2rem;
      bottom: 0;
      background-image: url("/images/components/hero/Modern-hero.webp");
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      filter: blur(1px);
      z-index: -10;
      height: 100vh;
    }
  }
`;
const RightColumn = styled.div`
  ${tw`bg-cover bg-center xl:ml-20 lg:w-1/2 lg:flex-1 min-h-screen lg:min-h-full`}
  @media (max-width: 1024px) {
    display: none;
  }

  .hero-image {
    ${tw`w-full h-full min-h-screen lg:min-h-full`}
  }
`;

const Content = styled.div`
  ${tw`mt-8 lg:mt-24 lg:mb-24 flex flex-col sm:items-center lg:items-stretch`}  @media (max-width: 1024px) {
    position: relative;
    padding: 2rem;
    margin: 0 -2rem;
    margin-top: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: -1;
    }
  }
`;
const Heading = styled.h1`
  ${tw`text-3xl sm:text-5xl md:text-6xl lg:text-5xl font-black leading-none`}
  @media (max-width: 1024px) {
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    position: relative;
    z-index: 1;
  }
`;
const Paragraph = styled.p`
  ${tw`max-w-md my-8 lg:my-5 lg:my-8 sm:text-lg lg:text-base xl:text-lg leading-loose`}
  @media (max-width: 1024px) {
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    position: relative;
    z-index: 1;
  }
`;

const Actions = styled.div`
  ${tw`mb-8 lg:mb-0`}
  .action {
    ${tw`text-center inline-block w-full sm:w-48 py-4 font-semibold tracking-wide rounded hocus:outline-none focus:shadow-outline transition duration-300`}
  }
  .primaryAction {
    ${tw`bg-primary-500 text-gray-100 hover:bg-primary-700`}
  }
  .secondaryAction {
    ${tw`mt-4 sm:mt-0 sm:ml-4 bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-gray-800`}
  }
  @media (max-width: 1024px) {
    position: relative;
    z-index: 1;
  }
`;

const FullWidthWithImageComponent = ({
  navLinks = [
    <NavLinks key={1}>
      <NavLink href="/sobre-nos">Sobre</NavLink>
      <NavLink href="#">Projetos</NavLink>
      <NavLink href="#">Serviços</NavLink>
      <NavLink href="/contato">Contato</NavLink>
    </NavLinks>,
  ],
  heading = (
    <>
      Transformamos Espaços
      <wbr />
      <br />
      <span tw="text-primary-500">em Experiências Naturais.</span>
    </>
  ),
  description = "Há mais de 25 anos criando projetos paisagísticos exclusivos que harmonizam arquitetura e natureza. Do conceito à execução, trazemos beleza e propósito para cada ambiente.",
  primaryActionUrl = "/contato",
  primaryActionText = "Solicite um Orçamento",
  secondaryActionUrl = "#",
  secondaryActionText = "Nossos Projetos",
}) => {
  return (
    <Container>
      <TwoColumn>
        <LeftColumn>
          <StyledHeader links={navLinks} collapseBreakpointClass="sm" />
          <Content>
            <Heading>{heading}</Heading>
            <Paragraph>{description}</Paragraph>
            <Actions>
              <a href={primaryActionUrl} className="action primaryAction">
                {primaryActionText}
              </a>
              <a href={secondaryActionUrl} className="action secondaryAction">
                {secondaryActionText}
              </a>
            </Actions>
          </Content>
        </LeftColumn>
        <RightColumn>
          <img
            src="/images/components/hero/Frances-hero.webp"
            alt="Projeto arquitetônico paisagístico de um jardim francês"
            fetchpriority="high"
            width="1200"
            height="800"
            className="hero-image"
          />
        </RightColumn>
      </TwoColumn>
    </Container>
  );
};

export default FullWidthWithImageComponent;
