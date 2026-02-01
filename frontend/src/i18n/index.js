import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import ruTranslations from './ru.json';
import uzTranslations from './uz.json';

const translations = {
  ru: ruTranslations,
  uz: uzTranslations
};

const SUPPORTED_LOCALES = ['ru', 'uz'];
const DEFAULT_LOCALE = 'ru';

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract locale from URL path
  const getLocaleFromPath = (pathname) => {
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    return SUPPORTED_LOCALES.includes(firstSegment) ? firstSegment : null;
  };
  
  const pathLocale = getLocaleFromPath(location.pathname);
  const [locale, setLocaleState] = useState(pathLocale || DEFAULT_LOCALE);
  
  // Redirect only root "/" to default locale
  useEffect(() => {
    if (location.pathname === '/') {
      const savedLocale = localStorage.getItem('graver-locale') || DEFAULT_LOCALE;
      navigate(`/${savedLocale}`, { replace: true });
    }
  }, [location.pathname, navigate]);
  
  // Update locale when path changes
  useEffect(() => {
    if (pathLocale && pathLocale !== locale) {
      setLocaleState(pathLocale);
      localStorage.setItem('graver-locale', pathLocale);
    }
  }, [pathLocale, locale]);
  
  const setLocale = (newLocale) => {
    if (!SUPPORTED_LOCALES.includes(newLocale)) return;
    
    localStorage.setItem('graver-locale', newLocale);
    
    // Replace locale in current path
    const currentPath = location.pathname;
    const segments = currentPath.split('/').filter(Boolean);
    
    if (SUPPORTED_LOCALES.includes(segments[0])) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    
    navigate('/' + segments.join('/'));
  };
  
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[locale];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation missing: ${key} for locale ${locale}`);
        return key;
      }
    }
    
    // Replace params like {seconds} with actual values
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{(\w+)\}/g, (_, param) => params[param] ?? `{${param}}`);
    }
    
    return value;
  };
  
  // Get path without locale prefix
  const getPathWithoutLocale = (pathname) => {
    const segments = pathname.split('/').filter(Boolean);
    if (SUPPORTED_LOCALES.includes(segments[0])) {
      return '/' + segments.slice(1).join('/');
    }
    return pathname;
  };
  
  // Get localized path
  const getLocalizedPath = (path, targetLocale = locale) => {
    const cleanPath = getPathWithoutLocale(path);
    return `/${targetLocale}${cleanPath === '/' ? '' : cleanPath}`;
  };
  
  const value = {
    locale,
    setLocale,
    t,
    supportedLocales: SUPPORTED_LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    getLocalizedPath,
    getPathWithoutLocale
  };
  
  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

export { SUPPORTED_LOCALES, DEFAULT_LOCALE };
