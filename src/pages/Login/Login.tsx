import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import { useNavigate } from 'react-router-dom';

import { Preferences } from '@capacitor/preferences';

import {
  Fingerprint,
  X,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

import { ChevronLeft } from '../../components/icons';

import PasskeyLoginButton from '../../components/PasskeyLoginButton';

import { getPasskeyStatus } from '../../services/passkey';

const LAST_LOGIN_IDENTIFIER_KEY =
  'absher_last_login_identifier';

export default function Login() {
  const [idNumber, setIdNumber] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [keepLoggedIn, setKeepLoggedIn] =
    useState(true);

  const [error, setError] =
    useState('');

  const [isLoggingIn, setIsLoggingIn] =
    useState(false);

  const [
    isSettingUpPasskey,
    setIsSettingUpPasskey,
  ] = useState(false);

  const [
    showPasskeySetup,
    setShowPasskeySetup,
  ] = useState(false);

  const {
    login,
    registerPasskey,
    role,
  } = useAuth();

  const navigate = useNavigate();

  // ==========================================================================
  // LOAD LAST LOGIN IDENTIFIER
  // ==========================================================================

  useEffect(() => {
    const loadLastLoginIdentifier =
      async () => {
        try {
          const result =
            await Preferences.get({
              key: LAST_LOGIN_IDENTIFIER_KEY,
            });

          if (result.value) {
            setIdNumber(
              result.value
            );
          }
        } catch (error) {
          console.error(
            'FAILED TO LOAD LAST LOGIN IDENTIFIER:',
            error
          );
        }
      };

    loadLastLoginIdentifier();
  }, []);

  // ==========================================================================
  // SAVE LAST LOGIN IDENTIFIER
  // ==========================================================================

  const saveLastLoginIdentifier =
    async (
      identifier: string
    ) => {
      const cleanIdentifier =
        identifier.trim();

      if (!cleanIdentifier) {
        return;
      }

      try {
        await Preferences.set({
          key: LAST_LOGIN_IDENTIFIER_KEY,
          value: cleanIdentifier,
        });
      } catch (error) {
        console.error(
          'FAILED TO SAVE LAST LOGIN IDENTIFIER:',
          error
        );
      }
    };

  // ==========================================================================
  // GET DASHBOARD ROUTE
  // ==========================================================================

  const getDashboardRoute = (
    accountRole:
      | 'user'
      | 'admin'
      | 'superadmin'
      | null
      | undefined
  ) => {
    if (
      accountRole === 'admin' ||
      accountRole === 'superadmin'
    ) {
      return '/admin';
    }

    return '/home';
  };

  // ==========================================================================
  // PASSWORD LOGIN
  // ==========================================================================

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setError('');

    if (
      isLoggingIn ||
      isSettingUpPasskey
    ) {
      return;
    }

    const cleanIdentifier =
      idNumber.trim();

    if (!cleanIdentifier) {
      setError(
        'Please enter your ID number or email.'
      );

      return;
    }

    if (!password) {
      setError(
        'Please enter your password.'
      );

      return;
    }

    setIsLoggingIn(true);

    try {
      // ----------------------------------------------------------------------
      // LOGIN
      // ----------------------------------------------------------------------

      const success =
        await login(
          cleanIdentifier,
          password
        );

      if (!success) {
        setError(
          'Incorrect ID number or password.'
        );

        return;
      }

      // ----------------------------------------------------------------------
      // Save the account identifier
      // ----------------------------------------------------------------------

      await saveLastLoginIdentifier(
        cleanIdentifier
      );

      // ----------------------------------------------------------------------
      // Read the role directly from Preferences.
      // This avoids relying on asynchronous React state.
      // ----------------------------------------------------------------------

      const roleResult =
        await Preferences.get({
          key: 'absher_role',
        });

      const loggedInRole =
        roleResult.value;

      if (
        loggedInRole !== 'user' &&
        loggedInRole !== 'admin' &&
        loggedInRole !== 'superadmin'
      ) {
        setError(
          'Unable to determine your account type.'
        );

        return;
      }

      // ======================================================================
      // FIX #1
      //
      // Do NOT use the old `hasPasskey` React state here.
      //
      // Immediately ask the backend for the REAL current passkey status.
      // ======================================================================

      let accountHasPasskey = false;

      try {
        const passkeyStatus =
          await getPasskeyStatus();

        accountHasPasskey =
          passkeyStatus.hasPasskey;

        console.log(
          'PASSKEY: Current backend status:',
          passkeyStatus
        );
      } catch (passkeyStatusError) {
        console.error(
          'PASSKEY: Failed to check passkey status:',
          passkeyStatusError
        );

        /*
         * Login itself succeeded.
         *
         * If the status request fails, do NOT incorrectly show
         * "Set Up Passkey" because we cannot confirm that a passkey
         * is missing.
         *
         * Simply continue to the dashboard.
         */

        navigate(
          getDashboardRoute(
            loggedInRole as
              | 'user'
              | 'admin'
              | 'superadmin'
          ),
          {
            replace: true,
          }
        );

        return;
      }

      // ======================================================================
      // EXISTING PASSKEY
      // ======================================================================

      if (accountHasPasskey) {
        console.log(
          'PASSKEY: Passkey already exists. Skipping setup.'
        );

        navigate(
          getDashboardRoute(
            loggedInRole as
              | 'user'
              | 'admin'
              | 'superadmin'
          ),
          {
            replace: true,
          }
        );

        return;
      }

      // ======================================================================
      // NO PASSKEY
      //
      // Only now show the setup popup.
      // ======================================================================

      console.log(
        'PASSKEY: No passkey found. Showing setup.'
      );

      setShowPasskeySetup(true);

    } catch (error) {
      console.error(
        'LOGIN FAILED:',
        error
      );

      setError(
        'Unable to log in. Please try again.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // ==========================================================================
  // PASSKEY LOGIN SUCCESS
  // ==========================================================================

  const handlePasskeySuccess =
    async () => {
      setError('');

      await saveLastLoginIdentifier(
        idNumber
      );

      const roleResult =
        await Preferences.get({
          key: 'absher_role',
        });

      const loggedInRole =
        roleResult.value;

      if (
        loggedInRole === 'user' ||
        loggedInRole === 'admin' ||
        loggedInRole === 'superadmin'
      ) {
        navigate(
          getDashboardRoute(
            loggedInRole
          ),
          {
            replace: true,
          }
        );

        return;
      }

      setError(
        'Unable to determine your account type.'
      );
    };

  // ==========================================================================
  // PASSKEY LOGIN ERROR
  // ==========================================================================

  const handlePasskeyError =
    (message: string) => {
      setError(message);
    };

  // ==========================================================================
  // SET UP PASSKEY
  // ==========================================================================

  const handleSetupPasskey =
    async () => {
      setError('');

      if (
        isSettingUpPasskey ||
        isLoggingIn
      ) {
        return;
      }

      setIsSettingUpPasskey(true);

      try {
        console.log(
          'PASSKEY: Starting passkey registration for role:',
          role
        );

        const success =
          await registerPasskey();

        console.log(
          'PASSKEY: registerPasskey returned',
          success
        );

        if (!success) {
          setError(
            'Unable to set up passkey. Please try again.'
          );

          return;
        }

        // --------------------------------------------------------------------
        // Registration succeeded.
        // --------------------------------------------------------------------

        setShowPasskeySetup(false);

        navigate(
          getDashboardRoute(role),
          {
            replace: true,
          }
        );

      } catch (error) {
        console.error(
          'PASSKEY SETUP ERROR:',
          error
        );

        if (
          error instanceof Error &&
          error.message
        ) {
          setError(
            error.message
          );
        } else {
          setError(
            'Unable to set up passkey. Please try again.'
          );
        }
      } finally {
        setIsSettingUpPasskey(false);
      }
    };

  // ==========================================================================
  // SKIP PASSKEY SETUP
  // ==========================================================================

  const handleMaybeLater =
    () => {
      if (
        isSettingUpPasskey
      ) {
        return;
      }

      setShowPasskeySetup(false);

      setError('');

      navigate(
        getDashboardRoute(role),
        {
          replace: true,
        }
      );
    };

  // ==========================================================================
  // UI
  // ==========================================================================

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col bg-[#F4F8F6] px-4 pt-6 pb-4">

      {/* ================================================================== */}
      {/* Back */}
      {/* ================================================================== */}

      <button
        type="button"
        aria-label="Back"
        onClick={() =>
          navigate('/', {
            replace: true,
          })
        }
        disabled={
          isLoggingIn ||
          isSettingUpPasskey
        }
        className="flex h-11 w-11 items-center justify-center rounded-full text-brand-green active:bg-black/5 disabled:opacity-50"
      >
        <ChevronLeft
          width={26}
          height={26}
        />
      </button>

      {/* ================================================================== */}
      {/* Logo + Title */}
      {/* ================================================================== */}

      <div className="flex flex-col items-center pt-5">

        <div className="flex items-end gap-[3px]">

          <img
            src="/logo1.png"
            alt="Absher"
            className="h-18 w-18"
          />

          <img
            src="/logo2.png"
            alt=""
            className="h-18 w-18"
          />

        </div>

        <p className="mt-10 text-2xl font-bold tracking-tight text-black">
          Log In to Absher
        </p>

      </div>

      {/* ================================================================== */}
      {/* Form */}
      {/* ================================================================== */}

      <form
        onSubmit={handleSubmit}
        className="mt-9 flex flex-1 flex-col gap-4"
      >

        {/* ================================================================ */}
        {/* Username / ID */}
        {/* ================================================================ */}

        <div>

          <label className="mb-2 block text-[13px] font-semibold text-black/60">
            Username or ID Number
          </label>

          <input
            value={idNumber}
            onChange={(e) => {
              setIdNumber(
                e.target.value
              );

              setError('');
            }}
            inputMode="text"
            autoComplete="username"
            placeholder="Enter Username or ID Number"
            disabled={
              isLoggingIn ||
              isSettingUpPasskey
            }
            className="h-14 w-full rounded-2xl bg-white px-4 text-[15px] text-black outline-none ring-brand-green/40 placeholder:text-black/35 focus:ring-2 disabled:opacity-60"
          />

        </div>

        {/* ================================================================ */}
        {/* Password + Passkey */}
        {/* ================================================================ */}

        <div>

          <label className="mb-2 block text-[13px] font-semibold text-black/60">
            Password
          </label>

          <div className="relative">

            <input
              value={password}
              onChange={(e) => {
                setPassword(
                  e.target.value
                );

                setError('');
              }}
              type="password"
              autoComplete="current-password"
              placeholder="Enter Password"
              disabled={
                isLoggingIn ||
                isSettingUpPasskey
              }
              className="h-14 w-full rounded-2xl bg-white pl-4 pr-14 text-[15px] text-black outline-none ring-brand-green/40 placeholder:text-black/35 focus:ring-2 disabled:opacity-60"
            />

            <PasskeyLoginButton
              identifier={idNumber}
              disabled={
                isLoggingIn ||
                isSettingUpPasskey
              }
              onSuccess={
                handlePasskeySuccess
              }
              onError={
                handlePasskeyError
              }
            />

          </div>

        </div>

        {/* ================================================================ */}
        {/* Keep Logged In */}
        {/* ================================================================ */}

        <button
          type="button"
          onClick={() =>
            setKeepLoggedIn(
              (value) => !value
            )
          }
          disabled={
            isLoggingIn ||
            isSettingUpPasskey
          }
          className="flex min-h-11 items-center gap-2.5 text-left active:opacity-70 disabled:opacity-50"
        >

          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
              keepLoggedIn
                ? 'border-brand-green bg-brand-green'
                : 'border-black/25 bg-transparent'
            }`}
          >

            {keepLoggedIn && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
              >
                <path d="m5 13 4 4L19 7" />
              </svg>
            )}

          </span>

          <span className="text-[14px] font-medium text-black/70">
            Keep me logged in
          </span>

        </button>

        {/* ================================================================ */}
        {/* Error */}
        {/* ================================================================ */}

        {error && (
          <p className="text-center text-sm text-red-500">
            {error}
          </p>
        )}

        {/* ================================================================ */}
        {/* Bottom Actions */}
        {/* ================================================================ */}

        <div className="mt-auto pb-1 pt-8">

          <button
            type="submit"
            disabled={
              isLoggingIn ||
              isSettingUpPasskey
            }
            className="h-14 w-full rounded-full bg-green-800/70 text-[16px] font-bold text-white shadow-sm active:scale-[0.99] active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingIn
              ? 'Logging In...'
              : 'Log In'}
          </button>

          <button
            type="button"
            disabled={
              isLoggingIn ||
              isSettingUpPasskey
            }
            className="mt-4 flex min-h-11 w-full items-center justify-center text-[14px] font-semibold text-brand-green active:opacity-60 disabled:opacity-50"
          >
            Forgot Password
          </button>

        </div>
      </form>

      {/* ================================================================== */}
      {/* PASSKEY SETUP MOBILE-SIZED OVERLAY */}
      {/* ================================================================== */}

      {showPasskeySetup && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-end
            justify-center
            pointer-events-auto
          "
          role="presentation"
        >

          {/* ================================================================ */}
          {/* MOBILE-SIZED APP OVERLAY */}
          {/* ================================================================ */}

          <div
            className="
              relative
              flex
              h-[min(100dvh,844px)]
              w-[min(100%,420px)]
              flex-col
              justify-end
              overflow-hidden
              bg-black/40
              backdrop-blur-[2px]
            "
          >

            {/* ============================================================ */}
            {/* Bottom Sheet */}
            {/* ============================================================ */}

            <div
              className="
                w-full
                animate-[passkeySheetUp_280ms_ease-out]
                rounded-t-[30px]
                bg-white
                px-5
                pb-[calc(20px+env(safe-area-inset-bottom))]
                pt-3
                shadow-2xl
              "
              role="dialog"
              aria-modal="true"
              aria-labelledby="passkey-setup-title"
            >

              {/* ======================================================== */}
              {/* Handle + Close */}
              {/* ======================================================== */}

              <div className="relative flex h-9 items-center justify-center">

                <span className="h-1 w-10 rounded-full bg-black/15" />

                <button
                  type="button"
                  aria-label="Close"
                  onClick={
                    handleMaybeLater
                  }
                  disabled={
                    isSettingUpPasskey
                  }
                  className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full text-black/45 active:bg-black/5 disabled:opacity-40"
                >
                  <X size={19} />
                </button>

              </div>

              {/* ======================================================== */}
              {/* Icon */}
              {/* ======================================================== */}

              <div className="mt-1 flex justify-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">

                  <Fingerprint
                    size={30}
                    strokeWidth={1.9}
                    className="text-brand-green"
                  />

                </div>

              </div>

              {/* ======================================================== */}
              {/* Title */}
              {/* ======================================================== */}

              <h2
                id="passkey-setup-title"
                className="mt-3 text-center text-[20px] font-bold tracking-tight text-black"
              >
                Set Up Passkey
              </h2>

              {/* ======================================================== */}
              {/* Description */}
              {/* ======================================================== */}

              <p className="mt-1.5 text-center text-[13px] leading-5 text-black/50">
                Use your device security
                for faster sign-in.
              </p>

              {/* ======================================================== */}
              {/* Set Up Button */}
              {/* ======================================================== */}

              <button
                type="button"
                onClick={
                  handleSetupPasskey
                }
                disabled={
                  isSettingUpPasskey
                }
                className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-green-800/70 text-[15px] font-bold text-white shadow-sm active:scale-[0.99] active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <Fingerprint
                  size={20}
                  strokeWidth={2.2}
                />

                <span>
                  {isSettingUpPasskey
                    ? 'Setting Up...'
                    : 'Set Up Passkey'}
                </span>

              </button>

              {/* ======================================================== */}
              {/* Maybe Later */}
              {/* ======================================================== */}

              <button
                type="button"
                onClick={
                  handleMaybeLater
                }
                disabled={
                  isSettingUpPasskey
                }
                className="mt-1 flex h-10 w-full items-center justify-center text-[13px] font-semibold text-brand-green active:opacity-60 disabled:opacity-40"
              >
                Maybe Later
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================================================================== */}
      {/* Bottom Sheet Animation */}
      {/* ================================================================== */}

      <style>
        {`
          @keyframes passkeySheetUp {
            from {
              transform: translateY(100%);
            }

            to {
              transform: translateY(0);
            }
          }
        `}
      </style>

    </div>
  );
}