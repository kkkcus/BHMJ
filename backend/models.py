from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id           = Column(Integer, primary_key=True, index=True)
    title        = Column(String(100), unique=True, index=True, nullable=False)
    difficulty   = Column(String(10), nullable=False)   # 쉬움 / 보통 / 어려움
    cooking_time = Column(Integer, nullable=False)       # 분(minutes)
    image_url    = Column(String(500), nullable=True)    # 나중에 사진
    video_url    = Column(String(500), nullable=True)    # 유튜브 링크
    tips         = Column(Text, nullable=True)
    substitutes  = Column(Text, nullable=True)

    ingredients = relationship(
        "RecipeIngredient",
        back_populates="recipe",
        cascade="all, delete-orphan",
        order_by="RecipeIngredient.id",
    )
    steps = relationship(
        "RecipeStep",
        back_populates="recipe",
        cascade="all, delete-orphan",
        order_by="RecipeStep.order",
    )
    substitute_list = relationship(
        "RecipeSubstitute",
        back_populates="recipe",
        cascade="all, delete-orphan",
        order_by="RecipeSubstitute.id",
    )


class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    id        = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    name      = Column(String(50), nullable=False)
    qty       = Column(String(30), nullable=False)   # "2개", "200g" 등

    recipe = relationship("Recipe", back_populates="ingredients")


class RecipeStep(Base):
    __tablename__ = "recipe_steps"

    id          = Column(Integer, primary_key=True, index=True)
    recipe_id   = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    order       = Column(Integer, nullable=False)   # 1, 2, 3 …
    description = Column(Text, nullable=False)

    recipe = relationship("Recipe", back_populates="steps")


class RecipeSubstitute(Base):
    __tablename__ = "recipe_substitutes"

    id          = Column(Integer, primary_key=True, index=True)
    recipe_id   = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    original    = Column(String(50), nullable=False)    # 원재료
    replacement = Column(String(100), nullable=False)   # 대체 재료

    recipe = relationship("Recipe", back_populates="substitute_list")
