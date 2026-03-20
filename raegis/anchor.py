# -*- coding: utf-8 -*-
"""
raegis/anchor.py
----------------
RaegisAnchor — Anchor Test for RAG validation.

Measures the semantic fidelity of model responses to the
provided context, calculating:

    Fidelity(temp) = cos(V_response, V_context)

If fidelity drops as temperature rises, the model is
prioritizing creativity over document facts — hallucinating.
"""

from __future__ import annotations

import sys
import os

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from raegis.utils.embeddings import embed, cosine_sim, embedding_backend_name
from raegis.report import AnchorReport


class RaegisAnchor:
    """
    Executes the Anchor Test: measures response fidelity to the RAG context.

    Example:
        from raegis import Auditor, RaegisAnchor

        auditor = Auditor(model="ollama/llama3.2")
        anchor  = RaegisAnchor(auditor)
        result  = anchor.test(
            prompt  = "What is photosynthesis?",
            context = "Photosynthesis is the process by which plants...",
        )
        print(result)
    """

    def __init__(self, auditor):
        self.auditor = auditor

    def test(
        self,
        prompt: str,
        context: str,
        temperatures: list = None,
        samples_per_temp: int = 1,
        timeout: int = 120,
    ) -> AnchorReport:
        """
        Para cada temperatura em `temperatures`, coleta uma resposta do modelo
        e calcula a cosine similarity com o `context`.

        Retorna AnchorReport com a curva de fidelidade por temperatura.
        """
        if temperatures is None:
            temperatures = [round(t * 0.1, 1) for t in range(0, 16)]

        backend      = embedding_backend_name()

        # Pré-computa embedding do contexto (uma vez só)
        ctx_vec = embed([context])[0]

        fidelity_curve = []

        for temp in temperatures:
            fidelities_at_temp = []

            for _ in range(samples_per_temp):
                try:
                    response = self.auditor._call_ollama(
                        prompt=self._build_rag_prompt(prompt, context),
                        temperature=temp,
                        timeout=timeout,
                    )
                    resp_vec = embed([response])[0]
                    fid = cosine_sim(resp_vec, ctx_vec)
                except Exception as e:
                    print(f"[RaegisAnchor] Error temp={temp}: {e}")
                    fid = 0.0

                fidelities_at_temp.append(fid)

            avg_fid = float(np.mean(fidelities_at_temp))
            fidelity_curve.append((temp, round(avg_fid, 4)))

        fidelity_values = [f for _, f in fidelity_curve]
        anchor_score    = float(np.mean(fidelity_values))

        # Temperatura onde fidelidade cai abaixo de 0.7 (limiar RAG)
        drift_temp = None
        for temp, fid in fidelity_curve:
            if fid < 0.7:
                drift_temp = temp
                break

        return AnchorReport(
            model             = self.auditor.model_name,
            prompt            = prompt,
            context           = context,
            fidelity_curve    = fidelity_curve,
            anchor_score      = anchor_score,
            drift_temperature = drift_temp,
            backend           = backend,
        )

    @staticmethod
    def _build_rag_prompt(prompt: str, context: str) -> str:
        """Injects context into the prompt in RAG pattern."""
        return (
            f"Context:\n{context}\n\n"
            f"Based only on the context above, answer:\n{prompt}"
        )
