import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.jsx";
import tw from "twin.macro";

import Header from "components/headers/light.jsx";
import Footer from "components/footers/FiveColumnWithInputForm.jsx";
import ContactUsForm from "components/forms/TwoColContactUsWithIllustrationFullForm.jsx";
import ContactDetails from "components/cards/ThreeColContactDetails.jsx";

const Address = tw.span`leading-relaxed`;
const AddressLine = tw.span`block`;
const Email = tw.span`text-sm mt-6 block text-gray-500`;
const Phone = tw.span`text-sm mt-0 block text-gray-500`;

export default () => {
  return (
    <AnimationRevealPage>
      <Header />
      <ContactUsForm />
      <ContactDetails
        cards={[
          {
            title: "São Paulo",
            description: (
              <>
                <Address>
                  <AddressLine>São Paulo, SP</AddressLine>
                  <AddressLine>Brasil</AddressLine>
                </Address>
                <Email>contact@arqcarlamoraes.com</Email>
                <Phone>(11) 99985-4345</Phone>
              </>
            ),
          },
        ]}
      />
      <Footer />
    </AnimationRevealPage>
  );
};
