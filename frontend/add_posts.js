const fs = require('fs');

// Пути к файлам
const blogPostsPath = './src/data/blogPosts.js';
const march8DataPath = '/tmp/march8-data.js';

// Читаем основной файл с постами
let blogPostsContent = fs.readFileSync(blogPostsPath, 'utf8');

// Читаем файл с новыми статьями
const march8Articles = require(march8DataPath);
const newRuPosts = march8Articles.ru;
const newUzPosts = march8Articles.uz;

// Проверяем, что данные загрузились
if (!newRuPosts || !newUzPosts) {
  console.error('Не удалось загрузить данные статей из march8-data.js');
  process.exit(1);
}

// Превращаем массивы объектов в строки
const ruPostsString = JSON.stringify(newRuPosts, null, 2).slice(1, -1).trim() + ',';
const uzPostsString = JSON.stringify(newUzPosts, null, 2).slice(1, -1).trim() + ',';

// Вставляем новые статьи в основной файл
blogPostsContent = blogPostsContent.replace(/(\s*ru:\s*\[)/, `$1\n${ruPostsString}`);
blogPostsContent = blogPostsContent.replace(/(\s*uz:\s*\[)/, `$1\n${uzPostsString}`);

// Сохраняем измененный файл
fs.writeFileSync(blogPostsPath, blogPostsContent);

console.log('10 статей успешно добавлены в src/data/blogPosts.js');
