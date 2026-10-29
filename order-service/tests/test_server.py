"""order-service tests:  python -m unittest discover -s tests -v   (run from order-service/)

Uses tests/stub_automation.py (no browser). With ATTSPOC_MODULE_DIR pointing at the folder that holds the
real att_order_automation.py, RealAutomationTests also checks the automation's own refusals (still no browser:
those paths return before Chromium starts).
"""

import json
import os
import sys
import tempfile
import threading
import time
import unittest
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib import error, request

HERE = Path(__file__).resolve().parent
REAL_MODULE_DIR = os.environ.get("ATTSPOC_MODULE_DIR", "")
QUEUE = tempfile.mkdtemp(prefix="spoc-queue-")
KEY = "test-key-" + "x" * 40

os.environ.update({"ATTSPOC_MODULE": "stub_automation", "ATTSPOC_SERVICE_KEY": KEY, "ATTSPOC_SPECIALIST_QUEUE_DIR": QUEUE,
                   "ATTSPOC_MODULE_DIR": str(HERE)})
sys.path.insert(0, str(HERE.parent))
import server  # noqa: E402

ADDRESS = {"street": "300 Plainview Road", "unit_type": None, "unit_number": None, "city": "Hicksville", "state": "NY", "zip_code": "11801"}
PRODUCTS = [{"product_type": "internet", "plan_name": "AT&T Internet Air", "options": {"autopay": True, "wifi_extender": False}}]
CUSTOMER = {"first_name": "Test", "last_name": "Customer", "phone": "(214) 555-0100", "email": "test@example.com",
            "billing_language": "english", "contact_consent": False}


class ServiceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        server.runner = server.Runner()
        cls.httpd = ThreadingHTTPServer(("127.0.0.1", 0), server.Handler)
        cls.base = f"http://127.0.0.1:{cls.httpd.server_address[1]}"
        threading.Thread(target=cls.httpd.serve_forever, daemon=True).start()

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        server.runner.stop()

    def call(self, method, path, body=None, key=KEY, raw=None, ctype="application/json"):
        data = raw if raw is not None else (json.dumps(body).encode() if body is not None else None)
        req = request.Request(self.base + path, data=data, method=method)
        if key:
            req.add_header("Authorization", f"Bearer {key}")
        if data is not None:
            req.add_header("Content-Type", ctype)
        try:
            with request.urlopen(req, timeout=10) as r:
                return r.status, json.loads(r.read())
        except error.HTTPError as e:
            return e.code, json.loads(e.read())

    def wait(self, job_id):
        for _ in range(100):
            status, body = self.call("GET", f"/v1/jobs/{job_id}")
            self.assertEqual(status, 200)
            if body["state"] == "done":
                return body["result"]
            time.sleep(0.05)
        self.fail("job did not finish")

    def quote(self, request_id, address=ADDRESS):
        status, body = self.call("POST", "/v1/quotes", {"request_id": request_id, "service_address": address, "products": PRODUCTS})
        self.assertEqual(status, 202, body)
        return body["job_id"]

    def test_health_needs_no_key_and_says_nothing_else(self):
        self.assertEqual(self.call("GET", "/healthz", key=None), (200, {"ok": True}))

    def test_v1_requires_the_key(self):
        self.assertEqual(self.call("GET", "/v1/jobs/" + "a" * 24, key=None)[0], 401)
        self.assertEqual(self.call("POST", "/v1/quotes", {"x": 1}, key="wrong" * 10)[0], 401)

    def test_quote_runs_as_a_job_and_hides_internal_keys(self):
        result = self.wait(self.quote("req-quote-0000000001"))
        self.assertEqual(result["status"], "quote_ready")
        self.assertTrue(result["order_ref"].startswith("UW-"))
        for k in ("handoff", "detail", "session_id", "artifacts_dir", "failed_step", "duration_s"):
            self.assertNotIn(k, result)

    def test_same_request_id_returns_the_same_job(self):
        self.assertEqual(self.quote("req-dup-000000000001"), self.quote("req-dup-000000000001"))

    def test_sensitive_keys_and_values_are_refused_without_echo(self):
        cases = [
            {"request_id": "req-s-0000000000001", "service_address": ADDRESS, "products": PRODUCTS, "ssn": "123-45-6789"},
            {"request_id": "req-s-0000000000002", "service_address": {**ADDRESS, "date_of_birth": "1990-01-01"}, "products": PRODUCTS},
            {"request_id": "req-s-0000000000003", "service_address": {**ADDRESS, "street": "123-45-6789"}, "products": PRODUCTS},
            {"request_id": "req-s-0000000000004", "service_address": {**ADDRESS, "street": "4111 1111 1111 1111"}, "products": PRODUCTS},
            {"request_id": "req-s-0000000000005", "service_address": {**ADDRESS, "city": "01/02/1990"}, "products": PRODUCTS},
        ]
        before = len(server.aoa.calls)
        for body in cases:
            status, resp = self.call("POST", "/v1/quotes", body)
            self.assertEqual(status, 422, body)
            self.assertEqual(resp["error"], "sensitive_data_rejected")
            text = json.dumps(resp)
            for secret in ("123-45-6789", "4111", "1990"):
                self.assertNotIn(secret, text)
        status, resp = self.call("POST", "/v1/handoffs", {"request_id": "req-s-0000000000006", "quote_job_id": "q" * 24,
                                                          "customer": {**CUSTOMER, "card_number": "4111111111111111"}, "customer_confirmed": True})
        self.assertEqual(status, 422)
        self.assertEqual(len(server.aoa.calls), before, "a refused request reached the automation")

    def test_unknown_keys_bad_json_and_big_bodies_are_refused(self):
        self.assertEqual(self.call("POST", "/v1/quotes", {"request_id": "req-u-0000000000001", "service_address": ADDRESS,
                                                          "products": PRODUCTS, "extra": 1})[0], 400)
        self.assertEqual(self.call("POST", "/v1/quotes", raw=b"not json")[0], 400)
        self.assertEqual(self.call("POST", "/v1/quotes", raw=b"{}", ctype="text/plain")[0], 415)
        self.assertEqual(self.call("POST", "/v1/quotes", raw=b"{" + b" " * 20000 + b"}")[0], 413)

    def test_handoff_needs_a_finished_quote(self):
        status, _ = self.call("POST", "/v1/handoffs", {"request_id": "req-h-0000000000001", "quote_job_id": "n" * 24,
                                                       "customer": CUSTOMER, "customer_confirmed": True})
        self.assertEqual(status, 404)
        failed = self.quote("req-h-0000000000002", {**ADDRESS, "street": "1 Notfound Way"})
        self.assertEqual(self.wait(failed)["status"], "address_not_found")
        status, _ = self.call("POST", "/v1/handoffs", {"request_id": "req-h-0000000000003", "quote_job_id": failed,
                                                       "customer": CUSTOMER, "customer_confirmed": True})
        self.assertEqual(status, 409)

    def test_handoff_reuses_the_quote_and_keeps_the_portal_link_inside(self):
        quote_id = self.quote("req-ok-000000000001")
        quote = self.wait(quote_id)
        body = {"request_id": "req-ok-000000000002", "quote_job_id": quote_id, "customer": CUSTOMER, "customer_confirmed": True}
        status, started = self.call("POST", "/v1/handoffs", body)
        self.assertEqual(status, 202)
        result = self.wait(started["job_id"])
        self.assertEqual(result["status"], "handoff_ready")
        self.assertEqual(result["order_ref"], quote["order_ref"])
        self.assertNotIn("attspoc.com", json.dumps(result))
        sent = server.aoa.calls[-1]
        self.assertEqual((sent["order_ref"], sent["service_address"], sent["products"]), (quote["order_ref"], ADDRESS, PRODUCTS))
        files = [p for p in Path(QUEUE).glob("*.json") if quote["order_ref"] in p.name]
        self.assertEqual(len(files), 1)
        self.assertIn("attspoc.com", files[0].read_text(encoding="utf-8"))
        # A second submission for the same quote returns the finished hand-off instead of preparing another.
        status, again = self.call("POST", "/v1/handoffs", {**body, "request_id": "req-ok-000000000003"})
        self.assertEqual((status, again["job_id"]), (202, started["job_id"]))

    def plans(self, request_id, address=ADDRESS):
        status, body = self.call("POST", "/v1/plans", {"request_id": request_id, "service_address": address})
        self.assertEqual(status, 202, body)
        return body["job_id"]

    def test_plans_job_lists_plans_and_drops_portal_internals(self):
        result = self.wait(self.plans("req-plans-000000001"))
        self.assertEqual(result["status"], "plans_ready")
        self.assertEqual([p["name"] for p in result["data"]["available_plans"]], ["AT&T Internet Air"])
        text = json.dumps(result)
        for internal in ("attspoc", "(S(", "DSIX1", "session_id"):
            self.assertNotIn(internal, text)
        self.assertEqual(server.aoa.calls[-1]["product_type"], "internet")

    def test_plans_requests_are_checked_like_quotes(self):
        self.assertEqual(self.call("POST", "/v1/plans", {"request_id": "req-plans-000000002", "service_address": ADDRESS}, key=None)[0], 401)
        status, body = self.call("POST", "/v1/plans", {"request_id": "req-plans-000000003", "service_address": {**ADDRESS, "dob": "1990-01-01"}})
        self.assertEqual((status, body["error"]), (422, "sensitive_data_rejected"))
        self.assertEqual(self.call("POST", "/v1/plans", {"request_id": "req-plans-000000004", "service_address": ADDRESS, "plan": "x"})[0], 400)
        self.assertEqual(self.plans("req-plans-000000005"), self.plans("req-plans-000000005"))

    def test_quote_from_plans_returns_options_then_the_quote(self):
        plans_id = self.plans("req-pq-0000000000001")
        plans = self.wait(plans_id)
        first = {"request_id": "req-pq-0000000000002", "plans_job_id": plans_id, "plan_name": "AT&T Internet Air", "options": {}}
        status, started = self.call("POST", "/v1/quotes", first)
        self.assertEqual(status, 202, started)
        options = self.wait(started["job_id"])
        self.assertEqual(options["status"], "options_required")
        self.assertEqual([g["key"] for g in options["data"]["option_groups"]], ["autopay", "wifi_extender"])
        answers = {"autopay": "AutoPay/Paperless Billing Discount", "wifi_extender": "Decline Extended Wi-Fi Coverage Service"}
        status, started = self.call("POST", "/v1/quotes", {**first, "request_id": "req-pq-0000000000003", "options": answers})
        self.assertEqual(status, 202)
        quote = self.wait(started["job_id"])
        self.assertEqual((quote["status"], quote["order_ref"]), ("quote_ready", plans["order_ref"]))
        sent = server.aoa.calls[-1]
        self.assertEqual((sent["order_ref"], sent["service_address"]), (plans["order_ref"], ADDRESS))
        self.assertEqual(sent["products"], [{"product_type": "internet", "plan_name": "AT&T Internet Air", "options": answers}])

    def test_quote_from_plans_only_for_a_listed_plan_of_a_finished_plans_job(self):
        body = {"request_id": "req-pq-0000000000010", "plans_job_id": "n" * 24, "plan_name": "AT&T Internet Air", "options": {}}
        self.assertEqual(self.call("POST", "/v1/quotes", body)[0], 404)
        failed = self.plans("req-pq-0000000000011", {**ADDRESS, "street": "1 Notfound Way"})
        self.assertEqual(self.wait(failed)["status"], "address_not_found")
        self.assertEqual(self.call("POST", "/v1/quotes", {**body, "plans_job_id": failed})[0], 409)
        ok = self.plans("req-pq-0000000000012")
        self.wait(ok)
        status, resp = self.call("POST", "/v1/quotes", {**body, "plans_job_id": ok, "plan_name": "Internet 1000 (Fiber 1 GIG)"})
        self.assertEqual((status, resp["fields"]), (400, ["plan_name"]))
        status, resp = self.call("POST", "/v1/quotes", {**body, "plans_job_id": ok, "options": {"autopay": ["x"]}})
        self.assertEqual((status, resp["fields"]), (400, ["options"]))

    def test_credit_check_is_accepted_only_on_the_handoff_and_never_logged(self):
        credit = {"consent": True, "date_of_birth": "01/15/1985", "ssn": "001-01-0001"}
        # Anywhere else it is refused.
        status, body = self.call("POST", "/v1/quotes", {"request_id": "req-cc-0000000000001", "service_address": ADDRESS, "products": PRODUCTS, "ssn": "001-01-0001"})
        self.assertEqual((status, body["error"]), (422, "sensitive_data_rejected"))
        status, _ = self.call("POST", "/v1/handoffs", {"request_id": "req-cc-0000000000002", "quote_job_id": "q" * 24,
                                                       "customer": {**CUSTOMER, "ssn": "001-01-0001"}, "customer_confirmed": True})
        self.assertEqual(status, 422)
        # Card or bank data next to it is still refused.
        status, _ = self.call("POST", "/v1/handoffs", {"request_id": "req-cc-0000000000003", "quote_job_id": "q" * 24,
                                                       "customer": {**CUSTOMER, "credit_check": {**credit, "card_number": "4111111111111111"}}, "customer_confirmed": True})
        self.assertEqual(status, 422)
        # On the hand-off, at customer.credit_check, it is passed to the automation.
        quote_id = self.quote("req-cc-0000000000004")
        self.wait(quote_id)
        with self.assertLogs("order_service", level="INFO") as logs:
            status, started = self.call("POST", "/v1/handoffs", {"request_id": "req-cc-0000000000005", "quote_job_id": quote_id,
                                                                 "customer": {**CUSTOMER, "credit_check": credit}, "customer_confirmed": True})
            self.assertEqual(status, 202, started)
            result = self.wait(started["job_id"])
        self.assertEqual(result["status"], "identity_questions")
        self.assertEqual(server.aoa.calls[-1]["customer"]["credit_check"], credit)
        joined = " ".join(logs.output) + json.dumps(result)
        for secret in ("001-01-0001", "01/15/1985"):
            self.assertNotIn(secret, joined)
        for f in Path(QUEUE).glob("*.json"):
            text = f.read_text(encoding="utf-8")
            self.assertNotIn("001-01-0001", text)
            self.assertNotIn("01/15/1985", text)

    def test_credit_check_questions_are_answered_on_the_same_order(self):
        credit = {"consent": True, "date_of_birth": "01/15/1985", "ssn": "001-01-0001"}
        quote_id = self.quote("req-av-0000000000001")
        quote = self.wait(quote_id)
        handoff = {"request_id": "req-av-0000000000002", "quote_job_id": quote_id,
                   "customer": {**CUSTOMER, "credit_check": credit}, "customer_confirmed": True}
        status, started = self.call("POST", "/v1/handoffs", handoff)
        self.assertEqual(status, 202)
        asked = self.wait(started["job_id"])
        self.assertEqual(asked["status"], "identity_questions")
        self.assertEqual([q["key"] for q in asked["data"]["identity_questions"]], ["q1", "q2"])
        self.assertEqual(asked["data"]["cart_order_id"], "DSIX1")
        self.assertEqual([p for p in Path(QUEUE).glob("*.json") if quote["order_ref"] in p.name], [])   # nothing for staff yet
        # Submitting again does not start a second credit check.
        status, again = self.call("POST", "/v1/handoffs", {**handoff, "request_id": "req-av-0000000000003"})
        self.assertEqual((status, again["job_id"]), (202, started["job_id"]))
        # Answers must be exactly the offered choices, for every question.
        body = {"request_id": "req-av-0000000000004", "questions_job_id": started["job_id"],
                "answers": {"q1": "TEST LENDER A", "q2": "NONE OF THE ABOVE"}}
        for bad in ({"q1": "TEST LENDER A"}, {"q1": "TEST LENDER A", "q2": "$999"}, {"q1": "TEST LENDER A", "q2": "NONE OF THE ABOVE", "q3": "x"}):
            status, resp = self.call("POST", "/v1/verifications", {**body, "answers": bad})
            self.assertEqual((status, resp.get("fields")), (400, ["answers"]))
        self.assertEqual(self.call("POST", "/v1/verifications", {**body, "questions_job_id": quote_id})[0], 404)
        self.assertEqual(self.call("POST", "/v1/verifications", {**body, "answers": {"q1": "x", "card_number": "4111111111111111"}})[0], 422)
        with self.assertLogs("order_service", level="INFO") as logs:
            status, verify = self.call("POST", "/v1/verifications", body)
            self.assertEqual(status, 202, verify)
            result = self.wait(verify["job_id"])
        self.assertEqual(result["status"], "credit_check_done")
        self.assertEqual(result["data"]["credit_check"]["outcome"], "analyst_review")
        self.assertEqual(server.aoa.calls[-1], {"order_ref": quote["order_ref"], "answers": body["answers"]})
        self.assertNotIn("attspoc", json.dumps(result))
        self.assertNotIn("TEST LENDER", " ".join(logs.output))
        # The portal link goes to staff; no answers, SSN or date of birth with it.
        files = [p for p in Path(QUEUE).glob("*.json") if quote["order_ref"] in p.name]
        self.assertEqual(len(files), 1)
        text = files[0].read_text(encoding="utf-8")
        self.assertIn("attspoc.com", text)
        for secret in ("TEST LENDER", "001-01-0001", "01/15/1985"):
            self.assertNotIn(secret, text)
        # The page takes one set of answers.
        status, again = self.call("POST", "/v1/verifications", {**body, "request_id": "req-av-0000000000005"})
        self.assertEqual((status, again["job_id"]), (202, verify["job_id"]))

    def test_capacity_limit(self):
        old, server.MAX_QUEUED = server.MAX_QUEUED, 0
        try:
            status, body = self.call("POST", "/v1/quotes", {"request_id": "req-cap-00000000001", "service_address": ADDRESS, "products": PRODUCTS})
            self.assertEqual((status, body["error"]), (429, "busy"))
        finally:
            server.MAX_QUEUED = old


