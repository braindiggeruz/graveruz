#!/usr/bin/env node
/**
 * fix-prerendered-html.js
 *
 * Исправляет оборванные HTML-файлы в prerendered/ директории:
 * 1. Если в файле нет </head> — перемещает SEO-теги (canonical, hreflang, og, twitter)
 *    внутрь <head> и добавляет закрывающие теги </head>, <body>, </html>.
 * 2. Если </head> есть, но canonical/hreflang стоят ПОСЛЕ него — перемещает их внутрь.
 *
 * Этот скрипт запускается ОДИН РАЗ для починки существующих prerendered файлов.
 * В будущем react-snap должен генерировать полные HTML-документы.
 *
 * Запуск: node scripts/fix-prerendered-html.js
 */

const fs = require('fs');
const path = require('path');

const PRERENDERED_DIR = path.join(__dirname, '..', 'prerendered');

let fixed = 0;
let alreadyOk = 0;
let errors = 0;

function fixHtmlFile(filePath) {
  try {
    let html = fs.readFileSync(filePath, 'utf-8');
    const relPath = path.relative(PRERENDERED_DIR, filePath);

    const hasHeadClose = /<\/head>/i.test(html);
    const hasBodyClose = /<\/body>/i.test(html);
    const hasHtmlClose = /<\/html>/i.test(html);

    // Проверяем, есть ли canonical ПОСЛЕ </head>
    const headCloseIdx = html.search(/<\/head>/i);
    const canonicalIdx = html.search(/<link[^>]*rel=["']canonical["'][^>]*>/i);
    const canonicalAfterHead = hasHeadClose && canonicalIdx !== -1 && canonicalIdx > headCloseIdx;

    if (hasHeadClose && hasBodyClose && hasHtmlClose && !canonicalAfterHead) {
      alreadyOk++;
      return;
    }

    // Собираем SEO-теги, которые стоят вне <head>
    // (canonical, hreflang, og:*, twitter:*)
    const outsideTags = [];
    const outsideTagPatterns = [
      /<link[^>]*rel=["']canonical["'][^>]*\/?>/gi,
      /<link[^>]*rel=["']alternate["'][^>]*hreflang[^>]*\/?>/gi,
      /<meta[^>]*property=["']og:[^"']*["'][^>]*\/?>/gi,
      /<meta[^>]*name=["']twitter:[^"']*["'][^>]*\/?>/gi,
      /<meta[^>]*name=["']robots["'][^>]*\/?>/gi,
      /<meta[^>]*name=["']description["'][^>]*\/?>/gi,
    ];

    if (!hasHeadClose) {
      // Файл оборван — все SEO-теги уже в конце файла, нужно закрыть head
      // Находим последний мета-тег в файле
      const lastMetaMatch = html.match(/([\s\S]*?)(\s*)$/);
      
      // Добавляем закрывающие теги
      html = html.trimEnd() + '\n</head>\n<body>\n</body>\n</html>\n';
      console.log(`[fix-prerendered] ✓ ${relPath} — добавлены </head></body></html>`);
      fixed++;
    } else if (canonicalAfterHead) {
      // canonical и hreflang стоят ПОСЛЕ </head> — перемещаем их внутрь
      // Извлекаем все теги, стоящие после </head>
      const afterHead = html.slice(headCloseIdx + '</head>'.length);
      const tagsToMove = [];
      
      // Паттерны для извлечения тегов после </head>
      const extractPatterns = [
        /<link[^>]*rel=["']canonical["'][^>]*\/?>/gi,
        /<link[^>]*rel=["']alternate["'][^>]*hreflang[^>]*\/?>/gi,
        /<meta[^>]*property=["']og:[^"']*["'][^>]*\/?>/gi,
        /<meta[^>]*name=["']twitter:[^"']*["'][^>]*\/?>/gi,
      ];

      let afterHeadCleaned = afterHead;
      for (const pattern of extractPatterns) {
        const matches = afterHead.match(pattern) || [];
        for (const m of matches) {
          tagsToMove.push(m);
        }
        afterHeadCleaned = afterHeadCleaned.replace(pattern, '');
      }

      if (tagsToMove.length > 0) {
        const beforeHead = html.slice(0, headCloseIdx);
        html = beforeHead + '\n' + tagsToMove.join('\n') + '\n</head>' + afterHeadCleaned;
        console.log(`[fix-prerendered] ✓ ${relPath} — перемещено ${tagsToMove.length} тегов внутрь <head>`);
        fixed++;
      } else {
        alreadyOk++;
        return;
      }
    }

    // Убеждаемся, что </body> и </html> есть
    if (!/<\/body>/i.test(html)) {
      html = html.replace(/<\/html>/i, '</body>\n</html>');
      if (!/<\/html>/i.test(html)) {
        html = html.trimEnd() + '\n</body>\n</html>\n';
      }
    }
    if (!/<\/html>/i.test(html)) {
      html = html.trimEnd() + '\n</html>\n';
    }

    fs.writeFileSync(filePath, html, 'utf-8');

  } catch (err) {
    console.error(`[fix-prerendered] ✗ ${filePath}: ${err.message}`);
    errors++;
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name === 'index.html') {
      fixHtmlFile(fullPath);
    }
  }
}

console.log('[fix-prerendered] Начинаю исправление оборванных HTML-файлов...');
walkDir(PRERENDERED_DIR);
console.log(`\n[fix-prerendered] Готово: исправлено ${fixed}, уже OK ${alreadyOk}, ошибок ${errors}`);
