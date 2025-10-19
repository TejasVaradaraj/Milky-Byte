# main.py
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import pandas as pd
import numpy as np
from datetime import datetime
import re, requests
import os, smtplib
from email.message import EmailMessage
from urllib.parse import quote

from dotenv import load_dotenv
load_dotenv()  # loads .env into process env


# =========================
# CONFIG / DATA LOAD
# =========================
DF_PATH = "cars_priced.csv"
df = pd.read_csv(DF_PATH)

# After df is loaded and columns normalized
df = df.reset_index(drop=True).copy()
df["id"] = df.index.astype(int)

app = FastAPI(title="Toyota Finance API")

# CORS (add or remove origins as needed)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3002",
    "https://*.vercel.app",  # Allow all Vercel preview deployments
    "https://vercel.app",     # Allow Vercel production
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex=r"https://.*\.vercel\.app",  # Support wildcard for Vercel
)

# Automotive image providers (no API call needed for Imagin URL; CarImagery is optional fallback)
IMAGIN_CUSTOMER = "demo"  # TODO: replace with your (free) imagin.studio customer key when available
IMAGIN_BASE = "https://cdn.imagin.studio/getImage"
CARIMAGERY_BASE = "https://www.carimagery.com/api.asmx/GetImageUrl"  # returns XML-ish text

# Ensure expected columns exist and types are sane
EXPECTED_COLS = {
    "price": 0.0,
    "mpg_combined": 0.0,
    "mileage": 0.0,
    "year": 2000,
    "horsepower": 0.0,
    "make": "Toyota",
    "model": "",
    "fuel_type": "",
    "body_type": "",
}
for col, default in EXPECTED_COLS.items():
    if col not in df.columns:
        df[col] = default

for num_col in ["price", "mpg_combined", "mileage", "year", "horsepower"]:
    df[num_col] = pd.to_numeric(df[num_col], errors="coerce")

VALID_SORTS = ["price", "mpg_combined", "mileage", "year", "horsepower"]

def safe_sort_key(key: str) -> str:
    return key if key in VALID_SORTS and key in df.columns else "price"

# =========================
# IMAGE HELPERS
# =========================
_image_cache = {}

def _model_family(model: str) -> str:
    """
    Extract a model family token for Imagin (e.g., 'RAV4', '4Runner', 'Camry').
    Strips common trim words; keeps alphanumerics so 'GR86'/'bZ4X' work.
    """
    if not model:
        return ""
    clean = re.sub(
        r"(Hybrid|Prime|TRD|XSE|XLE|SE|LE|L|SR|SR5|Limited|Platinum|Base|Adventure|Nightshade|Trail|Capstone)",
        "",
        str(model),
        flags=re.I,
    )
    tokens = re.findall(r"[A-Za-z0-9]+", clean)
    return tokens[0] if tokens else str(model).strip()

def imagin_url(make: str, model: str, year: int, angle: int = 23) -> str:
    fam = _model_family(model)
    return (
        f"{IMAGIN_BASE}?customer={IMAGIN_CUSTOMER}"
        f"&make={requests.utils.quote(make or 'Toyota')}"
        f"&modelFamily={requests.utils.quote(fam)}"
        f"&modelYear={int(year) if year else 2022}"
        f"&angle={int(angle)}&zoomType=fullscreen"
    )

def carimagery_url(make: str, model: str, year: int) -> Optional[str]:
    try:
        q = f"{make} {model} {year}"
        r = requests.get(CARIMAGERY_BASE, params={"searchTerm": q}, timeout=12)
        r.raise_for_status()
        m = re.search(r"(https?://[^\s<]+)", r.text)
        return m.group(1) if m else None
    except Exception:
        return None

def attach_image(record: dict, angle: int = 23) -> dict:
    """Return a copy of record with an 'image' url added (Imagin)."""
    make = record.get("make", "Toyota") or "Toyota"
    md = record.get("model", "") or ""
    yr = int(record.get("year", 2022) or 2022)
    out = dict(record)
    out["image"] = imagin_url(make, md, yr, angle=angle)
    return out

