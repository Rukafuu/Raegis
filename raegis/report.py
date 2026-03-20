# -*- coding: utf-8 -*-
"""
raegis/report.py
----------------
Raegis Result Classes: RaegisReport, AnchorReport, DeltaReport.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
from datetime import datetime
from dataclasses import dataclass, field, asdict
from typing import Optional

import numpy as np
import pandas as pd


# ---------------------------------------------------------------------------
# Helpers de serialização
# ---------------------------------------------------------------------------

def _df_to_dict(df: pd.DataFrame) -> list:
    return df.to_dict(orient="records") if df is not None else []


def _dict_to_df(records: list) -> pd.DataFrame:
    return pd.DataFrame(records) if records else pd.DataFrame()


# ---------------------------------------------------------------------------
# RaegisReport — result of a complete audit()
# ---------------------------------------------------------------------------

class RaegisReport:
    """
    Contains all data from a Raegis diagnostic.
    Can be saved to JSON and loaded for later comparison.
    """

    def __init__(
        self,
        model: str,
        prompt: str,
        df_results: pd.DataFrame,
        df_analysis: pd.DataFrame,
        df_anomalies: Optional[pd.DataFrame] = None,
        metadata: Optional[dict] = None,
    ):
        self.model          = model
        self.prompt         = prompt
        self.df_results     = df_results
        self.df_analysis    = df_analysis
        self.df_anomalies   = df_anomalies
        self.metadata       = metadata or {}
        self.created_at     = datetime.now().isoformat()

        # Computed insights
        self._compute_insights()

    def _compute_insights(self):
        if self.df_analysis is None or self.df_analysis.empty:
            return
        best  = self.df_analysis.loc[self.df_analysis["confidence_score"].idxmax()]
        worst = self.df_analysis.loc[self.df_analysis["confidence_score"].idxmin()]
        sane  = self.df_analysis[
            self.df_analysis["hallucination_risk"].isin(["Low", "Moderate"])
        ]
        self.best_temperature   = float(best["temperature"])
        self.best_confidence    = float(best["confidence_score"])
        self.worst_temperature  = float(worst["temperature"])
        self.worst_confidence   = float(worst["confidence_score"])
        self.rupture_point      = float(sane["temperature"].max()) if not sane.empty else None

    # ------------------------------------------------------------------
    # Persistência
    # ------------------------------------------------------------------

    def save(self, path: str) -> str:
        """Saves the report to JSON. Returns the saved path."""
        os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
        payload = {
            "raegis_version": "0.1.0",
            "created_at":     self.created_at,
            "model":          self.model,
            "prompt":         self.prompt,
            "metadata":       self.metadata,
            "insights": {
                "best_temperature":  getattr(self, "best_temperature",  None),
                "best_confidence":   getattr(self, "best_confidence",   None),
                "worst_temperature": getattr(self, "worst_temperature", None),
                "worst_confidence":  getattr(self, "worst_confidence",  None),
                "rupture_point":     getattr(self, "rupture_point",     None),
            },
            "df_results":  _df_to_dict(self.df_results),
            "df_analysis": _df_to_dict(self.df_analysis),
            "df_anomalies":_df_to_dict(self.df_anomalias),
        }
        with open(path, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2, default=str)
        print(f"[Raegis] Snapshot saved to: {path}")
        return path

    @classmethod
    def load(cls, path: str) -> "RaegisReport":
        """Loads a previously saved report."""
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        report = cls.__new__(cls)
        report.model         = data["model"]
        report.prompt        = data["prompt"]
        report.metadata      = data.get("metadata", {})
        report.created_at    = data.get("created_at", "")
        report.df_results   = _dict_to_df(data.get("df_results",   data.get("df_resultados", [])))
        report.df_analysis  = _dict_to_df(data.get("df_analysis",  data.get("df_analise",    [])))
        report.df_anomalias = _dict_to_df(data.get("df_anomalies", data.get("df_anomalias",  [])))

        ins = data.get("insights", {})
        report.best_temperature  = ins.get("best_temperature")
        report.best_confidence   = ins.get("best_confidence")
        report.worst_temperature = ins.get("worst_temperature")
        report.worst_confidence  = ins.get("worst_confidence")
        report.rupture_point     = ins.get("rupture_point")
        return report

    # ------------------------------------------------------------------
    # Display
    # ------------------------------------------------------------------

    def summary(self) -> str:
        lines = [
            f"[Raegis Report]",
            f"  Model        : {self.model}",
            f"  Prompt       : {self.prompt[:60]}...",
            f"  Created at   : {self.created_at}",
            f"  Best temp    : {getattr(self, 'best_temperature',  'N/A')}",
            f"  Worst temp   : {getattr(self, 'worst_temperature', 'N/A')}",
            f"  Rupture      : {getattr(self, 'rupture_point',     'N/A')}",
        ]
        return "\n".join(lines)

    def show_dashboard(self, port: int = 8520):
        """Opens the Streamlit dashboard in a subprocess."""
        app_path = os.path.join(os.path.dirname(__file__), "..", "app.py")
        app_path = os.path.normpath(app_path)
        env = {**os.environ, "PYTHONUTF8": "1"}
        subprocess.Popen(
            [sys.executable, "-m", "streamlit", "run", app_path,
             "--server.headless", "true", f"--server.port={port}"],
            env=env,
        )
        print(f"[Raegis] Dashboard available at http://localhost:{port}")

    def __repr__(self):
        return self.summary()


# ---------------------------------------------------------------------------
# AnchorReport — result of RaegisAnchor.test()
# ---------------------------------------------------------------------------

class AnchorReport:
    """Result of Anchor Test (RAG validation)."""

    def __init__(
        self,
        model: str,
        prompt: str,
        context: str,
        fidelity_curve: list,        # [(temperature, fidelity), ...]
        anchor_score: float,          # weighted average
        drift_temperature: float,     # temperature where fidelity < 0.7
        backend: str,                 # "sentence_transformers" | "tfidf"
    ):
        self.model             = model
        self.prompt            = prompt
        self.context           = context
        self.fidelity_curve    = fidelity_curve
        self.anchor_score      = anchor_score
        self.drift_temperature = drift_temperature
        self.backend           = backend
        self.created_at        = datetime.now().isoformat()

    def to_dataframe(self) -> pd.DataFrame:
        return pd.DataFrame(self.fidelity_curve, columns=["temperature", "fidelity"])

    def summary(self) -> str:
        lines = [
            f"[Raegis AnchorReport]",
            f"  Backend      : {self.backend}",
            f"  Anchor Score : {self.anchor_score:.4f}",
            f"  Drift Temp   : {self.drift_temperature}",
        ]
        return "\n".join(lines)

    def save(self, path: str) -> str:
        payload = {
            "raegis_version":    "0.1.0",
            "type":              "anchor",
            "created_at":        self.created_at,
            "model":             self.model,
            "prompt":            self.prompt,
            "context_snippet":   self.context[:200],
            "backend":           self.backend,
            "anchor_score":      self.anchor_score,
            "drift_temperature": self.drift_temperature,
            "fidelity_curve":    self.fidelity_curve,
        }
        with open(path, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
        print(f"[Raegis] AnchorReport saved to: {path}")
        return path

    def __repr__(self):
        return self.summary()


# ---------------------------------------------------------------------------
# DeltaReport — result of Comparator.compare()
# ---------------------------------------------------------------------------

class DeltaReport:
    """Result of Fine-tuning Before/After comparison."""
    """Result of Fine-tuning Before/After comparison."""

    VERDICTS = {
        (True,  True):  "Improved",
        (True,  False): "Consistency improved, entropy regressed",
        (False, True):  "Entropy improved, consistency regressed",
        (False, False): "No improvement detected",
    }

    def __init__(
        self,
        model: str,
        prompt: str,
        baseline_created_at: str,
        after_created_at: str,
        df_delta: pd.DataFrame,      # temperature + deltas columns
        personality_drift: float,    # 0=identical, 1=completely different
        rupture_delta: Optional[float],
    ):
        self.model               = model
        self.prompt              = prompt
        self.baseline_created_at = baseline_created_at
        self.after_created_at    = after_created_at
        self.df_delta            = df_delta
        self.personality_drift   = personality_drift
        self.rupture_delta       = rupture_delta
        self.created_at          = datetime.now().isoformat()

        # Automatic verdict
        cons_improved    = df_delta["delta_consistency"].mean() > 0
        entropy_improved = df_delta["delta_entropy"].mean() < 0.5  # high entropy isn't necessarily bad
        self.verdict = (
            "Improved"          if cons_improved and personality_drift < 0.3 else
            "Neutral"           if personality_drift < 0.15 else
            "Overfitted"        if personality_drift > 0.6 else
            "Destabilized"
        )

    def summary(self) -> str:
        lines = [
            f"[Raegis DeltaReport]",
            f"  Baseline     : {self.baseline_created_at[:19]}",
            f"  After        : {self.after_created_at[:19]}",
            f"  Drift        : {self.personality_drift:.4f}",
            f"  Rupture Δ    : {self.rupture_delta:+.1f}" if self.rupture_delta else "  Rupture Δ    : N/A",
            f"  Verdict      : {self.verdict}",
        ]
        return "\n".join(lines)

    def save(self, path: str) -> str:
        payload = {
            "raegis_version":    "0.1.0",
            "type":              "delta",
            "created_at":        self.created_at,
            "model":             self.model,
            "prompt":            self.prompt,
            "baseline_at":       self.baseline_created_at,
            "after_at":          self.after_created_at,
            "personality_drift": self.personality_drift,
            "rupture_delta":     self.rupture_delta,
            "verdict":           self.verdict,
            "df_delta":          _df_to_dict(self.df_delta),
        }
        with open(path, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2, default=str)
        print(f"[Raegis] DeltaReport saved to: {path}")
        return path

    def __repr__(self):
        return self.summary()
