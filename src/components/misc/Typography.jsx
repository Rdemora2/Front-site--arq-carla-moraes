import tw from "twin.macro";
import styled from "styled-components";

export const SectionDescription = styled.p`
  ${tw`mt-4 text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100 max-w-xl`}

  @media (max-width: 1023px) {
    font-size: 0.9rem;
    line-height: 1.6;
    margin-top: 0.75rem;
  }
`;
