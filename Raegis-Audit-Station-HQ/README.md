# Raegis Scientific Audit Station 🔬 `HQ Edition`

> **The Deep-Analysis Engines for the Raegis Protocol**

While the Raegis-JS SDK handles lightweight UI and monitoring, this station provides the **Heavy Scientific Inference** required for deep-learning auditing of models like Google Gemma and Llama.

## 📐 Scientific Features
- **Whitebox Inspection**: Real-time token entropy extracted from local model weights (PyTorch/Transformers).
- **Deep Semantic Rivelry**: Parallel Sentence-Transformer scoring for RAG fidelity.
- **Neural Guardian HQ**: GPU-accelerated Autoencoders for anomaly fingerprinting.

## 🚀 Setup & Launch
1. `pip install -r requirements.txt`
2. Configure your `.env` (Set `RAEGIS_API_KEY`)
3. `uvicorn main:app --reload`

## 🐳 Docker Mode
```bash
docker build -t raegis-hq-station .
docker run -p 8000:8000 raegis-hq-station
```

Connecting to the JS SDK:
```typescript
const audit = await raegis.fullAudit({
  prompt: "...",
  bridgeUrl: "http://localhost:8000",
  apiKey: "YOUR_HQ_API_KEY"
});
```

Built for the **Gemma** ecosystem and Jason Mayes' Web-AI vision.
By **Lucas Frischeisen**. [LinkedIn](https://linkedin.com/in/rukafuu)
