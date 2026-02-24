from typing import List, Optional
import re

from ..schemas import Ingredient, Recipe
from .base import BaseProvider
from .mock_data import RECIPE_POOL

ALIAS = {
    "달걀": "계란",
    "스팸": "햄",
    "참치": "참치캔",
    "파": "대파",
    "쪽파": "대파",
    "김": "김(구운김)",
}

def normalize(name: str) -> str:
    n = (name or "").strip()
    return ALIAS.get(n, n)

def parse_minutes(est_time: str) -> Optional[int]:
    if not est_time:
        return None
    m = re.search(r"(\d+)\s*분", est_time)
    return int(m.group(1)) if m else None

def recipe_has_avoid(recipe: dict, avoid: List[str]) -> bool:
    if not avoid:
        return False
    avoid_norm = [normalize(a) for a in avoid if a]
    blob = " ".join([recipe.get("title", "")] + recipe.get("must", []) + recipe.get("nice", []))
    return any(a in blob for a in avoid_norm)

class MockProvider(BaseProvider):
    async def recommend(
        self,
        ingredients: List[Ingredient],
        servings=None,
        max_time=None,
        avoid=None,
        limit: int | None = None
    ) -> List[Recipe]:
        avoid = avoid or []

        have = set(normalize(i.name) for i in ingredients)

        ranked = []
        for r in RECIPE_POOL:
            if recipe_has_avoid(r, avoid):
                continue

            must = r.get("must", [])
            nice = r.get("nice", [])
            all_ing = list(dict.fromkeys(must + nice))  # 중복 제거 유지

            hit = sum(1 for x in all_ing if x in have)       # ✅ 충족 재료 총 개수
            hit_must = sum(1 for x in must if x in have)     # ✅ 필수 충족 개수
            miss_must = sum(1 for x in must if x not in have)

            mins = parse_minutes(r.get("est_time", ""))
            over_time = 0
            if max_time and mins is not None and mins > max_time:
                over_time = 1  # 시간초과면 뒤로 밀기

            # ✅ 정렬키: 충족개수(큰게 우선) → 필수충족(큰게 우선) → 필수부족(적은게 우선)
            #          → 시간초과(0이 우선) → id
            ranked.append((hit, hit_must, miss_must, over_time, r["id"], r))

        # ✅ “하나라도 충족되면 표시”
        ranked = [x for x in ranked if x[0] >= 1]

        # 매칭이 하나도 없으면 fallback
        if not ranked:
            fallback_ids = ["r003", "r001", "r014"]  # 김치볶음밥/간장계란밥/양배추볶음(예시)
            picked = [r for r in RECIPE_POOL if r["id"] in fallback_ids][:3]
            return [
                Recipe(
                    id=r["id"],
                    title=r["title"],
                    est_time=r.get("est_time", "15분"),
                    need=[x for x in r.get("must", []) if x not in have],
                )
                for r in picked
            ]

        ranked.sort(key=lambda x: (-x[0], -x[1], x[2], x[3], x[4]))

        out: List[Recipe] = []
        limit_i = 10 if limit is None else max(1, min(int(limit), 20))

        for hit, hit_must, miss_must, over_time, _, r in ranked[:limit_i]:
            need = [x for x in r.get("must", []) if x not in have]
            out.append(Recipe(
                id=r["id"],
                title=r["title"],
                est_time=r.get("est_time", "15분"),
                need=need,
            ))
        return out
