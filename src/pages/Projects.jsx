import React, { lazy, Suspense, useEffect, useState, useCallback } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.jsx";
import MetaTags from "components/misc/MetaTags.jsx";
import { ComponentLoadingSpinner } from "components/misc/LoadingSpinner.jsx";
import { usePerformanceOptimizations } from "../hooks/usePerformanceOptimizations";

import Header from "components/navbar/navbar.jsx";
import Footer from "components/footers/FiveColumnWithInputForm.jsx";

const ProjectsPortfolio = lazy(() => import("components/projects/ProjectsPortfolio.jsx"));
const ProjectsFilter = lazy(() => import("components/projects/ProjectsFilter.jsx"));

const Projects = () => {
  const { preloadCriticalImages } = usePerformanceOptimizations();
  const [activeFilter, setActiveFilter] = useState("todos");

  useEffect(() => {
    if (typeof preloadCriticalImages === "function") {
      preloadCriticalImages([
        "/images/projects/Jardim-frances/frances-hero.webp",
        "/images/projects/Jardim-tropical/tropical-hero.webp",
      ]);
    }
  }, [preloadCriticalImages]);

  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  return (
    <AnimationRevealPage>
      <MetaTags
        title="Projetos de Paisagismo | Portfólio Carla Moraes Arquitetura Paisagística"
        description="Conheça nosso portfólio premium de projetos paisagísticos em São Paulo. Jardins residenciais de alto padrão, ambientes corporativos sustentáveis e design biofílico. +25 anos de experiência em arquitetura paisagística."
        imageUrl="/images/projects/Jardim-frances/frances-hero.webp"
        keywords="projetos paisagísticos São Paulo, jardins residenciais alto padrão, paisagismo corporativo, arquitetura paisagística, design biofílico, jardins sustentáveis, Carla Moraes paisagista"
      />
      
      <Header />

      {/* Filtros de projetos com Suspense */}
      <Suspense fallback={<ComponentLoadingSpinner />}>
        <ProjectsFilter 
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </Suspense>

      {/* Portfolio principal com Suspense */}
      <Suspense fallback={<ComponentLoadingSpinner />}>
        <ProjectsPortfolio 
          currentFilter={activeFilter}
        />
      </Suspense>

      <Footer />
    </AnimationRevealPage>
  );
};

export default React.memo(Projects);
