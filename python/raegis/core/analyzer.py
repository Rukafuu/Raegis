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

    # Vectorize at sentence level to capture semantic structure
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
    try:
        tfidf_matrix = vectorizer.fit_transform(responses)
    except ValueError:
        return {"consistency_score": 0.0, "uncertainty_score": 0.0}

    cos_sim = cosine_similarity(tfidf_matrix)
    upper   = cos_sim[np.triu_indices(len(cos_sim), k=1)]

    return {
        "consistency_score" : float(round(np.mean(upper), 4)),
        "uncertainty_score" : float(round(np.std(upper),  4)),
        "similarity_matrix" : cos_sim
    }


def compute_semantic_entropy(responses: list, sim_matrix: np.ndarray, threshold: float = 0.85) -> float:
    """
    Groups responses into semantic clusters based on similarity threshold.
    Calculates entropy over the cluster distribution (Semantic Entropy).
    """
    if not responses:
        return 0.0
    
    n = len(responses)
    if n == 1:
        return 0.0

    # Simple Greedy Clustering
    clusters     = []
    assigned_to  = [-1] * n
    cluster_id   = 0

    for i in range(n):
        if assigned_to[i] == -1:
            assigned_to[i] = cluster_id
            for j in range(i + 1, n):
                if sim_matrix[i, j] >= threshold:
                    assigned_to[j] = cluster_id
            cluster_id += 1
    
    # Probabilities of clusters
    counts = Counter(assigned_to)
    probs  = [count / n for count in counts.values()]
    
    # Shannon Entropy
    entropy = -sum(p * math.log2(p) for p in probs if p > 0)
    return round(entropy, 4)


def analyze_by_temperature(df: pd.DataFrame) -> pd.DataFrame:
    rows = []
    
    # Store the baseline response (Temperature 0.0) for Delta calculation
    baseline_group = df[df["temperature"] == 0.0]
    baseline_resp  = baseline_group["response"].iloc[0] if not baseline_group.empty else None

    for temp, group in df.groupby("temperature"):
        responses = group["response"].tolist()
        responses = [r for r in responses if not r.startswith("[ERROR")]

        if not responses:
            continue

        metrics      = compute_consistency(responses)
        consistency  = metrics["consistency_score"]
        uncertainty  = metrics["uncertainty_score"]
        sim_matrix   = metrics["similarity_matrix"]
        
        # NEW: Semantic Entropy (Clustering)
        # Instead of word-level, we use semantic groups
        entropy_sem  = compute_semantic_entropy(responses, sim_matrix)
        
        # Calculate Stability Delta (Deviation from T=0 baseline)
        stability_delta = 0.0
        if baseline_resp and responses:
            # Vectorize baseline vs current group
            vec = TfidfVectorizer(ngram_range=(1,2)).fit_transform([baseline_resp] + responses)
            delta_sim = cosine_similarity(vec[0:1], vec[1:])
            stability_delta = round(1.0 - np.mean(delta_sim), 4)

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
            "entropy_bits"       : entropy_sem, # Now Semantic Entropy!
            "stability_delta"    : stability_delta, # Deviation from Baseline
            "confidence_score"   : confidence,
            "hallucination_risk" : risk,
        })

    return pd.DataFrame(rows)
