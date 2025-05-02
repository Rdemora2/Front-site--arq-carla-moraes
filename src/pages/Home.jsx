import React, { lazy, Suspense } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.jsx";

import Hero from "components/hero/FullWidthWithImage.jsx";
import Footer from "components/footers/FiveColumnWithInputForm.jsx";

const PriorityComponents = lazy(() => {
  const MainFeaturePromise = import(
    "components/features/TwoColSingleFeatureWithStats.jsx"
  );
  const FeaturesPromise = import("components/features/ThreeColSimple.jsx");

  return Promise.all([MainFeaturePromise, FeaturesPromise]).then(
    ([MainFeatureModule, FeaturesModule]) => ({
      default: () => (
        <>
          <MainFeatureModule.default />
          <FeaturesModule.default />
        </>
      ),
    })
  );
});

const SecondaryComponents = lazy(() => {
  const SliderCardPromise = import("components/cards/ThreeColSlider.jsx");
  const TrendingCardPromise = import(
    "components/cards/TwoTrendingPreviewCardsWithImage.jsx"
  );
  const TestimonialPromise = import(
    "components/testimonials/TwoColumnWithImageAndProfilePictureReview.jsx"
  );
  const FAQPromise = import("components/faqs/SimpleWithSideImage.jsx");

  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      import("components/forms/TwoColContactUsWithIllustrationFullForm.jsx");
    });
  }

  return Promise.all([
    SliderCardPromise,
    TrendingCardPromise,
    TestimonialPromise,
    FAQPromise,
  ]).then(([SliderModule, TrendingModule, TestimonialModule, FAQModule]) => ({
    default: () => (
      <>
        <SliderModule.default />
        <TrendingModule.default />
        <TestimonialModule.default textOnLeft={true} />
        <FAQModule.default />
      </>
    ),
  }));
});

const LoadingFallback = () => (
  <div
    className="loading-skeleton"
    style={{
      minHeight: "200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background:
        "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "pulse 1.5s ease-in-out infinite",
    }}
    aria-busy="true"
  />
);

const Home = React.memo(() => (
  <AnimationRevealPage>
    <Hero />
    <Suspense fallback={<LoadingFallback />}>
      <PriorityComponents />
    </Suspense>
    <Suspense fallback={<LoadingFallback />}>
      <SecondaryComponents />
    </Suspense>
    <Footer />
  </AnimationRevealPage>
));

export default Home;
