import React, { useState, memo, useCallback } from "react";
import Slider from "react-slick";
import styled from "styled-components";
import tw from "twin.macro";

import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "../misc/Headings.jsx";
import { PrimaryButton } from "../misc/Buttons.jsx";
import OptimizedImage from "components/misc/OptimizedImage.jsx";
import QuotesLeftIcon from "../../assets/icons/svg/quotes-l.svg";
import QuotesRightIcon from "../../assets/icons/svg/quotes-r.svg";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "react-feather";
import SvgDecoratorBlob1 from "../../assets/icons/svg/svg-decorator-blob-4.svg";
import SvgDecoratorBlob2 from "../../assets/icons/svg/svg-decorator-blob-5.svg";

import "slick-carousel/slick/slick.css";

const Container = tw.div`relative`;
const Content = styled.div`
  ${tw`max-w-screen-xl mx-auto py-20 lg:py-24`}

  @media (max-width: 1023px) {
    padding: 2.5rem 1rem;
  }
`;
const TestimonialsContainer = styled.div`
  ${tw`mt-16 lg:mt-0`}

  @media (max-width: 1023px) {
    margin-top: 1.5rem;
  }
`;
const Testimonials = styled.div``;
const Testimonial = tw.div`max-w-md lg:max-w-none mx-auto lg:mx-0 flex flex-col items-center lg:items-center lg:flex-row`;

const TestimonialImageSlider = tw(Slider)`w-full lg:w-5/12 flex-shrink-0 `;
const TestimonialTextSlider = tw(Slider)``;
const TestimonialText = tw.div`outline-none`;

const ImageAndControlContainer = tw.div`relative outline-none`;
const ImageContainer = styled.div`
  ${tw`rounded h-64 sm:h-80 lg:h-96 overflow-hidden`}

  @media (max-width: 639px) {
    height: 14rem;
    border-radius: 12px;
  }
`;
const StyledOptimizedImage = styled(OptimizedImage)`
  ${tw`w-full h-full`}
`;

const ControlContainer = styled.div`
  ${tw`absolute bottom-0 right-0 bg-gray-100 px-6 py-4 rounded-tl-3xl border`}

  @media (max-width: 639px) {
    padding: 0.5rem 0.75rem;
    border-radius: 12px 0 0 0;
  }
`;
const ControlButton = styled(PrimaryButton)`
  ${tw`mx-3 rounded-full text-gray-100 p-2`}
  transition: transform 0.3s ease;

  svg {
    ${tw`w-5 h-5`}
    transition: all 0.3s ease;
    pointer-events: none;
    background: transparent !important;
  }

  &:hover svg,
  &:focus svg,
  &:active svg {
    transform: none;
    background: transparent !important;
    box-shadow: none !important;
  }

  &:hover {
    transform: scale(1.1);
  }

  &:focus {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus:not(:focus-visible) {
    transform: none;
  }
`;

const TextContainer = styled.div((props) => [
  tw`flex flex-col w-full lg:w-7/12`,
  props.textOnLeft ? tw`lg:pr-12 lg:order-first` : tw`lg:pl-12 lg:order-last`,
]);

const Subheading = tw(SubheadingBase)`mb-4 text-sm md:text-sm lg:text-base`;
const HeadingTitle = tw(
  SectionHeading
)`lg:text-left leading-tight text-2xl sm:text-3xl lg:text-4xl`;
const Description = tw.p`max-w-md text-center mx-auto lg:mx-0 lg:text-left lg:max-w-none leading-relaxed text-sm md:text-sm lg:text-base font-medium mt-4 text-secondary-100`;

const QuoteContainer = styled.div`
  ${tw`relative mt-6 lg:mt-8`}

  @media (max-width: 1023px) {
    margin-top: 1.25rem;
  }
`;
const Quote = styled.blockquote`
  ${tw`text-center lg:text-left text-sm sm:text-base lg:text-lg`}

  @media (max-width: 639px) {
    font-size: 0.875rem;
    line-height: 1.6;
    font-style: italic;
  }
`;
const CustomerInfo = styled.div`
  ${tw`mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start`}

  @media (max-width: 639px) {
    margin-top: 1.25rem;
    flex-direction: row;
    gap: 0.75rem;
  }
`;
const CustomerProfilePicture = styled.img`
  ${tw`rounded-full w-20 h-20`}

  @media (max-width: 639px) {
    width: 3rem;
    height: 3rem;
  }
`;
const CustomerTextInfo = styled.div`
  ${tw`text-center lg:text-left sm:ml-6 mt-2 sm:mt-0`}

  @media (max-width: 639px) {
    text-align: left;
    margin-left: 0;
    margin-top: 0;
  }
`;
const CustomerName = styled.h5`
  ${tw`font-semibold text-lg lg:text-xl text-primary-500`}

  @media (max-width: 639px) {
    font-size: 0.9375rem;
  }
`;
const CustomerTitle = styled.p`
  ${tw`font-medium text-secondary-100`}

  @media (max-width: 639px) {
    font-size: 0.8125rem;
  }
`;

