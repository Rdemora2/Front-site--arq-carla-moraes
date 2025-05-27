import React, { Suspense, lazy } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StyledComponentsProvider } from "./styles/StyledComponentsConfig";
import Analytics from "./components/misc/Analytics";
import ErrorBoundary from "./components/errors/ErrorBoundary";

// Lazy loading dos componentes de página
const Home = lazy(() => import("./pages/Home"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const ThankYouPage = lazy(() => import("./ThankYouPage"));

// Componente de loading melhorado
const LoadingFallback = () => (
  <div 
    className="loading-skeleton"
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s ease-in-out infinite",
    }}
    aria-busy="true"
    aria-label="Carregando página..."
  />
);

// Provider de contexto para toda a aplicação
const AppWithProviders = ({ children }) => (
  <ErrorBoundary>
    <StyledComponentsProvider>
      <GlobalStyles />
      <Analytics />
      {children}
    </StyledComponentsProvider>
  </ErrorBoundary>
);

// Função helper para criar elementos de rota
const createRouteElement = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <AppWithProviders>
      <Component />
    </AppWithProviders>
  </Suspense>
);

// Configuração do roteador
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: createRouteElement(Home),
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/sobre-nos",
      element: createRouteElement(AboutUs),
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/contato", 
      element: createRouteElement(ContactUs),
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/thank-you",
      element: createRouteElement(ThankYouPage),
      errorElement: <ErrorBoundary />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export default function App() {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    />
  );
}
