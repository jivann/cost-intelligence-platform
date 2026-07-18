"""
MockCostProvider — generates realistic, schema-accurate synthetic cloud cost
data. Used until a real paid cloud account justifies wiring AWSCostProvider /
AzureCostProvider / GCPCostProvider (see backend/providers/base.py).

IMPORTANT: This is synthetic data. It is deterministic (seeded) so demos and
tests are reproducible, and clearly documented as mock in the README.
"""
import random
from datetime import datetime, timedelta, timezone
from typing import List

from backend.providers.base import CostProvider, ResourceData, CostRecordData

# Realistic-looking catalog, modeled after real AWS/Azure/GCP resource types
_CATALOG = [
    ("aws", "ec2", ["us-east-1", "us-west-2", "eu-west-1"], (5.0, 250.0)),
    ("aws", "rds", ["us-east-1", "eu-west-1"], (20.0, 400.0)),
    ("aws", "s3", ["us-east-1", "ap-south-1"], (1.0, 60.0)),
    ("azure", "vm", ["eastus", "westeurope"], (8.0, 300.0)),
    ("azure", "storage", ["eastus", "centralindia"], (2.0, 50.0)),
    ("gcp", "compute", ["us-central1", "asia-south1"], (6.0, 280.0)),
    ("gcp", "cloud-sql", ["us-central1", "europe-west1"], (15.0, 350.0)),
]

_NAME_PREFIXES = ["prod", "staging", "dev", "analytics", "web", "worker"]


class MockCostProvider(CostProvider):
    def __init__(self, seed: int = 42, resource_count: int = 18):
        self._rng = random.Random(seed)
        self._resource_count = resource_count
        self._resources: List[ResourceData] = self._generate_resources()

    def _generate_resources(self) -> List[ResourceData]:
        resources = []
        for i in range(self._resource_count):
            provider, rtype, regions, cost_range = self._rng.choice(_CATALOG)
            region = self._rng.choice(regions)
            prefix = self._rng.choice(_NAME_PREFIXES)
            monthly = round(self._rng.uniform(*cost_range), 2)
            hourly = round(monthly / 730, 4)  # ~730 hours/month

            resources.append(
                ResourceData(
                    name=f"{prefix}-{rtype}-{i:03d}",
                    resource_id=f"{provider}-{rtype}-{i:03d}-{self._rng.randint(1000,9999)}",
                    provider=provider,
                    resource_type=rtype,
                    region=region,
                    hourly_cost=hourly,
                    monthly_cost=monthly,
                )
            )
        return resources

    def list_resources(self) -> List[ResourceData]:
        return self._resources

    def get_cost_records(
        self, resource_id: str, period_start: datetime, period_end: datetime
    ) -> List[CostRecordData]:
        resource = next((r for r in self._resources if r.resource_id == resource_id), None)
        if resource is None:
            return []

        records = []
        day_cursor = period_start
        daily_base = resource.monthly_cost / 30

        while day_cursor < period_end:
            next_day = min(day_cursor + timedelta(days=1), period_end)
            # Small day-to-day variance so it doesn't look artificially flat
            variance = self._rng.uniform(0.85, 1.15)
            amount = round(daily_base * variance, 4)

            records.append(
                CostRecordData(
                    resource_id=resource_id,
                    amount=amount,
                    currency="USD",
                    period_start=day_cursor,
                    period_end=next_day,
                )
            )
            day_cursor = next_day

        return records
