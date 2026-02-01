import React from 'react';
import { useI18n } from '../i18n';

export default function LanguageSwitcher({ className = '' }) {
  const { locale, setLocale, supportedLocales } = useI18n();
  
  const localeLabels = {
    ru: 'RU',
    uz: 'UZ'
  };
  
  const localeFullLabels = {
    ru: 'Русский',
    uz: "O'zbekcha"
  };
  
  return (
    <div className={`flex items-center gap-1 ${className}`} data-testid="language-switcher">
      {supportedLocales.map((loc, index) => (
        <React.Fragment key={loc}>
          {index > 0 && <span className="text-gray-600 text-sm">/</span>}
          <button
            onClick={() => setLocale(loc)}
            className={`text-sm font-medium transition-colors px-1 ${
              locale === loc 
                ? 'text-teal-500' 
                : 'text-gray-400 hover:text-white'
            }`}
            title={localeFullLabels[loc]}
            data-testid={`lang-switch-${loc}`}
            aria-label={`Switch to ${localeFullLabels[loc]}`}
            aria-current={locale === loc ? 'true' : undefined}
          >
            {localeLabels[loc]}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
