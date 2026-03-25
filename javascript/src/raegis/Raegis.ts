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
   * Supports local JS audit or Bridge to Python HQ Station
   */
  async fullAudit(options: AuditOptions): Promise<{ 
    results: AuditResult[], 
    anomalies: string[], 
    rupturePoint: number | null 
  }> {
    // BRIDGE MODE: Delegate to Python HQ Station if bridgeUrl is provided
    if (options.bridgeUrl) {
      console.log("Raegis-JS: Delegating to Scientific HQ Station @ " + options.bridgeUrl);
      const hqResponse = await fetch(`${options.bridgeUrl}/audit/behavioral`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': options.bridgeKey || ""
        },
        body: JSON.stringify({
          prompt: options.prompt,
          model_name: options.model,
          temperatures: options.temperatures,
          depth: options.samplesPerTemperature
        })
      });

      if (!hqResponse.ok) {
        throw new Error(`HQ Station error: ${hqResponse.statusText}`);
      }

      const hqData = await hqResponse.json();
      return {
        results: [], // TODO: Map HQ results back to AuditResult[]
        anomalies: hqData.anomalies || [],
        rupturePoint: hqData.rupture_point
      };
    }

    // LOCAL MODE: Native JS Implementation
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
