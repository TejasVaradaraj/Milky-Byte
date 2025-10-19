# main.py
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from datetime import datetime

# ---------- LOAD DATA ----------
df = pd.read_csv("cars_priced.csv")
app = FastAPI(title="Toyota Finance API")

# ---------- CORS ----------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3002"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ---------- HELPERS ----------
def monthly_payment(price, apr_percent, months, downpayment=0.0):
    L = max(price - downpayment, 0.0)
    r = (apr_percent / 100) / 12
    if months <= 0:
        return 0
    if r == 0:
        return round(L / months, 2)
    pmt = L * r * (1 + r)**months / ((1 + r)**months - 1)
    return round(pmt, 2)

def depreciation_value(price, years):
    """Estimate car value after n years."""
    rate = 0.13
    return round(price * ((1 - rate) ** years), 2)

def apr_from_credit(credit_score):
    """Map credit score → APR."""
    if credit_score >= 760: return 3.5
    if credit_score >= 720: return 4.2
    if credit_score >= 660: return 6.0
    if credit_score >= 620: return 8.0
    return 10.5

# ---------- ROUTES ----------
@app.get("/")
def home():
    return {"message": "Toyota Finance API running"}

@app.get("/cars")
def get_cars(
    sort_by: str = Query("price", description="Field to sort by"),
    order: str = Query("asc", description="asc or desc"),
    limit: int = Query(50, description="Number of results to return")
):
    """Return car list sorted by a chosen field."""
    valid = ["price", "mpg_combined", "mileage", "year", "horsepower"]
    if sort_by not in valid:
        sort_by = "price"
    df_sorted = df.sort_values(by=sort_by, ascending=(order == "asc"))
    return df_sorted.head(limit).to_dict(orient="records")

@app.get("/filter")
def filter_cars(
    q: str | None = Query(None, description="Search query for model"),
    price_min: int = Query(0, description="Minimum price"),
    price_max: int = Query(100000, description="Maximum price"),
    hp_min: int = Query(0, description="Minimum horsepower"),
    hp_max: int = Query(1000, description="Maximum horsepower"),
    mil_min: int = Query(0, description="Minimum mileage"),
    mil_max: int = Query(300000, description="Maximum mileage"),
    year: int | None = Query(None, description="Specific year"),
    sort_by: str = Query("price", description="Field to sort by"),
    order: str = Query("asc", description="asc or desc"),
    limit: int = Query(50, description="Number of results to return")
):
    """Filter and search cars based on various criteria."""
    df_filtered = df.copy()
    
    # Apply filters
    if q:
        df_filtered = df_filtered[df_filtered["model"].str.contains(q, case=False, na=False)]
    
    df_filtered = df_filtered[
        (df_filtered["price"] >= price_min) &
        (df_filtered["price"] <= price_max) &
        (df_filtered["horsepower"] >= hp_min) &
        (df_filtered["horsepower"] <= hp_max) &
        (df_filtered["mileage"] >= mil_min) &
        (df_filtered["mileage"] <= mil_max)
    ]
    
    if year:
        df_filtered = df_filtered[df_filtered["year"] == year]
    
    # Apply sorting
    valid = ["price", "mpg_combined", "mileage", "year", "horsepower"]
    if sort_by not in valid:
        sort_by = "price"
    df_filtered = df_filtered.sort_values(by=sort_by, ascending=(order == "asc"))
    
    results = df_filtered.head(limit).to_dict(orient="records")
    return {"count": len(df_filtered), "results": results}

@app.get("/apr")
def calculate_apr(
    credit_score: int = 720,
    price: float | None = None,
    months: int = 60,
    downpayment: float = 0.0
):
    """Loan APR calculator — safe default values if none provided."""
    price = price or 30000.0
    apr = apr_from_credit(credit_score)
    monthly = monthly_payment(price, apr, months, downpayment)
    return {
        "apr_percent": apr,
        "price_used": price,
        "monthly_payment": monthly,
        "total_paid": round(monthly * months, 2)
    }

@app.get("/lease")
def lease_calculator(
    price: float | None = None,
    credit_score: int = 720,
    months: int = 36,
    downpayment: float = 0.0
):
    """Estimate lease even without a selected car."""
    price = price or 30000.0
    apr = apr_from_credit(credit_score)
    residual_value = depreciation_value(price, months / 12)
    depreciation_fee = (price - residual_value) / months
    finance_fee = (price + residual_value) * (apr / 100) / 24
    monthly = depreciation_fee + finance_fee - (downpayment / months)
    return {
        "apr_percent": apr,
        "price_used": price,
        "residual_value": residual_value,
        "monthly_lease": round(monthly, 2),
        "total_paid": round(monthly * months + downpayment, 2)
    }

@app.get("/loan")
def loan_options(
    price: float | None = None,
    credit_score: int = 720,
    months: int = 60
):
    """Return standard & special Toyota loan options — safe defaults."""
    price = price or 30000.0
    apr = apr_from_credit(credit_score)
    down_req = 0.0
    program = "Standard Toyota Finance"

    if credit_score < 650:
        down_req = price * 0.1
    if credit_score < 600:
        down_req = price * 0.2

    options = {
        "student": {"apr_adj": -0.3, "desc": "College Grad Rebate Program"},
        "military": {"apr_adj": -0.5, "desc": "Toyota Military Rebate"},
        "elderly": {"apr_adj": -0.2, "desc": "Senior Customer Loyalty Discount"}
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
            "total_paid": round(monthly * months, 2)
        }

    standard_monthly = monthly_payment(price, apr, months, down_req)
    return {
        "standard": {
            "program": program,
            "apr_percent": apr,
            "price_used": price,
            "down_required": round(down_req, 2),
            "monthly_payment": standard_monthly,
            "total_paid": round(standard_monthly * months, 2)
        },
        "special_programs": available
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

