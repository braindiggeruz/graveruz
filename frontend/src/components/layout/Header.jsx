import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Menu, X, Calculator, Phone, MessageCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const Header = () => {
  const { locale, setLocale, t } = useI18n();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/calculator', label: t('nav.calculator') },
    { href: '/how-it-works', label: t('nav.howItWorks') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/about', label: t('nav.about') },
    { href: '/contacts', label: t('nav.contacts') },
  ];

  const languages = [
    { code: 'ru', label: 'RU' },
    { code: 'uz', label: 'UZ' },
    { code: 'en', label: 'EN' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
        data-testid="header"
      >
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 group"
              data-testid="header-logo"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-heading font-bold text-xl">O</span>
              </div>
              <span className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                Oasis Credit
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" data-testid="desktop-nav">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  data-testid={`nav-link-${item.href.replace('/', '') || 'home'}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="hidden md:flex items-center gap-1 bg-muted rounded-full p-1" data-testid="language-switcher">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLocale(lang.code)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      locale === lang.code
                        ? "bg-white text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    data-testid={`lang-${lang.code}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="hidden md:flex items-center gap-2">
                <Link to="/calculator">
                  <Button 
                    className="rounded-full px-6 bg-primary hover:bg-primary/90"
                    data-testid="header-calculate-btn"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    {t('nav.calculateCredit')}
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="rounded-full" data-testid="mobile-menu-btn">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-80 p-0">
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                      <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                          <span className="text-white font-heading font-bold">O</span>
                        </div>
                        <span className="font-heading font-bold text-lg">Oasis Credit</span>
                      </Link>
                    </div>

                    {/* Language Switcher Mobile */}
                    <div className="flex items-center gap-1 p-4 bg-muted/50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setLocale(lang.code)}
                          className={cn(
                            "flex-1 py-2 rounded-full text-sm font-medium transition-colors",
                            locale === lang.code
                              ? "bg-white text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                          data-testid={`mobile-lang-${lang.code}`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 overflow-auto p-4" data-testid="mobile-nav">
                      <div className="flex flex-col gap-1">
                        {navItems.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "px-4 py-3 rounded-2xl text-base font-medium transition-colors",
                              isActive(item.href)
                                ? "bg-primary/10 text-primary"
                                : "text-foreground hover:bg-muted"
                            )}
                            data-testid={`mobile-nav-link-${item.href.replace('/', '') || 'home'}`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </nav>

                    {/* Mobile CTA */}
                    <div className="p-4 border-t space-y-2">
                      <Link to="/calculator" onClick={() => setIsOpen(false)} className="block">
                        <Button className="w-full rounded-full bg-primary hover:bg-primary/90" data-testid="mobile-calculate-btn">
                          <Calculator className="w-4 h-4 mr-2" />
                          {t('nav.calculateCredit')}
                        </Button>
                      </Link>
                      <Link to="/products/business" onClick={() => setIsOpen(false)} className="block">
                        <Button variant="outline" className="w-full rounded-full border-primary text-primary hover:bg-primary/5" data-testid="mobile-apply-btn">
                          {t('nav.applyNow')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Bar */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass border-t border-white/10 safe-area-inset-bottom"
        data-testid="mobile-bottom-bar"
      >
        <div className="grid grid-cols-3 gap-1 p-2">
          <Link to="/calculator">
            <Button 
              className="w-full rounded-2xl bg-primary hover:bg-primary/90 flex flex-col items-center gap-1 py-3 h-auto"
              data-testid="bottom-calculate-btn"
            >
              <Calculator className="w-5 h-5" />
              <span className="text-xs">{t('nav.calculateCredit')}</span>
            </Button>
          </Link>
          <a href="tel:+998712000000">
            <Button 
              variant="outline" 
              className="w-full rounded-2xl border-primary text-primary hover:bg-primary/5 flex flex-col items-center gap-1 py-3 h-auto"
              data-testid="bottom-call-btn"
            >
              <Phone className="w-5 h-5" />
              <span className="text-xs">{t('common.call')}</span>
            </Button>
          </a>
          <a href="https://t.me/oasiscredit_support" target="_blank" rel="noopener noreferrer">
            <Button 
              variant="outline" 
              className="w-full rounded-2xl border-secondary text-secondary hover:bg-secondary/5 flex flex-col items-center gap-1 py-3 h-auto"
              data-testid="bottom-telegram-btn"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">{t('common.telegram')}</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Header;
