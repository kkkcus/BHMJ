# backend/app.py
import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .schemas import RecommendRequest, RecommendResponse
from .services.recommender import recommend_by_provider

from .auth_kakao import router as kakao_router
from .routers.recipes import router as recipes_router
from .database import engine
from .models import Base

# 테이블 자동 생성 (없으면 만듦)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BHM Recommend API")

app.include_router(kakao_router)
app.include_router(recipes_router)

_cors_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
if os.getenv("FRONTEND_URL"):
    _cors_origins.append(os.getenv("FRONTEND_URL"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 헬스체크
@app.get("/api/health")
def health():
    return {"ok": True}

# ★ 여기: 기존 더미 라우트 삭제/교체
@app.post("/api/recommend", response_model=RecommendResponse)
async def recommend(req: RecommendRequest):
    recipes = await recommend_by_provider(
        req.ingredients,
        servings=req.servings,
        max_time=req.max_time,
        avoid=req.avoid,
        limit=req.limit,
    )
    return RecommendResponse(recipes=recipes)

# ── 빌드된 프론트엔드 서빙 (SPA) ──────────────────
_dist = os.path.join(os.path.dirname(__file__), "..", "dist")
if os.path.isdir(_dist):
    app.mount("/", StaticFiles(directory=_dist, html=True), name="static")
