# Raegis 🔬🩺 `v2.0.0 — The Diagnostic Overhaul`

> **The ultimate stethoscope for AI systems** — behavioral diagnostics, production drift monitoring, adversarial stress testing, and Truth Anchoring.

Raegis is an end-to-end audit protocol designed to ensure AI safety and reliability. Version 2.0 expands beyond simple LLM temperature checks into a full-scale **MLOps Observability** platform. It now monitors **tabular model degradation**, explains **data drift via SHAP**, and uses **Gemini 1.5** as a "Truth Anchor" for factual validation.

---

## 🌟 What's New in v2.0 (The Heist)

| Feature | Description | Status |
| :--- | :--- | :--- |
| **📉 ML Drift Monitor** | Continuous monitoring for tabular models (XGBoost, etc.) using PSI and Performance metrics. | **New** |
| **📊 Explainable AI (SHAP)** | Interactive SHAP analysis to diagnose *why* a model is drifting or failing. | **New** |
| **🧪 Stress Test Engine** | Adversarial prompt auditing: typos, negations, and jailbreak resilience scores. | **New** |
| **🏥 Raegis Doctor** | LLM-as-a-Judge using Gemini 1.5 Pro/Flash to audit local models (Llama/Mistral). | **New** |
| **💎 Premium Dashboard** | High-end Dark Mode UI built with Vanilla JS + Plotly for instant, interactive insights. | **New** |

---

## 🛠 Installation

Raegis 2.0 follows a modular structure. You can install only what you need.

### 🐍 Python Core
```bash
cd python
# Basic installation
pip install -e .

# Full MLOps + Drift + Diagnostic stack (Recommended)
pip install -e .[full]
```

---

## 🚀 Advanced Usage

### 1. ML Drift & Monitoring (The Fraud Monitor)
Monitor a model's stability over weeks of production data.
```bash
# Execute the 12-week simulation pipeline and start the Dashboard
python -m raegis.drift_monitor
```
> Access the interactive dashboard at: `http://localhost:8000/dashboard/`

### 2. Adversarial Stress Testing
Test if your prompt is robust enough to survive real-world typos and attacks.
```python
from raegis import Auditor
from raegis.stress_test import StressTester

auditor = Auditor(model="llama3.2")
tester = StressTester(auditor)

# Run a battery of 6 different adversarial perturbations
results = tester.run_stress_test("Explain the laws of thermodynamics.")
print(results)
```

### 3. The Truth Anchor (Raegis Doctor)
Use a powerful "Anchor" model to verify the clinical accuracy of a local response.
```python
# Requires GEMINI_API_KEY in .env
diagnosis = auditor.diagnose(
    question="What is the capital of Mars?", 
    response="The capital of Mars is Elon City."
)
# Returns: { "is_hallucination": True, "score": 0.98, "clinical_reason": "Mars has no capital." }
```

---

## 🗞 Changelog

### [2.0.0] — 2026-03-29 (The Diagnostic Overhaul)
- **Added**: `raegis.drift` module for MLOps monitoring.
- **Added**: `DriftAuditor` with PSI (Population Stability Index) and Classification presets.
- **Added**: `FraudSimulator` for standard drift benchmarking.
- **Added**: `SHAP` integration for feature importance attribution in the dashboard.
- **Added**: `StressTester` for adversarial prompt engineering tests.
- **Added**: `RaegisDoctor` serving as a Truth Anchor via Gemini 1.5.
- **Internal**: Transitioned dashboard from Streamlit to a performance-first **FastAPI + Vanilla JS** stack.

### [0.1.3] — 2026-03-25
- Initial dual-core alpha (Python + JS).
- Basic temperature consistency and hallucination detection via Autoencoders.

---

## License
Apache License 2.0. Built by **Lucas Frischeisen**. [LinkedIn](https://linkedin.com/in/rukafuu)
