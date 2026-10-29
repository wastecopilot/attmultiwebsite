"""Stand-in for att_order_automation used by the service tests: same result shapes, no browser.

The street line picks the outcome; the handoff block mimics the real one (portal link + tasks). Plan, option
and cart wording is copied from the portal's own pages (Internet Air, Hicksville NY test address).
"""

import asyncio

_INTERNAL_RESULT_KEYS = ("handoff", "detail", "failed_step", "session_id", "artifacts_dir", "duration_s")
calls: list[dict] = []

AIR_PLAN = {"plan_id": "at-t-internet-air", "name": "AT&T Internet Air", "display_name": "AT&T Internet Air",
            "speed": "Speeds up to 300 Mbps", "price": "$55/mo.",
            "price_note": "Price plus taxes and fees after $5/mo. AutoPay & Paperless Bill discount.",
            "features": [], "notes": ["AT&T Internet Air is our new, fast home internet, delivered over the reliable AT&T wireless network."],
            "offer_details": ["See att.com/broadbandinfo for more information."],
            # A portal-internal address must never leave the service: scrub_public removes it.
            "broadband_facts_url": "https://www.attspoc.com/(S(abc123))/labels"}
AIR_GROUPS = [
    {"key": "autopay", "heading": "Select your Autopay option.", "choices": [
        {"title": "AutoPay/Paperless Billing Discount", "price": "-$10/mo.", "selected": True, "details": ""},
        {"title": "Decline AutoPay/Paperless Billing", "price": "$0", "selected": False, "details": ""}]},
    {"key": "wifi_extender", "heading": "Select your All-Fi Extender Option.", "choices": [
        {"title": "Next-generation Wi-Fi experience, delivers more coverage to more corners of your home", "price": "$12/mo.",
         "selected": True, "details": ""},
        {"title": "Decline Extended Wi-Fi Coverage Service", "price": "$0", "selected": False, "details": ""}]},
]


QUESTIONS = [{"key": "q1", "question": "TEST question: which test lender?", "choices": ["TEST LENDER A", "NONE OF THE ABOVE"]},
             {"key": "q2", "question": "TEST question: which test amount?", "choices": ["$100 - $199", "NONE OF THE ABOVE"]}]


def to_aria(result: dict) -> dict:
    return {k: v for k, v in result.items() if k not in _INTERNAL_RESULT_KEYS}


async def shutdown() -> None:
    return None


def _base(payload: dict) -> dict:
    return {"order_ref": payload["order_ref"], "message": "", "detail": "internal", "session_id": "abc123",
            "artifacts_dir": "order_artifacts/x", "duration_s": 0.2, "failed_step": None}


async def list_plans(payload: dict) -> dict:
    calls.append(payload)
    await asyncio.sleep(0.2)
    street = payload["service_address"]["street"].lower()
    base = _base(payload)
    if "notfound" in street:
        return {**base, "status": "address_not_found", "retryable": True, "data": {}, "failed_step": "enter_address"}
    if "nooffers" in street:
        return {**base, "status": "no_offers", "retryable": False, "data": {}, "failed_step": "read_plans"}
    return {**base, "status": "plans_ready", "retryable": False,
            "data": {"available_plans": [AIR_PLAN], "available_products": ["internet", "tv"], "cart_order_id": "DSIX1"}}


async def process_att_order(payload: dict) -> dict:
    calls.append(payload)
    await asyncio.sleep(0.2)
    street = payload["service_address"]["street"].lower()
    base = _base(payload)
    cart = {"sections": ["internet"], "monthly_lines": [{"section": "internet", "item": "AT&T Internet Air", "detail": "Provided by AT&T", "charge": "$65.00"}],
            "monthly_total": "$55.00"}
    if "notfound" in street:
        return {**base, "status": "address_not_found", "retryable": True, "data": {}, "failed_step": "enter_address"}
    if payload["mode"] == "quote":
        if not payload["products"][0]["options"]:
            return {**base, "status": "options_required", "retryable": True, "failed_step": "select_products",
                    "data": {"product_type": "internet", "option_groups": AIR_GROUPS, "unanswered": ["autopay", "wifi_extender"],
                             "included_items": ["AT&T All-Fi Hub"], "cart_order_id": "DSIX1"}}
        return {**base, "status": "quote_ready", "retryable": False, "data": {"cart_order_id": "DSIX1", "cart_summary": cart}}
    if payload["customer"].get("credit_check"):
        # Website orders run the credit check: Account Validation questions (invented test wording).
        return {**base, "status": "identity_questions", "retryable": False,
                "data": {"cart_order_id": "DSIX1", "cart_summary": cart, "identity_questions": QUESTIONS}}
    return {**base, "status": "handoff_ready", "retryable": False, "data": {"cart_order_id": "DSIX1", "cart_summary": cart},
            "handoff": {"portal_url": "https://www.attspoc.com/e/(S(abc123))/oe/Checkout/Checkout.aspx",
                        "customer": payload["customer"], "tasks": ["Run the credit check"]}}


async def answer_identity_questions(payload: dict) -> dict:
    calls.append(payload)
    await asyncio.sleep(0.2)
    base = _base(payload)
    return {**base, "status": "credit_check_done", "retryable": False,
            "data": {"cart_order_id": "DSIX1", "credit_check": {"outcome": "analyst_review", "reference": "U20260000000000001",
                                                               "hours": "M-F 9am-9pm ET, Sat 9am-8pm ET"}},
            "handoff": {"portal_url": "https://www.attspoc.com/e/(S(abc123))/oe/Checkout/Checkout.aspx",
                        "credit_check_outcome": "analyst_review", "tasks": ["Call the analyst line with the customer"]}}
