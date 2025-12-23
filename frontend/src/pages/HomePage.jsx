import Layout from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import ProductsSection from '../components/home/ProductsSection';
import CalculatorSection from '../components/home/CalculatorSection';
import TrustSection from '../components/home/TrustSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FAQSection from '../components/home/FAQSection';
import FinalCTASection from '../components/home/FinalCTASection';

const HomePage = () => {
  return (
    <Layout>
      <HeroSection />
      <ProductsSection />
      <CalculatorSection />
      <TrustSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </Layout>
  );
};

export default HomePage;
