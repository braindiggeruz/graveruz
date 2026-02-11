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

// Route mapping for B2C pages (different slugs per locale)
const ROUTE_MAP = {
  'catalog-products': 'mahsulotlar-katalogi',
  'watches-with-logo': 'logotipli-soat',
  'lighters-engraving': 'gravirovkali-zajigalka',
  'engraved-gifts': 'gravirovkali-sovgalar'
};

// Reverse map for UZ -> RU
const ROUTE_MAP_REVERSE = Object.fromEntries(
  Object.entries(ROUTE_MAP).map(([ru, uz]) => [uz, ru])
);

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
    
    // Replace locale in current path with route mapping
    const currentPath = location.pathname;
    const hash = location.hash || '';
    const segments = currentPath.split('/').filter(Boolean);
    
    if (SUPPORTED_LOCALES.includes(segments[0])) {
      const oldLocale = segments[0];
      segments[0] = newLocale;
      
      // Map route slugs if switching between RU and UZ
      if (segments[1]) {
        if (oldLocale === 'ru' && newLocale === 'uz' && ROUTE_MAP[segments[1]]) {
          segments[1] = ROUTE_MAP[segments[1]];
        } else if (oldLocale === 'uz' && newLocale === 'ru' && ROUTE_MAP_REVERSE[segments[1]]) {
          segments[1] = ROUTE_MAP_REVERSE[segments[1]];
        }
      }
    } else {
      segments.unshift(newLocale);
    }
    
    navigate('/' + segments.join('/') + hash);
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
      return value.replace(/\{(\w+)\}/g, (_, param) => (params[param] != null ? params[param] : `{${param}}`));
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
