import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.jsx";
import tw from "twin.macro";
import styled from "styled-components";

import Header from "components/navbar/navbar.jsx";
import Footer from "components/footers/FiveColumnWithInputForm.jsx";
import MainFeature1 from "components/features/TwoColWithButton.jsx";
import Features from "components/features/ThreeColSimple.jsx";
import TeamCardGrid from "components/cards/ProfileThreeColGrid.jsx";

import SupportIconImage from "images/support-icon.svg";
import ShieldIconImage from "images/shield-icon.svg";
import CustomerLoveIconImage from "images/simple-icon.svg";

const Subheading = styled.span`
  ${tw`uppercase tracking-wider text-sm`}
  color: #3e4d2c;
`;

const StyledMainFeature = styled(MainFeature1)`
  background-color: ${(props) => props.bgColor || "#f9f5ef"};
  h2 {
    color: #3e4d2c;
  }
  p {
    color: #3e4d2c;
  }
`;

const StyledFeatures = styled(Features)`
  background-color: #f9f5ef;
  h2,
  h5 {
    color: #3e4d2c;
  }
  p {
    color: #3e4d2c;
  }
`;

export default () => {
  return (
    <AnimationRevealPage>
      <Header />
      <StyledMainFeature
        subheading={
          <Subheading>Sobre Carla Moraes Arquitetura Paisagística</Subheading>
        }
        heading="Criamos ambientes que transformam espaços e vidas."
        buttonRounded={false}
        primaryButtonText="Ver Portfólio"
        primaryButtonUrl="/portfolio"
        imageSrc="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80"
      />
      <StyledMainFeature
        subheading={<Subheading>Nossa Visão</Subheading>}
        heading="Buscamos harmonizar a natureza com o design contemporâneo."
        buttonRounded={false}
        primaryButtonText="Fale Conosco"
        primaryButtonUrl="/contato"
        imageSrc="https://images.unsplash.com/3/doctype-hi-res.jpg?ixlib=rb-1.2.1&auto=format&fit=crop&w=768&q=80"
        textOnLeft={false}
      />
      <StyledFeatures
        subheading={<Subheading>Nossos Valores</Subheading>}
        heading="Princípios que norteiam nosso trabalho"
        description="Compromisso com a sustentabilidade, qualidade e satisfação do cliente são os pilares que sustentam cada projeto que desenvolvemos."
        cards={[
          {
            imageSrc: SupportIconImage,
            title: "Atendimento Personalizado",
            description:
              "Cada cliente recebe atenção individualizada. Construímos projetos únicos que refletem personalidade e estilo de vida.",
          },
          {
            imageSrc: ShieldIconImage,
            title: "Equipe Especializada",
            description:
              "Nossa equipe multidisciplinar combina conhecimento técnico e visão estética para criar projetos paisagísticos excepcionais.",
          },
          {
            imageSrc: CustomerLoveIconImage,
            title: "Compromisso Ambiental",
            description:
              "Priorizamos práticas sustentáveis e soluções ecológicas que respeitam a flora local e otimizam recursos naturais.",
          },
        ]}
        linkText=""
      />
      <TeamCardGrid subheading={<Subheading>Nossa Equipe</Subheading>} />
      <Footer />
    </AnimationRevealPage>
  );
};
