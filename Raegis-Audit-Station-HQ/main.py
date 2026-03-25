import os
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from schemas import AuditRequest, AuditReport, AnchorRequest, SemanticResult, WhiteboxRequest

# Internal Raegis Core (Imported from the local raegis/ folder)
from raegis import Auditor, RaegisAnchor
from raegis.core.inspector import WhiteboxInspector

app = FastAPI(
    title="Raegis Heavy Audit API",
    description="Scientific LLM auditing layer for local models. Designed for Jason Mayes & Friends.",
    version="1.1.2-aaas"
)

# CORS for JS/TS Frontend (Jason's Demos)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# SECURITY: API KEY HEADER
API_KEY = os.getenv("RAEGIS_API_KEY", "raegis-default-secret-key-1337")

async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid Audit API Key. Access Denied.")
    return x_api_key

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Raegis Heavy Audit Station",
        "supported_engines": ["Ollama", "HuggingFace (Transformers)", "Gemma (Native)"]
    }

@app.post("/audit/behavioral", response_model=AuditReport, dependencies=[Depends(verify_api_key)])
async def behavioral_audit(req: AuditRequest):
    """Heavy temperature sweep audit for hallucinations."""
    auditor = Auditor(model=req.model_name)
    report = auditor.audit(prompt=req.prompt, depth=req.depth)
    
    return {
        "rupture_point": report.rupture_point,
        "best_temperature": report.best_temperature,
        "confidence_score": report.confidence_score,
        "anomalies": [] # Add anomalies from report if needed
    }

@app.post("/audit/semantic", response_model=SemanticResult, dependencies=[Depends(verify_api_key)])
async def semantic_audit(req: AnchorRequest):
    """Semantic fidelity audit (RAG / Anchor Test). Uses Python's deep embeddings."""
    # Note: In a real scenario, Auditor and Anchor logic should be integrated
    auditor = Auditor(model="any")
    anchor = RaegisAnchor(auditor)
    
    result = anchor.test(
        prompt=req.prompt,
        context=req.context,
        threshold=req.threshold
    )
    
    return {
        "fidelity_score": float(result.drift_temperature), # Simplified for now
        "drift_temperature": result.drift_temperature,
        "pass_audit": result.drift_temperature > req.threshold if result.drift_temperature else False
    }

@app.post("/audit/whitebox", dependencies=[Depends(verify_api_key)])
async def whitebox_audit(req: WhiteboxRequest):
    """Deep tensor audit. Extracts token-level entropy from model weights."""
    insp = WhiteboxInspector(model_name=req.model_path, mode="whitebox")
    df = insp.token_entropy_curve(
        prompt=req.prompt,
        temperatures=req.temperatures
    )
    
    # Convert dataframe to list of dicts for JSON serialization
    return df.to_dict(orient="records")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
