from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database import Base
import enum

class CloudProvider(str, enum.Enum):
    AWS = "aws"
    AZURE = "azure"
    GCP = "gcp"

class ResourceStatus(str, enum.Enum):
    ACTIVE = "active"
    STOPPED = "stopped"
    TERMINATED = "terminated"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resources = relationship("CloudResource", back_populates="owner")

class CloudResource(Base):
    __tablename__ = "cloud_resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    resource_id = Column(String, unique=True, nullable=False)
    provider = Column(String, nullable=False)
    resource_type = Column(String, nullable=False)
    region = Column(String, nullable=False)
    status = Column(String, default="active")
    hourly_cost = Column(Float, default=0.0)
    monthly_cost = Column(Float, default=0.0)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    owner = relationship("User", back_populates="resources")

class CostRecord(Base):
    __tablename__ = "cost_records"

    id = Column(Integer, primary_key=True, index=True)
    resource_id = Column(Integer, ForeignKey("cloud_resources.id"))
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    period_start = Column(DateTime(timezone=True), nullable=False)
    period_end = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resource = relationship("CloudResource")
