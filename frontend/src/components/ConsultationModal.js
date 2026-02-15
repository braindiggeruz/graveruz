import React, { useState } from 'react';
import { X, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function ConsultationModal({ isOpen, onClose, locale = 'ru' }) {
  const isRu = locale === 'ru';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const texts = {
    ru: {
      title: '💬 Получить консультацию',
      subtitle: 'Заполните форму и наши специалисты свяжутся с вами в ближайшее время',
      namePlaceholder: 'Ваше имя',
      phonePlaceholder: '+998 (XX) XXX-XX-XX',
      messagePlaceholder: 'Расскажите о вашем проекте...',
      submitBtn: 'Отправить заявку',
      successTitle: '✅ Спасибо!',
      successMessage: 'Ваша заявка отправлена. Мы свяжемся с вами в течение 24 часов.',
      errorMessage: 'Ошибка при отправке. Пожалуйста, попробуйте снова.',
      validationError: 'Пожалуйста, заполните все поля корректно'
    },
    uz: {
      title: '💬 Konsultatsiya olish',
      subtitle: 'Formani to\'ldiring va bizning mutaxassislar tez orada siz bilan bog\'lanishadi',
      namePlaceholder: 'Sizning ismingiz',
      phonePlaceholder: '+998 (XX) XXX-XX-XX',
      messagePlaceholder: 'Loyihangiz haqida gapirib bering...',
      submitBtn: 'Ariza yuborish',
      successTitle: '✅ Rahmat!',
      successMessage: 'Sizning ariza yuborildi. Biz 24 soat ichida siz bilan bog\'lanamiz.',
      errorMessage: 'Yuborishda xato. Iltimos, qayta urinib ko\'ring.',
      validationError: 'Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring'
    }
  };

  const t = texts[isRu ? 'ru' : 'uz'];

  const isValidPhone = function(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = function() {
    if (!formData.name.trim() || !isValidPhone(formData.phone) || !formData.message.trim()) {
      setError(t.validationError);
      return false;
    }
    return true;
  };

  const handleSubmit = async function(event) {
    event.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          locale: locale,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setSubmitted(true);
      setFormData({ name: '', phone: '', message: '' });

      setTimeout(function() {
        onClose();
        setSubmitted(false);
      }, 3000);
    } catch (submissionError) {
      setError(t.errorMessage);
      console.error('Consultation submit error:', submissionError);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = function(event) {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(function(previous) {
      return {
        ...previous,
        [name]: value
      };
    });
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900">
          <h2 className="text-xl font-bold text-white">{t.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <CheckCircle size={48} className="text-teal-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t.successTitle}</h3>
              <p className="text-gray-400">{t.successMessage}</p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-6">{t.subtitle}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isRu ? 'Имя' : 'Ism'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.namePlaceholder}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isRu ? 'Телефон' : 'Telefon'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t.phonePlaceholder}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isRu ? 'Сообщение' : 'Xabar'}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t.messagePlaceholder}
                    rows="4"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition resize-none"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700/30 rounded-lg">
                    <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      {isRu ? 'Отправка...' : 'Yuborilmoqda...'}
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {t.submitBtn}
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                {isRu
                  ? 'Мы не передаем ваши данные третьим лицам'
                  : 'Biz sizning ma\'lumotlaringizni uchinchi tomonlarga bermaymiz'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}