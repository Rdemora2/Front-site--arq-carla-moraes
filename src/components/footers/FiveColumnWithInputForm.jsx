import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { Instagram, Linkedin } from "react-feather";

const LogoImage = "/logo/logo_reduced.webp";

const Container = styled.div`
  ${tw`relative -mb-8 -mx-8 px-8 py-20 lg:py-24`}
  background-color: var(--color-primary-text);
  color: var(--color-background);
`;

const Content = tw.div`max-w-screen-xl mx-auto relative z-10`;
const FourColumns = tw.div`flex flex-wrap text-center sm:text-left justify-center sm:justify-start md:justify-between -mt-12`;

const Column = tw.div`px-4 sm:px-0 sm:w-1/4 md:w-auto mt-12`;

const ColumnHeading = styled.h5`
  ${tw`uppercase font-bold`}
  color: var(--color-gold);
`;

const LinkList = tw.ul`mt-6 text-sm font-medium`;
const LinkListItem = tw.li`mt-3`;
const Link = styled.a`
  ${tw`border-b-2 border-transparent pb-1 transition duration-300`}
  color: var(--color-background);
  &:hover {
    ${tw`border-b-2`}
    border-color: var(--color-gold);
  }
`;

const Divider = styled.div`
  ${tw`my-16 border-b-2 w-full`}
  border-color: var(--color-background);
  opacity: 0.2;
`;

const ThreeColRow = tw.div`flex flex-col md:flex-row items-center justify-between`;

const LogoContainer = tw.div`flex items-center justify-center md:justify-start`;
const LogoImg = styled.img`
  ${tw`mr-2`}
  width: 25px;
  height: auto;
`;

const LogoText = styled.h5`
  ${tw`ml-2 text-xl font-medium tracking-wider`}
  color: var(--color-gold);
`;

const CopyrightContainer = tw.div`flex flex-col items-center md:items-start mt-8 md:mt-0`;
const CopyrightNotice = styled.p`
  ${tw`text-center text-sm sm:text-base font-medium`}
  color: var(--color-background);
`;

const DeveloperNotice = styled.p`
  ${tw`text-center text-sm sm:text-base mt-2 font-medium`}
  color: var(--color-background);
`;

const DeveloperLink = styled.a`
  ${tw`font-bold relative`}
  color: var(--color-gold);
  transition: all 0.3s ease;

  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -2px;
    left: 0;
    background-color: white;
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }
`;

const SocialLinksContainer = tw.div`mt-8 md:mt-0 flex`;
const SocialLink = styled.a`
  ${tw`cursor-pointer p-2 rounded-full mr-4 last:mr-0 transition duration-300`}
  background-color: white;
  color: var(--color-primary-text);
  &:hover {
    background-color: var(--color-gold);
    color: var(--color-primary-text);
    transform: scale(1.1);
  }
  svg {
    ${tw`w-5 h-5`}
  }
`;

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const SafeBrowsingImage = styled.img`
  ${tw`mt-6 mx-auto sm:mx-0`}
  max-width: 170px;
  height: auto;
  display: block;
`;

const SafeBrowsingContainer = tw.div`mt-6 text-sm font-medium text-left`;

const Footer = () => {
  return (
    <Container>
      <Content>
        <FourColumns>
          <Column>
            <ColumnHeading>Principal</ColumnHeading>
            <LinkList>
              <LinkListItem>
                <Link href="#">Início</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="/sobre-nos">Sobre Nós</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="/portfolio">Portfólio</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="/contato">Contato</Link>
              </LinkListItem>
            </LinkList>
          </Column>
          <Column>
            <ColumnHeading>Serviços</ColumnHeading>
            <LinkList>
              <LinkListItem>
                <Link href="#">Projetos Residenciais</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Projetos Comerciais</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Consultoria</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Manutenção</Link>
              </LinkListItem>
            </LinkList>
          </Column>
          <Column>
            <ColumnHeading>Legal</ColumnHeading>
            <LinkList>
              <LinkListItem>
                <Link href="#">LGPD</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Política de Privacidade</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Termos de Serviço</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Isenção de Responsabilidade</Link>
              </LinkListItem>
            </LinkList>
          </Column>
          <Column>
            <ColumnHeading>Segurança</ColumnHeading>
            <SafeBrowsingContainer>
              <SafeBrowsingImage
                src="/images/selo_safe_browsing.webp"
                alt="Selo Google Safe Browsing - Site seguro e protegido"
                title="Site protegido e verificado"
              />
            </SafeBrowsingContainer>
          </Column>
        </FourColumns>
        <Divider />
        <ThreeColRow>
          <LogoContainer>
            <LogoImg
              src={LogoImage}
              alt="Logo Carla Moraes Arquitetura Paisagística"
            />
            <LogoText>Carla Moraes Arquitetura Paisagística</LogoText>
          </LogoContainer>
          <CopyrightContainer>
            <CopyrightNotice>
              &copy; 2025, Carla Moraes Arquitetura Paisagística. Todos os
              Direitos Reservados.
            </CopyrightNotice>
            <DeveloperNotice>
              Desenvolvido por{" "}
              <DeveloperLink
                href="https://www.tivix.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visite o site da Tivix Technologies"
              >
                Tivix Technologies
              </DeveloperLink>
            </DeveloperNotice>
          </CopyrightContainer>
          <SocialLinksContainer>
            <SocialLink
              href="https://www.instagram.com/arqcamoraes?igsh=MTF3MW5kdG5jaTRmaQ=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Siga-nos no Instagram"
            >
              <Instagram />
            </SocialLink>
            <SocialLink
              href="https://www.linkedin.com/in/carla-m-b47a0554/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Conecte-se conosco no LinkedIn"
            >
              <Linkedin />
            </SocialLink>
            <SocialLink
              href="https://wa.me/5511999854345"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Fale conosco pelo WhatsApp"
            >
              <WhatsAppIcon />
            </SocialLink>
          </SocialLinksContainer>
        </ThreeColRow>
      </Content>
    </Container>
  );
};

export default Footer;
