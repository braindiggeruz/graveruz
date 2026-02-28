
import json

# Read existing file
with open('src/data/blogPosts.js', 'r') as f:
    content = f.read()

# Read article content
articles_ru = {}
articles_uz = {}
for i in range(1, 11):
    with open(f'/tmp/march8-article-{i}-ru.html', 'r') as f:
        articles_ru[i] = f.read()
    with open(f'/tmp/march8-article-{i}-uz.html', 'r') as f:
        articles_uz[i] = f.read()

def escape_html(html):
    return json.dumps(html)[1:-1]

# Articles data
new_articles_ru = [
    {
        "num": 2,
        "slug": "originalnye-podarki-na-8-marta",
        "title": "Оригинальные подарки на 8 марта с гравировкой | Graver Studio",
        "description": "Топ-5 оригинальных идей подарков на 8 марта с персональной гравировкой. Часы, зажигалки, украшения с именем — в Graver Studio, Ташкент.",
        "date": "2026-03-01",
        "category": "Идеи",
        "keywords": ["оригинальные подарки на 8 марта", "необычные подарки 8 марта", "подарки с гравировкой", "персональные подарки", "Ташкент"],
        "relatedPosts": ["podarki-na-8-marta-sotrudnicam", "chto-podarit-devushke-na-8-marta", "idei-vip-podarkov"],
        "h1": "Оригинальные подарки на 8 марта: топ-5 идей с гравировкой",
        "linksOut": ["podarki-na-8-marta-sotrudnicam", "chto-podarit-devushke-na-8-marta"],
        "image": "/images/blog/march8-original-gifts.jpg",
        "imageAlt": "Оригинальные подарки на 8 марта с гравировкой",
        "faq": [
            {"question": "Можно ли добавить фото на гравировку?", "answer": "Да, мы делаем фотогравировку на металле и дереве. Пришлите фото в Telegram, мы сделаем макет."},
            {"question": "Какой минимальный заказ?", "answer": "Минимальный заказ — 1 штука. Никаких ограничений по количеству."}
        ]
    },
    {
        "num": 3,
        "slug": "korporativnye-podarki-na-8-marta-v-tashkente",
        "title": "Корпоративные подарки на 8 марта в Ташкенте | Graver Studio",
        "description": "Лучшие корпоративные подарки на 8 марта для всего коллектива. Зажигалки, ручки, часы с логотипом компании. Скидки от 10 штук. Доставка по Ташкенту.",
        "date": "2026-03-01",
        "category": "Корпоративные",
        "keywords": ["корпоративные подарки на 8 марта", "подарки коллективу 8 марта", "подарки с логотипом 8 марта", "8 марта корпоратив Ташкент"],
        "relatedPosts": ["podarki-na-8-marta-sotrudnicam", "kak-vybrat-korporativnyj-podarok", "podarochnye-nabory-s-logotipom"],
        "h1": "Корпоративные подарки на 8 марта в Ташкенте: от брелока до часов",
        "linksOut": ["podarki-na-8-marta-sotrudnicam", "kak-vybrat-korporativnyj-podarok"],
        "image": "/images/blog/march8-corporate-gifts.jpg",
        "imageAlt": "Корпоративные подарки на 8 марта с логотипом",
        "faq": [
            {"question": "Можно ли заказать разные подарки для разных сотрудниц?", "answer": "Да, мы делаем смешанные заказы. Например, 50 брелоков для всех и 10 часов для руководителей."},
            {"question": "Нужно ли предоплата?", "answer": "Для корпоративных заказов — 50% предоплата, остаток при получении."}
        ]
    },
    {
        "num": 4,
        "slug": "chto-podarit-mame-na-8-marta",
        "title": "Что подарить маме на 8 марта: идеи с гравировкой | Graver Studio",
        "description": "Лучшие идеи подарков маме на 8 марта. Часы с надписью, фоторамка, шкатулка с гравировкой. Персональный подарок, который она запомнит навсегда.",
        "date": "2026-03-01",
        "category": "Идеи",
        "keywords": ["что подарить маме на 8 марта", "подарок маме 8 марта", "подарок маме с гравировкой", "идеи подарков маме"],
        "relatedPosts": ["originalnye-podarki-na-8-marta", "chto-podarit-devushke-na-8-marta", "nedorogie-podarki-na-8-marta"],
        "h1": "Что подарить маме на 8 марта: 5 идей с персональной гравировкой",
        "linksOut": ["originalnye-podarki-na-8-marta", "nedorogie-podarki-na-8-marta"],
        "image": "/images/blog/march8-mom-gift.jpg",
        "imageAlt": "Подарок маме на 8 марта с гравировкой",
        "faq": [
            {"question": "Можно ли написать текст от руки?", "answer": "Да! Мы можем отсканировать ваш почерк и перенести его на изделие. Это делает подарок ещё более личным."},
            {"question": "Сколько стоит подарок маме?", "answer": "У нас есть варианты от 80 000 сум (брелок) до 1 100 000 сум (часы). Выберите то, что подходит вашему бюджету."}
        ]
    },
    {
        "num": 5,
        "slug": "chto-podarit-kollege-na-8-marta",
        "title": "Что подарить коллеге на 8 марта: идеи | Graver Studio",
        "description": "Идеи подарков коллеге на 8 марта. Ручка, кружка, брелок с гравировкой — стильные и недорогие варианты. Заказ от 1 штуки в Ташкенте.",
        "date": "2026-03-01",
        "category": "Идеи",
        "keywords": ["что подарить коллеге на 8 марта", "подарок коллеге 8 марта", "подарки для коллег", "офисные подарки 8 марта"],
        "relatedPosts": ["podarki-na-8-marta-sotrudnicam", "nedorogie-podarki-na-8-marta", "chto-podarit-rukovoditelyu-na-8-marta"],
        "h1": "Что подарить коллеге на 8 марта: 5 стильных идей",
        "linksOut": ["podarki-na-8-marta-sotrudnicam", "nedorogie-podarki-na-8-marta"],
        "image": "/images/blog/march8-colleague-gift.jpg",
        "imageAlt": "Подарок коллеге на 8 марта",
        "faq": [
            {"question": "Какой бюджет подходит для подарка коллеге?", "answer": "Оптимальный бюджет — от 80 000 до 200 000 сум. Это позволяет выбрать стильный и качественный подарок, не создавая неловкости."},
            {"question": "Можно ли заказать одинаковые подарки для всего отдела?", "answer": "Да! При заказе от 10 штук мы предоставляем скидку 10-15%."}
        ]
    },
    {
        "num": 6,
        "slug": "chto-podarit-rukovoditelyu-na-8-marta",
        "title": "Что подарить руководителю на 8 марта: статусные идеи | Graver Studio",
        "description": "Идеи статусных подарков руководителю на 8 марта. Часы, ежедневник, настольный набор с гравировкой. Подарки для директора и топ-менеджмента.",
        "date": "2026-03-01",
        "category": "Идеи",
        "keywords": ["что подарить руководителю на 8 марта", "подарок директору 8 марта", "подарок начальнице 8 марта", "VIP подарки 8 марта"],
        "relatedPosts": ["chto-podarit-kollege-na-8-marta", "idei-vip-podarkov", "podarki-na-8-marta-sotrudnicam"],
        "h1": "Что подарить руководителю на 8 марта: 5 статусных идей",
        "linksOut": ["idei-vip-podarkov", "chto-podarit-kollege-na-8-marta"],
        "image": "/images/blog/march8-boss-gift.jpg",
        "imageAlt": "Подарок руководителю на 8 марта",
        "faq": [
            {"question": "Какой подарок будет уместен для руководителя?", "answer": "Для руководителя подойдут статусные и качественные вещи: часы, ежедневник в кожаной обложке, настольный набор. Важно, чтобы подарок был от всего коллектива."},
            {"question": "Можно ли добавить логотип компании?", "answer": "Да, мы можем добавить логотип компании на любое изделие. Это сделает подарок ещё более корпоративным и запоминающимся."}
        ]
    },
    {
        "num": 7,
        "slug": "chto-podarit-devushke-na-8-marta",
        "title": "Что подарить девушке на 8 марта: романтичные идеи | Graver Studio",
        "description": "Романтичные подарки девушке на 8 марта с гравировкой. Украшения с инициалами, часы с признанием, парные брелоки. Сделайте её день незабываемым.",
        "date": "2026-03-01",
        "category": "Идеи",
        "keywords": ["что подарить девушке на 8 марта", "подарок девушке 8 марта", "романтичные подарки 8 марта", "подарок любимой 8 марта"],
        "relatedPosts": ["originalnye-podarki-na-8-marta", "chto-podarit-mame-na-8-marta", "nedorogie-podarki-na-8-marta"],
        "h1": "Что подарить девушке на 8 марта: 5 романтичных идей с гравировкой",
        "linksOut": ["originalnye-podarki-na-8-marta", "nedorogie-podarki-na-8-marta"],
        "image": "/images/blog/march8-girlfriend-gift.jpg",
        "imageAlt": "Романтичный подарок девушке на 8 марта",
        "faq": [
            {"question": "Что написать на гравировке для девушки?", "answer": "Можно написать ваши инициалы, дату знакомства, координаты места первой встречи или короткую фразу: 'Навсегда', 'Моя любовь', 'Вместе'. Мы поможем с текстом."},
            {"question": "Можно ли заказать украшение с гравировкой?", "answer": "Да, мы делаем гравировку на кулонах, браслетах и других украшениях. Минимальный заказ — 1 штука."}
        ]
    },
    {
        "num": 8,
        "slug": "chto-podarit-na-8-marta-devushke-mame-kollege",
        "title": "Что подарить на 8 марта: гид по выбору подарка | Graver Studio",
        "description": "Полный гид по выбору подарка на 8 марта. Как выбрать подарок для мамы, девушки, коллеги или руководителя. Идеи на любой бюджет с гравировкой.",
        "date": "2026-03-01",
        "category": "Гайды",
        "keywords": ["что подарить на 8 марта", "идеи подарков на 8 марта", "как выбрать подарок 8 марта", "подарки на 8 марта"],
        "relatedPosts": ["podarki-na-8-marta-sotrudnicam", "chto-podarit-mame-na-8-marta", "chto-podarit-devushke-na-8-marta"],
        "h1": "Что подарить на 8 марта: пошаговый гид по выбору подарка",
        "linksOut": ["podarki-na-8-marta-sotrudnicam", "chto-podarit-mame-na-8-marta", "chto-podarit-devushke-na-8-marta"],
        "image": "/images/blog/what-to-give-on-march8.jpg",
        "imageAlt": "Гид по выбору подарка на 8 марта",
        "faq": [
            {"question": "Как быстро можно заказать подарок?", "answer": "Стандартный срок — 2-3 рабочих дня. Срочное изготовление за 24 часа возможно при наличии готового макета."},
            {"question": "Есть ли доставка по Ташкенту?", "answer": "Да, мы осуществляем доставку по Ташкенту и всему Узбекистану."}
        ]
    },
    {
        "num": 9,
        "slug": "nedorogie-podarki-na-8-marta",
        "title": "Недорогие подарки на 8 марта с гравировкой | Graver Studio",
        "description": "Стильные и недорогие подарки на 8 марта с гравировкой от 80 000 сум. Брелоки, ручки, кружки, открытки. Заказ от 1 штуки в Ташкенте.",
        "date": "2026-03-01",
        "category": "Идеи",
        "keywords": ["недорогие подарки на 8 марта", "бюджетные подарки 8 марта", "дешевые подарки 8 марта", "подарки до 150000 сум"],
        "relatedPosts": ["chto-podarit-kollege-na-8-marta", "podarki-na-8-marta-sotrudnicam", "chto-podarit-na-8-marta-devushke-mame-kollege"],
        "h1": "Недорогие подарки на 8 марта: топ-5 идей с гравировкой до 150 000 сум",
        "linksOut": ["chto-podarit-kollege-na-8-marta", "podarki-na-8-marta-sotrudnicam"],
        "image": "/images/blog/march8-cheap-gifts.jpg",
        "imageAlt": "Недорогие подарки на 8 марта с гравировкой",
        "faq": [
            {"question": "Какой самый дешевый подарок с гравировкой?", "answer": "Самый доступный вариант — металлический брелок с именем от 80 000 сум. Это стильный и практичный подарок."},
            {"question": "Можно ли заказать 1 штуку?", "answer": "Да, минимальный заказ — 1 штука. Никаких ограничений по количеству."}
        ]
    },
    {
        "num": 10,
        "slug": "gravirovka-v-tashkente-na-8-marta",
        "title": "Гравировка в Ташкенте на 8 марта | Graver Studio",
        "description": "Лазерная гравировка подарков на 8 марта в Ташкенте. Персонализируйте любой подарок: часы, украшения, ручки, термосы. Быстро, качественно, недорого.",
        "date": "2026-03-01",
        "category": "Услуги",
        "keywords": ["гравировка в Ташкенте", "лазерная гравировка 8 марта", "гравировка подарков Ташкент", "персонализация подарков"],
        "relatedPosts": ["podarki-na-8-marta-sotrudnicam", "originalnye-podarki-na-8-marta", "lazernaya-gravirovka-podarkov"],
        "h1": "Гравировка в Ташкенте на 8 марта: персонализируйте любой подарок",
        "linksOut": ["lazernaya-gravirovka-podarkov", "podarki-na-8-marta-sotrudnicam"],
        "image": "/images/blog/march8-engraving-tashkent.jpg",
        "imageAlt": "Лазерная гравировка подарков на 8 марта в Ташкенте",
        "faq": [
            {"question": "Можно ли принести свой предмет для гравировки?", "answer": "Да, вы можете принести свой предмет. Мы работаем с металлом, деревом, кожей, стеклом и многими другими материалами."},
            {"question": "Сколько стоит гравировка?", "answer": "Стоимость гравировки зависит от сложности и материала. Базовая гравировка текста — от 30 000 сум. Свяжитесь с нами для точного расчёта."}
        ]
    }
]

