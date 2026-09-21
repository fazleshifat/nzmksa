import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (idNumber: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Demo credentials — swap for a real Express + MongoDB auth call later.
const DEMO_ID_NUMBER = '2456789012';
const DEMO_PASSWORD = 'Aa123456';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem('absher_demo_auth') === 'true'
  );

  const login = (idNumber: string, password: string) => {
    const ok = idNumber === DEMO_ID_NUMBER && password === DEMO_PASSWORD;
    if (ok) {
      localStorage.setItem('absher_demo_auth', 'true');
      setIsAuthenticated(true);
    }
    return ok;
  };

  const logout = () => {
    localStorage.removeItem('absher_demo_auth');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
