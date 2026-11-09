
from fastapi import APIRouter, HTTPException

from app.schemas.supplier import Supplier
from app.services.supplier_service import (
    get_supplier_by_id,
    list_suppliers,
)

router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"],
)


@router.get("/", response_model=list[Supplier])
def get_suppliers():
    return list_suppliers()


@router.get("/{supplier_id}", response_model=Supplier)
def get_supplier(supplier_id: str):
    supplier = get_supplier_by_id(supplier_id)

    if supplier is None:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found.",
        )

    return supplier
