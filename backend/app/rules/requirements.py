
from app.schemas.supplier import SupplierCategory


REQUIRED_DOCUMENTS = {
    SupplierCategory.LOW: {
        "FEDERAL_CLEARANCE",
    },
    SupplierCategory.MEDIUM: {
        "FEDERAL_CLEARANCE",
        "CNDT",
        "FGTS",
    },
    SupplierCategory.HIGH: {
        "FEDERAL_CLEARANCE",
        "CNDT",
        "FGTS",
        "OPERATING_LICENSE",
    },
}

EXPIRATION_WARNING_DAYS = 15
