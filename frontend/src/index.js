import { initSWHardBlock } from "@/swHardBlock";
import React, { Suspense, lazy, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "@/index.css";
import { I18nProvider, SUPPORTED_LOCALES } from "@/i18n";
import App from "@/App";
import SeoMeta from "@/components/SeoMeta";
import { BASE_URL } from "@/config/seo";

// Code splitting
const Thanks = lazy(() => import("@/Thanks"));
const NotFound = lazy(() => import("@/components/NotFound"));
const ProcessPage = lazy(() => import("@/pages/ProcessPage"));
const GuaranteesPage = lazy(() => import("@/pages/GuaranteesPage"));
const ContactsPage = lazy(() => import("@/pages/ContactsPage"));
const CatalogPage = lazy(() => import("@/pages/CatalogPage"));
const WatchesPage = lazy(() => import("@/pages/WatchesPage"));
const WatchesWithLogoPage = lazy(() => import("@/pages/WatchesWithLogoPage"));
const LightersPage = lazy(() => import("@/pages/LightersPage"));
const EngravedGiftsPage = lazy(() => import("@/pages/EngravedGiftsPage"));
const NeoGift = lazy(() => import("@/pages/NeoGift"));
const NeoCorporate = lazy(() => import("@/pages/NeoCorporate"));
const NeoWatchesLanding = lazy(() => import("@/pages/NeoWatchesLanding"));
const BlogIndex = lazy(() => import("@/pages/BlogIndex"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-teal-500 text-lg">Загрузка...</div>
  </div>
);

const RootRedirect = () => {
  const shouldRedirect = typeof window !== "undefined";
  return (
    <>
      <SeoMeta
        title="Graver.uz"
        description="Корпоративные подарки с лазерной гравировкой."
        canonicalUrl={`${BASE_URL}/ru`}
        ruUrl={`${BASE_URL}/ru`}
        uzUrl={`${BASE_URL}/uz`}
        locale="ru"
        robots="noindex, follow"
      />
      {shouldRedirect ? (
        <Navigate to="/ru" replace />
      ) : (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <a className="text-teal-500 underline" href="/ru">
            Перейти на русскую версию
          </a>
        </div>
      )}
    </>
  );
};

const LocaleRoute = ({ element }) => {
  const { locale } = useParams();
  if (!SUPPORTED_LOCALES.includes(locale)) {
    return <NotFound />;
  }
  return element;
};

const BlogRedirect = ({ fromLocale }) => {
  const { slug } = useParams();
  return <Navigate to={`/${fromLocale}/blog/${slug}`} replace />;
};

const LightersRedirect = () => {
  const { locale } = useParams();
  return <Navigate to={`/${locale}/products/lighters`} replace />;
};

initSWHardBlock();

const rootElement = document.getElementById("root");

// Determine if we should hydrate (page has prerendered content) or create new root
const hasPrerenderedContent = rootElement && rootElement.innerHTML && rootElement.innerHTML.trim().length > 100;

const AppRoutes = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <I18nProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/thanks" element={<Navigate to="/ru/thanks" replace />} />
              <Route path="/process" element={<Navigate to="/ru/process" replace />} />
              <Route path="/guarantees" element={<Navigate to="/ru/guarantees" replace />} />
              <Route path="/contacts" element={<Navigate to="/ru/contacts" replace />} />
              
              <Route path="/:locale" element={<LocaleRoute element={<App />} />} />
              <Route path="/:locale/thanks" element={<LocaleRoute element={<Thanks />} />} />
              <Route path="/:locale/process" element={<LocaleRoute element={<ProcessPage />} />} />
              <Route path="/:locale/guarantees" element={<LocaleRoute element={<GuaranteesPage />} />} />
              <Route path="/:locale/contacts" element={<LocaleRoute element={<ContactsPage />} />} />
              
              <Route path="/:locale/catalog-products" element={<LocaleRoute element={<CatalogPage />} />} />
              <Route path="/:locale/mahsulotlar-katalogi" element={<LocaleRoute element={<CatalogPage />} />} />
              <Route path="/:locale/watches-with-logo" element={<LocaleRoute element={<WatchesPage />} />} />
              <Route path="/:locale/logotipli-soat" element={<LocaleRoute element={<WatchesPage />} />} />
              <Route path="/:locale/products/watches-with-logo" element={<LocaleRoute element={<WatchesWithLogoPage />} />} />
              <Route path="/:locale/lighters-engraving" element={<LocaleRoute element={<LightersRedirect />} />} />
              <Route path="/:locale/gravirovkali-zajigalka" element={<LocaleRoute element={<LightersRedirect />} />} />
              <Route path="/:locale/products/lighters" element={<LocaleRoute element={<LightersPage />} />} />
              <Route path="/:locale/engraved-gifts" element={<LocaleRoute element={<EngravedGiftsPage />} />} />
              <Route path="/:locale/gravirovkali-sovgalar" element={<LocaleRoute element={<EngravedGiftsPage />} />} />
              <Route path="/:locale/products/neo-watches" element={<LocaleRoute element={<NeoWatchesLanding />} />} />
              <Route path="/:locale/products/neo-corporate" element={<LocaleRoute element={<NeoCorporate />} />} />
              <Route path="/:locale/neo-korporativ" element={<LocaleRoute element={<NeoCorporate />} />} />
              <Route path="/:locale/products/neo-gift" element={<LocaleRoute element={<NeoGift />} />} />
              <Route path="/:locale/neo-sovga" element={<LocaleRoute element={<NeoGift />} />} />
              <Route path="/:locale/neo-soatlar" element={<LocaleRoute element={<NeoWatchesLanding />} />} />
              
              <Route path="/:locale/blog" element={<LocaleRoute element={<BlogIndex />} />} />
              <Route path="/:locale/blog/:slug" element={<LocaleRoute element={<BlogPost />} />} />
              
              <Route path="/blog" element={<Navigate to="/ru/blog" replace />} />
              <Route path="/blog/ru" element={<Navigate to="/ru/blog" replace />} />
              <Route path="/blog/uz" element={<Navigate to="/uz/blog" replace />} />
              <Route path="/blog/ru/:slug" element={<BlogRedirect fromLocale="ru" />} />
              <Route path="/blog/uz/:slug" element={<BlogRedirect fromLocale="uz" />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </I18nProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

if (hasPrerenderedContent) {
  // Hydrate prerendered HTML (blog pages, etc.)
  console.log("[Hydration] Detected prerendered content - using hydrateRoot");
  ReactDOM.hydrateRoot(rootElement, AppRoutes);
} else {
  // Create new root for client-only pages
  console.log("[Rendering] No prerendered content - using createRoot");
  const root = ReactDOM.createRoot(rootElement);
  root.render(AppRoutes);
}
