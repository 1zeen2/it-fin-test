'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import api from '@/lib/axios';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialIsLoggedIn,
}: {
  children: ReactNode;
  initialIsLoggedIn: boolean;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);

  const login = useCallback(() => setIsLoggedIn(true), []);

  /**
   * HttpOnly 쿠키는 JS의(document.cookie)로 지울 수 없기 때문에
   * 서버에 cookie 만료 API 요청을 해야 함
   */
  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('로그아웃 API 호출 실패', error);
    } finally {
      localStorage.clear();
      setIsLoggedIn(false);
      window.location.href = '/';
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용이 가능.');
  }

  return context;
}
