export type RecipeIngredient = {
  name: string;
  qty: string;
};

export type Recipe = {
  title: string;
  difficulty: '쉬움' | '보통' | '어려움';
  cookingTime: number; // 분
  ingredients: RecipeIngredient[];
  steps: string[];
  tips: string;
  substitutes: string;
};

export const RECIPES: Recipe[] = [
  {
    title: '계란국',
    difficulty: '쉬움',
    cookingTime: 15,
    ingredients: [
      { name: '계란', qty: '2개' },
      { name: '물', qty: '500ml' },
      { name: '소금', qty: '약간' },
      { name: '대파', qty: '1/4대' },
    ],
    steps: [
      '냄비에 물 500ml를 붓고 센 불로 끓인다.',
      '계란을 볼에 풀어 소금으로 살짝 간한다.',
      '물이 팔팔 끓으면 계란물을 가늘게 돌려가며 붓는다.',
      '대파를 넣고 약한 불로 30초 더 끓인다.',
      '소금으로 간을 맞추고 완성한다.',
    ],
    tips: '계란을 젓가락으로 원을 그리며 천천히 부으면 꽃 모양으로 예쁘게 풀어져요.',
    substitutes: '대파 대신 쪽파·청양고추를 사용해도 좋고, 멸치 육수를 쓰면 맛이 더 깊어집니다.',
  },
  {
    title: '토마토계란볶음',
    difficulty: '쉬움',
    cookingTime: 12,
    ingredients: [
      { name: '계란', qty: '2개' },
      { name: '토마토', qty: '1개' },
      { name: '식용유', qty: '1큰술' },
      { name: '소금', qty: '약간' },
      { name: '설탕', qty: '1/2작은술' },
    ],
    steps: [
      '토마토를 한입 크기로 깍둑 썬다.',
      '계란을 볼에 풀고 소금으로 간한다.',
      '팬에 식용유를 두르고 계란을 반숙으로 볶아 꺼낸다.',
      '같은 팬에 토마토를 넣고 설탕을 뿌려 2분 볶는다.',
      '계란을 다시 넣고 함께 30초 볶으면 완성.',
    ],
    tips: '토마토에 설탕을 살짝 넣으면 신맛이 줄고 감칠맛이 살아납니다.',
    substitutes: '방울토마토로 대체 가능하고, 굴소스 1작은술을 추가하면 풍미가 올라가요.',
  },
  {
    title: '간장계란밥',
    difficulty: '쉬움',
    cookingTime: 10,
    ingredients: [
      { name: '계란', qty: '1개' },
      { name: '밥', qty: '1공기' },
      { name: '간장', qty: '1큰술' },
      { name: '참기름', qty: '1/2큰술' },
      { name: '버터', qty: '1/2큰술' },
    ],
    steps: [
      '팬에 버터를 녹이고 계란 프라이를 반숙으로 만든다.',
      '따뜻한 밥 위에 계란 프라이를 올린다.',
      '간장과 참기름을 둘러 넣는다.',
      '취향에 따라 김가루나 깨를 뿌려 완성한다.',
    ],
    tips: '버터 대신 마가린을 써도 되고, 간장 양은 취향껏 조절하세요.',
    substitutes: '간장 대신 굴소스나 쯔유를 쓰면 다른 풍미를 즐길 수 있어요.',
  },
  {
    title: '햄계란볶음밥',
    difficulty: '쉬움',
    cookingTime: 15,
    ingredients: [
      { name: '계란', qty: '1개' },
      { name: '밥', qty: '1공기' },
      { name: '햄', qty: '50g' },
      { name: '식용유', qty: '1큰술' },
      { name: '간장', qty: '1큰술' },
      { name: '소금', qty: '약간' },
    ],
    steps: [
      '햄을 사방 1cm 크기로 썬다.',
      '팬에 식용유를 두르고 햄을 볶는다.',
      '햄이 노릇해지면 밥을 넣고 센 불에서 볶는다.',
      '가운데를 비워 계란을 넣고 스크램블하듯 섞는다.',
      '간장과 소금으로 간을 맞추고 완성한다.',
    ],
    tips: '밥은 차가운 찬밥을 쓰면 퍽퍽하지 않고 더 잘 볶아집니다.',
    substitutes: '햄 대신 스팸·베이컨·소시지로 대체 가능해요.',
  },
  {
    title: '에그마요토스트',
    difficulty: '쉬움',
    cookingTime: 15,
    ingredients: [
      { name: '계란', qty: '2개' },
      { name: '식빵', qty: '2장' },
      { name: '마요네즈', qty: '2큰술' },
      { name: '소금', qty: '약간' },
      { name: '후추', qty: '약간' },
    ],
    steps: [
      '계란을 삶아 껍질을 벗기고 잘게 으깬다.',
      '으깬 계란에 마요네즈, 소금, 후추를 넣어 섞는다.',
      '식빵을 토스터로 노릇하게 굽는다.',
      '구운 식빵에 에그마요를 넉넉히 펴 바른다.',
    ],
    tips: '계란을 완전히 식힌 뒤 섞어야 마요네즈가 녹지 않아요.',
    substitutes: '마요네즈 대신 플레인 요거트를 쓰면 더 가볍게 즐길 수 있어요.',
  },
  {
    title: '라면 업그레이드(계란/대파)',
    difficulty: '쉬움',
    cookingTime: 8,
    ingredients: [
      { name: '라면사리', qty: '1개' },
      { name: '계란', qty: '1개' },
      { name: '대파', qty: '1/4대' },
      { name: '물', qty: '550ml' },
    ],
    steps: [
      '냄비에 물 550ml를 끓인다.',
      '물이 끓으면 면과 스프를 넣는다.',
      '2분 후 계란을 넣고 취향대로 익힌다.',
      '대파를 송송 썰어 올리면 완성.',
    ],
    tips: '계란을 마지막에 넣고 뚜껑을 덮으면 반숙으로 예쁘게 익어요.',
    substitutes: '대파 대신 청양고추·쪽파·양파 사용 가능해요.',
  },
  {
    title: '김치볶음밥',
    difficulty: '쉬움',
    cookingTime: 15,
    ingredients: [
      { name: '밥', qty: '1공기' },
      { name: '김치', qty: '100g' },
      { name: '식용유', qty: '1큰술' },
      { name: '참기름', qty: '1/2큰술' },
      { name: '계란', qty: '1개' },
      { name: '간장', qty: '1/2큰술' },
    ],
    steps: [
      '김치를 잘게 썬다.',
      '팬에 식용유를 두르고 김치를 볶는다.',
      '김치가 익으면 밥을 넣고 센 불에서 볶는다.',
      '간장을 넣고 잘 섞은 뒤 참기름을 두른다.',
      '계란 프라이를 올려 완성한다.',
    ],
    tips: '묵은지를 쓰면 더 깊고 진한 맛이 납니다.',
    substitutes: '참기름 대신 들기름을 써도 고소하고 맛있어요.',
  },
  {
    title: '두부김치',
    difficulty: '보통',
    cookingTime: 20,
    ingredients: [
      { name: '두부', qty: '1/2모' },
      { name: '김치', qty: '150g' },
      { name: '돼지고기', qty: '100g' },
      { name: '참기름', qty: '1큰술' },
      { name: '소금', qty: '약간' },
    ],
    steps: [
      '두부를 1cm 두께로 썰어 소금을 살짝 뿌린다.',
      '팬에 식용유를 두르고 두부를 노릇하게 굽는다.',
      '다른 팬에 돼지고기를 먼저 볶다가 김치를 넣는다.',
      '참기름을 두르고 한소끔 더 볶는다.',
      '구운 두부 옆에 볶은 김치를 담아 완성한다.',
    ],
    tips: '두부는 키친타월로 물기를 제거하면 더 바삭하게 구워져요.',
    substitutes: '돼지고기 대신 참치캔을 활용해도 맛있어요.',
  },
  {
    title: '참치마요덮밥',
    difficulty: '쉬움',
    cookingTime: 10,
    ingredients: [
      { name: '참치캔', qty: '1개(135g)' },
      { name: '밥', qty: '1공기' },
      { name: '마요네즈', qty: '2큰술' },
      { name: '간장', qty: '1큰술' },
      { name: '참기름', qty: '1/2큰술' },
    ],
    steps: [
      '참치캔을 열어 기름을 제거한다.',
      '참치에 마요네즈를 넣고 잘 섞는다.',
      '따뜻한 밥 위에 참치마요를 올린다.',
      '간장과 참기름을 둘러 완성한다.',
    ],
    tips: '냉동 완두콩이나 스위트콘을 곁들이면 색감과 맛이 모두 좋아집니다.',
    substitutes: '마요네즈 대신 무염 그릭요거트를 사용해도 돼요.',
  },
  {
    title: '계란볶음밥',
    difficulty: '쉬움',
    cookingTime: 10,
    ingredients: [
      { name: '계란', qty: '2개' },
      { name: '밥', qty: '1공기' },
      { name: '식용유', qty: '1큰술' },
      { name: '소금', qty: '약간' },
      { name: '간장', qty: '1/2큰술' },
    ],
    steps: [
      '팬에 식용유를 두르고 센 불로 달군다.',
      '계란을 넣어 스크램블 하듯 빠르게 젓는다.',
      '계란이 반쯤 익으면 밥을 넣고 함께 볶는다.',
      '소금과 간장으로 간을 맞추고 완성한다.',
    ],
    tips: '센 불에서 빠르게 볶아야 밥알이 뭉치지 않아요.',
    substitutes: '간장 대신 굴소스를 사용하면 감칠맛이 더 풍부해집니다.',
  },
];

export function findRecipe(title: string): Recipe | undefined {
  return RECIPES.find(r => r.title === title);
}
