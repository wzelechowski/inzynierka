from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class OrderFeature(BaseModel):
    hour: int
    day_of_week: int
    is_weekend: bool
    is_holiday: bool
    total_price: float
    product_ids: List[str]
    cart_size: int
    created_at: Optional[datetime] = None