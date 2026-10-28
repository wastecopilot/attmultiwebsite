"""Stand-in for att_order_automation used by the service tests: same result shapes, no browser.

The street line picks the outcome; the handoff block mimics the real one (portal link + tasks).
"""

import asyncio

_INTERNAL_RESULT_KEYS = ("handoff", "detail", "failed_step", "session_id", "artifacts_dir", "duration_s")
calls: list[dict] = []


def to_aria(result: dict) -> dict:
    return {k: v for k, v in result.items() if k not in _INTERNAL_RESULT_KEYS}


async def shutdown() -> None:
    return None


async def process_att_order(payload: dict) -> dict:
    calls.append(payload)
    await asyncio.sleep(0.2)
    street = payload["service_address"]["street"].lower()
    base = {"order_ref": payload["order_ref"], "message": "", "detail": "internal", "session_id": "abc123",
            "artifacts_dir": "order_artifacts/x", "duration_s": 0.2, "failed_step": None}
    cart = {"sections": ["internet"], "monthly_lines": [{"section": "internet", "item": "AT&T Internet Air", "charge": "$65.00"}],
            "monthly_total": "$55.00"}
    if "notfound" in street:
        return {**base, "status": "address_not_found", "retryable": True, "data": {}, "failed_step": "enter_address"}
    if payload["mode"] == "quote":
        return {**base, "status": "quote_ready", "retryable": False, "data": {"cart_order_id": "DSIX1", "cart_summary": cart}}
    return {**base, "status": "handoff_ready", "retryable": False, "data": {"cart_order_id": "DSIX1", "cart_summary": cart},
            "handoff": {"portal_url": "https://www.attspoc.com/e/(S(abc123))/oe/Checkout/Checkout.aspx",
                        "customer": payload["customer"], "tasks": ["Run the credit check"]}}
