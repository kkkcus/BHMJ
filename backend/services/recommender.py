# backend/services/recommender.py
import os
import json
import re
from typing import List, Optional

from ..schemas import Ingredient, Recipe
from ..providers.db_provider import DBProvider

# PROVIDER: "mock" | "ollama"
PROVIDER = os.getenv("PROVIDER", "mock").lower()


def _clamp_limit(limit: Optional[int]) -> int:
    """추천 개수 클램프.
    - ollama: JSON 안정성 때문에 최대 15
    - mock: 데이터 기반이라 최대 20
    """
    if limit is None:
        return 10
    try:
        li = int(limit)
    except Exception:
        return 10
    upper = 15 if PROVIDER == "ollama" else 20
    return max(1, min(li, upper))


async def _call_llm_system(
    user_ings: List[Ingredient],
    limit: int,
    max_time: Optional[int],
    avoid: List[str],
) -> List[Recipe]:
    from ..providers.ollama_client import generate

    names = [f"{i.name} {i.qty}{i.unit}" for i in user_ings]
    avoid_txt = ", ".join(avoid) if avoid else "없음"
    time_txt = f"{max_time}분 이내" if max_time else "가능하면 10~30분"

    prompt = f"""
너는 한국 가정식 요리 추천 도우미다.
사용자가 가진 재료: {", ".join(names)}.
제약:
- 레시피는 {limit}개 제안한다.
- 조리 시간은 {time_txt}를 우선한다.
- 제외 재료: {avoid_txt} (제목/추가필요재료에 포함하지 마)
- 각 레시피는 JSON 배열 원소로만 제공하며, 필드는 id/title/est_time/need만 사용한다.
- est_time은 \"숫자+분\" 형식.
- need는 \"추가로 필요할 수 있는 재료\"를 최소 개수로 넣는다(없으면 빈 배열).
- 다른 설명 텍스트 없이 JSON 배열만 출력한다.

예시:
[
  {{"id":"r1","title":"양파 계란볶음밥","est_time":"10분","need":["간장"]}}
]
"""

    text = await generate(prompt, temperature=0.2)

    m = re.search(r"\[.*\]", text, re.S)
    raw = m.group(0) if m else "[]"
    try:
        arr = json.loads(raw)
    except Exception:
        arr = []

    out: List[Recipe] = []
    for i, r in enumerate(arr):
        out.append(
            Recipe(
                id=(r.get("id") or f"r{i+1}"),
                title=(r.get("title") or "추천 레시피"),
                est_time=r.get("est_time"),
                need=r.get("need") or [],
            )
        )
    return out[:limit]


async def recommend_by_provider(
    ingredients: List[Ingredient],
    servings: Optional[int] = None,
    max_time: Optional[int] = None,
    avoid: Optional[List[str]] = None,
    limit: Optional[int] = None,
) -> List[Recipe]:
    avoid = avoid or []
    limit_i = _clamp_limit(limit)

    provider = DBProvider()
    recipes = await provider.recommend(
        ingredients=ingredients,
        servings=servings,
        max_time=max_time,
        avoid=avoid,
        limit=limit_i,
    )
    return recipes[:limit_i]
