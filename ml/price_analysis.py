"""
AgriConnect AI - Price Intelligence Logic
Calculates platform savings, percentage differences, bulk purchasing totals,
and price projections against wholesale APMC Mandi rates.
"""

from typing import Dict, Any, List

def calculate_savings(market_price: float, platform_price: float) -> float:
    """Calculates absolute per-unit savings in INR."""
    return max(0.0, round(market_price - platform_price, 2))

def calculate_savings_percentage(market_price: float, platform_price: float) -> float:
    """Calculates percentage savings: ((Market - Platform) / Market) * 100."""
    if market_price <= 0:
        return 0.0
    savings = calculate_savings(market_price, platform_price)
    return round((savings / market_price) * 100, 2)

def calculate_bulk_order_savings(market_price: float, platform_price: float, quantity_kg: float) -> Dict[str, float]:
    """Calculates total costs and savings for arbitrary bulk orders."""
    market_cost = round(market_price * quantity_kg, 2)
    platform_cost = round(platform_price * quantity_kg, 2)
    total_savings = round(market_cost - platform_cost, 2)
    savings_pct = calculate_savings_percentage(market_price, platform_price)
    return {
        "quantity_kg": quantity_kg,
        "market_cost": market_cost,
        "platform_cost": platform_cost,
        "total_savings": max(0.0, total_savings),
        "savings_percentage": savings_pct
    }

def get_price_trend(product_name: str, current_market: float, current_platform: float) -> List[Dict[str, Any]]:
    """Generates 6-month historical price trend comparing Mandi wholesale vs AgriConnect."""
    months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"]
    trends = []
    for i, m in enumerate(months):
        delta = (i % 2 == 0 and 1 or -1) * (current_market * 0.07) if i < 5 else 0
        p_delta = (i % 2 == 0 and 1 or -1) * (current_platform * 0.04) if i < 5 else 0
        m_val = round(current_market + delta, 2)
        p_val = round(current_platform + p_delta, 2)
        trends.append({
            "month": m,
            "market_price": m_val,
            "platform_price": p_val,
            "unit_savings": round(max(0.0, m_val - p_val), 2)
        })
    return trends
