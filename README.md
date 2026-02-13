# 🧵 AgentFabric — Enterprise AI Agent Orchestration Platform

> **Built for the [2 Fast 2 MCP Hackathon](https://www.wemakedevs.org/hackathons/2fast2mcp)** by WeMakeDevs & Archestra
>
> **AgentFabric is the enterprise control plane for AI agents — combining A2A agent interoperability, Archestra governance, and MCP capability services into a production-ready platform.**

---

## 🎯 Project Overview

**AgentFabric** is an enterprise-grade multi-agent orchestration platform that simulates a real company AI workforce where departments operate as intelligent agents.

The platform demonstrates how enterprises can securely deploy, orchestrate, and scale AI agents using:

* **Archestra** → Governance, orchestration, and policy enforcement
* **A2A Protocol** → Agent-to-agent interoperability
* **MCP (Model Context Protocol)** → Secure tool and data access
* **Next.js 16** → Real-world application integration layer

---

## 🏢 What AgentFabric Demonstrates

### 🤖 Enterprise AI Workforce

* Orchestrator Agent → Company-level reasoning & routing
* HR Agent → Employee and organizational intelligence
* Finance Agent → Financial insights and analytics

### 🔐 Enterprise Governance

* Centralized agent execution via Archestra
* Secure A2A Gateway authentication
* Policy-driven tool and data access
* Server-side credential isolation

### 🔌 Real-Time MCP Data Access

* PostgreSQL MCP server integration
* Live database queries (no static data)
* Structured tool invocation
* Multi-source data capability layer

---

## 🏆 Hackathon Highlights

### Technical Excellence

* ✅ Next.js 16 + React 19 production architecture
* ✅ Real A2A protocol implementation using official SDK
* ✅ Archestra platform integration (no simulation)
* ✅ Streaming AI responses
* ✅ MCP-powered live database queries

### Enterprise Architecture Patterns

* Control plane architecture
* Secure backend proxy pattern
* Agent capability separation
* Protocol interoperability (A2A + MCP)

---

## ⚡ Archestra Platform Capabilities Showcased

---

### 🧠 Agent Orchestration

* Centralized agent lifecycle management
* Multi-agent coordination via orchestrator
* Dynamic agent discovery via A2A Agent Cards
* Versioned prompt deployments

---

### 🔐 Security & Governance

* A2A Gateway token authentication
* Server-side credential management
* Policy-based execution control
* Audit-ready request logging
* Zero client-side secret exposure

---

### 🔌 MCP Capability Layer

* PostgreSQL MCP Server for structured data access
* Real-time query execution
* Type-safe data tooling
* Multi-system integration support

---

### 📊 Observability & Production Readiness

* Request tracing
* Performance metrics
* Streaming response monitoring
* Structured error handling

---

## 🏗️ System Architecture

```
Next.js Enterprise UI
        ↓
Secure Backend Proxy (Next.js API Layer)
        ↓
A2A Gateway (Archestra)
        ↓
AgentFabric Execution Layer
   • Orchestrator Agent
   • HR Agent
   • Finance Agent
        ↓
MCP Capability Layer
        ↓
PostgreSQL MCP Server
```

---

## 🧬 Why AgentFabric Matters

Traditional AI agents:
❌ Run in isolation
❌ No governance
❌ No tool security
❌ No interoperability

AgentFabric enables:
✅ Enterprise agent governance
✅ Secure tool and data access
✅ Multi-agent collaboration
✅ Production observability
✅ Protocol-standard agent communication

---

## 🚀 Quick Start

### Prerequisites

* Node.js 18+
* PostgreSQL 15+
* Archestra Platform running locally

---

### Install

```bash
git clone <repo>
cd agentfabric
npm install
```

---

### Database Setup

```bash
createdb agentfabric
npm run db:push
npm run db:seed
```

---

### Configure Archestra

```bash
cp .env.example .env.local
```

Add:

```
ARCHESTRA_API_KEY=
ARCHESTRA_A2A_GATEWAY_TOKEN=
ARCHESTRA_BASE_URL=

ORCHESTRATOR_PROMPT_ID=
HR_PROMPT_ID=
FINANCE_PROMPT_ID=
```

---

### Run

```bash
npm run dev
```

---

## 🎮 Example Use Cases

### HR Intelligence

* Employee analytics
* Leave management insights
* Organizational queries

### Financial Intelligence

* Budget analysis
* Expense tracking
* Payroll insights

### Company Intelligence

* Cross-department analytics
* Company-wide metrics
* Strategic summaries

---

## 🛠 Tech Stack

| Layer       | Technology               |
| ----------- | ------------------------ |
| Frontend    | Next.js 16 + React 19    |
| Backend     | Next.js API Routes       |
| Protocol    | A2A + MCP                |
| AI Platform | Archestra                |
| Database    | PostgreSQL + Drizzle ORM |
| SDK         | @a2a-js/sdk              |

---

## 🔐 Security Model

* Backend proxy isolation
* Server-side A2A authentication
* Environment-based secrets
* Type-safe DB access
* Same-origin API enforcement

---

## 🎯 Hackathon Criteria Alignment

### Impact

Real enterprise multi-agent architecture.

### Innovation

A2A + Archestra + MCP unified platform.

### Technical Depth

Production-grade infra patterns.

### Best Use of Archestra

Governance + orchestration + MCP capability usage.

---

## 🧭 Future Roadmap

* Additional department agents (Ops, Sales, Compliance)
* Agent-to-agent workflows
* Enterprise audit dashboards
* Policy visualization layer
* Production cloud deployment

---

## 🧵 Project Philosophy

> AgentFabric is not an AI chatbot.
> It is an enterprise agent infrastructure layer.

---


