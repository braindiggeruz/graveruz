from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Oasis Credit API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============ MODELS ============

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    name_ru: str
    name_uz: str
    name_en: str
    description_ru: str
    description_uz: str
    description_en: str
    features_ru: List[str]
    features_uz: List[str]
    features_en: List[str]
    min_amount: int
    max_amount: int
    min_term: int
    max_term: int
    rate: float
    category: str  # business, tezkor, agro, auto, self_employed
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductResponse(BaseModel):
    id: str
    slug: str
    name_ru: str
    name_uz: str
    name_en: str
    description_ru: str
    description_uz: str
    description_en: str
    features_ru: List[str]
    features_uz: List[str]
    features_en: List[str]
    min_amount: int
    max_amount: int
    min_term: int
    max_term: int
    rate: float
    category: str
    image_url: Optional[str] = None

class CalculatorRequest(BaseModel):
    amount: int
    term: int
    rate: Optional[float] = 24.0

class CalculatorResponse(BaseModel):
    monthly_payment: int
    total_payment: int
    overpayment: int
    amount: int
    term: int
    rate: float

class ApplicationCreate(BaseModel):
    product_id: Optional[str] = None
    product_slug: Optional[str] = None
    first_name: str
    last_name: str
    phone: str
    amount: int
    term: int
    agreed_to_terms: bool = True

class Application(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: Optional[str] = None
    product_slug: Optional[str] = None
    first_name: str
    last_name: str
    phone: str
    amount: int
    term: int
    agreed_to_terms: bool
    status: str = "pending"
    sms_code: Optional[str] = None
    sms_verified: bool = False
    documents_uploaded: bool = False
    myid_verified: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ApplicationResponse(BaseModel):
    id: str
    status: str
    created_at: str

class SMSCodeRequest(BaseModel):
    phone: str

class SMSVerifyRequest(BaseModel):
    application_id: str
    code: str

class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    title_ru: str
    title_uz: str
    title_en: str
    excerpt_ru: str
    excerpt_uz: str
    excerpt_en: str
    content_ru: str
    content_uz: str
    content_en: str
    category: str
    image_url: Optional[str] = None
    author: str = "Oasis Credit"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlogPostResponse(BaseModel):
    id: str
    slug: str
    title_ru: str
    title_uz: str
    title_en: str
    excerpt_ru: str
    excerpt_uz: str
    excerpt_en: str
    content_ru: str
    content_uz: str
    content_en: str
    category: str
    image_url: Optional[str] = None
    author: str
    created_at: str
    updated_at: str

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    business: str
    text_ru: str
    text_uz: str
    text_en: str
    rating: int = 5
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ============ ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "Oasis Credit API", "version": "1.0.0"}

