# Supplier Intelligence

**Plataforma inteligente de homologação e monitoramento contínuo de fornecedores.**

O Supplier Intelligence é um protótipo desenvolvido para a Ferrovale com o objetivo de centralizar o processo de homologação de fornecedores, identificar riscos de compliance, acompanhar vencimentos documentais e fornecer evidências para decisões de contratação.

O projeto combina regras determinísticas de compliance, indicadores de risco, monitoramento e um assistente operacional chamado **Genius**.

<p align="center">
  <a href="https://supplier-intelligence-frontend.onrender.com/">
    <strong>🚀 Acessar demonstração</strong>
  </a>
  &nbsp; | &nbsp;
  <a href="https://supplier-intelligence-7u7u.onrender.com/docs">
    <strong>📚 Documentação da API</strong>
  </a>
</p>

---

## 📌 Problema de negócio

Processos tradicionais de homologação de fornecedores frequentemente dependem de planilhas, e-mails e consultas manuais a diferentes fontes de informação.

Esse cenário pode gerar:

- Demora na homologação de novos fornecedores.
- Aprovação de empresas com irregularidades.
- Documentos vencidos ou próximos do vencimento sem acompanhamento.
- Falta de padronização nos critérios de avaliação.
- Dificuldade de rastrear decisões e evidências de auditoria.

### Nossa proposta

Centralizar essas informações em uma única plataforma, automatizando verificações e oferecendo visibilidade sobre a situação de cada fornecedor.

---

## 🎯 Principais funcionalidades

### Dashboard executivo
- Visão consolidada da base de fornecedores.
- Indicadores de fornecedores aprovados, pendentes e bloqueados.
- Acompanhamento de documentos vencidos.
- Alertas de vencimentos próximos.
- Distribuição por categorias de risco.

### Gestão de fornecedores
- Listagem e pesquisa de fornecedores.
- Filtros por categoria e situação de homologação.
- Visualização detalhada dos documentos.
- Consulta de pendências e indicadores de risco.
- Execução de novas avaliações.

### Motor de compliance
- Regras determinísticas de homologação.
- Verificação de documentos obrigatórios por categoria.
- Identificação de documentos ausentes, vencidos ou próximos do vencimento.
- Identificação de sanções e restrições trabalhistas.
- Justificativas e evidências associadas às regras.

### Monitoramento contínuo
- Identificação de documentos vencidos.
- Alertas de vencimentos futuros.
- Acompanhamento de fornecedores que precisam de revisão.

### Auditoria
- Histórico de avaliações.
- Registro de decisões e evidências.
- Pesquisa e filtros de registros.
- Rastreabilidade das avaliações realizadas.

### Genius Assistant
Assistente operacional que permite consultar informações sobre fornecedores por meio de linguagem natural.

Exemplos:

- "Posso contratar a Metalúrgica Sol para manutenção?"
- "O que falta na homologação da Metalúrgica Sol?"
- "Quais fornecedores possuem documentos vencidos?"

O protótipo utiliza ferramentas simuladas e interpretação de intenções por palavras-chave para demonstrar o fluxo de interação e consulta.

---

## 🧠 Regras de negócio

A avaliação considera a categoria do fornecedor, a situação cadastral, os documentos obrigatórios e os indicadores de compliance.

| Categoria | Exemplo | Documentos considerados |
|---|---|---|
| Baixo risco | Material de escritório | Certidão Federal |
| Médio risco | Serviços e transporte | Certidão Federal, CNDT e FGTS |
| Alto risco | Manutenção industrial | Certidão Federal, CNDT, FGTS e Licença de Operação |

### Status de homologação

| Status | Significado |
|---|---|
| Approved | Fornecedor aprovado |
| Pending Review | Existem pendências que exigem revisão |
| Blocked | Existe uma condição impeditiva identificada |

**Princípios importantes:**

- Irregularidades impeditivas prevalecem sobre outras condições.
- Documentos ausentes ou vencidos geram pendências.
- O score de risco é complementar e não determina sozinho a aprovação.
- Falhas ou indisponibilidade de consultas não significam aprovação.
- Decisões críticas devem possuir evidências e possibilidade de revisão humana.

---

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura separada entre frontend e backend.

```text
                 SUPPLIER INTELLIGENCE
                          |
              +-----------+-----------+
              |                       |
          FRONTEND                 BACKEND
              |                       |
       Next.js / React             FastAPI
       TypeScript                  Python
       Tailwind CSS                Pydantic
       Recharts                    SQLAlchemy
              |                       |
              |               +-------+-------+
              |               |       |       |
              |             Rules   Services  Genius
              |               |       |       |
              |               +-------+-------+
              |                       |
              |                    SQLite
              |                Audit History
              |                       |
              +-----------------------+
```

