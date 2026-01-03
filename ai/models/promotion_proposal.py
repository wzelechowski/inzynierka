from dataclasses import dataclass
from typing import List

from pydantic import BaseModel

from services.promotion_effect_detector import EffectType

class PromotionProposal(BaseModel):
    antecedents: List[str]
    consequents: List[str]
    effect_type: EffectType
    support: float
    confidence: float
    lift: float
    score: float
    reason: str