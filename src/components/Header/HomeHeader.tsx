import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoSettingsOutline } from 'react-icons/io5';
import { VscBell } from 'react-icons/vsc';

export default function HomeHeader({
  showSearch = false,
}: {
  showSearch?: boolean;
}) {
  const navigate = useNavigate();

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
      window.removeEventListener(
        'storage',
        handleThemeChange
      );
    };
  }, []);

  return (
    <div
      className={`flex items-center justify-between px-4 pt-3 pb-6 transition-colors duration-200 ${isDark
        ? 'bg-[#153A2B]'
        : 'bg-green-100'
        }`}
    >
      <div className="flex items-center gap-2">
        <img
          src={isDark ? '/logo3.png' : '/logo1.png'}
          className="w-10"
          alt="Logo"
        />

        <img
          src={isDark ? '/logo4.png' : '/logo2.png'}
          className="w-10"
          alt="Logo"
        />

      </div>

      <div className="flex items-center gap-5">
        {showSearch && (
          <button
            aria-label="Search"
            className={
              isDark
                ? 'text-white'
                : 'text-green-900'
            }
          >
            <IoSearch size={22} />
          </button>
        )}

        <button
          aria-label="Settings"
          className={
            isDark
              ? 'text-white'
              : 'text-green-900'
          }
          onClick={() => navigate('/settings')}
        >
          <IoSettingsOutline size={22} />
        </button>

        <button
          aria-label="Notifications"
          className={
            isDark
              ? 'text-white'
              : 'text-green-900'
          }
        >
          <VscBell size={22} />
        </button>
      </div>
    </div>
  );
}