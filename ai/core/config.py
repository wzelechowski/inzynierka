from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    env: str = "dev"

    mongo_url: str = "mongodb://root:example@localhost:27017/?authSource=admin"
    mongo_db: str = "ai_db"

    rabbit_host: str = "localhost"
    rabbit_port: int = 5672

    class Config:
        env_file = ".env"

settings = Settings()