import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { Toaster } from "./components/ui/toaster";

// ✅ Render React app
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster />
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
