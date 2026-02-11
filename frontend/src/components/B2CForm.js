import React, { useState, useRef } from 'react';
import { Send, Upload, AlertCircle, Check } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;

const translations = {
  ru: {
    title: "Оставить заявку",
    minReq: "Чтобы сделать макет: выберите категорию, количество и прикрепите логотип/текст.",
    category: "Категория",
    categoryPlaceholder: "Выберите товар",
    categories: {
      watches: "Часы с гравировкой",
      lighters: "Зажигалки (аналог Zippo)",
      pen: "Ручки с гравировкой",
      powerbank: "Повербанки с гравировкой",
      diary: "Ежедневники с гравировкой"
    },
    qty: "Количество",
    qtyOptions: { "1": "1 шт", "2-5": "2–5 шт", "6-20": "6–20 шт", "21-50": "21–50 шт", "50+": "50+ шт" },
    engravingType: "Тип гравировки",
    engravingOptions: { text: "Текст/инициалы", logo: "Логотип", symbol: "Символ/рисунок", other: "Другое" },
    confirmLabel: "Подтверждаю: выбираю продукцию Graver из каталога (не своё изделие)",
    confirmError: "Мы работаем на нашей продукции. Если у вас своё изделие — напишите в Telegram для уточнения.",
    file: "Логотип или текст для гравировки",
    fileHint: "JPG, PNG, PDF, AI, SVG до 10 MB",
    fileError: "Пожалуйста, прикрепите файл с логотипом или текстом",
    phone: "Телефон",
    city: "Город",
    cities: { tashkent: "Ташкент", other: "Другой город" },
    deadline: "Срочность",
    deadlines: { urgent: "Срочно (1-2 дня)", standard: "Стандарт (3-5 дней)", relaxed: "Не спешу" },
    comment: "Комментарий",
    submit: "Получить макет",
    submitting: "Отправка...",
    telegram: "Написать в Telegram",
    // Conditional fields
    sides: "Стороны гравировки",
    sidesOptions: { "1": "1 сторона (140 000 сум)", "2": "2 стороны (190 000 сум)" },
    fuel: "Нужно топливо?",
    fuelOptions: { yes: "Да (+100 000 сум)", no: "Нет" },
    watchColor: "Цвет корпуса",
    watchColors: { silver: "Серебро", black: "Чёрный", other: "Уточню при общении" },
    diaryMethod: "Метод нанесения",
    diaryMethods: { engraving: "Гравировка", uv: "УФ печать" }
  },
  uz: {
    title: "Ariza qoldirish",
    minReq: "Maket uchun: kategoriya, soni va logo/matn faylini biriktiring.",
    category: "Kategoriya",
    categoryPlaceholder: "Mahsulotni tanlang",
    categories: {
      watches: "Gravirovkali soat",
      lighters: "Zajigalka (Zippo analogi)",
      pen: "Gravirovkali ruchka",
      powerbank: "Gravirovkali powerbank",
      diary: "Gravirovkali kundalik"
    },
    qty: "Soni",
    qtyOptions: { "1": "1 dona", "2-5": "2–5 dona", "6-20": "6–20 dona", "21-50": "21–50 dona", "50+": "50+ dona" },
    engravingType: "Gravirovka turi",
    engravingOptions: { text: "Matn/initsiallar", logo: "Logotip", symbol: "Belgi/rasm", other: "Boshqa" },
    confirmLabel: "Tasdiqlayman: Graver katalogidagi mahsulotni tanlayman (o'zimniki emas)",
    confirmError: "Biz o'z mahsulotlarimizda ishlaymiz. O'zingizniki bo'lsa — Telegramga yozing.",
    file: "Gravirovka uchun logo yoki matn",
    fileHint: "JPG, PNG, PDF, AI, SVG 10 MB gacha",
    fileError: "Iltimos, logo yoki matn faylini biriktiring",
    phone: "Telefon",
    city: "Shahar",
    cities: { tashkent: "Toshkent", other: "Boshqa shahar" },
    deadline: "Muddati",
    deadlines: { urgent: "Shoshilinch (1-2 kun)", standard: "Standart (3-5 kun)", relaxed: "Shoshilmayman" },
    comment: "Izoh",
    submit: "Maket olish",
    submitting: "Yuborilmoqda...",
    telegram: "Telegramga yozish",
    sides: "Gravirovka tomonlari",
    sidesOptions: { "1": "1 tomon (140 000 so'm)", "2": "2 tomon (190 000 so'm)" },
    fuel: "Yoqilg'i kerakmi?",
    fuelOptions: { yes: "Ha (+100 000 so'm)", no: "Yo'q" },
    watchColor: "Korpus rangi",
    watchColors: { silver: "Kumush", black: "Qora", other: "Muloqotda aniqlayman" },
    diaryMethod: "Qo'llash usuli",
    diaryMethods: { engraving: "Gravirovka", uv: "UV bosma" }
  }
};

