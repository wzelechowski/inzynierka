from datetime import datetime, timedelta, timezone
from motor.motor_asyncio import AsyncIOMotorCollection
from models.order_feature import OrderFeature

class FeatureStoreRepository:

    def __init__(self, collection: AsyncIOMotorCollection):
        self._collection = collection

    async def find_all(self):
        cursor = self._collection.find({})
        return [doc async for doc in cursor]

    async def find_recent(self, days: int):
        if days <= 0:
            return await self.find_all()

        cutoff_date = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=days)

        cursor = self._collection.find({"created_at": {"$gte": cutoff_date}})
        return [doc async for doc in cursor]

    def save(self, features: OrderFeature) -> None:
        self._collection.insert_one(
            features.model_dump()
        )