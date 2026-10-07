import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import IqamaViewer from '../../components/IqamaViewer/IqamaViewer';
import { GiPistolGun, GiPoliceCar } from 'react-icons/gi';
import { FaCar, FaMap } from 'react-icons/fa';
import { IoFingerPrintSharp } from 'react-icons/io5';
import { RxAvatar } from 'react-icons/rx';
import { AiFillMessage } from 'react-icons/ai';
import HomeHeader from '../../components/Header/HomeHeader';
import { useAuth } from '../../context/AuthContext';

export default function Home() {
  const [viewerOpen, setViewerOpen] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('absher_theme');

    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  const navigate = useNavigate();

  const { user } = useAuth();

  const e = user;

  const isDark = theme === 'dark';

  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem('absher_theme');

      setTheme(savedTheme === 'dark' ? 'dark' : 'light');
    };

    window.addEventListener('storage', handleThemeChange);

    return () => {
      window.removeEventListener(
        'storage',
        handleThemeChange
      );
    };
  }, []);

  if (!e) {
    return null;
  }

  return (
    <div
      className={`min-h-full pb-14 transition-colors duration-200 ${isDark
          ? 'bg-[#101714]'
          : 'bg-[#F4F8F6]'
        }`}
    >
      {/* Header */}
      <div className="pb-12">
        <HomeHeader showSearch />
      </div>

      {/* Profile */}
      <div className="-mt-15 mb-6 px-4">
        <button
          onClick={() => navigate('/profile')}
          className={`min-w-full flex items-center gap-3 rounded-2xl p-3 text-left shadow-sm active:opacity-80 ${isDark
              ? 'bg-[#18221E]'
              : 'bg-white'
            }`}
        >
          <img
            src={e.avatarUrl}
            alt={e.name}
            className="h-14 w-14 rounded-xl object-cover"
          />

          <div>
            <p
              className={`text-[17px] font-bold ${isDark
                  ? 'text-white'
                  : 'text-black'
                }`}
            >
              {e.name}
            </p>

            <p
              className={`text-sm ${isDark
                  ? 'text-white/70'
                  : 'text-black'
                }`}
            >
              ID No.: {e.residentIdNumber}
            </p>
          </div>
        </button>
      </div>

      <div className="px-4">

        {/* Survey */}
        <div
          className={`flex gap-4 rounded-2xl p-3 ${isDark
              ? 'bg-[#18372A]'
              : 'bg-green-700/25'
            }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-900/80 text-white">
            <AiFillMessage size={25} />
          </div>

          <div className="flex min-h-10 flex-1 flex-col">
            <p
              className={`text-[15px] font-bold ${isDark
                  ? 'text-white'
                  : 'text-black/90'
                }`}
            >
              Take a Quick Survey
            </p>

            <p
              className={`text-[13px] leading-relaxed ${isDark
                  ? 'text-white/65'
                  : 'text-green-900'
                }`}
            >
              Share your experience with Absher to help us improve.
            </p>

            <button
              type="button"
              className={`mt-2 self-end text-[13px] font-bold ${isDark
                  ? 'text-[#4FB88A]'
                  : 'text-green-800'
                }`}
            >
              Start Survey
            </button>
          </div>
        </div>

        {/* Digital Documents */}
        <div className="pt-6">
          <p
            className={`mb-3 text-[19px] font-bold ${isDark
                ? 'text-white'
                : 'text-black'
              }`}
          >
            My Digital Documents
          </p>

          <button
            onClick={() => {
              setViewerOpen(true);

              window.dispatchEvent(
                new CustomEvent('absher-iqama-open')
              );
            }}
            className={`w-full overflow-hidden rounded-2xl transition-transform ${isDark
                ? 'bg-[#18221E]'
                : 'bg-white'
              }`}
            aria-label="Open Resident ID document viewer"
          >
            <img
              src={user?.iqamaImage}
              alt="Iqama ID"
              className="w-full min-h-30 object-contain"
            />
          </button>
        </div>
      </div>

      {/* Quick Access */}
      <div
        className={`mt-8 p-4 pb-12 ${isDark
            ? 'bg-[#153A2B]'
            : 'bg-green-100'
          }`}
      >
        <p
          className={`mb-4 text-[19px] font-bold ${isDark
              ? 'text-white'
              : 'text-black'
            }`}
        >
          Quick Access
        </p>

        <ServiceCard
          layout="row"
          variant={isDark ? 'dark' : 'light'}
          icon={<FaCar size={24} />}
          label="My Vehicles"
          description="View details, renew documents, report accidents and much more."
          onClick={() => navigate('/services')}
        />

        <div className="mt-3 grid grid-cols-2 gap-3">
          <ServiceCard
            variant={isDark ? 'dark' : 'light'}
            icon={<IoFingerPrintSharp size={24} />}
            label="Authentication Services"
            onClick={() => navigate('/services')}
          />

          <ServiceCard
            variant={isDark ? 'dark' : 'light'}
            icon={<FaMap size={24} />}
            label="Abshser Travel"
            onClick={() => navigate('/other')}
            className="justify-between"
          />

          <ServiceCard
            variant={isDark ? 'dark' : 'light'}
            icon={<GiPoliceCar size={24} />}
            label="Report Minor Accident"
            onClick={() => navigate('/other')}
          />

          <ServiceCard
            variant={isDark ? 'dark' : 'light'}
            icon={<RxAvatar size={24} />}
            label="Update Resident Photo"
            onClick={() => navigate('/other')}
          />
        </div>

        <ServiceCard
          layout="row"
          variant={isDark ? 'dark' : 'light'}
          className="mt-5"
          icon={<GiPistolGun size={24} />}
          label="My Weapons"
          description="View weapons details, issue and view carry permints."
          onClick={() => navigate('/other')}
        />
      </div>

      {/* Iqama Viewer */}
      <IqamaViewer
        open={viewerOpen}
        onClose={() => {
          setViewerOpen(false);

          window.dispatchEvent(
            new CustomEvent('absher-iqama-close')
          );
        }}
      />
    </div>
  );
}