# =========================
# FINANCE HELPERS
# =========================
def monthly_payment(price: float, apr_percent: float, months: int, downpayment: float = 0.0) -> float:
    L = max(float(price) - float(downpayment), 0.0)
    r = (float(apr_percent) / 100.0) / 12.0
    if months <= 0:
        return 0.0
    if r == 0:
        return round(L / months, 2)
    pmt = L * r * (1 + r) ** months / ((1 + r) ** months - 1)
    return round(pmt, 2)

def depreciation_value(price: float, years: float) -> float:
    """Estimate car value after n years. Toyota avg annual dep ~13%."""
    rate = 0.13
    return round(float(price) * ((1 - rate) ** float(years)), 2)

def apr_from_credit(credit_score: int) -> float:
    if credit_score >= 760: return 3.5
    if credit_score >= 720: return 4.2
    if credit_score >= 660: return 6.0
    if credit_score >= 620: return 8.0
    return 10.5

def finance_snapshot(price: float, credit_score: int = 720, months: int = 60, downpayment: float = 0.0):
    apr = apr_from_credit(credit_score)
    monthly = monthly_payment(price, apr, months, downpayment)
    return {
        "apr_percent": round(apr, 2),
        "months": months,
        "downpayment": round(downpayment, 2),
        "monthly_payment": monthly,
        "total_paid": round(monthly * months + downpayment, 2),
    }

def compose_email_body(car: dict, finance: dict) -> str:
    lines = [
        f"Your Toyota pick: {car.get('year')} {car.get('model')} (${int(car.get('price',0)):,})",
        f"MPG (combined): {car.get('mpg_combined')}   HP: {car.get('horsepower')}   Mileage: {car.get('mileage')}",
        f"APR: {finance['apr_percent']}%   Months: {finance['months']}   Down: ${finance['downpayment']:,}",
        f"Estimated monthly payment: ${finance['monthly_payment']:,}",
        f"Total paid (loan): ${finance['total_paid']:,}",
        f"Image: {car.get('image')}",
        "",
        "— Sent via Celestial Toyota Selector ⚝"
    ]
    return "\n".join(lines)


# =========================
# ROUTES
# =========================
@app.get("/")
def home():
    return {"message": "Toyota Finance API running", "rows": int(len(df))}

@app.get("/health")
def health():
    return {"ok": True, "rows": int(len(df)), "columns": list(df.columns)}

