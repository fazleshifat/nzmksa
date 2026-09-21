import { NavLink } from 'react-router-dom';
import { HomeIcon, ServicesIcon, FamilyIcon, WorkersIcon, OtherIcon } from '../icons';

const items = [
  { to: '/home', label: 'Home', Icon: HomeIcon },
  { to: '/services', label: 'Services', Icon: ServicesIcon },
  { to: '/family', label: 'Family', Icon: FamilyIcon },
  { to: '/workers', label: 'Workers', Icon: WorkersIcon },
  { to: '/other', label: 'Other', Icon: OtherIcon },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 mx-auto max-w-md border-t border-white/10 bg-[#3a3a3a]/95 backdrop-blur safe-bottom">
      <ul className="flex items-stretch justify-between px-1">
        {items.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium ${
                  isActive ? 'text-brand-mint' : 'text-white/70'
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
