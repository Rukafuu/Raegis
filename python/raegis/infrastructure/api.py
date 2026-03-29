# -*- coding: utf-8 -*-
"""
raegis/infrastructure/api.py
----------------------------
API for serving Drift metrics and Alerts.
"""

import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

app = FastAPI(title="Raegis Drift API", version="1.0.0")

# Enable CORS for local dashboard development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

RESULTS_DIR = "monitoring_results"

@app.get("/health")
def health():
    return {"status": "healthy", "service": "raegis-drift-api"}

@app.get("/metrics")
def get_metrics() -> List[Dict[str, Any]]:
    """Returns the performance timeline for all simulated weeks."""
    timeline_path = os.path.join(RESULTS_DIR, "timeline.json")
    if not os.path.exists(timeline_path):
        raise HTTPException(status_code=404, detail="No metrics found. Run pipeline first.")
    
    with open(timeline_path, "r") as f:
        return json.load(f)

@app.get("/alerts")
def get_alerts():
    """Returns weeks that triggered drift alerts."""
    try:
        metrics = get_metrics()
        return [m for m in metrics if m.get("is_alert")]
    except:
        return []

@app.get("/week/{week_number}")
def get_week_detail(week_number: int):
    """Returns detailed JSON for a specific week."""
    path = os.path.join(RESULTS_DIR, f"week_{week_number:02d}.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"Week {week_number} not found.")
    
    with open(path, "r") as f:
        return json.load(f)

# Mount Dashboard as Static Files
DASHBOARD_PATH = os.path.join(os.path.dirname(__file__), "dashboard")
if os.path.exists(DASHBOARD_PATH):
    app.mount("/dashboard", StaticFiles(directory=DASHBOARD_PATH, html=True), name="dashboard")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
