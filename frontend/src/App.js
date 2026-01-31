import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { Phone, Send, Check, Zap, Users, Award, Package, Clock, MessageCircle, Mail, MapPin, ChevronDown } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '+998 ',
    company: '',
    quantity: '',
    description: '',
    website: '' // honeypot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const portfolioItems = [
    {
      id: 1,
      title: 'Часы с персональной гравировкой',
      category: 'Премиальные подарки',
      description: 'Элитные часы с индивидуальной гравировкой для топ-менеджмента',
      image: '/portfolio/1.png',
      material: 'Металл, стекло',
      application: 'Подарки руководителям'
    },
    {
      id: 2,
      title: 'Корпоративные награды',
      category: 'Награды и признание',
      description: 'Премиальные награды с гравировкой для сотрудников и партнёров',
      image: '/portfolio/3.png',
      material: 'Металл, дерево',
      application: 'Награждение персонала'
    },
    {
      id: 3,
      title: 'Брендированные термосы',
      category: 'Корпоративная продукция',
      description: 'Качественные термосы с логотипом компании для команды',
      image: '/portfolio/4.png',
      material: 'Анодированный алюминий',
      application: 'Подарки сотрудникам'
    },
    {
      id: 4,
      title: 'Премиальный подарочный набор',
      category: 'Корпоративные подарки',
      description: 'Эксклюзивный набор с брендированием для VIP-клиентов',
      image: '/portfolio/10.png',
      material: 'Комбинированные материалы',
      application: 'Подарки клиентам'
    },
    {
      id: 5,
      title: 'Корпоративная упаковка',
      category: 'Брендированная упаковка',
      description: 'Элегантная упаковка с логотипом для корпоративных мероприятий',
      image: '/portfolio/5.png',
      material: 'Картон, металл',
      application: 'Корпоративные события'
    },
    {
      id: 6,
      title: 'Премиальная награда',
      category: 'Награды премиум-класса',
      description: 'Эксклюзивная награда из стекла и металла с подсветкой',
      image: '/portfolio/6.png',
      material: 'Стекло, металл',
      application: 'Престижные премии'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Anti-spam: cooldown 10 seconds
    const now = Date.now();
    if (now - lastSubmitTime < 10000) {
      alert('Пожалуйста, подождите 10 секунд перед повторной отправкой.');
      return;
    }
    
    // Honeypot check
    if (formData.website) {
      console.log('Bot detected');
      return; // Silent fail for bots
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          company: formData.company,
          quantity: formData.quantity,
          description: formData.description
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при отправке заявки');
      }
      
      setLastSubmitTime(now);
      setSubmitSuccess(true);
      setFormData({ name: '', phone: '+998 ', company: '', quantity: '', description: '', website: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Произошла ошибка. Пожалуйста, позвоните нам или напишите в Telegram.');
    } finally {
      setIsSubmitting(false);
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
              <button onClick={() => scrollToSection('services')} className="text-gray-300 hover:text-teal-500 transition">Услуги</button>
              <button onClick={() => scrollToSection('portfolio')} className="text-gray-300 hover:text-teal-500 transition">Портфолио</button>
              <button onClick={() => scrollToSection('process')} className="text-gray-300 hover:text-teal-500 transition">Процесс</button>
              <button onClick={() => scrollToSection('faq')} className="text-gray-300 hover:text-teal-500 transition">FAQ</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-teal-500 transition">Контакты</button>
            </nav>

            {/* Phone Numbers */}
            <div className="hidden md:flex flex-col items-end space-y-1">
              <a href="tel:+998770802288" className="text-white font-semibold hover:text-teal-500 transition flex items-center" data-testid="phone-number-1">
                <Phone size={16} className="mr-2" />
                +998 77 080 22 88
              </a>
              <a href="tel:+998974802288" className="text-gray-400 text-sm hover:text-teal-500 transition flex items-center" data-testid="phone-number-2">
                <Phone size={14} className="mr-2" />
                +998 97 480 22 88
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-white"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              data-testid="mobile-menu-button"
            >
              <ChevronDown className={`transform transition-transform ${showMobileMenu ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden pb-4 border-t border-gray-800 mt-4 pt-4">
              <nav className="flex flex-col space-y-3">
                <button onClick={() => scrollToSection('services')} className="text-gray-300 hover:text-teal-500 transition text-left">Услуги</button>
                <button onClick={() => scrollToSection('portfolio')} className="text-gray-300 hover:text-teal-500 transition text-left">Портфолио</button>
                <button onClick={() => scrollToSection('process')} className="text-gray-300 hover:text-teal-500 transition text-left">Процесс</button>
                <button onClick={() => scrollToSection('faq')} className="text-gray-300 hover:text-teal-500 transition text-left">FAQ</button>
                <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-teal-500 transition text-left">Контакты</button>
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-800">
                  <a href="tel:+998770802288" className="text-white font-semibold hover:text-teal-500 transition flex items-center">
                    <Phone size={16} className="mr-2" />
                    +998 77 080 22 88
                  </a>
                  <a href="tel:+998974802288" className="text-gray-400 hover:text-teal-500 transition flex items-center">
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
              <span className="text-teal-500 font-semibold tracking-wide uppercase text-sm border border-teal-500/30 px-4 py-2 rounded-full">Ташкент • Premium B2B решения</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Корпоративные подарки<br />
              <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">с вашим брендом</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              <span className="text-teal-500 font-semibold">Утверждаете макет — затем производство.</span><br />
              Премиальная лазерная гравировка и брендирование для бизнеса.<br />
              Тиражи любого объёма. Точные сроки. Никаких сюрпризов.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <a 
                href="https://t.me/GraverAdm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-teal-600 hover:to-cyan-700 transition shadow-lg shadow-teal-500/50 flex items-center justify-center group"
                data-testid="hero-telegram-cta"
              >
                <Send className="mr-2 group-hover:translate-x-1 transition-transform" size={20} />
                Написать в Telegram
              </a>
              <button 
                onClick={() => scrollToSection('contact')}
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition border border-white/20"
                data-testid="hero-contact-cta"
              >
                Запросить расчёт
              </button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-teal-500">100%</div>
                <div className="text-sm text-gray-400">Утверждение<br />до производства</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-teal-500">24/7</div>
                <div className="text-sm text-gray-400">Приём<br />заявок</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-teal-500">1-3</div>
                <div className="text-sm text-gray-400">Дня типовое<br />производство</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-teal-500">∞</div>
                <div className="text-sm text-gray-400">Объём<br />тиража</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B2B Benefits Section */}
      <section className="py-20 bg-gray-900" id="benefits" data-testid="benefits-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Почему крупные компании<br />выбирают <span className="text-teal-500">Graver.uz</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Надёжный партнёр для корпоративных заказов. Прозрачный процесс, гарантированное качество.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition group" data-testid="benefit-card-preview">
              <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition">
                <Check className="text-teal-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Макет до производства</h3>
              <p className="text-gray-400 leading-relaxed">
                Цифровое превью с точными размерами и размещением. Вы утверждаете каждую деталь до старта работ — никаких неприятных сюрпризов.
              </p>
            </div>

            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition group" data-testid="benefit-card-volumes">
              <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition">
                <Package className="text-teal-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Тиражи любого объёма</h3>
              <p className="text-gray-400 leading-relaxed">
                От единичных премиальных подарков до серий на тысячи единиц. Персонализация каждого изделия с именами и должностями.
              </p>
            </div>

            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition group" data-testid="benefit-card-timing">
              <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition">
                <Clock className="text-teal-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Точные сроки</h3>
              <p className="text-gray-400 leading-relaxed">
                Типовые заказы 1-3 дня. Срочное производство по запросу. Прозрачное планирование под ваш корпоративный календарь и мероприятия.
              </p>
            </div>

            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition group" data-testid="benefit-card-materials">
              <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition">
                <Zap className="text-teal-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Любые материалы</h3>
              <p className="text-gray-400 leading-relaxed">
                Металл, анодированный алюминий, дерево, стекло, кожа, премиальные пластики. Fiber, CO2, MOPA, UV-технологии под каждую задачу.
              </p>
            </div>

            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition group" data-testid="benefit-card-files">
              <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition">
                <Award className="text-teal-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Работаем с вашими файлами</h3>
              <p className="text-gray-400 leading-relaxed">
                Логотипы, бренд-гайды, вектор, фото. Если макета нет — создадим под ваш фирменный стиль. Соблюдаем все требования брендбука.
              </p>
            </div>

            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition group" data-testid="benefit-card-b2b">
              <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition">
                <Users className="text-teal-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">B2B сервис</h3>
              <p className="text-gray-400 leading-relaxed">
                Работа с юрлицами, закрывающие документы, отсрочка платежа по согласованию. Персональный менеджер для крупных заказов.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-black" id="services" data-testid="services-section">
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
                  href="https://t.me/GraverAdm" 
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
                  href="https://t.me/GraverAdm" 
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
                  href="https://t.me/GraverAdm" 
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
                  href="https://t.me/GraverAdm" 
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

      {/* Portfolio Section */}
      <section className="py-20 bg-gray-900" id="portfolio" data-testid="portfolio-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Портфолио <span className="text-teal-500">наших работ</span>
            </h2>
            <p className="text-xl text-gray-400">
              Реальные проекты для B2B клиентов
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <div key={item.id} className="group relative bg-black/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-teal-500/50 transition" data-testid={`portfolio-item-${index + 1}`}>
                <div className="aspect-square overflow-hidden bg-gray-800">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div class="flex items-center justify-center h-full text-gray-500">
                        <div class="text-center">
                          <Package size={48} class="mx-auto mb-2 opacity-50" />
                          <p class="text-sm">Изображение загружается...</p>
                          <p class="text-xs text-gray-600 mt-2">${item.image}</p>
                        </div>
                      </div>`;
                    }}
                  />
                </div>
                <div className="p-6">
                  <span className="text-teal-500 text-sm font-semibold">{item.category}</span>
                  <h3 className="text-xl font-bold text-white mt-2 mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div><span className="text-gray-600">Материал:</span> {item.material}</div>
                    <div><span className="text-gray-600">Применение:</span> {item.application}</div>
                  </div>
                  <a 
                    href="https://t.me/GraverAdm" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-4 text-teal-500 hover:text-teal-400 font-semibold text-sm group/link"
                  >
                    Хочу так же
                    <Send className="ml-2 group-hover/link:translate-x-1 transition-transform" size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-black" id="process" data-testid="process-section">
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

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-900" id="contact" data-testid="contact-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Запросить <span className="text-teal-500">расчёт</span>
            </h2>
            <p className="text-xl text-gray-400">
              Заполните форму, и мы подготовим коммерческое предложение в течение 2 часов
            </p>
          </div>

          {submitSuccess && (
            <div className="mb-8 bg-teal-500/10 border border-teal-500/30 rounded-xl p-6 text-center" data-testid="success-message">
              <Check className="inline-block text-teal-500 mb-2" size={32} />
              <p className="text-white font-semibold text-lg">Заявка успешно отправлена!</p>
              <p className="text-gray-300 text-sm mt-2">Мы получили вашу заявку и свяжемся с вами в течение 15 минут (в рабочее время 10:00-20:00).</p>
              <p className="text-gray-400 text-xs mt-2">Также можете написать нам напрямую в Telegram: <a href="https://t.me/GraverAdm" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">@GraverAdm</a></p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-black/50 border border-gray-800 rounded-2xl p-8" data-testid="contact-form">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-300 font-semibold mb-2">Ваше имя *</label>
                <input
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
                <label className="block text-gray-300 font-semibold mb-2">Телефон *</label>
                <input
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
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-300 font-semibold mb-2">Компания</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition"
                  placeholder="ООО 'Ваша компания'"
                  data-testid="form-input-company"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-2">Тираж (шт)</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition"
                  placeholder="100"
                  data-testid="form-input-quantity"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 font-semibold mb-2">Описание задачи *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition resize-none"
                placeholder="Опишите, что хотите сделать: предмет, материал, что наносить (логотип/текст/фото), к какому сроку..."
                data-testid="form-input-description"
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

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-teal-600 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="form-submit-button"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
              </button>
              <a
                href="https://t.me/GraverAdm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition border border-white/20 flex items-center justify-center"
                data-testid="form-telegram-alternative"
              >
                <Send className="mr-2" size={20} />
                Или в Telegram
              </a>
            </div>

            <p className="text-gray-500 text-sm mt-4 text-center">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных
            </p>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-black" id="faq" data-testid="faq-section">
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
            <p className="text-gray-400 mb-4">Не нашли ответ на свой вопрос?</p>
            <a
              href="https://t.me/GraverAdm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition"
              data-testid="faq-contact-cta"
            >
              <MessageCircle className="mr-2" size={20} />
              Задать вопрос в Telegram
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <span className="text-2xl font-bold text-white">Graver<span className="text-teal-500">.uz</span></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Премиальная лазерная гравировка и брендирование для бизнеса в Ташкенте. Корпоративные подарки, награды, маркировка.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Контакты</h3>
              <div className="space-y-3 text-gray-400 text-sm">
                <a href="tel:+998770802288" className="flex items-center hover:text-teal-500 transition" data-testid="footer-phone-1">
                  <Phone size={16} className="mr-2" />
                  +998 77 080 22 88
                </a>
                <a href="tel:+998974802288" className="flex items-center hover:text-teal-500 transition" data-testid="footer-phone-2">
                  <Phone size={16} className="mr-2" />
                  +998 97 480 22 88
                </a>
                <a href="https://t.me/GraverAdm" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-teal-500 transition" data-testid="footer-telegram">
                  <Send size={16} className="mr-2" />
                  @GraverAdm
                </a>
                <div className="flex items-start">
                  <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                  <span>Ташкент, улица Мукими</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Режим работы</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p><Clock size={16} className="inline mr-2" />Пн-Вс: 10:00 - 20:00</p>
                <p className="text-teal-500 font-semibold">Заявки принимаем 24/7</p>
                <p className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500">
                  ИП Graver.uz<br />
                  Ташкент, Узбекистан
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 Graver.uz — Премиальная лазерная гравировка в Ташкенте</p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-black/95 backdrop-blur-sm border-t border-gray-800 p-4 z-40" data-testid="sticky-mobile-cta">
        <a
          href="https://t.me/GraverAdm"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-4 rounded-lg font-semibold text-center hover:from-teal-600 hover:to-cyan-700 transition flex items-center justify-center"
          data-testid="sticky-telegram-button"
        >
          <Send className="mr-2" size={20} />
          Написать в Telegram
        </a>
      </div>
    </div>
  );
}

export default App;