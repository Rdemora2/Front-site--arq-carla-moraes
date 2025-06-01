import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "components/misc/Headings.jsx";
import { SectionDescription } from "components/misc/Typography.jsx";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.jsx";
import SupportIconImage from "../../assets/icons/svg/support-icon.svg?url";
import ShieldIconImage from "../../assets/icons/svg/shield-icon.svg?url";
import CustomizeIconImage from "../../assets/icons/svg/customize-icon.svg?url";
import SvgDecoratorBlob3 from "../../assets/icons/svg/svg-decorator-blob-3.svg?url";

const Heading = tw(SectionHeading)``;
const Subheading = tw(SubheadingBase)`text-center mb-3`;
const Description = tw(SectionDescription)`text-center mx-auto`;
const ThreeColumnContainer = styled.div`
  ${tw`mt-10 flex flex-col items-center lg:items-stretch lg:flex-row flex-wrap lg:justify-center max-w-screen-lg mx-auto`}
`;
const Column = styled.div`
  ${tw`lg:w-1/3 max-w-xs`}
`;

const Card = styled.a`
  ${tw`flex flex-col items-center text-center h-full mx-4 px-4 py-8 rounded transition-transform duration-300 hover:cursor-pointer transform hover:scale-105 `}
  .imageContainer {
    ${tw`text-center rounded-full p-4 bg-gray-100`}
    img {
      ${tw`w-8 h-8`}
    }
  }

  .title {
    ${tw`mt-4 font-bold text-xl leading-none`}
  }

  .description {
    ${tw`mt-4 text-sm font-medium text-secondary-300`}
  }

  .link {
    ${tw`mt-auto inline-flex items-center pt-5 text-sm font-bold text-primary-300 leading-none hocus:text-primary-900 transition duration-300`}
    .icon {
      ${tw`ml-2 w-4`}
    }
  }
`;

const DecoratorBlob = styled.div`
  ${tw`pointer-events-none absolute w-64 opacity-25 transform translate-x-32 translate-y-40`}
  right: 0;
  bottom: 0;
  background-image: url("${SvgDecoratorBlob3}");
  background-size: contain;
  background-repeat: no-repeat;
  height: 256px;
  width: 256px;
`;

const ThreeColSimple = ({
  cards = [
    {
      imageSrc: SupportIconImage,
      title: "Projetos Personalizados",
      description:
        "Cada projeto é único e concebido para refletir a personalidade e necessidades do cliente, respeitando a arquitetura existente e o entorno natural.",
    },
    {
      imageSrc: ShieldIconImage,
      title: "Soluções Sustentáveis",
      description:
        "Integramos práticas ecológicas em nossos projetos, com uso consciente de água, espécies nativas e materiais de baixo impacto ambiental.",
    },
    {
      imageSrc: CustomizeIconImage,
      title: "Execução Especializada",
      description:
        "Nossa equipe técnica garante a fidelidade do projeto do papel à realidade, com acompanhamento detalhado em todas as etapas de implementação.",
    },
  ],
  linkText = "Saiba Mais",
  heading = "Nossa Abordagem",
  subheading = "Princípios de Trabalho",
  description = "Combinamos sensibilidade estética e conhecimento técnico para criar paisagens que transcendem o tempo e valorizam os espaços.",
  imageContainerCss = null,
  imageCss = null,
}) => {
  /*
   * This componets accepts a prop - `cards` which is an array of object denoting the cards. Each object in the cards array can have the following keys (Change it according to your need, you can also add more objects to have more cards in this feature component):
   *  1) imageSrc - the image shown at the top of the card
   *  2) title - the title of the card
   *  3) description - the description of the card
   *  4) url - the url that the card should goto on click
   */
  return (
    <Container>
      <ContentWithPaddingXl>
        {subheading && <Subheading>{subheading}</Subheading>}
        {heading && <Heading>{heading}</Heading>}
        {description && <Description>{description}</Description>}
        <ThreeColumnContainer>
          {cards.map((card, i) => (
            <Column key={i}>
              <Card href={card.url}>
                <span className="imageContainer" css={imageContainerCss}>
                  <img
                    src={typeof card.imageSrc === "string" ? card.imageSrc : ""}
                    alt=""
                    css={imageCss}
                  />
                </span>
                <span className="title">{card.title}</span>
                <p className="description">{card.description}</p>
                {linkText && (
                  <span className="link">
                    <span>{linkText}</span>
                    <svg
                      className="icon"
                      viewBox="0 0 31.49 31.49"
                      fill="currentColor"
                    >
                      <path d="M21.205 5.007c-.429-.444-1.143-.444-1.587 0-.429.429-.429 1.143 0 1.571l8.047 8.047H1.111C.492 14.626 0 15.118 0 15.737c0 .619.492 1.127 1.111 1.127h26.554l-8.047 8.032c-.429.444-.429 1.159 0 1.587.444.444 1.159.444 1.587 0l9.952-9.952c.444-.429.444-1.143 0-1.571l-9.952-9.953z" />
                    </svg>
                  </span>
                )}
              </Card>
            </Column>
          ))}
        </ThreeColumnContainer>
      </ContentWithPaddingXl>
      <DecoratorBlob />
    </Container>
  );
};

export default ThreeColSimple;
