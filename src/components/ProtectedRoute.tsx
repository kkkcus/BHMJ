// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null; // 인증 확인 중에는 아무것도 렌더하지 않음
  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
}
