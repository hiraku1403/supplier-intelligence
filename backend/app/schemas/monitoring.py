
from datetime import date
from pydantic import BaseModel


class ExpirationAlert(BaseModel):
    supplier_id: str
    supplier_name: str
    document_type: str
    document_name: str
    expiration_date: date
    days_remaining: int
    severity: str
    message: str
    simulated: bool = True