export default function B2CForm({ locale = 'ru', defaultCategory = '', pageUrl = '' }) {
  const t = translations[locale] || translations.ru;
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    category: defaultCategory,
    qty: '',
    engravingType: [],
    confirmOurProduct: false,
    phone: '+998 ',
    city: 'tashkent',
    deadline: 'standard',
    comment: '',
    // Conditional
    sides: '1',
    fuel: 'no',
    watchColor: 'silver',
    diaryMethod: 'engraving'
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith('+998')) value = '+998 ' + value.replace(/^\+998\s?/, '');
    value = value.replace(/[^\d+\s]/g, '');
    if (value.length > 4) {
      const parts = value.slice(5).replace(/\s/g, '');
      let formatted = '+998 ';
      if (parts.length > 0) formatted += parts.slice(0, 2);
      if (parts.length > 2) formatted += ' ' + parts.slice(2, 5);
      if (parts.length > 5) formatted += ' ' + parts.slice(5, 7);
      if (parts.length > 7) formatted += ' ' + parts.slice(7, 9);
      value = formatted;
    }
    setFormData({ ...formData, phone: value });
  };

  const handleEngravingChange = (type) => {
    const current = formData.engravingType;
    if (current.includes(type)) {
      setFormData({ ...formData, engravingType: current.filter(t => t !== type) });
    } else {
      setFormData({ ...formData, engravingType: [...current, type] });
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.size <= 10 * 1024 * 1024) {
      setFile(f);
      setErrors({ ...errors, file: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = true;
    if (!formData.qty) newErrors.qty = true;
    if (!formData.confirmOurProduct) newErrors.confirm = t.confirmError;
    if (!file) newErrors.file = t.fileError;
    if (formData.phone.length < 17) newErrors.phone = true;
    if (formData.engravingType.length === 0) newErrors.engravingType = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      // Build description
      let desc = `[B2C] Категория: ${t.categories[formData.category]}\n`;
      desc += `Кол-во: ${formData.qty}\n`;
      desc += `Тип: ${formData.engravingType.map(et => t.engravingOptions[et]).join(', ')}\n`;
      if (formData.category === 'lighters') {
        desc += `Стороны: ${formData.sides}, Топливо: ${formData.fuel === 'yes' ? 'Да' : 'Нет'}\n`;
      }
      if (formData.category === 'watches') {
        desc += `Цвет: ${t.watchColors[formData.watchColor]}\n`;
      }
      if (formData.category === 'diary') {
        desc += `Метод: ${t.diaryMethods[formData.diaryMethod]}\n`;
      }
      desc += `Город: ${t.cities[formData.city]}\n`;
      desc += `Срочность: ${t.deadlines[formData.deadline]}\n`;
      desc += `Файл: ${file ? file.name : 'Нет'}\n`;
      desc += `Страница: ${pageUrl || window.location.href}`;
      if (formData.comment) desc += `\nКомментарий: ${formData.comment}`;

      const payload = {
        name: `B2C: ${t.categories[formData.category]}`,
        phone: formData.phone,
        company: formData.city === 'tashkent' ? 'Ташкент' : 'Другой город',
        quantity: formData.qty,
        description: desc,
        lead_type: 'b2c_catalog',
        category: formData.category,
        locale: locale
      };

      const response = await fetch(`${BACKEND_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Submit failed');
      
      window.location.assign(`/${locale}/thanks`);
    } catch (error) {
      console.error('B2C form error:', error);
      alert(locale === 'ru' 
        ? 'Ошибка отправки. Попробуйте ещё раз или напишите в Telegram.'
        : 'Yuborishda xatolik. Qayta urinib ko\'ring yoki Telegramga yozing.');
      setIsSubmitting(false);
    }
  };

  const telegramText = encodeURIComponent(
    `Здравствуйте! Интересует: ${t.categories[formData.category] || 'продукция'}, кол-во: ${formData.qty || '?'}`
  );

  return (
    <div className="bg-black/50 border border-gray-800 rounded-2xl p-6 sm:p-8" id="b2c-form">
      <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
      <p className="text-gray-400 text-sm mb-6 flex items-start">
        <AlertCircle size={16} className="mr-2 mt-0.5 text-teal-500 flex-shrink-0" />
        {t.minReq}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category */}
        <div>
          <label className="block text-gray-300 font-medium mb-2">{t.category} *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={`w-full bg-gray-900/50 border ${errors.category ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white`}
            data-testid="b2c-category"
          >
            <option value="">{t.categoryPlaceholder}</option>
            {Object.entries(t.categories).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {/* Conditional: Lighters */}
        {formData.category === 'lighters' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-medium mb-2">{t.sides} *</label>
              <select
                value={formData.sides}
                onChange={(e) => setFormData({ ...formData, sides: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white"
              >
                {Object.entries(t.sidesOptions).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-2">{t.fuel}</label>
              <select
                value={formData.fuel}
                onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white"
              >
                {Object.entries(t.fuelOptions).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Conditional: Watches */}
        {formData.category === 'watches' && (
          <div>
            <label className="block text-gray-300 font-medium mb-2">{t.watchColor}</label>
            <select
              value={formData.watchColor}
              onChange={(e) => setFormData({ ...formData, watchColor: e.target.value })}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white"
            >
              {Object.entries(t.watchColors).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        )}

        {/* Conditional: Diary */}
        {formData.category === 'diary' && (
          <div>
            <label className="block text-gray-300 font-medium mb-2">{t.diaryMethod}</label>
            <select
              value={formData.diaryMethod}
              onChange={(e) => setFormData({ ...formData, diaryMethod: e.target.value })}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white"
            >
              {Object.entries(t.diaryMethods).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="block text-gray-300 font-medium mb-2">{t.qty} *</label>
          <select
            value={formData.qty}
            onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
            className={`w-full bg-gray-900/50 border ${errors.qty ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white`}
            data-testid="b2c-qty"
          >
            <option value="">—</option>
            {Object.entries(t.qtyOptions).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {/* Engraving Type */}
        <div>
          <label className="block text-gray-300 font-medium mb-2">{t.engravingType} *</label>
          <div className={`grid grid-cols-2 gap-2 ${errors.engravingType ? 'ring-1 ring-red-500 rounded-lg p-2' : ''}`}>
            {Object.entries(t.engravingOptions).map(([k, v]) => (
              <label key={k} className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.engravingType.includes(k)}
                  onChange={() => handleEngravingChange(k)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-teal-500"
                />
                <span className="text-sm">{v}</span>
              </label>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-gray-300 font-medium mb-2">{t.file} *</label>
          <div
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
            className={`border-2 border-dashed ${errors.file ? 'border-red-500' : 'border-gray-700'} rounded-lg p-4 text-center cursor-pointer hover:border-teal-500/50 transition`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.ai,.svg"
              onChange={handleFileChange}
              className="hidden"
              data-testid="b2c-file"
            />
            {file ? (
              <div className="flex items-center justify-center text-teal-500">
                <Check size={20} className="mr-2" />
                <span>{file.name}</span>
              </div>
            ) : (
              <div className="text-gray-500">
                <Upload size={24} className="mx-auto mb-2" />
                <p className="text-sm">{t.fileHint}</p>
              </div>
            )}
          </div>
          {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
        </div>

        {/* Confirm Checkbox */}
        <div className={`p-4 rounded-lg ${errors.confirm ? 'bg-red-900/20 border border-red-500/50' : 'bg-gray-900/50 border border-gray-700'}`}>
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.confirmOurProduct}
              onChange={(e) => setFormData({ ...formData, confirmOurProduct: e.target.checked })}
              className="w-5 h-5 mt-0.5 rounded border-gray-600 bg-gray-800 text-teal-500"
              data-testid="b2c-confirm"
            />
            <span className="text-gray-300 text-sm">{t.confirmLabel}</span>
          </label>
          {errors.confirm && <p className="text-red-400 text-sm mt-2">{errors.confirm}</p>}
        </div>

        {/* Phone + City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 font-medium mb-2">{t.phone} *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              maxLength="17"
              className={`w-full bg-gray-900/50 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white`}
              data-testid="b2c-phone"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">{t.city} *</label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white"
            >
              {Object.entries(t.cities).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-gray-300 font-medium mb-2">{t.deadline}</label>
          <select
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white"
          >
            {Object.entries(t.deadlines).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-gray-300 font-medium mb-2">{t.comment}</label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={2}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition disabled:opacity-50"
            data-testid="b2c-submit"
          >
            {isSubmitting ? t.submitting : t.submit}
          </button>
          <a
            href={`https://t.me/GraverAdm?text=${telegramText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 text-white px-6 py-4 rounded-lg font-semibold hover:bg-gray-700 transition border border-gray-700 flex items-center justify-center"
          >
            <Send size={18} className="mr-2" />{t.telegram}
          </a>
        </div>
      </form>
    </div>
  );
}
