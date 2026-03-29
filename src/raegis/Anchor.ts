import { GoogleGenerativeAI } from "@google/genai";
import { AnchorOptions, AnchorResult } from "./types";

/**
 * Anchor handles RAG evaluation logic.
 * Ported from anchor.py
 */
export class Anchor {
  private genAI: GoogleGenerativeAI;
  private readonly DEFAULT_THRESHOLD = 0.82;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Measures semantic fidelity (cosine similarity via embeddings)
   * between response and anchor context.
   */
  async evaluate(options: AnchorOptions, threshold: number = this.DEFAULT_THRESHOLD): Promise<AnchorResult> {
    const embedModel = this.genAI.getGenerativeModel({ model: "embedding-001" });

    // Parallelize embedding calls
    const [responseEmbed, contextEmbed] = await Promise.all([
      embedModel.embedContent(options.response),
      embedModel.embedContent(options.context)
    ]);

    const similarity = this.cosineSimilarity(
      responseEmbed.embedding.values,
      contextEmbed.embedding.values
    );

    return {
      similarity: similarity,
      isReliable: similarity >= threshold,
      threshold: threshold
    };
  }

  /**
   * Normalized dot product between two vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }
}
