import express from 'express';
import dotenv from 'dotenv';
import { Raegis } from './Raegis';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const raegis = new Raegis(process.env.GEMINI_API_KEY || "");

app.use(express.json());

// Main Audit Endpoint
app.post('/api/raegis/audit', async (req, res) => {
  try {
    const { model, prompt, temperatures, samplesPerTemperature } = req.body;
    
    if (!model || !prompt) {
      return res.status(400).json({ error: "Missing model or prompt" });
    }

    const auditData = await raegis.fullAudit({
      model,
      prompt,
      temperatures: temperatures || [0, 0.5, 0.8, 1.2, 1.5],
      samplesPerTemperature: samplesPerTemperature || 3
    });

    res.json(auditData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Anchor / RAG Validation Endpoint
app.post('/api/raegis/anchor', async (req, res) => {
  try {
    const { response, context, threshold } = req.body;
    
    if (!response || !context) {
      return res.status(400).json({ error: "Missing response or context" });
    }

    const result = await raegis.validateRAG({ response, context }, threshold);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/raegis/status', (req, res) => {
  res.json({ status: "RAEGIS_PROTOCOL_ACTIVE", version: "0.1.0-JS" });
});

app.listen(port, () => {
  console.log(`📡 RAEGIS JS Audit Server listening on port ${port}`);
});
