# -*- coding: utf-8 -*-
"""
core/analyzer.py
----------------
Raegis Identity Vectorizer + Bias Analyst.
"""

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter
import math
import re


def compute_consistency(responses: list) -> dict:
    if len(responses) < 2:
        return {"consistency_score": 1.0, "uncertainty_score": 0.0}

    vectorizer = TfidfVectorizer()
    try:
        tfidf_matrix = vectorizer.fit_transform(responses)
    except ValueError:
        return {"consistency_score": 0.0, "uncertainty_score": 0.0}

    cos_sim = cosine_similarity(tfidf_matrix)
    upper   = cos_sim[np.triu_indices(len(cos_sim), k=1)]

    return {
        "consistency_score" : float(round(np.mean(upper), 4)),
        "uncertainty_score" : float(round(np.std(upper),  4)),
    }


def _tokenize(text: str) -> list:
    return re.findall(r'\b[a-z]+\b', text.lower())


def compute_entropy(responses: list) -> float:
    all_words = []
    for r in responses:
        all_words.extend(_tokenize(r))

    if not all_words:
        return 0.0

    counts  = Counter(all_words)
    total   = sum(counts.values())
    probs   = [c / total for c in counts.values()]
    entropy = -sum(p * math.log2(p) for p in probs if p > 0)
    return round(entropy, 4)


def analyze_by_temperature(df: pd.DataFrame) -> pd.DataFrame:
    rows = []

    for temp, group in df.groupby("temperature"):
        responses = group["response"].tolist()
        responses = [r for r in responses if not r.startswith("[ERROR")]

        if not responses:
            continue

        cos_metrics  = compute_consistency(responses)
        entropy      = compute_entropy(responses)
        consistency  = cos_metrics["consistency_score"]
        uncertainty  = cos_metrics["uncertainty_score"]
        confidence   = round(max(0.0, consistency - uncertainty * 0.5), 4)

        if   consistency < 0.40: risk = "Critical"
        elif consistency < 0.60: risk = "High"
        elif consistency < 0.75: risk = "Moderate"
        else:                    risk = "Low"

        rows.append({
            "temperature"        : temp,
            "n_samples"          : len(responses),
            "consistency_score"  : consistency,
            "uncertainty_score"  : uncertainty,
            "entropy_bits"       : entropy,
            "confidence_score"   : confidence,
            "hallucination_risk" : risk,
        })

    return pd.DataFrame(rows)
