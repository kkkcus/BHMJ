// src/pages/Home.tsx
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './Home.module.css';
import BottomNav from '../components/BottomNav';
// 전역 CSS는 가능하면 main.tsx에서 한 번만 import 권장
// import '../styles/globals.css';

export default function Home() {
  const nav = useNavigate();

  // 아이콘 파일은 프로젝트 /public 에 두고 "/파일명" 으로 불러옵니다.
  // (예: public/fridge.png -> <img src="/fridge.png" />)
  const features: Array<{ label: string; icon: string; to?: string }> = [
    { label: '오늘의 메뉴', icon: '/bestmenu.png', to: '/best' },
    { label: '냉장고 털기', icon: '/fridge.png', to: '/recommend' },
    { label: '나의 요리집', icon: '/myrecipes.png', to: '/my-recipes' },
    { label: '도와줘 밥먹아', icon: '/support.png', to: '/support' },
    { label: '신규 레시피', icon: '/newrecipes.png', to: '/new' },
    { label: '밥스타그램', icon: '/bapstagram.png', to: '/bapstagram' },
  ];

  const go = useCallback((to?: string) => {
    if (!to) return;
    nav(to);
  }, [nav]);

  return (
    <div className="shell">
      {/* 전역 .card + 페이지 전용 .card 같이 적용 (폭/각진 유지) */}
      <main className={`card ${s.card}`}>
        {/* 상단: 로고 / 검색 / 알림 */}
        <div className={s.toolbar}>
          <img src="/logo.png" alt="로고" className={s.logo} />
          <div className={s.searchGrow}>
            <input className="search" placeholder="레시피 검색" />
          </div>
          <button className={s.iconBtn} aria-label="알림">
            <img src="/bell.png" alt="알림" className={s.icon} />
          </button>
        </div>

        {/* 트렌드 자리 */}
        <section className={s.panel}>트렌드 음식</section>

        {/* 기능 6개 */}
        <section className={s.grid6}>
          {features.map((f) => {
            const clickable = Boolean(f.to);
            return (
              <div
                key={f.label}
                className={s.tile}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : -1}
                onClick={clickable ? () => go(f.to) : undefined}
                onKeyDown={
                  clickable
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          go(f.to);
                        }
                      }
                    : undefined
                }
                style={clickable ? { cursor: 'pointer' } : undefined}
              >
                <div className={s.square}>
                  <img src={f.icon} alt="" />
                </div>
                <div className={s.tileLabel}>{f.label}</div>
              </div>
            );
          })}
        </section>

        {/* 인기 레시피 (일단 더미 카드) */}
        <section className={s.section}>
          <div className={s.sectionTitle}>인기 레시피</div>
          <div className={s.cardGrid3}>
            {['1st', '2nd', '3rd'].map((rank) => (
              <div key={rank} className={s.miniCard}>
                <div className={s.miniRank}>{rank}</div>
                <div className={s.miniImg}>사진</div>
                <div className={s.miniLabel}>레시피 이름</div>
              </div>
            ))}
          </div>
        </section>

        {/* 밥스타그램 인기글 (일단 더미 카드) */}
        <section className={s.section}>
          <div className={s.sectionTitle}>밥스타그램 인기글</div>
          <div className={s.cardGrid3}>
            {['1st', '2nd', '3rd'].map((rank) => (
              <div key={rank} className={s.miniCard}>
                <div className={s.miniRank}>{rank}</div>
                <div className={s.miniImg}>사진</div>
                <div className={s.miniLabel}>제목</div>
              </div>
            ))}
          </div>
        </section>

        <BottomNav />
      </main>
    </div>
  );
}
