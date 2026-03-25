from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class AuditRequest(BaseModel):
    prompt: str = Field(..., description="The prompt to audit.")
    model_name: str = Field("llama3.2", description="The model name (Ollama/HF).")
    temperatures: List[float] = Field([0.0, 0.7, 1.2, 1.5], description="Temperature ramp points.")
    depth: int = Field(3, description="Samples per temperature point.")

class AnchorRequest(BaseModel):
    prompt: str = Field(..., description="The prompt generated.")
    response: str = Field(..., description="The model's response.")
    context: str = Field(..., description="The ground truth context (RAG).")
    threshold: float = Field(0.7, description="The semantic fidelity threshold.")

class WhiteboxRequest(BaseModel):
    prompt: str = Field(..., description="The prompt to inspect.")
    model_path: str = Field(..., description="Local path to model weights (e.g. Gemma).")
    temperatures: List[float] = Field([0.0, 1.5], description="Temperature points to extract entropy.")

class AuditReport(BaseModel):
    rupture_point: float
    best_temperature: float
    confidence_score: float
    anomalies: List[Dict] = []
    
class SemanticResult(BaseModel):
    fidelity_score: float
    drift_temperature: Optional[float] = None
    pass_audit: bool
