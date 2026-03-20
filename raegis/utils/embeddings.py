# -*- coding: utf-8 -*-
"""
raegis/utils/embeddings.py
--------------------------
Cosine similarity com fallback automatico:
  - sentence-transformers (semantico, se instalado)
  - TF-IDF sklearn       (lexical, sempre disponivel)
"""

import numpy as np


def _get_backend():
    try:
        from sentence_transformers import SentenceTransformer  # noqa: F401
        return "sentence_transformers"
    except ImportError:
        return "tfidf"


def embed(texts: list) -> np.ndarray:
    """
    Vetoriza uma lista de textos.
    Usa SentenceTransformers (semantico) se disponivel,
    caso contrario usa TF-IDF (lexical).
    """
    backend = _get_backend()

    if backend == "sentence_transformers":
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer("all-MiniLM-L6-v2")
        return model.encode(texts, show_progress_bar=False, normalize_embeddings=True)

    # Fallback: TF-IDF
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.preprocessing import normalize

    if len(texts) == 1:
        # TF-IDF precisa de 2+ docs para funcionar corretamente
        # duplicamos para vetorizar, depois retornamos so o primeiro
        vec = TfidfVectorizer()
        matrix = vec.fit_transform(texts * 2).toarray().astype(np.float32)
        return normalize(matrix[:1])

    vec = TfidfVectorizer()
    matrix = vec.fit_transform(texts).toarray().astype(np.float32)
    return normalize(matrix)


def cosine_sim(a: np.ndarray, b: np.ndarray) -> float:
    """Cosine similarity entre dois vetores 1D."""
    a = a.flatten()
    b = b.flatten()
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))


def cosine_sim_matrix(embeddings: np.ndarray) -> np.ndarray:
    """
    Retorna a matriz de cosine similarity NxN para um conjunto de embeddings.
    Cada linha i, coluna j contem sim(i, j).
    """
    from sklearn.metrics.pairwise import cosine_similarity as sk_cos
    return sk_cos(embeddings)


def embedding_backend_name() -> str:
    """Retorna o nome do backend de embeddings em uso."""
    return _get_backend()
