// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type AuthUser = {
  nickname: string;
  profile_image_url?: string;
  isGuest?: boolean;
};

type AuthCtx = {
  user: AuthUser | null;
  loading: boolean;
  refetch: () => void;
  loginAsGuest: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = () => {
    // 게스트 모드 체크
    const isGuest = localStorage.getItem('isGuest') === 'true';
    if (isGuest) {
      setUser({ nickname: '게스트', isGuest: true });
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch('/auth/kakao/me', { credentials: 'include' })
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        const p = data?.kakao_account?.profile;
        setUser(
          p
            ? { nickname: p.nickname, profile_image_url: p.profile_image_url, isGuest: false }
            : null
        );
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  };

  const loginAsGuest = () => {
    localStorage.setItem('isGuest', 'true');
    setUser({ nickname: '게스트', isGuest: true });
  };

  const logout = () => {
    localStorage.removeItem('isGuest');
    setUser(null);
  };

  useEffect(() => { fetchMe(); }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetch: fetchMe, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
