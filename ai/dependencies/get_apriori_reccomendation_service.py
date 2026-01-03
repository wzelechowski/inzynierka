from core.mongo import order_feature_collection
from core.rabbit import get_publisher
from rabbit.rabbit_publisher import RabbitPublisher
from repositories.feature_store import FeatureStoreRepository
from services.apriori.apriori_service import AprioriService
from services.apriori.rule_filter import RulesFilter
from services.apriori.rule_mapper import RulesMapper
from services.recommendations.apriori_recomendation_service import AprioriRecommendationService


def get_apriori_recommendation_service() -> AprioriRecommendationService:
    repository = FeatureStoreRepository(order_feature_collection)

    apriori_service = AprioriService()
    rules_mapper = RulesMapper()
    rules_filter = RulesFilter()
    publisher = get_publisher()

    return AprioriRecommendationService(
        feature_repository=repository,
        apriori_service=apriori_service,
        rules_mapper=rules_mapper,
        rules_filter=rules_filter,
        publisher=publisher
    )
