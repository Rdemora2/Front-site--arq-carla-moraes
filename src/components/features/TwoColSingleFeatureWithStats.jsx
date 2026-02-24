import React from "react";
import PropTypes from "prop-types";
import tw from "twin.macro";
import styled from "styled-components";
import { SectionHeading } from "components/misc/Headings.jsx";
import OptimizedImage from "components/misc/OptimizedImage.jsx";

const Container = styled.div`
  ${tw`relative py-16 md:py-20 lg:py-24`}

  @media (max-width: 1023px) {
    padding-top: 2.5rem;
    padding-bottom: 2.5rem;
  }
`;

const TwoColumn = styled.div`
  ${tw`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-12 md:py-16`}

  @media (max-width: 1023px) {
    padding: 0 1rem;
  }
`;

const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;

const ImageColumn = styled(Column)`
  ${tw`md:w-6/12 lg:w-5/12 flex-shrink-0`}
  height: 16rem;

  @media (min-width: 768px) {
    height: auto;
  }

  @media (max-width: 767px) {
    height: 14rem;
    border-radius: 12px;
    overflow: hidden;
  }
`;

const ImageContainer = tw.div`rounded h-full overflow-hidden`;
const StyledOptimizedImage = styled(OptimizedImage)`
  ${tw`w-full h-full`}
`;
const TextColumn = styled(Column)(({ $textOnLeft }) => [
  tw`md:w-6/12 mt-8 md:mt-0`,
  $textOnLeft
    ? tw`md:mr-8 lg:mr-16 md:order-first`
    : tw`md:ml-8 lg:ml-16 md:order-last`,
]);

const TextContent = tw.div`lg:py-8`;

const Heading = styled(SectionHeading)`
  ${tw`text-left text-2xl sm:text-3xl lg:text-4xl text-center md:text-left leading-tight`}

  @media (max-width: 767px) {
    font-size: 1.5rem;
    margin-top: 0.5rem;
  }
`;

const Description = styled.p`
  ${tw`text-center md:text-left text-sm md:text-sm lg:text-base font-medium leading-relaxed text-secondary-100 mt-4`}

  @media (max-width: 767px) {
    font-size: 0.875rem;
    line-height: 1.6;
  }
`;

const Statistics = styled.div`
  ${tw`mt-6 lg:mt-8 xl:mt-12 flex flex-wrap`}

  @media (max-width: 767px) {
    margin-top: 1.5rem;
    gap: 0.5rem 0;
  }
`;

const Statistic = styled.div`
  ${tw`text-base sm:text-lg lg:text-xl w-1/2 mt-4 lg:mt-6 text-center md:text-left`}

  @media (max-width: 767px) {
    margin-top: 0.75rem;
  }
`;

const Value = styled.div`
  ${tw`font-bold text-primary-500`}

  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
`;

const Key = styled.div`
  ${tw`font-bold text-gray-700`}

  @media (max-width: 767px) {
    font-size: 0.8125rem;
    font-weight: 500;
  }
`;

const TwoColSingleFeatureWithStats = ({
  heading = (
    <>
      <span tw="text-primary-500">Excelência Reconhecida</span>
    </>
  ),
  description = "Desde 1996, a Carla Moraes Arquitetura Paisagística é referência em projetos que transformam espaços em experiências sensoriais únicas. Nossa expertise combina técnica apurada, visão estética refinada e compromisso com a sustentabilidade, criando paisagens que resistem ao tempo e valorizam significativamente seu patrimônio.",
  imageSrc = null,
  textOnLeft = true,
  statistics = null,
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
          <ImageContainer>
            <StyledOptimizedImage
              src={imageSrc || "/images/projects/Jardim-tropical/tropical-4"}
              alt="Projeto de paisagismo Carla Moraes"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </ImageContainer>
        </ImageColumn>
        <TextColumn $textOnLeft={textOnLeft}>
          <TextContent>
            <Heading>{heading || "Excelência Reconhecida"}</Heading>
            <Description>
              {description ||
                "Desde 1996, a Carla Moraes Arquitetura Paisagística é referência em projetos que transformam espaços em experiências sensoriais únicas. Nossa expertise combina técnica apurada, visão estética refinada e compromisso com a sustentabilidade, criando paisagens que resistem ao tempo e valorizam significativamente seu patrimônio."}
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

TwoColSingleFeatureWithStats.propTypes = {
  heading: PropTypes.node,
  description: PropTypes.string,
  primaryButtonText: PropTypes.string,
  primaryButtonUrl: PropTypes.string,
  imageSrc: PropTypes.string,
  buttonRounded: PropTypes.bool,
  imageRounded: PropTypes.bool,
  imageBorder: PropTypes.bool,
  imageShadow: PropTypes.bool,
  showDecoratorBlob: PropTypes.bool,
  textOnLeft: PropTypes.bool,
  statistics: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  testimonial: PropTypes.object,
  imageContain: PropTypes.bool,
};

export default TwoColSingleFeatureWithStats;
