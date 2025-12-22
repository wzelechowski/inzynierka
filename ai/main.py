from fastapi import FastAPI

from api import order_events
from api import recommendations

app = FastAPI()
app.include_router(order_events.router)
app.include_router(recommendations.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
