from models.order_feature import OrderFeature
from schemas.order_event import OrderEvent


class OrderFeatureExtractor:
    def extract(self, event: OrderEvent) -> OrderFeature:
        dt = event.created_at

        return OrderFeature(
            hour=dt.hour,
            day_of_week=dt.weekday(),
            is_weekend=dt.weekday() >= 5,
            is_holiday=self.is_holiday(),
            total_price=event.total_price,
            product_ids=[str(pid) for pid in event.order_item_ids],
            cart_size=len(event.order_item_ids),
            created_at=dt
        )

    def is_holiday(self) -> bool:
        return False