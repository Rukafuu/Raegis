# -*- coding: utf-8 -*-
"""
raegis/core/collector.py
-------------------------
Raegis Stress Chamber.
Fires the same prompt across multiple temperatures and collects responses
into a Pandas DataFrame. Uses the Ollama REST API directly.
"""

import requests
import pandas as pd
from datetime import datetime

DEFAULT_MODEL   = "llama3.2"
DEFAULT_TEMPS   = [round(t * 0.1, 1) for t in range(0, 16)]  # 0.0 to 1.5
DEFAULT_SAMPLES = 3
OLLAMA_URL      = "http://localhost:11434/api/generate"

def _call_ollama(prompt: str, model: str, temperature: float, 
                 timeout: int = 120, ollama_url: str = OLLAMA_URL) -> str:
    """Calls the Ollama REST API and returns the response as string."""
    payload = {
        "model":       model,
        "prompt":      prompt,
        "temperature": temperature,
        "stream":      False,
    }
    resp = requests.post(ollama_url, json=payload, timeout=timeout)
    resp.raise_for_status()
    return resp.json().get("response", "").strip()

def collect_samples(
    prompt: str,
    model: str = DEFAULT_MODEL,
    temperatures: list = DEFAULT_TEMPS,
    samples_per_temp: int = DEFAULT_SAMPLES,
    on_sample: callable = None,
    ollama_url: str = OLLAMA_URL,
) -> pd.DataFrame:
    """
    Runs the same prompt at each temperature and returns a DataFrame with:
    [temperature, sample_id, prompt, response, timestamp]

    on_sample (optional): called after each collected response.
      Signature: on_sample(record: dict, current: int, total: int)
    """
    records = []
    total   = len(temperatures) * samples_per_temp
    current = 0

    print("Raegis -- Stress Chamber initialized")
    print(f"  Model    : {model}")
    print(f"  Temps    : {temperatures[0]} -> {temperatures[-1]}")

    for temp in temperatures:
        for i in range(samples_per_temp):
            current += 1
            try:
                resp = _call_ollama(prompt, model, temp, ollama_url=ollama_url)
                record = {
                    "temperature" : temp,
                    "sample_id"   : i + 1,
                    "prompt"      : prompt,
                    "response"    : resp,
                    "timestamp"   : datetime.now().isoformat(),
                }
                records.append(record)
                if on_sample:
                    on_sample(record, current, total)

            except Exception as e:
                print(f"[Collector] Error temp={temp} sample={i+1}: {e}")

    return pd.DataFrame(records)

def save_experiment(df: pd.DataFrame, path: str = "experiments/results.csv"):
    """Saves the results DataFrame to a CSV file."""
    import os
    os.makedirs(os.path.dirname(path), exist_ok=True)
    df.to_csv(path, index=False, encoding="utf-8")
    print(f"[Collector] Data exported to: {path}")
