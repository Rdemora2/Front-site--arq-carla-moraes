import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.jsx";
import Hero from "components/hero/FullWidthWithImage.jsx";
import Features from "components/features/ThreeColSimple.jsx";
import MainFeature from "components/features/TwoColSingleFeatureWithStats.jsx";
import SliderCard from "components/cards/ThreeColSlider.jsx";
import TrendingCard from "components/cards/TwoTrendingPreviewCardsWithImage.jsx";
import Blog from "components/blogs/PopularAndRecentBlogPosts.jsx";
import Testimonial from "components/testimonials/TwoColumnWithImageAndProfilePictureReview.jsx";
import FAQ from "components/faqs/SimpleWithSideImage.jsx";
import SubscribeNewsLetterForm from "components/forms/SimpleSubscribeNewsletter.jsx";
import Footer from "components/footers/MiniCenteredFooter.jsx";

export default () => (
  <AnimationRevealPage>
    <Hero />
    <Features />
    <SliderCard />
    <TrendingCard />
    <MainFeature />
    <Blog />
    <Testimonial textOnLeft={true} />
    <FAQ />
    <SubscribeNewsLetterForm />
    <Footer />
  </AnimationRevealPage>
);
