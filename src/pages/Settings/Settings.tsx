import { useState } from 'react';
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
  const [calendar, setCalendar] = useState<'gregorian' | 'hijri'>('gregorian');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!e) {
    return null;
  }

  return (
    <div className="min-h-full bg-[#F4F8F6] pb-10">
      <div className="flex items-center gap-4 px-4 pb-3 pt-4">
        <button
          aria-label="Close"
          onClick={() => navigate(-1)}
          className="text-black"
        >
          <CloseIcon width={24} height={24} />
        </button>

        <p className="text-[19px] font-bold text-black">
          Settings
        </p>
      </div>

      <div className="px-4">
        <SectionLabel>Account Details</SectionLabel>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex items-center gap-3 px-4 py-4">
            <img
              src={e.avatarUrl}
              alt={e.name}
              className="h-12 w-12 rounded-xl object-cover"
            />

            <div>
              <p className="text-[16px] font-bold text-black">
                {e.name}
              </p>

              <p className="text-sm text-black/50">
                ID No. {e.residentIdNumber}
              </p>
            </div>
          </div>

          <Divider />

          <PlainRow label="Absher Authenticator" />
        </div>

        <SectionLabel>Privacy and Security</SectionLabel>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <PlainRow label="Trusted Devices" />

          <Divider />

          <ToggleRow
            label="Use Biometrics"
            description="Biometrics are required to access your Digital Documents while logged out, and allows you to stay logged in for longer."
            checked={biometrics}
            onChange={setBiometrics}
          />

          <Divider />

          <ToggleRow
            label="Blur images"
            description="All images for woman will be blurred and not fully visible."
            checked={blurImages}
            onChange={setBlurImages}
          />
        </div>

        <SectionLabel>Preferences</SectionLabel>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <PlainRow label="Languages" />

          <RadioRow
            label="عربي"
            checked={language === 'ar'}
            onSelect={() => setLanguage('ar')}
          />

          <Divider />

          <RadioRow
            label="English"
            checked={language === 'en'}
            onSelect={() => setLanguage('en')}
          />
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="px-4 pt-4">
            <p className="text-[16px] font-bold text-black">
              Calendar
            </p>

            <p className="mt-1 text-[13px] text-black/50">
              Where possible, all dates will be displayed as Gregorian
            </p>
          </div>

          <div className="pt-2">
            <RadioRow
              label="Gregorian"
              checked={calendar === 'gregorian'}
              onSelect={() => setCalendar('gregorian')}
            />

            <Divider />

            <RadioRow
              label="Hijri"
              checked={calendar === 'hijri'}
              onSelect={() => setCalendar('hijri')}
            />
          </div>
        </div>

        <button className="mt-4 w-full rounded-2xl bg-white px-4 py-4 text-left text-[15px] font-bold text-red-500 shadow-sm active:opacity-70">
          Delete Your Digital Identity
        </button>

        <SectionLabel>Support</SectionLabel>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <PlainRow label="Support Center" />

          <Divider />

          <PlainRow label="App Services Guide" />

          <Divider />

          <PlainRow label="Accessibility Guide" />

          <Divider />

          <PlainRow label="Live Chat" />

          <Divider />

          <PlainRow label="FAQs" />

          <Divider />

          <PlainRow label="Privacy Policy" />
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full rounded-full border-2 border-brand-green py-3.5 text-[16px] font-bold text-brand-green active:opacity-70"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 mt-6 text-[12px] font-bold tracking-wide text-black/40">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="mx-4 h-px bg-black/[0.06]" />;
}

function PlainRow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <span className="text-[15px] font-semibold text-black">
        {label}
      </span>

      <span className="text-black/30">
        <ChevronRight width={18} height={18} />
      </span>
    </div>
  );
}

function RadioRow({
  label,
  checked,
  onSelect,
}: {
  label: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="flex w-full items-center justify-between px-4 py-4 text-left"
    >
      <span className="text-[15px] font-semibold text-black">
        {label}
      </span>

      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
          checked
            ? 'border-brand-green'
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

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-semibold text-black">
          {label}
        </span>

        <button
          role="switch"
          aria-checked={checked}
          aria-label={label}
          onClick={() => onChange(!checked)}
          className={`h-7 w-12 rounded-full p-1 transition-colors ${
            checked
              ? 'bg-brand-green'
              : 'bg-black/15'
          }`}
        >
          <span
            className={`block h-5 w-5 rounded-full bg-white transition-transform ${
              checked
                ? 'translate-x-5'
                : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <p className="mt-2 text-[13px] leading-relaxed text-black/50">
        {description}
      </p>
    </div>
  );
}