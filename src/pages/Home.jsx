import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.jsx";
import Hero from "components/hero/FullWidthWithImage.jsx";
import Features from "components/features/ThreeColSimple.jsx";
import MainFeature from "components/features/TwoColSingleFeatureWithStats.jsx";
import SliderCard from "components/cards/ThreeColSlider.jsx";
import TrendingCard from "components/cards/TwoTrendingPreviewCardsWithImage.jsx";
import Testimonial from "components/testimonials/TwoColumnWithImageAndProfilePictureReview.jsx";
import FAQ from "components/faqs/SimpleWithSideImage.jsx";
import Footer from "components/footers/MiniCenteredFooter.jsx";
// import SubscribeNewsLetterForm from "components/forms/SimpleSubscribeNewsletter.jsx";
// import Blog from "components/blogs/PopularAndRecentBlogPosts.jsx";

export default () => (
  <AnimationRevealPage>
    <Hero />
    <MainFeature />
    <Features />
    <SliderCard />
    <TrendingCard />
    {/* <Blog /> */}
    <Testimonial textOnLeft={true} />
    <FAQ />
    {/* <SubscribeNewsLetterForm /> */}
    <Footer />
  </AnimationRevealPage>
);