@unittest.skipUnless(REAL_MODULE_DIR and (Path(REAL_MODULE_DIR) / "att_order_automation.py").exists(),
                     "set ATTSPOC_MODULE_DIR to the folder with att_order_automation.py")
class RealAutomationTests(unittest.TestCase):
    """The real module's own refusals (they return before any browser starts)."""

    @classmethod
    def setUpClass(cls):
        sys.path.insert(0, REAL_MODULE_DIR)
        import importlib
        cls.aoa = importlib.import_module("att_order_automation")

    def run_order(self, payload):
        import asyncio
        return asyncio.run(self.aoa.process_att_order(payload))

    def test_sensitive_fields_rejected_by_the_automation(self):
        r = self.run_order({"order_ref": "test-ref-1", "mode": "handoff", "customer_confirmed": True, "service_address": ADDRESS,
                            "customer": {**CUSTOMER, "ssn": "123-45-6789"}, "products": PRODUCTS})
        self.assertEqual(r["status"], "sensitive_data_rejected")
        self.assertNotIn("123-45-6789", json.dumps(r))

    def test_handoff_without_confirmation_refused(self):
        r = self.run_order({"order_ref": "test-ref-2", "mode": "handoff", "customer_confirmed": False, "service_address": ADDRESS,
                            "customer": CUSTOMER, "products": PRODUCTS})
        self.assertEqual(r["status"], "not_confirmed")

    def test_plans_request_refuses_sensitive_fields(self):
        import asyncio
        r = asyncio.run(self.aoa.list_plans({"order_ref": "test-ref-3", "service_address": {**ADDRESS, "ssn": "123-45-6789"}}))
        self.assertEqual(r["status"], "sensitive_data_rejected")
        self.assertNotIn("123-45-6789", json.dumps(r))

    def test_service_payload_shape_is_valid_for_the_automation(self):
        self.aoa.PlansRequest.model_validate({"order_ref": "UW-ABCDEFGH", "service_address": ADDRESS, "product_type": "internet"})
        self.aoa.OrderRequest.model_validate({"order_ref": "UW-ABCDEFGH", "mode": "quote", "service_address": ADDRESS, "products": PRODUCTS})
        self.aoa.OrderRequest.model_validate({"order_ref": "UW-ABCDEFGH", "mode": "handoff", "customer_confirmed": True,
                                              "service_address": ADDRESS, "products": PRODUCTS, "customer": CUSTOMER})


if __name__ == "__main__":
    unittest.main()
