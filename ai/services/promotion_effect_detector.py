from enum import Enum


class EffectType(str, Enum):
    PERCENT = "PERCENT"
    FIXED = "FIXED"
    FREE_PRODUCT = "FREE_PRODUCT"


def detect_effect_type(rule):
    confidence = rule.confidence
    lift = rule.lift
    support = rule.support
    antecedents_len = len(rule.antecedents)
    consequents_len = len(rule.consequents)

    if (
        confidence >= 0.95
        and lift >= 3.0
        and antecedents_len == 1
        and consequents_len == 1
    ):
        return EffectType.FREE_PRODUCT, (
            f"Confidence={confidence}, lift={lift} – bardzo silna relacja 1→1"
        )

    if lift >= 1.5 and confidence >= 0.7:
        return EffectType.PERCENT, (
            f"Lift={lift}, confidence={confidence} – silna korelacja"
        )

    if support >= 0.5:
        return EffectType.FIXED, (
            f"Support={support} – często kupowane razem"
        )

    return EffectType.PERCENT, "Domyślna promocja procentowa"
