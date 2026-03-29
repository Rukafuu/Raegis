import { GoogleGenerativeAI } from "@google/genai";
import { DiagnosisResult } from "./types";

/**
 * Raegis Doctor — The Final Judge using Gemini.
 * Factual diagnostic of LLM outputs.
 */
export class Doctor {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string, modelId: string = "gemini-1.5-flash") {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelId });
  }

  async diagnose(question: string, responseToAudit: string): Promise<DiagnosisResult> {
    const prompt = `
      Question: ${question}
      Response to Audit: ${responseToAudit}

      Task: Evaluate if the response above contains hallucinations, factual errors, or contradictions.
      Respond ONLY in JSON format:
      {"isHallucination": boolean, "score": float(0-1), "clinicalReason": "..."}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const match = text.match(/\{.*\}/s);
      if (match) {
        return JSON.parse(match[0]) as DiagnosisResult;
      }
      throw new Error("Invalid medical diagnosis format");
    } catch (error) {
      console.error("[Doctor] Critical diagnostic failure:", error);
      return {
        isHallucination: true,
        score: 0.0,
        clinicalReason: "Doctor connection lost. Audit inconclusive."
      };
    }
  }
}
