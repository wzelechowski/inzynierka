from dataclasses import dataclass
from typing import List

from services.promotion_effect_detector import EffectType

@dataclass
class PromotionProposal:
    antecedents: List[str]
    consequents: List[str]
    effect_type: EffectType
    support: float
    confidence: float
    lift: float
    score: float
    reason: str