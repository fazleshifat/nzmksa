import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  GlobeIcon,
  IdCardIcon,
  DocumentIcon,
  CarIcon,
  CopyIcon,
} from '../../components/icons';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('absher_theme');

    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem('absher_theme');

      setTheme(savedTheme === 'dark' ? 'dark' : 'light');
    };

    window.addEventListener('storage', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  const { user } = useAuth();

  const e = user;

  if (!e) {
    return null;
  }

  const handleCopy = async () => {
    if (!e.residentIdNumber) return;

    try {
      await navigator.clipboard.writeText(e.residentIdNumber);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy resident ID number:', error);
    }
  };

  return (
    <div
      className={`min-h-full pb-10 ${isDark ? 'bg-black' : 'bg-[#F4F8F6]'
        }`}
    >
      {/* Header */}
      <div
        className={`mb-8 pb-10 pt-4 ${isDark
            ? 'bg-gradient-to-b from-brand-green to-brand-green-dark'
            : 'bg-gradient-to-b from-green-200 to-green-50'
          }`}
      >
        <div className="flex items-center gap-4 px-4">
          <button
            aria-label="Back"
            onClick={() => navigate(-1)}
            className={isDark ? 'text-white' : 'text-green-900'}
          >
            <ChevronLeft width={26} height={26} />
          </button>

          <p
            className={`text-[19px] font-bold ${isDark ? 'text-white' : 'text-green-900'
              }`}
          >
            My Profile
          </p>
        </div>
      </div>

      <div className="-mt-14 px-4">
        {/* Profile Card */}
        <div
          className={`rounded-2xl p-4 text-center ${isDark ? 'bg-[#2a2a2a]' : 'bg-white'
            }`}
        >
          <div className="mt-2 flex flex-col items-center">
            <img
              src={e.avatarUrl}
              alt={e.name}
              className="h-24 w-24 rounded-2xl border-2 border-white/20 object-cover"
            />
          </div>

          <p
            className={`text-[19px] font-bold ${isDark ? 'text-white' : 'text-black'
              }`}
          >
            {e.name}
          </p>

          <div
            className={`mt-1 flex items-center justify-center gap-2 ${isDark ? 'text-white/50' : 'text-black/80'
              }`}
          >
            <p className="text-sm">
              ID No. {e.residentIdNumber}
            </p>

            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy resident ID number"
              className={`cursor-pointer transition-colors ${isDark
                  ? 'text-white/50 hover:text-brand-mint'
                  : 'text-black/50 hover:text-brand-green'
                }`}
            >
              {copied ? (
                <CheckIcon />
              ) : (
                <CopyIcon width={15} height={15} />
              )}
            </button>
          </div>

          {/* Personal Details */}
          <button
            onClick={() => navigate('/profile/personal-details')}
            className={`mt-4 flex w-full items-center justify-center gap-1 text-[15px] font-bold ${isDark ? 'text-white' : 'text-green-900'
              }`}
          >
            My Personal Details
            <ChevronRight width={18} height={18} />
          </button>
        </div>

        {/* Passport / Resident ID */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <ProfileTile
            isDark={isDark}
            icon={<GlobeIcon width={26} height={26} />}
            label="My Passport"
            onClick={() => navigate('/profile/passport')}
          />

          <ProfileTile
            isDark={isDark}
            icon={<IdCardIcon width={26} height={26} />}
            label="My Resident ID"
            onClick={() => navigate('/profile/resident-id')}
          />
        </div>

        {/* Visa / Driving License */}
        <div
          className={`mt-3 overflow-hidden rounded-2xl ${isDark ? 'bg-[#2a2a2a]' : 'bg-white'
            }`}
        >
          <RowTile
            isDark={isDark}
            icon={<DocumentIcon width={22} height={22} />}
            label="My Visa"
            onClick={() => navigate('/profile/visa')}
          />

          <div
            className={`mx-4 h-px ${isDark ? 'bg-white/10' : 'bg-black/10'
              }`}
          />

          <RowTile
            isDark={isDark}
            icon={<IdCardIcon width={22} height={22} />}
            label="My Driving License"
            onClick={() => navigate('/profile/driving-license')}
          />
        </div>

        {/* Travel Records */}
        <button
          onClick={() => navigate('/profile/travel-record')}
          className="mt-3 block w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 p-5 text-left"
        >
          <span className="inline-block rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white">
            Inside Kingdom
          </span>

          <p className="mt-8 text-[19px] font-bold text-black/90">
            My Travel Records
          </p>

          <p className="text-[13px] text-black/70">
            Find your last trips details
          </p>
        </button>

        {/* Labor Importations */}
        <div
          className={`mt-3 overflow-hidden rounded-2xl ${isDark ? 'bg-[#2a2a2a]' : 'bg-white'
            }`}
        >
          <RowTile
            isDark={isDark}
            icon={<CarIcon width={22} height={22} />}
            label="Labor Importations"
            onClick={() => navigate('/profile/labor-importance')}
          />
        </div>
      </div>
    </div>
  );
}

function ProfileTile({
  icon,
  label,
  onClick,
  isDark,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start gap-3 rounded-2xl p-4 text-left ${isDark ? 'bg-[#2a2a2a]' : 'bg-white'
        }`}
    >
      <span className="text-brand-mint">
        {icon}
      </span>

      <span
        className={`text-[15px] font-semibold ${isDark ? 'text-white' : 'text-black'
          }`}
      >
        {label}
      </span>
    </button>
  );
}

function RowTile({
  icon,
  label,
  onClick,
  isDark,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-4 text-left"
    >
      <span className="text-brand-mint">
        {icon}
      </span>

      <span
        className={`text-[15px] font-semibold ${isDark ? 'text-white' : 'text-black'
          }`}
      >
        {label}
      </span>
    </button>
  );
}

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.5l4 4L19 7" />
    </svg>
  );
}