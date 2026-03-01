#!/usr/bin/env node

/**
 * fix-prerendered-seo.js
 * 
 * Обновляет prerendered HTML файлы с правильными title/description из blogSeoOverrides.js
 * Это исправляет проблему, когда react-snap генерирует prerendered файлы с generic title
 */

const fs = require('fs');
const path = require('path');

// Импортируем SEO данные
const seoOverridesPath = path.join(__dirname, '..', 'src', 'data', 'blogSeoOverrides.js');
let blogSeoOverrides = {};

try {
  const content = fs.readFileSync(seoOverridesPath, 'utf8');
  // Парсим export из файла - ищем объект после "export const blogSeoOverrides = "
  const startIdx = content.indexOf('export const blogSeoOverrides = {');
  if (startIdx !== -1) {
    // Находим конец объекта
    let braceCount = 0;
    let inString = false;
    let stringChar = '';
    let endIdx = startIdx + 'export const blogSeoOverrides = '.length;
    
    for (let i = endIdx; i < content.length; i++) {
      const char = content[i];
      
      // Обрабатываем строки
      if ((char === '"' || char === "'" || char === '`') && (i === 0 || content[i-1] !== '\\')) {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
      }
      
      // Считаем скобки только вне строк
      if (!inString) {
        if (char === '{') braceCount++;
        if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIdx = i + 1;
            break;
          }
        }
      }
    }
    
    const objStr = content.substring(startIdx + 'export const blogSeoOverrides = '.length, endIdx);
    try {
      blogSeoOverrides = eval(`(${objStr})`);
    } catch (e) {
      console.warn('[fix-prerendered-seo] Failed to parse object:', e.message);
    }
  }
} catch (e) {
  console.warn('[fix-prerendered-seo] Failed to load blogSeoOverrides.js:', e.message);
}

const PRERENDERED_DIR = path.join(__dirname, '..', 'prerendered');

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, (c) => map[c]);
}

function updateHtmlFile(filePath, slug, locale) {
  try {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Получаем SEO данные для этого slug
    const seoData = blogSeoOverrides[slug];
    if (!seoData) {
      console.log(`[fix-prerendered-seo] ⊘ ${slug} — нет SEO данных`);
      return;
    }
    
    const title = locale === 'uz' && seoData.titleUz ? seoData.titleUz : seoData.title;
    const description = locale === 'uz' && seoData.descriptionUz ? seoData.descriptionUz : seoData.description;
    
    // Заменяем title
    const newTitle = `<title>${escapeHtml(title)}</title>`;
    html = html.replace(/<title[^>]*>[^<]*<\/title>/, newTitle);
    
    // Заменяем description
    const newDescription = `<meta name="description" content="${escapeHtml(description)}" />`;
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, newDescription);
    
    // Заменяем og:title
    const newOgTitle = `<meta property="og:title" content="${escapeHtml(title)}" />`;
    if (/<meta\s+property=["']og:title["']/i.test(html)) {
      html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, newOgTitle);
    } else {
      html = html.replace(/<\/head>/, `${newOgTitle}\n</head>`);
    }
    
    // Заменяем og:description
    const newOgDescription = `<meta property="og:description" content="${escapeHtml(description)}" />`;
    if (/<meta\s+property=["']og:description["']/i.test(html)) {
      html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, newOgDescription);
    } else {
      html = html.replace(/<\/head>/, `${newOgDescription}\n</head>`);
    }
    
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`[fix-prerendered-seo] ✓ ${slug} — обновлен`);
  } catch (e) {
    console.error(`[fix-prerendered-seo] ERROR updating ${filePath}:`, e.message);
  }
}

// Обходим все prerendered HTML файлы
function processPrerenderedFiles(dir, locale) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Рекурсивно обходим подпапки
      processPrerenderedFiles(fullPath, locale);
    } else if (entry.name === 'index.html') {
      // Получаем slug из пути
      const relativePath = path.relative(PRERENDERED_DIR, fullPath);
      const parts = relativePath.split(path.sep);
      
      // Пропускаем корневые файлы и специальные папки
      if (parts.length < 3 || parts[0] === '404') {
        continue;
      }
      
      // Для блог статей: parts = ['ru', 'blog', 'slug', 'index.html']
      if (parts[0] === locale && parts[1] === 'blog' && parts.length === 3) {
        const slug = parts[2];
        updateHtmlFile(fullPath, slug, locale);
      }
    }
  }
}

console.log('[fix-prerendered-seo] Обновляю prerendered HTML файлы с правильными title/description...');

// Обновляем русские файлы
processPrerenderedFiles(path.join(PRERENDERED_DIR, 'ru'), 'ru');

// Обновляем узбекские файлы
processPrerenderedFiles(path.join(PRERENDERED_DIR, 'uz'), 'uz');

console.log('[fix-prerendered-seo] Готово!');
