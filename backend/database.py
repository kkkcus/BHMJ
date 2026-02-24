from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
import os

# DB 파일 위치: backend/recipe.db
BASE_DIR = os.path.dirname(__file__)
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'recipe.db')}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # SQLite 멀티스레드 허용
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Base(DeclarativeBase):
    pass

# FastAPI 의존성: DB 세션 주입용
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
