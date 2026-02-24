"""
DB 초기 데이터 삽입 스크립트
실행: python -m backend.seed
"""
from .database import engine, SessionLocal, Base
from .models import Recipe, RecipeIngredient, RecipeStep, RecipeSubstitute

# 테이블 생성
Base.metadata.create_all(bind=engine)

RECIPES = [
    {
        "title": "계란국",
        "difficulty": "쉬움",
        "cooking_time": 15,
        "tips": "계란을 젓가락으로 원을 그리며 천천히 부으면 꽃 모양으로 예쁘게 풀어져요.",
        "substitutes": [("대파", "쪽파·청양고추"), ("물", "멸치 육수")],
        "ingredients": [
            ("계란", "2개"), ("물", "500ml"), ("소금", "약간"), ("대파", "1/4대"),
        ],
        "steps": [
            "냄비에 물 500ml를 붓고 센 불로 끓인다.",
            "계란을 볼에 풀어 소금으로 살짝 간한다.",
            "물이 팔팔 끓으면 계란물을 가늘게 돌려가며 붓는다.",
            "대파를 넣고 약한 불로 30초 더 끓인다.",
            "소금으로 간을 맞추고 완성한다.",
        ],
    },
    {
        "title": "토마토계란볶음",
        "difficulty": "쉬움",
        "cooking_time": 12,
        "tips": "토마토에 설탕을 살짝 넣으면 신맛이 줄고 감칠맛이 살아납니다.",
        "substitutes": [("토마토", "방울토마토"), ("식용유", "굴소스 1작은술 추가")],
        "ingredients": [
            ("계란", "2개"), ("토마토", "1개"), ("식용유", "1큰술"),
            ("소금", "약간"), ("설탕", "1/2작은술"),
        ],
        "steps": [
            "토마토를 한입 크기로 깍둑 썬다.",
            "계란을 볼에 풀고 소금으로 간한다.",
            "팬에 식용유를 두르고 계란을 반숙으로 볶아 꺼낸다.",
            "같은 팬에 토마토를 넣고 설탕을 뿌려 2분 볶는다.",
            "계란을 다시 넣고 함께 30초 볶으면 완성.",
        ],
    },
    {
        "title": "간장계란밥",
        "difficulty": "쉬움",
        "cooking_time": 10,
        "tips": "버터 대신 마가린을 써도 되고, 간장 양은 취향껏 조절하세요.",
        "substitutes": [("간장", "굴소스·쯔유"), ("버터", "마가린")],
        "ingredients": [
            ("계란", "1개"), ("밥", "1공기"), ("간장", "1큰술"),
            ("참기름", "1/2큰술"), ("버터", "1/2큰술"),
        ],
        "steps": [
            "팬에 버터를 녹이고 계란 프라이를 반숙으로 만든다.",
            "따뜻한 밥 위에 계란 프라이를 올린다.",
            "간장과 참기름을 둘러 넣는다.",
            "취향에 따라 김가루나 깨를 뿌려 완성한다.",
        ],
    },
    {
        "title": "햄계란볶음밥",
        "difficulty": "쉬움",
        "cooking_time": 15,
        "tips": "밥은 차가운 찬밥을 쓰면 퍽퍽하지 않고 더 잘 볶아집니다.",
        "substitutes": [("햄", "스팸·베이컨·소시지")],
        "ingredients": [
            ("계란", "1개"), ("밥", "1공기"), ("햄", "50g"),
            ("식용유", "1큰술"), ("간장", "1큰술"), ("소금", "약간"),
        ],
        "steps": [
            "햄을 사방 1cm 크기로 썬다.",
            "팬에 식용유를 두르고 햄을 볶는다.",
            "햄이 노릇해지면 밥을 넣고 센 불에서 볶는다.",
            "가운데를 비워 계란을 넣고 스크램블하듯 섞는다.",
            "간장과 소금으로 간을 맞추고 완성한다.",
        ],
    },
    {
        "title": "에그마요토스트",
        "difficulty": "쉬움",
        "cooking_time": 15,
        "tips": "계란을 완전히 식힌 뒤 섞어야 마요네즈가 녹지 않아요.",
        "substitutes": [("마요네즈", "플레인 요거트")],
        "ingredients": [
            ("계란", "2개"), ("식빵", "2장"), ("마요네즈", "2큰술"),
            ("소금", "약간"), ("후추", "약간"),
        ],
        "steps": [
            "계란을 삶아 껍질을 벗기고 잘게 으깬다.",
            "으깬 계란에 마요네즈, 소금, 후추를 넣어 섞는다.",
            "식빵을 토스터로 노릇하게 굽는다.",
            "구운 식빵에 에그마요를 넉넉히 펴 바른다.",
        ],
    },
    {
        "title": "라면 업그레이드(계란/대파)",
        "difficulty": "쉬움",
        "cooking_time": 8,
        "tips": "계란을 마지막에 넣고 뚜껑을 덮으면 반숙으로 예쁘게 익어요.",
        "substitutes": [("대파", "청양고추·쪽파·양파")],
        "ingredients": [
            ("라면사리", "1개"), ("계란", "1개"), ("대파", "1/4대"), ("물", "550ml"),
        ],
        "steps": [
            "냄비에 물 550ml를 끓인다.",
            "물이 끓으면 면과 스프를 넣는다.",
            "2분 후 계란을 넣고 취향대로 익힌다.",
            "대파를 송송 썰어 올리면 완성.",
        ],
    },
    {
        "title": "김치볶음밥",
        "difficulty": "쉬움",
        "cooking_time": 15,
        "tips": "묵은지를 쓰면 더 깊고 진한 맛이 납니다.",
        "substitutes": [("참기름", "들기름")],
        "ingredients": [
            ("밥", "1공기"), ("김치", "100g"), ("식용유", "1큰술"),
            ("참기름", "1/2큰술"), ("계란", "1개"), ("간장", "1/2큰술"),
        ],
        "steps": [
            "김치를 잘게 썬다.",
            "팬에 식용유를 두르고 김치를 볶는다.",
            "김치가 익으면 밥을 넣고 센 불에서 볶는다.",
            "간장을 넣고 잘 섞은 뒤 참기름을 두른다.",
            "계란 프라이를 올려 완성한다.",
        ],
    },
    {
        "title": "두부김치",
        "difficulty": "보통",
        "cooking_time": 20,
        "tips": "두부는 키친타월로 물기를 제거하면 더 바삭하게 구워져요.",
        "substitutes": [("돼지고기", "참치캔")],
        "ingredients": [
            ("두부", "1/2모"), ("김치", "150g"), ("돼지고기", "100g"),
            ("참기름", "1큰술"), ("소금", "약간"),
        ],
        "steps": [
            "두부를 1cm 두께로 썰어 소금을 살짝 뿌린다.",
            "팬에 식용유를 두르고 두부를 노릇하게 굽는다.",
            "다른 팬에 돼지고기를 먼저 볶다가 김치를 넣는다.",
            "참기름을 두르고 한소끔 더 볶는다.",
            "구운 두부 옆에 볶은 김치를 담아 완성한다.",
        ],
    },
    {
        "title": "참치마요덮밥",
        "difficulty": "쉬움",
        "cooking_time": 10,
        "tips": "냉동 완두콩이나 스위트콘을 곁들이면 색감과 맛이 모두 좋아집니다.",
        "substitutes": [("마요네즈", "무염 그릭요거트")],
        "ingredients": [
            ("참치캔", "1개(135g)"), ("밥", "1공기"), ("마요네즈", "2큰술"),
            ("간장", "1큰술"), ("참기름", "1/2큰술"),
        ],
        "steps": [
            "참치캔을 열어 기름을 제거한다.",
            "참치에 마요네즈를 넣고 잘 섞는다.",
            "따뜻한 밥 위에 참치마요를 올린다.",
            "간장과 참기름을 둘러 완성한다.",
        ],
    },
    {
        "title": "계란볶음밥",
        "difficulty": "쉬움",
        "cooking_time": 10,
        "tips": "센 불에서 빠르게 볶아야 밥알이 뭉치지 않아요.",
        "substitutes": [("간장", "굴소스")],
        "ingredients": [
            ("계란", "2개"), ("밥", "1공기"), ("식용유", "1큰술"),
            ("소금", "약간"), ("간장", "1/2큰술"),
        ],
        "steps": [
            "팬에 식용유를 두르고 센 불로 달군다.",
            "계란을 넣어 스크램블 하듯 빠르게 젓는다.",
            "계란이 반쯤 익으면 밥을 넣고 함께 볶는다.",
            "소금과 간장으로 간을 맞추고 완성한다.",
        ],
    },
]


def seed():
    db = SessionLocal()
    try:
        for data in RECIPES:
            # 이미 있으면 스킵
            if db.query(Recipe).filter(Recipe.title == data["title"]).first():
                print(f"  SKIP: {data['title']} (already exists)")
                continue

            recipe = Recipe(
                title=data["title"],
                difficulty=data["difficulty"],
                cooking_time=data["cooking_time"],
                tips=data.get("tips"),
                image_url=data.get("image_url"),
                video_url=data.get("video_url"),
            )
            db.add(recipe)
            db.flush()  # ID 확보

            for name, qty in data["ingredients"]:
                db.add(RecipeIngredient(recipe_id=recipe.id, name=name, qty=qty))

            for i, desc in enumerate(data["steps"], start=1):
                db.add(RecipeStep(recipe_id=recipe.id, order=i, description=desc))

            for original, replacement in data.get("substitutes", []):
                db.add(RecipeSubstitute(recipe_id=recipe.id, original=original, replacement=replacement))

            print(f"  ADD:  {data['title']}")

        db.commit()
        print("seed done")
    except Exception as e:
        db.rollback()
        print(f"error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
