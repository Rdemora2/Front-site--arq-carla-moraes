import React, { useState, memo, useCallback } from "react";
import Slider from "react-slick";
import styled from "styled-components";
import tw from "twin.macro";

import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "../misc/Headings.jsx";
import { PrimaryButton } from "../misc/Buttons.jsx";
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
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;
const TestimonialsContainer = tw.div`mt-16 lg:mt-0`;
const Testimonials = styled.div``;
const Testimonial = tw.div`max-w-md lg:max-w-none mx-auto lg:mx-0 flex flex-col items-center lg:items-stretch lg:flex-row`;

const TestimonialImageSlider = tw(Slider)`w-full lg:w-5/12 flex-shrink-0 `;
const TestimonialTextSlider = tw(Slider)``;
const TestimonialText = tw.div`outline-none`;

const ImageAndControlContainer = tw.div`relative outline-none`;
const Image = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`rounded bg-cover bg-center h-80 sm:h-96 lg:h-144`,
]);

const ControlContainer = tw.div`absolute bottom-0 right-0 bg-gray-100 px-6 py-4 rounded-tl-3xl border`;
const ControlButton = styled(PrimaryButton)`
  ${tw`mx-3 rounded-full text-gray-100 p-2`}
  svg {
    ${tw`w-5 h-5`}
  }
`;

const TextContainer = styled.div((props) => [
  tw`flex flex-col w-full lg:w-7/12`,
  props.textOnLeft ? tw`lg:pr-12 lg:order-first` : tw`lg:pl-12 lg:order-last`,
]);

const Subheading = tw(SubheadingBase)`mb-4`;
const HeadingTitle = tw(SectionHeading)`lg:text-left leading-tight`;
const Description = tw.p`max-w-md text-center mx-auto lg:mx-0 lg:text-left lg:max-w-none leading-relaxed text-sm sm:text-base lg:text-lg font-medium mt-4 text-secondary-100`;

const QuoteContainer = tw.div`relative mt-10 lg:mt-20`;
const Quote = tw.blockquote`text-center lg:text-left text-sm sm:text-lg lg:text-xl xl:text-2xl`;
const CustomerInfo = tw.div`mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start`;
const CustomerProfilePicture = tw.img`rounded-full w-20 h-20`;
const CustomerTextInfo = tw.div`text-center lg:text-left sm:ml-6 mt-2 sm:mt-0`;
const CustomerName = tw.h5`font-semibold text-xl lg:text-2xl xl:text-3xl text-primary-500`;
const CustomerTitle = tw.p`font-medium text-secondary-100`;

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

  const handlePrevClick = useCallback(() => {
    if (imageSliderRef) imageSliderRef.slickPrev();
  }, [imageSliderRef]);

  const handleNextClick = useCallback(() => {
    if (imageSliderRef) imageSliderRef.slickNext();
  }, [imageSliderRef]);

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
                    <Image
                      imageSrc={testimonial.imageSrc || imageSrc}
                      role="img"
                      aria-label="Imagem ilustrativa do depoimento"
                    />
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
