# -*- coding: utf-8 -*-
"""
raegis/__init__.py
------------------
Raegis Package - LLM Diagnostics Toolkit for RAG and Fine-tuning.

Usage:
    from raegis import Auditor, RaegisAnchor, Comparator
"""

from .auditor            import Auditor
from .anchor             import RaegisAnchor
from .comparator         import Comparator
from .report             import RaegisReport, AnchorReport, DeltaReport
from .core.inspector     import WhiteboxInspector
from .core.judge         import RaegisJudge

__version__ = "0.1.2"

__all__ = [
    "Auditor",
    "RaegisAnchor",
    "Comparator",
    "RaegisReport",
    "AnchorReport",
    "DeltaReport",
    "WhiteboxInspector",
    "RaegisJudge",
]
