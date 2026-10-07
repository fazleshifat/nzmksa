import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CloseIcon, ChevronRight } from '../../components/icons';

export default function Settings() {
  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const e = user;

  const [biometrics, setBiometrics] = useState(true);
  const [blurImages, setBlurImages] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('en');

  // Load saved theme from localStorage
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('absher_theme');

    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  const [calendar, setCalendar] = useState<
    'gregorian' | 'hijri'
  >('gregorian');

  const isDark = theme === 'dark';

  /*
   * Save theme whenever it changes.
   *
   * This keeps the selected theme after:
   * - page refresh
   * - browser restart
   * - closing/reopening the Android APK
   */
  useEffect(() => {
    localStorage.setItem('absher_theme', theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!e) {
    return null;
  }

  return (
    <div
      className={`min-h-full pb-10 transition-colors duration-200 ${isDark
          ? 'bg-[#101714]'
          : 'bg-[#F4F8F6]'
        }`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-4 pb-3 pt-4">
        <button
          aria-label="Close"
          onClick={() => navigate(-1)}
          className={
            isDark
              ? 'text-white'
              : 'text-black'
          }
        >
          <CloseIcon
            width={24}
            height={24}
          />
        </button>

        <p
          className={`text-[19px] font-bold ${isDark
              ? 'text-white'
              : 'text-black'
            }`}
        >
          Settings
        </p>
      </div>

      <div className="px-4">

        {/* Account Details */}
        <SectionLabel isDark={isDark}>
          Account Details
        </SectionLabel>

        <div
          className={`overflow-hidden rounded-2xl shadow-sm ${isDark
              ? 'bg-[#18221E]'
              : 'bg-white'
            }`}
        >
          <div className="flex items-center gap-3 px-4 py-4">
            <img
              src={e.avatarUrl}
              alt={e.name}
              className="h-12 w-12 rounded-xl object-cover"
            />

            <div>
              <p
                className={`text-[16px] font-bold ${isDark
                    ? 'text-white'
                    : 'text-black'
                  }`}
              >
                {e.name}
              </p>

              <p
                className={`text-sm ${isDark
                    ? 'text-white/50'
                    : 'text-black/50'
                  }`}
              >
                ID No. {e.residentIdNumber}
              </p>
            </div>
          </div>

          <Divider isDark={isDark} />

          <PlainRow
            label="Absher Authenticator"
            isDark={isDark}
          />
        </div>

        {/* Privacy and Security */}
        <SectionLabel isDark={isDark}>
          Privacy and Security
        </SectionLabel>

        <div
          className={`overflow-hidden rounded-2xl shadow-sm ${isDark
              ? 'bg-[#18221E]'
              : 'bg-white'
            }`}
        >
          <PlainRow
            label="Trusted Devices"
            isDark={isDark}
          />

          <Divider isDark={isDark} />

          <ToggleRow
            label="Use Biometrics"
            description="Biometrics are required to access your Digital Documents while logged out, and allows you to stay logged in for longer."
            checked={biometrics}
            onChange={setBiometrics}
            isDark={isDark}
          />

          <Divider isDark={isDark} />

          <ToggleRow
            label="Blur images"
            description="All images for woman will be blurred and not fully visible."
            checked={blurImages}
            onChange={setBlurImages}
            isDark={isDark}
          />
        </div>

        {/* Preferences */}
        <SectionLabel isDark={isDark}>
          Preferences
        </SectionLabel>

        {/* Language */}
        <div
          className={`overflow-hidden rounded-2xl shadow-sm ${isDark
              ? 'bg-[#18221E]'
              : 'bg-white'
            }`}
        >
          <PlainRow
            label="Languages"
            isDark={isDark}
          />

          <RadioRow
            label="عربي"
            checked={language === 'ar'}
            onSelect={() => setLanguage('ar')}
            isDark={isDark}
          />

          <Divider isDark={isDark} />

          <RadioRow
            label="English"
            checked={language === 'en'}
            onSelect={() => setLanguage('en')}
            isDark={isDark}
          />
        </div>

        {/* Theme */}
        <div
          className={`mt-4 overflow-hidden rounded-2xl shadow-sm ${isDark
              ? 'bg-[#18221E]'
              : 'bg-white'
            }`}
        >
          <div className="px-4 pt-4">
            <p
              className={`text-[16px] font-bold ${isDark
                  ? 'text-white'
                  : 'text-black'
                }`}
            >
              Theme
            </p>

            <p
              className={`mt-1 text-[13px] ${isDark
                  ? 'text-white/50'
                  : 'text-black/50'
                }`}
            >
              Choose how the app should appear on your device
            </p>
          </div>

          <div className="pt-2">
            <RadioRow
              label="Light"
              checked={theme === 'light'}
              onSelect={() => setTheme('light')}
              isDark={isDark}
            />

            <Divider isDark={isDark} />

            <RadioRow
              label="Dark"
              checked={theme === 'dark'}
              onSelect={() => setTheme('dark')}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Calendar */}
        <div
          className={`mt-4 overflow-hidden rounded-2xl shadow-sm ${isDark
              ? 'bg-[#18221E]'
              : 'bg-white'
            }`}
        >
          <div className="px-4 pt-4">
            <p
              className={`text-[16px] font-bold ${isDark
                  ? 'text-white'
                  : 'text-black'
                }`}
            >
              Calendar
            </p>

            <p
              className={`mt-1 text-[13px] ${isDark
                  ? 'text-white/50'
                  : 'text-black/50'
                }`}
            >
              Where possible, all dates will be displayed as Gregorian
            </p>
          </div>

          <div className="pt-2">
            <RadioRow
              label="Gregorian"
              checked={calendar === 'gregorian'}
              onSelect={() =>
                setCalendar('gregorian')
              }
              isDark={isDark}
            />

            <Divider isDark={isDark} />

            <RadioRow
              label="Hijri"
              checked={calendar === 'hijri'}
              onSelect={() =>
                setCalendar('hijri')
              }
              isDark={isDark}
            />
          </div>
        </div>

        {/* Delete Digital Identity */}
        <button
          className={`mt-4 w-full rounded-2xl px-4 py-4 text-left text-[15px] font-bold shadow-sm active:opacity-70 ${isDark
              ? 'bg-[#18221E] text-red-400'
              : 'bg-white text-red-500'
            }`}
        >
          Delete Your Digital Identity
        </button>

        {/* Support */}
        <SectionLabel isDark={isDark}>
          Support
        </SectionLabel>

        <div
          className={`overflow-hidden rounded-2xl shadow-sm ${isDark
              ? 'bg-[#18221E]'
              : 'bg-white'
            }`}
        >
          <PlainRow
            label="Support Center"
            isDark={isDark}
          />

          <Divider isDark={isDark} />

          <PlainRow
            label="App Services Guide"
            isDark={isDark}
          />

          <Divider isDark={isDark} />

          <PlainRow
            label="Accessibility Guide"
            isDark={isDark}
          />

          <Divider isDark={isDark} />

          <PlainRow
            label="Live Chat"
            isDark={isDark}
          />

          <Divider isDark={isDark} />

          <PlainRow
            label="FAQs"
            isDark={isDark}
          />

          <Divider isDark={isDark} />

          <PlainRow
            label="Privacy Policy"
            isDark={isDark}
          />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`mt-8 w-full rounded-full border-2 py-3.5 text-[16px] font-bold active:opacity-70 ${isDark
              ? 'border-[#4FB88A] text-[#4FB88A]'
              : 'border-brand-green text-brand-green'
            }`}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Section Label */
/* ---------------------------------- */

function SectionLabel({
  children,
  isDark,
}: {
  children: string;
  isDark: boolean;
}) {
  return (
    <p
      className={`mb-2 mt-6 text-[12px] font-bold tracking-wide ${isDark
          ? 'text-white/40'
          : 'text-black/40'
        }`}
    >
      {children}
    </p>
  );
}

/* ---------------------------------- */
/* Divider */
/* ---------------------------------- */

function Divider({
  isDark,
}: {
  isDark: boolean;
}) {
  return (
    <div
      className={`mx-4 h-px ${isDark
          ? 'bg-white/[0.07]'
          : 'bg-black/[0.06]'
        }`}
    />
  );
}

/* ---------------------------------- */
/* Plain Row */
/* ---------------------------------- */

function PlainRow({
  label,
  isDark,
}: {
  label: string;
  isDark: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <span
        className={`text-[15px] font-semibold ${isDark
            ? 'text-white'
            : 'text-black'
          }`}
      >
        {label}
      </span>

      <span
        className={
          isDark
            ? 'text-white/30'
            : 'text-black/30'
        }
      >
        <ChevronRight
          width={18}
          height={18}
        />
      </span>
    </div>
  );
}

/* ---------------------------------- */
/* Radio Row */
/* ---------------------------------- */

function RadioRow({
  label,
  checked,
  onSelect,
  isDark,
}: {
  label: string;
  checked: boolean;
  onSelect: () => void;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      className="flex w-full items-center justify-between px-4 py-4 text-left"
    >
      <span
        className={`text-[15px] font-semibold ${isDark
            ? 'text-white'
            : 'text-black'
          }`}
      >
        {label}
      </span>

      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${checked
            ? 'border-brand-green'
            : isDark
              ? 'border-white/20'
              : 'border-black/20'
          }`}
      >
        {checked && (
          <span className="h-2.5 w-2.5 rounded-full bg-brand-green" />
        )}
      </span>
    </button>
  );
}

/* ---------------------------------- */
/* Toggle Row */
/* ---------------------------------- */

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  isDark,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  isDark: boolean;
}) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between">
        <span
          className={`text-[15px] font-semibold ${isDark
              ? 'text-white'
              : 'text-black'
            }`}
        >
          {label}
        </span>

        <button
          role="switch"
          aria-checked={checked}
          aria-label={label}
          onClick={() => onChange(!checked)}
          className={`h-7 w-12 rounded-full p-1 transition-colors ${checked
              ? 'bg-brand-green'
              : isDark
                ? 'bg-white/15'
                : 'bg-black/15'
            }`}
        >
          <span
            className={`block h-5 w-5 rounded-full bg-white transition-transform ${checked
                ? 'translate-x-5'
                : 'translate-x-0'
              }`}
          />
        </button>
      </div>

      <p
        className={`mt-2 text-[13px] leading-relaxed ${isDark
            ? 'text-white/50'
            : 'text-black/50'
          }`}
      >
        {description}
      </p>
    </div>
  );
}