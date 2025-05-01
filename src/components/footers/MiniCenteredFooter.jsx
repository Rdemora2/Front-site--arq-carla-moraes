import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { Container as ContainerBase } from "components/misc/Layouts.jsx";
import FacebookIcon from "../../images/facebook-icon.svg";
import TwitterIcon from "../../images/twitter-icon.svg";
import YoutubeIcon from "../../images/youtube-icon.svg";

const logo = "/logo/logo_reduced.png";

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
export default () => {
  return (
    <Container>
      <Content>
        <Row>
          <LogoContainer>
            <LogoImg src={logo} />
            <LogoText>Carla Moraes Arquitetura Paisagística</LogoText>
          </LogoContainer>
          <LinksContainer>
            <Link href="#">Home</Link>
            <Link href="#">Sobre</Link>
            <Link href="#">Projetos</Link>
            <Link href="#">Blog</Link>
            <Link href="#">Contato</Link>
          </LinksContainer>
          <SocialLinksContainer>
            <SocialLink href="https://facebook.com/carlamoraespaisagismo">
              <FacebookIcon />
            </SocialLink>
            <SocialLink href="https://instagram.com/carlamoraespaisagismo">
              <TwitterIcon />{" "}
              {/* Nota: é recomendado trocar esse ícone para um Instagram */}
            </SocialLink>
            <SocialLink href="https://linkedin.com/in/carlamoraespaisagismo">
              <YoutubeIcon />{" "}
              {/* Nota: é recomendado trocar esse ícone para um LinkedIn */}
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
