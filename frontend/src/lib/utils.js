import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num, locale = 'ru') {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)} ${locale === 'ru' ? 'млрд' : locale === 'uz' ? 'mlrd' : 'B'}`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(0)} ${locale === 'ru' ? 'млн' : locale === 'uz' ? 'mln' : 'M'}`;
  }
  if (num >= 1000) {
    return num.toLocaleString(locale === 'ru' ? 'ru-RU' : locale === 'uz' ? 'uz-UZ' : 'en-US');
  }
  return num.toString();
}

export function formatCurrency(amount, locale = 'ru') {
  const formatted = new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : locale === 'uz' ? 'uz-UZ' : 'en-US').format(amount);
  const suffix = locale === 'ru' ? 'сум' : locale === 'uz' ? "so'm" : 'sum';
  return `${formatted} ${suffix}`;
}

export function calculateLoanPayment(principal, annualRate, months) {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) {
    return principal / months;
  }
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(payment);
}

export function calculateTotalPayment(monthlyPayment, months) {
  return monthlyPayment * months;
}

export function calculateOverpayment(totalPayment, principal) {
  return totalPayment - principal;
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
