from models.association_rules import AssociationRule

class RulesMapper:
    def map_rules(self, df) -> list[AssociationRule]:
        rules = df.dropna(subset=['confidence', 'lift'])  # usuwa NaN w confidence/lift
        filtered = [
            r for r in rules.itertuples()
            if r.confidence >= 0.5 and r.lift >= 1.2 and len(r.consequents) == 1
        ]
        return filtered