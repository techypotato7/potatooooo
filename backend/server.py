from fastapi import FastAPI, APIRouter, Request, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import time
import logging
import httpx
from pathlib import Path
from collections import defaultdict, deque
from pydantic import BaseModel, Field, EmailStr, ConfigDict, constr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta


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

IST = timezone(timedelta(hours=5, minutes=30))


# ---- Security headers ----
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


# ---- Rate limiter ----
_RATE = defaultdict(deque)
RATE_LIMIT = 5
RATE_WINDOW = 600


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
    services: List[str] = Field(default_factory=list)
    message: str
    ip: Optional[str] = ""
    whatsapp_sent: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeadCreate(BaseModel):
    name: constr(strip_whitespace=True, min_length=1, max_length=120)
    email: EmailStr
    phone: constr(strip_whitespace=True, max_length=40) = ""
    services: List[constr(strip_whitespace=True, max_length=120)] = Field(default_factory=list, max_length=30)
    message: constr(strip_whitespace=True, min_length=1, max_length=4000)
    company_website: Optional[str] = ""   # honeypot


async def send_whatsapp_notification(lead: Lead) -> bool:
    """Send a WhatsApp notification to the business owner. Graceful no-op if unconfigured."""
    token = os.environ.get("WHATSAPP_ACCESS_TOKEN")
    phone_id = os.environ.get("WHATSAPP_PHONE_NUMBER_ID")
    recipient = os.environ.get("WHATSAPP_RECIPIENT_NUMBER")
    api_version = os.environ.get("WHATSAPP_API_VERSION", "v25.0")
    template_name = os.environ.get("WHATSAPP_TEMPLATE_NAME")
    template_lang = os.environ.get("WHATSAPP_TEMPLATE_LANGUAGE", "en_US")

    if not (token and phone_id and recipient):
        logger.info("WhatsApp not configured; notification skipped (lead saved).")
        return False

    endpoint = f"https://graph.facebook.com/{api_version}/{phone_id}/messages"
    submitted = datetime.now(IST).strftime("%d %b %Y, %I:%M %p IST")
    services = ", ".join(lead.services) if lead.services else "Not specified"

    if template_name:
        # Business-initiated: requires an approved Utility template with 7 body variables.
        values = [lead.name, lead.email, lead.phone or "N/A", services, lead.message, submitted, lead.ip or "N/A"]
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": recipient,
            "type": "template",
            "template": {
                "name": template_name,
                "language": {"code": template_lang},
                "components": [{
                    "type": "body",
                    "parameters": [{"type": "text", "text": str(v)} for v in values],
                }],
            },
        }
    else:
        # Free-form text (only delivers inside the 24h customer-service window — good for testing).
        body = (
            "🥔 *New Lead — Techy Potato*\n\n"
            f"👤 *Name:* {lead.name}\n"
            f"📧 *Email:* {lead.email}\n"
            f"📱 *Phone:* {lead.phone or 'N/A'}\n"
            f"🧩 *Services:* {services}\n"
            f"📝 *Project:* {lead.message}\n"
            f"🕒 *Submitted:* {submitted}\n"
            f"🌐 *IP:* {lead.ip or 'N/A'}"
        )
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": recipient,
            "type": "text",
            "text": {"preview_url": False, "body": body},
        }

    try:
        async with httpx.AsyncClient(timeout=10.0) as http:
            resp = await http.post(
                endpoint,
                headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
                json=payload,
            )
        if resp.is_success:
            logger.info("WhatsApp notification accepted by Meta.")
            return True
        logger.error("WhatsApp send failed: status=%s body=%s", resp.status_code, resp.text[:400])
        return False
    except httpx.HTTPError as exc:
        logger.error("WhatsApp request error: %s", exc)
        return False


@api_router.get("/")
async def root():
    return {"message": "Techy Potato API is live"}


@api_router.post("/contact", response_model=Lead)
async def create_lead(payload: LeadCreate, request: Request):
    # honeypot — silently accept without storing or notifying
    if payload.company_website:
        logger.info("Honeypot triggered from %s — dropping submission", _client_ip(request))
        return Lead(name=payload.name, email=payload.email, phone=payload.phone,
                    services=payload.services, message=payload.message)

    ip = _client_ip(request)
    if not _rate_ok(ip):
        logger.warning("Rate limit hit for %s", ip)
        raise HTTPException(status_code=429, detail="Too many submissions. Please try again later.")

    lead = Lead(
        name=payload.name, email=payload.email, phone=payload.phone,
        services=payload.services, message=payload.message, ip=ip,
    )
    # Persist first — a WhatsApp/Meta outage must never lose the lead.
    await db.leads.insert_one(lead.model_dump())
    lead.whatsapp_sent = await send_whatsapp_notification(lead)
    await db.leads.update_one({"id": lead.id}, {"$set": {"whatsapp_sent": lead.whatsapp_sent}})
    logger.info("New lead captured: %s <%s> | whatsapp_sent=%s", lead.name, lead.email, lead.whatsapp_sent)
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
