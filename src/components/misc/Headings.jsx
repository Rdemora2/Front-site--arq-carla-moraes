import tw from "twin.macro";
import styled from "styled-components";

export const SectionHeading = styled.h2`
  ${tw`text-4xl sm:text-5xl font-black tracking-wide text-center`}
  color: var(--color-primary-text);

  @media (max-width: 1023px) {
    font-size: 1.75rem;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    font-size: 2.25rem;
  }
`;

export const Subheading = styled.h5`
  ${tw`font-bold text-primary-500`}

  @media (max-width: 1023px) {
    font-size: 0.8rem;
    letter-spacing: 0.1em;
  }
`;
