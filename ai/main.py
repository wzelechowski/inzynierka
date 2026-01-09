from contextlib import asynccontextmanager

from fastapi import FastAPI

from api import order_events
from api import recommendations
from core.rabbit import init_global


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_global()

    yield
app = FastAPI(lifespan=lifespan)

app.include_router(order_events.router)
app.include_router(recommendations.router)