new_articles_uz = [
    {
        "num": 2,
        "slug": "originalnye-podarki-na-8-marta-uz",
        "title": "8-martga original sovg'alar | Graver Studio",
        "description": "8-martga gravirovka qilingan 5 ta original sovg'a g'oyasi. Soat, zajigalka, ismi tushirilgan taqinchoqlar — Graver Studio, Toshkent.",
        "date": "2026-03-01",
        "category": "G'oyalar",
        "keywords": ["8-martga original sovgalar", "8-martga noodatiy sovgalar", "gravirovka qilingan sovgalar", "shaxsiy sovgalar", "Toshkent"],
        "relatedPosts": ["podarki-na-8-marta-sotrudnicam-uz", "chto-podarit-devushke-na-8-marta-uz", "idei-vip-podarkov-uz"],
        "h1": "8-martga original sovg'alar: gravirovka qilingan 5 ta g'oya",
        "linksOut": ["podarki-na-8-marta-sotrudnicam-uz", "chto-podarit-devushke-na-8-marta-uz"],
        "image": "/images/blog/march8-original-gifts.jpg",
        "imageAlt": "8-martga gravirovka qilingan original sovg'alar",
        "faq": [
            {"question": "Gravirovkaga rasm qo'shsa bo'ladimi?", "answer": "Ha, biz metall va yog'ochga fotogravirovka qilamiz. Telegram orqali rasm yuboring, biz maket tayyorlaymiz."},
            {"question": "Minimal buyurtma qancha?", "answer": "Minimal buyurtma — 1 dona. Miqdor bo'yicha hech qanday cheklovlar yo'q."}
        ]
    },
    {
        "num": 3,
        "slug": "korporativnye-podarki-na-8-marta-v-tashkente-uz",
        "title": "Toshkentda 8-martga korporativ sovg'alar | Graver Studio",
        "description": "Butun jamoa uchun 8-martga eng yaxshi korporativ sovg'alar. Kompaniya logotipi tushirilgan zajigalka, ruchka, soatlar. 10 donadan chegirma. Toshkent bo'ylab yetkazib berish.",
        "date": "2026-03-01",
        "category": "Korporativ",
        "keywords": ["8-martga korporativ sovgalar", "jamoaga 8-mart sovgalari", "logotipli sovgalar 8-mart", "8-mart korporativ Toshkent"],
        "relatedPosts": ["8-mart-xodimlarga-sovgalar", "korporativ-sovgani-qanday-tanlash", "logotipli-sovga-toplami"],
        "h1": "Toshkentda 8-martga korporativ sovg'alar: brelokdan soatgacha",
        "linksOut": ["8-mart-xodimlarga-sovgalar", "korporativ-sovgani-qanday-tanlash"],
        "image": "/images/blog/march8-corporate-gifts.jpg",
        "imageAlt": "Logotip tushirilgan 8-martga korporativ sovg'alar",
        "faq": [
            {"question": "Turli xodimlar uchun turli xil sovg'alar buyurtma qilsa bo'ladimi?", "answer": "Ha, biz aralash buyurtmalar qilamiz. Masalan, hamma uchun 50 ta brelok va rahbarlar uchun 10 ta soat."},
            {"question": "Oldindan to'lov kerakmi?", "answer": "Korporativ buyurtmalar uchun — 50% oldindan to'lov, qolgani olinganda."}
        ]
    },
    {
        "num": 4,
        "slug": "chto-podarit-mame-na-8-marta-uz",
        "title": "8-martga onaga nima sovg'a qilish kerak | Graver Studio",
        "description": "8-martga onaga eng yaxshi sovg'a g'oyalari. Yozuvli soat, fotoramka, gravirovka qilingan quticha. Umrbod esda qoladigan shaxsiy sovg'a.",
        "date": "2026-03-01",
        "category": "G'oyalar",
        "keywords": ["8-martga onaga nima sovga qilish", "onaga 8-mart sovgasi", "onaga gravirovka qilingan sovga", "ona uchun sovga goyalari"],
        "relatedPosts": ["originalnye-podarki-na-8-marta-uz", "chto-podarit-devushke-na-8-marta-uz", "nedorogie-podarki-na-8-marta-uz"],
        "h1": "8-martga onaga nima sovg'a qilish kerak: gravirovka qilingan 5 ta g'oya",
        "linksOut": ["originalnye-podarki-na-8-marta-uz", "nedorogie-podarki-na-8-marta-uz"],
        "image": "/images/blog/march8-mom-gift.jpg",
        "imageAlt": "8-martga onaga gravirovka qilingan sovg'a",
        "faq": [
            {"question": "Qo'lda yozilgan matnni gravirovka qilsa bo'ladimi?", "answer": "Ha! Biz sizning yozuvingizni skanerlashimiz va uni buyumga o'tkazishimiz mumkin. Bu sovg'ani yanada shaxsiy qiladi."},
            {"question": "Onaga sovg'a qancha turadi?", "answer": "Bizda 80 000 so'mdan (brelok) 1 100 000 so'mgacha (soat) bo'lgan variantlar mavjud. Byudjetingizga mos keladiganini tanlang."}
        ]
    },
    {
        "num": 5,
        "slug": "chto-podarit-kollege-na-8-marta-uz",
        "title": "8-martga hamkasbga nima sovg'a qilish kerak | Graver Studio",
        "description": "Hamkasb uchun 8-martga sovg'a g'oyalari. Gravirovka qilingan ruchka, krujka, brelok — zamonaviy va arzon variantlar. Toshkentda 1 donadan buyurtma.",
        "date": "2026-03-01",
        "category": "G'oyalar",
        "keywords": ["8-martga hamkasbga nima sovga qilish", "hamkasbga 8-mart sovgasi", "hamkasblar uchun sovgalar", "ofis sovgalari 8-mart"],
        "relatedPosts": ["8-mart-xodimlarga-sovgalar", "nedorogie-podarki-na-8-marta-uz", "chto-podarit-rukovoditelyu-na-8-marta-uz"],
        "h1": "8-martga hamkasbga nima sovg'a qilish kerak: 5 ta zamonaviy g'oya",
        "linksOut": ["8-mart-xodimlarga-sovgalar", "nedorogie-podarki-na-8-marta-uz"],
        "image": "/images/blog/march8-colleague-gift.jpg",
        "imageAlt": "8-martga hamkasbga sovg'a",
        "faq": [
            {"question": "Hamkasb uchun qanday byudjet mos keladi?", "answer": "Optimal byudjet — 80 000 dan 200 000 so'mgacha. Bu noqulaylik yaratmasdan zamonaviy va sifatli sovg'a tanlash imkonini beradi."},
            {"question": "Butun bo'lim uchun bir xil sovg'alar buyurtma qilsa bo'ladimi?", "answer": "Ha! 10 donadan ortiq buyurtma berilganda biz 10-15% chegirma beramiz."}
        ]
    },
    {
        "num": 6,
        "slug": "chto-podarit-rukovoditelyu-na-8-marta-uz",
        "title": "8-martga rahbarga nima sovg'a qilish kerak | Graver Studio",
        "description": "Rahbarga 8-martga statusli sovg'a g'oyalari. Soat, kundalik, gravirovka qilingan stol to'plami. Direktor va top-menejment uchun sovg'alar.",
        "date": "2026-03-01",
        "category": "G'oyalar",
        "keywords": ["8-martga rahbarga nima sovga qilish", "direktora 8-mart sovgasi", "boshliqqa 8-mart sovgasi", "VIP sovgalar 8-mart"],
        "relatedPosts": ["chto-podarit-kollege-na-8-marta-uz", "vip-sovga-goyalari", "8-mart-xodimlarga-sovgalar"],
        "h1": "8-martga rahbarga nima sovg'a qilish kerak: 5 ta statusli g'oya",
        "linksOut": ["vip-sovga-goyalari", "chto-podarit-kollege-na-8-marta-uz"],
        "image": "/images/blog/march8-boss-gift.jpg",
        "imageAlt": "8-martga rahbarga sovg'a",
        "faq": [
            {"question": "Rahbarga qanday sovg'a o'rinli bo'ladi?", "answer": "Rahbarga statusli va sifatli narsalar mos keladi: soat, charm muqovali kundalik, stol to'plami. Muhimi, sovg'a butun jamoadan bo'lishi kerak."},
            {"question": "Kompaniya logotipini qo'shsa bo'ladimi?", "answer": "Ha, biz har qanday buyumga kompaniya logotipini qo'sha olamiz. Bu sovg'ani yanada korporativ va esda qolarli qiladi."}
        ]
    },
    {
        "num": 7,
        "slug": "chto-podarit-devushke-na-8-marta-uz",
        "title": "8-martga qiz do'stga nima sovg'a qilish kerak | Graver Studio",
        "description": "Qiz do'stga 8-martga romantik sovg'alar gravirovka bilan. Bosh harflari tushirilgan taqinchoqlar, e'tirof bitilgan soat, juft breloklar. Kunini unutilmas qiling.",
        "date": "2026-03-01",
        "category": "G'oyalar",
        "keywords": ["8-martga qiz dostga nima sovga qilish", "qiz dostga 8-mart sovgasi", "romantik sovgalar 8-mart", "sevgiliga 8-mart sovgasi"],
        "relatedPosts": ["originalnye-podarki-na-8-marta-uz", "chto-podarit-mame-na-8-marta-uz", "nedorogie-podarki-na-8-marta-uz"],
        "h1": "8-martga qiz do'stga nima sovg'a qilish kerak: gravirovka qilingan 5 ta romantik g'oya",
        "linksOut": ["originalnye-podarki-na-8-marta-uz", "nedorogie-podarki-na-8-marta-uz"],
        "image": "/images/blog/march8-girlfriend-gift.jpg",
        "imageAlt": "8-martga qiz do'stga romantik sovg'a",
        "faq": [
            {"question": "Qiz do'st uchun gravirovkaga nima yozish kerak?", "answer": "Sizning bosh harflaringizni, tanishgan sanangizni, birinchi uchrashuvingiz joyining koordinatalarini yoki qisqa iborani yozishingiz mumkin: 'Abadiy', 'Mening sevgim', 'Birga'. Biz matn bilan yordam beramiz."},
            {"question": "Gravirovka qilingan taqinchoq buyurtma qilsa bo'ladimi?", "answer": "Ha, biz kulon, bilaguzuk va boshqa taqinchoqlarga gravirovka qilamiz. Minimal buyurtma — 1 dona."}
        ]
    },
    {
        "num": 8,
        "slug": "chto-podarit-na-8-marta-devushke-mame-kollege-uz",
        "title": "8-martga nima sovg'a qilish kerak: sovg'a tanlash qo'llanmasi | Graver Studio",
        "description": "8-martga sovg'a tanlash bo'yicha to'liq qo'llanma. Ona, qiz do'st, hamkasb yoki rahbar uchun sovg'ani qanday tanlash kerak. Har qanday byudjetga g'oyalar.",
        "date": "2026-03-01",
        "category": "Qo'llanmalar",
        "keywords": ["8-martga nima sovga qilish kerak", "8-martga sovga goyalari", "8-mart sovgasini qanday tanlash", "8-martga sovgalar"],
        "relatedPosts": ["8-mart-xodimlarga-sovgalar", "chto-podarit-mame-na-8-marta-uz", "chto-podarit-devushke-na-8-marta-uz"],
        "h1": "8-martga nima sovg'a qilish kerak: sovg'a tanlash bo'yicha bosqichma-bosqich qo'llanma",
        "linksOut": ["8-mart-xodimlarga-sovgalar", "chto-podarit-mame-na-8-marta-uz", "chto-podarit-devushke-na-8-marta-uz"],
        "image": "/images/blog/what-to-give-on-march8.jpg",
        "imageAlt": "8-martga sovg'a tanlash qo'llanmasi",
        "faq": [
            {"question": "Sovg'ani qanchalik tez buyurtma qilsa bo'ladi?", "answer": "Standart muddat — 2-3 ish kuni. Tayyor maket mavjud bo'lganda 24 soat ichida shoshilinch ishlab chiqarish mumkin."},
            {"question": "Toshkent bo'ylab yetkazib berish bormi?", "answer": "Ha, biz Toshkent va butun O'zbekiston bo'ylab yetkazib berish xizmatini ko'rsatamiz."}
        ]
    },
    {
        "num": 9,
        "slug": "nedorogie-podarki-na-8-marta-uz",
        "title": "8-martga arzon sovg'alar gravirovka bilan | Graver Studio",
        "description": "8-martga 80 000 so'mdan boshlanadigan zamonaviy va arzon sovg'alar. Breloklar, ruchkalar, krujkalar, otkritkalar. Toshkentda 1 donadan buyurtma.",
        "date": "2026-03-01",
        "category": "G'oyalar",
        "keywords": ["8-martga arzon sovgalar", "byudjetli sovgalar 8-mart", "arzon sovgalar 8-mart", "150000 somgacha sovgalar"],
        "relatedPosts": ["chto-podarit-kollege-na-8-marta-uz", "8-mart-xodimlarga-sovgalar", "chto-podarit-na-8-marta-devushke-mame-kollege-uz"],
        "h1": "8-martga arzon sovg'alar: 150 000 so'mgacha gravirovka qilingan 5 ta g'oya",
        "linksOut": ["chto-podarit-kollege-na-8-marta-uz", "8-mart-xodimlarga-sovgalar"],
        "image": "/images/blog/march8-cheap-gifts.jpg",
        "imageAlt": "8-martga gravirovka qilingan arzon sovg'alar",
        "faq": [
            {"question": "Gravirovka qilingan eng arzon sovg'a qancha turadi?", "answer": "Eng arzon variant — 80 000 so'mdan boshlanadigan ismi tushirilgan metall brelok. Bu zamonaviy va amaliy sovg'a."},
            {"question": "1 dona buyurtma qilsa bo'ladimi?", "answer": "Ha, minimal buyurtma — 1 dona. Miqdor bo'yicha hech qanday cheklovlar yo'q."}
        ]
    },
    {
        "num": 10,
        "slug": "gravirovka-v-tashkente-na-8-marta-uz",
        "title": "Toshkentda 8-martga gravirovka | Graver Studio",
        "description": "Toshkentda 8-martga sovg'alarga lazerli gravirovka. Har qanday sovg'ani shaxsiylashtiramiz: soat, taqinchoqlar, ruchkalar, termoslar. Tez, sifatli, arzon.",
        "date": "2026-03-01",
        "category": "Xizmatlar",
        "keywords": ["Toshkentda gravirovka", "lazerli gravirovka 8-mart", "sovga gravirovkasi Toshkent", "sovgalarni shaxsiylashtirish"],
        "relatedPosts": ["8-mart-xodimlarga-sovgalar", "originalnye-podarki-na-8-marta-uz", "lazer-gravirovka-sovgalar"],
        "h1": "Toshkentda 8-martga gravirovka: har qanday sovg'ani shaxsiylashtiramiz",
        "linksOut": ["lazer-gravirovka-sovgalar", "8-mart-xodimlarga-sovgalar"],
        "image": "/images/blog/march8-engraving-tashkent.jpg",
        "imageAlt": "Toshkentda 8-martga sovg'alarga lazerli gravirovka",
        "faq": [
            {"question": "Gravirovka uchun o'z buyumingizni olib kelsa bo'ladimi?", "answer": "Ha, o'z buyumingizni olib kelishingiz mumkin. Biz metall, yog'och, charm, shisha va boshqa ko'plab materiallar bilan ishlaymiz."},
            {"question": "Gravirovka qancha turadi?", "answer": "Gravirovka narxi murakkablik va materialga qarab farq qiladi. Matn gravirovkasining asosiy narxi — 30 000 so'mdan. Aniq hisob-kitob uchun biz bilan bog'laning."}
        ]
    }
]

