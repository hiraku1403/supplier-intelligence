
from app.mock_data.supplier_data import SUPPLIERS
from app.schemas.supplier import Supplier


def list_suppliers() -> list[Supplier]:
    return SUPPLIERS


def get_supplier_by_id(supplier_id: str) -> Supplier | None:
    for supplier in SUPPLIERS:
        if supplier.id == supplier_id:
            return supplier

    return None
