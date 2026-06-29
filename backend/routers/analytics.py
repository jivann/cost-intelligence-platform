from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import CloudResource, User
from backend.routers.resources import get_current_user
from backend.cache import get_cached, set_cached

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])

@router.get("/summary")
def get_cost_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cache_key = f"analytics:summary:{current_user.id}"
    cached = get_cached(cache_key)
    if cached:
        cached["cached"] = True
        return cached

    resources = db.query(CloudResource).filter(
        CloudResource.owner_id == current_user.id
    ).all()

    total_monthly = sum(r.monthly_cost for r in resources)
    total_hourly = sum(r.hourly_cost for r in resources)
    active_count = sum(1 for r in resources if r.status == "active")
    stopped_count = sum(1 for r in resources if r.status == "stopped")

    result = {
        "total_resources": len(resources),
        "active_resources": active_count,
        "stopped_resources": stopped_count,
        "total_hourly_cost": round(total_hourly, 4),
        "total_monthly_cost": round(total_monthly, 2),
        "total_yearly_cost": round(total_monthly * 12, 2),
        "cached": False
    }

    set_cached(cache_key, result, ttl=300)
    return result

@router.get("/by-provider")
def get_cost_by_provider(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cache_key = f"analytics:by-provider:{current_user.id}"
    cached = get_cached(cache_key)
    if cached:
        return cached

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

    result = list(provider_costs.values())
    set_cached(cache_key, result, ttl=300)
    return result

@router.get("/by-region")
def get_cost_by_region(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cache_key = f"analytics:by-region:{current_user.id}"
    cached = get_cached(cache_key)
    if cached:
        return cached

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

    result = list(region_costs.values())
    set_cached(cache_key, result, ttl=300)
    return result

@router.get("/by-type")
def get_cost_by_type(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cache_key = f"analytics:by-type:{current_user.id}"
    cached = get_cached(cache_key)
    if cached:
        return cached

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

    result = list(type_costs.values())
    set_cached(cache_key, result, ttl=300)
    return result

@router.get("/top-expensive")
def get_top_expensive(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cache_key = f"analytics:top-expensive:{current_user.id}:{limit}"
    cached = get_cached(cache_key)
    if cached:
        return cached

    resources = db.query(CloudResource).filter(
        CloudResource.owner_id == current_user.id
    ).order_by(CloudResource.monthly_cost.desc()).limit(limit).all()

    result = [
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

    set_cached(cache_key, result, ttl=300)
    return result
