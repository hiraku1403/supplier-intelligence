
from sqlalchemy import Boolean, Column, Integer, String, Text

from app.core.database import Base


class EvaluationAudit(Base):
    __tablename__ = "evaluation_audits"

    id = Column(Integer, primary_key=True, index=True)

    supplier_id = Column(String(50), nullable=False, index=True)
    supplier_name = Column(String(255), nullable=False)

    status = Column(String(50), nullable=False)
    risk_score = Column(Integer, nullable=False)
    can_contract = Column(Boolean, nullable=False)

    summary = Column(Text, nullable=False)
    findings_json = Column(Text, nullable=False)

    evaluated_at = Column(String(50), nullable=False)
    simulated = Column(Boolean, default=True, nullable=False)
