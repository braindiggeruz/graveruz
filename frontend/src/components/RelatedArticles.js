import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { ArticleValidator } from '../utils/articleValidator';

function toWordSet(value) {
  return new Set(
    String(value || '')
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .map((token) => token.trim())
      .filter((token) => token.length >= 3)
  );
}

function scoreByRelevance(currentArticle, article) {
  let score = 0;

  const currentTags = Array.isArray(currentArticle.tags) ? currentArticle.tags : [];
  const articleTags = Array.isArray(article.tags) ? article.tags : [];
  const commonTags = currentTags.filter((tag) => articleTags.includes(tag));
  score += commonTags.length * 3;

  if (currentArticle.category && article.category && currentArticle.category === article.category) {
    score += 2;
  }

  const currentWords = toWordSet(currentArticle.title);
  const articleWords = toWordSet(article.title);
  let commonWords = 0;
  currentWords.forEach((word) => {
    if (articleWords.has(word)) commonWords += 1;
  });
  score += commonWords;

  return score;
}

export default function RelatedArticles({ locale = 'ru', currentSlug, currentArticle, articles = [], limit = 3 }) {
  const normalizedArticles = ArticleValidator.sanitizeAllArticles(articles || []);
  const activeArticle = currentArticle || normalizedArticles.find((item) => item.slug === currentSlug) || null;

  if (!activeArticle) {
    return null;
  }

  const candidates = normalizedArticles
    .filter((item) => item && item.slug && item.slug !== activeArticle.slug)
    .filter((item) => ArticleValidator.validateArticle(item).isValid);

  const related = candidates
    .map((item) => ({ ...item, score: scoreByRelevance(activeArticle, item) }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);

  const fallback = candidates.slice(0, limit);
  const finalArticles = related.length ? related : fallback;

  if (!finalArticles.length) {
    return null;
  }

  const isRu = locale === 'ru';

  return React.createElement('div', {
    className: 'mt-12 p-6 bg-gray-900/50 border border-gray-800 rounded-xl',
    'data-testid': 'related-articles-section'
  },
    React.createElement('h3', { className: 'text-lg font-bold text-white mb-4 flex items-center gap-2' },
      React.createElement(BookOpen, { size: 18, className: 'text-teal-500' }),
      isRu ? 'Рекомендуемые статьи' : 'Tavsiya etiladigan maqolalar'
    ),
    React.createElement('div', { className: 'space-y-3' },
      finalArticles.map(function(article, idx) {
        const safeTitle = String(article.title || '').trim() || (isRu ? 'Без названия' : 'Nomsiz maqola');
        return React.createElement(Link, {
          key: article.slug || idx,
          to: '/' + locale + '/blog/' + article.slug,
          className: 'block text-teal-400 hover:text-teal-300 transition hover:underline'
        }, '→ ' + safeTitle);
      })
    )
  );
}
