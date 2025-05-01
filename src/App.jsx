import React, { Suspense, lazy } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StyledComponentsProvider } from "./styles/StyledComponentsConfig";

const Home = lazy(() => import("./pages/Home"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const ThankYouPage = lazy(() => import("./ThankYouPage"));

const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    Carregando...
  </div>
);
const AppWithProviders = ({ children }) => (
  <StyledComponentsProvider>
    <GlobalStyles />
    {children}
  </StyledComponentsProvider>
);

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AppWithProviders>
            <Home />
          </AppWithProviders>
        </Suspense>
      ),
    },
    {
      path: "/sobre-nos",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AppWithProviders>
            <AboutUs />
          </AppWithProviders>
        </Suspense>
      ),
    },
    {
      path: "/contato",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AppWithProviders>
            <ContactUs />
          </AppWithProviders>
        </Suspense>
      ),
    },
    {
      path: "/thank-you",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AppWithProviders>
            <ThankYouPage />
          </AppWithProviders>
        </Suspense>
      ),
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
