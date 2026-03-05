import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import s from './RecipeDetail.module.css';

type Ingredient = { name: string; qty: string };
type Step = { order: number; description: string };
type SubstitutePair = { original: string; replacement: string };

type RecipeData = {
  id: number;
  title: string;
  difficulty: string;
  cooking_time: number;
  image_url: string | null;
  video_url: string | null;
  tips: string | null;
  ingredients: Ingredient[];
  steps: Step[];
  substitute_list: SubstitutePair[];
};

type LocationState = {
  need?: string[];
  estTime?: string;
};

export default function RecipeDetail() {
  const { title } = useParams<{ title: string }>();
  const nav = useNavigate();
  const { state } = useLocation() as { state: LocationState | null };
  const { addItem } = useCart();
  const { user, logout } = useAuth();

  const decodedTitle = decodeURIComponent(title ?? '');
  const needSet = new Set(state?.need ?? []);

  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(() => {
    try {
      const saved = localStorage.getItem('bhmj_bookmarks');
      const bookmarks = saved ? JSON.parse(saved) : [];
      return bookmarks.includes(decodedTitle);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    fetch(`/api/recipes/${encodeURIComponent(decodedTitle)}`)
      .then(res => {
        if (res.status === 404) { setNotFound(true); return null; }
        return res.json();
      })
      .then(data => { if (data) setRecipe(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [decodedTitle]);

  const missingIngredients = recipe
    ? recipe.ingredients.filter(ing => needSet.has(ing.name))
    : [];

  const toggleBookmark = () => {
    try {
      const saved = localStorage.getItem('bhmj_bookmarks');
      const bookmarks = saved ? JSON.parse(saved) : [];

      if (isBookmarked) {
        // 북마크 제거
        const updated = bookmarks.filter((title: string) => title !== decodedTitle);
        localStorage.setItem('bhmj_bookmarks', JSON.stringify(updated));
      } else {
        // 북마크 추가
        bookmarks.push(decodedTitle);
        localStorage.setItem('bhmj_bookmarks', JSON.stringify(bookmarks));
      }

      setIsBookmarked(!isBookmarked);
    } catch (e) {
      console.error('북마크 저장 실패:', e);
    }
  };

  const addAllToCart = () => {
    // 게스트 모드 체크 - 로그인 필요
    if (user?.isGuest) {
      logout();
      nav('/');
      return;
    }

    missingIngredients.forEach(ing => {
      const fracMatch = ing.qty.match(/^([\d]+)\/([\d]+)/);
      const numMatch = ing.qty.match(/^[\d.]+/);
      const quantity = fracMatch
        ? parseFloat(fracMatch[1]) / parseFloat(fracMatch[2])
        : numMatch ? parseFloat(numMatch[0]) : 1;
      const unit = ing.qty.replace(/^[\d./\s]+/, '').trim() || '개';
      addItem({ name: ing.name, quantity, unit });
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="shell">
        <main className={`card ${s.pageWrap}`}>
          <div className={s.topbar}>
            <button className={s.iconCircle} onClick={() => nav(-1)}>
              <img src="/back.png" alt="뒤로" className={s.icon} />
            </button>
            <div className={s.title}>{decodedTitle}</div>
            <button className={s.iconCircle} onClick={toggleBookmark} aria-label="북마크">
              <img src={isBookmarked ? "/bookmarkon.png" : "/bookmarkoff.png"} alt="" className={s.icon} />
            </button>
          </div>
          <div className={s.notFound}><p>불러오는 중...</p></div>
        </main>
      </div>
    );
  }

  if (notFound || !recipe) {
    return (
      <div className="shell">
        <main className={`card ${s.pageWrap}`}>
          <div className={s.topbar}>
            <button className={s.iconCircle} onClick={() => nav(-1)}>
              <img src="/back.png" alt="뒤로" className={s.icon} />
            </button>
            <div className={s.title}>{decodedTitle}</div>
            <button className={s.iconCircle} onClick={toggleBookmark} aria-label="북마크">
              <img src={isBookmarked ? "/bookmarkon.png" : "/bookmarkoff.png"} alt="" className={s.icon} />
            </button>
          </div>
          <div className={s.notFound}><p>레시피 정보를 찾을 수 없어요.</p></div>
        </main>
      </div>
    );
  }

  return (
    <div className="shell">
      <main className={`card ${s.pageWrap}`}>

        {/* 상단바 */}
        <div className={s.topbar}>
          <button className={s.iconCircle} onClick={() => nav(-1)} aria-label="뒤로">
            <img src="/back.png" alt="" className={s.icon} />
          </button>
          <div className={s.title}>{recipe.title}</div>
          <button className={s.iconCircle} onClick={toggleBookmark} aria-label="북마크">
            <img src={isBookmarked ? "/bookmarkon.png" : "/bookmarkoff.png"} alt="" className={s.icon} />
          </button>
        </div>

        {/* 스크롤 콘텐츠 */}
        <div className={s.content}>

          {/* 요약 뱃지 */}
          <div className={s.badges}>
            <span className={`${s.badge} ${s.badgeTime}`}>⏱ {recipe.cooking_time}분</span>
            <span className={`${s.badge} ${s.badgeDifficulty}`}>{recipe.difficulty}</span>
          </div>

          {/* 재료 */}
          <section className={s.section}>
            <div className={s.sectionTitle}>🥬 재료</div>
            <ul className={s.ingList}>
              {recipe.ingredients.map(ing => (
                <li
                  key={ing.name}
                  className={`${s.ingItem} ${needSet.has(ing.name) ? s.ingMissing : ''}`}
                >
                  <span className={s.ingName}>
                    {ing.name}
                    {needSet.has(ing.name) && <span className={s.missingTag}>부족</span>}
                  </span>
                  <span className={s.ingQty}>{ing.qty}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 조리 순서 */}
          <section className={s.section}>
            <div className={s.sectionTitle}>👨‍🍳 조리 순서</div>
            <ol className={s.stepList}>
              {recipe.steps.map(step => (
                <li key={step.order} className={s.stepItem}>
                  <span className={s.stepNum}>{step.order}</span>
                  <span className={s.stepText}>{step.description}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* 팁 */}
          {recipe.tips && (
            <section className={s.section}>
              <div className={s.sectionTitle}>✨ 더 맛있게 먹는 법</div>
              <p className={s.tipText}>{recipe.tips}</p>
            </section>
          )}

          {/* 대체 재료 */}
          {recipe.substitute_list.length > 0 && (
            <section className={`${s.section} ${s.lastSection}`}>
              <div className={s.sectionTitle}>🔄 대체 가능한 재료</div>
              <div className={s.subList}>
                {recipe.substitute_list.map(pair => (
                  <div key={pair.original} className={s.subRow}>
                    <span className={s.subOriginal}>{pair.original}</span>
                    <span className={s.subArrow}>→</span>
                    <span className={s.subReplacement}>{pair.replacement}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* 하단 고정 버튼 */}
        {missingIngredients.length > 0 && (
          <div className={s.fixedBottom}>
            <button className={s.cartBtn} onClick={addAllToCart}>
              부족한 재료 장바구니에 추가하기
            </button>
          </div>
        )}

      <BottomNav />

      {/* 장바구니 추가 모달 */}
      {showModal && (
        <div className={s.modalBackdrop} onClick={() => setShowModal(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <p className={s.modalMsg}>장바구니에 추가했어요!</p>
            <button className={s.modalBtnPrimary} onClick={() => nav('/cart')}>
              장바구니로 이동하기
            </button>
            <button className={s.modalBtnSecondary} onClick={() => setShowModal(false)}>
              레시피 계속 보기
            </button>
          </div>
        </div>
      )}

      </main>
    </div>
  );
}
