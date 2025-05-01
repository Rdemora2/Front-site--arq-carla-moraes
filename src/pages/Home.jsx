import React, { lazy, Suspense } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.jsx";

// Carregamento imediato apenas dos componentes críticos
import Hero from "components/hero/FullWidthWithImage.jsx";
import Footer from "components/footers/MiniCenteredFooter.jsx";

// Lazy loading para componentes abaixo da dobra
const MainFeature = lazy(() =>
  import("components/features/TwoColSingleFeatureWithStats.jsx")
);
const Features = lazy(() => import("components/features/ThreeColSimple.jsx"));
const SliderCard = lazy(() => import("components/cards/ThreeColSlider.jsx"));
const TrendingCard = lazy(() =>
  import("components/cards/TwoTrendingPreviewCardsWithImage.jsx")
);
const Testimonial = lazy(() =>
  import(
    "components/testimonials/TwoColumnWithImageAndProfilePictureReview.jsx"
  )
);
const FAQ = lazy(() => import("components/faqs/SimpleWithSideImage.jsx"));

// Componente de carregamento
const LoadingFallback = () => (
  <div
    className="loading-container"
    style={{
      minHeight: "300px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div className="loading-spinner">Carregando...</div>
  </div>
);

const Home = () => (
  <AnimationRevealPage>
    <Hero />
    <Suspense fallback={<LoadingFallback />}>
      <MainFeature />
      <Features />
      <SliderCard />
      <TrendingCard />
      <Testimonial textOnLeft={true} />
      <FAQ />
    </Suspense>
    <Footer />
  </AnimationRevealPage>
);

export default Home;
