# -*- coding: utf-8 -*-
"""
raegis/drift_monitor.py
-------------------------
Unified entry point to run Simulation -> API -> Dashboard.
Usage: python raegis/drift_monitor.py
"""

import sys
import os
import uvicorn
import threading
import time

# Ensure raegis is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from raegis.drift.pipeline import DriftPipeline
from raegis.infrastructure.api import app

def run_api():
    print("[Raegis] Starting Drift Dashboard API on http://localhost:8000/dashboard/")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="warning")

def main():
    # 1. Check if monitoring results exist
    if not os.path.exists("monitoring_results/timeline.json"):
        print("[Raegis] No previous monitoring data found. Running 12-week simulation...")
        pipeline = DriftPipeline()
        pipeline.run_full_pipeline()
    else:
        print("[Raegis] Existing monitoring data found. Skipping simulation.")

    # 2. Start API in an async way or just uvicorn
    # Since we want to keep the process alive, we just run uvicorn
    run_api()

if __name__ == "__main__":
    main()
