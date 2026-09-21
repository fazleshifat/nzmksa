import { useNavigate } from 'react-router-dom';
import { IoSearch, IoSettingsOutline } from 'react-icons/io5';
import { VscBell } from 'react-icons/vsc';

export default function HomeHeader({ showSearch = false }: { showSearch?: boolean }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between bg-green-100 px-4 pt-3 pb-6">
      <div className="flex items-center gap-2">
        <img src="/logo1.png" className='w-10' />
        <img src="/logo2.png" className='w-10' />
      </div>

      <div className="flex items-center gap-5">
        {showSearch && (
          <button
            aria-label="Search"
            className="text-green-900"
          >
            <IoSearch size={22} />
          </button>
        )}

        <button
          aria-label="Settings"
          className="text-green-900"
          onClick={() => navigate('/settings')}
        >
          <IoSettingsOutline size={22} />
        </button>

        <button
          aria-label="Notifications"
          className="text-green-900"
        >
          <VscBell size={22} />
        </button>
      </div>
    </div>
  );
}