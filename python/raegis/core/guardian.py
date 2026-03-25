# -*- coding: utf-8 -*-
"""
raegis/core/guardian.py
-----------------------
Guardian — Anomaly Detection with automatic fallback.

  TensorFlow available → Neural Autoencoder (RaegisAutoencoder)
  TensorFlow missing   → IsolationForest (scikit-learn)

The Guardian is transparent: the public interface is identical
regardless of the active backend.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import normalize

# Detecta backend disponivel
try:
    import tensorflow as tf  # noqa: F401
    _TF_AVAILABLE = True
except ImportError:
    _TF_AVAILABLE = False


class Guardian:
    """
    Detects anomalies (hallucinations) in LLM responses.

    Usage:
        guardian = Guardian()
        guardian.fit(df_normal)           # trains with "normal" responses
        result   = guardian.predict(df)   # is_anomaly + anomaly_score columns
        print(guardian.backend)           # "keras" or "sklearn"
    """

    def __init__(
        self,
        encoding_dim: int = 32,
        threshold_percentile: float = 95.0,
    ):
        self.encoding_dim         = encoding_dim
        self.threshold_percentile = threshold_percentile
        self.vectorizer           = TfidfVectorizer(max_features=500)
        self.threshold: float     = 0.0
        self._model               = None
        self.backend              = "keras" if _TF_AVAILABLE else "sklearn"

    # ------------------------------------------------------------------
    # Treino
    # ------------------------------------------------------------------

    def fit(self, df_normal: pd.DataFrame, epochs: int = 50,
            batch_size: int = 8, verbose: int = 0):
        """Trains the Guardian with responses considered normal."""
        texts = df_normal["response"].tolist()
        X = self.vectorizer.fit_transform(texts).toarray().astype(np.float32)
        X = normalize(X)

        if _TF_AVAILABLE:
            self._fit_keras(X, epochs=epochs, batch_size=batch_size, verbose=verbose)
        else:
            self._fit_sklearn(X)

    def _fit_keras(self, X: np.ndarray, epochs: int, batch_size: int, verbose: int):
        from tensorflow.keras import layers, Model, callbacks

        inp_dim = X.shape[1]
        inp     = layers.Input(shape=(inp_dim,))
        enc     = layers.Dense(128, activation="relu")(inp)
        enc     = layers.Dropout(0.2)(enc)
        enc     = layers.Dense(self.encoding_dim, activation="relu")(enc)
        dec     = layers.Dense(128, activation="relu")(enc)
        dec     = layers.Dense(inp_dim, activation="sigmoid")(dec)

        model = Model(inputs=inp, outputs=dec, name="raegis_guardian")
        model.compile(optimizer="adam", loss="mse")

        es = callbacks.EarlyStopping(monitor="loss", patience=5, restore_best_weights=True)
        model.fit(X, X, epochs=epochs, batch_size=batch_size,
                  callbacks=[es], verbose=verbose)

        reconstructed  = model.predict(X, verbose=0)
        train_mse      = np.mean(np.power(X - reconstructed, 2), axis=1)
        self.threshold = float(np.percentile(train_mse, self.threshold_percentile))
        self._model    = model

    def _fit_sklearn(self, X: np.ndarray):
        from sklearn.ensemble import IsolationForest
        clf = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
        clf.fit(X)
        self._model = clf
        # IsolationForest usa scores internos; threshold nao se aplica da mesma forma

    # ------------------------------------------------------------------
    # Inferência
    # ------------------------------------------------------------------

    def predict(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Adiciona colunas ao DataFrame:
            is_anomaly   : bool
            anomaly_score: float (MSE para Keras, -score para sklearn)
        """
        if self._model is None:
            raise RuntimeError("[Guardian] Chame .fit() antes de .predict().")

        texts = df["response"].tolist()
        X = self.vectorizer.transform(texts).toarray().astype(np.float32)
        X = normalize(X)

        result = df.copy()

        if _TF_AVAILABLE and hasattr(self._model, "predict") and not hasattr(self._model, "decision_function"):
            # Keras autoencoder
            reconstructed = self._model.predict(X, verbose=0)
            mse = np.mean(np.power(X - reconstructed, 2), axis=1)
            result["anomaly_score"] = np.round(mse, 6)
            result["is_anomaly"]    = mse > self.threshold
        else:
            # IsolationForest: -1 = anomalia, 1 = normal
            preds  = self._model.predict(X)
            scores = self._model.score_samples(X)
            result["anomaly_score"] = np.round(-scores, 6)
            result["is_anomaly"]    = preds == -1

        result["anomaly_label"] = result["is_anomaly"].map(
            {True: "Hallucination", False: "Normal"}
        )
        return result

    # ------------------------------------------------------------------
    # Persistence
    # ------------------------------------------------------------------

    def save(self, path: str = "experiments/raegis_guardian.keras"):
        if self._model is not None:
            if hasattr(self._model, "save") or hasattr(self._model, "save_weights"):
                os.makedirs(os.path.dirname(path), exist_ok=True)
                if self.backend == "keras": # Changed from "tensorflow" to "keras" to match self.backend
                    self._model.save(path)
                else:
                    import joblib
                    joblib.dump({"model": self._model, "vectorizer": self.vectorizer, "threshold": self.threshold}, path) # Added vectorizer and threshold for sklearn
                print(f"[Guardian] Model saved at: {path}")

    def load(self, path: str = "experiments/raegis_guardian.keras"):
        if not _TF_AVAILABLE:
            raise RuntimeError("[Guardian] TensorFlow not installed.")
        import tensorflow as tf
        self._model = tf.keras.models.load_model(path)
        self.backend = "keras"

    def __repr__(self):
        return f"Guardian(backend={self.backend!r}, threshold={self.threshold:.6f})"