const QuotesLeft = tw(
  QuotesLeftIcon
)`w-6 h-6 opacity-75 text-primary-500 inline-block mr-1 -mt-3`;
const QuotesRight = tw(
  QuotesRightIcon
)`w-6 h-6 opacity-75 text-primary-500 inline-block ml-1 -mt-3`;

const DecoratorBlob1 = tw(
  SvgDecoratorBlob1
)`absolute w-32 top-0 left-0 -z-10 text-primary-500 opacity-25 transform -translate-x-full`;
const DecoratorBlob2 = tw(
  SvgDecoratorBlob2
)`absolute w-32 bottom-0 right-0 -z-10 text-pink-500 opacity-15 transform translate-x-2/3 translate-y-8`;

const TwoColumnWithImageAndProfilePictureReview = ({
  imageSrc = "https://images.unsplash.com/photo-1588557132645-ff567110cafd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80",
  imageRounded = true,
  imageBorder = false,
  imageShadow = false,
  subheading = "O que nossos clientes dizem",
  heading = "Transformando Sonhos em Paisagens Reais",
  description = "Conheça as histórias de quem confiou em nossos projetos e teve seus espaços transformados pela Carla Moraes Arquitetura Paisagística.",
  textOnLeft = false,
  testimonials = [
    {
      stars: 5,
      profileImageSrc:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=3.25&w=512&h=512&q=80",
      heading: "Uma Mudança Completa em Nosso Jardim",
      quote:
        "Nossa casa ganhou uma nova vida depois do projeto da Carla Moraes. O jardim se transformou no coração da casa, onde passamos momentos de qualidade em família. Cada detalhe foi pensado com cuidado, respeitando nossas preferências e trazendo soluções que não imaginávamos.",
      customerName: "Família Rodrigues",
      customerTitle: "São Paulo, SP",
    },
  ],
}) => {
  const [imageSliderRef, setImageSliderRef] = useState(null);
  const [textSliderRef, setTextSliderRef] = useState(null);

  const handlePrevClick = useCallback(
    (e) => {
      if (imageSliderRef) imageSliderRef.slickPrev();
      e.target.blur();
    },
    [imageSliderRef]
  );

  const handleNextClick = useCallback(
    (e) => {
      if (imageSliderRef) imageSliderRef.slickNext();
      e.target.blur();
    },
    [imageSliderRef]
  );

  return (
    <Container>
      <Content>
        <HeadingInfo
          tw="text-center lg:hidden"
          subheading={subheading}
          heading={heading}
          description={description}
        />
        <TestimonialsContainer>
          <Testimonials>
            <Testimonial>
              <TestimonialImageSlider
                arrows={false}
                ref={setImageSliderRef}
                asNavFor={textSliderRef}
                fade={true}
              >
                {testimonials.map((testimonial, index) => (
                  <ImageAndControlContainer key={index}>
                    <ImageContainer>
                      <StyledOptimizedImage
                        src={testimonial.imageSrc || imageSrc}
                        alt="Imagem ilustrativa do depoimento"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                    </ImageContainer>
                    <ControlContainer>
                      <ControlButton
                        onClick={handlePrevClick}
                        aria-label="Ver depoimento anterior"
                      >
                        <ChevronLeftIcon />
                      </ControlButton>
                      <ControlButton
                        onClick={handleNextClick}
                        aria-label="Ver próximo depoimento"
                      >
                        <ChevronRightIcon />
                      </ControlButton>
                    </ControlContainer>
                  </ImageAndControlContainer>
                ))}
              </TestimonialImageSlider>
              <TextContainer textOnLeft={textOnLeft}>
                <HeadingInfo
                  tw="hidden lg:block"
                  subheading={subheading}
                  heading={heading}
                  description={description}
                />
                <TestimonialTextSlider
                  arrows={false}
                  ref={setTextSliderRef}
                  asNavFor={imageSliderRef}
                  fade={true}
                >
                  {testimonials.map((testimonial, index) => (
                    <TestimonialText key={index}>
                      <QuoteContainer>
                        <Quote>
                          <QuotesLeft aria-hidden="true" />
                          {testimonial.quote}
                          <QuotesRight aria-hidden="true" />
                        </Quote>
                      </QuoteContainer>
                      <CustomerInfo>
                        <CustomerProfilePicture
                          src={testimonial.profileImageSrc}
                          alt={`Foto de ${testimonial.customerName}`}
                        />
                        <CustomerTextInfo>
                          <CustomerName>
                            {testimonial.customerName}
                          </CustomerName>
                          <CustomerTitle>
                            {testimonial.customerTitle}
                          </CustomerTitle>
                        </CustomerTextInfo>
                      </CustomerInfo>
                    </TestimonialText>
                  ))}
                </TestimonialTextSlider>
              </TextContainer>
            </Testimonial>
          </Testimonials>
        </TestimonialsContainer>
      </Content>
      <DecoratorBlob1 aria-hidden="true" />
      <DecoratorBlob2 aria-hidden="true" />
    </Container>
  );
};

const HeadingInfo = memo(({ subheading, heading, description, ...props }) => (
  <div {...props}>
    {subheading ? <Subheading>{subheading}</Subheading> : null}
    <HeadingTitle>{heading}</HeadingTitle>
    <Description>{description}</Description>
  </div>
));

export default memo(TwoColumnWithImageAndProfilePictureReview);
