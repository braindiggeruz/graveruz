import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "@/index.css";
import { I18nProvider, SUPPORTED_LOCALES } from "@/i18n";
import App from "@/App";

// Code splitting: Pages loaded only when needed
const Thanks = lazy(() => import("@/Thanks"));
const NotFound = lazy(() => import("@/components/NotFound"));
const ProcessPage = lazy(() => import("@/pages/ProcessPage"));
const GuaranteesPage = lazy(() => import("@/pages/GuaranteesPage"));
const ContactsPage = lazy(() => import("@/pages/ContactsPage"));
// B2C Catalog Pages
const CatalogPage = lazy(() => import("@/pages/CatalogPage"));
const WatchesPage = lazy(() => import("@/pages/WatchesPage"));
const LightersPage = lazy(() => import("@/pages/LightersPage"));
const EngravedGiftsPage = lazy(() => import("@/pages/EngravedGiftsPage"));
// Blog Pages
const BlogIndex = lazy(() => import("@/pages/BlogIndex"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));

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

// Blog redirect helper (for old /blog/ru/:slug -> /ru/blog/:slug)
const BlogRedirect = ({ fromLocale }) => {
  const { slug } = useParams();
  return <Navigate to={`/${fromLocale}/blog/${slug}`} replace />;
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
              <Route path="/process" element={<Navigate to="/ru/process" replace />} />
              <Route path="/guarantees" element={<Navigate to="/ru/guarantees" replace />} />
              <Route path="/contacts" element={<Navigate to="/ru/contacts" replace />} />
              
              {/* Localized routes with validation */}
              <Route path="/:locale" element={<LocaleRoute element={<App />} />} />
              <Route path="/:locale/thanks" element={<LocaleRoute element={<Thanks />} />} />
              <Route path="/:locale/process" element={<LocaleRoute element={<ProcessPage />} />} />
              <Route path="/:locale/guarantees" element={<LocaleRoute element={<GuaranteesPage />} />} />
              <Route path="/:locale/contacts" element={<LocaleRoute element={<ContactsPage />} />} />
              
              {/* B2C Catalog Pages */}
              <Route path="/:locale/catalog-products" element={<LocaleRoute element={<CatalogPage />} />} />
              <Route path="/:locale/mahsulotlar-katalogi" element={<LocaleRoute element={<CatalogPage />} />} />
              <Route path="/:locale/watches-with-logo" element={<LocaleRoute element={<WatchesPage />} />} />
              <Route path="/:locale/logotipli-soat" element={<LocaleRoute element={<WatchesPage />} />} />
              <Route path="/:locale/lighters-engraving" element={<LocaleRoute element={<LightersPage />} />} />
              <Route path="/:locale/gravirovkali-zajigalka" element={<LocaleRoute element={<LightersPage />} />} />
              <Route path="/:locale/engraved-gifts" element={<LocaleRoute element={<EngravedGiftsPage />} />} />
              <Route path="/:locale/gravirovkali-sovgalar" element={<LocaleRoute element={<EngravedGiftsPage />} />} />
              
              {/* Blog Routes */}
              <Route path="/:locale/blog" element={<LocaleRoute element={<BlogIndex />} />} />
              <Route path="/:locale/blog/:slug" element={<LocaleRoute element={<BlogPost />} />} />
              
              {/* Legacy blog redirects (old URLs: /blog/ru -> /ru/blog) */}
              <Route path="/blog" element={<Navigate to="/ru/blog" replace />} />
              <Route path="/blog/ru" element={<Navigate to="/ru/blog" replace />} />
              <Route path="/blog/uz" element={<Navigate to="/uz/blog" replace />} />
              <Route path="/blog/ru/:slug" element={<BlogRedirect fromLocale="ru" />} />
              <Route path="/blog/uz/:slug" element={<BlogRedirect fromLocale="uz" />} />
              
              {/* 404 for unmatched routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </I18nProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
