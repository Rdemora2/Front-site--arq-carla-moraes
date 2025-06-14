import React, { memo } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { Container as ContainerBase } from "components/misc/Layouts.jsx";
import FacebookIcon from "../assets/icons/svg/facebook-icon.svg";
import TwitterIcon from "../assets/icons/svg/twitter-icon.svg";
import YoutubeIcon from "../assets/icons/svg/youtube-icon.svg";

const logo = "/images/logo/logo_reduced.webp";

const Container = tw(ContainerBase)`bg-gray-900 text-gray-100 -mx-8 -mb-8`;
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;

const Row = tw.div`flex items-center justify-center flex-col px-8`;

const LogoContainer = tw.div`flex items-center justify-center md:justify-start`;
const LogoImg = tw.img`w-16`;
const LogoText = tw.h5`ml-2 text-2xl font-black tracking-wider`;

const LinksContainer = tw.div`mt-8 font-medium flex flex-wrap justify-center items-center flex-col sm:flex-row`;
const Link = tw.a`border-b-2 border-transparent hocus:text-gray-300 hocus:border-gray-300 pb-1 transition duration-300 mt-2 mx-4`;

const SocialLinksContainer = tw.div`mt-10`;
const SocialLink = styled.a`
  ${tw`cursor-pointer inline-block text-gray-100 hover:text-gray-500 transition duration-300 mx-4`}
  svg {
    ${tw`w-5 h-5`}
  }
`;

const CopyrightText = tw.p`text-center mt-10 font-medium tracking-wide text-sm text-gray-600`;

const MiniCenteredFooter = () => {
  return (
    <Container>
      <Content>
        <Row>
          <LogoContainer>
            <LogoImg src={logo} alt="Logo Carla Moraes Arquitetura" />
            <LogoText>Carla Moraes Arquitetura Paisagística</LogoText>
          </LogoContainer>
          <LinksContainer>
            <Link href="#" aria-label="Ir para página inicial">
              Home
            </Link>
            <Link href="#" aria-label="Ir para página sobre nós">
              Sobre
            </Link>
            <Link href="#" aria-label="Ver nossos projetos">
              Projetos
            </Link>
            <Link href="#" aria-label="Ler nosso blog">
              Blog
            </Link>
            <Link href="#" aria-label="Entre em contato">
              Contato
            </Link>
          </LinksContainer>
          <SocialLinksContainer>
            <SocialLink
              href="https://facebook.com/carlamoraespaisagismo"
              aria-label="Visite nossa página no Facebook"
            >
              <FacebookIcon />
            </SocialLink>
            <SocialLink
              href="https://instagram.com/carlamoraespaisagismo"
              aria-label="Siga-nos no Instagram"
            >
              <TwitterIcon />
            </SocialLink>
            <SocialLink
              href="https://linkedin.com/in/carlamoraespaisagismo"
              aria-label="Conecte-se conosco no LinkedIn"
            >
              <YoutubeIcon />
            </SocialLink>
          </SocialLinksContainer>
          <CopyrightText>
            &copy; Copyright 2025, Carla Moraes Arquitetura Paisagística. Todos
            os Direitos Reservados.
          </CopyrightText>
          <CopyrightText>
            Desenvolvido por{" "}
            <a
              href="https://www.tivix.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visite o site da Tivix Technologies"
              className="font-bold text-primary-500 hover:text-primary-700 transition-colors"
            >
              Tivix Technologies
            </a>
          </CopyrightText>
        </Row>
      </Content>
    </Container>
  );
};

export default memo(MiniCenteredFooter);
