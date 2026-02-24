import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './Cart.module.css';
import BottomNav from '../components/BottomNav';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const nav = useNavigate();
  const { items, removeItem, toggleCheck } = useCart();
  const [query, setQuery] = useState('');

  const filtered = items.filter(item => item.name.includes(query));

  return (
    <div className="shell">
      <main className={`card ${s.pageWrap}`}>

        {/* 상단 고정 영역 */}
        <div className={s.stickyTop}>
          <div className={s.topbar}>
            <button className={s.iconCircle} onClick={() => nav(-1)} aria-label="뒤로">
              <img src="/back.png" alt="" className={s.icon} />
            </button>
            <div className={s.title}>장바구니</div>
            <div style={{ width: 40 }} />
          </div>

          {/* 검색 */}
          <div className={s.searchBlock}>
            <input
              className={s.search}
              placeholder="재료 검색하기"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 본문 */}
        <div className={s.content}>
          {filtered.length === 0 ? (
            <div className={s.empty}>
              <img src="/empty.png" alt="비어있음" className={s.emptyImg} />
            </div>
          ) : (
            <div className={s.list}>
              {filtered.map(item => (
                <div key={item.id} className={`${s.itemCard} ${item.checked ? s.itemChecked : ''}`}>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleCheck(item.id)}
                    className={s.checkbox}
                  />
                  <span className={s.itemName}>{item.name}</span>
                  <span className={s.itemQty}>{item.quantity} {item.unit}</span>
                  <button className={s.deleteBtn} onClick={() => removeItem(item.id)} aria-label="삭제">✕</button>
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
