# -*- coding: utf-8 -*-
"""
raegis/drift/simulation.py
--------------------------
Simulates data and concept drift for a fraud detection model.
"""

import pandas as pd
import numpy as np
from sklearn.datasets import make_classification
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
from typing import Tuple, List

class FraudSimulator:
    """
    Simulates 12 weeks of transaction data with increasing drift.
    
    Port of the logic described in the USER prompt.
    """

    def __init__(self, n_features: int = 10, fraud_rate: float = 0.0017):
        # 0.17% fraud rate as described (Kaggle dataset ratio)
        self.n_features = n_features
        self.fraud_rate = fraud_rate
        self.features = [f"V{i}" for i in range(1, n_features + 1)]
        self.model = None

    def generate_baseline(self, n_rows: int = 50000) -> Tuple[pd.DataFrame, XGBClassifier]:
        """Creates the training set (reference) and trains an XGBoost model."""
        X, y = make_classification(
            n_samples=n_rows, 
            n_features=self.n_features, 
            n_informative=int(self.n_features * 0.8),
            weights=[1 - self.fraud_rate, self.fraud_rate], 
            random_state=42
        )
        
        df = pd.DataFrame(X, columns=self.features)
        df["target"] = y
        
        # SMOTE to balance during training
        smote = SMOTE(sampling_strategy=0.1, random_state=42)
        X_res, y_res = smote.fit_resample(X, y)
        
        model = XGBClassifier(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
        model.fit(X_res, y_res)
        self.model = model
        
        # Add baseline prediction
        df["prediction"] = model.predict(X)
        return df, model

    def generate_week(self, week: int, n_rows: int = 5000) -> pd.DataFrame:
        """
        Generates production data for a specific week with injected drift.
        
        Drift levels (PSI-based):
        - 1-3:  Subtle drift (0.05 - 0.10)
        - 4-7:  Detectable drift (0.10 - 0.20)
        - 8-12: Critical drift (> 0.20) + Concept Drift (Y changes for same X)
        """
        if self.model is None:
            raise ValueError("Generate baseline first.")

        # Baseline generation parameters
        X, y = make_classification(
            n_samples=n_rows, 
            n_features=self.n_features, 
            n_informative=int(self.n_features * 0.8),
            weights=[1 - self.fraud_rate, self.fraud_rate], 
            random_state=42 + week
        )
        
        # 1. Feature Drift (Data Drift)
        # Shift the mean of features over time.
        drift_factor = 0
        if week >= 4:
            drift_factor = (week - 3) * 0.15 # Incremental shift
        
        X = X + drift_factor
        
        # 2. Concept Drift (P(Y|X) changes)
        # Invert some fraud cases or create new fraud patterns after week 8.
        if week >= 8:
            # Randomly flip 30% of targets to simulate goalpost shifting
            flip_indices = np.random.choice(n_rows, int(n_rows * 0.05), replace=False)
            y[flip_indices] = 1 - y[flip_indices]

        df = pd.DataFrame(X, columns=self.features)
        df["target"] = y
        
        # Current predictions with baseline model
        df["prediction"] = self.model.predict(X)
        
        return df
