# -*- coding: utf-8 -*-
"""
raegis/auditor.py
-----------------
Auditor — Unified Raegis Interface.

Example:
    from raegis import Auditor

    auditor = Auditor(model="ollama/llama3.2")
    report  = auditor.audit(prompt="What is photosynthesis?", depth=5)
    report.save("snapshot.json")
    print(report)
"""

from __future__ import annotations

import os
import sys
import requests

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from raegis.report import RaegisReport

# Lazy imports in methods to avoid crashing on import


class Auditor:
    """
    Main entry point for Raegis.

    Parameters
    ----------
    model : str
        In the format "ollama/<name>" or just "<name>" for local Ollama.
        Ex: "ollama/llama3.2", "llama3.2"
    ollama_url : str
        Base URL of the Ollama server. Default: http://localhost:11434
    """

    def __init__(
        self,
        model: str = "ollama/llama3.2",
        ollama_url: str = "http://localhost:11434",
    ):
        # Accepts "ollama/llama3.2" or just "llama3.2"
        if "/" in model:
            _, self.model_name = model.split("/", 1)
        else:
            self.model_name = model

        self.ollama_url      = ollama_url.rstrip("/")
        self._generate_url   = f"{self.ollama_url}/api/generate"
        self.model           = model

    # ------------------------------------------------------------------
    # API pública
    # ------------------------------------------------------------------

    def audit(
        self,
        prompt: str,
        depth: int = 3,
        temp_range: tuple = (0.0, 1.5),
        use_guardian: bool = True,
        guardian_train_max_temp: float = 0.4,
        guardian_epochs: int = 50,
        on_sample: callable = None,
    ) -> RaegisReport:
        """
        Runs full diagnostic on the model.

        Parameters
        ----------
        prompt : str
            Prompt to be fired at all temperatures.
        depth : int
            Samples per temperature.
        temp_range : tuple
            (temp_min, temp_max) — interval to be tested.
        use_guardian : bool
            Activates the Guardian (Autoencoder or IsolationForest) if available.
        guardian_train_max_temp : float
            Temperatures <= this value are used as "normal" to train Guardian.
        guardian_epochs : int
            How many epochs to train the Keras model.
        on_sample : callable
            Callback fired at each collected sample.

        Returns
        -------
        RaegisReport
        """
        from raegis.core.collector import collect_samples, save_experiment
        from raegis.core.analyzer  import analyze_by_temperature
        from raegis.core.guardian  import Guardian
        from raegis.utils.helpers  import clean_dataframe

        temp_min, temp_max = temp_range
        temperatures = [
            round(temp_min + i * 0.1, 1)
            for i in range(int(round((temp_max - temp_min) / 0.1)) + 1)
        ]

        print(f"[Raegis] Auditing {self.model_name} with {len(temperatures)} temperatures x {depth} samples...")

        # 1. Collection
        df_results = collect_samples(
            prompt          = prompt,
            model           = self.model_name,
            temperatures    = temperatures,
            samples_per_temp= depth,
            ollama_url      = self._generate_url,
            on_sample       = on_sample,
        )

        # 2. Consistency / Entropy analysis
        df_clean    = clean_dataframe(df_results)
        df_analysis = analyze_by_temperature(df_clean)

        # 3. Guardian (anomaly)
        df_anomalies = None
        if use_guardian:
            df_normal = df_clean[df_clean["temperature"] <= guardian_train_max_temp]
            if len(df_normal) >= 4:
                try:
                    guardian = Guardian()
                    guardian.fit(df_normal, epochs=guardian_epochs, verbose=0)
                    df_anomalies = guardian.predict(df_clean)
                    print(f"[Raegis] Guardian ({guardian.backend}) detected {int(df_anomalies['is_anomaly'].sum())} anomalies.")
                except Exception as e:
                    print(f"[Raegis] Guardian failed (ignored): {e}")

        # 4. Save CSV
        os.makedirs("experiments", exist_ok=True)
        save_experiment(df_results)

        return RaegisReport(
            model          = self.model_name,
            prompt         = prompt,
            df_results     = df_results,
            df_analysis    = df_analysis,
            df_anomalies   = df_anomalies,
            metadata       = {
                "depth":      depth,
                "temp_range": temp_range,
                "ollama_url": self.ollama_url,
            },
        )

    # ------------------------------------------------------------------
    # Acesso direto ao Ollama (usado por RaegisAnchor)
    # ------------------------------------------------------------------

    def _call_ollama(self, prompt: str, temperature: float, timeout: int = 120) -> str:
        """Calls the Ollama REST API and returns the response."""
        payload = {
            "model":       self.model_name,
            "prompt":      prompt,
            "temperature": temperature,
            "stream":      False,
        }
        resp = requests.post(self._generate_url, json=payload, timeout=timeout)
        resp.raise_for_status()
        return resp.json().get("response", "").strip()

    # ------------------------------------------------------------------
    # Dunder
    # ------------------------------------------------------------------

    def __repr__(self):
        return f"Auditor(model={self.model_name!r}, url={self.ollama_url!r})"
