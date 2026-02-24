import React, { useEffect } from "react";
import PropTypes from "prop-types";
import tw from "twin.macro";
import styled from "styled-components";

import Header, {
  LogoLink,
  NavLinks,
  NavLink as NavLinkBase,
} from "../navbar/navbar.jsx";
import OptimizedImage from "components/misc/OptimizedImage.jsx";

const StyledHeader = styled(Header)`
  ${tw`justify-between py-4`}

  @media (min-width: 1024px) {
    max-width: none;
    margin-left: 0;
    margin-right: 0;
  }

  ${LogoLink} {
    ${tw`mr-8 pb-0`}
  }
  @media (max-width: 1024px) {
    background-color: var(--color-background);
    position: relative;
    z-index: 30;
    padding: 0.5rem 1.5rem;
    width: calc(100% + 3rem);
    margin-left: -1.5rem;
    margin-right: -1.5rem;
    height: 4rem;
    display: flex;
    align-items: center;
    box-shadow: none;
    border-bottom: none;
  }
  nav:first-child {
    @media (min-width: 1024px) {
      display: flex;
      justify-content: flex-start;
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

const Container = styled.div`
  ${tw`relative -mx-8 -mt-8 min-h-screen`}

  @media (max-width: 1024px) {
    min-height: auto;
    height: auto;
    max-height: none;
    overflow: visible;
  }
`;
const TwoColumn = tw.div`flex flex-col lg:flex-row min-h-screen`;

/* Imagem mobile exibida no topo */
const MobileHeroImage = styled.div`
  display: none;

  @media (max-width: 1024px) {
    display: block;
    position: relative;
    width: calc(100% + 3rem);
    margin-left: -1.5rem;
    margin-right: -1.5rem;
    height: 52vh;
    min-height: 280px;
    max-height: 420px;
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 80px;
      background: linear-gradient(to top, var(--color-background), transparent);
      pointer-events: none;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 30%;
      display: block;
    }
  }
`;

const LeftColumn = styled.div`
  ${tw`flex flex-col justify-center relative z-10`}

  @media (min-width: 1024px) {
    width: 50%;
    flex: none;
    padding-left: 3rem;
    padding-top: 1rem;
    padding-right: 2rem;
    margin-left: 1rem;
  }

  @media (max-width: 1024px) {
    margin-left: 0;
    margin-right: 0;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: 0;
    padding-bottom: 0;
    position: relative;
    min-height: auto;
    height: auto;
    max-height: none;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background);
  }
`;
const RightColumn = styled.div`
  ${tw`bg-cover bg-center min-h-screen lg:min-h-full`}

  @media (min-width: 1024px) {
    width: 50%;
    flex: none;
  }

  @media (max-width: 1024px) {
    display: none;
  }

  .hero-image {
    ${tw`w-full h-full min-h-screen lg:min-h-full object-cover`}
  }
`;

const Content = styled.div`
  ${tw`flex flex-col sm:items-center lg:items-stretch`}

  @media (min-width: 1024px) {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem 0;
  }

  @media (max-width: 1024px) {
    position: relative;
    padding: 0;
    margin: 0;
    margin-top: -2rem;
    flex: none;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: auto;
    max-height: none;
    padding-bottom: 2.5rem;
  }
`;

const Heading = styled.h1`
  ${tw`text-3xl sm:text-5xl md:text-6xl lg:text-5xl font-black leading-none`}
  @media (max-width: 1024px) {
    color: var(--color-primary-text);
    font-size: 1.75rem;
    line-height: 1.15;
    letter-spacing: -0.02em;
    text-shadow: none;
    position: relative;
    z-index: 1;
  }
