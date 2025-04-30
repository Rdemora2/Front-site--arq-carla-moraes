import React, { useState } from "react";
import Slider from "react-slick";
import tw from "twin.macro";
import styled from "styled-components";
import { SectionHeading } from "components/misc/Headings";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons";
import {
  DollarSign as PriceIcon,
  MapPin as LocationIcon,
  Star as StarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "react-feather";

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-16 lg:py-20`;

const HeadingWithControl = tw.div`flex flex-col items-center sm:items-stretch sm:flex-row justify-between`;
const Heading = tw(SectionHeading)``;
const Controls = tw.div`flex items-center`;
const ControlButton = styled(PrimaryButtonBase)`
  ${tw`mt-4 sm:mt-0 first:ml-0 ml-6 rounded-full p-2`}
  svg {
    ${tw`w-6 h-6`}
  }
`;
const PrevButton = tw(ControlButton)``;
const NextButton = tw(ControlButton)``;

const CardSlider = styled(Slider)`
  ${tw`mt-16`}
  .slick-track {
    ${tw`flex`}
  }
  .slick-slide {
    ${tw`h-auto flex justify-center mb-1`}
  }
`;
const Card = tw.div`h-full flex! flex-col sm:border max-w-sm sm:rounded-tl-4xl sm:rounded-br-5xl relative focus:outline-none`;
const CardImage = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`w-full h-56 sm:h-64 bg-cover bg-center rounded sm:rounded-none sm:rounded-tl-4xl`,
]);

const TextInfo = tw.div`py-6 sm:px-10 sm:py-6`;
const TitleReviewContainer = tw.div`flex flex-col sm:flex-row sm:justify-between sm:items-center`;
const Title = tw.h5`text-2xl font-bold`;

const RatingsInfo = styled.div`
  ${tw`flex items-center sm:ml-4 mt-2 sm:mt-0`}
  svg {
    ${tw`w-6 h-6 text-yellow-500 fill-current`}
  }
`;
const Rating = tw.span`ml-2 font-bold`;

const Description = tw.p`text-sm leading-loose mt-2 sm:mt-4`;

const SecondaryInfoContainer = tw.div`flex flex-col sm:flex-row mt-2 sm:mt-4`;
const IconWithText = tw.div`flex items-center mr-6 my-2 sm:my-0`;
const IconContainer = styled.div`
  ${tw`inline-block rounded-full p-2 bg-gray-700 text-gray-100`}
  svg {
    ${tw`w-3 h-3`}
  }
`;
const Text = tw.div`ml-2 text-sm font-semibold text-gray-800`;

const PrimaryButton = tw(
  PrimaryButtonBase
)`mt-auto sm:text-lg rounded-none w-full rounded sm:rounded-none sm:rounded-br-4xl py-3 sm:py-6`;
export default ({
  heading = <span>Projetos em Destaque</span>,
  subheading = "Nosso Portfólio",
  description = "Conheça alguns dos projetos executados pela Carla Moraes Arquitetura Paisagística em diferentes contextos e necessidades.",
  cards = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1546500840-ae38253aba9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      title: "Residencial Ipê Amarelo",
      description:
        "Jardim tropical contemporâneo com áreas de convivência integradas e iluminação cênica para esta residência de alto padrão.",
      locationText: "São Paulo, SP",
      pricingText: "480 m²",
      url: "#",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1569185835836-a9753dfcf317?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      title: "Condomínio Villa Verde",
      description:
        "Áreas comuns e paisagismo do entorno, criando ambientes de lazer que valorizam a interação social e o contato com a natureza.",
      locationText: "Campinas, SP",
      pricingText: "1.200 m²",
      url: "#",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1551201602-13d11c97d344?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      title: "Corporativo Jardins",
      description:
        "Projeto biofílico para sede empresarial que integra elementos naturais ao ambiente de trabalho, promovendo bem-estar e produtividade.",
      locationText: "Rio de Janeiro, RJ",
      pricingText: "650 m²",
      url: "#",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1587502537104-aac10f5fb6f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      title: "Casa de Campo Arvoredo",
      description:
        "Paisagismo rural que harmoniza a vegetação existente com novas espécies, criando áreas de contemplação e vivência com a natureza.",
      locationText: "Itatiba, SP",
      pricingText: "2.500 m²",
      url: "#",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      title: "Terraço Vila Nova",
      description:
        "Transformação de cobertura em oásis urbano com jardins de cobertura, deck e área gourmet integrada à vegetação.",
      locationText: "Belo Horizonte, MG",
      pricingText: "120 m²",
      url: "#",
    },
  ],
}) => {
  const [sliderRef, setSliderRef] = useState(null);
  const sliderSettings = {
    arrows: false,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
        },
      },

      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Container>
      <Content>
        <HeadingWithControl>
          <Heading>{heading}</Heading>
          <Controls>
            <PrevButton onClick={sliderRef?.slickPrev}>
              <ChevronLeftIcon />
            </PrevButton>
            <NextButton onClick={sliderRef?.slickNext}>
              <ChevronRightIcon />
            </NextButton>
          </Controls>
        </HeadingWithControl>
        <CardSlider ref={setSliderRef} {...sliderSettings}>
          {cards.map((card, index) => (
            <Card key={index}>
              <CardImage imageSrc={card.imageSrc} />
              <TextInfo>
                <TitleReviewContainer>
                  <Title>{card.title}</Title>
                  <RatingsInfo>
                    <StarIcon />
                    <Rating>{card.rating}</Rating>
                  </RatingsInfo>
                </TitleReviewContainer>
                <SecondaryInfoContainer>
                  <IconWithText>
                    <IconContainer>
                      <LocationIcon />
                    </IconContainer>
                    <Text>{card.locationText}</Text>
                  </IconWithText>
                  <IconWithText>
                    <IconContainer>
                      <PriceIcon />
                    </IconContainer>
                    <Text>{card.pricingText}</Text>
                  </IconWithText>
                </SecondaryInfoContainer>
                <Description>{card.description}</Description>
              </TextInfo>
              <PrimaryButton as="a" href={card.url}>
                Ver Mais
              </PrimaryButton>
            </Card>
          ))}
        </CardSlider>
      </Content>
    </Container>
  );
};
