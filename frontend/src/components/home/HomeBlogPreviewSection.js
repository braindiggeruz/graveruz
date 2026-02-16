import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { getPostBySlug } from '../../data/blogPosts';

const homepageBlogSlugsRu = [
  'kak-vybrat-korporativnyj-podarok',
  'lazernaya-gravirovka-podarkov',
  'podarochnye-nabory-s-logotipom',
  'brendirovanie-suvenirov'
];

const homepageBlogSlugsUz = [
  'korporativ-sovgani-qanday-tanlash',
  'lazer-gravirovka-sovgalar',
  'logotipli-sovga-toplami',
  'suvenir-brendlash'
];

export default function HomeBlogPreviewSection({ locale }) {
  const activeLocale = locale || 'ru';

  return (
    <section className="py-16 bg-gray-900/50" data-testid="blog-preview-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <BookOpen size={24} className="text-teal-500" />
            {activeLocale === 'uz' ? 'Blogdan' : 'Из блога'}
          </h2>
          <Link
            to={`/${activeLocale}/blog`}
            className="text-teal-500 hover:text-teal-400 font-semibold text-sm transition"
          >
            {activeLocale === 'uz' ? "Barcha maqolalar →" : 'Все статьи →'}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(activeLocale === 'uz' ? homepageBlogSlugsUz : homepageBlogSlugsRu).map((slug, idx) => {
            const post = getPostBySlug(activeLocale, slug);
            if (!post) return null;
            return (
              <Link
                key={idx}
                to={`/${activeLocale}/blog/${slug}`}
                className="block bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-teal-500/50 transition group"
                data-testid={`homepage-blog-link-${idx + 1}`}
              >
                <h3 className="text-sm font-semibold text-white group-hover:text-teal-400 transition line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">{post.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
