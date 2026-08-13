import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://potato-premium-site.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def test_root(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200
    assert "Techy Potato" in r.json().get("message", "")


def test_create_lead_valid(client):
    payload = {
        "name": "TEST_User",
        "email": "test_user@example.com",
        "phone": "1234567890",
        "service": "SEO",
        "message": "Test lead from pytest",
    }
    r = client.post(f"{API}/contact", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "id" in data and isinstance(data["id"], str)
    assert data["name"] == payload["name"]
    assert data["email"] == payload["email"]
    assert data["service"] == "SEO"
    assert data["message"] == payload["message"]
    assert "created_at" in data


def test_create_lead_invalid_email(client):
    payload = {
        "name": "TEST_User",
        "email": "not-an-email",
        "message": "x",
    }
    r = client.post(f"{API}/contact", json=payload)
    assert r.status_code == 422


def test_create_lead_missing_required(client):
    r = client.post(f"{API}/contact", json={"email": "a@b.com"})
    assert r.status_code == 422


def test_list_leads_sorted(client):
    # Create two leads
    for i in range(2):
        client.post(f"{API}/contact", json={
            "name": f"TEST_Sort_{i}",
            "email": f"sort{i}@example.com",
            "message": f"msg {i}",
        })
    r = client.get(f"{API}/contact")
    assert r.status_code == 200
    leads = r.json()
    assert isinstance(leads, list)
    assert len(leads) >= 2
    # verify sorted newest first
    timestamps = [l["created_at"] for l in leads]
    assert timestamps == sorted(timestamps, reverse=True)
    # ensure no _id leaked
    for l in leads:
        assert "_id" not in l
