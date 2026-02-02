from fastapi import Depends, APIRouter, Query

from dependencies.get_apriori_reccomendation_service import get_apriori_recommendation_service
from services.recommendations.apriori_recomendation_service import AprioriRecommendationService

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.get("")
async def get_recommendations(
        max_proposals: int = Query(20, ge=1),
        days_back: int = Query(30, ge=1),
        service: AprioriRecommendationService = Depends(get_apriori_recommendation_service)
):
    return await service.generate(max_proposals=max_proposals, days_back=days_back)