import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { SectionHeading } from "components/misc/Headings.jsx";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(
  Column
)`md:w-6/12 lg:w-5/12 flex-shrink-0 h-80 md:h-auto`;
const TextColumn = styled(Column)(({ $textOnLeft }) => [
  tw`md:w-6/12 mt-8 md:mt-0`,
  $textOnLeft
    ? tw`md:mr-8 lg:mr-16 md:order-first`
    : tw`md:ml-8 lg:ml-16 md:order-last`,
]);

const Image = styled.div(({ $imageSrc }) => [
  `background-image: url("${$imageSrc}");`,
  tw`rounded bg-cover bg-center h-full`,
]);
const TextContent = tw.div`lg:py-8`;

const Heading = tw(
  SectionHeading
)`text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100 mt-4`;

const Statistics = tw.div`mt-6 lg:mt-8 xl:mt-16 flex flex-wrap`;
const Statistic = tw.div`text-lg sm:text-2xl lg:text-3xl w-1/2 mt-4 lg:mt-10 text-center md:text-left`;
const Value = tw.div`font-bold text-primary-500`;
const Key = tw.div`font-medium text-gray-700`;

export default ({
  heading = (
    <>
      <span tw="text-primary-500">Features</span>
    </>
  ),
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  primaryButtonText = "Learn More",
  primaryButtonUrl = "https://timerse.com",
  imageSrc = null,
  buttonRounded = true,
  imageRounded = true,
  imageBorder = false,
  imageShadow = false,
  showDecoratorBlob = false,
  textOnLeft = true,
  statistics = null,
  testimonial = null,
  imageContain = false,
}) => {
  const defaultStatistics = [
    {
      key: "Anos de Experiência",
      value: "25+",
    },
    {
      key: "Projetos Realizados",
      value: "310+",
    },
    {
      key: "m² Transformados",
      value: "120K+",
    },
    {
      key: "Clientes Satisfeitos",
      value: "98%",
    },
  ];

  return (
    <Container>
      <TwoColumn>
        <ImageColumn>
          <Image
            $imageSrc={
              imageSrc ||
              "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80"
            }
          />
        </ImageColumn>
        <TextColumn $textOnLeft={textOnLeft}>
          <TextContent>
            <Heading>
              {heading || "Tradição e Inovação em Cada Projeto"}
            </Heading>
            <Description>
              {description ||
                "Desde 1996, a Carla Moraes Arquitetura Paisagística tem transformado espaços em experiências sensoriais únicas. Nossa equipe de especialistas combina técnica apurada e sensibilidade estética para criar paisagens que dialogam harmoniosamente com a arquitetura e as necessidades dos usuários. Priorizamos soluções que resistam ao tempo, com espécies adequadas e materiais de alta qualidade."}
            </Description>
            <Statistics>
              {(statistics || defaultStatistics).map((statistic, index) => (
                <Statistic key={index}>
                  <Value>{statistic.value}</Value>
                  <Key>{statistic.key}</Key>
                </Statistic>
              ))}
            </Statistics>
          </TextContent>
        </TextColumn>
      </TwoColumn>
    </Container>
  );
};
