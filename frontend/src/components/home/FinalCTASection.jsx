import { Link } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { Button } from '../ui/button';
import { Calculator, MessageCircle } from 'lucide-react';

const FinalCTASection = () => {
  const { t } = useI18n();

  return (
    <section className="py-24 bg-gradient-to-br from-primary to-primary/90 relative overflow-hidden" data-testid="final-cta-section">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 1000 500" className="w-full h-full">
          <circle cx="100" cy="100" r="200" fill="white" />
          <circle cx="900" cy="400" r="250" fill="white" />
        </svg>
      </div>
      
      <div className="max-w-4xl mx-auto container-padding text-center relative z-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white"
              data-testid="final-cta-title"
            >
              {t('finalCta.title')}
            </h2>
            <p className="text-xl text-white/80">
              {t('finalCta.subtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/calculator">
              <Button 
                size="lg"
                className="rounded-full px-10 py-6 text-lg bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                data-testid="final-cta-calculate-btn"
              >
                <Calculator className="w-5 h-5 mr-2" />
                {t('finalCta.cta1')}
              </Button>
            </Link>
            <a href="https://t.me/oasiscredit_support" target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg"
                variant="outline"
                className="rounded-full px-10 py-6 text-lg border-2 border-white text-white hover:bg-white/10"
                data-testid="final-cta-telegram-btn"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {t('finalCta.cta2')}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
