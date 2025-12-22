from fastapi import APIRouter, Depends
from starlette import status

from dependencies.get_order_event_handler import get_order_event_handler
from schemas.order_event import OrderEvent

router = APIRouter(prefix="/order-events", tags=["Order Events"])

@router.post("", status_code=status.HTTP_202_ACCEPTED)
async def receive_order_event(
        event: OrderEvent,
        handler = Depends(get_order_event_handler)
):
    features = await handler.handle(event)
    return {"event": features}