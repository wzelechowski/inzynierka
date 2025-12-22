from dataclasses import dataclass
from typing import List

@dataclass
class AssociationRule:
    antecedents: List[str]
    consequents: List[str]
    support: float
    confidence: float
    lift: float