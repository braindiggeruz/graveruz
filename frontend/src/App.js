import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './App.css';
import { Phone, Send, Check, Zap, Users, Award, Package, Clock, MessageCircle, Mail, MapPin, ChevronDown, Flame, Download, ChevronRight } from 'lucide-react';
import { useI18n, SUPPORTED_LOCALES } from './i18n';
import SEOHead from './components/SEOHead';
import LanguageSwitcher from './components/LanguageSwitcher';

const HomePortfolioSection = lazy(() => import('./components/home/HomePortfolioSection'));
const HomeBlogPreviewSection = lazy(() => import('./components/home/HomeBlogPreviewSection'));

function DeferredSection({ id, placeholderClassName, rootMargin = '320px', children }) {
  const containerRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) {
      return;
    }

    const triggerRender = () => setShouldRender(true);
    if (typeof window === 'undefined') {
      triggerRender();
      return;
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(triggerRender, { timeout: 1200 });
    } else {
      setTimeout(triggerRender, 1200);
    }

    const target = containerRef.current;
    if (!target || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerRender();
            observer.disconnect();
          }
        });
      },
      { rootMargin },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <section id={id} ref={containerRef} className={placeholderClassName} style={{ contentVisibility: 'auto', containIntrinsicSize: '1000px' }}>
      {shouldRender ? children : null}
    </section>
  );
}

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;

