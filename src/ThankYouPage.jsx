import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.jsx";
import { Container, Content2Xl } from "components/misc/Layouts";
import tw from "twin.macro";

import { LogoLink } from "components/navbar/navbar.jsx";
import { SectionHeading as HeadingBase } from "components/misc/Headings";
import { SectionDescription as DescriptionBase } from "components/misc/Typography";

const logo = "/logo/logo_full.webp";

/* Hero */
const Row = tw.div`flex`;
const NavRow = tw(Row)`flex flex-col lg:flex-row items-center justify-between`;
const HeroRow = tw(
  Row
)`max-w-xl flex-col justify-between items-center py-20 lg:py-24 mx-auto`;

const Heading = tw(HeadingBase)`text-center text-primary-900 leading-snug`;
const Description = tw(
  DescriptionBase
)`mt-4 text-center lg:text-base text-gray-700 max-w-lg mx-auto lg:mx-0`;

export default () => {
  return (
    <AnimationRevealPage disabled>
      <Container tw="-mx-8 -mt-8 pt-8 px-8">
        <Content2Xl>
          <NavRow>
            <LogoLink href="/">
              <img src={logo} alt="" />
              Carla Moraes Arquitetura paisagística
            </LogoLink>
          </NavRow>
          <HeroRow>
            <Heading>Obrigado!</Heading>
            <Description tw="mt-12">
              Sua mensagem foi enviada com sucesso. Entraremos em contato em
              breve.
            </Description>
          </HeroRow>
        </Content2Xl>
      </Container>
    </AnimationRevealPage>
  );
};
