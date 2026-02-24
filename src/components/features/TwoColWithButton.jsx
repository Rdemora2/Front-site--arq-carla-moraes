/* eslint-disable react/prop-types */
import React from "react";
import tw from "twin.macro";
import styled, { css } from "styled-components";
import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "components/misc/Headings.jsx";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.jsx";
import OptimizedImage from "components/misc/OptimizedImage.jsx";
import SvgDotPattern from "../../assets/icons/svg/dot-pattern.svg?url";

const Container = tw.div`relative`;
const TwoColumn = styled.div`
  ${tw`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24 items-center`}

  @media (max-width: 767px) {
    padding: 2.5rem 1rem;
  }
`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-6/12 flex-shrink-0 relative`;
const TextColumn = styled(Column)((props) => [
  tw`md:w-6/12 mt-16 md:mt-0`,
  props.textOnLeft
    ? tw`md:mr-12 lg:mr-16 md:order-first`
    : tw`md:ml-12 lg:ml-16 md:order-last`,
]);

const Image = styled(OptimizedImage).withConfig({
  shouldForwardProp: (prop) =>
    !["imageRounded", "imageBorder", "imageShadow"].includes(prop),
})((props) => [
  props.imageRounded && tw`rounded`,
  props.imageBorder && tw`border`,
  props.imageShadow && tw`shadow`,
]);

const DecoratorBlob = styled(SvgDotPattern)(() => [
  tw`w-20 h-20 absolute transform translate-x-1/2 translate-y-1/2 fill-current text-primary-500 -z-10`,
  css`
    right: 0;
    bottom: 0;
  `,
]);

const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = styled(SectionHeading)`
  ${tw`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`}

  @media (max-width: 767px) {
    font-size: 1.5rem;
    margin-top: 0.5rem;
  }
`;

const Description = styled.p`
  ${tw`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`}

  @media (max-width: 767px) {
    font-size: 0.875rem;
    line-height: 1.6;
  }
`;

const PrimaryButton = styled(PrimaryButtonBase).withConfig({
  shouldForwardProp: (prop) => !["buttonRounded"].includes(prop),
})((props) => [
  tw`mt-8 md:mt-8 text-sm inline-block mx-auto md:mx-0`,
  props.buttonRounded && tw`rounded-full`,
  `
    @media (max-width: 767px) {
      width: 100%;
      text-align: center;
      padding: 0.875rem 1.5rem;
    }
  `,
]);

export default ({
  subheading = "Our Expertise",
  heading = (
    <>
      Designed & Developed by <span>Professionals.</span>
    </>
  ),
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  primaryButtonText = "Learn More",
  primaryButtonUrl = "https://timerse.com",
  imageSrc = "",
  buttonRounded = true,
  imageRounded = true,
  imageBorder = false,
  imageShadow = false,
  imageCss = null,
  imageDecoratorBlob = false,
  imageDecoratorBlobCss = null,
  textOnLeft = true,
}) => {
  return (
    <Container>
      <TwoColumn>
        <ImageColumn>
          <Image
            css={imageCss}
            src={imageSrc}
            imageBorder={imageBorder}
            imageShadow={imageShadow}
            imageRounded={imageRounded}
            alt=""
          />
          {imageDecoratorBlob && <DecoratorBlob css={imageDecoratorBlobCss} />}
        </ImageColumn>
        <TextColumn textOnLeft={textOnLeft}>
          <TextContent>
            <Subheading>{subheading}</Subheading>
            <Heading>{heading}</Heading>
            <Description>{description}</Description>
            <PrimaryButton
              buttonRounded={buttonRounded}
              as="a"
              href={primaryButtonUrl}
            >
              {primaryButtonText}
            </PrimaryButton>
          </TextContent>
        </TextColumn>
      </TwoColumn>
    </Container>
  );
};
