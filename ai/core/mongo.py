from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings

client = AsyncIOMotorClient(settings.mongo_url)

db = client[settings.mongo_db]
order_feature_collection = db.order_features