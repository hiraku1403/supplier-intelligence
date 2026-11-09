
from pydantic import BaseModel, Field

from app.schemas.supplier import HomologationStatus


class RuleFinding(BaseModel):
    rule_id: str
    title: str
    description: str
    severity: str
    evidence: str


class SupplierEvaluation(BaseModel):
    supplier_id: str
    supplier_name: str
    status: HomologationStatus
    risk_score: int = Field(ge=0, le=100)
    can_contract: bool
    summary: str
    findings: list[RuleFinding] = Field(default_factory=list)
    evaluated_at: str
    simulated: bool = True
