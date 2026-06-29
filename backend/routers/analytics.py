from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from backend.database import get_db
from backend.models import CloudResource, CostRecord, User
from backend.routers.resources import get_current_user

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])

@router.get("/summary")
def get_cost_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resources = db.query(CloudResource).filter(
        CloudResource.owner_id == current_user.id
    ).all()

    total_monthly = sum(r.monthly_cost for r in resources)
    total_hourly = sum(r.hourly_cost for r in resources)
    active_count = sum(1 for r in resources if r.status == "active")
    stopped_count = sum(1 for r in resources if r.status == "stopped")

    return {
        "total_resources": len(resources),
        "active_resources": active_count,
        "stopped_resources": stopped_count,
        "total_hourly_cost": round(total_hourly, 4),
        "total_monthly_cost": round(total_monthly, 2),
        "total_yearly_cost": round(total_monthly * 12, 2)
    }

@router.get("/by-provider")
def get_cost_by_provider(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resources = db.query(CloudResource).filter(
        CloudResource.owner_id == current_user.id
    ).all()

    provider_costs = {}
    for r in resources:
        if r.provider not in provider_costs:
            provider_costs[r.provider] = {
                "provider": r.provider,
                "resource_count": 0,
                "monthly_cost": 0.0
            }
        provider_costs[r.provider]["resource_count"] += 1
        provider_costs[r.provider]["monthly_cost"] += r.monthly_cost

    for p in provider_costs:
        provider_costs[p]["monthly_cost"] = round(provider_costs[p]["monthly_cost"], 2)

    return list(provider_costs.values())

@router.get("/by-region")
def get_cost_by_region(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resources = db.query(CloudResource).filter(
        CloudResource.owner_id == current_user.id
    ).all()

    region_costs = {}
    for r in resources:
        if r.region not in region_costs:
            region_costs[r.region] = {
                "region": r.region,
                "provider": r.provider,
                "resource_count": 0,
                "monthly_cost": 0.0
            }
        region_costs[r.region]["resource_count"] += 1
        region_costs[r.region]["monthly_cost"] += r.monthly_cost

    for reg in region_costs:
        region_costs[reg]["monthly_cost"] = round(region_costs[reg]["monthly_cost"], 2)

    return list(region_costs.values())

@router.get("/by-type")
def get_cost_by_type(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resources = db.query(CloudResource).filter(
        CloudResource.owner_id == current_user.id
    ).all()

    type_costs = {}
    for r in resources:
        if r.resource_type not in type_costs:
            type_costs[r.resource_type] = {
                "resource_type": r.resource_type,
                "resource_count": 0,
                "monthly_cost": 0.0
            }
        type_costs[r.resource_type]["resource_count"] += 1
        type_costs[r.resource_type]["monthly_cost"] += r.monthly_cost

    for t in type_costs:
        type_costs[t]["monthly_cost"] = round(type_costs[t]["monthly_cost"], 2)

    return list(type_costs.values())

@router.get("/top-expensive")
def get_top_expensive(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resources = db.query(CloudResource).filter(
        CloudResource.owner_id == current_user.id
    ).order_by(CloudResource.monthly_cost.desc()).limit(limit).all()

    return [
        {
            "id": r.id,
            "name": r.name,
            "provider": r.provider,
            "resource_type": r.resource_type,
            "region": r.region,
            "monthly_cost": r.monthly_cost
        }
        for r in resources
    ]
