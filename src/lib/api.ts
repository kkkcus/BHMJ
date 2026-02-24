// src/lib/api.ts
export const API_BASE = '/api'; // ← 옵션 A 기준

export type Unit = '개' | 'g' | 'ml' | '장';
export type Ingredient = { name: string; qty: number; unit: Unit };
// 프론트에서는 camelCase로 쓰기 (Recommend.tsx에서 estTime 사용)
export type Recipe = { id: string; title: string; estTime?: string; need: string[] };

export async function postRecommend(payload: {
  ingredients: Ingredient[];
  servings?: number;
  max_time?: number;
  avoid?: string[];
  limit?: number;
}): Promise<Recipe[]> {
  const res = await fetch(`${API_BASE}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json(); // { recipes: [...] }
  const recipes = (data.recipes ?? []) as Array<{
    id: string;
    title: string;
    est_time?: string;
    need?: string[];
  }>;

  // est_time(snake) -> estTime(camel) 변환
  return recipes.map((r) => ({
    id: r.id,
    title: r.title,
    estTime: r.est_time,
    need: r.need ?? [],
  }));
}
