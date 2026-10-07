import { useEffect, useState } from 'react';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import { SearchIcon } from '../../components/icons';
import NavigationHeader from '../../components/Header/NavigationHeader';
import { myServices } from '../../data/serviceData';

export default function Services() {
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

  const filtered = myServices.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className={`min-h-full pb-24 pt-3 transition-colors duration-200 ${
        isDark
          ? 'bg-[#101714]'
          : 'bg-[#F4F8F6]'
      }`}
    >
      <NavigationHeader />

      <div className="px-2">
        {/* Page Title */}
        <p
          className={`mb-4 text-[26px] font-bold ${
            isDark
              ? 'text-white'
              : 'text-black'
          }`}
        >
          My Services
        </p>

        {/* Search */}
        <div
          className={`mb-5 flex items-center gap-2 rounded-full px-4 py-5 ${
            isDark
              ? 'bg-[#3a3a3a]'
              : 'bg-white'
          }`}
        >
          <span
            className={
              isDark
                ? 'text-white/50'
                : 'text-black/50'
            }
          >
            <SearchIcon width={18} height={18} />
          </span>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Service..."
            className={`w-full bg-transparent text-[15px] outline-none ${
              isDark
                ? 'text-white placeholder:text-white/40'
                : 'text-black placeholder:text-black/40'
            }`}
          />
        </div>

        {/* Services */}
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((service) => {
            const Icon = service.icon;

            return (
              <ServiceCard
                key={service.id}
                variant={isDark ? 'dark' : 'light'}
                layout="column"
                className="justify-between"
                icon={<Icon size={26} />}
                label={service.label}
              />
            );
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <p
            className={`mt-10 text-center text-sm ${
              isDark
                ? 'text-white'
                : 'text-black'
            }`}
          >
            No services match your search.
          </p>
        )}
      </div>
    </div>
  );
}