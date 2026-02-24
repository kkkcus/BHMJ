from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from ..database import get_db
from ..models import Recipe, RecipeIngredient, RecipeStep, RecipeSubstitute

router = APIRouter(prefix="/api/recipes", tags=["recipes"])


# ── 응답 스키마 ──────────────────────────────────────
class IngredientOut(BaseModel):
    name: str
    qty: str

    model_config = {"from_attributes": True}


class StepOut(BaseModel):
    order: int
    description: str

    model_config = {"from_attributes": True}


class SubstituteOut(BaseModel):
    original: str
    replacement: str

    model_config = {"from_attributes": True}


class RecipeOut(BaseModel):
    id: int
    title: str
    difficulty: str
    cooking_time: int
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    tips: Optional[str] = None
    ingredients: List[IngredientOut] = []
    steps: List[StepOut] = []
    substitute_list: List[SubstituteOut] = []

    model_config = {"from_attributes": True}


class RecipeSummary(BaseModel):
    id: int
    title: str
    difficulty: str
    cooking_time: int
    image_url: Optional[str] = None

    model_config = {"from_attributes": True}


# ── 엔드포인트 ────────────────────────────────────────
@router.get("", response_model=List[RecipeSummary])
def list_recipes(db: Session = Depends(get_db)):
    """레시피 목록 (요약)"""
    return db.query(Recipe).all()


@router.get("/{title}", response_model=RecipeOut)
def get_recipe(title: str, db: Session = Depends(get_db)):
    """레시피 상세 (제목으로 조회)"""
    recipe = db.query(Recipe).filter(Recipe.title == title).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="레시피를 찾을 수 없습니다.")
    return recipe
