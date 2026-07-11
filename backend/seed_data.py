from backend.database import SessionLocal
from backend.models import CloudResource, User

db = SessionLocal()

user = db.query(User).filter(User.username == "jivannxdev").first()
if not user:
    print("User not found — check username")
    exit(1)

resources = [
    {"name": "web-server-prod-1", "resource_id": "i-0a1b2c3d4e5f001", "provider": "aws", "resource_type": "EC2", "region": "us-east-1", "status": "active", "hourly_cost": 0.096, "monthly_cost": 70.08},
    {"name": "db-primary", "resource_id": "i-0a1b2c3d4e5f002", "provider": "aws", "resource_type": "RDS", "region": "us-east-1", "status": "active", "hourly_cost": 0.24, "monthly_cost": 175.20},
    {"name": "cache-redis-01", "resource_id": "i-0a1b2c3d4e5f003", "provider": "aws", "resource_type": "ElastiCache", "region": "us-west-2", "status": "active", "hourly_cost": 0.068, "monthly_cost": 49.64},
    {"name": "old-staging-vm", "resource_id": "i-0a1b2c3d4e5f004", "provider": "azure", "resource_type": "VM", "region": "eastus", "status": "stopped", "hourly_cost": 0.0, "monthly_cost": 0.0},
    {"name": "storage-bucket-logs", "resource_id": "i-0a1b2c3d4e5f005", "provider": "gcp", "resource_type": "CloudStorage", "region": "us-central1", "status": "active", "hourly_cost": 0.015, "monthly_cost": 10.95},
    {"name": "unattached-volume-42", "resource_id": "i-0a1b2c3d4e5f006", "provider": "aws", "resource_type": "EBS", "region": "us-east-1", "status": "stopped", "hourly_cost": 0.05, "monthly_cost": 5.00},
]

for r in resources:
    exists = db.query(CloudResource).filter(CloudResource.resource_id == r["resource_id"]).first()
    if not exists:
        db.add(CloudResource(owner_id=user.id, **r))

db.commit()
print(f"Seeded {len(resources)} resources for user {user.username} (id={user.id})")
db.close()
