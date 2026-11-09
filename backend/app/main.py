from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.suppliers import router as suppliers_router
from app.api.evaluations import router as evaluations_router
from app.api.monitoring import router as monitoring_router
from app.api.dashboard import router as dashboard_router
from app.api.genius import router as genius_router

from app.core.database import Base, engine
from app.models.audit import EvaluationAudit

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Supplier Intelligence API",
    description=(
        "Plataforma inteligente de homologação e "
        "monitoramento contínuo de fornecedores."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(suppliers_router)
app.include_router(evaluations_router)
app.include_router(monitoring_router)
app.include_router(dashboard_router)
app.include_router(genius_router)


@app.get("/", tags=["General"])
def root():
    return {
        "application": "Supplier Intelligence - Ferrovale",
        "message": "API is running successfully.",
        "version": "1.0.0",
    }


@app.get("/health/", tags=["General"])
def health_check():
    return {
        "status": "healthy",
        "service": "supplier-intelligence-api",
    }
