import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, AlertTriangle } from 'lucide-react';
import SeoMeta from './SeoMeta';

export default function NotFound() {
  const location = useLocation();
  const pathLocale = location.pathname.split('/').filter(Boolean)[0];
  const isUz = pathLocale === 'uz';
  const copy = isUz ? {
    title: 'Sahifa topilmadi',
    description: "So'ralgan sahifa mavjud emas yoki ko'chirilgan.",
    requestedUrl: 'So\'ralgan URL:',
    homeCta: 'Bosh sahifa',
    help: 'Yordam kerakmi? Biz bilan bog\'laning:',
    telegramLabel: 'Telegram @GraverAdm'
  } : {
    title: 'Страница не найдена',
    description: 'Запрашиваемая страница не существует или была перемещена.',
    requestedUrl: 'Запрошенный URL:',
    homeCta: 'На главную',
    help: 'Нужна помощь? Свяжитесь с нами:',
    telegramLabel: '@GraverAdm в Telegram'
  };
  
  // Set document title and log 404 for analytics
  useEffect(() => {
    // Track 404 error
    if (window.gtag) {
      window.gtag('event', 'page_not_found', {
        page_path: location.pathname,
        page_location: window.location.href
      });
    }
    console.warn(`404 Not Found: ${location.pathname}`);
  }, [location.pathname]);

  return (
    <>
      <SeoMeta
        title={`404 — ${copy.title} | Graver.uz`}
        description={copy.description}
        locale={isUz ? 'uz' : 'ru'}
        noindex
      />
      <Helmet>
        <meta name="prerender-status-code" content="404" />
      </Helmet>
      
      <div className="min-h-screen bg-black flex items-center justify-center px-4" data-testid="not-found-page">
        <div className="text-center max-w-lg">
          {/* 404 Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={48} />
            </div>
          </div>
          
          <h1 className="text-7xl font-bold text-teal-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">
            {copy.title}
          </h2>
          <p className="text-gray-400 mb-8">
            {copy.description}
          </p>
          
          {/* Path display */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-8">
            <p className="text-gray-300 text-sm mb-1">{copy.requestedUrl}</p>
            <code className="text-teal-400 text-sm break-all">{location.pathname}</code>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={isUz ? '/uz' : '/ru'}
              className="inline-flex items-center justify-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition shadow-lg shadow-teal-500/30"
              data-testid={isUz ? '404-home-uz' : '404-home-ru'}
            >
              <Home className="mr-2" size={20} />
              {copy.homeCta}
            </Link>
          </div>
          
          {/* Quick contact */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm">{copy.help}</p>
            <a 
              href="https://t.me/GraverAdm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-teal-500 hover:text-teal-400 font-medium"
            >
              {copy.telegramLabel}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
