'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

interface LoginModalContextType {
  isModalOpen: boolean;
  openLoginAlertModal: () => void;
  closeLoginAlertModal: () => void;
}

const LoginAlertModalContext = createContext<LoginModalContextType | undefined>(
  undefined,
);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openLoginAlertModal = useCallback(() => setIsModalOpen(true), []);
  const closeLoginAlertModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <LoginAlertModalContext.Provider
      value={{ isModalOpen, openLoginAlertModal, closeLoginAlertModal }}
    >
      {children}
    </LoginAlertModalContext.Provider>
  );
}

export function useLoginAlertModal() {
  const context = useContext(LoginAlertModalContext);

  if (context === undefined) {
    throw new Error(
      'useLoginModal은 LoginModalProvider 내부에서만 사용 가능함',
    );
  }

  return context;
}
