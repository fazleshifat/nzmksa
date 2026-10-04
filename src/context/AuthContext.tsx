import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { App } from "@capacitor/app";
import { Preferences } from "@capacitor/preferences";

import {
  apiFetch,
  type Employee,
  type Admin,
  type AccountRole,
  type LoginResponse,
  type MeResponse,
} from "../api/api";

import {
  initializePasskey,
  registerPasskey as registerPasskeyService,
  loginWithPasskey as loginWithPasskeyService,
  getPasskeyStatus,
} from "../services/passkey";

// ============================================================================
// AUTH CONTEXT TYPES
// ============================================================================

interface AuthContextValue {
  loading: boolean;

  isAuthenticated: boolean;

  user: Employee | null;

  admin: Admin | null;

  role: AccountRole | null;

  /**
   * Whether the currently authenticated
   * account has at least one passkey.
   *
   * Works for:
   * - Employee
   * - Admin
   * - Super Admin
   */
  hasPasskey: boolean;

  /**
   * Password login.
   *
   * Employee:
   *   Resident ID
   *
   * Admin / Super Admin:
   *   Email
   */
  login: (
    idNumberOrEmail: string,
    password: string
  ) => Promise<boolean>;

  /**
   * Passkey login.
   *
   * Employee:
   *   Resident ID
   *
   * Admin / Super Admin:
   *   Email
   */
  loginWithPasskey: (
    identifier: string
  ) => Promise<boolean>;

  /**
   * Register a passkey for the
   * currently authenticated account.
   */
  registerPasskey: () => Promise<boolean>;

  /**
   * Logout current account.
   */
  logout: () => Promise<void>;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  );

// ============================================================================
// STORAGE KEYS
// ============================================================================

const TOKEN_KEY =
  "absher_token";

const USER_KEY =
  "absher_user_id";

const LOGIN_TIME_KEY =
  "absher_login_time";

const ROLE_KEY =
  "absher_role";

// ============================================================================
// SESSION
// ============================================================================

const SESSION_DURATION =
  24 * 60 * 60 * 1000;

