import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.jsx";
import MetaTags from "components/misc/MetaTags.jsx";

import tw from "twin.macro";
import styled from "styled-components";

import Header from "components/navbar/navbar.jsx";
import Footer from "components/footers/FiveColumnWithInputForm.jsx";
import MainFeature1 from "components/features/TwoColWithButton.jsx";
import Features from "components/features/ThreeColSimple.jsx";

import SupportIconImage from "../assets/icons/svg/support-icon.svg?url";
import ShieldIconImage from "../assets/icons/svg/shield-icon.svg?url";
import CustomerLoveIconImage from "../assets/icons/svg/simple-icon.svg?url";

const Subheading = styled.span`
  ${tw`uppercase tracking-wider text-sm`}
  color: #3e4d2c;
`;

const StyledMainFeature = styled(MainFeature1).withConfig({
  shouldForwardProp: (prop) => !["bgColor"].includes(prop),
})`
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
  .imageContainer {
    background-color: #3e4d2c !important;
    img {
      filter: brightness(0) invert(1) !important;
    }
  }
`;

export default () => {
  return (
    <>
      <AnimationRevealPage>
        <MetaTags
          title="Sobre Nós - Carla Moraes Arquitetura Paisagística"
          description="Conheça a história e valores da Carla Moraes Arquitetura Paisagística. Há mais de 25 anos transformando espaços com projetos únicos e sustentáveis."
          url="/sobre"
        />
        <Header />
        <StyledMainFeature
          subheading={
            <Subheading>Sobre Carla Moraes Arquitetura Paisagística</Subheading>
          }
          heading="Criamos jardins únicos há mais de 25 anos."
          description="Começamos em 1996 com a missão de conectar pessoas à natureza através do paisagismo. Desenvolvemos projetos personalizados que respeitam seu estilo de vida e as características do seu espaço. Nossa equipe trabalha junto com você desde a primeira conversa até a entrega final, garantindo que cada detalhe reflita seus sonhos e necessidades."
          buttonRounded={false}
          primaryButtonText="Conheça nosso Portfólio"
          primaryButtonUrl="/projetos"
          imageSrc="/images/projects/Jardim-frances/Frances-3.webp"
        />
        <StyledMainFeature
          subheading={<Subheading>Nossa Filosofia</Subheading>}
          heading="Jardins que combinam com você."
          description="Acreditamos que cada jardim deve refletir a personalidade do cliente. Por isso, escutamos suas ideias, entendemos seu estilo e criamos um espaço que funciona de verdade para sua rotina. Cuidamos de todos os detalhes técnicos para que você só precise se preocupar em desfrutar de seu novo jardim."
          buttonRounded={false}
          primaryButtonText="Vamos conversar?"
          primaryButtonUrl="/contato"
          imageSrc="/images/projects/Jardim-frances/Frances-4.webp"
          textOnLeft={false}
        />
        <StyledFeatures
          subheading={<Subheading>Nossos Diferenciais</Subheading>}
          heading="Por que escolher nosso time"
          description="Ao longo de 25 anos, desenvolvemos uma forma de trabalhar que prioriza você e seu projeto. Confira o que nos diferencia:"
          cards={[
            {
              imageSrc: SupportIconImage,
              title: "Atendimento próximo",
              description:
                "Analisamos sua necessidade e desenvolvemos um projeto exclusivo para cada cliente. Cada projeto é único porque cada pessoa é única.",
            },
            {
              imageSrc: ShieldIconImage,
              title: "Conhecimento técnico",
              description:
                "Com profundo conhecimento em botânica e técnicas de paisagismo, desenvolvemos projetos que harmonizam estética e funcionalidade, garantindo jardins duradouros e sempre exuberantes.",
            },
            {
              imageSrc: CustomerLoveIconImage,
              title: "Cuidado com o meio ambiente",
              description:
                "Priorizamos práticas sustentáveis com seleção criteriosa de espécies nativas, sistemas de irrigação inteligente e materiais eco-eficientes que preservam os recursos naturais.",
            },
          ]}
          linkText=""
        />
      </AnimationRevealPage>

      {/* Footer fora do AnimationRevealPage para remover a animação */}
      <Footer />
    </>
  );
};
