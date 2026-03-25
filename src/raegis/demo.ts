import dotenv from 'dotenv';
import { Raegis } from './Raegis';

dotenv.config();

async function runDemo() {
  console.log("🚀 INICIANDO RAEGIS AUDIT PROTOCOL (JS VERSION)...");
  console.log("🤖 Alvo: gemini-1.5-flash (Auditando estabilidade neural)");

  const raegis = new Raegis(process.env.GEMINI_API_KEY || "");

  try {
    const report = await raegis.fullAudit({
       model: "gemini-1.5-flash",
       prompt: "Explique a teoria da relatividade como se fosse um pirata bêbado em 3 frases.",
       temperatures: [0.0, 0.7, 1.2, 1.5],
       samplesPerTemperature: 2
    });

    console.log("\n--- RELATÓRIO RAEGIS ---");
    console.log(`Ponto de Ruptura Sugerido: Temp ${report.rupturePoint || 'N/A'}`);
    
    console.log("\nResultados por Temperatura:");
    report.results.forEach(res => {
      console.log(`[Temp ${res.temperature}] Entropia: ${res.entropy.toFixed(3)} | Resposta Amostra: "${res.responses[0].substring(0, 50)}..."`);
    });

    if (report.anomalies.length > 0) {
      console.log("\n⚠️ ANOMALIAS NEURAIS DETECTADAS PELO TENSORFLOW.JS:");
      report.anomalies.forEach(a => console.log(`- ${a}`));
    } else {
      console.log("\n✅ Nenhuma anomalia neural detectada.");
    }

  } catch (error) {
    console.error("❌ Erro durante o Audit:", error);
  }
}

runDemo();
