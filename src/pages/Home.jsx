import React, { lazy, Suspense, useEffect } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.jsx";
import MetaTags from "components/misc/MetaTags.jsx";
import { usePerformanceOptimizations } from "../hooks/usePerformanceOptimizations";

import Hero from "components/hero/FullWidthWithImage.jsx";
import Footer from "components/footers/FiveColumnWithInputForm.jsx";

import MainFeature from "components/features/TwoColSingleFeatureWithStats.jsx";
import Features from "components/features/ThreeColSimple.jsx";

const SliderCards = lazy(() => import("components/cards/ThreeColSlider.jsx"));
const TrendingCards = lazy(
  () => import("components/cards/TwoTrendingPreviewCardsWithImage.jsx")
);
const Testimonial = lazy(
  () =>
    import(
      "components/testimonials/TwoColumnWithImageAndProfilePictureReview.jsx"
    )
);
const FAQ = lazy(() => import("components/faqs/SimpleWithSideImage.jsx"));

const LoadingFallback = () => (
  <div
    className="loading-skeleton"
    style={{
      minHeight: "100px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "2rem 0",
      background: "#f7fafc",
    }}
    aria-busy="true"
    aria-label="Carregando conteúdo"
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "3px solid #e2e8f0",
        borderRadius: "50%",
        borderTopColor: "#3e4d2c",
        animation: "spin 1s linear infinite",
      }}
    />
  </div>
);

const Home = () => {
  const { preloadCriticalImages } = usePerformanceOptimizations();

  useEffect(() => {
    if (typeof preloadCriticalImages === "function") {
      preloadCriticalImages([
        "/images/components/hero/Frances-hero.webp",
        "/images/logo/logo_reduced.webp",
      ]);
    }
  }, [preloadCriticalImages]);

  return (
    <AnimationRevealPage>
      <MetaTags
        title="Carla Moraes - Arquitetura paisagística"
        description="Há mais de 25 anos criando projetos paisagísticos exclusivos que harmonizam arquitetura e natureza. Do conceito à execução, trazemos beleza e propósito para cada ambiente."
        imageUrl="/images/components/hero/Frances-hero.webp"
        keywords="arquitetura paisagística, paisagismo, projetos de jardim, design exterior, São Paulo"
      />
      <Hero />

      {/* Componentes principais carregados diretamente */}
      <MainFeature />
      <Features />

      {/* Componentes secundários com Suspense */}
      <Suspense fallback={<LoadingFallback />}>
        <SliderCards />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <TrendingCards />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <Testimonial textOnLeft={true} />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <FAQ />
      </Suspense>

      <Footer />
    </AnimationRevealPage>
  );
};

export default React.memo(Home);