# Products
@api_router.get("/products", response_model=List[ProductResponse])
async def get_products(category: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    products = await db.products.find(query, {"_id": 0}).to_list(100)
    return products

@api_router.get("/products/{slug}", response_model=ProductResponse)
async def get_product(slug: str):
    product = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Calculator
@api_router.post("/calculator", response_model=CalculatorResponse)
async def calculate_loan(data: CalculatorRequest):
    monthly_rate = data.rate / 100 / 12
    if monthly_rate == 0:
        monthly_payment = data.amount / data.term
    else:
        monthly_payment = data.amount * (monthly_rate * (1 + monthly_rate) ** data.term) / ((1 + monthly_rate) ** data.term - 1)
    
    monthly_payment = int(monthly_payment)
    total_payment = monthly_payment * data.term
    overpayment = total_payment - data.amount
    
    return CalculatorResponse(
        monthly_payment=monthly_payment,
        total_payment=total_payment,
        overpayment=overpayment,
        amount=data.amount,
        term=data.term,
        rate=data.rate
    )

# Applications
@api_router.post("/applications", response_model=ApplicationResponse)
async def create_application(data: ApplicationCreate):
    app_obj = Application(
        product_id=data.product_id,
        product_slug=data.product_slug,
        first_name=data.first_name,
        last_name=data.last_name,
        phone=data.phone,
        amount=data.amount,
        term=data.term,
        agreed_to_terms=data.agreed_to_terms,
        sms_code=str(random.randint(100000, 999999))  # Mock SMS code
    )
    
    doc = app_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.applications.insert_one(doc)
    
    return ApplicationResponse(
        id=app_obj.id,
        status=app_obj.status,
        created_at=doc['created_at']
    )

@api_router.post("/applications/send-sms")
async def send_sms_code(data: SMSCodeRequest):
    """Mock SMS sending - always returns success"""
    return {"success": True, "message": "SMS code sent (mock)"}

@api_router.post("/applications/{application_id}/verify-sms")
async def verify_sms(application_id: str, data: SMSVerifyRequest):
    """Mock SMS verification - accepts any 6-digit code"""
    app = await db.applications.find_one({"id": application_id}, {"_id": 0})
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Mock: accept any 6-digit code
    if len(data.code) == 6 and data.code.isdigit():
        await db.applications.update_one(
            {"id": application_id},
            {"$set": {"sms_verified": True}}
        )
        return {"success": True, "message": "SMS verified"}
    
    raise HTTPException(status_code=400, detail="Invalid code")

@api_router.post("/applications/{application_id}/upload-documents")
async def upload_documents(application_id: str):
    """Mock document upload"""
    app = await db.applications.find_one({"id": application_id}, {"_id": 0})
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    await db.applications.update_one(
        {"id": application_id},
        {"$set": {"documents_uploaded": True}}
    )
    return {"success": True, "message": "Documents uploaded (mock)"}

@api_router.post("/applications/{application_id}/verify-myid")
async def verify_myid(application_id: str):
    """Mock myID verification"""
    app = await db.applications.find_one({"id": application_id}, {"_id": 0})
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    await db.applications.update_one(
        {"id": application_id},
        {"$set": {"myid_verified": True, "status": "submitted"}}
    )
    return {"success": True, "message": "myID verified (mock)"}

@api_router.get("/applications/{application_id}")
async def get_application(application_id: str):
    app = await db.applications.find_one({"id": application_id}, {"_id": 0})
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

# Blog
@api_router.get("/blog", response_model=List[BlogPostResponse])
async def get_blog_posts(category: Optional[str] = None, limit: int = 10):
    query = {}
    if category and category != "all":
        query["category"] = category
    
    posts = await db.blog_posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    
    for post in posts:
        if isinstance(post.get('created_at'), datetime):
            post['created_at'] = post['created_at'].isoformat()
        if isinstance(post.get('updated_at'), datetime):
            post['updated_at'] = post['updated_at'].isoformat()
    
    return posts

@api_router.get("/blog/{slug}", response_model=BlogPostResponse)
async def get_blog_post(slug: str):
    post = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    if isinstance(post.get('created_at'), datetime):
        post['created_at'] = post['created_at'].isoformat()
    if isinstance(post.get('updated_at'), datetime):
        post['updated_at'] = post['updated_at'].isoformat()
    
    return post

# Contact
@api_router.post("/contact")
async def send_contact_message(data: ContactMessageCreate):
    msg = ContactMessage(
        name=data.name,
        email=data.email,
        message=data.message
    )
    
    doc = msg.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contact_messages.insert_one(doc)
    
    return {"success": True, "message": "Message sent successfully"}

# Testimonials
@api_router.get("/testimonials")
async def get_testimonials():
    testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(20)
    return testimonials

# ============ SEED DATA ============

@api_router.post("/seed")
async def seed_database():
    """Seed database with initial data"""
    
    # Clear existing data
    await db.products.delete_many({})
    await db.blog_posts.delete_many({})
    await db.testimonials.delete_many({})
    
    # Products
    products = [
        {
            "id": str(uuid.uuid4()),
            "slug": "business",
            "name_ru": "Для бизнесменов",
            "name_uz": "Tadbirkorlar uchun",
            "name_en": "For Business",
            "description_ru": "До 150 млн без залога, до 1 млрд — под обеспечение*",
            "description_uz": "Garovsiz 150 mln gacha, garov bilan 1 mlrd gacha*",
            "description_en": "Up to 150M without collateral, up to 1B with collateral*",
            "features_ru": ["Решение за 1 день", "Рост бизнеса", "Закупка товаров", "Расширение", "Без скрытых платежей"],
            "features_uz": ["1 kunda qaror", "Biznes o'sishi", "Tovar xaridi", "Kengaytirish", "Yashirin to'lovlarsiz"],
            "features_en": ["Decision in 1 day", "Business growth", "Inventory purchase", "Expansion", "No hidden fees"],
            "min_amount": 5000000,
            "max_amount": 1000000000,
            "min_term": 6,
            "max_term": 60,
            "rate": 24.0,
            "category": "business",
            "image_url": "https://images.unsplash.com/photo-1753351052617-62818ffc9173",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "tezkor",
            "name_ru": "Tezkor кредит",
            "name_uz": "Tezkor kredit",
            "name_en": "Tezkor Credit",
            "description_ru": "Быстрое финансирование для ИП и самозанятых",
            "description_uz": "YaTT va o'z-o'zini band qilganlar uchun tez moliyalashtirish",
            "description_en": "Fast financing for entrepreneurs and self-employed",
            "features_ru": ["До 50 млн без залога", "Без поручителей", "Быстрое решение", "Минимум документов"],
            "features_uz": ["Garovsiz 50 mln gacha", "Kafillarsiz", "Tez qaror", "Minimal hujjatlar"],
            "features_en": ["Up to 50M without collateral", "No guarantors", "Quick decision", "Minimal documents"],
            "min_amount": 1000000,
            "max_amount": 50000000,
            "min_term": 3,
            "max_term": 36,
            "rate": 28.0,
            "category": "tezkor",
            "image_url": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "agro",
            "name_ru": "Агро кредит",
            "name_uz": "Agro kredit",
            "name_en": "Agro Credit",
            "description_ru": "Льготный период до 9 месяцев*",
            "description_uz": "9 oygacha imtiyozli davr*",
            "description_en": "Grace period up to 9 months*",
            "features_ru": ["Льготный период до 9 мес", "Аннуитет или дифференц", "Гибкий график", "Без скрытых комиссий"],
            "features_uz": ["9 oygacha imtiyozli davr", "Annuitet yoki differentsial", "Moslashuvchan jadval", "Yashirin komissiyalarsiz"],
            "features_en": ["Grace period up to 9 months", "Annuity or differential", "Flexible schedule", "No hidden fees"],
            "min_amount": 10000000,
            "max_amount": 500000000,
            "min_term": 12,
            "max_term": 60,
            "rate": 20.0,
            "category": "agro",
            "image_url": "https://images.unsplash.com/photo-1701021934374-df29f8f0ecf0",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "auto",
            "name_ru": "Под залог авто",
            "name_uz": "Avtomobil garovi",
            "name_en": "Auto Pledge",
            "description_ru": "Оценка авто быстро, прозрачные условия",
            "description_uz": "Tez avtomobil baholash, shaffof shartlar",
            "description_en": "Fast car evaluation, transparent terms",
            "features_ru": ["Минимум документов", "Быстрая оценка", "Выгодные условия", "Прозрачный процесс"],
            "features_uz": ["Minimal hujjatlar", "Tez baholash", "Foydali shartlar", "Shaffof jarayon"],
            "features_en": ["Minimal documents", "Quick evaluation", "Favorable terms", "Transparent process"],
            "min_amount": 5000000,
            "max_amount": 200000000,
            "min_term": 6,
            "max_term": 48,
            "rate": 26.0,
            "category": "auto",
            "image_url": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "self-employed",
            "name_ru": "Самозанятым",
            "name_uz": "O'z-o'zini band qilganlar",
            "name_en": "Self-Employed",
            "description_ru": "Простой микрозайм без сложных процедур",
            "description_uz": "Murakkab jarayonlarsiz oddiy mikroqarz",
            "description_en": "Simple microloan without complex procedures",
            "features_ru": ["Быстро и удобно", "Без долгого ожидания", "Простые условия", "Минимальные требования"],
            "features_uz": ["Tez va qulay", "Uzoq kutmasdan", "Oddiy shartlar", "Minimal talablar"],
            "features_en": ["Fast and convenient", "No long waiting", "Simple terms", "Minimal requirements"],
            "min_amount": 500000,
            "max_amount": 20000000,
            "min_term": 3,
            "max_term": 24,
            "rate": 30.0,
            "category": "self_employed",
            "image_url": "https://images.unsplash.com/photo-1521737711867-e3b97375f902",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.products.insert_many(products)
    
    # Blog posts
    blog_posts = [
        {
            "id": str(uuid.uuid4()),
            "slug": "kak-rasschitat-bezopasnyj-ezhem-platezh",
            "title_ru": "Как рассчитать безопасный ежемесячный платёж для бизнеса",
            "title_uz": "Biznes uchun xavfsiz oylik to'lovni qanday hisoblash",
            "title_en": "How to Calculate a Safe Monthly Payment for Business",
            "excerpt_ru": "Узнайте, как определить комфортный размер платежа, не рискуя финансовой стабильностью бизнеса.",
            "excerpt_uz": "Biznesning moliyaviy barqarorligiga xavf solmasdan qulay to'lov miqdorini qanday aniqlashni bilib oling.",
            "excerpt_en": "Learn how to determine a comfortable payment amount without risking your business financial stability.",
            "content_ru": "# Как рассчитать безопасный платёж\n\nПри оформлении кредита важно правильно оценить свои возможности.\n\n## Правило 30%\n\nОптимальный ежемесячный платёж не должен превышать 30% от чистой прибыли бизнеса.\n\n## Учитывайте сезонность\n\nЕсли ваш бизнес подвержен сезонным колебаниям, планируйте платежи с запасом.\n\n## Чек-лист:\n- Рассчитайте среднюю месячную прибыль за последние 6 месяцев\n- Вычтите обязательные расходы\n- От оставшейся суммы возьмите 30%\n- Это ваш безопасный платёж",
            "content_uz": "# Xavfsiz to'lovni qanday hisoblash\n\nKredit olishda imkoniyatlaringizni to'g'ri baholash muhim.\n\n## 30% qoidasi\n\nOptimal oylik to'lov biznesning sof foydasining 30% dan oshmasligi kerak.\n\n## Mavsumiylikni hisobga oling\n\nAgar biznesingiz mavsumiy o'zgarishlarga bog'liq bo'lsa, to'lovlarni zaxira bilan rejalashtiring.",
            "content_en": "# How to Calculate Safe Payment\n\nWhen applying for a loan, it's important to properly assess your capabilities.\n\n## The 30% Rule\n\nThe optimal monthly payment should not exceed 30% of business net profit.\n\n## Consider Seasonality\n\nIf your business is subject to seasonal fluctuations, plan payments with a buffer.",
            "category": "financial",
            "image_url": "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
            "author": "Oasis Credit",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "oborotnyj-kapital-chto-eto",
            "title_ru": "Оборотный капитал: что это и почему бизнес 'застревает'",
            "title_uz": "Aylanma kapital: bu nima va nega biznes 'tiqilib qoladi'",
            "title_en": "Working Capital: What It Is and Why Business Gets Stuck",
            "excerpt_ru": "Разбираемся, почему даже прибыльный бизнес может испытывать кассовые разрывы.",
            "excerpt_uz": "Hatto foydali biznes ham nima uchun naqd pul tanqisligini boshdan kechirishini tushunamiz.",
            "excerpt_en": "Understanding why even profitable businesses can experience cash flow gaps.",
            "content_ru": "# Оборотный капитал\n\nОборотный капитал — это деньги, которые 'крутятся' в бизнесе каждый день.\n\n## Почему возникают кассовые разрывы\n\nДаже при хорошей выручке деньги могут быть 'заморожены' в товаре или дебиторке.\n\n## Как решить проблему\n\nОборотный кредит помогает поддерживать ликвидность без ущерба для операций.",
            "content_uz": "# Aylanma kapital\n\nAylanma kapital — bu biznesda har kuni 'aylanib yuradigan' pullar.",
            "content_en": "# Working Capital\n\nWorking capital is the money that 'circulates' in business every day.",
            "category": "business",
            "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
            "author": "Oasis Credit",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "sezonnost-v-agro",
            "title_ru": "Сезонность в агро: как планировать кассовые разрывы",
            "title_uz": "Agroda mavsumiylik: naqd pul tanqisligini qanday rejalashtirish",
            "title_en": "Seasonality in Agro: How to Plan for Cash Flow Gaps",
            "excerpt_ru": "Советы для фермеров по управлению финансами между посевной и сбором урожая.",
            "excerpt_uz": "Fermerlar uchun ekish va hosilni yig'ish orasida moliyani boshqarish bo'yicha maslahatlar.",
            "excerpt_en": "Tips for farmers on managing finances between planting and harvest.",
            "content_ru": "# Сезонность в агробизнесе\n\nАгробизнес уникален тем, что доходы приходят волнами.\n\n## Льготный период\n\nАгрокредит с льготным периодом до 9 месяцев позволяет платить после сбора урожая.\n\n## Планирование\n\n- Рассчитайте расходы на посевную\n- Оцените ожидаемый урожай\n- Заложите резерв 20% на непредвиденные расходы",
            "content_uz": "# Agrobiznesdа mavsumiylik\n\nAgrobiznes daromadlar to'lqinlar bilan kelishi bilan noyobdir.",
            "content_en": "# Seasonality in Agribusiness\n\nAgribusiness is unique in that income comes in waves.",
            "category": "agro",
            "image_url": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449",
            "author": "Oasis Credit",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "samozanyatyj-kak-otdelyat-dengi",
            "title_ru": "Самозанятый: как отделять личные деньги от денег бизнеса",
            "title_uz": "O'z-o'zini band qilgan: shaxsiy pullarni biznes pullaridan qanday ajratish",
            "title_en": "Self-Employed: How to Separate Personal Money from Business Money",
            "excerpt_ru": "Простые правила финансовой дисциплины для самозанятых и ИП.",
            "excerpt_uz": "O'z-o'zini band qilganlar va YaTT uchun moliyaviy intizomning oddiy qoidalari.",
            "excerpt_en": "Simple financial discipline rules for self-employed and entrepreneurs.",
            "content_ru": "# Разделение финансов\n\nОдна из главных ошибок самозанятых — смешивание личных и бизнес-финансов.\n\n## Отдельный счёт\n\nОткройте отдельный счёт для бизнеса.\n\n## Фиксированная зарплата себе\n\nУстановите себе 'зарплату' и придерживайтесь её.",
            "content_uz": "# Moliyalarni ajratish\n\nO'z-o'zini band qilganlarning asosiy xatolaridan biri - shaxsiy va biznes moliyalarini aralashtirish.",
            "content_en": "# Separating Finances\n\nOne of the main mistakes of self-employed is mixing personal and business finances.",
            "category": "selfEmployed",
            "image_url": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
            "author": "Oasis Credit",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "kak-rabotaet-myid",
            "title_ru": "Как работает идентификация myID и зачем она нужна",
            "title_uz": "myID identifikatsiyasi qanday ishlaydi va u nima uchun kerak",
            "title_en": "How myID Identification Works and Why It's Needed",
            "excerpt_ru": "Всё о государственной системе идентификации для получения финансовых услуг.",
            "excerpt_uz": "Moliyaviy xizmatlarni olish uchun davlat identifikatsiya tizimi haqida hamma narsa.",
            "excerpt_en": "Everything about the government identification system for obtaining financial services.",
            "content_ru": "# Идентификация myID\n\nmyID — это государственная система электронной идентификации граждан Узбекистана.\n\n## Как пройти идентификацию\n\n1. Скачайте приложение myID\n2. Зарегистрируйтесь с паспортными данными\n3. Пройдите верификацию лица\n4. Используйте для подтверждения личности",
            "content_uz": "# myID identifikatsiyasi\n\nmyID — O'zbekiston fuqarolarini elektron identifikatsiya qilish davlat tizimi.",
            "content_en": "# myID Identification\n\nmyID is the government electronic identification system for citizens of Uzbekistan.",
            "category": "financial",
            "image_url": "https://images.unsplash.com/photo-1563986768609-322da13575f3",
            "author": "Oasis Credit",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.blog_posts.insert_many(blog_posts)
    
    # Testimonials
    testimonials = [
        {
            "id": str(uuid.uuid4()),
            "name": "Азиз К.",
            "business": "Магазин стройматериалов",
            "text_ru": "Получил кредит за 2 дня. Всё прозрачно, менеджер объяснил каждый пункт договора. Рекомендую!",
            "text_uz": "2 kunda kredit oldim. Hammasi shaffof, menejer shartnomaning har bir bandini tushuntirdi. Tavsiya qilaman!",
            "text_en": "Got the loan in 2 days. Everything is transparent, the manager explained every point of the contract. I recommend!",
            "rating": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Малика Р.",
            "business": "Фермерское хозяйство",
            "text_ru": "Агрокредит с льготным периодом — именно то, что нужно для сезонного бизнеса. Спасибо за понимание специфики.",
            "text_uz": "Imtiyozli muddatli agro kredit - mavsumiy biznes uchun aynan kerakli narsa. Xususiyatni tushunganingiz uchun rahmat.",
            "text_en": "Agro credit with a grace period is exactly what seasonal business needs. Thanks for understanding the specifics.",
            "rating": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Бахтияр Н.",
            "business": "Такси-сервис",
            "text_ru": "Оформил кредит под залог авто быстро и без проблем. Оценщик приехал в тот же день.",
            "text_uz": "Avtomobil garovi ostida kreditni tez va muammosiz rasmiylashtirdim. Baholovchi o'sha kuni keldi.",
            "text_en": "Got a car pledge loan quickly and without problems. The appraiser came the same day.",
            "rating": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Дильноза А.",
            "business": "Онлайн-магазин",
            "text_ru": "Tezkor кредит помог закупить товар к сезону. Деньги получила на следующий день после заявки.",
            "text_uz": "Tezkor kredit mavsumga tovar xarid qilishga yordam berdi. Arizadan keyingi kuni pul oldim.",
            "text_en": "Tezkor credit helped buy inventory for the season. Got the money the next day after the application.",
            "rating": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.testimonials.insert_many(testimonials)
    
    return {"success": True, "message": "Database seeded successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
