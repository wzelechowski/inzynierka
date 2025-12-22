from fastapi import Depends, APIRouter

from dependencies.get_apriori_reccomendation_service import get_apriori_recommendation_service
from services.recommendations.apriori_recomendation_service import AprioriRecommendationService

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.get("")
async def get_recommendations(
        service: AprioriRecommendationService = Depends(get_apriori_recommendation_service)
):
    return await service.generate()