import { GoogleGenerativeAI } from "@google/genai";
import { AuditOptions, AuditResult } from "./types";

export class Auditor {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Orchestrates asynchronous parallel collection of model responses (Audit)
   * Inspired by auditor.py
   */
  async audit(options: AuditOptions): Promise<AuditResult[]> {
    const results: AuditResult[] = [];
    const model = this.genAI.getGenerativeModel({ model: options.model });

    for (const temp of options.temperatures) {
      const responses: string[] = [];
      const startTime = Date.now();

      // Parallelize calls for current temperature
      const tasks = Array.from({ length: options.samplesPerTemperature }).map(async () => {
        try {
          const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: options.prompt }] }],
            generationConfig: {
              temperature: temp,
              topP: 0.95,
              topK: 40,
            },
          });
          return result.response.text();
        } catch (error) {
          console.error(`Audit error at temp ${temp}:`, error);
          return "";
        }
      });

      const temperatureResponses = await Promise.all(tasks);
      
      // Calculate basic shannon entropy based on response variation
      // (Simplified version of the Python metadata calculation)
      const entropy = this.calculateEntropy(temperatureResponses);

      results.push({
        temperature: temp,
        responses: temperatureResponses,
        entropy: entropy,
        timestamp: new Date().toISOString(),
      });
    }

    return results;
  }

  /**
   * Probability-based entropy (simplified)
   */
  private calculateEntropy(responses: string[]): number {
    if (responses.length <= 1) return 0;
    
    const frequencies: Record<string, number> = {};
    responses.forEach(r => {
      frequencies[r] = (frequencies[r] || 0) + 1;
    });

    const probabilities = Object.values(frequencies).map(f => f / responses.length);
    return -probabilities.reduce((sum, p) => sum + p * Math.log2(p), 0);
  }
}
