# -*- coding: utf-8 -*-
"""
raegis/core/doctor.py
----------------------
Doctor — The "Truth Anchor" using external LLMs (Gemini, etc.)
to audit the local auditor.
"""

import os
import google.generativeai as genai
from typing import Dict, Any, List
from dotenv import load_dotenv

class RaegisDoctor:
    """
    Acts as the final judge for critical responses.
    Uses a larger model (Gemini 1.5 Flash/Pro) to evaluate 
    if the local model's output is factual (Faithfulness).
    """

    def __init__(self, model_id: str = "gemini-1.5-flash"):
        load_dotenv()
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("[RaegisDoctor] GEMINI_API_KEY not found in environment.")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel(model_id)

    def diagnose_hallucination(self, question: str, response: str) -> Dict[str, Any]:
        """
        Final medical opinion on a response.
        Returns a score and a clinical reason for the diagnosis.
        """
        prompt = (
            f"Question: {question}\n\n"
            f"Response to Audit: {response}\n\n"
            f"Task: Evaluate if the response above contains any hallucinations, "
            f"factual errors, or logical contradictions. "
            f"Respond ONLY in JSON format like: "
            f'{{"is_hallucination": bool, "score": float(0-1), "clinical_reason": "..."}}'
        )
        
        try:
            res = self.model.generate_content(prompt)
            # Simple JSON extraction
            import json
            import re
            match = re.search(r'\{.*\}', res.text, re.DOTALL)
            if match:
                return json.loads(match.group())
            return {"error": "Invalid JSON response from Doctor", "raw": res.text}
        except Exception as e:
            return {"error": f"Doctor failed: {e}"}

    def cross_examine(self, question: str, responses: List[str]) -> Dict[str, Any]:
        """
        Compares multiple samples from the Auditor and finds the most stable truth.
        """
        # (This could be expanded to select the 'Best' response from N iterations)
        pass
