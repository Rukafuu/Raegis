# -*- coding: utf-8 -*-
"""
raegis/drift/auditor.py
-----------------------
DriftAuditor — Monitor data stability (PSI) and model performance (F1/ROC).
"""

from __future__ import annotations

import pandas as pd
import numpy as np
import shap
from typing import Dict, Any, List, Optional
from evidently.legacy.report import Report
from evidently.legacy.metric_preset import DataDriftPreset, ClassificationPreset
from evidently.legacy.pipeline.column_mapping import ColumnMapping

class DriftAuditor:
    """
    Monitors drift in production data and model performance.
    
    Metrics:
    - PSI (Population Stability Index)
    - Drift Share (percentage of features drifted)
    - Performance Metrics (Precision, Recall, F1)
    """

    def __init__(self, target_column: str = "target", prediction_column: str = "prediction"):
        self.target_column = target_column
        self.prediction_column = prediction_column
        self.column_mapping = ColumnMapping()
        self.column_mapping.target = target_column
        self.column_mapping.prediction = prediction_column

    def audit_drift(
        self, 
        reference_data: pd.DataFrame, 
        current_data: pd.DataFrame,
        numerical_features: List[str] = None,
        categorical_features: List[str] = None
    ) -> Dict[str, Any]:
        """
        Runs Data Drift audit using PSI.
        """
        mapping = self.column_mapping
        mapping.numerical_features = numerical_features
        mapping.categorical_features = categorical_features

        report = Report(metrics=[DataDriftPreset()])
        report.run(reference_data=reference_data, current_data=current_data, column_mapping=mapping)
        
        result = report.as_dict()
        
        # Extract summaries
        metrics = result["metrics"][0]["result"]
        drift_share = metrics["share_of_drifted_columns"]
        drift_by_column = {k: v["drift_score"] for k, v in metrics["drift_by_columns"].items()}
        
        return {
            "drift_share": drift_share,
            "drift_by_column": drift_by_column,
            "is_drifted": drift_share > 0.3, # Threshold suggested in user prompt
            "report_json": result
        }

    def audit_performance(
        self, 
        reference_data: pd.DataFrame, 
        current_data: pd.DataFrame
    ) -> Dict[str, Any]:
        """
        Runs Classification Performance audit.
        """
        report = Report(metrics=[ClassificationPreset()])
        report.run(reference_data=reference_data, current_data=current_data, column_mapping=self.column_mapping)
        
        result = report.as_dict()
        metrics = result["metrics"][0]["result"]["current"]
        
        return {
            "accuracy": metrics["accuracy"],
            "precision": metrics["precision"],
            "recall": metrics["recall"],
            "f1": metrics["f1"],
            "roc_auc": metrics["roc_auc"],
            "report_json": result
        }

    def explain_drift(self, model: Any, data: pd.DataFrame) -> Dict[str, float]:
        """
        Calculates SHAP global importance for the provided model and data.
        Used to identify why the model is making certain predictions.
        """
        try:
            # SHAP TreeExplainer for XGBoost
            explainer = shap.TreeExplainer(model)
            shap_values = explainer.shap_values(data)
            
            # Global importance (mean absolute SHAP)
            mean_abs_shap = np.abs(shap_values).mean(axis=0)
            importance = dict(zip(data.columns, mean_abs_shap.tolist()))
            
            return importance
        except Exception as e:
            print(f"[DriftAuditor] SHAP failed: {e}")
            return {}
