import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ServicesIcon,
  FamilyIcon,
  WorkersIcon,
  OtherIcon,
} from '../icons';

const items = [
  { to: '/home', label: 'Home', Icon: HomeIcon },
  { to: '/services', label: 'Services', Icon: ServicesIcon },
  { to: '/family', label: 'Family', Icon: FamilyIcon },
  { to: '/workers', label: 'Workers', Icon: WorkersIcon },
  { to: '/other', label: 'Other', Icon: OtherIcon },
];

export default function BottomNav() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('absher_theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem('absher_theme');
      setTheme(savedTheme === 'dark' ? 'dark' : 'light');
    };

    window.addEventListener('storage', handleThemeChange);

    const interval = setInterval(handleThemeChange, 300);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      clearInterval(interval);
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-30 mx-auto max-w-md border-t backdrop-blur safe-bottom ${isDark
          ? 'border-white/10 bg-[#3a3a3a]/95'
          : 'border-[#DCE8E3] bg-[#F4F8F6]/95'
        }`}
    >
      <ul className="flex items-stretch justify-between px-1">
        {items.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium ${isActive
                  ? 'text-brand-mint'
                  : isDark
                    ? 'text-white/70'
                    : 'text-[#60736B]'
                }`
              }
            >
              <Icon width={22} height={22} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}