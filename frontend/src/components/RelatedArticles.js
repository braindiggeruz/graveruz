import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function RelatedArticles({ locale = 'ru', currentSlug, articles = [], limit = 3 }) {
  const related = (articles || [])
    .filter(function(article) {
      return article && article.slug && article.slug !== currentSlug;
    })
    .slice(0, limit);

  if (!related.length) {
    return null;
  }

  const isRu = locale === 'ru';

  return React.createElement('div', {
    className: 'mt-12 p-6 bg-gray-900/50 border border-gray-800 rounded-xl',
    'data-testid': 'related-articles-section'
  },
    React.createElement('h3', { className: 'text-lg font-bold text-white mb-4 flex items-center gap-2' },
      React.createElement(BookOpen, { size: 18, className: 'text-teal-500' }),
      isRu ? 'Рекомендуем прочитать' : 'Tavsiya etamiz'
    ),
    React.createElement('div', { className: 'space-y-3' },
      related.map(function(article, idx) {
        return React.createElement(Link, {
          key: article.slug || idx,
          to: '/' + locale + '/blog/' + article.slug,
          className: 'block text-teal-400 hover:text-teal-300 transition hover:underline'
        }, '→ ' + article.title);
      })
    )
  );
}
