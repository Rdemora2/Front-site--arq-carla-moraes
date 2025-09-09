import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Slider from "react-slick";
import tw from "twin.macro";
import styled from "styled-components";
import { SectionHeading } from "components/misc/Headings";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons";
import { getFeaturedProjects } from "../../data/projectsData";
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

const ThreeColSlider = ({ heading = <span>Projetos em Destaque</span> }) => {
  const navigate = useNavigate();
  const [sliderRef, setSliderRef] = useState(null);

  const featuredProjects = useMemo(() => getFeaturedProjects(5), []);

  const sliderSettings = useMemo(
    () => ({
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
    }),
    []
  );

  const handlePrevClick = useCallback(() => {
    if (sliderRef) sliderRef.slickPrev();
  }, [sliderRef]);

  const handleNextClick = useCallback(() => {
    if (sliderRef) sliderRef.slickNext();
  }, [sliderRef]);

  const handleViewAllProjects = useCallback(() => {
    navigate("/projetos");
  }, [navigate]);

  const updateTabIndex = useCallback(() => {
    const hiddenSlides = document.querySelectorAll(
      '.slick-slide[aria-hidden="true"]'
    );
    hiddenSlides.forEach((slide) => {
      const focusableElements = slide.querySelectorAll("a, button, [tabindex]");
      focusableElements.forEach((el) => {
        el.setAttribute("tabindex", "-1");
      });
    });
  }, []);

  useEffect(() => {
    if (document.readyState === "complete") {
      updateTabIndex();
    } else {
      window.addEventListener("load", updateTabIndex);
      return () => window.removeEventListener("load", updateTabIndex);
    }
  }, [updateTabIndex]);

  return (
    <Container>
      <Content>
        <HeadingWithControl>
          <Heading>{heading}</Heading>
          <Controls>
            <PrevButton
              onClick={handlePrevClick}
              aria-label="Navegar para projeto anterior"
            >
              <ChevronLeftIcon />
            </PrevButton>
            <NextButton
              onClick={handleNextClick}
              aria-label="Navegar para próximo projeto"
            >
              <ChevronRightIcon />
            </NextButton>
          </Controls>
        </HeadingWithControl>
        <CardSlider
          ref={setSliderRef}
          {...sliderSettings}
          afterChange={updateTabIndex}
        >
          {featuredProjects.map((project, index) => (
            <Card key={`project-${project.id}`}>
              <CardImage
                imageSrc={project.featuredImage}
                role="img"
                aria-label={`Imagem do projeto ${project.title}`}
                loading={index > 2 ? "lazy" : "eager"}
              />
              <TextInfo>
                <TitleReviewContainer>
                  <Title>{project.title}</Title>
                  <RatingsInfo>
                    <StarIcon aria-hidden="true" />
                    <Rating>5.0</Rating>
                  </RatingsInfo>
                </TitleReviewContainer>
                <SecondaryInfoContainer>
                  <IconWithText>
                    <IconContainer aria-hidden="true">
                      <LocationIcon />
                    </IconContainer>
                    <Text>{project.location}</Text>
                  </IconWithText>
                  <IconWithText>
                    <IconContainer aria-hidden="true">
                      <PriceIcon />
                    </IconContainer>
                    <Text>{project.area}</Text>
                  </IconWithText>
                </SecondaryInfoContainer>
                <Description>{project.description}</Description>
              </TextInfo>
              <PrimaryButton
                onClick={handleViewAllProjects}
                aria-label={`Ver todos os projetos - ${project.title}`}
              >
                Ver Todos os Projetos
              </PrimaryButton>
            </Card>
          ))}
        </CardSlider>
      </Content>
    </Container>
  );
};

ThreeColSlider.propTypes = {
  heading: PropTypes.node,
};

ThreeColSlider.defaultProps = {
  heading: <span>Projetos em Destaque</span>,
};

export default memo(ThreeColSlider);
