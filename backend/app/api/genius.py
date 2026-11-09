
from fastapi import APIRouter, Query

from app.services.genius_service import (
    consultar_fornecedor,
    listar_pendencias,
    listar_vencimentos,
    status_homologacao,
)

router = APIRouter(
    prefix="/genius",
    tags=["Genius Assistant"],
)


@router.get("/tools")
def list_tools():
    return {
        "agent": "Genius",
        "version": "1.0",
        "tools": [
            {
                "name": "consultar_fornecedor",
                "description": (
                    "Consulta os dados cadastrais e documentos "
                    "de um fornecedor pelo CNPJ."
                ),
                "method": "GET",
                "endpoint": "/genius/tools/suppliers/{cnpj}",
                "parameters": {
                    "cnpj": {
                        "type": "string",
                        "required": True,
                    }
                },
            },
            {
                "name": "status_homologacao",
                "description": (
                    "Retorna o resultado atual da homologação."
                ),
                "method": "GET",
                "endpoint": (
                    "/genius/tools/suppliers/{cnpj}/status"
                ),
                "parameters": {
                    "cnpj": {
                        "type": "string",
                        "required": True,
                    }
                },
            },
            {
                "name": "listar_pendencias",
                "description": (
                    "Lista as pendências e evidências "
                    "identificadas na avaliação."
                ),
                "method": "GET",
                "endpoint": (
                    "/genius/tools/suppliers/{cnpj}/pending"
                ),
                "parameters": {
                    "cnpj": {
                        "type": "string",
                        "required": True,
                    }
                },
            },
            {
                "name": "listar_vencimentos",
                "description": (
                    "Lista documentos vencidos ou próximos "
                    "do vencimento."
                ),
                "method": "GET",
                "endpoint": "/genius/tools/expirations",
                "parameters": {
                    "dias": {
                        "type": "integer",
                        "required": False,
                        "default": 15,
                    }
                },
            },
        ],
        "simulated": True,
    }


@router.get("/tools/suppliers/{cnpj}")
def tool_consultar_fornecedor(cnpj: str):
    return consultar_fornecedor(cnpj)


@router.get("/tools/suppliers/{cnpj}/status")
def tool_status_homologacao(cnpj: str):
    return status_homologacao(cnpj)


@router.get("/tools/suppliers/{cnpj}/pending")
def tool_listar_pendencias(cnpj: str):
    return listar_pendencias(cnpj)


@router.get("/tools/expirations")
def tool_listar_vencimentos(
    dias: int = Query(default=15, ge=0, le=365),
):
    return listar_vencimentos(dias)
