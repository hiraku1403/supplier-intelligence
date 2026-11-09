
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Building2,
  X,
  Filter,
} from "lucide-react";

import { api, type Supplier } from "@/services/api";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  approved: "Aprovado",
  pending_review: "Em análise",
  blocked: "Bloqueado",
};

const categoryLabels: Record<string, string> = {
  low: "Baixo risco",
  medium: "Médio risco",
  high: "Alto risco",
};

function getStatusClass(status: string) {
  if (status === "approved") return "status-approved";
  if (status === "blocked") return "status-blocked";
  return "status-pending";
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  async function loadSuppliers() {
    try {
      setLoading(true);
      setError("");

      const data = await api.getSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error("Erro ao carregar fornecedores:", err);
      setError("Não foi possível carregar os fornecedores.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    const normalizedSearch = search
      .toLowerCase()
      .replace(/[.\-/\s]/g, "");

    return suppliers.filter((supplier) => {
      const searchableText = [
        supplier.trade_name,
        supplier.legal_name,
        supplier.cnpj,
      ]
        .join(" ")
        .toLowerCase()
        .replace(/[.\-/\s]/g, "");

      const matchesSearch =
        normalizedSearch === "" ||
        searchableText.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        supplier.homologation_status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        supplier.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [suppliers, search, statusFilter, categoryFilter]);

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
  }

  const hasActiveFilters =
    search !== "" ||
    statusFilter !== "all" ||
    categoryFilter !== "all";

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Fornecedores</h1>
          <p>
            Consulte os fornecedores cadastrados e acompanhe
            sua situação de homologação.
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={loadSuppliers}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Atualizar
        </button>
      </div>

      <div className="card">
        <div className="supplier-list-header">
          <div>
            <h2>Base de fornecedores</h2>
            <p>
              Exibindo {filteredSuppliers.length} de{" "}
              {suppliers.length} fornecedores
            </p>
          </div>

          <Building2 size={22} />
        </div>

        <div className="supplier-filters">
          <div className="supplier-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar por nome, razão social ou CNPJ..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar fornecedores"
            />
          </div>

          <div className="supplier-filter-select">
            <Filter size={16} />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              aria-label="Filtrar por homologação"
            >
              <option value="all">Todas as situações</option>
              <option value="approved">Aprovados</option>
              <option value="pending_review">Em análise</option>
              <option value="blocked">Bloqueados</option>
            </select>
          </div>

          <div className="supplier-filter-select">
            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              aria-label="Filtrar por categoria"
            >
              <option value="all">Todas as categorias</option>
              <option value="low">Baixo risco</option>
              <option value="medium">Médio risco</option>
              <option value="high">Alto risco</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              className="btn btn-clear-filters"
              onClick={clearFilters}
            >
              <X size={15} />
              Limpar filtros
            </button>
          )}
        </div>

        {loading ? (
          <div className="supplier-feedback">
            Carregando fornecedores...
          </div>
        ) : error ? (
          <div className="supplier-feedback supplier-error">
            <p>{error}</p>
            <button className="btn" onClick={loadSuppliers}>
              Tentar novamente
            </button>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="supplier-feedback">
            <Search size={28} />
            <p>Nenhum fornecedor encontrado.</p>
            <span>
              Tente alterar os termos da busca ou os filtros.
            </span>

            {hasActiveFilters && (
              <button
                className="btn btn-secondary"
                onClick={clearFilters}
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fornecedor</th>
                  <th>CNPJ</th>
                  <th>Categoria</th>
                  <th>Risco</th>
                  <th>Homologação</th>
                  <th>Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>
                      <div className="supplier-name">
                        <strong>{supplier.trade_name}</strong>
                        <span>{supplier.legal_name}</span>
                      </div>
                    </td>

                    <td>{supplier.cnpj}</td>

                    <td>
                      {categoryLabels[supplier.category] ??
                        supplier.category}
                    </td>

                    <td>
                      <span className="risk-score">
                        {supplier.risk_score}/100
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          supplier.homologation_status
                        )}`}
                      >
                        {statusLabels[
                          supplier.homologation_status
                        ] ?? supplier.homologation_status}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          supplier.registration_status === "active"
                            ? "registration-active"
                            : "registration-inactive"
                        }
                      >
                        {supplier.registration_status === "active"
                          ? "Ativo"
                          : "Irregular"}
                      </span>
                    </td>
                    <td>
                        <Link
                          href={`/suppliers/${supplier.id}`}
                          className="supplier-detail-link"
                        >
                          Ver detalhes
                        </Link>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="simulation-banner">
        <strong>Ambiente demonstrativo:</strong> os dados dos
        fornecedores são fictícios e utilizados exclusivamente
        para demonstrar o funcionamento da solução.
      </div>
    </div>
  );
}
