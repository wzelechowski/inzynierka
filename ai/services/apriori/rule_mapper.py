import numpy as np
from models.association_rules import AssociationRule

class RulesMapper:
    def map_rules(self, df) -> list[AssociationRule]:
        rules = df[
            np.isfinite(df["confidence"]) &
            np.isfinite(df["lift"]) &
            (df["support"] >= 0.15)
        ]

        mapped: list[AssociationRule] = []
        seen = set()

        for r in rules.itertuples():
            if (
                r.confidence < 0.6
                or r.lift < 1.0
                or len(r.consequents) != 1
            ):
                continue

            key = tuple(sorted(set(r.antecedents) | set(r.consequents)))

            if key in seen:
                continue
            seen.add(key)

            score = float(r.lift) * float(r.support)

            mapped.append(
                AssociationRule(
                    antecedents=list(r.antecedents),
                    consequents=list(r.consequents),
                    support=float(r.support),
                    confidence=float(r.confidence),
                    lift=float(r.lift),
                    score=score,
                )
            )

        return sorted(mapped, key=lambda r: r.score, reverse=True)[:5]
