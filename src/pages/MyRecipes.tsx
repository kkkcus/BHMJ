import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './Cart.module.css';
import BottomNav from '../components/BottomNav';

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
    <div className="shell">
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
        </div>

        {/* 본문 */}
        <div className={s.content}>
          {bookmarkedRecipes.length === 0 ? (
            <div className={s.empty}>
              <img src="/myrecipesempty.png" alt="비어있음" className={s.emptyImg} />
            </div>
          ) : (
            <div className={s.list}>
              {bookmarkedRecipes.map(recipe => (
                <div
                  key={recipe}
                  className={s.itemCard}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  onClick={() => nav(`/recipe/${encodeURIComponent(recipe)}`)}
                >
                  <span className={s.itemName}>{recipe}</span>
                  <span style={{ fontSize: '12px', color: '#999' }}>›</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <BottomNav />
      </main>
    </div>
  );
}
