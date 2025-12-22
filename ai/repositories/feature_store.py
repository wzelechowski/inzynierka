from motor.motor_asyncio import AsyncIOMotorCollection

from models.order_feature import OrderFeature


class FeatureStoreRepository:

    def __init__(self, collection: AsyncIOMotorCollection):
        self._collection = collection

    async def find_all(self):
        cursor = self._collection.find({})
        return [doc async for doc in cursor]

    async def save(self, features: OrderFeature) -> None:
        await self._collection.insert_one(
            features.model_dump()
        )