def make_article_js(art, lang, html_content):
    faq_js = json.dumps(art['faq'], ensure_ascii=False)
    related_js = json.dumps(art['relatedPosts'], ensure_ascii=False)
    keywords_js = json.dumps(art['keywords'], ensure_ascii=False)
    links_js = json.dumps(art['linksOut'], ensure_ascii=False)
    escaped_html = escape_html(html_content)
    
    return f'''  {{
    slug: '{art['slug']}',
    title: {json.dumps(art['title'], ensure_ascii=False)},
    description: {json.dumps(art['description'], ensure_ascii=False)},
    date: '{art['date']}',
    category: {json.dumps(art['category'], ensure_ascii=False)},
    keywords: {keywords_js},
    relatedPosts: {related_js},
    h1: {json.dumps(art['h1'], ensure_ascii=False)},
    linksOut: {links_js},
    image: '{art['image']}',
    imageAlt: {json.dumps(art['imageAlt'], ensure_ascii=False)},
    faq: {faq_js},
    contentHtml: "{escaped_html}"
  }}'''

# Find insertion point in RU section - after the first article
# Find the end of the first article (podarki-na-8-marta-sotrudnicam)
# The first article ends before 'polniy-gid-po-korporativnym-podarkam'
insert_marker_ru = "    {\n      slug: 'polniy-gid-po-korporativnym-podarkam',"
insert_pos_ru = content.find(insert_marker_ru)
if insert_pos_ru == -1:
    print("ERROR: Cannot find RU insertion point")