// ============================================================================
// AUTH PROVIDER
// ============================================================================

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<Employee | null>(null);

  const [admin, setAdmin] =
    useState<Admin | null>(null);

  const [role, setRole] =
    useState<AccountRole | null>(null);

  const [hasPasskey, setHasPasskey] =
    useState(false);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  // ==========================================================================
  // CLEAR AUTH STATE
  // ==========================================================================

  const clearAuthState = () => {
    setUser(null);
    setAdmin(null);
    setRole(null);
    setHasPasskey(false);
    setIsAuthenticated(false);
  };

  // ==========================================================================
  // CLEAR STORED SESSION
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
  // SAVE SESSION
  // ==========================================================================

  const saveSession = async (
    token: string,
    identifier: string,
    accountRole: AccountRole
  ) => {
    await Preferences.set({
      key: TOKEN_KEY,
      value: token,
    });

    await Preferences.set({
      key: USER_KEY,
      value: identifier,
    });

    await Preferences.set({
      key: LOGIN_TIME_KEY,
      value: Date.now().toString(),
    });

    await Preferences.set({
      key: ROLE_KEY,
      value: accountRole,
    });
  };

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        /*
         * Initialize Capacitor Passkey before
         * restoring the authentication session.
         *
         * Android:
         *   Enables native WebAuthn bridge.
         *
         * Browser:
         *   Keeps normal browser WebAuthn.
         */
        await initializePasskey();
      } catch (error) {
        console.error(
          "PASSKEY INITIALIZATION ERROR:",
          error
        );
      }

      if (mounted) {
        await restoreSession();
      }
    };

    initialize();

    // ------------------------------------------------------------------------
    // Restore/check session when app becomes active again.
    // ------------------------------------------------------------------------

    const listenerPromise =
      App.addListener(
        "appStateChange",
        ({ isActive }) => {
          if (isActive && mounted) {
            restoreSession();
          }
        }
      );

    return () => {
      mounted = false;

      listenerPromise.then(
        (listener) => {
          listener.remove();
        }
      );
    };
  }, []);

  // ==========================================================================
  // RESTORE SESSION
  // ==========================================================================

  const restoreSession = async () => {
    try {
      const tokenResult =
        await Preferences.get({
          key: TOKEN_KEY,
        });

      const savedToken =
        tokenResult.value;

      // ----------------------------------------------------------------------
      // No saved token
      // ----------------------------------------------------------------------

      if (!savedToken) {
        clearAuthState();
        return;
      }

      // ----------------------------------------------------------------------
      // Check local 24-hour session
      // ----------------------------------------------------------------------

      const loginTimeResult =
        await Preferences.get({
          key: LOGIN_TIME_KEY,
        });

      const savedLoginTime =
        loginTimeResult.value;

      if (savedLoginTime) {
        const loginTime =
          Number(savedLoginTime);

        if (
          !Number.isFinite(loginTime)
        ) {
          await clearStoredSession();
          clearAuthState();
          return;
        }

        const elapsedTime =
          Date.now() - loginTime;

        if (
          elapsedTime >=
          SESSION_DURATION
        ) {
          await clearStoredSession();
          clearAuthState();
          return;
        }
      }

      // ----------------------------------------------------------------------
      // Verify token with backend
      // ----------------------------------------------------------------------

      const response =
        await apiFetch<
          MeResponse & {
            hasPasskey?: boolean;
          }
        >("/api/auth/me");

      // =========================================================================
      // SUPER ADMIN
      // =========================================================================

      if (
        response.role === "superadmin" &&
        response.admin
      ) {
        await Preferences.set({
          key: ROLE_KEY,
          value: "superadmin",
        });

        setUser(null);

        setAdmin(
          response.admin
        );

        setRole("superadmin");

        // Check passkey status.
        try {
          const passkeyStatus =
            await getPasskeyStatus();

          setHasPasskey(
            passkeyStatus.hasPasskey === true
          );
        } catch (error) {
          console.error(
            "SUPER ADMIN PASSKEY STATUS ERROR:",
            error
          );

          setHasPasskey(
            response.hasPasskey === true
          );
        }

        setIsAuthenticated(true);

        return;
      }

      // =========================================================================
      // ADMIN
      // =========================================================================

      if (
        response.role === "admin" &&
        response.admin
      ) {
        await Preferences.set({
          key: ROLE_KEY,
          value: "admin",
        });

        setUser(null);

        setAdmin(
          response.admin
        );

        setRole("admin");

        // Check passkey status.
        try {
          const passkeyStatus =
            await getPasskeyStatus();

          setHasPasskey(
            passkeyStatus.hasPasskey === true
          );
        } catch (error) {
          console.error(
            "ADMIN PASSKEY STATUS ERROR:",
            error
          );

          setHasPasskey(
            response.hasPasskey === true
          );
        }

        setIsAuthenticated(true);

        return;
      }

      // =========================================================================
      // EMPLOYEE
      // =========================================================================

      if (
        response.role === "user" &&
        response.user
      ) {
        await Preferences.set({
          key: ROLE_KEY,
          value: "user",
        });

        setAdmin(null);

        setUser(
          response.user
        );

        setRole("user");

        // Prefer /me response when available.
        if (
          response.hasPasskey !==
          undefined
        ) {
          setHasPasskey(
            response.hasPasskey === true
          );
        } else {
          try {
            const passkeyStatus =
              await getPasskeyStatus();

            setHasPasskey(
              passkeyStatus.hasPasskey === true
            );
          } catch (error) {
            console.error(
              "EMPLOYEE PASSKEY STATUS ERROR:",
              error
            );

            setHasPasskey(false);
          }
        }

        setIsAuthenticated(true);

        return;
      }

      // ----------------------------------------------------------------------
      // Invalid session response
      // ----------------------------------------------------------------------

      throw new Error(
        "Invalid session response"
      );
    } catch (error) {
      console.error(
        "RESTORE SESSION ERROR:",
        error
      );

      await clearStoredSession();

      clearAuthState();
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // PASSWORD LOGIN
  // ==========================================================================

  const login = async (
    idNumberOrEmail: string,
    password: string
  ): Promise<boolean> => {
    try {
      const identifier =
        idNumberOrEmail.trim();

      if (!identifier || !password) {
        return false;
      }

      const response =
        await apiFetch<
          LoginResponse & {
            hasPasskey?: boolean;
          }
        >(
          "/api/auth/login",
          {
            method: "POST",

            body: JSON.stringify({
              residentIdNumber:
                identifier,

              password,
            }),
          }
        );

      if (!response.token) {
        return false;
      }

      // =========================================================================
      // SUPER ADMIN PASSWORD LOGIN
      // =========================================================================

      if (
        response.role === "superadmin" &&
        response.admin
      ) {
        const adminIdentifier =
          response.admin.email;

        await saveSession(
          String(response.token),
          String(adminIdentifier),
          "superadmin"
        );

        setUser(null);

        setAdmin(
          response.admin
        );

        setRole("superadmin");

        let adminHasPasskey =
          response.hasPasskey === true;

        try {
          const passkeyStatus =
            await getPasskeyStatus();

          adminHasPasskey =
            passkeyStatus.hasPasskey === true;
        } catch (error) {
          console.error(
            "SUPER ADMIN PASSKEY STATUS AFTER LOGIN ERROR:",
            error
          );
        }

        setHasPasskey(
          adminHasPasskey
        );

        setIsAuthenticated(true);

        return true;
      }

      // =========================================================================
      // ADMIN PASSWORD LOGIN
      // =========================================================================

      if (
        response.role === "admin" &&
        response.admin
      ) {
        const adminIdentifier =
          response.admin.email;

        await saveSession(
          String(response.token),
          String(adminIdentifier),
          "admin"
        );

        setUser(null);

        setAdmin(
          response.admin
        );

        setRole("admin");

        let adminHasPasskey =
          response.hasPasskey === true;

        try {
          const passkeyStatus =
            await getPasskeyStatus();

          adminHasPasskey =
            passkeyStatus.hasPasskey === true;
        } catch (error) {
          console.error(
            "ADMIN PASSKEY STATUS AFTER LOGIN ERROR:",
            error
          );
        }

        setHasPasskey(
          adminHasPasskey
        );

        setIsAuthenticated(true);

        return true;
      }

      // =========================================================================
      // EMPLOYEE PASSWORD LOGIN
      // =========================================================================

      if (
        response.role === "user" &&
        response.user
      ) {
        const employeeIdentifier =
          response.user
            .residentIdNumber;

        await saveSession(
          String(response.token),
          String(employeeIdentifier),
          "user"
        );

        setAdmin(null);

        setUser(
          response.user
        );

        setRole("user");

        let employeeHasPasskey =
          response.hasPasskey === true;

        if (
          response.hasPasskey ===
          undefined
        ) {
          try {
            const passkeyStatus =
              await getPasskeyStatus();

            employeeHasPasskey =
              passkeyStatus.hasPasskey === true;
          } catch (error) {
            console.error(
              "EMPLOYEE PASSKEY STATUS AFTER LOGIN ERROR:",
              error
            );
          }
        }

        setHasPasskey(
          employeeHasPasskey
        );

        setIsAuthenticated(true);

        return true;
      }

      // ----------------------------------------------------------------------
      // Invalid response
      // ----------------------------------------------------------------------

      await clearStoredSession();
      clearAuthState();

      return false;
    } catch (error) {
      console.error(
        "PASSWORD LOGIN ERROR:",
        error
      );

      return false;
    }
  };

  // ==========================================================================
  // PASSKEY LOGIN
  // ==========================================================================

  const loginWithPasskey =
    async (
      identifier: string
    ): Promise<boolean> => {
      try {
        const cleanIdentifier =
          identifier.trim();

        if (!cleanIdentifier) {
          return false;
        }

        const response =
          await loginWithPasskeyService(
            cleanIdentifier
          );

        if (!response.token) {
          return false;
        }

        // =========================================================================
        // EMPLOYEE PASSKEY LOGIN
        // =========================================================================

        if (
          response.accountType ===
            "employee" &&
          response.role === "user" &&
          response.user
        ) {
          const employeeIdentifier =
            response.user
              .residentIdNumber;

          await saveSession(
            String(response.token),
            String(employeeIdentifier),
            "user"
          );

          setAdmin(null);

          setUser(
            response.user
          );

          setRole("user");

          /*
           * Successful passkey authentication
           * means this account has a passkey.
           */
          setHasPasskey(true);

          setIsAuthenticated(true);

          return true;
        }

        // =========================================================================
        // ADMIN PASSKEY LOGIN
        // =========================================================================

        if (
          response.accountType ===
            "admin" &&
          response.role === "admin" &&
          response.admin
        ) {
          const adminIdentifier =
            response.admin.email;

          await saveSession(
            String(response.token),
            String(adminIdentifier),
            "admin"
          );

          setUser(null);

          setAdmin(
            response.admin
          );

          setRole("admin");

          setHasPasskey(true);

          setIsAuthenticated(true);

          return true;
        }

        // =========================================================================
        // SUPER ADMIN PASSKEY LOGIN
        // =========================================================================

        if (
          response.accountType ===
            "admin" &&
          response.role ===
            "superadmin" &&
          response.admin
        ) {
          const adminIdentifier =
            response.admin.email;

          await saveSession(
            String(response.token),
            String(adminIdentifier),
            "superadmin"
          );

          setUser(null);

          setAdmin(
            response.admin
          );

          setRole("superadmin");

          setHasPasskey(true);

          setIsAuthenticated(true);

          return true;
        }

        // ----------------------------------------------------------------------
        // Invalid passkey response
        // ----------------------------------------------------------------------

        await clearStoredSession();
        clearAuthState();

        return false;
      } catch (error) {
        console.error(
          "PASSKEY LOGIN ERROR:",
          error
        );

        return false;
      }
    };

  // ==========================================================================
  // REGISTER PASSKEY
  // ==========================================================================

  const registerPasskey =
    async (): Promise<boolean> => {
      try {
        /*
         * Registration uses the currently
         * authenticated JWT.
         *
         * Supported:
         *
         * Employee
         * Admin
         * Super Admin
         */
        const response =
          await registerPasskeyService();

        const success =
          response.verified === true;

        if (success) {
          setHasPasskey(true);
        }

        return success;
      } catch (error) {
        console.error(
          "PASSKEY REGISTRATION ERROR:",
          error
        );

        return false;
      }
    };

  // ==========================================================================
  // LOGOUT
  // ==========================================================================

  const logout =
    async (): Promise<void> => {
      try {
        await apiFetch(
          "/api/auth/logout",
          {
            method: "POST",
          }
        );
      } catch (error) {
        console.error(
          "LOGOUT API ERROR:",
          error
        );
      } finally {
        await clearStoredSession();

        clearAuthState();
      }
    };

  // ==========================================================================
  // PROVIDER
  // ==========================================================================

  return (
    <AuthContext.Provider
      value={{
        loading,

        isAuthenticated,

        user,

        admin,

        role,

        hasPasskey,

        login,

        loginWithPasskey,

        registerPasskey,

        logout,
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
  const ctx =
    useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}