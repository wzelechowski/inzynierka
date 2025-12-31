from models.promotion_proposal import PromotionProposal
from repositories.feature_store import FeatureStoreRepository
from services.promotion_effect_detector import detect_effect_type
from services.apriori.apriori_service import AprioriService
from services.apriori.rule_filter import RulesFilter
from services.apriori.rule_mapper import RulesMapper


class AprioriRecommendationService:
    def __init__(
            self,
            feature_repository: FeatureStoreRepository,
            apriori_service: AprioriService,
            rules_mapper: RulesMapper,
            rules_filter: RulesFilter
    ):
        self.feature_repository = feature_repository
        self.apriori_service = apriori_service
        self.rules_mapper = rules_mapper
        self.rules_filter = rules_filter

    async def generate(self):
        features = await self.feature_repository.find_all()

        if not features:
            return []

        transactions = [
            feature["product_ids"]
            for feature in features
            if "product_ids" in feature and feature["product_ids"]
        ]

        if not transactions:
            return []

        rules_df = self.apriori_service.run(transactions)

        filtered = self.rules_filter.filter_rules(rules_df)
        rules = self.rules_mapper.map_rules(filtered)

        proposals = []

        for rule in rules:
            effect_type, reason = detect_effect_type(rule)

            proposals.append(
                PromotionProposal(
                    antecedents=rule.antecedents,
                    consequents=rule.consequents,
                    effect_type=effect_type,
                    support=rule.support,
                    confidence=rule.confidence,
                    lift=rule.lift,
                    score=rule.score,
                    reason=reason
                )
            )

        return proposals

