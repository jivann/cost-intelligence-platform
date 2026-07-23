import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database import Base, get_db
from backend.main import app
import os

# Deliberately does NOT fall back to DATABASE_URL — tests must never
# accidentally run against the real dev database.
TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")
if not TEST_DATABASE_URL:
    raise RuntimeError(
        "TEST_DATABASE_URL is not set. Refusing to guess — tests must use "
        "an explicitly separate database from development data."
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

@pytest.fixture(autouse=True)
def clean_database():
    """Wipes all tables before every test, so tests never depend on
    leftover data from a previous run."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


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
