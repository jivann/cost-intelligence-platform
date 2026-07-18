"""
CostProvider interface.

Any source of cloud cost data — mock or real (AWS/Azure/GCP) — must implement
this interface. Downstream code (sync jobs, analytics routes) depends only on
this contract, never on a specific provider, so swapping mock for real later
requires no changes outside this folder.
"""
from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import List


@dataclass
class ResourceData:
    """Matches CloudResourceCreate — one cloud resource (e.g. an EC2 instance)."""
    name: str
    resource_id: str
    provider: str          # "aws" | "azure" | "gcp"
    resource_type: str     # e.g. "ec2", "vm", "storage"
    region: str
    hourly_cost: float
    monthly_cost: float


@dataclass
class CostRecordData:
    """Matches CostRecordCreate — one billed cost entry for a resource, over a time period."""
    resource_id: str       # matches ResourceData.resource_id (not the DB primary key)
    amount: float
    currency: str
    period_start: datetime
    period_end: datetime


class CostProvider(ABC):
    """Abstract base for any cost data source."""

    @abstractmethod
    def list_resources(self) -> List[ResourceData]:
        """Return all cloud resources visible to this provider."""
        raise NotImplementedError

    @abstractmethod
    def get_cost_records(
        self, resource_id: str, period_start: datetime, period_end: datetime
    ) -> List[CostRecordData]:
        """Return cost records for one resource within a date range."""
        raise NotImplementedError
