import React from 'react';
import { ChevronDown } from 'lucide-react';

const portfolioItems = [
  {
    id: 1,
    image: '/portfolio/1.webp',
    imageFallback: '/portfolio/1.png',
    alt: 'Премиальная корпоративная награда с лазерной гравировкой для партнёров',
    width: 1376,
    height: 768
  },
  {
    id: 2,
    image: '/portfolio/10.webp',
    imageFallback: '/portfolio/10.png',
    alt: 'Премиальные часы с персональной гравировкой для руководителей',
    width: 1408,
    height: 768
  },
  {
    id: 3,
    image: '/portfolio/3.webp',
    imageFallback: '/portfolio/3.png',
    alt: 'Брендированные термосы с логотипом компании для сотрудников',
    width: 1376,
    height: 768
  },
  {
    id: 4,
    image: '/portfolio/4.webp',
    imageFallback: '/portfolio/4.png',
    alt: 'Эксклюзивный подарочный набор с брендированием для VIP-клиентов',
    width: 1408,
    height: 768
  },
  {
    id: 5,
    image: '/portfolio/5.webp',
    imageFallback: '/portfolio/5.png',
    alt: 'Премиальная корпоративная упаковка с логотипом для мероприятий',
    width: 1200,
    height: 896
  },
  {
    id: 6,
    image: '/portfolio/6.webp',
    imageFallback: '/portfolio/6.png',
    alt: 'Эксклюзивная премиальная награда из стекла и металла',
    width: 1200,
    height: 896
  }
];

export default function HomePortfolioSection({ t, scrollToSection }) {
  return (
    <section className="py-20 bg-gray-900" id="portfolio" data-testid="portfolio-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('portfolio.title')} <span className="text-teal-500">{t('portfolio.titleAccent')}</span>
          </h2>
          <p className="text-xl text-gray-400">
            {t('portfolio.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <div key={item.id} className="group relative bg-black/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-teal-500/50 transition" data-testid={`portfolio-item-${index + 1}`}>
              <div className="aspect-square overflow-hidden bg-gray-800">
                <picture>
                  <source srcSet={item.image} type="image/webp" />
                  <img
                    src={item.imageFallback}
                    alt={item.alt}
                    loading="lazy"
                    width={item.width}
                    height={item.height}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500"><div class="text-center"><p class="text-sm">Изображение загружается...</p></div></div>';
                    }}
                  />
                </picture>
              </div>
              <div className="p-6">
                <span className="text-teal-500 text-sm font-semibold">{t(`portfolio.items.${item.id}.category`)}</span>
                <h3 className="text-xl font-bold text-white mt-2 mb-3">{t(`portfolio.items.${item.id}.title`)}</h3>
                <p className="text-gray-400 text-sm mb-4">{t(`portfolio.items.${item.id}.description`)}</p>
                  <div className="space-y-2 text-xs text-gray-300">
                    <div><span className="text-gray-300">{t('portfolio.material')}:</span> {t(`portfolio.items.${item.id}.material`)}</div>
                    <div><span className="text-gray-300">{t('portfolio.application')}:</span> {t(`portfolio.items.${item.id}.application`)}</div>
                </div>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="inline-flex items-center mt-4 text-teal-500 hover:text-teal-400 font-semibold text-sm group/link"
                  data-testid={`portfolio-cta-${index + 1}`}
                >
                  {t('portfolio.cta')}
                  <ChevronDown className="ml-2 rotate-[-90deg] group-hover/link:translate-x-1 transition-transform" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
