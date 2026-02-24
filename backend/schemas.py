from pydantic import BaseModel, Field
from typing import List, Literal, Optional

Unit = Literal["개", "g", "ml", "장"]

class Ingredient(BaseModel):
    name: str = Field(..., description="재료명")
    qty: float = Field(1, ge=0, description="수량/중량")
    unit: Unit = "개"

class RecommendRequest(BaseModel):
    ingredients: List[Ingredient]
    servings: Optional[int] = 1
    max_time: Optional[int] = 30
    avoid: List[str] = []
    # 몇 개까지 추천할지 (프론트에서 조절 가능)
    limit: Optional[int] = 10

class Recipe(BaseModel):
    id: str
    title: str
    est_time: Optional[str] = None
    need: List[str] = []

class RecommendResponse(BaseModel):
    recipes: List[Recipe]
