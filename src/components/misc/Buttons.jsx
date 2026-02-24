import tw from "twin.macro";
import styled from "styled-components";

export const PrimaryButton = styled.button`
  ${tw`px-8 py-3 font-bold rounded bg-primary-500 text-gray-100 hocus:bg-primary-700 hocus:text-gray-200 focus:shadow-outline focus:outline-none transition duration-300`}

  @media (max-width: 1023px) {
    min-height: 44px;
    padding: 0.75rem 1.5rem;
  }
`;
