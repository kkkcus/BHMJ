import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Screen from "../ui/Screen";
import s from "./Login.module.css";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && user) nav("/home", { replace: true });
  }, [user, loading, nav]);

  if (loading) return null;

  return (
    <Screen withCard className={s.loginCard}>
      {/* 카드(420px) 크기는 유지, 내부만 풀-블리드 */}
      <div className={s.root}>
        <div className={s.center}>
          <div className={s.logoWrap}>
            <img src="/logo.png" alt="밥해먹자" className={s.logo} />
          </div>

          <div className={s.btns}>
            <button 
            type="button"
            className={`${s.socialBtn} ${s.kakao}`}
            onClick={() => {
              window.location.href = "/auth/kakao/login";
            }}
            >
              <img src="/kakao.png" alt="" aria-hidden className={s.icon} />
              <span>카카오로 계속</span>
            </button>

            <button type="button" className={`${s.socialBtn} ${s.apple}`}>
              <img src="/apple.png" alt="" aria-hidden className={s.icon} />
              <span>Apple로 계속</span>
            </button>

            <button type="button" className={`${s.socialBtn} ${s.google}`}>
              <img src="/google.png" alt="" aria-hidden className={s.icon} />
              <span>Google로 계속</span>
            </button>
          </div>
        </div>
      </div>
    </Screen>
  );
}