function App() {
  const navigate = useNavigate();
  const { locale } = useParams();
  const { t, setLocale } = useI18n();
  
  // Set html lang attribute based on locale
  useEffect(() => {
    const langCode = locale === 'uz' ? 'uz-Latn' : (locale || 'ru');
    document.documentElement.lang = langCode;
  }, [locale]);
  
  const [formStep, setFormStep] = useState(1); // Multi-step form
  const [formData, setFormData] = useState({
    name: '',
    phone: '+998 ',
    company: '',
    orderType: '', // Подарки / Награды / Брендирование / Другое
    quantity: '', // 1-10 / 11-100 / 101-1000 / 1000+
    comment: '',
    email: '',
    website: '' // honeypot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const faqItems = Array.isArray(t('faq.items')) ? t('faq.items') : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double-submit
    if (isSubmitting) {
      console.log('⚠️ Already submitting, ignoring');
      return;
    }
    
    console.log('=== FORM SUBMIT START ===');
    console.log('Backend URL:', BACKEND_URL);
    console.log('Form data:', { ...formData, website: '[hidden]' });
    
    // Anti-spam: cooldown 10 seconds
    const now = Date.now();
    if (now - lastSubmitTime < 10000) {
      const remainingTime = Math.ceil((10000 - (now - lastSubmitTime)) / 1000);
      alert(`Пожалуйста, подождите ${remainingTime} секунд перед повторной отправкой.`);
      console.log('⏱️ Cooldown active');
      return;
    }
    
    // Honeypot check
    if (formData.website) {
      console.log('🤖 Bot detected - silent fail');
      return; // Silent fail for bots
    }
    
    // Basic validation
    if (!formData.name || formData.name.trim().length < 2) {
      alert('Пожалуйста, введите имя (минимум 2 символа)');
      console.log('❌ Validation failed: name');
      return;
    }
    
    if (!formData.phone || formData.phone.length < 17) {
      alert('Пожалуйста, введите полный номер телефона');
      console.log('❌ Validation failed: phone');
      return;
    }
    
    setIsSubmitting(true);
    console.log('📤 Sending request...');
    
    // Track form step 2 complete (non-blocking)
    try {
      if (window.gtag) {
        window.gtag('event', 'form_step_2_complete', { event_category: 'form' });
      }
    } catch (e) { /* ignore analytics errors */ }
    
    try {
      // Build description from form data
      const description = `Тип: ${formData.orderType || 'Не указан'}\nТираж: ${formData.quantity || 'Не указан'}\n${formData.comment ? 'Комментарий: ' + formData.comment : ''}`.trim();
      
      const payload = {
        name: formData.name,
        phone: formData.phone,
        company: formData.company || '',
        quantity: formData.quantity || '',
        description: description
      };
      
      console.log('Payload:', payload);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      
      const response = await fetch(`${BACKEND_URL}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Ошибка при отправке заявки';
        try {
          const errorData = await response.json();
          console.log('Error data:', errorData);
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          console.log('Could not parse error JSON');
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('✅ Success! Lead ID:', result.id);
      
      setLastSubmitTime(now);
      
      // Track lead success (non-blocking)
      try {
        if (window.__trackLeadSuccess) {
          window.__trackLeadSuccess();
        }
      } catch (e) { /* ignore analytics errors */ }
      
      // Redirect to thanks page with locale - use assign for better compatibility
      const targetUrl = `/${locale || 'ru'}/thanks`;
      console.log('🔄 Redirecting to:', targetUrl);
      
      // Small delay to ensure analytics fires
      setTimeout(() => {
        window.location.assign(targetUrl);
      }, 100);
      
    } catch (error) {
      console.error('❌ Error:', error);
      setIsSubmitting(false);
      
      let errorMsg = 'Произошла ошибка при отправке заявки';
      if (error.name === 'AbortError') {
        errorMsg = 'Превышено время ожидания. Попробуйте ещё раз.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      alert(`${errorMsg}\n\nПожалуйста, позвоните нам или напишите в Telegram: https://t.me/GraverAdm`);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setShowMobileMenu(false);
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // Ensure it starts with +998
    if (!value.startsWith('+998')) {
      value = '+998 ' + value.replace(/^\+998\s?/, '');
    }
    
    // Remove non-numeric characters except +
    value = value.replace(/[^\d+\s]/g, '');
    
    // Format: +998 XX XXX XX XX
    if (value.length > 4) {
      const parts = value.slice(5).replace(/\s/g, '');
      let formatted = '+998 ';
      if (parts.length > 0) formatted += parts.slice(0, 2);
      if (parts.length > 2) formatted += ' ' + parts.slice(2, 5);
      if (parts.length > 5) formatted += ' ' + parts.slice(5, 7);
      if (parts.length > 7) formatted += ' ' + parts.slice(7, 9);
      value = formatted;
    }
    
    setFormData({...formData, phone: value});
    
    // Validate
    if (value.length >= 17) {
      if (!validatePhone(value)) {
        setPhoneError('Неверный формат телефона');
      } else {
        setPhoneError('');
      }
    } else {
      setPhoneError('');
    }
  };

  return (
    <div className="App">
      <SEOHead />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm z-50 border-b border-gray-800" data-testid="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold text-white">Graver<span className="text-teal-500">.uz</span></span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <button onClick={() => scrollToSection('services')} className="text-gray-300 hover:text-teal-500 transition">{t('nav.services')}</button>
              <Link to={`/${locale}/products/lighters`} className="text-gray-300 hover:text-teal-500 transition" data-testid="nav-catalog">{t('nav.catalog')}</Link>
              <button onClick={() => scrollToSection('portfolio')} className="text-gray-300 hover:text-teal-500 transition">{t('nav.portfolio')}</button>
              <button onClick={() => scrollToSection('process')} className="text-gray-300 hover:text-teal-500 transition">{t('nav.process')}</button>
              <button onClick={() => scrollToSection('faq')} className="text-gray-300 hover:text-teal-500 transition">{t('nav.faq')}</button>
              <Link to={`/${locale}/blog`} className="text-gray-300 hover:text-teal-500 transition" data-testid="nav-blog">{t('nav.blog')}</Link>
              <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-teal-500 transition">{t('nav.contacts')}</button>
              <LanguageSwitcher />
            </nav>

            {/* Phone Numbers */}
            <div className="hidden md:flex flex-col items-end space-y-1">
              <a href="tel:+998770802288" className="text-white font-semibold hover:text-teal-500 transition flex items-center" data-testid="phone-number-1" data-track="tel">
                <Phone size={16} className="mr-2" />
                +998 77 080 22 88
              </a>
              <a href="tel:+998974802288" className="text-gray-300 text-sm hover:text-teal-500 transition flex items-center" data-testid="phone-number-2" data-track="tel">
                <Phone size={14} className="mr-2" />
                +998 97 480 22 88
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-white"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label={showMobileMenu ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={showMobileMenu}
              aria-controls="mobile-navigation"
              data-testid="mobile-menu-button"
            >
              <ChevronDown className={`transform transition-transform ${showMobileMenu ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div id="mobile-navigation" className="lg:hidden pb-4 border-t border-gray-800 mt-4 pt-4">
              <nav className="flex flex-col space-y-3">
                <button onClick={() => scrollToSection('services')} className="text-gray-300 hover:text-teal-500 transition text-left">{t('nav.services')}</button>
                <Link to={`/${locale}/products/lighters`} className="text-gray-300 hover:text-teal-500 transition text-left">{t('nav.catalog')}</Link>
                <button onClick={() => scrollToSection('portfolio')} className="text-gray-300 hover:text-teal-500 transition text-left">{t('nav.portfolio')}</button>
                <button onClick={() => scrollToSection('process')} className="text-gray-300 hover:text-teal-500 transition text-left">{t('nav.process')}</button>
                <button onClick={() => scrollToSection('faq')} className="text-gray-300 hover:text-teal-500 transition text-left">{t('nav.faq')}</button>
                <Link to={`/${locale}/blog`} className="text-gray-300 hover:text-teal-500 transition text-left">{t('nav.blog')}</Link>
                <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-teal-500 transition text-left">{t('nav.contacts')}</button>
                <div className="pt-2 border-t border-gray-800">
                  <LanguageSwitcher />
                </div>
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-800">
                  <a href="tel:+998770802288" className="text-white font-semibold hover:text-teal-500 transition flex items-center" data-track="tel">
                    <Phone size={16} className="mr-2" />
                    +998 77 080 22 88
                  </a>
                  <a href="tel:+998974802288" className="text-gray-300 hover:text-teal-500 transition flex items-center" data-track="tel">
                    <Phone size={14} className="mr-2" />
                    +998 97 480 22 88
                  </a>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black pt-20" data-testid="hero-section">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(20,184,166,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.05),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <span className="text-teal-500 font-semibold tracking-wide uppercase text-sm border border-teal-500/30 px-4 py-2 rounded-full">{t('hero.badge')}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight">
              {t('hero.title')}<br />
              <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">{t('hero.titleAccent')}</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}<br className="hidden sm:block" />
              {t('hero.subtitleLine2')}<br className="hidden sm:block" />
              <span className="text-teal-500 font-semibold">{t('hero.subtitleAccent')}</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              {/* PRIMARY CTA - Запросить расчёт */}
              <button 
                onClick={() => scrollToSection('contact')}
                className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-10 py-5 rounded-lg font-bold text-lg hover:from-teal-600 hover:to-cyan-700 transition shadow-lg shadow-teal-500/50 min-h-[56px]"
                data-testid="hero-primary-cta"
              >
                {t('hero.ctaPrimary')}
              </button>
              {/* SECONDARY CTA - Telegram */}
              <a 
                href="https://t.me/GraverAdm" data-track="tg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-transparent text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-white/10 transition border border-white/30 flex items-center justify-center group min-h-[56px]"
                data-testid="hero-secondary-cta"
              >
                <Send className="mr-2 group-hover:translate-x-1 transition-transform" size={18} />
                {t('hero.ctaSecondary')}
              </a>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-teal-500">100%</div>
                <div className="text-sm text-gray-300">{t('hero.stats.approval')}</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-teal-500">1-3</div>
                <div className="text-sm text-gray-300">{t('hero.stats.days')}</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-teal-500">∞</div>
                <div className="text-sm text-gray-300">{t('hero.stats.volume')}</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-teal-500">✓</div>
                <div className="text-sm text-gray-300">{t('hero.stats.guarantee')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B2B Benefits Section */}
      <section
        className="py-20 bg-gray-900"
        id="benefits"
        data-testid="benefits-section"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '900px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('benefits.title')}<br /><span className="text-teal-500">{t('benefits.titleAccent')}</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('benefits.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition group" data-testid="benefit-card-preview">
              <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition">
                <Check className="text-teal-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('benefits.items.preview.title')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('benefits.items.preview.description')}
              </p>
            </div>

            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition group" data-testid="benefit-card-volumes">
              <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition">
                <Package className="text-teal-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('benefits.items.volumes.title')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('benefits.items.volumes.description')}
              </p>
            </div>

            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition group" data-testid="benefit-card-timing">
              <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition">
                <Clock className="text-teal-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('benefits.items.timing.title')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('benefits.items.timing.description')}
              </p>
            </div>

            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition group" data-testid="benefit-card-materials">
              <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition">
                <Zap className="text-teal-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('benefits.items.materials.title')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('benefits.items.materials.description')}
              </p>
            </div>

            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition group" data-testid="benefit-card-files">
              <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition">
                <Award className="text-teal-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('benefits.items.files.title')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('benefits.items.files.description')}
              </p>
            </div>

            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition group" data-testid="benefit-card-b2b">
              <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition">
                <Users className="text-teal-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('benefits.items.b2b.title')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('benefits.items.b2b.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        className="py-20 bg-black"
        id="services"
        data-testid="services-section"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '900px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Услуги для <span className="text-teal-500">корпоративных клиентов</span>
            </h2>
            <p className="text-xl text-gray-400">
              Брендирование и персонализация под любые бизнес-задачи
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-teal-500/50 transition" data-testid="service-card-gifts">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center group-hover:bg-teal-500/20 transition">
                    <Package className="text-teal-500" size={28} />
                  </div>
                  <span className="text-teal-500 font-semibold text-sm border border-teal-500/30 px-3 py-1 rounded-full">Популярно</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Корпоративные подарки</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Премиальные подарочные наборы с логотипом компании. Ручки, ежедневники, фляги, термосы, ножи, часы, шкатулки — всё с вашим брендом.
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start">
                    <Check className="text-teal-500 mr-3 flex-shrink-0 mt-1" size={18} />
                    <span>Тиражи от 1 до 10,000+ единиц</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-teal-500 mr-3 flex-shrink-0 mt-1" size={18} />
                    <span>Персонализация с именами сотрудников</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-teal-500 mr-3 flex-shrink-0 mt-1" size={18} />
                    <span>Премиальная упаковка под ключ</span>
                  </li>
                </ul>
                <a 
                  href="https://t.me/GraverAdm" data-track="tg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-6 text-teal-500 hover:text-teal-400 font-semibold group/link"
                >
                  Обсудить проект
                  <Send className="ml-2 group-hover/link:translate-x-1 transition-transform" size={16} />
                </a>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-teal-500/50 transition" data-testid="service-card-awards">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center group-hover:bg-teal-500/20 transition">
                    <Award className="text-teal-500" size={28} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Награды и признание</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Кубки, медали, плакетки, таблички для награждения сотрудников и партнёров. Стекло, металл, дерево, акрил — премиальное исполнение.
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start">
                    <Check className="text-teal-500 mr-3 flex-shrink-0 mt-1" size={18} />
                    <span>Индивидуальный дизайн под событие</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-teal-500 mr-3 flex-shrink-0 mt-1" size={18} />
                    <span>Гравировка имён, дат, достижений</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-teal-500 mr-3 flex-shrink-0 mt-1" size={18} />
                    <span>Эксклюзивные формы и материалы</span>
                  </li>
                </ul>
                <a 
                  href="https://t.me/GraverAdm" data-track="tg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-6 text-teal-500 hover:text-teal-400 font-semibold group/link"
                >
                  Обсудить проект
                  <Send className="ml-2 group-hover/link:translate-x-1 transition-transform" size={16} />
                </a>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-teal-500/50 transition" data-testid="service-card-branding">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center group-hover:bg-teal-500/20 transition">
                    <Zap className="text-teal-500" size={28} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Брендирование продукции</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Нанесение логотипа и фирменного стиля на вашу продукцию. Серийная маркировка, QR-коды, уникальные номера для учёта и трекинга.
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start">
                    <Check className="text-teal-500 mr-3 flex-shrink-0 mt-1" size={18} />
                    <span>Стойкая маркировка на металле и пластике</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-teal-500 mr-3 flex-shrink-0 mt-1" size={18} />
                    <span>QR-коды и серийные номера</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-teal-500 mr-3 flex-shrink-0 mt-1" size={18} />
                    <span>Автоматизация для больших тиражей</span>
                  </li>
                </ul>
                <a 
                  href="https://t.me/GraverAdm" data-track="tg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-6 text-teal-500 hover:text-teal-400 font-semibold group/link"
                >
                  Обсудить проект
                  <Send className="ml-2 group-hover/link:translate-x-1 transition-transform" size={16} />
                </a>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-teal-500/50 transition" data-testid="service-card-custom">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center group-hover:bg-teal-500/20 transition">
                    <Users className="text-teal-500" size={28} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Индивидуальные проекты</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Нестандартные задачи, эксклюзивные решения, сложная геометрия. Работаем с вашими материалами и изделиями.
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start">
                    <Check className="text-teal-500 mr-3 flex-shrink-0 mt-1" size={18} />
                    <span>Сложные поверхности и формы</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-teal-500 mr-3 flex-shrink-0 mt-1" size={18} />
                    <span>Технический консалтинг</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-teal-500 mr-3 flex-shrink-0 mt-1" size={18} />
                    <span>Пробники и тесты материалов</span>
                  </li>
                </ul>
                <a 
                  href="https://t.me/GraverAdm" data-track="tg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-6 text-teal-500 hover:text-teal-400 font-semibold group/link"
                >
                  Обсудить проект
                  <Send className="ml-2 group-hover/link:translate-x-1 transition-transform" size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B2C Corridor Link */}
      <div className="bg-gray-900/50 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <a 
            href={`/${locale}/${locale === 'uz' ? 'mahsulotlar-katalogi' : 'catalog-products'}`}
            className="text-gray-400 hover:text-teal-500 transition inline-flex items-center text-sm"
            data-testid="b2c-corridor-link"
          >
            {locale === 'uz' 
              ? "O'zingiz uchun sovg'a? Mavjud mahsulotlar →" 
              : "Ищете подарок для себя? Смотрите продукцию в наличии →"}
          </a>
        </div>
      </div>

      {/* Products Section - Lighters Catalog Promo */}
      <section
        className="py-20 bg-gradient-to-b from-black to-gray-900"
        id="products"
        data-testid="products-section"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '900px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm mb-6">
                <Flame size={16} />
                {locale === 'uz' ? 'Yangi katalog' : 'Новый каталог'}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {locale === 'uz' ? 'Gravyurali zajigalkalar' : 'Зажигалки с гравировкой'}
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                {locale === 'uz' 
                  ? "Logotip, ism yoki surat bilan eksklyuziv zajigalkalar. Korporativ yoki shaxsiy sovg'a uchun ideal."
                  : "Эксклюзивные зажигалки с лазерной гравировкой логотипа, имени или фото. Идеальный подарок для любого повода."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to={`/${locale}/products/lighters`}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition"
                  data-testid="products-cta-view"
                >
                  {locale === 'uz' ? 'Barcha modellarni ko\'rish' : 'Смотреть все модели'}
                  <ChevronRight size={18} className="ml-2" />
                </Link>
                <a 
                  href="/catalogs/graver-lighters-catalog-2026.pdf"
                  download
                  className="inline-flex items-center justify-center bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition border border-gray-700"
                  data-testid="products-cta-download"
                >
                  <Download size={18} className="mr-2" />
                  {locale === 'uz' ? 'Katalogni yuklab olish' : 'Скачать каталог (PDF)'}
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Product Cards Preview */}
              <div className="bg-gradient-to-br from-gray-300 to-gray-100 aspect-square rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Flame size={48} className="text-gray-600 mx-auto mb-2" />
                  <span className="text-gray-700 font-semibold">Silver Gloss</span>
                  <p className="text-orange-600 font-bold">140,000 {locale === 'uz' ? "so'm" : 'сум'}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 aspect-square rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Flame size={48} className="text-gray-400 mx-auto mb-2" />
                  <span className="text-white font-semibold">Black Matte</span>
                  <p className="text-orange-400 font-bold">150,000 {locale === 'uz' ? "so'm" : 'сум'}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-black aspect-square rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Flame size={48} className="text-gray-500 mx-auto mb-2" />
                  <span className="text-white font-semibold">Black Texture</span>
                  <p className="text-orange-400 font-bold">170,000 {locale === 'uz' ? "so'm" : 'сум'}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-500 to-gray-400 aspect-square rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Flame size={48} className="text-gray-700 mx-auto mb-2" />
                  <span className="text-gray-800 font-semibold">Brushed Steel</span>
                  <p className="text-orange-600 font-bold">160,000 {locale === 'uz' ? "so'm" : 'сум'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DeferredSection id="portfolio" placeholderClassName="py-20 bg-gray-900" rootMargin="400px">
        <Suspense fallback={<div className="h-40" aria-busy="true" />}>
          <HomePortfolioSection t={t} scrollToSection={scrollToSection} />
        </Suspense>
      </DeferredSection>

      <DeferredSection id="process" placeholderClassName="py-20 bg-black" rootMargin="460px">
      {/* Process Section */}
      <section
        className="py-20 bg-black"
        data-testid="process-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Как мы <span className="text-teal-500">работаем</span>
            </h2>
            <p className="text-xl text-gray-400">
              Прозрачный процесс от заявки до получения
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative" data-testid="process-step-1">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition">
                <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-6 text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Заявка</h3>
                <p className="text-gray-400">
                  Напишите в Telegram или заполните форму расчёта. Отправьте логотип, фото изделия, опишите задачу и тираж.
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-teal-500 to-transparent" />
            </div>

            <div className="relative" data-testid="process-step-2">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition">
                <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-6 text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Макет</h3>
                <p className="text-gray-400">
                  Создаём цифровой макет с точным размещением и размерами. Вы видите финальный результат до производства.
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-teal-500 to-transparent" />
            </div>

            <div className="relative" data-testid="process-step-3">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition">
                <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-6 text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Утверждение</h3>
                <p className="text-gray-400">
                  Согласовываете макет, вносите правки при необходимости. Фиксируем сроки и стоимость.
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-teal-500 to-transparent" />
            </div>

            <div className="relative" data-testid="process-step-4">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition">
                <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-6 text-white font-bold text-xl">
                  4
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Производство</h3>
                <p className="text-gray-400">
                  Выполняем гравировку согласно утверждённому макету. Контроль качества на каждом этапе.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-teal-500/10 border border-teal-500/30 rounded-xl px-6 py-4">
              <p className="text-teal-500 font-semibold">
                ⚡ Типовой срок производства: 1-3 дня после утверждения макета
              </p>
            </div>
          </div>
        </div>
      </section>
      </DeferredSection>

      <DeferredSection placeholderClassName="py-16 bg-gray-900/50" rootMargin="480px">
        <Suspense fallback={<div className="h-32" aria-busy="true" />}>
          <HomeBlogPreviewSection locale={locale} />
        </Suspense>
      </DeferredSection>

      <DeferredSection id="contact" placeholderClassName="py-20 bg-gray-900" rootMargin="560px">
      {/* Contact Form Section */}
      <section
        className="py-20 bg-gray-900"
        data-testid="contact-section"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Запросить <span className="text-teal-500">расчёт</span>
            </h2>
            <p className="text-lg text-gray-400">
              Заполните форму, и мы подготовим коммерческое предложение в течение 2 часов
            </p>
          </div>

          <form onSubmit={handleSubmit} id="leadForm" className="bg-black/50 border border-gray-800 rounded-2xl p-6 sm:p-8" data-testid="contact-form">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Шаг {formStep} из 2</span>
                <span className="text-sm text-teal-500 font-semibold">{formStep === 1 ? 'Расскажите о проекте' : 'Как с вами связаться?'}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: formStep === 1 ? '50%' : '100%' }}
                />
              </div>
            </div>
            
            {/* Hidden UTM fields */}
            <input type="hidden" name="utm_source" />
            <input type="hidden" name="utm_medium" />
            <input type="hidden" name="utm_campaign" />
            <input type="hidden" name="utm_term" />
            <input type="hidden" name="utm_content" />
            
            {/* STEP 1: Project Info */}
            {formStep === 1 && (
              <div className="space-y-6" data-testid="form-step-1">
                <div>
                  <label htmlFor="company" className="block text-gray-300 font-semibold mb-2">Компания *</label>
                  <input
                    id="company"
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition"
                    placeholder="ООО 'Ваша компания'"
                    data-testid="form-input-company"
                  />
                </div>
                
                <div>
                  <label htmlFor="orderType" className="block text-gray-300 font-semibold mb-2">Тип заказа *</label>
                  <select
                    id="orderType"
                    required
                    value={formData.orderType}
                    onChange={(e) => setFormData({...formData, orderType: e.target.value})}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition appearance-none cursor-pointer"
                    data-testid="form-input-orderType"
                  >
                    <option value="" disabled>Выберите тип заказа</option>
                    <option value="Подарки">Корпоративные подарки</option>
                    <option value="Награды">Награды и признание</option>
                    <option value="Брендирование">Брендирование продукции</option>
                    <option value="Маркировка">Промышленная маркировка</option>
                    <option value="Другое">Другое</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="quantity" className="block text-gray-300 font-semibold mb-2">Примерный тираж *</label>
                  <select
                    id="quantity"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition appearance-none cursor-pointer"
                    data-testid="form-input-quantity"
                  >
                    <option value="" disabled>Выберите объём</option>
                    <option value="1-10">1-10 единиц</option>
                    <option value="11-100">11-100 единиц</option>
                    <option value="101-1000">101-1000 единиц</option>
                    <option value="1000+">1000+ единиц</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!formData.company || !formData.orderType || !formData.quantity) {
                      alert('Пожалуйста, заполните все поля');
                      return;
                    }
                    // Track step 1 complete
                    if (window.gtag) {
                      window.gtag('event', 'form_step_1_complete', { event_category: 'form' });
                    }
                    setFormStep(2);
                  }}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-teal-600 hover:to-cyan-700 transition"
                  data-testid="form-next-button"
                >
                  Далее →
                </button>
              </div>
            )}
            
            {/* STEP 2: Contact Info */}
            {formStep === 2 && (
              <div className="space-y-6" data-testid="form-step-2">
                <div>
                  <label htmlFor="name" className="block text-gray-300 font-semibold mb-2">Ваше имя *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition"
                    placeholder="Александр Петров"
                    data-testid="form-input-name"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-gray-300 font-semibold mb-2">Телефон *</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full bg-gray-900/50 border ${phoneError ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition`}
                    placeholder="+998 XX XXX XX XX"
                    maxLength="17"
                    data-testid="form-input-phone"
                  />
                  {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-300 font-semibold mb-2">Email <span className="text-gray-400 font-normal">(опционально)</span></label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition"
                    placeholder="email@company.uz"
                    data-testid="form-input-email"
                  />
                </div>
                
                <div>
                  <label htmlFor="comment" className="block text-gray-300 font-semibold mb-2">Комментарий <span className="text-gray-400 font-normal">(опционально)</span></label>
                  <textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    rows={3}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition resize-none"
                    placeholder="Дополнительные пожелания, сроки, материалы..."
                    data-testid="form-input-comment"
                  />
                </div>

                {/* Honeypot field - hidden from users */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  style={{ display: 'none' }}
                  tabIndex="-1"
                  autoComplete="off"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setFormStep(1)}
                    className="sm:w-auto bg-gray-800 text-white px-6 py-4 rounded-lg font-semibold hover:bg-gray-700 transition border border-gray-700"
                    data-testid="form-back-button"
                  >
                    ← Назад
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-teal-600 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="form-submit-button"
                  >
                    {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                  </button>
                </div>
              </div>
            )}

            <p className="text-gray-300 text-sm mt-6 text-center">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных
            </p>
            
            {/* Alternative - Telegram */}
            <div className="mt-6 pt-6 border-t border-gray-800 text-center">
              <p className="text-gray-400 text-sm mb-3">Нужно быстрее?</p>
              <a
                href="https://t.me/GraverAdm" data-track="tg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-teal-500 hover:text-teal-400 font-semibold transition"
                data-testid="form-telegram-alternative"
              >
                <Send className="mr-2" size={18} />
                Написать в Telegram
              </a>
            </div>
          </form>
        </div>
      </section>
      </DeferredSection>

      <DeferredSection id="blog" placeholderClassName="py-20 bg-black" rootMargin="520px">
      {/* Blog Posts Section */}
      <section
        className="py-20 bg-black"
        data-testid="blog-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('blog.title')} <span className="text-teal-500">{t('blog.titleAccent')}</span>
            </h2>
            <p className="text-xl text-gray-400">
              {t('blog.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t('blog.posts').map((post, index) => (
              <a 
                key={index}
                href={`/${locale}/blog/${post.slug}`}
                className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-teal-500/50 transition"
                data-testid={`blog-post-${index + 1}`}
              >
                <div className="aspect-video bg-gradient-to-br from-teal-900/30 to-cyan-900/30 flex items-center justify-center">
                  <div className="text-center p-4">
                    <span className="text-teal-500 text-sm font-medium">{t('blog.category')}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-500 transition line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <span className="text-teal-500 text-sm font-semibold inline-flex items-center group-hover:translate-x-1 transition-transform">
                    {t('blog.readMore')}
                    <ChevronDown className="ml-1 rotate-[-90deg]" size={14} />
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-12">
            <a 
              href={`/${locale}/blog`}
              className="inline-flex items-center text-teal-500 hover:text-teal-400 font-semibold text-lg transition group"
              data-testid="blog-all-posts"
            >
              {t('blog.allPosts')}
              <ChevronDown className="ml-2 rotate-[-90deg] group-hover:translate-x-1 transition-transform" size={18} />
            </a>
          </div>
        </div>
      </section>
      </DeferredSection>

      <DeferredSection id="faq" placeholderClassName="py-20 bg-black" rootMargin="640px">
      {/* FAQ Section */}
      <section
        className="py-20 bg-black"
        data-testid="faq-section"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Частые <span className="text-teal-500">вопросы</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Какой минимальный тираж для корпоративного заказа?',
                a: 'Минимального тиража нет. Делаем как 1 эксклюзивный подарок, так и серии на тысячи единиц. Цена за единицу снижается при объёмах от 50+ штук.'
              },
              {
                q: 'Можно ли сделать персонализацию для каждого сотрудника?',
                a: 'Да, делаем индивидуальную гравировку имени, должности, даты для каждого изделия в тираже. Пришлите список — подготовим макеты для согласования.'
              },
              {
                q: 'Работаете ли с юридическими лицами?',
                a: 'Да, работаем с юрлицами. Предоставляем все закрывающие документы, счета, акты. По согласованию возможна отсрочка платежа для постоянных клиентов.'
              },
              {
                q: 'Сколько времени занимает производство?',
                a: 'Типовые заказы — 1-3 дня после утверждения макета. Крупные тиражи и сложные проекты — обсуждаем индивидуально. Срочное производство — по запросу.'
              },
              {
                q: 'Что нужно от нас для начала работы?',
                a: 'Логотип в векторе (AI/SVG/PDF) или качественное фото. Описание: что наносим, на какие предметы, тираж, к какому сроку. Если нет готового макета — создадим сами.'
              },
              {
                q: 'На каких материалах делаете гравировку?',
                a: 'Металл (сталь, алюминий, латунь), анодированный алюминий, дерево, кожа, стекло, акрил, премиальные пластики. Fiber, CO2, MOPA и UV-технологии.'
              },
              {
                q: 'Можно ли увидеть результат до производства?',
                a: 'Обязательно. Это наш стандарт работы: вы получаете цифровой макет с точными размерами и размещением, утверждаете его, и только потом мы запускаем производство.'
              },
              {
                q: 'Предоставляете ли подарочную упаковку?',
                a: 'Да, предлагаем премиальную упаковку под ключ: коробки, пакеты, ленты, открытки — всё под ваш корпоративный стиль.'
              }
            ].map((faq, index) => (
              <details key={index} className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-teal-500/50 transition" data-testid={`faq-item-${index + 1}`}>
                <summary className="px-6 py-5 cursor-pointer list-none flex items-center justify-between text-white font-semibold text-lg">
                  <span>{faq.q}</span>
                  <ChevronDown className="group-open:rotate-180 transition-transform text-teal-500" size={20} />
                </summary>
                <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">{t('faq.notFound')}</p>
            <a
              href="https://t.me/GraverAdm" data-track="tg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition"
              data-testid="faq-contact-cta"
            >
              <MessageCircle className="mr-2" size={20} />
              {t('faq.askTelegram')}
            </a>
          </div>
        </div>
      </section>
      </DeferredSection>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <span className="text-2xl font-bold text-white">Graver<span className="text-teal-500">.uz</span></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t('footer.description')}
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">{t('footer.contacts')}</h3>
              <div className="space-y-3 text-gray-300 text-sm">
                <a href="tel:+998770802288" className="flex items-center hover:text-teal-500 transition" data-testid="footer-phone-1" data-track="tel">
                  <Phone size={16} className="mr-2" />
                  +998 77 080 22 88
                </a>
                <a href="tel:+998974802288" className="flex items-center hover:text-teal-500 transition" data-testid="footer-phone-2" data-track="tel">
                  <Phone size={16} className="mr-2" />
                  +998 97 480 22 88
                </a>
                <a href="https://t.me/GraverAdm" data-track="tg" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-teal-500 transition" data-testid="footer-telegram">
                  <Send size={16} className="mr-2" />
                  @GraverAdm
                </a>
                <div className="flex items-start">
                  <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                  <span>{t('footer.address')}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">{t('nav.blog')}</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                {t('blog.posts').slice(0, 3).map((post, index) => (
                  <a 
                    key={index}
                    href={`/${locale}/blog/${post.slug}`}
                    className="block hover:text-teal-500 transition line-clamp-1"
                  >
                    {post.title}
                  </a>
                ))}
                <a 
                  href={`/${locale}/blog`}
                  className="block text-teal-500 hover:text-teal-400 font-medium mt-3"
                >
                  {t('blog.allPosts')} →
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">{t('footer.workingHours')}</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <p><Clock size={16} className="inline mr-2" />{t('footer.schedule')}</p>
                <p className="text-teal-500 font-semibold">{t('footer.requests24')}</p>
              </div>
              
              {/* Quick Links for Internal Linking (P1.3) */}
              <h3 className="text-white font-bold mt-6 mb-3">{locale === 'uz' ? 'Tez havolalar' : 'Быстрые ссылки'}</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <Link to={`/${locale}/blog`} className="block hover:text-teal-500 transition">
                  {locale === 'uz' ? 'Blog' : 'Блог'}
                </Link>
                <a href="#services" className="block hover:text-teal-500 transition">
                  {locale === 'uz' ? 'Xizmatlar' : 'Услуги'}
                </a>
                <a href="#portfolio" className="block hover:text-teal-500 transition">
                  {locale === 'uz' ? 'Portfolio' : 'Портфолио'}
                </a>
                <a href="#contact" className="block hover:text-teal-500 transition">
                  {locale === 'uz' ? 'Aloqa' : 'Контакты'}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-300 text-sm">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-black/95 backdrop-blur-sm border-t border-gray-800 p-3 z-40" data-testid="sticky-mobile-cta">
        <div className="flex gap-2">
          <button
            onClick={() => scrollToSection('contact')}
            className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-4 py-3 rounded-lg font-semibold text-center hover:from-teal-600 hover:to-cyan-700 transition min-h-[48px]"
            data-testid="sticky-form-button"
          >
            Запросить расчёт
          </button>
          <a
            href="https://t.me/GraverAdm" data-track="tg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Написать в Telegram"
            className="bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold text-center hover:bg-gray-700 transition flex items-center justify-center border border-gray-700 min-h-[48px]"
            data-testid="sticky-telegram-button"
          >
            <Send size={20} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;