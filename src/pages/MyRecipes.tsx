import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './Recommend.module.css';
import BottomNav from '../components/BottomNav';
import { findRecipe } from '../data/recipes';

export default function MyRecipes() {
  const nav = useNavigate();
  const [bookmarkedRecipes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bhmj_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  return (
    <main className={`card ${s.pageWrap}`}>

      {/* 상단 고정 영역 */}
      <div className={s.stickyTop}>
        <div className={s.topbar}>
          <button className={s.iconCircle} onClick={() => nav(-1)} aria-label="뒤로">
            <img src="/back.png" alt="" className={s.icon} />
          </button>
          <div className={s.title}>나의 요리집</div>
          <div style={{ width: 40 }} />
        </div>

        {/* 구분선 */}
        <div className={s.divider} />
      </div>

      {/* 추천 결과 출력 */}
      <div className={s.scrollArea}>
        {bookmarkedRecipes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <img src="/myrecipesempty.png" alt="비어있음" style={{ width: '120px', marginBottom: '20px' }} />
            <p style={{ color: '#999', fontSize: '14px' }}>북마크한 레시피가 없어요</p>
          </div>
        ) : (
          <div className={s.results}>
            {bookmarkedRecipes.map((title) => (
              <article key={title} className={s.recipe}>
                <div className={s.recipeHead}>
                  <img src="/fridge.png" alt="" />
                  <div>
                    <div className={s.titleRow}>{title}</div>
                    <div className={s.meta}>
                      {findRecipe(title)?.cooking_time ?? "-"}분 · {findRecipe(title)?.difficulty ?? "-"}
                    </div>
                  </div>
                </div>
                <button
                  className={s.viewBtn}
                  onClick={() => nav(`/recipe/${encodeURIComponent(title)}`)}
                >자세히</button>
              </article>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
