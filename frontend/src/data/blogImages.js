const defaultBlogCover = '/images/blog/default-og.jpg';
const blogCardImageBySlug = {
  'polniy-gid-po-korporativnym-podarkam': '/images/blog/article-1-og.jpg',
  'brendirovanie-suvenirov': '/images/blog/souvenir-branding-ru.png',
  'brendirovannye-zazhigalki-i-chasy-s-logotipom': '/images/blog/article-16.png',
  'chasy-s-logotipom-korporativnye-podarki-tashkent': '/images/blog/corporate-gifts-roi-article.png',
  'chek-list-zakupshchika-podarkov': '/images/blog/article-14.png',
  'ekonomiya-na-korporativnyh-suvenirax': '/images/blog/corporate-souvenirs-economy.png',
  'kak-podgotovit-maket-logotipa': '/images/blog/logo-layout-article.png',
  'kak-vybrat-korporativnyj-podarok': '/images/blog/corporate-gift-article.png',
  'kompaniya-merchi-brendlash': '/images/blog/corporate-gifting-trends-2026-uz.png',
  'korporativnye-podarki-na-navruz': '/images/blog/corporate-gifts-23-february.png',
  'korporativnye-podarki-s-gravirovkoy-metody': '/images/blog/gravirovka-guide.png',
  'korporativnye-podarki-s-logotipom-polnyy-gayd': '/images/blog/corporate-gifts-article.png',
  'korporativnye-podarochnye-nabory': '/images/blog/gift-packaging-article.png',
  'korporativ-sovgalar-gravyurasi-usullari': '/images/blog/article-22.png',
  'korporativ-sovgalar-logotip-bilan-to-liq-qollanma': '/images/blog/corporate-gifts-uz.png',
  'korporativ-sovgani-qanday-tanlash': '/images/blog/korporativ-sovg-ani-qanday-tanlash-kerak.png',
  'korporativ-sovga-toplamlari': '/images/blog/article-content.png',
  'lazer-gravirovka-sovgalar': '/images/blog/article-27.png',
  'lazer-gravyurasi-texnologiyasi': '/images/blog/oymakorlik-materiallari.png',
  'lazer-gravirovka-sovgalar-tehnologiyasi': '/images/blog/oymakorlik-materiallari.png',
  'lazernaya-gravirovka-podarkov': '/images/blog/laser-engraving-gifts-draft.png',
  'lazernaya-gravirovka-podarkov-tehnologiya': '/images/blog/logo-application-technologies.png',
  'logotipli-sovga-toplami': '/images/blog/article-28.png',
  'logotipli-zajigalka-va-soat': '/images/blog/personalized-gifts.png',
  'logotip-maketi-tayyorlash': '/images/blog/logotip-maketini-qanday-tayyorlash-kerak.png',
  'merch-dlya-it-kompaniy-tashkent': '/images/blog/corporate-merch-article-45.png',
  'merch-dlya-kompanii-brendirovanie': '/images/blog/corporate-merch-article.png',
  'mijoz-hamkorlar-uchun-sovgalar-vip': '/images/blog/vip-gifts-article-44.png',
  'navruz-sovgalari': '/images/blog/uzbek-article.png',
  'navruz-uchun-korporativ-sovgalar': '/images/blog/23-fevralga-nima-sovg-a-qilish-kerak-korporativ-goyalar.png',
  'podarki-dlya-bankov-i-finteha-tashkent': '/images/blog/corporate-gifts-legal-aspects.png',
  'podarki-dlya-horeca-i-restoranov-tashkent': '/images/blog/eco-corporate-gifts.png',
  'podarki-klientam-partneram-vip': '/images/blog/vip-gifts-article.png',
  'podarki-na-korporativnye-sobytiya-tashkent': '/images/blog/creative-gift-packaging-ideas.png',
  'podarki-na-navruz': '/images/blog/article-11.png',
  'top-idei-podarkov-na-novyj-god': '/images/blog/article-7.png',
  'welcome-pack-dlya-sotrudnikov': '/images/blog/article-4.png',
  'welcome-pack-novym-sotrudnikam': '/images/blog/article-6.png',
  'welcome-pack-yangi-xodimlar': '/images/blog/welcome-pack-uz.png',
  'xaridor-chek-listi-b2b': '/images/blog/article-20.png',
  'xodimlar-uchun-sovgalar-hr-qollanma': '/images/blog/xodimlarga-sovg-alar-hr-qollanma-uz.png',
  'yangi-xodimlar-uchun-welcome-pack': '/images/blog/personalized-gifts-uz.png',
    'yangi-yil-sovga-goyalari': '/images/blog/new-year-corporate-gifts-uz.png',
  'idei-vip-podarkov': '/images/blog/idei-vip-podarkov.jpg',
  'kak-vybrat-podarki-dlya-sotrudnikov': '/images/blog/kak-vybrat-podarki-dlya-sotrudnikov.jpg',
  'gravirovka-na-biznes-podarkah': '/images/blog/gravirovka-na-biznes-podarkah.jpg',
  'korporativniy-merch-kak-instrument-marketinga': '/images/blog/korporativniy-merch-kak-instrument-marketinga.jpg',
  'byudzhet-na-korporativnye-podarki': '/images/blog/byudzhet-na-korporativnye-podarki.jpg',
  'srochniy-zakaz-korporativnyh-podarkov': '/images/blog/srochniy-zakaz-korporativnyh-podarkov.jpg',
  'eko-podarki-dlya-biznesa': '/images/blog/eko-podarki-dlya-biznesa.jpg',
  'korporativnye-podarki-na-navruz': '/images/blog/korporativnye-podarki-na-navruz.jpg',
  'keys-brendirovannye-podarki-dlya-it': '/images/blog/keys-brendirovannye-podarki-dlya-it.jpg',
  'loyalnost-sotrudnikov-korporativnye-podarki': '/images/blog/hr-loyalty-gifts.jpg',
  'delovoy-etiket-biznes-podarki-uzbekistan': '/images/blog/uzbek-business-etiquette.jpg',
  'kak-vybrat-korporativnyj-podarok-b2b': '/images/blog/b2b-gift-selection-guide.jpg',
  'personalizatsiya-novyy-standart-gravirovka': '/images/blog/laser-engraving-personalization.jpg',
  'process-zakaza-korporativnyh-podarkov': '/images/blog/corporate-gift-ordering-process.jpg',
  'keys-welcome-pak-it-kompaniya-tashkent': '/images/blog/welcome-pack-it-company.jpg',
  'godovoy-plan-korporativnyh-prazdnikov': '/images/blog/corporate-holiday-calendar-uzbekistan.jpg',
    'podarki-sotrudnikam-hr-gayd': defaultBlogCover,
    'podarochnye-nabory-s-logotipom': defaultBlogCover,
    'suvenir-byudjetini-tejash': defaultBlogCover,
    'suvenir-brendlash': defaultBlogCover,
  // UZ translations of new RU posts - reuse same images
  'korporativ-sovgalar-boyicha-toliq-qollanma': '/images/blog/article-1-og.jpg',
  'vip-sovga-goyalari': '/images/blog/idei-vip-podarkov.jpg',
  'xodimlar-uchun-sovga-tanlash-chek-list': '/images/blog/article-20.png',
  'biznes-sovgalarda-gravyura': '/images/blog/gravirovka-na-biznes-podarkah.jpg',
  'korporativ-merch-marketing-vositasi': '/images/blog/korporativniy-merch-kak-instrument-marketinga.jpg',
  'korporativ-sovgalar-byudjeti': '/images/blog/byudzhet-na-korporativnye-podarki.jpg',
  'shoshilinch-korporativ-sovga-buyurtmasi': '/images/blog/srochniy-zakaz-korporativnyh-podarkov.jpg',
  'biznes-uchun-eko-sovgalar': '/images/blog/eko-podarki-dlya-biznesa.jpg',
  'keys-brendlangan-sovgalar-it-kompaniya': '/images/blog/keys-brendirovannye-podarki-dlya-it.jpg',
  'xodimlar-sadoqati-korporativ-sovgalar': '/images/blog/hr-loyalty-gifts.jpg',
  // UZ translations of geo-targeted RU posts
  'ishbilarmonlik-odobi-biznes-sovgalar-ozbekiston': '/images/blog/uzbek-business-etiquette.jpg',
  'b2b-korporativ-sovga-tanlash': '/images/blog/b2b-gift-selection-guide.jpg',
  'shaxsiylashtirish-yangi-standart-gravyura': '/images/blog/laser-engraving-personalization.jpg',
  'korporativ-sovga-buyurtma-jarayoni': '/images/blog/corporate-gift-ordering-process.jpg',
  'keys-welcome-pak-it-kompaniya-toshkent': '/images/blog/welcome-pack-it-company.jpg',
  'korporativ-bayramlar-yillik-rejasi': '/images/blog/corporate-holiday-calendar-uzbekistan.jpg',
  'it-kompaniyalar-uchun-merch-toshkent': '/images/blog/corporate-merch-article-45.png',
  'banklar-va-fintex-uchun-sovgalar-toshkent': '/images/blog/corporate-gifts-legal-aspects.png',
  'logotipli-soat-korporativ-sovgalar-toshkent': '/images/blog/article-16.png',
  'korporativ-tadbirlar-uchun-sovgalar-toshkent': '/images/blog/creative-gift-packaging-ideas.png',
  'horeca-va-restoranlar-uchun-sovgalar-toshkent': '/images/blog/eco-corporate-gifts.png',
  // New articles from 15статейNew.docx
  'gastronomicheskie-nabory-na-navruz-tashkent': '/images/blog/gastronomicheskie-nabory-navruz-tashkent.jpg',
  'kak-vybrat-vip-podarok-partneru-uzbekistan': '/images/blog/vip-podarok-partneru-uzbekistan.jpg',
  'welcome-pack-dlya-it-kompanii-tashkent': '/images/blog/welcome-pack-it-kompaniya-tashkent.jpg',
  'lazernaya-gravirovka-protiv-uf-pechati-chto-vybrat': '/images/blog/lazernaya-gravirovka-vs-uf-pechat.jpg',
  'gastronomic-toplamlar-navruzga-toshkent': '/images/blog/gastronomicheskie-nabory-navruz-tashkent.jpg',
  'vip-hamkor-uchun-sovgani-qanday-tanlash-ozbekiston': '/images/blog/vip-podarok-partneru-uzbekistan.jpg',
  'it-kompaniya-uchun-welcome-pack-toshkent': '/images/blog/welcome-pack-it-kompaniya-tashkent.jpg',
  'lazerli-oyma-va-uf-pechat-nimani-tanlash': '/images/blog/lazernaya-gravirovka-vs-uf-pechat.jpg',
};
export const blogImages = blogCardImageBySlug;

