import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function WatchesWithLogoPage() {
  const { locale = 'ru' } = useParams();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black/95 border-b border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-2xl font-bold text-white">Graver<span className="text-teal-500">.uz</span></span>
          </Link>
        </div>
      </header>
      <nav className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link to={`/${locale}`} className="text-gray-400 hover:text-teal-500">Главная</Link></li>
            <li className="text-gray-600">/</li>
            <li><Link to={`/${locale}/catalog-products`} className="text-gray-400 hover:text-teal-500">Продукция</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-teal-500">Часы с логотипом</li>
          </ol>
        </div>
      </nav>
      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Часы с логотипом и гравировкой</h1>
          <p className="text-lg text-gray-400">Наши модели — сначала макет, потом нанесение</p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <img src="/images/products/neo-watch-hero.jpg" alt="Часы с логотипом" className="w-full rounded-lg" />
        </div>
      </section>
    </div>
  );
}
