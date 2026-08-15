from fastapi import FastAPI, APIRouter, Request, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import time
import logging
from pathlib import Path
from collections import defaultdict, deque
from pydantic import BaseModel, Field, EmailStr, ConfigDict, constr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---- Security headers middleware ----
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-Permitted-Cross-Domain-Policies"] = "none"
        return response


# ---- Simple in-memory rate limiter for contact submissions ----
_RATE = defaultdict(deque)
RATE_LIMIT = 5          # max submissions
RATE_WINDOW = 600       # per 10 minutes


def _client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _rate_ok(ip: str) -> bool:
    now = time.time()
    q = _RATE[ip]
    while q and now - q[0] > RATE_WINDOW:
        q.popleft()
    if len(q) >= RATE_LIMIT:
        return False
    q.append(now)
    return True


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    service: Optional[str] = ""
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeadCreate(BaseModel):
    name: constr(strip_whitespace=True, min_length=1, max_length=100)
    email: EmailStr
    phone: constr(strip_whitespace=True, max_length=30) = ""
    service: constr(strip_whitespace=True, max_length=120) = ""
    message: constr(strip_whitespace=True, min_length=1, max_length=2000)
    # honeypot: real users leave this empty; bots tend to fill it
    company_website: Optional[str] = ""


@api_router.get("/")
async def root():
    return {"message": "Techy Potato API is live"}


@api_router.post("/contact", response_model=Lead)
async def create_lead(payload: LeadCreate, request: Request):
    # spam honeypot — silently accept without storing
    if payload.company_website:
        logger.info("Honeypot triggered from %s — dropping submission", _client_ip(request))
        return Lead(name=payload.name, email=payload.email, phone=payload.phone,
                    service=payload.service, message=payload.message)

    ip = _client_ip(request)
    if not _rate_ok(ip):
        logger.warning("Rate limit hit for %s", ip)
        raise HTTPException(status_code=429, detail="Too many submissions. Please try again later.")

    lead = Lead(
        name=payload.name, email=payload.email, phone=payload.phone,
        service=payload.service, message=payload.message,
    )
    await db.leads.insert_one(lead.model_dump())
    logger.info("New lead captured: %s <%s>", lead.name, lead.email)
    return lead


@api_router.get("/contact", response_model=List[Lead])
async def list_leads():
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return leads


app.include_router(api_router)

app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
