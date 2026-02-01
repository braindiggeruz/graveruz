import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const location = useLocation();
  
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
      <Helmet>
        <title>404 — Страница не найдена | Graver.uz</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="prerender-status-code" content="404" />
        <meta name="description" content="Запрашиваемая страница не найдена. Вернитесь на главную страницу Graver.uz." />
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
            Страница не найдена
          </h2>
          <p className="text-lg text-gray-300 mb-2">Sahifa topilmadi</p>
          <p className="text-gray-400 mb-8">
            Запрашиваемая страница не существует или была перемещена.
            <br />
            <span className="text-gray-500 text-sm">So'ralgan sahifa mavjud emas yoki ko'chirilgan.</span>
          </p>
          
          {/* Path display */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-8">
            <p className="text-gray-500 text-sm mb-1">Запрошенный URL:</p>
            <code className="text-teal-400 text-sm break-all">{location.pathname}</code>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/ru" 
              className="inline-flex items-center justify-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition shadow-lg shadow-teal-500/30"
              data-testid="404-home-ru"
            >
              <Home className="mr-2" size={20} />
              На главную (RU)
            </Link>
            <Link 
              to="/uz" 
              className="inline-flex items-center justify-center bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition border border-gray-700"
              data-testid="404-home-uz"
            >
              <Home className="mr-2" size={20} />
              Bosh sahifa (UZ)
            </Link>
          </div>
          
          {/* Quick contact */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              Нужна помощь? Свяжитесь с нами:
            </p>
            <a 
              href="https://t.me/GraverAdm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-teal-500 hover:text-teal-400 font-medium"
            >
              @GraverAdm в Telegram
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
