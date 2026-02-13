import { BLOG_SLUG_MAP } from '../src/config/blogSlugMap.js';

const samplePairs = [
  ['kak-vybrat-korporativnyj-podarok', 'korporativ-sovgani-qanday-tanlash'],
  ['lazernaya-gravirovka-podarkov', 'lazer-gravirovka-sovgalar'],
  ['podarochnye-nabory-s-logotipom', 'logotipli-sovga-toplami'],
  ['brendirovanie-suvenirov', 'suvenir-brendlash'],
  ['chek-list-zakupshchika-podarkov', 'xaridor-chek-listi-b2b'],
  ['kak-podgotovit-maket-logotipa', 'logotip-maketi-tayyorlash'],
  ['welcome-pack-dlya-sotrudnikov', 'welcome-pack-yangi-xodimlar'],
  ['korporativnye-podarki-s-logotipom-polnyy-gayd', 'korporativ-sovgalar-logotip-bilan-to-liq-qollanma'],
  ['korporativnye-podarochnye-nabory', 'korporativ-sovga-toplamlari'],
  ['welcome-pack-novym-sotrudnikam', 'yangi-xodimlar-uchun-welcome-pack']
];

let failed = false;

for (const [ruSlug, uzSlug] of samplePairs) {
  const mappedUz = BLOG_SLUG_MAP.ru[ruSlug];
  const mappedRu = BLOG_SLUG_MAP.uz[uzSlug];

  const directOk = mappedUz === uzSlug;
  const reverseOk = mappedRu === ruSlug;

  console.log(`${directOk ? 'PASS' : 'FAIL'} ru->uz ${ruSlug} => ${mappedUz || 'null'}`);
  console.log(`${reverseOk ? 'PASS' : 'FAIL'} uz->ru ${uzSlug} => ${mappedRu || 'null'}`);

  if (!directOk || !reverseOk) {
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}
