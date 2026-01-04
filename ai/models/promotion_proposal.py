from typing import List

from pydantic import BaseModel, Field, ConfigDict

from services.promotion_effect_detector import EffectType

class PromotionProposal(BaseModel):
    antecedents: List[str]
    consequents: List[str]
    effect_type: EffectType = Field(alias="effectType")
    support: float
    confidence: float
    lift: float
    score: float
    reason: str
    discount: float

    model_config = ConfigDict(
        populate_by_name=True
    )