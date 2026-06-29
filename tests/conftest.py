import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database import Base, get_db
from backend.main import app
import os

TEST_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://costadmin:costpass123@localhost:5432/costdb_test"
)

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def auth_headers(client):
    client.post("/api/v1/register", json={
        "email": "testci@example.com",
        "username": "testciuser",
        "password": "testcipass123"
    })
    response = client.post("/api/v1/login", data={
        "username": "testciuser",
        "password": "testcipass123"
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
