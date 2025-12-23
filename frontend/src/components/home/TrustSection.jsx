import { useI18n } from '../../lib/i18n';
import { Link } from 'react-router-dom';
import { Shield, FileText, Headphones, MapPin, FileCheck, Leaf } from 'lucide-react';

const TrustSection = () => {
  const { t } = useI18n();

  const trustItems = [
    {
      icon: Shield,
      title: t('trust.transparency.title'),
      desc: t('trust.transparency.desc'),
      link: null,
    },
    {
      icon: FileText,
      title: t('trust.documents.title'),
      desc: t('trust.documents.desc'),
      link: '/contracts',
    },
    {
      icon: Headphones,
      title: t('trust.support.title'),
      desc: t('trust.support.desc'),
      link: '/contacts',
    },
    {
      icon: MapPin,
      title: t('trust.offices.title'),
      desc: t('trust.offices.desc'),
      link: '/contacts',
    },
    {
      icon: FileCheck,
      title: t('trust.publicInfo.title'),
      desc: t('trust.publicInfo.desc'),
      link: '/public-info',
    },
    {
      icon: Leaf,
      title: t('trust.sustainability.title'),
      desc: t('trust.sustainability.desc'),
      link: '/about',
    },
  ];

  return (
    <section className="section-padding bg-primary relative overflow-hidden" data-testid="trust-section">
      {/* Noise overlay for texture */}
      <div className="absolute inset-0 noise-overlay" />
      
      <div className="max-w-7xl mx-auto container-padding relative z-10">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white"
            data-testid="trust-title"
          >
            {t('trust.title')}
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="trust-grid">
          {trustItems.map((item, index) => {
            const Content = (
              <div 
                className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
                data-testid={`trust-item-${index}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/30 transition-colors">
                    <item.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );

            return item.link ? (
              <Link key={index} to={item.link} className="block">
                {Content}
              </Link>
            ) : (
              <div key={index}>{Content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
