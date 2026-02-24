// src/ui/Footer.tsx
import s from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={s.wrap}>
      <button className={s.item}>홈</button>
      <button className={s.item}>추천</button>
      <button className={s.item}>마이</button>
      <button className={s.item}>설정</button>
    </footer>
  );
}
