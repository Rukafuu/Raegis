import { DriftResult, ObserverOptions } from "./types";

/**
 * Raegis Observer — Bridge to the Python Drift API.
 * Connects JavaScript core to the heavy-duty MLOps monitoring.
 */
export class Observer {
  private apiUrl: string;

  constructor(options: ObserverOptions = { apiUrl: "http://localhost:8000" }) {
    this.apiUrl = options.apiUrl.replace(/\/$/, "");
  }

  async checkStatus(): Promise<boolean> {
    try {
      const resp = await fetch(`${this.apiUrl}/health`);
      const data = await resp.json();
      return data.status === "healthy";
    } catch {
      return false;
    }
  }

  async getMetrics(): Promise<DriftResult[]> {
    try {
      const resp = await fetch(`${this.apiUrl}/metrics`);
      return await resp.json();
    } catch (error) {
      console.error("[Observer] Failed to fetch drift metrics:", error);
      return [];
    }
  }

  async getAlerts(): Promise<DriftResult[]> {
    try {
      const resp = await fetch(`${this.apiUrl}/alerts`);
      return await resp.json();
    } catch (error) {
      console.error("[Observer] Failed to fetch active monitoring alerts:", error);
      return [];
    }
  }
}
