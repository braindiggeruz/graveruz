import ru from './ru.json';
import uz from './uz.json';
import type { Locale } from './config';

const translations = { ru, uz };

export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}

export function getTranslations(locale: Locale) {
  return translations[locale];
}
