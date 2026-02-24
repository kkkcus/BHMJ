from typing import List
from ..schemas import Ingredient, Recipe
from .base import BaseProvider
from ..settings import settings

class OpenAIProvider(BaseProvider):
    def __init__(self):
        if not settings.OPENAI_API_KEY:
            raise RuntimeError("OPENAI_API_KEY 가 .env 에 필요합니다.")

    async def recommend(self, ingredients: List[Ingredient], servings, max_time, avoid) -> List[Recipe]:
        # 여기에 OpenAI 호출 로직을 넣으면 됨.
        # 현재는 자리를 채우는 스텁.
        return [
            Recipe(id="oa1", title="(AI) 추천 레시피 1", est_time="25분", need=[]),
            Recipe(id="oa2", title="(AI) 추천 레시피 2", est_time="15분", need=["간장"]),
        ]
