import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "./lib/i18n";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CalculatorPage from "./pages/CalculatorPage";
import BlogPage, { BlogArticlePage } from "./pages/BlogPage";
import AboutPage from "./pages/AboutPage";
import ContactsPage from "./pages/ContactsPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import { PublicInfoPage, FinancialInfoPage, ContractsPage, PrivacyPage } from "./pages/InfoPages";

function App() {
  return (
    <I18nProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogArticlePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            
            {/* Info Pages */}
            <Route path="/public-info" element={<PublicInfoPage />} />
            <Route path="/financial-info" element={<FinancialInfoPage />} />
            <Route path="/contracts" element={<ContractsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            
            {/* Locale routes (redirect to main) */}
            <Route path="/ru" element={<HomePage />} />
            <Route path="/uz" element={<HomePage />} />
            <Route path="/en" element={<HomePage />} />
            <Route path="/ru/*" element={<HomePage />} />
            <Route path="/uz/*" element={<HomePage />} />
            <Route path="/en/*" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </I18nProvider>
  );
}

export default App;
