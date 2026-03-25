import { Auditor } from "./Auditor";
import { Anchor } from "./Anchor";
import { Guardian } from "./Guardian";
import { AuditOptions, AuditResult, AnchorOptions, AnchorResult } from "./types";

/**
 * Raegis: The Stethoscope for LLMs (JS Version)
 * Ported from Python implementation for Jason Mayes / Gemma demos.
 */
export class Raegis {
  public auditor: Auditor;
  public anchor: Anchor;
  public guardian: Guardian;

  constructor(apiKey: string) {
    this.auditor = new Auditor(apiKey);
    this.anchor = new Anchor(apiKey);
    this.guardian = new Guardian();
  }

  /**
   * Run a full audit and audit report
   */
  async fullAudit(options: AuditOptions): Promise<{ 
    results: AuditResult[], 
    anomalies: string[], 
    rupturePoint: number | null 
  }> {
    const results = await this.auditor.audit(options);
    const anomalies = this.guardian.detectAnomaly(results);
    
    // Find rupture point (Temp where entropy crosses 1.0 or anomalies begin)
    const rupture = results.find(r => r.entropy > 1.0 || anomalies.length > 0);
    
    return {
      results,
      anomalies,
      rupturePoint: rupture ? rupture.temperature : null
    };
  }

  /**
   * Validate a RAG context
   */
  async validateRAG(options: AnchorOptions, threshold: number = 0.82): Promise<AnchorResult> {
    return await this.anchor.evaluate(options, threshold);
  }
}