`;
const Paragraph = styled.p`
  ${tw`max-w-lg my-8 lg:my-5 lg:my-8 text-lg lg:text-base xl:text-lg leading-normal`}
  @media (max-width: 1024px) {
    color: #555;
    font-size: 0.938rem;
    line-height: 1.6;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    text-shadow: none;
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
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;

    .action {
      width: 100%;
      padding: 0.875rem 1.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      border-radius: 0.5rem;
    }

    .primaryAction {
      background-color: var(--color-primary-text);
      color: var(--color-background);
      box-shadow: 0 2px 8px rgba(62, 77, 44, 0.18);
    }

    .secondaryAction {
      margin-top: 0;
      margin-left: 0;
      background-color: transparent;
      color: var(--color-primary-text);
      border: 1.5px solid var(--color-primary);
      box-shadow: none;
    }
  }
`;

const TrustBar = styled.div`
  ${tw`mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6 text-sm`}

  @media (max-width: 1024px) {
    position: relative;
    z-index: 1;
    margin-top: 0;
    justify-content: flex-start;
    gap: 0;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TrustItem = styled.div`
  ${tw`flex items-center gap-2`}

  @media (min-width: 1024px) {
    ${tw`text-gray-700`}
  }

  @media (max-width: 1024px) {
    color: #666;
    text-shadow: none;
    font-size: 0.813rem;
    padding: 0.375rem 0;
    letter-spacing: 0.01em;
  }

  svg {
    ${tw`w-5 h-5 flex-shrink-0`}
    color: #2D5A27;

    @media (max-width: 1024px) {
      width: 1rem;
      height: 1rem;
      color: var(--color-primary);
      filter: none;
    }
  }
`;

const HighlightText = styled.span`
  ${tw`text-primary-500`}

  @media (max-width: 1024px) {
    color: var(--color-primary);
  }
`;

const FullWidthWithImageComponent = ({
  navLinks = [
    <NavLinks key={1}>
      <NavLink href="/sobre-nos">Sobre Nós</NavLink>
      <NavLink href="/projetos">Projetos</NavLink>
      <NavLink href="/contato">Contato</NavLink>
    </NavLinks>,
  ],
  heading = (
    <>
      Transformamos Espaços
      <wbr />
      <br />
      <HighlightText>em Experiências Naturais.</HighlightText>
    </>
  ),
  description = "Há mais de 25 anos criando projetos paisagísticos exclusivos que harmonizam arquitetura e natureza. Do conceito à execução, trazemos beleza e propósito para cada ambiente.",
  primaryActionUrl = "/contato",
  primaryActionText = "Fale Conosco",
  secondaryActionUrl = "/projetos",
  secondaryActionText = "Explorar Projetos",
}) => {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  return (
    <Container>
      <TwoColumn>
        <LeftColumn>
          <StyledHeader links={navLinks} collapseBreakpointClass="sm" />
          <MobileHeroImage>
            <img
              src="/images/components/hero/Modern-hero-640w.webp"
              alt="Paisagismo moderno projetado por Carla Moraes"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              width={640}
              height={480}
            />
          </MobileHeroImage>
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
            <TrustBar>
              <TrustItem>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>25+ Anos de Experiência</span>
              </TrustItem>
              <TrustItem>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>500+ Projetos Realizados</span>
              </TrustItem>
              <TrustItem>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Atendimento Personalizado</span>
              </TrustItem>
            </TrustBar>
          </Content>
        </LeftColumn>
        <RightColumn>
          <OptimizedImage
            src="/images/components/hero/Modern-hero.webp"
            alt="Paisagismo moderno projetado por Carla Moraes"
            priority={true}
            sizes="(max-width: 768px) 100vw, 50vw"
            width={1200}
            height={800}
            className="hero-image"
          />
        </RightColumn>
      </TwoColumn>
    </Container>
  );
};

FullWidthWithImageComponent.propTypes = {
  navLinks: PropTypes.node,
  heading: PropTypes.node,
  description: PropTypes.string,
  primaryActionUrl: PropTypes.string,
  primaryActionText: PropTypes.string,
  secondaryActionUrl: PropTypes.string,
  secondaryActionText: PropTypes.string,
};

export default FullWidthWithImageComponent;
