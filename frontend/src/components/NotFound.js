import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-teal-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Страница не найдена / Sahifa topilmadi
        </h2>
        <p className="text-gray-400 mb-8">
          Запрашиваемая страница не существует или была перемещена.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/ru" 
            className="inline-flex items-center justify-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition"
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
      </div>
    </div>
  );
}
