"""
DEMO/TEST UTILITY ONLY — not part of the real data pipeline.

Injects one artificially high cost record into an existing resource that
already has enough history, purely to demonstrate the /analytics/anomalies
detection logic works. Clearly separate from MockCostProvider (realistic,
non-anomalous daily variance) and sync_costs.py (the real sync pipeline).

Usage:
    python -m backend.inject_demo_anomaly
"""
import os
from datetime import datetime, timezone
from dotenv import load_dotenv
from sqlalchemy import func

from backend.database import SessionLocal
from backend.models import CloudResource, CostRecord, User

load_dotenv()
TARGET_USERNAME = os.getenv("SYNC_TARGET_USERNAME", "devtest2")


def inject():
    db = SessionLocal()
    user = db.query(User).filter(User.username == TARGET_USERNAME).first()
    if not user:
        print(f"User '{TARGET_USERNAME}' not found.")
        return

    resource = (
        db.query(CloudResource)
        .join(CostRecord, CostRecord.resource_id == CloudResource.id)
        .filter(CloudResource.owner_id == user.id)
        .group_by(CloudResource.id)
        .having(func.count(CostRecord.id) >= 8)
        .first()
    )
    if not resource:
        print("No resource with enough history found — run sync_costs.py first.")
        return

    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    spike_amount = round((resource.monthly_cost / 30) * 3.5, 2)  # ~250% above normal

    db.add(CostRecord(
        resource_id=resource.id,
        amount=spike_amount,
        currency="USD",
        period_start=today,
        period_end=today,
    ))
    db.commit()

    print(f"Injected demo anomaly: {resource.name} ({resource.resource_id})")
    print(f"Spike amount: ${spike_amount} (vs normal ~${round(resource.monthly_cost/30, 2)}/day)")
    print("This is a clearly-labeled TEST record — run /analytics/anomalies to see it detected.")

    db.close()


if __name__ == "__main__":
    inject()
