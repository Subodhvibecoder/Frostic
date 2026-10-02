# Frostic — Enterprise AI Cost Intelligence & Spend Optimization

Frostic is an elite, full-stack financial operations (FinOps) platform designed to track transaction streams, deprovision unused software seats, monitor supplier risk, scan invoices for anomalies, optimize cloud resources, and trace recovered value directly to the balance sheet.

---

## 🚀 Key Features & Capabilities

1. **Executive Command Center**: Centralized KPI metrics tracking total run-rates, annual forecasts, health ratings, and custom SVG spending projection charts.
2. **Subscription Auditor**: Scans seat utilisation metrics across central tools (Notion, Figma, Slack) to determine dormant user accounts.
3. **Invoice Intelligence Engine**: Simulates drag-and-drop OCR invoice ingestion to detect price hikes and double-billing discrepancies.
4. **Cloud Cost Optimizer**: Interactive sliders to map compute core downsizing, database IOPS limits, andNAT gateway terminations.
5. **What-If Savings Simulator**: Toggle deprovision rates, cloud tuning percentages, and contract targets to view instant annualized impact.
6. **Overlapping Tool Finder**: Scans separate department credit cards to locate competing redundant software suites (e.g., Zoom vs Meet, Miro vs Figma).
7. **Frostic Gemini Playground**: Full-page, secure, multi-turn AI playground directly proxied to **Gemini-3.8-Flash** with full context awareness of your active workspace database.
8. **Security Audit Trails**: Traceable logs recording all admin operations and active team permission mappings.

---

## 🛠 Tech Stack

* **Frontend**: React (v19), TypeScript, Tailwind CSS, Lucide Icons, Motion.
* **Backend**: Express running Node.js with automated dev server HMR proxy mounts.
* **AI Core**: Official `@google/genai` modern SDK integrated over secured cloud routes.

---

## ⚙️ Installation & Setup

### 1. Ingest Dependencies
Ensure Node.js is installed, then pull down dependencies:
```bash
npm install
```

### 2. Configure Local Secrets
Duplicate `.env.example` to `.env` and fill in your Gemini API key (optional, has smart local fallback):
```bash
cp .env.example .env
```
Open `.env` and configure:
```text
GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
```

### 3. Run Dev Server
Launch the unified full-stack server running on port `3000`:
```bash
npm run dev
```

---

## 📂 Repository Tree Structure

* `/server.ts` — Full-stack Express server routing and Vite middleware hooks.
* `/src/App.tsx` — Global router state and central ledger stores.
* `/src/data.ts` — Centralized FinOps datasets, type structures, and default models.
* `/src/components/` — Individual premium dashboard UI widgets.
* `/src/index.css` — Core Tailwind layouts and custom slow-rotation animations.

---

## 🔒 Security & Privacy Invariants

Frostic runs on a strict **Zero-Knowledge Privacy Principle**. No transaction indices, private employee records, or custom corporate budget scopes are stored externally or logged outside the local database state.
