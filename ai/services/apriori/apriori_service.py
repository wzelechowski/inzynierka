import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules

class AprioriService:

    def run(
        self,
        transactions: list[list[str]],
            min_support: float = 0.01,
            min_confidence: float = 0.3
        ):
            df = pd.DataFrame(transactions)
            one_hot = pd.get_dummies(df.stack()).groupby(level=0).sum().astype(bool)

            frequent_item_sets = apriori(
                one_hot,
                min_support=min_support,
                use_colnames=True
            )

            rules = association_rules(
                frequent_item_sets,
                metric="confidence",
                min_threshold=min_confidence
            )

            return rules