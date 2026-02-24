# backend/providers/db_provider.py
from typing import List
from sqlalchemy.orm import joinedload

from ..schemas import Ingredient, Recipe
from ..database import SessionLocal
from ..models import Recipe as RecipeModel
from .base import BaseProvider

ALIAS = {
    "달걀": "계란",
    "스팸": "햄",
    "참치": "참치캔",
    "파": "대파",
    "쪽파": "대파",
    "김": "김(구운김)",
}


def _normalize(name: str) -> str:
    n = (name or "").strip()
    return ALIAS.get(n, n)


class DBProvider(BaseProvider):
    async def recommend(
        self,
        ingredients: List[Ingredient],
        servings=None,
        max_time=None,
        avoid=None,
        limit: int | None = None,
    ) -> List[Recipe]:
        avoid = avoid or []
        avoid_norm = [_normalize(a) for a in avoid if a]
        limit_i = 10 if limit is None else max(1, min(int(limit), 20))

        have = set(_normalize(i.name) for i in ingredients)

        db = SessionLocal()
        try:
            recipes = (
                db.query(RecipeModel)
                .options(joinedload(RecipeModel.ingredients))
                .all()
            )

            ranked = []
            for r in recipes:
                ing_names = [_normalize(i.name) for i in r.ingredients]

                # avoid 재료 포함 시 제외
                if avoid_norm:
                    blob = r.title + " " + " ".join(ing_names)
                    if any(a in blob for a in avoid_norm):
                        continue

                hit = sum(1 for name in ing_names if name in have)
                over_time = 1 if (max_time and r.cooking_time > max_time) else 0

                ranked.append((hit, over_time, r.id, r, ing_names))

            # 재료가 하나라도 맞는 것만 표시
            ranked = [x for x in ranked if x[0] >= 1]

            if not ranked:
                # 매칭 없으면 처음 3개 fallback
                fallback = recipes[:3]
                return [
                    Recipe(
                        id=str(r.id),
                        title=r.title,
                        est_time=f"{r.cooking_time}분",
                        need=[_normalize(i.name) for i in r.ingredients if _normalize(i.name) not in have],
                    )
                    for r in fallback
                ]

            # 충족 많은 순 → 시간초과 없는 순 → id 순
            ranked.sort(key=lambda x: (-x[0], x[1], x[2]))

            return [
                Recipe(
                    id=str(r.id),
                    title=r.title,
                    est_time=f"{r.cooking_time}분",
                    need=[_normalize(i.name) for i in r.ingredients if _normalize(i.name) not in have],
                )
                for _, _, _, r, _ in ranked[:limit_i]
            ]
        finally:
            db.close()
