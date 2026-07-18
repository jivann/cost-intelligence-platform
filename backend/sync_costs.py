"""
Sync script: pulls data from a CostProvider (currently MockCostProvider) and
writes it into CloudResource + CostRecord. Designed to run the same way a
scheduled job (cron / Kubernetes CronJob) would later — idempotent, safe to
re-run.

Usage:
    python -m backend.sync_costs
"""
import sys
from datetime import datetime, timedelta, timezone

from backend.database import SessionLocal
from backend.models import CloudResource, CostRecord, User
from backend.providers.mock_provider import MockCostProvider

import os
from dotenv import load_dotenv

load_dotenv()

SYNC_DAYS_BACK = 30
TARGET_USERNAME = os.getenv("SYNC_TARGET_USERNAME", "day8user")

def sync():
    db = SessionLocal()
    provider = MockCostProvider()

    user = db.query(User).filter(User.username == TARGET_USERNAME).first()
    if not user:
        print(f"User '{TARGET_USERNAME}' not found — check username.")
        sys.exit(1)

    resources = provider.list_resources()
    created_resources = 0
    created_records = 0

    for r in resources:
        existing = db.query(CloudResource).filter(
            CloudResource.resource_id == r.resource_id
        ).first()

        if existing:
            db_resource = existing
        else:
            db_resource = CloudResource(
                owner_id=user.id,
                name=r.name,
                resource_id=r.resource_id,
                provider=r.provider,
                resource_type=r.resource_type,
                region=r.region,
                status="active",
                hourly_cost=r.hourly_cost,
                monthly_cost=r.monthly_cost,
            )
            db.add(db_resource)
            db.flush()  # get db_resource.id without a full commit yet
            created_resources += 1
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        period_end = today
        period_start = period_end - timedelta(days=SYNC_DAYS_BACK)
        cost_records = provider.get_cost_records(r.resource_id, period_start, period_end)

        for rec in cost_records:
            exists = db.query(CostRecord).filter(
                CostRecord.resource_id == db_resource.id,
                CostRecord.period_start == rec.period_start,
            ).first()
            if exists:
                continue

            db.add(CostRecord(
                resource_id=db_resource.id,
                amount=rec.amount,
                currency=rec.currency,
                period_start=rec.period_start,
                period_end=rec.period_end,
            ))
            created_records += 1

    db.commit()
    print(f"Synced: {created_resources} new resources, {created_records} new cost records.")
    db.close()


if __name__ == "__main__":
    sync()
