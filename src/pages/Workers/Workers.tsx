import { useEffect, useState } from 'react';
import EmptyState from '../../components/EmptyState';
import NavigationHeader from '../../components/Header/NavigationHeader';
import { SearchIcon, WorkersIcon } from '../../components/icons';

export default function Workers() {
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

  return (
    <div
      className={`min-h-full pb-20 pt-3 ${isDark ? 'bg-[#101714]' : 'bg-[#F4F8F6]'
        }`}
    >
      <NavigationHeader />

      <div className="px-2">
        <p
          className={`mb-4 text-[26px] font-bold ${isDark ? 'text-white' : 'text-black'
            }`}
        >
          Workers
        </p>

        <div
          className={`mb-5 flex items-center gap-2 rounded-full px-4 py-5 ${isDark ? 'bg-[#3a3a3a]' : 'bg-white'
            }`}
        >
          <span
            className={
              isDark ? 'text-white/50' : 'text-black/50'
            }
          >
            <SearchIcon width={18} height={18} />
          </span>

          <input
            placeholder="Search by name, ID"
            className={`w-full bg-transparent text-[15px] outline-none ${isDark
                ? 'text-white placeholder:text-white/40'
                : 'text-black placeholder:text-black/40'
              }`}
          />
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-190px)] items-center justify-center px-4">
        <EmptyState
          variant={isDark ? 'dark' : 'light'}
          icon={<WorkersIcon width={64} height={64} />}
          title="No Workers"
          description="Once you have workers under your sponsorship they will display here."
        />
      </div>
    </div>
  );
}