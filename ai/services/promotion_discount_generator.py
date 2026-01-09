from math import ceil

def generate_percent_discount(rule):
    confidence = rule.confidence
    lift = rule.lift
    support = rule.support

    if support < 0.02: return 5
    if confidence < 0.4: return 5
    if lift < 1.0: return 5

    discount = clamp(
        (lift - 1) * 20 + confidence * 10,
        5,
        30
    )

    return discount / 100.0


def generate_fixed_discount(rule):
    base = 2.0
    lift_component = (rule.lift - 1) * 4
    confidence_component = rule.confidence * 6
    discount = base + lift_component + confidence_component
    discount = ceil(discount)
    return clamp(discount, 3, 15)

def clamp(value, min_val, max_val):
    return max(min_val, min(value, max_val))

