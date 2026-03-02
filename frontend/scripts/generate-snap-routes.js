/**
 * generate-snap-routes.js
 *
 * Автоматически генерирует список маршрутов для react-snap (package.json → reactSnap.include)
 * на основе реальных данных из blogPosts.js.
 *
 * Запускается как prebuild-шаг: перед каждой сборкой package.json обновляется
 * актуальным списком всех статических и блог-маршрутов.
 *
 * ЗАЧЕМ:
 * - Ручной список в package.json включал только 16 из 110+ статей блога
 * - Новые статьи добавляются в blogPosts.js, но не попадали в пререндер
 * - Этот скрипт решает проблему раз и навсегда
 *
 * ИСКЛЮЧЕНИЯ:
 * - /404 исключён: react-snap падает с таймаутом на этой странице
 * - /thanks исключён: страница благодарности не нужна в пререндере
 * - redirect-only маршруты исключены (они не рендерят контент)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const PACKAGE_JSON_PATH = path.resolve(__dirname, '..', 'package.json');
const BLOG_POSTS_PATH = path.resolve(__dirname, '..', 'src', 'data', 'blogPosts.js');

// Статические маршруты, которые должны быть пререндерены.
// Порядок: сначала корневые, потом RU, потом UZ.
const STATIC_ROUTES = [
  // Root
  '/',
  // RU — основные страницы
  '/ru',
  '/ru/process',
  '/ru/guarantees',
  '/ru/contacts',
  '/ru/catalog-products',
  '/ru/watches-with-logo',
  '/ru/products/lighters',
  '/ru/engraved-gifts',
  '/ru/products/neo-watches',
  '/ru/products/neo-corporate',
  '/ru/products/neo-gift',
  // UZ — основные страницы
  '/uz',
  '/uz/process',
  '/uz/guarantees',
  '/uz/contacts',
  '/uz/mahsulotlar-katalogi',
  '/uz/logotipli-soat',
  '/uz/products/lighters',
  '/uz/gravirovkali-sovgalar',
  '/uz/neo-soatlar',
  '/uz/neo-korporativ',
  '/uz/neo-sovga',
  // Blog index
  '/ru/blog',
  '/uz/blog',
];

// Маршруты, которые намеренно исключены из пререндера:
// - /404: react-snap падает с таймаутом (кастомная 404-страница не отвечает вовремя)
// - /thanks: страница после отправки формы, не нужна в пререндере
const EXCLUDED_ROUTES = new Set(['/404', '/ru/thanks', '/uz/thanks', '/thanks']);

async function main() {
  // Динамический импорт ES-модуля blogPosts.js
  const blogModule = await import(pathToFileURL(BLOG_POSTS_PATH).href);
  const blogPosts = blogModule.blogPosts;

  if (!blogPosts || !blogPosts.ru || !blogPosts.uz) {
    console.error('[generate-snap-routes] ERROR: blogPosts not found or invalid structure');
    process.exit(1);
  }

  const ruBlogRoutes = blogPosts.ru.map(p => `/ru/blog/${p.slug}`);
  const uzBlogRoutes = blogPosts.uz.map(p => `/uz/blog/${p.slug}`);

  const allRoutes = [
    ...STATIC_ROUTES,
    ...ruBlogRoutes,
    ...uzBlogRoutes,
  ].filter(route => !EXCLUDED_ROUTES.has(route));

  // Дедупликация на случай дублей в данных
  const uniqueRoutes = [...new Set(allRoutes)];

  // Читаем и обновляем package.json
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  const prevCount = packageJson.reactSnap.include ? packageJson.reactSnap.include.length : 0;
  packageJson.reactSnap.include = uniqueRoutes;

  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');

  console.log(`[generate-snap-routes] ✅ Updated reactSnap.include:`);
  console.log(`   Static routes:  ${STATIC_ROUTES.length}`);
  console.log(`   RU blog routes: ${ruBlogRoutes.length}`);
  console.log(`   UZ blog routes: ${uzBlogRoutes.length}`);
  console.log(`   Total (unique): ${uniqueRoutes.length} (was: ${prevCount})`);
}

main().catch(err => {
  console.error('[generate-snap-routes] FATAL:', err.message || err);
  process.exit(1);
});
