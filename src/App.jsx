import React, { Suspense, lazy } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Implementando lazy loading para melhorar performance inicial
const Home = lazy(() => import("./pages/Home"));
const ComponentRenderer = lazy(() => import("./ComponentRenderer"));
const ThankYouPage = lazy(() => import("./ThankYouPage"));

// Loading fallback para componentes lazy
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

export default function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/components/:type/:subtype/:name"
              element={<ComponentRenderer />}
            />
            <Route
              path="/components/:type/:name"
              element={<ComponentRenderer />}
            />
            <Route path="/thank-you" element={<ThankYouPage />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}