else:
    print(f"Found RU insertion point at pos {insert_pos_ru}")
    
    # Build new articles string for RU
    new_ru_articles = ""
    for art in new_articles_ru:
        new_ru_articles += make_article_js(art, 'ru', articles_ru[art['num']]) + ",\n"
    
    content = content[:insert_pos_ru] + new_ru_articles + content[insert_pos_ru:]
    print(f"Added {len(new_articles_ru)} RU articles")

# Find insertion point in UZ section - after the first UZ article
insert_marker_uz = "    {\n      slug: 'korporativ-sovgani-qanday-tanlash',"
insert_pos_uz = content.find(insert_marker_uz)
if insert_pos_uz == -1:
    print("ERROR: Cannot find UZ insertion point")
else:
    print(f"Found UZ insertion point at pos {insert_pos_uz}")
    
    # Build new articles string for UZ
    new_uz_articles = ""
    for art in new_articles_uz:
        new_uz_articles += make_article_js(art, 'uz', articles_uz[art['num']]) + ",\n"
    
    content = content[:insert_pos_uz] + new_uz_articles + content[insert_pos_uz:]
    print(f"Added {len(new_articles_uz)} UZ articles")

with open('src/data/blogPosts.js', 'w') as f:
    f.write(content)

print("Successfully added all 9 missing articles!")
