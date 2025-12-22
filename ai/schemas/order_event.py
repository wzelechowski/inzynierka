from datetime import datetime
from typing import List

from pydantic import BaseModel


class OrderEvent(BaseModel):
    order_id: str
    user_id: str
    created_at: datetime
    total_price: float
    product_ids: List[str]