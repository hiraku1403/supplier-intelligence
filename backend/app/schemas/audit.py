
import json
from pydantic import BaseModel, ConfigDict

from app.schemas.evaluation import RuleFinding


class AuditRecord(BaseModel):
    id: int
    supplier_id: str
    supplier_name: str
    status: str
    risk_score: int
    can_contract: bool
    summary: str
    findings: list[RuleFinding]
    evaluated_at: str
    simulated: bool

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_orm_record(cls, record):
        return cls(
            id=record.id,
            supplier_id=record.supplier_id,
            supplier_name=record.supplier_name,
            status=record.status,
            risk_score=record.risk_score,
            can_contract=record.can_contract,
            summary=record.summary,
            findings=json.loads(record.findings_json),
            evaluated_at=record.evaluated_at,
            simulated=record.simulated,
        )
