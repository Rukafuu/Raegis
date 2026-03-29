# -*- coding: utf-8 -*-
"""
raegis/drift/pipeline.py
-------------------------
End-to-end pipeline: Simulates, Audits, and Saves week-by-week results.
"""

import os
import json
import pandas as pd
from raegis.drift.simulation import FraudSimulator
from raegis.drift.auditor import DriftAuditor

class DriftPipeline:
    """
    Main pipeline to execute the 12-week monitoring cycle.
    """

    def __init__(self, output_dir: str = "monitoring_results"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        self.simulator = FraudSimulator()
        self.auditor = DriftAuditor()
        self.model = None

    def run_full_pipeline(self):
        print("[Raegis] Initializing Fraud Detection Baseline...")
        ref_df, model = self.simulator.generate_baseline(n_rows=50000)
        self.model = model
        
        # Save baseline importance
        base_features = ref_df.drop(columns=["target", "prediction"])
        base_importance = self.auditor.explain_drift(model, base_features)
        
        # Save reference
        ref_df.to_parquet(os.path.join(self.output_dir, "reference.parquet"))
        
        all_metrics = []
        
        for week in range(1, 13):
            print(f"[Raegis] Processing WEEK {week:02d}...")
            curr_df = self.simulator.generate_week(week=week, n_rows=5000)
            
            # Audit Data Drift
            drift_results = self.auditor.audit_drift(ref_df, curr_df)
            
            # Audit Classification Performance
            performance = self.auditor.audit_performance(ref_df, curr_df)
            
            # Explainability (SHAP)
            curr_features = curr_df.drop(columns=["target", "prediction"])
            importance = self.auditor.explain_drift(self.model, curr_features)
            
            # Combine
            week_metrics = {
                "week": week,
                "drift_share": drift_results["drift_share"],
                "drifted_features": [k for k, v in drift_results["drift_by_column"].items() if v > 0.1],
                "f1_score": performance["f1"],
                "precision": performance["precision"],
                "recall": performance["recall"],
                "importance": importance,
                "baseline_importance": base_importance,
                "is_alert": drift_results["is_drifted"] or performance["f1"] < 0.7
            }
            
            all_metrics.append(week_metrics)
            
            # Save weekly JSON for dashboard
            with open(os.path.join(self.output_dir, f"week_{week:02d}.json"), "w") as f:
                json.dump(week_metrics, f, indent=4)
        
        # Final summary
        with open(os.path.join(self.output_dir, "timeline.json"), "w") as f:
            json.dump(all_metrics, f, indent=4)
            
        print(f"[Raegis] Pipeline complete. Results saved in: {self.output_dir}")

if __name__ == "__main__":
    pipeline = DriftPipeline()
    pipeline.run_full_pipeline()
