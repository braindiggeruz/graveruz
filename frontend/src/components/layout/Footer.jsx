import { Link } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  const { t } = useI18n();

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/oasiscredit', label: 'Instagram' },
    { icon: MessageCircle, href: 'https://t.me/oasiscredit', label: 'Telegram' },
    { icon: Facebook, href: 'https://facebook.com/oasiscredit', label: 'Facebook' },
    { icon: Linkedin, href: 'https://linkedin.com/company/oasiscredit', label: 'LinkedIn' },
  ];

  const quickLinks = [
    { href: '/public-info', label: t('footer.publicInfo') },
    { href: '/financial-info', label: t('footer.financialInfo') },
    { href: '/contracts', label: t('footer.contracts') },
    { href: '/privacy', label: t('footer.privacy') },
  ];

  return (
    <footer className="bg-oasis-navy text-white relative overflow-hidden" data-testid="footer">
      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay opacity-5" />
      
      <div className="max-w-7xl mx-auto container-padding py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Contact */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group" data-testid="footer-logo">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-heading font-bold text-xl">O</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">Oasis Credit</span>
            </Link>
            
            <div className="space-y-4">
              <a 
                href="tel:+998712000000" 
                className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                data-testid="footer-phone"
              >
                <Phone className="w-5 h-5 text-secondary" />
                <span>+998 71 200 00 00</span>
              </a>
              <a 
                href="mailto:info@oasis.uz" 
                className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                data-testid="footer-email"
              >
                <Mail className="w-5 h-5 text-secondary" />
                <span>info@oasis.uz</span>
              </a>
              <div className="flex items-center gap-3 text-white/80">
                <Clock className="w-5 h-5 text-secondary" />
                <span>{t('footer.scheduleValue')}</span>
              </div>
            </div>
          </div>

          {/* Offices */}
          <div className="space-y-6">
            <h4 className="font-heading font-semibold text-lg">{t('footer.offices')}</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-white/80">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span>{t('footer.tashkent')}</span>
              </div>
              <div className="flex items-start gap-3 text-white/80">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span>{t('footer.samarkand')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-heading font-semibold text-lg">{t('footer.quickLinks')}</h4>
            <nav className="space-y-3" data-testid="footer-quick-links">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-white/80 hover:text-white transition-colors"
                  data-testid={`footer-link-${link.href.replace('/', '')}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-6">
            <h4 className="font-heading font-semibold text-lg">Social</h4>
            <div className="flex items-center gap-3" data-testid="footer-social">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-oasis-navy transition-colors"
                  aria-label={social.label}
                  data-testid={`footer-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            
            {/* Sustainability message */}
            <p className="text-white/60 text-sm leading-relaxed">
              {t('trust.sustainability.desc')}
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm text-center md:text-left" data-testid="footer-disclaimer">
              {t('footer.disclaimer')}
            </p>
            <p className="text-white/60 text-sm" data-testid="footer-copyright">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile spacer for bottom bar */}
      <div className="h-20 lg:hidden" />
    </footer>
  );
};

export default Footer;
