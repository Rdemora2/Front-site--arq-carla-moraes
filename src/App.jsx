import React from "react";
import GlobalStyles from "./styles/GlobalStyles";

import Home from "./pages/Home";
import ComponentRenderer from "./ComponentRenderer";
import ThankYouPage from "./ThankYouPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
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
      </Router>
    </>
  );
}
