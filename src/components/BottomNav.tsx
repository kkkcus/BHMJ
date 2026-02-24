// src/components/BottomNav.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import s from './BottomNav.module.css';

const TABS = [
  { label: '홈',         icon: '/home.png',   to: '/home'      },
  { label: '냉장고 털기', icon: '/fridge.png', to: '/recommend' },
  { label: '장바구니',   icon: '/cart.png',   to: '/cart'      },
  { label: '마이메뉴',   icon: '/mymenu.png', to: '/my-menu'   },
] as const;

export default function BottomNav() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className={s.wrap}>
      {TABS.map((tab) => {
        const active = pathname === tab.to;
        return (
          <button
            key={tab.to}
            className={active ? s.tabActive : s.tab}
            onClick={() => nav(tab.to)}
            aria-current={active ? 'page' : undefined}
          >
            <img src={tab.icon} alt="" className={s.icon} />
            <span className={s.label}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
