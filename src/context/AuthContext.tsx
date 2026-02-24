// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type AuthUser = {
  nickname: string;
  profile_image_url?: string;
};

type AuthCtx = {
  user: AuthUser | null;
  loading: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = () => {
    setLoading(true);
    fetch('/auth/kakao/me', { credentials: 'include' })
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        const p = data?.kakao_account?.profile;
        setUser(
          p
            ? { nickname: p.nickname, profile_image_url: p.profile_image_url }
            : null
        );
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMe(); }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetch: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