### Fluxo de avaliação

1. O usuário seleciona um fornecedor.
2. O backend recupera seus dados cadastrais e documentais.
3. O motor de compliance executa as regras determinísticas.
4. O sistema identifica pendências, restrições e evidências.
5. A avaliação retorna o status e o score demonstrativo.
6. O resultado pode ser registrado no histórico de auditoria.
7. O dashboard e as demais telas refletem as informações atualizadas.

---

## 🛠️ Tecnologias utilizadas

### Backend
- Python
- FastAPI
- Pydantic
- SQLAlchemy
- SQLite
- Pytest
- Gemini API (integração opcional)

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React

### Infraestrutura
- Git e GitHub
- Render
- API REST
- CORS

---

## 📂 Estrutura do projeto

```text
supplier-intelligence/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── mock_data/
│   │   ├── models/
│   │   ├── rules/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── tests/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── services/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## 🚀 Como executar localmente

### Pré-requisitos

- Python 3.11 ou superior.
- Node.js e npm.
- Git.

### 1. Clonar o repositório

```bash
git clone https://github.com/hiraku1403/supplier-intelligence.git

cd supplier-intelligence
```

### 2. Configurar o backend

```bash
cd backend

python -m venv .venv
```

Ativar o ambiente virtual no Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Instalar as dependências:

```bash
pip install -r requirements.txt
```

Iniciar a API:

```bash
uvicorn app.main:app --reload
```

A API estará disponível em:

- API: http://127.0.0.1:8000
- Swagger: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health/

### 3. Configurar o frontend

Em outro terminal:

```bash
cd frontend

npm install
```

Crie o arquivo `.env.local` na pasta `frontend`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Inicie a aplicação:

```bash
npm run dev
```

Acesse:

http://localhost:3000

---

## 🧪 Testes

O backend possui testes automatizados para validar endpoints, regras de compliance, avaliações e registros de auditoria.

Para executar:

```bash
cd backend

pytest -v
```

**Resultado da validação do protótipo: 29 testes aprovados.**

---

## 🌐 Demonstração online

| Serviço | Endereço |
|---|---|
| Aplicação Web | https://supplier-intelligence-frontend.onrender.com/ |
| Backend API | https://supplier-intelligence-7u7u.onrender.com/ |
| Swagger / OpenAPI | https://supplier-intelligence-7u7u.onrender.com/docs |
| Health Check | https://supplier-intelligence-7u7u.onrender.com/health/ |

---

## ⚠️ Escopo e limitações do protótipo

Este projeto foi desenvolvido como uma demonstração funcional de arquitetura, regras de negócio e experiência de usuário.

Para manter a transparência técnica:

- Os fornecedores e os resultados das consultas externas utilizam dados simulados.
- As integrações com fontes oficiais, como Receita Federal, CNDT, FGTS e portais de sanções, não estão conectadas em tempo real.
- O Genius utiliza ferramentas simuladas e interpretação de intenções por palavras-chave; não representa um agente autônomo de produção.
- A integração com Gemini é opcional e não é necessária para o funcionamento das funcionalidades principais.
- O score de risco é demonstrativo, não sendo resultado de um modelo de Machine Learning treinado.
- A persistência de auditoria utiliza SQLite. O ambiente hospedado no Render não possui garantia de persistência dos dados após reinicializações ou novos deploys.

O protótipo não deve ser utilizado para decisões reais de contratação sem integrações oficiais, validação jurídica, controles de segurança e revisão humana.

---

## 🔮 Evolução futura

Possíveis próximos passos para transformar o protótipo em uma solução de produção:

- Integração com fontes oficiais de dados públicos.
- PostgreSQL e armazenamento seguro de documentos.
- Autenticação e autorização com RBAC.
- Upload, versionamento e validação documental.
- OCR e extração estruturada de documentos com IA.
- RAG para consulta a políticas internas e normas de homologação.
- Agente Genius com orquestração real de ferramentas.
- Notificações automáticas sobre vencimentos e irregularidades.
- Integração com ERPs e sistemas corporativos.
- Observabilidade, monitoramento e trilhas de segurança.

---

## 👨‍💻 Autor

**Matheus Henn**

Full Stack Developer | Python | FastAPI | Next.js | TypeScript | AI Applications

- GitHub: https://github.com/hiraku1403/
- Portfolio: https://portfolio-matheus-fullstack.vercel.app/pt

---

*Supplier Intelligence — Protótipo desenvolvido para demonstrar uma solução de homologação e monitoramento inteligente de fornecedores.*