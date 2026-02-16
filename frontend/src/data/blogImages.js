const blogCardImages = [
  '/portfolio/10.webp',
  '/portfolio/6.webp',
  '/portfolio/5.webp',
  '/portfolio/4.webp',
  '/portfolio/3.webp',
  '/portfolio/1.webp'
];

const blogCardImageBySlug = {
  'merch-dlya-it-kompaniy-tashkent': '/portfolio/10.webp',
  'podarki-dlya-bankov-i-finteha-tashkent': '/portfolio/6.webp',
  'chasy-s-logotipom-korporativnye-podarki-tashkent': '/portfolio/5.webp',
  'podarki-na-korporativnye-sobytiya-tashkent': '/portfolio/4.webp',
  'podarki-dlya-horeca-i-restoranov-tashkent': '/portfolio/3.webp'
};

function getStableIndexFromSlug(slug) {
  var hash = 0;
  for (var index = 0; index < slug.length; index += 1) {
    hash = (hash * 31 + slug.charCodeAt(index)) >>> 0;
  }
  return hash % blogCardImages.length;
}

export function getBlogImageForSlug(slug) {
  if (!slug) {
    return blogCardImages[0];
  }
  if (blogCardImageBySlug[slug]) {
    return blogCardImageBySlug[slug];
  }
  return blogCardImages[getStableIndexFromSlug(slug)];
}
