import { useEffect, useState } from 'react';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import { SearchIcon } from '../../components/icons';
import NavigationHeader from '../../components/Header/NavigationHeader';
import { MdModeEdit } from 'react-icons/md';
import { otherServices } from '../../data/serviceData';

export default function Other() {
  const [query, setQuery] = useState('');

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

  const filtered = otherServices.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  );

  const preferred = filtered.slice(0, 2);
  const rest = filtered.slice(2);

  return (
    <div
      className={`min-h-full pb-24 pt-3 ${isDark ? 'bg-[#101714]' : 'bg-[#F4F8F6]'
        }`}
    >
      <NavigationHeader />

      <div className="px-2">
        <p
          className={`mb-4 text-[26px] font-bold ${isDark ? 'text-white' : 'text-black'
            }`}
        >
          Other Services
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Service"
            className={`w-full bg-transparent text-[15px] outline-none ${isDark
                ? 'text-white placeholder:text-white/40'
                : 'text-black placeholder:text-black/40'
              }`}
          />
        </div>
      </div>

      {preferred.length > 0 && (
        <div
          className={`px-2 py-5 ${isDark ? 'bg-brand-green' : 'bg-green-100'
            }`}
        >
          <p
            className={`mb-3 text-[17px] font-bold ${isDark ? 'text-white' : 'text-green-950'
              }`}
          >
            Preferred Services
          </p>

          <div className="grid grid-cols-2 gap-3">
            {preferred.map((service) => {
              const Icon = service.icon;

              return (
                <ServiceCard
                  variant={isDark ? 'dark' : 'light'}
                  key={service.id}
                  icon={<Icon size={26} />}
                  label={service.label}
                  className={`h-full justify-between ${isDark ? 'bg-black/80!' : 'bg-white!'
                    }`}
                />
              );
            })}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-2 gap-3 px-2 pt-4">
          {rest.map((service) => {
            const Icon = service.icon;

            return (
              <ServiceCard
                key={service.id}
                variant={isDark ? 'dark' : 'light'}
                icon={<Icon size={26} />}
                label={service.label}
                className="h-full justify-between"
              />
            );
          })}
        </div>
      )}

      <div
        className={`flex items-center justify-center gap-1 pb-10 pt-5 text-sm font-semibold ${isDark ? 'text-gray-500' : 'text-gray-600'
          }`}
      >
        <MdModeEdit size={16} />
        <p>Personalise Space</p>
      </div>
    </div>
  );
}