const blogCardImages = Array.from(new Set(Object.values(blogCardImageBySlug)));
const responsiveWidths = [480, 768, 1200];

function toVariantPath(basePath, width, format) {
  if (typeof basePath !== 'string' || !basePath) {
    return basePath;
  }
  return basePath.replace(/\.png$/i, '-' + width + '.' + format);
}

function toSrcSet(basePath, format) {
  if (typeof basePath !== 'string' || !basePath || !/\.png$/i.test(basePath)) {
    return '';
  }
  return responsiveWidths
    .map((width) => toVariantPath(basePath, width, format) + ' ' + width + 'w')
    .join(', ');
}

function toOgPath(basePath) {
  if (typeof basePath !== 'string' || !basePath || !/\.png$/i.test(basePath)) {
    return basePath;
  }
  return basePath.replace(/\.png$/i, '-og.jpg');
}

function getStableIndexFromSlug(slug) {
  var hash = 0;
  for (var index = 0; index < slug.length; index += 1) {
    hash = (hash * 31 + slug.charCodeAt(index)) >>> 0;
  }
  return hash % blogCardImages.length;
}

export function getBlogImageForSlug(slug) {
  if (!slug || !blogCardImages.length) {
    return defaultBlogCover;
  }
  if (blogCardImageBySlug[slug]) {
    return blogCardImageBySlug[slug];
  }
  return defaultBlogCover;
}

export { defaultBlogCover };

export function getResponsiveBlogImageForSlug(slug) {
  const fallbackSrc = getBlogImageForSlug(slug);
  return {
    fallbackSrc,
    avifSrcSet: toSrcSet(fallbackSrc, 'avif'),
    webpSrcSet: toSrcSet(fallbackSrc, 'webp'),
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 960px',
  };
}

export function getBlogOgImageForSlug(slug) {
  return toOgPath(getBlogImageForSlug(slug));
}

export function hasMappedBlogImage(slug) {
  return !!(slug && blogCardImageBySlug[slug]);
}

export function getBlogImageMappingCoverage(slugs) {
  const uniqueSlugs = Array.isArray(slugs)
    ? Array.from(new Set(slugs.filter(Boolean)))
    : [];
  const missing = uniqueSlugs.filter((slug) => !blogCardImageBySlug[slug]);
  const mapped = uniqueSlugs.length - missing.length;
  return {
    total: uniqueSlugs.length,
    mapped,
    missing,
    coverage: uniqueSlugs.length ? mapped / uniqueSlugs.length : 1,
  };
}

