from pydantic import BaseModel, Field
from datetime import datetime
from typing import List

class OrderEvent(BaseModel):
    order_id: str = Field(alias="orderId")
    user_id: str = Field(alias="userId")
    created_at: datetime = Field(alias="createdAt")
    total_price: float = Field(alias="totalPrice")
    order_item_ids: List[str] = Field(alias="orderItemsIds")

    model_config = {
        "populate_by_name": True
    }
