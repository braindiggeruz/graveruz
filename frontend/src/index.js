import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "@/index.css";
import { I18nProvider } from "@/i18n";
import App from "@/App";

// Code splitting: Thanks page loaded only when needed
const Thanks = lazy(() => import("@/Thanks"));

// 404 page
const NotFound = lazy(() => import("@/components/NotFound"));

// Loading fallback for lazy components
const LoadingFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-teal-500 text-lg">Загрузка...</div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <I18nProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Redirect root to default locale */}
              <Route path="/" element={<Navigate to="/ru" replace />} />
              
              {/* Localized routes */}
              <Route path="/:locale" element={<App />} />
              <Route path="/:locale/thanks" element={<Thanks />} />
              
              {/* 404 for unmatched routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </I18nProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
