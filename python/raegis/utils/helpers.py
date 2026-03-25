# -*- coding: utf-8 -*-
"""
utils/helpers.py
----------------
Utility helpers for text cleaning and formatting for Raegis.
"""

import re
import pandas as pd


STOPWORDS_EN = {
    "a", "an", "the", "and", "or", "but", "if", "then", "else", "when",
    "at", "from", "by", "for", "with", "about", "against", "between",
    "into", "through", "during", "before", "after", "above", "below",
    "to", "of", "in", "on", "that", "this", "which", "is", "are", "was",
    "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
}


def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def clean_dataframe(df: pd.DataFrame, col: str = "response") -> pd.DataFrame:
    df = df.copy()
    df[col] = df[col].apply(clean_text)
    return df


def remove_stopwords(text: str, stopwords: set = STOPWORDS_EN) -> str:
    tokens = text.split()
    return " ".join(t for t in tokens if t not in stopwords)


def print_summary(analysis_df: pd.DataFrame):
    print("\n" + "=" * 60)
    print("  RAEGIS -- Model Diagnostic Report")
    print("=" * 60)

    best  = analysis_df.loc[analysis_df["confidence_score"].idxmax()]
    worst = analysis_df.loc[analysis_df["confidence_score"].idxmin()]

    print(f"\n  Best temperature  : {best['temperature']:.1f}"
          f"  (confidence: {best['confidence_score']:.4f})")
    print(f"  Worst temperature : {worst['temperature']:.1f}"
          f"  (confidence: {worst['confidence_score']:.4f})")

    sane = analysis_df[analysis_df["hallucination_risk"].str.contains("Low|Moderate")]
    if not sane.empty:
        break_point = sane["temperature"].max()
        print(f"\n  Rupture Point     : {break_point:.1f}")

    print("\n" + "-" * 60)
    print(analysis_df[[
        "temperature", "consistency_score",
        "entropy_bits", "confidence_score", "hallucination_risk"
    ]].to_string(index=False))
    print("=" * 60 + "\n")
