import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';

import {
  apiFetch,
  type Employee,
  type Admin,
  type AccountRole,
  type LoginResponse,
  type MeResponse,
} from '../api/api';

// ============================================================================
// AUTH CONTEXT TYPE
// ============================================================================

interface AuthContextValue {
  loading: boolean;
  isAuthenticated: boolean;

  user: Employee | null;
  admin: Admin | null;

  role: AccountRole | null;

  login: (
    idNumberOrEmail: string,
    password: string
  ) => Promise<boolean>;

  logout: () => Promise<void>;
}

// ============================================================================
// CREATE CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

// ============================================================================
// STORAGE KEYS
// ============================================================================

const TOKEN_KEY = 'absher_token';
const USER_KEY = 'absher_user_id';
const LOGIN_TIME_KEY = 'absher_login_time';
const ROLE_KEY = 'absher_role';

// ============================================================================
// SESSION DURATION
// ============================================================================

const SESSION_DURATION = 24 * 60 * 60 * 1000;

// ============================================================================
// AUTH PROVIDER
// ============================================================================

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<Employee | null>(null);

  const [admin, setAdmin] = useState<Admin | null>(null);

  const [role, setRole] = useState<AccountRole | null>(null);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [loading, setLoading] = useState(true);

  // ==========================================================================
  // RESTORE SESSION ON APP START
  // ==========================================================================

  useEffect(() => {
    restoreSession();

    const listenerPromise = App.addListener(
      'appStateChange',
      ({ isActive }) => {
        if (isActive) {
          restoreSession();
        }
      }
    );

    return () => {
      listenerPromise.then((listener) => {
        listener.remove();
      });
    };
  }, []);

  // ==========================================================================
  // RESTORE SESSION
  // ==========================================================================

  const restoreSession = async () => {
    try {
      // ----------------------------------------------------------------------
      // Get saved token
      // ----------------------------------------------------------------------

      const tokenResult = await Preferences.get({
        key: TOKEN_KEY,
      });

      const savedToken = tokenResult.value;

      // ----------------------------------------------------------------------
      // No saved token
      // ----------------------------------------------------------------------

      if (!savedToken) {
        setUser(null);
        setAdmin(null);
        setRole(null);
        setIsAuthenticated(false);

        return;
      }

      // ----------------------------------------------------------------------
      // Get saved login time
      // ----------------------------------------------------------------------

      const loginTimeResult = await Preferences.get({
        key: LOGIN_TIME_KEY,
      });

      const savedLoginTime = loginTimeResult.value;

      // ----------------------------------------------------------------------
      // Check local session age
      // ----------------------------------------------------------------------

      if (savedLoginTime) {
        const loginTime = Number(savedLoginTime);

        if (!Number.isFinite(loginTime)) {
          await clearStoredSession();

          setUser(null);
          setAdmin(null);
          setRole(null);
          setIsAuthenticated(false);

          return;
        }

        const elapsedTime =
          Date.now() - loginTime;

        if (elapsedTime >= SESSION_DURATION) {
          await clearStoredSession();

          setUser(null);
          setAdmin(null);
          setRole(null);
          setIsAuthenticated(false);

          return;
        }
      }

      // ----------------------------------------------------------------------
      // Verify JWT with backend
      // ----------------------------------------------------------------------

      const response = await apiFetch<MeResponse>(
        '/api/auth/me'
      );

      // ----------------------------------------------------------------------
      // Restore admin / superadmin session
      // ----------------------------------------------------------------------

      if (
        (
          response.role === 'admin' ||
          response.role === 'superadmin'
        ) &&
        response.admin
      ) {
        await Preferences.set({
          key: ROLE_KEY,
          value: response.role,
        });

        setUser(null);
        setAdmin(response.admin);
        setRole(response.role);
        setIsAuthenticated(true);

        return;
      }

      // ----------------------------------------------------------------------
      // Restore normal user session
      // ----------------------------------------------------------------------

      if (
        response.role === 'user' &&
        response.user
      ) {
        await Preferences.set({
          key: ROLE_KEY,
          value: 'user',
        });

        setAdmin(null);
        setUser(response.user);
        setRole('user');
        setIsAuthenticated(true);

        return;
      }

      // ----------------------------------------------------------------------
      // Invalid session response
      // ----------------------------------------------------------------------

      throw new Error(
        'Invalid session response'
      );

    } catch (error) {
      await clearStoredSession();

      setUser(null);
      setAdmin(null);
      setRole(null);
      setIsAuthenticated(false);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // LOGIN
  // ==========================================================================

  const login = async (
    idNumberOrEmail: string,
    password: string
  ): Promise<boolean> => {
    try {
      // ----------------------------------------------------------------------
      // Backend login
      // ----------------------------------------------------------------------

      const response =
        await apiFetch<LoginResponse>(
          '/api/auth/login',
          {
            method: 'POST',

            body: JSON.stringify({
              residentIdNumber:
                idNumberOrEmail.trim(),

              password,
            }),
          }
        );

      // ----------------------------------------------------------------------
      // Validate token
      // ----------------------------------------------------------------------

      if (!response.token) {
        return false;
      }

      // ----------------------------------------------------------------------
      // Save JWT
      // ----------------------------------------------------------------------

      await Preferences.set({
        key: TOKEN_KEY,
        value: response.token,
      });

      // ----------------------------------------------------------------------
      // Save account identifier
      // ----------------------------------------------------------------------

      const accountIdentifier =
        response.role === 'admin' ||
          response.role === 'superadmin'
          ? response.admin?.email
          : response.user?.residentIdNumber;

      if (!accountIdentifier) {
        await clearStoredSession();

        return false;
      }

      await Preferences.set({
        key: USER_KEY,
        value: accountIdentifier,
      });

      // ----------------------------------------------------------------------
      // Save login time
      // ----------------------------------------------------------------------

      await Preferences.set({
        key: LOGIN_TIME_KEY,
        value: Date.now().toString(),
      });

      // ----------------------------------------------------------------------
      // Admin / Super Admin login
      // ----------------------------------------------------------------------

      if (
        (
          response.role === 'admin' ||
          response.role === 'superadmin'
        ) &&
        response.admin
      ) {
        await Preferences.set({
          key: ROLE_KEY,
          value: response.role,
        });

        setUser(null);
        setAdmin(response.admin);
        setRole(response.role);
        setIsAuthenticated(true);

        return true;
      }

      // ----------------------------------------------------------------------
      // User login
      // ----------------------------------------------------------------------

      if (
        response.role === 'user' &&
        response.user
      ) {
        await Preferences.set({
          key: ROLE_KEY,
          value: 'user',
        });

        setAdmin(null);
        setUser(response.user);
        setRole('user');
        setIsAuthenticated(true);

        return true;
      }

      // ----------------------------------------------------------------------
      // Invalid account response
      // ----------------------------------------------------------------------

      await clearStoredSession();

      return false;

    } catch (error) {
      return false;
    }
  };

  // ==========================================================================
  // LOGOUT
  // ==========================================================================

  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await clearStoredSession();

      setUser(null);
      setAdmin(null);
      setRole(null);
      setIsAuthenticated(false);
    }
  };

  // ==========================================================================
  // CLEAR SESSION
  // ==========================================================================

  const clearStoredSession = async () => {
    await Preferences.remove({
      key: TOKEN_KEY,
    });

    await Preferences.remove({
      key: USER_KEY,
    });

    await Preferences.remove({
      key: LOGIN_TIME_KEY,
    });

    await Preferences.remove({
      key: ROLE_KEY,
    });
  };

  // ==========================================================================
  // PROVIDER
  // ==========================================================================

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        admin,
        role,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================================
// USE AUTH
// ============================================================================

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return ctx;
}