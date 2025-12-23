import { Link } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calculator, ArrowRight, Shield, Clock, Fingerprint } from 'lucide-react';

const HeroSection = () => {
  const { t } = useI18n();

  const trustBadges = [
    { icon: Shield, label: t('hero.badge1') },
    { icon: Clock, label: t('hero.badge2') },
    { icon: Fingerprint, label: t('hero.badge3') },
  ];

  return (
    <section 
      className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 section-padding"
      data-testid="hero-section"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
        <svg viewBox="0 0 500 500" className="w-full h-full">
          <defs>
            <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B6B6B" />
              <stop offset="100%" stopColor="#3DDC84" />
            </linearGradient>
          </defs>
          <circle cx="400" cy="100" r="200" fill="url(#heroGrad)" opacity="0.3" />
          <circle cx="300" cy="300" r="150" fill="url(#heroGrad)" opacity="0.2" />
          <circle cx="450" cy="350" r="100" fill="url(#heroGrad)" opacity="0.1" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Trust badges */}
            <div className="flex flex-wrap gap-2" data-testid="hero-badges">
              {trustBadges.map((badge, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="bg-secondary/10 text-secondary border-secondary/20 px-4 py-2 rounded-full flex items-center gap-2"
                  data-testid={`hero-badge-${index}`}
                >
                  <badge.icon className="w-4 h-4" />
                  {badge.label}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
                data-testid="hero-title"
              >
                {t('hero.title')}
              </h1>
              <p 
                className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg"
                data-testid="hero-subtitle"
              >
                {t('hero.subtitle')}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4" data-testid="hero-cta">
              <Link to="/calculator">
                <Button 
                  size="lg"
                  className="rounded-full px-8 py-6 text-lg bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                  data-testid="hero-calculate-btn"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  {t('hero.cta1')}
                </Button>
              </Link>
              <Link to="/products">
                <Button 
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-6 text-lg border-2 border-primary text-primary hover:bg-primary/5"
                  data-testid="hero-products-btn"
                >
                  {t('hero.cta2')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4" data-testid="hero-stats">
              <div className="space-y-1">
                <p className="font-heading text-2xl md:text-3xl font-bold text-primary">1 000+</p>
                <p className="text-sm text-muted-foreground">Клиентов</p>
              </div>
              <div className="space-y-1">
                <p className="font-heading text-2xl md:text-3xl font-bold text-primary">1 млрд</p>
                <p className="text-sm text-muted-foreground">Макс. сумма</p>
              </div>
              <div className="space-y-1">
                <p className="font-heading text-2xl md:text-3xl font-bold text-primary">1 день</p>
                <p className="text-sm text-muted-foreground">Решение</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative animate-slide-up animation-delay-200">
            <div className="relative">
              {/* Main image card */}
              <div className="relative rounded-3xl overflow-hidden shadow-float">
                <img 
                  src="https://images.unsplash.com/photo-1753351052617-62818ffc9173"
                  alt="Business growth"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                  data-testid="hero-image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-oasis-navy/60 to-transparent" />
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-card animate-fade-in animation-delay-400">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Прозрачность</p>
                    <p className="text-sm text-muted-foreground">Без скрытых комиссий</p>
                  </div>
                </div>
              </div>

              {/* Another floating element */}
              <div className="absolute -top-4 -right-4 bg-primary text-white rounded-2xl px-4 py-3 shadow-lg animate-fade-in animation-delay-300">
                <p className="font-heading font-bold text-lg">до 150 млн</p>
                <p className="text-sm text-white/80">без залога</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
