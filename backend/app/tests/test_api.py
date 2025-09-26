# backend/app/tests/test_api.py
from fastapi.testclient import TestClient
import sys
import os

# Ensure package import path covers app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.main import app  # noqa

client = TestClient(app)


def test_root():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json().get("status") == "ok"


def test_ask_placeholder():
    # This integration test depends on rag_service working.
    # If LLM or Neo4j are not configured the endpoint may throw. We just check route wiring.
    resp = client.post("/api/ask", json={"question": "What are common side effects of aspirin?", "top_k": 3})
    # If external services are unavailable, we should still get a 500 (but not 404)
    assert resp.status_code in (200, 500)
