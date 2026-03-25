# -*- coding: utf-8 -*-
"""
raegis/core/inspector.py
------------------------
WhiteboxInspector — Access to LLM internals.

Two modes:
  - "graybox"  : via Ollama /api/generate with logprobs (no extra download)
  - "whitebox" : via HuggingFace transformers (access to weights, attention, activations)

The big difference compared to blackbox audit():

  Blackbox: generates N responses per temperature and compares texts
            → cost: N calls * M temperatures

  Whitebox: 1 forward pass → computes entropy for ALL temperature values
            analytically (logits / T)
            → cost: 1 call (10-100x faster)
            → precision: exact (not estimated)
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Optional

import numpy as np
import pandas as pd


# ---------------------------------------------------------------------------
# Dataclasses de resultado
# ---------------------------------------------------------------------------

@dataclass
class TokenEntropyPoint:
    """Entropia de Shannon no nivel do token para uma temperatura."""
    temperature:    float
    entropy_bits:   float          # H(p) em bits
    max_prob:       float          # probabilidade do token mais provavel
    top_token:      str            # token mais provavel
    top5:           list           # [(token, prob), ...] top-5


@dataclass
class AttentionSnapshot:
    """Snapshot dos mapas de atenção para um prompt."""
    prompt:          str
    tokens:          list           # lista de tokens (strings)
    layers:          int            # numero de camadas
    heads_per_layer: int
    # shape: [layers, heads, seq_len, seq_len]
    attention_maps:  Optional[np.ndarray] = None


@dataclass
class WeightDeltaReport:
    """Result of weight comparison before/after fine-tuning."""
    layers_changed:       list        # [(layer_name, delta_norm), ...]
    total_delta_norm:     float       # aggregated L2 norm of all deltas
    max_delta_layer:      str         # layer with highest variation
    mean_delta_per_layer: float
    verdict:              str         # "Surgical", "Moderate", "Aggressive", "Catastrophic"


# ---------------------------------------------------------------------------
# Inspector principal
# ---------------------------------------------------------------------------

class WhiteboxInspector:
    """
    Acessa os internos do LLM para análise mecanística.

    Exemplo (graybox via Ollama):
        from raegis.core.inspector import WhiteboxInspector

        inspector = WhiteboxInspector(
            model_name = "llama3.2",
            mode       = "graybox",
            ollama_url = "http://localhost:11434",
        )
        df = inspector.token_entropy_curve(
            prompt="O que é aprendizado de maquina?",
            temperatures=[0.0, 0.1, 0.3, 0.5, 0.8, 1.0, 1.2, 1.5],
        )
        print(df)

    Exemplo (whitebox via HuggingFace):
        inspector = WhiteboxInspector(
            model_name = "meta-llama/Llama-3.2-1B",
            mode       = "whitebox",
        )
        df         = inspector.token_entropy_curve(...)   # 1 forward pass!
        snapshot   = inspector.attention_snapshot(...)
        delta      = inspector.weight_delta(path_before, path_after)
    """

    def __init__(
        self,
        model_name: str,
        mode: str = "graybox",          # "graybox" | "whitebox"
        ollama_url: str = "http://localhost:11434",
        device: str = "auto",           # "auto" | "cpu" | "cuda"
        load_in_8bit: bool = False,     # quantizacao 8-bit (requer bitsandbytes)
    ):
        self.model_name = model_name
        self.mode       = mode
        self.ollama_url = ollama_url.rstrip("/")
        self.device     = device
        self.load_in_8bit = load_in_8bit

        self._hf_model     = None
        self._hf_tokenizer = None

        if mode == "whitebox":
            self._load_hf_model()

    # ------------------------------------------------------------------
    # HuggingFace Loading
    # ------------------------------------------------------------------

    def _load_hf_model(self):
        """Loads the HuggingFace model with output_attentions and hidden_states."""
        try:
            from transformers import AutoModelForCausalLM, AutoTokenizer
            import torch
        except ImportError:
            raise ImportError(
                "[Inspector] whitebox mode requires: pip install transformers torch\n"
                "Or use mode='graybox' for analysis via Ollama without extra downloads."
            )

        import torch

        print(f"[Inspector] Loading {self.model_name} via HuggingFace...")
        print(f"[Inspector] (This might take a few minutes for the first download)")

        dtype = torch.float16 if torch.cuda.is_available() else torch.float32

        kwargs = {
            "output_attentions": True,
            "output_hidden_states": True,
            "torch_dtype": dtype,
        }

        if self.device == "auto":
            kwargs["device_map"] = "auto"

        if self.load_in_8bit:
            kwargs["load_in_8bit"] = True
            kwargs.pop("torch_dtype", None)

        self._hf_tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self._hf_model     = AutoModelForCausalLM.from_pretrained(
            self.model_name, **kwargs
        )
        self._hf_model.eval()
        print(f"[Inspector] Model loaded. Parameters: {self._count_params():,}")

    def _count_params(self) -> int:
        if self._hf_model is None:
            return 0
        return sum(p.numel() for p in self._hf_model.parameters())

    # ------------------------------------------------------------------
    # 1. Token Entropy Curve
    # ------------------------------------------------------------------

    def token_entropy_curve(
        self,
        prompt: str,
        temperatures: list = None,
    ) -> pd.DataFrame:
        """
        Computes Shannon entropy at token level for each temperature.

        Whitebox: single forward pass, calculates for ALL T analytically.
        Graybox:  1 Ollama call per temperature (uses API logprobs).

        Returns DataFrame with columns:
            temperature, entropy_bits, max_prob, top_token, backend
        """
        if temperatures is None:
            temperatures = [round(t * 0.1, 1) for t in range(0, 16)]

        if self.mode == "whitebox":
            return self._entropy_curve_whitebox(prompt, temperatures)
        else:
            return self._entropy_curve_graybox(prompt, temperatures)

    def _entropy_curve_whitebox(self, prompt: str, temperatures: list) -> pd.DataFrame:
        """
        Whitebox: 1 forward pass, logits reusados para todos os T.
        Eficiencia: O(1) em chamadas ao modelo, vs O(N) no blackbox.
        """
        import torch

        with torch.no_grad():
            inputs  = self._hf_tokenizer(prompt, return_tensors="pt")
            if self.device != "auto" and torch.cuda.is_available():
                inputs = {k: v.cuda() for k, v in inputs.items()}

            outputs = self._hf_model(**inputs)
            # Logits do ultimo token: shape [1, vocab_size]
            raw_logits = outputs.logits[0, -1, :].float()

        rows = []
        vocab = self._hf_tokenizer.convert_ids_to_tokens(
            range(min(50257, raw_logits.shape[0]))
        )

        for temp in temperatures:
            t = max(temp, 1e-8)  # evita divisao por zero
            scaled = raw_logits / t
            probs  = torch.softmax(scaled, dim=-1).numpy()

            # Entropia de Shannon em bits
            entropy = float(-np.sum(probs * np.log2(probs + 1e-12)))

            # Top tokens
            top5_idx = np.argsort(probs)[::-1][:5]
            top_token = vocab[top5_idx[0]] if top5_idx[0] < len(vocab) else "?"
            top5 = [
                (vocab[i] if i < len(vocab) else "?", round(float(probs[i]), 6))
                for i in top5_idx
            ]

            rows.append({
                "temperature"  : temp,
                "entropy_bits" : round(entropy, 4),
                "max_prob"     : round(float(probs[top5_idx[0]]), 6),
                "top_token"    : top_token,
                "backend"      : "whitebox_hf",
            })

        return pd.DataFrame(rows)

    def _entropy_curve_graybox(self, prompt: str, temperatures: list) -> pd.DataFrame:
        """
        Graybox: usa logprobs da API do Ollama.
        Requer Ollama >= 0.1.14 com suporte a logprobs.
        """
        import requests

        rows = []
        for temp in temperatures:
            try:
                payload = {
                    "model":  self.model_name,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": temp,
                        "logprobs":    True,
                        "top_logprobs": 5,
                    },
                }
                resp = requests.post(
                    f"{self.ollama_url}/api/generate",
                    json=payload, timeout=60,
                )
                resp.raise_for_status()
                data = resp.json()

                # Extrai logprobs se disponivel
                logprobs = data.get("logprobs", None)
                if logprobs is None:
                    # Ollama nao retornou logprobs — estima via resposta
                    rows.append(self._estimate_entropy_from_response(data, temp))
                    continue

                # Calcula entropia media sobre os tokens gerados
                entropies = []
                max_probs = []
                for token_lp in logprobs:
                    lp_values = list(token_lp.values())
                    probs = np.exp(lp_values)
                    probs = probs / probs.sum()
                    h = float(-np.sum(probs * np.log2(probs + 1e-12)))
                    entropies.append(h)
                    max_probs.append(float(max(probs)))

                rows.append({
                    "temperature"  : temp,
                    "entropy_bits" : round(float(np.mean(entropies)), 4),
                    "max_prob"     : round(float(np.mean(max_probs)), 6),
                    "top_token"    : "N/A",
                    "backend"      : "graybox_ollama",
                })

            except Exception as e:
                print(f"[Inspector] Error at temp={temp}: {e}")
                rows.append({
                    "temperature"  : temp,
                    "entropy_bits" : None,
                    "max_prob"     : None,
                    "top_token"    : "ERROR",
                    "backend"      : "graybox_ollama",
                })

        return pd.DataFrame(rows)

    @staticmethod
    def _estimate_entropy_from_response(data: dict, temp: float) -> dict:
        """Fallback: estimates entropy by response size/diversity."""
        response = data.get("response", "")
        tokens   = response.split()
        unique   = len(set(tokens))
        total    = len(tokens) if tokens else 1
        # Heuristic approximation (not exact)
        est_entropy = math.log2(max(unique, 1)) * (unique / total)
        return {
            "temperature"  : temp,
            "entropy_bits" : round(est_entropy, 4),
            "max_prob"     : None,
            "top_token"    : "estimated",
            "backend"      : "graybox_estimated",
        }

    # ------------------------------------------------------------------
    # 2. Attention Snapshot (whitebox only)
    # ------------------------------------------------------------------

    def attention_snapshot(self, prompt: str) -> AttentionSnapshot:
        """
        Captura os mapas de atenção de todas as camadas e heads.
        Retorna AttentionSnapshot com tensor [layers, heads, seq, seq].

        Whitebox only.
        """
        if self.mode != "whitebox":
            raise RuntimeError("[Inspector] attention_snapshot requer mode='whitebox'.")

        import torch

        with torch.no_grad():
            inputs = self._hf_tokenizer(prompt, return_tensors="pt")
            if self.device != "auto" and torch.cuda.is_available():
                inputs = {k: v.cuda() for k, v in inputs.items()}

            outputs = self._hf_model(**inputs, output_attentions=True)

        tokens = self._hf_tokenizer.convert_ids_to_tokens(
            inputs["input_ids"][0].tolist()
        )

        # outputs.attentions: tuple de [1, heads, seq, seq] por camada
        attn_np = np.stack([
            a[0].float().cpu().numpy()
            for a in outputs.attentions
        ])  # shape: [layers, heads, seq, seq]

        return AttentionSnapshot(
            prompt          = prompt,
            tokens          = tokens,
            layers          = attn_np.shape[0],
            heads_per_layer = attn_np.shape[1],
            attention_maps  = attn_np,
        )

    def attention_entropy_per_layer(self, prompt: str) -> pd.DataFrame:
        """
        Calcula a entropia dos mapas de atenção por camada.
        Alta entropia = atenção difusa (modelo "olhando para tudo").
        Baixa entropia = atenção focada (modelo "sabe o que quer").
        """
        snap = self.attention_snapshot(prompt)
        rows = []
        for layer_idx in range(snap.layers):
            layer_attn = snap.attention_maps[layer_idx]  # [heads, seq, seq]
            # Entropia media sobre todas as heads e posicoes
            entropies = []
            for head in layer_attn:
                for row_attn in head:
                    probs = row_attn / (row_attn.sum() + 1e-12)
                    h = float(-np.sum(probs * np.log2(probs + 1e-12)))
                    entropies.append(h)
            rows.append({
                "layer":           layer_idx,
                "attention_entropy": round(float(np.mean(entropies)), 4),
                "attention_std":    round(float(np.std(entropies)),  4),
            })

        return pd.DataFrame(rows)

    # ------------------------------------------------------------------
    # 3. Weight Delta (fine-tuning analysis)
    # ------------------------------------------------------------------

    @staticmethod
    def weight_delta(
        model_path_before: str,
        model_path_after: str,
        top_k: int = 20,
    ) -> WeightDeltaReport:
        """
        Compara os pesos de dois checkpoints do mesmo modelo.
        Ideal para validar fine-tuning: quais camadas mudaram e o quanto.

        Parâmetros:
            model_path_before : caminho local ou repo HuggingFace (antes do fine-tune)
            model_path_after  : caminho local ou repo HuggingFace (depois do fine-tune)
            top_k             : numero de camadas mais afetadas a reportar

        Retorna WeightDeltaReport com veredicto.
        """
        try:
            from transformers import AutoModelForCausalLM
            import torch
        except ImportError:
            raise ImportError("[Inspector] weight_delta requer: pip install transformers torch")

        print(f"[Inspector] Carregando checkpoint ANTES: {model_path_before}")
        model_b = AutoModelForCausalLM.from_pretrained(
            model_path_before, torch_dtype=torch.float32
        )
        print(f"[Inspector] Carregando checkpoint DEPOIS: {model_path_after}")
        model_a = AutoModelForCausalLM.from_pretrained(
            model_path_after, torch_dtype=torch.float32
        )

        state_b = dict(model_b.named_parameters())
        state_a = dict(model_a.named_parameters())

        layers_changed = []
        total_norm     = 0.0

        for name in state_b:
            if name not in state_a:
                continue
            delta = (state_a[name] - state_b[name]).float()
            norm  = float(delta.norm().item())
            total_norm += norm ** 2
            layers_changed.append((name, round(norm, 6)))

        layers_changed.sort(key=lambda x: x[1], reverse=True)
        total_norm = round(math.sqrt(total_norm), 4)

        max_layer = layers_changed[0][0] if layers_changed else "N/A"
        mean_delta = round(
            float(np.mean([n for _, n in layers_changed])), 6
        ) if layers_changed else 0.0

        # Verdict based on total norm
        if total_norm < 1.0:
            verdict = "Surgical"        # precise and focused fine-tune
        elif total_norm < 10.0:
            verdict = "Moderate"        # significant but controlled changes
        elif total_norm < 50.0:
            verdict = "Aggressive"       # major changes — risk of catastrophic forgetting
        else:
            verdict = "Catastrophic"    # fine-tune destroyed the base model

        # Libera memoria
        del model_b, model_a

        return WeightDeltaReport(
            layers_changed       = layers_changed[:top_k],
            total_delta_norm     = total_norm,
            max_delta_layer      = max_layer,
            mean_delta_per_layer = mean_delta,
            verdict              = verdict,
        )

    # ------------------------------------------------------------------
    # 4. Hidden State Probing (ativações intermediárias)
    # ------------------------------------------------------------------

    def hidden_state_trajectory(self, prompt: str) -> pd.DataFrame:
        """
        Captura a norma L2 das ativações em cada camada.
        Reveals "onde o modelo constrói o significado" ao longo das camadas.

        Whitebox only.
        """
        if self.mode != "whitebox":
            raise RuntimeError("[Inspector] hidden_state_trajectory requer mode='whitebox'.")

        import torch

        with torch.no_grad():
            inputs  = self._hf_tokenizer(prompt, return_tensors="pt")
            if self.device != "auto" and torch.cuda.is_available():
                inputs = {k: v.cuda() for k, v in inputs.items()}
            outputs = self._hf_model(**inputs, output_hidden_states=True)

        rows = []
        # outputs.hidden_states: tuple de [1, seq, hidden_dim] por camada
        for layer_idx, hs in enumerate(outputs.hidden_states):
            norms = hs[0].float().cpu().numpy()  # [seq, hidden_dim]
            # Norma da representação do ultimo token (mais informativo)
            last_token_norm = float(np.linalg.norm(norms[-1]))
            mean_seq_norm   = float(np.mean([np.linalg.norm(r) for r in norms]))
            rows.append({
                "layer":            layer_idx,
                "last_token_norm":  round(last_token_norm, 4),
                "mean_seq_norm":    round(mean_seq_norm,   4),
            })

        return pd.DataFrame(rows)

    # ------------------------------------------------------------------
    # Dunder
    # ------------------------------------------------------------------

    def __repr__(self):
        return (
            f"WhiteboxInspector("
            f"model={self.model_name!r}, "
            f"mode={self.mode!r}, "
            f"params={self._count_params():,})"
        )
