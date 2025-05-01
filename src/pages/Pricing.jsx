import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.jsx";
import Header from "components/navbar/navbar.jsx";
import Pricing from "components/pricing/TwoPlansWithDurationSwitcher.jsx";
import Testimonial from "components/testimonials/ThreeColumnWithProfileImage.jsx";
import Footer from "components/footers/FiveColumnWithInputForm.jsx";
import FAQ from "components/faqs/SingleCol.jsx";

export default () => {
  return (
    <AnimationRevealPage>
      <Header />
      <Pricing />
      <Testimonial heading="Our Paying Customers" />
      <FAQ />
      <Footer />
    </AnimationRevealPage>
  );
};
