# -*- coding: utf-8 -*-
"""
raegis/comparator.py
---------------------
Comparator Before/After — validates if fine-tuning improved the model.

Workflow:
    1. Run auditor.audit() before fine-tune → save snapshot
    2. Fine-tune the model
    3. Run auditor.audit() again
    4. Comparator.compare(baseline, after) → DeltaReport with verdict
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from raegis.report import RaegisReport, DeltaReport


class Comparator:
    """
    Compares two RaegisReports (before/after fine-tuning).

    Example:
        from raegis import Auditor, Comparator

        auditor  = Auditor(model="ollama/llama3.2")
        baseline = auditor.audit(prompt="...", depth=5)
        baseline.save("baseline.json")

        # ... [fine-tune] ...

        after = auditor.audit(prompt="...", depth=5)
        delta = Comparator.compare(baseline, after)
        print(delta)
    """

    @staticmethod
    def compare(
        baseline: str | RaegisReport,
        after: str | RaegisReport,
    ) -> DeltaReport:
        """
        Compares two reports and returns a DeltaReport.

        Parameters accepted as JSON path (str) or RaegisReport directly.
        """
        if isinstance(baseline, str):
            baseline = RaegisReport.load(baseline)
        if isinstance(after, str):
            after = RaegisReport.load(after)

        df_b = baseline.df_analise.set_index("temperature")
        df_a = after.df_analise.set_index("temperature")

        # Use common temperatures
        common_temps = df_b.index.intersection(df_a.index)

        rows = []
        for temp in sorted(common_temps):
            b = df_b.loc[temp]
            a = df_a.loc[temp]

            delta_consistency = float(a["consistency_score"] - b["consistency_score"])
            delta_entropy     = float(a["entropy_bits"]      - b["entropy_bits"])
            delta_confidence  = float(a["confidence_score"]  - b["confidence_score"])

            rows.append({
                "temperature":        temp,
                "delta_consistency":  round(delta_consistency, 4),
                "delta_entropy":      round(delta_entropy,     4),
                "delta_confidence":   round(delta_confidence,  4),
                "risk_before":        b["hallucination_risk"],
                "risk_after":         a["hallucination_risk"],
            })

        df_delta = pd.DataFrame(rows)

        # Personality Drift: normalized L2 distance between confidence vectors
        conf_b = df_b.loc[common_temps, "confidence_score"].values.astype(float)
        conf_a = df_a.loc[common_temps, "confidence_score"].values.astype(float)

        if len(conf_b) > 0:
            diff  = conf_a - conf_b
            drift = float(np.linalg.norm(diff) / (np.linalg.norm(conf_b) + 1e-9))
            drift = round(min(drift, 1.0), 4)
        else:
            drift = 0.0

        # Rupture point delta
        rupture_b = getattr(baseline, "rupture_point", None)
        rupture_a = getattr(after,    "rupture_point", None)
        if rupture_b is not None and rupture_a is not None:
            rupture_delta = round(rupture_a - rupture_b, 1)
        else:
            rupture_delta = None

        return DeltaReport(
            model               = after.model,
            prompt              = after.prompt,
            baseline_created_at = baseline.created_at,
            after_created_at    = after.created_at,
            df_delta            = df_delta,
            personality_drift   = drift,
            rupture_delta       = rupture_delta,
        )
