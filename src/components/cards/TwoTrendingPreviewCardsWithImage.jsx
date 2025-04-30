import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
//eslint-disable-line
import { SectionHeading } from "components/misc/Headings.jsx";
import { PrimaryLink as PrimaryLinkBase } from "components/misc/Links.jsx";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.jsx";
import {
  MapPin as LocationIcon,
  Clock as TimeIcon,
  TrendingUp as TrendingIcon,
} from "react-feather";
import ArrowRightIcon from "images/arrow-right-icon.svg";

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;

const ThreeColumn = tw.div`flex flex-wrap`;
const Column = tw.div``;
const HeadingColumn = tw(Column)`w-full xl:w-1/3`;
const CardColumn = tw(Column)`w-full md:w-1/2 xl:w-1/3 mt-16 xl:mt-0`;

const HeadingInfoContainer = tw.div`text-center xl:text-left max-w-lg xl:max-w-none mx-auto xl:mx-0`;
const HeadingTitle = tw(SectionHeading)`xl:text-left leading-tight`;
const HeadingDescription = tw.p`text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100 mt-8`;
const PrimaryLink = styled(PrimaryLinkBase)`
  ${tw`inline-flex justify-center xl:justify-start items-center mt-8 text-lg`}
  svg {
    ${tw`ml-2 w-5 h-5`}
  }
`;

const Card = tw.div`mx-auto xl:mx-0 xl:ml-auto max-w-sm md:max-w-xs lg:max-w-sm xl:max-w-xs`;
const CardImage = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`h-80 bg-cover bg-center rounded`,
]);

const CardText = tw.div`mt-4`;

const CardHeader = tw.div`flex justify-between items-center`;
const CardType = tw.div`text-primary-500 font-bold text-lg`;
const CardPrice = tw.div`font-semibold text-sm text-gray-600`;
const CardPriceAmount = tw.span`font-bold text-gray-800 text-lg`;

const CardTitle = tw.h5`text-xl mt-4 font-bold`;

const CardMeta = styled.div`
  ${tw`flex flex-row flex-wrap justify-between sm:items-center font-semibold tracking-wide text-gray-600 uppercase text-xs`}
`;

const CardMetaFeature = styled.div`
  ${tw`flex items-center mt-4`}
  svg {
    ${tw`w-5 h-5 mr-1`}
  }
`;
const CardAction = tw(PrimaryButtonBase)`w-full mt-8`;

export default ({
  subheading = "Tendências em Paisagismo",
  heading = (
    <>
      Inovação e <span tw="text-primary-500">Sustentabilidade</span>
    </>
  ),
  description = "Conheça as abordagens contemporâneas que aplicamos em nossos projetos, unindo estética, funcionalidade e responsabilidade ambiental.",
  primaryLinkText = "Ver todos os projetos",
  primaryLinkUrl = "https://carlamoraes.com.br/projetos",
  cards = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      title: "Jardins Verticais Integrados",
      description:
        "Soluções verticais que ampliam o contato com o verde mesmo em espaços urbanos reduzidos, trazendo vida e melhorando o conforto térmico e acústico.",
      price: "Ideais para:",
      pricePerTerm:
        "Ambientes corporativos, residências urbanas e áreas internas",
      imageCss: null,
      type: "Inovação",
      url: "/jardins-verticais",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1513135467880-6c41609898f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      title: "Paisagismo Biofílico",
      description:
        "Projetos que reconectam as pessoas à natureza através de elementos orgânicos integrados à arquitetura, promovendo bem-estar e qualidade de vida.",
      price: "Aplicações:",
      pricePerTerm:
        "Residências, escritórios, hospitais e espaços educacionais",
      imageCss: null,
      type: "Conceito",
      url: "/paisagismo-biofilico",
    },
  ],
}) => {
  return (
    <Container>
      <Content>
        <ThreeColumn>
          <HeadingColumn>
            <HeadingInfoContainer>
              <HeadingTitle>{heading}</HeadingTitle>
              <HeadingDescription>{description}</HeadingDescription>
              <PrimaryLink href={primaryLinkUrl}>
                {primaryLinkText} <ArrowRightIcon />
              </PrimaryLink>
            </HeadingInfoContainer>
          </HeadingColumn>
          {cards.map((card, index) => (
            <CardColumn key={index}>
              <Card>
                <CardImage imageSrc={card.imageSrc} />
                <CardText>
                  <CardHeader>
                    <CardType>{card.type}</CardType>
                    <CardPrice>
                      <CardPriceAmount>{card.price}</CardPriceAmount>{" "}
                      {card.pricePerTerm}
                    </CardPrice>
                  </CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardMeta>
                    <CardMetaFeature>
                      <TrendingIcon /> {card.description}
                    </CardMetaFeature>
                  </CardMeta>
                  <CardAction href={card.url}>Saiba Mais</CardAction>
                </CardText>
              </Card>
            </CardColumn>
          ))}
        </ThreeColumn>
      </Content>
    </Container>
  );
};
