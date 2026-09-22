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
  type LoginResponse,
  type MeResponse,
} from '../api/api';

// ============================================================================
// AUTH CONTEXT TYPE
// ============================================================================

interface AuthContextValue {
  loading: boolean;
  isAuthenticated: boolean;
  employee: Employee | null;

  login: (
    idNumber: string,
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
const EMPLOYEE_KEY = 'absher_employee_id';
const LOGIN_TIME_KEY = 'absher_login_time';

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
  const [employee, setEmployee] =
    useState<Employee | null>(null);

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
          console.log('ABSher: App resumed');
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
      console.log('ABSher: Restoring session...');

      const tokenResult = await Preferences.get({
        key: TOKEN_KEY,
      });

      const savedToken = tokenResult.value;

      const employeeResult = await Preferences.get({
        key: EMPLOYEE_KEY,
      });

      const savedEmployeeId = employeeResult.value;

      const loginTimeResult = await Preferences.get({
        key: LOGIN_TIME_KEY,
      });

      const savedLoginTime = loginTimeResult.value;

      console.log(
        'ABSher: Saved employee ID:',
        savedEmployeeId
      );

      console.log(
        'ABSher: Saved login time:',
        savedLoginTime
      );

      console.log(
        'ABSher: Token exists:',
        Boolean(savedToken)
      );

      // ----------------------------------------------------------------------
      // No saved token
      // ----------------------------------------------------------------------

      if (!savedToken) {
        console.log(
          'ABSher: No saved authentication token'
        );

        setEmployee(null);
        setIsAuthenticated(false);

        return;
      }

      // ----------------------------------------------------------------------
      // Check local session age
      // ----------------------------------------------------------------------

      if (savedLoginTime) {
        const loginTime = Number(savedLoginTime);

        if (!Number.isFinite(loginTime)) {
          console.log(
            'ABSher: Invalid login timestamp'
          );

          await clearStoredSession();

          setEmployee(null);
          setIsAuthenticated(false);

          return;
        }

        const elapsedTime =
          Date.now() - loginTime;

        console.log(
          'ABSher: Session age:',
          elapsedTime,
          'ms'
        );

        console.log(
          'ABSher: Remaining session:',
          SESSION_DURATION - elapsedTime,
          'ms'
        );

        if (elapsedTime >= SESSION_DURATION) {
          console.log(
            'ABSher: Local session expired'
          );

          await clearStoredSession();

          setEmployee(null);
          setIsAuthenticated(false);

          return;
        }
      }

      // ----------------------------------------------------------------------
      // Verify JWT with backend
      // ----------------------------------------------------------------------

      console.log(
        'ABSher: Verifying session with backend...'
      );

      const response = await apiFetch<MeResponse>(
        '/api/auth/me'
      );

      if (!response.employee) {
        throw new Error(
          'Employee data missing from session response'
        );
      }

      // ----------------------------------------------------------------------
      // Session valid
      // ----------------------------------------------------------------------

      console.log(
        'ABSher: Session restored for:',
        response.employee.name
      );

      setEmployee(response.employee);
      setIsAuthenticated(true);

    } catch (error) {
      console.error(
        'ABSher: Session restore failed:',
        error
      );

      await clearStoredSession();

      setEmployee(null);
      setIsAuthenticated(false);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // LOGIN
  // ==========================================================================

  const login = async (
    idNumber: string,
    password: string
  ): Promise<boolean> => {
    try {
      console.log(
        'ABSher: Logging in:',
        idNumber
      );

      // ----------------------------------------------------------------------
      // Backend login
      // ----------------------------------------------------------------------

      const response = await apiFetch<LoginResponse>(
        '/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({
            residentIdNumber: idNumber.trim(),
            password,
          }),
        }
      );

      // ----------------------------------------------------------------------
      // Validate response
      // ----------------------------------------------------------------------

      if (
        !response.token ||
        !response.employee
      ) {
        console.error(
          'ABSher: Invalid login response'
        );

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
      // Save employee ID
      // ----------------------------------------------------------------------

      await Preferences.set({
        key: EMPLOYEE_KEY,
        value: response.employee.residentIdNumber,
      });

      // ----------------------------------------------------------------------
      // Save login time
      // ----------------------------------------------------------------------

      await Preferences.set({
        key: LOGIN_TIME_KEY,
        value: Date.now().toString(),
      });

      // ----------------------------------------------------------------------
      // Verify storage
      // ----------------------------------------------------------------------

      const verifyToken =
        await Preferences.get({
          key: TOKEN_KEY,
        });

      const verifyEmployee =
        await Preferences.get({
          key: EMPLOYEE_KEY,
        });

      const verifyLoginTime =
        await Preferences.get({
          key: LOGIN_TIME_KEY,
        });

      console.log(
        'ABSher: Login saved:',
        {
          token: Boolean(verifyToken.value),
          employee: verifyEmployee.value,
          loginTime: verifyLoginTime.value,
        }
      );

      // ----------------------------------------------------------------------
      // Update application state
      // ----------------------------------------------------------------------

      setEmployee(response.employee);
      setIsAuthenticated(true);

      console.log(
        'ABSher: Login successful for:',
        response.employee.name
      );

      return true;

    } catch (error) {
      console.error(
        'ABSher: Login failed:',
        error
      );

      return false;
    }
  };

  // ==========================================================================
  // LOGOUT
  // ==========================================================================

  const logout = async () => {
    console.log(
      'ABSher: Logging out'
    );

    await clearStoredSession();

    setEmployee(null);
    setIsAuthenticated(false);
  };

  // ==========================================================================
  // CLEAR SESSION
  // ==========================================================================

  const clearStoredSession = async () => {
    await Preferences.remove({
      key: TOKEN_KEY,
    });

    await Preferences.remove({
      key: EMPLOYEE_KEY,
    });

    await Preferences.remove({
      key: LOGIN_TIME_KEY,
    });

    // Keep localStorage clean too
    // localStorage.removeItem(TOKEN_KEY);

    console.log(
      'ABSher: Stored session cleared'
    );
  };

  // ==========================================================================
  // PROVIDER
  // ==========================================================================

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        employee,
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
