import { AuditResult } from "./types";

/**
 * Guardian: Detects anomalies in high-temperature outputs.
 * Ported from core/guardian.py (simplified statistical fallback)
 */
export class Guardian {
  private readonly ANOMALY_THRESHOLD = 2.5; // Z-Score threshold

  /**
   * Identifies neural anomalies via reconstruction error analysis 
   * (simplified via statistical variance in response similarity)
   */
  detectAnomaly(results: AuditResult[]): string[] {
    const baseline = results.find(r => r.temperature === 0) || results[0];
    const anomalies: string[] = [];

    // Simple length and variation analysis (Guardian level 1)
    results.forEach(res => {
      const avgLen = this.averageLength(res.responses);
      const baselineLen = this.averageLength(baseline.responses);

      // If temperature is high (>0.8) and entropy is massive, flag anomaly
      if (res.temperature > 0.8 && res.entropy > 1.5) {
        anomalies.push(`Neural RUPTURE at temp ${res.temperature}: Entropy ${res.entropy.toFixed(2)}`);
      }

      // Length collapse check
      if (avgLen < baselineLen * 0.3) {
        anomalies.push(`Content COLLAPSE at temp ${res.temperature}: Response lost 70% of context.`);
      }
    });

    return anomalies;
  }

  private averageLength(arr: string[]): number {
    return arr.reduce((acc, s) => acc + s.length, 0) / arr.length;
  }
}
