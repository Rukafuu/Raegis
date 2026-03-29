export interface AuditOptions {
  model: string;
  prompt: string;
  temperatures: number[];
  samplesPerTemperature: number;
  bridgeUrl?: string;
  bridgeKey?: string;
}

export interface AuditResult {
  temperature: number;
  responses: string[];
  entropy: number;
  timestamp: string;
}

export interface AnchorOptions {
  response: string;
  context: string;
}

export interface AnchorResult {
  similarity: number;
  isReliable: boolean;
  threshold: number;
}

export interface DriftResult {
  week: number;
  driftShare: number;
  isAlert: boolean;
  f1Score: number;
  driftedFeatures: string[];
}

export interface DiagnosisResult {
  isHallucination: boolean;
  score: number;
  clinicalReason: string;
}

export interface ObserverOptions {
  apiUrl: string;
}
