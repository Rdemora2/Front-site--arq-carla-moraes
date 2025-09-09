import React, { lazy, Suspense, useEffect } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.jsx";
import MetaTags from "components/misc/MetaTags.jsx";
import { ComponentLoadingSpinner } from "components/misc/LoadingSpinner.jsx";
import { usePerformanceOptimizations } from "../hooks/usePerformanceOptimizations";

import Hero from "components/hero/FullWidthWithImage.jsx";
import Footer from "components/footers/FiveColumnWithInputForm.jsx";

import MainFeature from "components/features/TwoColSingleFeatureWithStats.jsx";
import Features from "components/features/ThreeColSimple.jsx";

const SliderCards = lazy(() => import("components/cards/ThreeColSlider.jsx"));
const Testimonial = lazy(
  () =>
    import(
      "components/testimonials/TwoColumnWithImageAndProfilePictureReview.jsx"
    ),
);
const FaqSection = lazy(() => import("components/faqs/SimpleWithSideImage.jsx"));

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
    <>
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
        <Features linkText="" />

        {/* Componentes secundários com Suspense */}
        <Suspense fallback={<ComponentLoadingSpinner />}>
          <SliderCards />
        </Suspense>

        <Suspense fallback={<ComponentLoadingSpinner />}>
          <Testimonial textOnLeft={true} />
        </Suspense>

        <Suspense fallback={<ComponentLoadingSpinner />}>
          <FaqSection />
        </Suspense>
      </AnimationRevealPage>

      {/* Footer fora do AnimationRevealPage para remover a animação */}
      <Footer />
    </>
  );
};

export default React.memo(Home);
