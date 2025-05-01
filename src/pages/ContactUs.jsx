import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.jsx";
import tw from "twin.macro";
import styled from "styled-components";

import Header from "components/headers/light.jsx";
import Footer from "components/footers/FiveColumnWithInputForm.jsx";
import ContactUsForm from "components/forms/TwoColContactUsWithIllustrationFullForm.jsx";

const Address = tw.span`leading-relaxed`;
const AddressLine = tw.span`block`;
const Email = tw.span`text-sm mt-6 block text-gray-500`;
const Phone = tw.span`text-sm mt-0 block text-gray-500`;

const StyledContactUsForm = styled(ContactUsForm)`
  h2 {
    color: #3e4d2c;
  }
  button {
    background-color: #8c9b7a;
    &:hover {
      background-color: #3e4d2c;
    }
  }
`;

export default () => {
  return (
    <AnimationRevealPage>
      <Header />
      <StyledContactUsForm formAction="#" formMethod="get" />
      <Footer />
    </AnimationRevealPage>
  );
};
