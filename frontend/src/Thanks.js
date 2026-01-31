import React, { useEffect } from 'react';
import { Send, Home, Check, Clock, Award, Package } from 'lucide-react';
import './App.css';

function Thanks() {
  useEffect(() => {
    // Track lead conversion on page load
    if (window.__trackLeadSuccess) {
      window.__trackLeadSuccess();
    }
  }, []);

  const handleBackHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="Thanks min-h-screen bg-black">
      {/* Hero Section with Background */}
      <section 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url(/pictures/thanks-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        data-testid="thanks-hero"
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-500/20 border-2 border-teal-500 rounded-full mb-8 animate-pulse">
            <Check className="text-teal-500" size={40} />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Заявка принята.<br />
            <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
              Мы уже считаем ваш тираж
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Ответим в ближайшее рабочее время (10:00-20:00).<br />
            Если срочно — напишите в Telegram прямо сейчас.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://t.me/GraverAdm" data-track="tg"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-teal-600 hover:to-cyan-700 transition shadow-lg shadow-teal-500/50 flex items-center justify-center group"
              data-testid="thanks-telegram-cta"
            >
              <Send className="mr-2 group-hover:translate-x-1 transition-transform" size={20} />
              Написать в Telegram
            </a>
            <button
              onClick={handleBackHome}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition border border-white/20 flex items-center justify-center"
              data-testid="thanks-home-cta"
            >
              <Home className="mr-2" size={20} />
              Вернуться на главную
            </button>
          </div>
        </div>
      </section>

      {/* What's Next Section */}
      <section className="py-20 bg-gray-900" data-testid="thanks-next-steps">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Что дальше?
            </h2>
            <p className="text-gray-400 text-lg">
              Прозрачный процесс от заявки до получения готовой продукции
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition" data-testid="thanks-step-1">
              <div className="flex items-center justify-center w-16 h-16 bg-teal-500/10 rounded-xl mb-6">
                <span className="text-3xl font-bold text-teal-500">01</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Макет</h3>
              <p className="text-gray-400 leading-relaxed">
                Сначала делаем цифровой превью с точным размещением вашего логотипа. Вы утверждаете каждую деталь до производства.
              </p>
              <div className="mt-4 flex items-center text-teal-500">
                <Clock size={18} className="mr-2" />
                <span className="text-sm">В течение 2 часов</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition" data-testid="thanks-step-2">
              <div className="flex items-center justify-center w-16 h-16 bg-teal-500/10 rounded-xl mb-6">
                <span className="text-3xl font-bold text-teal-500">02</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Производство</h3>
              <p className="text-gray-400 leading-relaxed">
                Гравируем партию согласно утверждённому макету. Контроль качества каждой единицы на всех этапах.
              </p>
              <div className="mt-4 flex items-center text-teal-500">
                <Package size={18} className="mr-2" />
                <span className="text-sm">1-3 рабочих дня</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition" data-testid="thanks-step-3">
              <div className="flex items-center justify-center w-16 h-16 bg-teal-500/10 rounded-xl mb-6">
                <span className="text-3xl font-bold text-teal-500">03</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Выдача</h3>
              <p className="text-gray-400 leading-relaxed">
                Доставка или самовывоз в оговорённые сроки. Все документы для юрлиц. Прозрачность на каждом шаге.
              </p>
              <div className="mt-4 flex items-center text-teal-500">
                <Award size={18} className="mr-2" />
                <span className="text-sm">Гарантия качества</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Section */}
      <section className="py-16 bg-black border-t border-gray-800" data-testid="thanks-contact">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-teal-500/30 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Быстрый контакт
              </h3>
              <p className="text-gray-400">
                Обычно отвечаем в течение 15-60 минут в рабочее время
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
                <p className="text-gray-400 text-sm mb-2">Телефоны:</p>
                <a href="tel:+998770802288" data-track="tel" className="text-white text-lg font-semibold hover:text-teal-500 transition block">
                  +998 77 080 22 88
                </a>
                <a href="tel:+998974802288" data-track="tel" className="text-gray-400 text-sm hover:text-teal-500 transition block mt-1">
                  +998 97 480 22 88
                </a>
              </div>

              {/* Telegram */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
                <p className="text-gray-400 text-sm mb-2">Telegram:</p>
                <a 
                  href="https://t.me/GraverAdm" data-track="tg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white text-lg font-semibold hover:text-teal-500 transition flex items-center"
                >
                  <Send size={18} className="mr-2" />
                  @GraverAdm
                </a>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-8 pt-8 border-t border-gray-800">
              <div className="grid md:grid-cols-2 gap-6 text-center md:text-left">
                <div>
                  <p className="text-gray-300 leading-relaxed">
                    <span className="text-teal-500 font-semibold">Работаем с корпоративными заказами:</span> мерч, награды, подарочные наборы для сотрудников и клиентов.
                  </p>
                </div>
                <div>
                  <p className="text-gray-300 leading-relaxed">
                    <span className="text-teal-500 font-semibold">Без сюрпризов:</span> сначала макет с точным превью — потом производство. Полный контроль на каждом этапе.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 Graver.uz — Премиальная лазерная гравировка в Ташкенте</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Thanks;
