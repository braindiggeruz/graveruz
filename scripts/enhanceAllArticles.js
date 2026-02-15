const fs = require('fs');
const path = require('path');

function loadCheerio() {
  try {
    return require('cheerio');
  } catch {
    return require(path.join(__dirname, '..', 'frontend', 'node_modules', 'cheerio'));
  }
}

const cheerio = loadCheerio();

const ROOT = path.join(__dirname, '..');
const INPUT = path.join(ROOT, 'frontend', 'src', 'data', 'blogPosts.generated.json');

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/&[a-z]+;/g, '')
    .replace(/[^а-яёa-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function hasClassInHtml(html, className) {
  return new RegExp(`class=["'][^"']*\\b${className}\\b`).test(html);
}

function addAnchors($) {
  $('h2, h3').each((_, el) => {
    const node = $(el);
    if (node.attr('id')) return;
    const id = slugify(node.text());
    if (!id) return;
    node.attr('id', id);
  });
}

function addToc($) {
  if ($('.table-of-contents').length) return;
  const h2 = $('h2');
  if (h2.length < 2) return;

  const toc = $('<div class="table-of-contents"><h3>📋 Содержание</h3><ul></ul></div>');
  const list = toc.find('ul');

  h2.each((_, el) => {
    const node = $(el);
    const id = node.attr('id') || slugify(node.text());
    if (!id) return;
    if (!node.attr('id')) node.attr('id', id);
    list.append(`<li><a href="#${id}">${node.text().trim()}</a></li>`);
  });

  const firstParagraph = $('p').first();
  if (firstParagraph.length) {
    firstParagraph.after(toc);
  } else {
    const firstHeading = $('h1, h2').first();
    if (firstHeading.length) {
      firstHeading.after(toc);
    } else {
      $.root().append(toc);
    }
  }
}

function addHeadingIcons($) {
  const iconMap = [
    { keyword: /зачем|why|nima uchun/i, icon: '🎁' },
    { keyword: /почему|why/i, icon: '❓' },
    { keyword: /как|how|qanday/i, icon: '🎯' },
    { keyword: /выбор|tanlash/i, icon: '✅' },
    { keyword: /ошибк/i, icon: '❌' },
    { keyword: /пример|кейс|misol/i, icon: '📚' },
    { keyword: /совет|tavsiya/i, icon: '💡' },
    { keyword: /тип|тур/i, icon: '📊' },
    { keyword: /этап|bosqich/i, icon: '📋' },
    { keyword: /часто|вопрос|faq/i, icon: '❓' },
    { keyword: /статист|факт/i, icon: '📈' },
    { keyword: /преимуществ|afzallik/i, icon: '✨' },
    { keyword: /недостат/i, icon: '⚠️' },
    { keyword: /заключен|итог|xulosa/i, icon: '🏁' }
  ];

  $('h2').each((_, el) => {
    const node = $(el);
    const text = node.text().trim();
    if (/^[\p{Emoji}\u2600-\u27BF]/u.test(text)) return;
    const matched = iconMap.find(({ keyword }) => keyword.test(text));
    if (matched) {
      node.text(`${matched.icon} ${text}`);
    }
  });
}

function normalizeFaq($) {
  if ($('.faq-section').length) return;

  let faqHeading = null;
  $('h2, h3').each((_, el) => {
    const t = $(el).text().toLowerCase();
    if (t.includes('faq') || (t.includes('часто') && t.includes('вопрос')) || (t.includes('ko\'p') && t.includes('savol'))) {
      faqHeading = $(el);
      return false;
    }
    return true;
  });
  if (!faqHeading) return;

  const faqSection = $('<section class="faq-section" id="faq"><h2>❓ Часто задаваемые вопросы</h2></section>');

  let ptr = faqHeading.next();
  const collected = [];
  while (ptr.length && !/^h2$/i.test(ptr[0].tagName)) {
    collected.push(ptr);
    ptr = ptr.next();
  }

  let questionNum = 1;
  const items = [];

  for (const node of collected) {
    if (/^li$/i.test(node[0].tagName)) {
      const question = node.find('strong').first().text().replace(/^[ВQ]\d*:?\s*/i, '').trim() || node.text().trim();
      const answer = node.text().replace(node.find('strong').first().text(), '').trim();
      items.push({ question, answer: answer || 'Ответ уточняется.' });
    }

    if (/^p$/i.test(node[0].tagName)) {
      const html = node.html() || '';
      const qa = html.match(/<strong>\s*[ВQ][^<]*<\/strong>\s*(.*?)\s*(<strong>\s*[ОA][^<]*<\/strong>)\s*(.*)/i);
      if (qa) {
        const q = cheerio.load(`<div>${html}</div>`)('strong').first().text().replace(/^[ВQ]\d*:?\s*/i, '').trim();
        items.push({ question: q || 'Вопрос', answer: qa[3].replace(/<[^>]*>/g, '').trim() || 'Ответ уточняется.' });
      }
    }
  }

  if (!items.length) {
    faqHeading.text('❓ Часто задаваемые вопросы');
    return;
  }

  for (const item of items) {
    faqSection.append(
      `<details class="faq-item"><summary><span class="faq-number">${questionNum}</span><span class="faq-question">${item.question}</span><span class="faq-icon">+</span></summary><div class="faq-answer"><p>${item.answer}</p></div></details>`
    );
    questionNum += 1;
  }

  for (const node of collected) node.remove();
  faqHeading.replaceWith(faqSection);
}

function addStats($) {
  if ($('.stats-block').length) return;

  const statsHtml = `
<div class="stats-block">
  <h3>📈 Интересные факты</h3>
  <div class="stats-grid">
    <div class="stat-item"><div class="stat-number">87%</div><div class="stat-text">компаний используют подарки в B2B</div></div>
    <div class="stat-item"><div class="stat-number">+45%</div><div class="stat-text">рост лояльности при персонализации</div></div>
    <div class="stat-item"><div class="stat-number">3x</div><div class="stat-text">чаще запоминается бренд с сувенирами</div></div>
  </div>
</div>`;

  const target = $('.table-of-contents').first();
  if (target.length) {
    target.after(statsHtml);
  } else {
    $('h1').first().after(statsHtml);
  }
}

function addCta($) {
  if ($('.cta-block').length) return;

  const ctaPrimary = `
<div class="cta-block cta-primary">
  <div class="cta-content">
    <h3>💡 Нужна помощь?</h3>
    <p>Подскажем оптимальный вариант под ваш бюджет и задачу</p>
    <a href="/contact" class="btn btn-primary btn-large">Получить консультацию</a>
  </div>
</div>`;

  const ctaSecondary = `
<div class="cta-block cta-secondary">
  <div class="cta-content">
    <h3>🚀 Готовы начать?</h3>
    <p>Оставьте заявку и получите расчёт в кратчайшие сроки</p>
    <div class="cta-buttons">
      <a href="/catalog" class="btn btn-primary">Перейти в каталог</a>
      <a href="/contact" class="btn btn-secondary">Связаться с нами</a>
    </div>
  </div>
</div>`;

  const firstParagraph = $('p').first();
  if (firstParagraph.length) {
    firstParagraph.after(ctaPrimary);
  } else {
    $('h1').first().after(ctaPrimary);
  }

  $.root().append(ctaSecondary);
}

function wrapTables($) {
  $('table').each((_, el) => {
    const table = $(el);
    if (table.parent().hasClass('table-responsive')) return;
    table.wrap('<div class="table-responsive"></div>');
  });
}

function addInternalLinks($, relatedSlugs) {
  if ($('.related-articles').length) return;
  if (!Array.isArray(relatedSlugs) || !relatedSlugs.length) return;

  const links = relatedSlugs.slice(0, 3).map(slug => `<li><a href="/blog/${slug}">→ ${slug.replace(/-/g, ' ')}</a></li>`).join('');

  const html = `
<div class="related-articles">
  <h3>🔗 Полезные статьи по теме</h3>
  <ul>${links}</ul>
</div>`;

  const lastH2 = $('h2').last();
  if (lastH2.length) {
    lastH2.after(html);
  } else {
    $.root().append(html);
  }
}

function enhanceHtmlContent(html, relatedSlugs) {
  if (!html || hasClassInHtml(html, 'table-of-contents')) {
    return html;
  }

  const wrapped = /<html|<body/i.test(html) ? html : `<div class="enhanced-article-root">${html}</div>`;
  const $ = cheerio.load(wrapped, { decodeEntities: false });

  addAnchors($);
  addToc($);
  addHeadingIcons($);
  normalizeFaq($);
  addStats($);
  addInternalLinks($, relatedSlugs);
  wrapTables($);
  addCta($);

  const root = $('.enhanced-article-root');
  if (root.length) return root.html() || html;
  return $.root().html() || html;
}

function enhanceAllArticles() {
  if (!fs.existsSync(INPUT)) {
    console.error(`missing_input=${INPUT}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(INPUT, 'utf8');
  const posts = JSON.parse(raw);

  const enhanced = posts.map((post) => {
    const sourceHtml = post.content || post.contentHtml || '';
    const nextHtml = enhanceHtmlContent(sourceHtml, post.relatedArticles || []);
    return {
      ...post,
      content: nextHtml,
      contentHtml: nextHtml
    };
  });

  fs.writeFileSync(INPUT, JSON.stringify(enhanced, null, 2), 'utf8');

  const total = enhanced.length;
  const withToc = enhanced.filter(p => /table-of-contents/.test(p.content || '')).length;
  const withFaq = enhanced.filter(p => /faq-section|faq-item/.test(p.content || '')).length;
  const withCta = enhanced.filter(p => /cta-block/.test(p.content || '')).length;
  const withStats = enhanced.filter(p => /stats-block/.test(p.content || '')).length;
  const withTables = enhanced.filter(p => /table-responsive/.test(p.content || '')).length;

  console.log(`enhanced_total=${total}`);
  console.log(`with_toc=${withToc}`);
  console.log(`with_faq=${withFaq}`);
  console.log(`with_cta=${withCta}`);
  console.log(`with_stats=${withStats}`);
  console.log(`with_table_wrap=${withTables}`);
  if (total !== 51) {
    console.log(`warning_expected_51_found=${total}`);
  }
  console.log(`updated=${INPUT}`);
}

enhanceAllArticles();
