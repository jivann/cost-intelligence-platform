from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class CloudResourceCreate(BaseModel):
    name: str
    resource_id: str
    provider: str
    resource_type: str
    region: str
    hourly_cost: float
    monthly_cost: float

class CloudResourceUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    hourly_cost: Optional[float] = None
    monthly_cost: Optional[float] = None

class CloudResourceResponse(BaseModel):
    id: int
    name: str
    resource_id: str
    provider: str
    resource_type: str
    region: str
    status: str
    hourly_cost: float
    monthly_cost: float
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CostRecordCreate(BaseModel):
    resource_id: int
    amount: float
    currency: str
    period_start: datetime
    period_end: datetime

class CostRecordResponse(BaseModel):
    id: int
    resource_id: int
    amount: float
    currency: str
    period_start: datetime
    period_end: datetime
    created_at: datetime

    class Config:
        from_attributes = True
