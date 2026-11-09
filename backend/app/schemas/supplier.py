
from datetime import date
from enum import Enum

from pydantic import BaseModel, Field


class SupplierCategory(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class HomologationStatus(str, Enum):
    APPROVED = "approved"
    PENDING_REVIEW = "pending_review"
    BLOCKED = "blocked"


class DocumentStatus(str, Enum):
    VALID = "valid"
    EXPIRING = "expiring"
    EXPIRED = "expired"
    MISSING = "missing"


class SupplierDocument(BaseModel):
    document_type: str
    name: str
    status: DocumentStatus
    issuing_source: str
    issue_date: date | None = None
    expiration_date: date | None = None
    simulated: bool = True


class Supplier(BaseModel):
    id: str
    legal_name: str
    trade_name: str
    cnpj: str
    category: SupplierCategory
    state: str
    city: str
    registration_status: str
    documents: list[SupplierDocument] = Field(default_factory=list)
    active_sanctions: bool = False
    labor_restriction: bool = False
    risk_score: int = Field(ge=0, le=100)
    homologation_status: HomologationStatus
    last_review: date | None = None
    simulated: bool = True
    notes: list[str] = Field(default_factory=list)
