import React, { useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
//eslint-disable-next-line

import Header from "../navbar/navbar.jsx";

import ReactModalAdapter from "../../helpers/ReactModalAdapter.jsx";
import ResponsiveVideoEmbed from "../../helpers/ResponsiveVideoEmbed.jsx";

import { PlayCircle as PlayIcon, X as CloseIcon } from "react-feather";
import SvgDecoratorBlob1 from "../assets/icons/svg/svg-decorator-blob-1.svg";
import SvgDecoratorBlob2 from "../assets/icons/svg/dot-pattern.svg";
import DesignIllustration from "../assets/icons/svg/design-illustration.svg";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col lg:flex-row md:items-center max-w-screen-xl mx-auto py-20 md:py-24`;
const LeftColumn = tw.div`relative lg:w-6/12 lg:pr-12 flex-shrink-0 text-center lg:text-left`;
const RightColumn = tw.div`relative mt-12 lg:mt-0 flex flex-col justify-center`;

const Heading = tw.h1`font-black text-3xl md:text-5xl leading-snug max-w-3xl`;
const Paragraph = tw.p`my-5 lg:my-8 text-sm lg:text-base font-medium text-gray-600 max-w-lg mx-auto lg:mx-0`;

const Actions = tw.div`flex flex-col items-center sm:flex-row justify-center lg:justify-start mt-8`;
const PrimaryButton = tw.button`font-bold px-8 lg:px-10 py-3 rounded bg-primary-500 text-gray-100 hocus:bg-primary-700 focus:shadow-outline focus:outline-none transition duration-300`;
const WatchVideoButton = styled.button`
  ${tw`mt-4 sm:mt-0 sm:ml-8 flex items-center text-secondary-300 transition duration-300 hocus:text-primary-400 focus:outline-none`}
  .playIcon {
    ${tw`stroke-1 w-12 h-12`}
  }
  .playText {
    ${tw`ml-2 font-medium`}
  }
`;

const IllustrationContainer = tw.div`flex justify-center md:justify-end items-center relative max-w-3xl lg:max-w-none`;

// Random Decorator Blobs (shapes that you see in background)
const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none opacity-5 absolute left-0 bottom-0 h-64 w-64 transform -translate-x-2/3  -z-10`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none fill-current text-primary-500 opacity-25 absolute w-32 h-32 right-0 bottom-0 transform translate-x-10 translate-y-10 -z-10`}
`;

const StyledModal = styled(ReactModalAdapter)`
  &.mainHeroModal__overlay {
    ${tw`fixed inset-0 z-50`}
  }
  &.mainHeroModal__content {
    ${tw`xl:mx-auto m-4 sm:m-16 max-w-screen-xl absolute inset-0 flex justify-center items-center rounded-lg bg-gray-200 outline-none`}
  }
  .content {
    ${tw`w-full lg:p-16`}
  }
`;
const CloseModalButton = tw.button`absolute top-0 right-0 mt-8 mr-8 hocus:text-primary-500`;

/**
 * Função utilitária para garantir segurança em URLs externas
 */
const getSafeUrl = (url) => {
  // Verifica se a URL é externa e adiciona rel="noopener noreferrer" para segurança
  if (url && typeof url === "string") {
    if (url.startsWith("http") && !url.includes(window.location.hostname)) {
      return {
        isExternal: true,
        url,
      };
    }
  }
  return {
    isExternal: false,
    url,
  };
};

export default ({
  heading = "Modern React Templates, Just For You",
  description = "Our templates are easy to setup, understand and customize. Fully modular components with a variety of pages and components.",
  primaryButtonText = "Get Started",
  primaryButtonUrl = "#",
  watchVideoButtonText = "Watch Video",
  watchVideoYoutubeUrl = "https://www.youtube.com/embed/_GuOjXYl5ew",
  imageSrc = DesignIllustration,
  imageCss = null,
  imageDecoratorBlob = false,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const toggleModal = () => setModalIsOpen(!modalIsOpen);

  // Adiciona verificação de segurança para URLs externas
  const primaryUrlData = getSafeUrl(primaryButtonUrl);
  const videoUrlData = getSafeUrl(watchVideoYoutubeUrl);

  return (
    <>
      <Header />
      <Container>
        <TwoColumn>
          <LeftColumn>
            <Heading>{heading}</Heading>
            <Paragraph>{description}</Paragraph>
            <Actions>
              {primaryUrlData.isExternal ? (
                <PrimaryButton
                  as="a"
                  href={primaryUrlData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {primaryButtonText}
                </PrimaryButton>
              ) : (
                <PrimaryButton as="a" href={primaryUrlData.url}>
                  {primaryButtonText}
                </PrimaryButton>
              )}
              <WatchVideoButton onClick={toggleModal}>
                <span className="playIconContainer">
                  <PlayIcon className="playIcon" />
                </span>
                <span className="playText">{watchVideoButtonText}</span>
              </WatchVideoButton>
            </Actions>
          </LeftColumn>
          <RightColumn>
            <IllustrationContainer>
              <img
                css={imageCss}
                src={imageSrc}
                alt="Hero"
                loading="eager" // Imagem hero é crítica e deve carregar rapidamente
                width="500"
                height="500"
              />
              {imageDecoratorBlob && <DecoratorBlob2 />}
            </IllustrationContainer>
          </RightColumn>
        </TwoColumn>
        <DecoratorBlob1 />
        <StyledModal
          closeTimeoutMS={300}
          className="mainHeroModal"
          isOpen={modalIsOpen}
          onRequestClose={toggleModal}
          shouldCloseOnOverlayClick={true}
        >
          <CloseModalButton onClick={toggleModal}>
            <CloseIcon tw="w-6 h-6" />
          </CloseModalButton>
          <div className="content">
            <ResponsiveVideoEmbed
              url={videoUrlData.url}
              title="Video Apresentação"
              allowFullScreen
              loading="lazy"
              sandbox={
                videoUrlData.isExternal
                  ? "allow-same-origin allow-scripts"
                  : undefined
              }
            />
          </div>
        </StyledModal>
      </Container>
    </>
  );
};
