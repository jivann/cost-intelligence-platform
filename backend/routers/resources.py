from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models import CloudResource, User
from backend.schemas import CloudResourceCreate, CloudResourceUpdate, CloudResourceResponse
from backend.auth import decode_token
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(prefix="/api/v1/resources", tags=["Cloud Resources"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/", response_model=CloudResourceResponse, status_code=201)
def create_resource(
    resource: CloudResourceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(CloudResource).filter(CloudResource.resource_id == resource.resource_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Resource ID already exists")
    new_resource = CloudResource(**resource.model_dump(), owner_id=current_user.id)
    db.add(new_resource)
    db.commit()
    db.refresh(new_resource)
    return new_resource

@router.get("/", response_model=List[CloudResourceResponse])
def get_resources(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(CloudResource).filter(CloudResource.owner_id == current_user.id).all()

@router.get("/{resource_id}", response_model=CloudResourceResponse)
def get_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resource = db.query(CloudResource).filter(
        CloudResource.id == resource_id,
        CloudResource.owner_id == current_user.id
    ).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource

@router.patch("/{resource_id}", response_model=CloudResourceResponse)
def update_resource(
    resource_id: int,
    update: CloudResourceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resource = db.query(CloudResource).filter(
        CloudResource.id == resource_id,
        CloudResource.owner_id == current_user.id
    ).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(resource, key, value)
    db.commit()
    db.refresh(resource)
    return resource

@router.delete("/{resource_id}", status_code=204)
def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resource = db.query(CloudResource).filter(
        CloudResource.id == resource_id,
        CloudResource.owner_id == current_user.id
    ).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    db.delete(resource)
    db.commit()