@app.get("/cars")
def get_cars(
    sort_by: str = Query("price"),
    order: str = Query("asc"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """Return car list sorted by a chosen field, with images and pagination."""
    key = safe_sort_key(sort_by)
    asc = (order == "asc")
    dff = df.sort_values(by=key, ascending=asc)
    total = int(len(dff))
    page = dff.iloc[offset : offset + limit].to_dict(orient="records")
    page = [attach_image(r) for r in page]
    return {"count": total, "results": page, "offset": offset, "limit": limit}

@app.get("/filter")
def filter_cars(
    q: Optional[str] = Query(None, description="Free-text model search"),
    price_min: float = Query(0, description="Minimum price"),
    price_max: float = Query(100000, description="Maximum price"),
    hp_min: float = Query(0, description="Minimum horsepower"),
    hp_max: float = Query(1000, description="Maximum horsepower"),
    mil_min: float = Query(0, description="Minimum mileage"),
    mil_max: float = Query(300000, description="Maximum mileage"),
    year: Optional[int] = Query(None, description="Specific year"),
    sort_by: str = Query("price", description="Field to sort by"),
    order: str = Query("asc", description="asc or desc"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """Filter cars across multiple facets; returns images and pagination meta."""
    dff = df.copy()

    if q:
        dff = dff[dff["model"].astype(str).str.contains(q, case=False, na=False)]

    # NaN-safe numeric filters
    dff["price"] = dff["price"].fillna(0)
    dff["horsepower"] = dff["horsepower"].fillna(0)
    dff["mileage"] = dff["mileage"].fillna(0)

    dff = dff[
        (dff["price"] >= price_min) & (dff["price"] <= price_max) &
        (dff["horsepower"] >= hp_min) & (dff["horsepower"] <= hp_max) &
        (dff["mileage"] >= mil_min) & (dff["mileage"] <= mil_max)
    ]

    if year is not None:
        dff = dff[dff["year"] == year]

    key = safe_sort_key(sort_by)
    asc = (order == "asc")
    dff = dff.sort_values(by=key, ascending=asc)

    total = int(len(dff))
    page = dff.iloc[offset : offset + limit].to_dict(orient="records")
    page = [attach_image(r) for r in page]
    return {"count": total, "results": page, "offset": offset, "limit": limit}

@app.get("/apr")
def calculate_apr(
    credit_score: int = 720,
    price: Optional[float] = None,
    months: int = 60,
    downpayment: float = 0.0,
):
    """Loan APR calculator — safe default values if none provided."""
    price = float(price) if price is not None else 30000.0
    apr = apr_from_credit(credit_score)
    monthly = monthly_payment(price, apr, months, downpayment)
    return {
        "apr_percent": apr,
        "price_used": price,
        "monthly_payment": monthly,
        "total_paid": round(monthly * months, 2),
    }

@app.get("/lease")
def lease_calculator(
    price: Optional[float] = None,
    credit_score: int = 720,
    months: int = 36,
    downpayment: float = 0.0,
):
    """Estimate lease even without a selected car."""
    price = float(price) if price is not None else 30000.0
    apr = apr_from_credit(credit_score)
    residual_value = depreciation_value(price, months / 12.0)
    depreciation_fee = (price - residual_value) / months
    finance_fee = (price + residual_value) * (apr / 100.0) / 24.0
    monthly = depreciation_fee + finance_fee - (downpayment / months)
    return {
        "apr_percent": apr,
        "price_used": price,
        "residual_value": round(residual_value, 2),
        "monthly_lease": round(monthly, 2),
        "total_paid": round(monthly * months + downpayment, 2),
    }

@app.get("/loan")
def loan_options(
    price: Optional[float] = None,
    credit_score: int = 720,
    months: int = 60,
):
    """Return standard & special Toyota loan options — safe defaults."""
    price = float(price) if price is not None else 30000.0
    apr = apr_from_credit(credit_score)
    down_req = 0.0
    program = "Standard Toyota Finance"

    if credit_score < 650:
        down_req = price * 0.10
    if credit_score < 600:
        down_req = price * 0.20

    options = {
        "student": {"apr_adj": -0.3, "desc": "College Grad Rebate Program"},
        "military": {"apr_adj": -0.5, "desc": "Toyota Military Rebate"},
        "elderly": {"apr_adj": -0.2, "desc": "Senior Customer Loyalty Discount"},
    }

    available = {}
    for key, val in options.items():
        apr_final = max(2.0, apr + val["apr_adj"])
        monthly = monthly_payment(price, apr_final, months, down_req)
        available[key] = {
            "program": val["desc"],
            "apr_percent": round(apr_final, 2),
            "down_required": round(down_req, 2),
            "monthly_payment": monthly,
            "total_paid": round(monthly * months, 2),
        }

    standard_monthly = monthly_payment(price, apr, months, down_req)
    return {
        "standard": {
            "program": program,
            "apr_percent": apr,
            "price_used": price,
            "down_required": round(down_req, 2),
            "monthly_payment": standard_monthly,
            "total_paid": round(standard_monthly * months, 2),
        },
        "special_programs": available,
    }

@app.get("/demo")
def demo_examples():
    """Provide sample outputs for the frontend to load at startup."""
    sample_price = 30000.0
    sample_credit = 720
    lease = lease_calculator(price=sample_price, credit_score=sample_credit)
    loan = loan_options(price=sample_price, credit_score=sample_credit)
    apr = calculate_apr(credit_score=sample_credit, price=sample_price)
    return {"sample_price": sample_price, "lease": lease, "loan": loan, "apr": apr}

@app.get("/car/{car_id}")
def get_car(car_id: int):
    row = df[df["id"] == car_id]
    if row.empty:
        return {"error": "not found"}
    rec = row.iloc[0].to_dict()
    rec = attach_image(rec)
    return rec

@app.get("/compare")
def compare(
    id1: int,
    id2: int,
    credit_score: int = 720,
    months: int = 60,
    downpayment: float = 0.0
):
    # fetch rows
    a = df[df["id"] == id1]
    b = df[df["id"] == id2]
    if a.empty or b.empty:
        return {"error": "one_or_both_not_found", "ids": [id1, id2]}

    a = attach_image(a.iloc[0].to_dict())
    b = attach_image(b.iloc[0].to_dict())

    # finance
    a_fin = finance_snapshot(float(a.get("price", 30000) or 30000), credit_score, months, downpayment)
    b_fin = finance_snapshot(float(b.get("price", 30000) or 30000), credit_score, months, downpayment)

    # quick diffs (positive means A > B)
    def diff(key): 
        try:
            return round((float(a.get(key) or 0) - float(b.get(key) or 0)), 2)
        except Exception:
            return None

    diffs = {
        "price_diff": diff("price"),
        "mpg_combined_diff": diff("mpg_combined"),
        "horsepower_diff": diff("horsepower"),
        "mileage_diff": diff("mileage"),
        "year_diff": diff("year"),
        "monthly_payment_diff": round(a_fin["monthly_payment"] - b_fin["monthly_payment"], 2),
    }

    return {
        "inputs": {"credit_score": credit_score, "months": months, "downpayment": downpayment},
        "carA": a, "financeA": a_fin,
        "carB": b, "financeB": b_fin,
        "diffs": diffs
    }

@app.post("/share_email")
def share_email(
    to_email: str,
    car_id: int,
    credit_score: int = 720,
    months: int = 60,
    downpayment: float = 0.0
):
    row = df[df["id"] == car_id]
    if row.empty:
        return {"ok": False, "error": "car_not_found"}

    car = attach_image(row.iloc[0].to_dict())
    finance = finance_snapshot(float(car.get("price", 30000) or 30000), credit_score, months, downpayment)
    body = compose_email_body(car, finance)
    subject = f"Your {car.get('year')} {car.get('model')} quote"

    # Try SMTP if env vars provided
    host = os.getenv("SMTP_HOST")
    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.getenv("SMTP_USER")
    pwd  = os.getenv("SMTP_PASS")
    from_addr = os.getenv("FROM_EMAIL", user or "no-reply@example.com")

    if host and user and pwd:
        try:
            msg = EmailMessage()
            msg["From"] = from_addr
            msg["To"] = to_email
            msg["Subject"] = subject
            msg.set_content(body)
            with smtplib.SMTP(host, port, timeout=15) as s:
                s.starttls()
                s.login(user, pwd)
                s.send_message(msg)
            return {"ok": True, "sent_via": "smtp"}
        except Exception as e:
            # fall through to mailto if SMTP fails
            pass

    # Fallback: return mailto link for the frontend to open
    mailto = f"mailto:{to_email}?subject={quote(subject)}&body={quote(body)}"
    return {"ok": True, "sent_via": "mailto", "mailto": mailto, "preview": {"subject": subject, "body": body}}

# Image endpoints
@app.get("/image")
def get_image_url(make: str, model: str, year: int, angle: int = 23):
    """
    Returns a best-effort image URL (Imagin). Deterministic; no fetch needed.
    """
    key = (make.lower(), model.lower(), int(year), int(angle))
    if key in _image_cache:
        return {"url": _image_cache[key], "source": "cache"}

    url = imagin_url(make, model, year, angle=angle)
    _image_cache[key] = url
    return {"url": url, "source": "imagin"}

@app.get("/image_fallback")
def get_image_url_with_fallback(make: str, model: str, year: int, angle: int = 23):
    """
    Returns Imagin URL; if HEAD check fails, tries CarImagery once.
    """
    key = (make.lower(), model.lower(), int(year), int(angle))
    if key in _image_cache:
        return {"url": _image_cache[key], "source": "cache"}

    primary_url = imagin_url(make, model, year, angle=angle)
    try:
        h = requests.head(primary_url, timeout=6)
        if h.status_code // 100 == 2:
            _image_cache[key] = primary_url
            return {"url": primary_url, "source": "imagin"}
    except Exception:
        pass

    alt = carimagery_url(make, model, year)
    if alt:
        _image_cache[key] = alt
        return {"url": alt, "source": "carimagery"}

    _image_cache[key] = primary_url
    return {"url": primary_url, "source": "imagin"}

@app.get("/__routes")
def __routes():
    return [r.path for r in app.routes]

