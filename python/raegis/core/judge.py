# -*- coding: utf-8 -*-
import re
import asyncio
import aiohttp
from typing import List, Dict, Any

class RaegisJudge:
    """
    LLM-as-a-judge metrics for RAG evaluation. 
    Focuses on Faithfulness (factual fidelity) and Contextual Precision.
    """
    def __init__(self, auditor):
        self.auditor = auditor
        self.url = auditor._generate_url
        self.model = auditor.model_name

    async def _async_call_ollama(self, prompt: str, temperature: float = 0.0) -> str:
        """Asynchronous call to Ollama REST API."""
        payload = {
            "model": self.model,
            "prompt": prompt,
            "options": {"temperature": temperature},
            "stream": False,
        }
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(self.url, json=payload, timeout=60) as resp:
                    if resp.status != 200:
                        return ""
                    data = await resp.json()
                    return data.get("response", "").strip()
        except Exception:
            return ""

    async def faithfulness(self, question: str, context: str, answer: str) -> Dict[str, Any]:
        """
        Steps:
        1. Extract factual claims from the answer.
        2. Verify if each claim is supported by the context.
        """
        # Step 1: Extraction
        extract_prompt = (
            f"Question: {question}\n"
            f"Answer: {answer}\n\n"
            f"Context: {context}\n\n"
            f"Task: Extract any specific factual statements made in the answer above. "
            f"Return them as a bulleted list. Answer ONLY the bullets."
        )
        claims_text = await self._async_call_ollama(extract_prompt)
        # Simple parser for bullets
        claims = [c.strip("- *•").strip() for c in claims_text.split("\n") if len(c.strip()) > 10]
        
        if not claims:
            return {"score": 1.0, "total": 0, "supported": 0}

        # Step 2: Verification
        async def verify_claim(claim):
            verify_prompt = (
                f"Context: {context}\n"
                f"Is the claim below supported by the context? Answer ONLY 'YES' or 'NO'.\n"
                f"Claim: {claim}"
            )
            res = await self._async_call_ollama(verify_prompt)
            return "YES" in res.upper()

        tasks = [verify_claim(c) for c in claims]
        results = await asyncio.gather(*tasks)
        
        supported = sum(1 for r in results if r)
        score = supported / len(claims)
        
        return {
            "score": round(score, 4),
            "total_claims": len(claims),
            "supported_claims": supported,
            "claims": claims
        }

    async def contextual_precision(self, question: str, contexts: List[str]) -> float:
        """
        Evaluates if relevant chunks are ranked higher in the list.
        Uses Average Precision math.
        """
        if not contexts:
            return 0.0

        async def check_relevance(ctx):
            prompt = (
                f"Question: {question}\n"
                f"Chunk: {ctx}\n\n"
                f"Is this chunk relevant to answer the question? Answer ONLY '1' for yes or '0' for no."
            )
            res = await self._async_call_ollama(prompt)
            return 1 if "1" in res else 0

        relevancy = await asyncio.gather(*[check_relevance(c) for c in contexts])
        
        # Mean Average Precision logic
        precisions = []
        relevant_found = 0
        for i, rel in enumerate(relevancy):
            if rel:
                relevant_found += 1
                precisions.append(relevant_found / (i + 1))
        
        if not precisions:
            return 0.0
            
        return round(sum(precisions) / len(precisions), 4)
