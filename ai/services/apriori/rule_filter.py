class RulesFilter:
    def filter_rules(self, rules_df):
        filtered_df = rules_df[
            (rules_df["confidence"] >= 0.5) &
            (rules_df["lift"] >= 1.0) &
            (rules_df["consequents"].apply(lambda x: len(x) == 1))
        ]
        return filtered_df
