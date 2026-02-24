from abc import ABC, abstractmethod
from typing import List
from ..schemas import Ingredient, Recipe

class BaseProvider(ABC):
    """모든 추천 엔진이 따라야 하는 인터페이스"""

    @abstractmethod
    async def recommend(self,
                        ingredients: List[Ingredient],
                        servings: int | None,
                        max_time: int | None,
                        avoid: list[str]) -> List[Recipe]:
        ...
