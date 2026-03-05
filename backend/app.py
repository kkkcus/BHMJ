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

# SPA fallback: /api/* 제외한 모든 경로는 index.html 반환
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # /api로 시작하는 경로는 여기서 처리 안 함 (이미 위의 라우터가 처리함)
    if full_path.startswith("api/"):
        # 이 코드는 실행되지 않음 (FastAPI가 위의 라우터를 먼저 처리)
        # 하지만 404는 여기서 처리
        return {"detail": "Not Found"}

    # 정적 파일 체크 (dist 폴더에 실제 파일이 있으면 반환)
    static_file_path = os.path.join(_dist, full_path)
    if os.path.isfile(static_file_path):
        return FileResponse(static_file_path)

    # 정적 파일 없으면 index.html 반환 (SPA 라우팅)
    index_path = os.path.join(_dist, "index.html")
    if os.path.isfile(index_path):
        return FileResponse(index_path)

    return {"detail": "Not Found"}

# dist 폴더가 있으면 static files 마운트
if os.path.isdir(_dist):
    app.mount("/", StaticFiles(directory=_dist, html=True), name="static")

