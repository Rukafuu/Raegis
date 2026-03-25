# Raegis `v0.1.3`

> **The stethoscope for your local LLMs** — behavioral diagnostics, hallucination detection, and RAG / Fine-tuning validation.

Raegis tests your model by running the same prompt across a temperature ramp (e.g., `0.0` to `1.5`), measuring internal consistency (TF-IDF/Cosine) and vocabulary diversity (Shannon Entropy). With this data, it fingerprints the model’s personality, defines the **hallucination breaking point**, audits **RAG pipelines**, and compares **Personality Drift** after fine-tuning.

## 📐 Dual-Core Architecture

Raegis provides two parallel but semantically equivalent implementations:

| Feature | Python Core (`pip`) | JavaScript Core (`npm`) |
| :--- | :--- | :--- |
| **Logic** | Asynchronous `aiohttp` | Native `fetch` / `Google GenAI` |
| **Neural** | Keras / TensorFlow | TensorFlow.js (TF.js) |
| **Visualization** | Streamlit Dashboard | React / Vite Dashboard |
| **Usage** | Production Pipelines | Demos, Edge & Web Apps |

---

## Installation & Setup

### 🐍 Python (Standard Core)
```bash
cd python
pip install -r requirements.txt
# Dashboard
python -m streamlit run app.py
```

### ⚡ JavaScript / TypeScript (Native Core)
```bash
cd javascript
npm install
# Audit Server
npx tsx src/raegis/RaegisServer.ts
```

---

## 🚀 Usage (Python)

### 1. Behavioral Diagnostics
```python
from raegis import Auditor
auditor = Auditor(model="ollama/llama3.2")
report = auditor.audit(prompt="...", depth=3)
```

### 2. LLM-as-a-Judge
```python
results = auditor.judge_rag(query, contexts, response)
```

---

## 🚀 Usage (JavaScript / TypeScript)

### 1. Library Usage
```typescript
import { Raegis } from './javascript/src/raegis/Raegis';
const raegis = new Raegis(API_KEY);
const audit = await raegis.fullAudit({ prompt: "..." });
```

---

## Open Source Architecture

- `python/raegis/`: Core Python logic and Streamlit app.
- `javascript/src/raegis/`: Core TypeScript logic and React website.

## License
Apache License 2.0. Built by **Lucas Frischeisen**. [LinkedIn](https://linkedin.com/in/rukafuu)
