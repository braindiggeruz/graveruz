from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, validator
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import httpx
import re


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
TELEGRAM_CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    company: Optional[str] = None
    quantity: Optional[str] = None
    description: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "new"  # new, contacted, completed

class LeadCreate(BaseModel):
    name: str
    phone: str
    company: Optional[str] = None
    quantity: Optional[str] = None
    description: str
    
    @validator('phone')
    def validate_phone(cls, v):
        # Uzbek phone format: +998 XX XXX XX XX
        phone_pattern = re.compile(r'^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$')
        if not phone_pattern.match(v):
            raise ValueError('Неверный формат телефона. Используйте: +998 XX XXX XX XX')
        return v
    
    @validator('name')
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Имя должно содержать минимум 2 символа')
        return v.strip()
    
    @validator('description')
    def validate_description(cls, v):
        if len(v.strip()) < 10:
            raise ValueError('Описание должно содержать минимум 10 символов')
        return v.strip()

# Telegram Bot Functions
async def send_telegram_message(message: str):
    """Send message to Telegram bot"""
    try:
        chat_id = TELEGRAM_CHAT_ID
        
        if not chat_id:
            logger.error("TELEGRAM_CHAT_ID not configured in environment")
            return False
        
        logger.info(f"Attempting to send Telegram message to chat_id: {chat_id[:4]}***")
        
        # Send message
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
                json={
                    "chat_id": chat_id,
                    "text": message,
                    "parse_mode": "HTML"
                }
            )
            data = response.json()
            
            if data.get('ok'):
                logger.info("✅ Telegram notification sent successfully")
                return True
            else:
                logger.error(f"❌ Telegram API error: {data.get('error_code')} - {data.get('description')}")
                return False
                
    except httpx.TimeoutException:
        logger.error("❌ Telegram API timeout")
        return False
    except Exception as e:
        logger.error(f"❌ Error sending Telegram message: {str(e)}")
        return False

def format_lead_message(lead: Lead) -> str:
    """Format lead data for Telegram message"""
    message = f"""
🔔 <b>Новая заявка с сайта Graver.uz</b>

👤 <b>Имя:</b> {lead.name}
📱 <b>Телефон:</b> {lead.phone}
"""
    if lead.company:
        message += f"🏢 <b>Компания:</b> {lead.company}\n"
    if lead.quantity:
        message += f"📦 <b>Тираж:</b> {lead.quantity} шт\n"
    
    message += f"""
📝 <b>Описание:</b>
{lead.description}

⏰ <b>Время:</b> {lead.timestamp.strftime('%d.%m.%Y %H:%M')}
🆔 <b>ID заявки:</b> {lead.id}

<i>Свяжитесь с клиентом в течение 15 минут!</i>
"""
    return message


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Graver.uz API v1.0"}

@api_router.post("/leads", response_model=Lead)
async def create_lead(input: LeadCreate):
    """Create new lead and send to Telegram"""
    try:
        # Create lead object
        lead_dict = input.model_dump()
        lead_obj = Lead(**lead_dict)
        
        logger.info(f"📥 New lead received: {lead_obj.name} | {lead_obj.phone[:8]}***")
        
        # Save to MongoDB
        doc = lead_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        
        result = await db.leads.insert_one(doc)
        logger.info(f"💾 Lead saved to DB: {lead_obj.id}")
        
        # Send to Telegram
        message = format_lead_message(lead_obj)
        telegram_sent = await send_telegram_message(message)
        
        if not telegram_sent:
            logger.warning("⚠️ Telegram notification failed, but lead saved to DB")
            # Still return 200 because lead is saved
        
        return lead_obj
        
    except Exception as e:
        logger.error(f"❌ Error creating lead: {str(e)}")
        raise HTTPException(status_code=500, detail="Ошибка при создании заявки")

@api_router.get("/leads", response_model=List[Lead])
async def get_leads(limit: int = 100):
    """Get all leads"""
    leads = await db.leads.find({}, {"_id": 0}).sort("timestamp", -1).to_list(limit)
    
    # Convert ISO string timestamps back to datetime objects
    for lead in leads:
        if isinstance(lead['timestamp'], str):
            lead['timestamp'] = datetime.fromisoformat(lead['timestamp'])
    
    return leads

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

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