from datetime import datetime, timedelta, timezone
from backend.models import CloudResource, CostRecord, User
from tests.conftest import TestingSessionLocal


def _make_resource_with_history(db, owner_id, latest_amount, trailing_amount=10.0):
    resource = CloudResource(
        name="test-instance",
        resource_id="i-test123",
        provider="aws",
        resource_type="ec2",
        region="us-east-1",
        owner_id=owner_id,
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)

    now = datetime.now(timezone.utc)
    # 7 days of normal trailing cost, oldest first
    for i in range(7, 0, -1):
        db.add(CostRecord(
            resource_id=resource.id,
            amount=trailing_amount,
            period_start=now - timedelta(days=i),
            period_end=now - timedelta(days=i - 1),
        ))
    # latest (most recent) record — the one being evaluated
    db.add(CostRecord(
        resource_id=resource.id,
        amount=latest_amount,
        period_start=now,
        period_end=now + timedelta(days=1),
    ))
    db.commit()
    return resource


def test_anomaly_detected_when_cost_spikes(client, auth_headers):
    db = TestingSessionLocal()
    user = db.query(User).filter(User.username == "testciuser").first()
    # trailing avg $10/day, latest $25/day -> 150% above -> critical
    _make_resource_with_history(db, user.id, latest_amount=25.0, trailing_amount=10.0)
    db.close()

    response = client.get("/api/v1/analytics/anomalies", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert data["total"] == 1
    assert data["critical"] == 1
    anomaly = data["anomalies"][0]
    assert anomaly["severity"] == "critical"
    assert anomaly["pct_above_expected"] > 100


def test_no_anomaly_when_cost_is_stable(client, auth_headers):
    db = TestingSessionLocal()
    user = db.query(User).filter(User.username == "testciuser").first()
    # trailing avg $10/day, latest $11/day -> 10% above -> below 40% threshold
    _make_resource_with_history(db, user.id, latest_amount=11.0, trailing_amount=10.0)
    db.close()

    response = client.get("/api/v1/analytics/anomalies", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert data["total"] == 0
    assert data["anomalies"] == []
