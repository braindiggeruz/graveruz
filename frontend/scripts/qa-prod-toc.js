// frontend/scripts/qa-prod-toc.js
// Headless QA: Проверка наличия TOC и якорей на проде
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const url = 'https://graver-studio.uz/ru/blog/polniy-gid-po-korporativnym-podarkam/';
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // Ждём появления "Оглавление" (до 20s)
  await page.waitForFunction(
    () => !!document.body.innerText.match(/Оглавление/),
    { timeout: 20000 }
  ).catch(() => {});

  // Метрики
  const result = await page.evaluate(() => {
    const tocUl = document.querySelector('ul.toc');
    const tocLinks = tocUl ? tocUl.querySelectorAll('a[href^="#"]') : [];
    const headings = Array.from(document.querySelectorAll('h2[id], h3[id]'));
    const tocPreview = tocUl ? Array.from(tocUl.querySelectorAll('li')).slice(0, 10).map(li => {
      const a = li.querySelector('a');
      return a ? { text: a.textContent, href: a.getAttribute('href') } : { text: li.textContent, href: null };
    }) : [];
    return {
      hasTocUl: !!tocUl,
      tocLinksCount: tocLinks.length,
      headingsWithId: headings.length,
      tocPreview
    };
  });

  // Скриншот
  const screenshotPath = '_qa_prod_toc.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await browser.close();

  // Запись результата
  fs.writeFileSync('_qa_prod_toc.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
})();
