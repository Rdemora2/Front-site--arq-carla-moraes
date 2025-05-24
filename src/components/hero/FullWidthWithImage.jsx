import React from "react";
import tw from "twin.macro";
import styled from "styled-components";

import Header, {
  LogoLink,
  NavLinks,
  NavLink as NavLinkBase,
} from "../navbar/navbar.jsx";

const StyledHeader = styled(Header)`
  ${tw`justify-between`}
  ${LogoLink} {
    ${tw`mr-8 pb-0`}
  }
`;

const NavLink = tw(NavLinkBase)`
  sm:text-sm sm:mx-6
`;

const Container = tw.div`relative -mx-8 -mt-8`;
const TwoColumn = tw.div`flex flex-col lg:flex-row`;
const LeftColumn = tw.div`ml-8 mr-8 xl:pl-10 py-8`;
const RightColumn = styled.div`
  ${tw`bg-cover bg-center xl:ml-24 h-96 lg:h-auto lg:w-1/2 lg:flex-1`}
  
  .hero-image {
    ${tw`w-full h-full object-cover`}
  }
`;

const Content = tw.div`mt-24 lg:mt-24 lg:mb-24 flex flex-col sm:items-center lg:items-stretch`;
const Heading = tw.h1`text-3xl sm:text-5xl md:text-6xl lg:text-5xl font-black leading-none`;
const Paragraph = tw.p`max-w-md my-8 lg:my-5 lg:my-8 sm:text-lg lg:text-base xl:text-lg leading-loose`;

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
`;

export default ({
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
