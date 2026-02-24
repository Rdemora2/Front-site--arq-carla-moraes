import tw from "twin.macro";
import styled from "styled-components";

export const Container = tw.div`relative`;

export const ContentWithPaddingXl = styled.div`
  ${tw`max-w-screen-xl mx-auto py-20 lg:py-24 px-4 sm:px-6 lg:px-8`}

  @media (max-width: 1023px) {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }

  @media (max-width: 639px) {
    padding-top: 2.5rem;
    padding-bottom: 2.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

export const ContentWithPaddingLg = styled.div`
  ${tw`max-w-screen-lg mx-auto py-20 lg:py-24 px-4 sm:px-6 lg:px-8`}

  @media (max-width: 1023px) {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }

  @media (max-width: 639px) {
    padding-top: 2.5rem;
    padding-bottom: 2.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

export const ContentWithVerticalPadding = styled.div`
  ${tw`py-20 lg:py-24`}

  @media (max-width: 1023px) {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
`;

export const Content2Xl = tw.div`max-w-screen-2xl mx-auto`;
