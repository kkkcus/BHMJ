from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = 8000

    # 프로바이더 선택: mock | openai
    PROVIDER: str = "mock"

    # (openai 사용 시)
    OPENAI_API_KEY: str | None = None
    REQUEST_TIMEOUT: int = 30

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
