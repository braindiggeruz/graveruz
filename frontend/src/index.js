import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "@/index.css";
import { I18nProvider, SUPPORTED_LOCALES } from "@/i18n";
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

// Locale validator wrapper
const LocaleRoute = ({ element }) => {
  const { locale } = useParams();
  
  // If locale is invalid, show 404
  if (!SUPPORTED_LOCALES.includes(locale)) {
    return <NotFound />;
  }
  
  return element;
};

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
              
              {/* Legacy redirects for SEO (old URLs without locale) */}
              <Route path="/thanks" element={<Navigate to="/ru/thanks" replace />} />
              
              {/* Localized routes with validation */}
              <Route path="/:locale" element={<LocaleRoute element={<App />} />} />
              <Route path="/:locale/thanks" element={<LocaleRoute element={<Thanks />} />} />
              
              {/* 404 for unmatched routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </I18nProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
