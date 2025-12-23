import { useI18n } from '../../lib/i18n';
import { Calculator, FileText, Fingerprint, CheckCircle } from 'lucide-react';

const HowItWorksSection = () => {
  const { t } = useI18n();

  const steps = [
    {
      icon: Calculator,
      number: '01',
      title: t('howItWorks.step1.title'),
      desc: t('howItWorks.step1.desc'),
    },
    {
      icon: FileText,
      number: '02',
      title: t('howItWorks.step2.title'),
      desc: t('howItWorks.step2.desc'),
    },
    {
      icon: Fingerprint,
      number: '03',
      title: t('howItWorks.step3.title'),
      desc: t('howItWorks.step3.desc'),
    },
    {
      icon: CheckCircle,
      number: '04',
      title: t('howItWorks.step4.title'),
      desc: t('howItWorks.step4.desc'),
    },
  ];

  return (
    <section className="section-padding" data-testid="how-it-works-section">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
            data-testid="how-it-works-title"
          >
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="steps-grid">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group"
              data-testid={`step-${index + 1}`}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(100%-1rem)] w-[calc(100%-2rem)] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
              )}

              <div className="relative z-10 space-y-4">
                {/* Icon and Number */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold text-sm flex items-center justify-center">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-heading font-semibold text-xl text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
