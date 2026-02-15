import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Clock } from 'lucide-react';

function toWebpVariant(src, size) {
  if (!src || typeof src !== 'string') return '';
  const normalized = src.replace(/^\/+/, '');
  if (!normalized.startsWith('images/blog/')) return '';
  const fileName = normalized.slice('images/blog/'.length);
  const dotIndex = fileName.lastIndexOf('.');
  if (dotIndex === -1) return '';
  const baseName = fileName.slice(0, dotIndex);
  return `/images/blog-webp/${baseName}-${size}.webp`;
}

/**
 * BlogCard - Улучшенная карточка статьи с изображением
 * 
 * @param {Object} post - Объект статьи
 * @param {string} post.slug - URL slug статьи
 * @param {string} post.title - Заголовок статьи
 * @param {string} post.description - Описание статьи
 * @param {string} post.date - Дата публикации
 * @param {string} post.image - Путь к изображению обложки
 * @param {string} post.category - Категория статьи
 * @param {number} post.readTime - Время чтения в минутах
 * @param {string} locale - Текущая локаль (ru/uz)
 * @param {boolean} isRu - Флаг русского языка
 */
export default function BlogCard({ post, locale, isRu }) {
  const webpSmall = toWebpVariant(post.image, 'small');
  const webpMedium = toWebpVariant(post.image, 'medium');
  const webpLarge = toWebpVariant(post.image, 'large');

  return (
    <Link
      to={`/${locale}/blog/${post.slug}`}
      className="block group"
    >
      <article className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gray-800">
          {post.image ? (
            <picture>
              <source
                type="image/webp"
                srcSet={`${webpSmall} 640w, ${webpMedium} 1280w, ${webpLarge} 1920w`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </picture>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-900/20 to-cyan-900/20">
              <span className="text-6xl text-teal-500/20">G</span>
            </div>
          )}
          
          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-3 left-3">
              <span className="bg-teal-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-6">
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </time>
            </div>
            
            {post.readTime && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{post.readTime} {isRu ? 'мин' : 'daqiqa'}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-white group-hover:text-teal-500 transition-colors mb-3 line-clamp-2">
            {post.title}
          </h2>

          {/* Description */}
          <p className="text-gray-400 mb-4 line-clamp-2">
            {post.description}
          </p>

          {/* Read More Link */}
          <div className="flex items-center text-teal-500 font-semibold group-hover:translate-x-1 transition-transform">
            <span>{isRu ? 'Читать статью' : "Maqolani o'qish"}</span>
            <ChevronRight size={16} className="ml-1" />
          </div>
        </div>
      </article>
    </Link>
  );
}
