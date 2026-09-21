import { useNavigate } from 'react-router-dom';
import { VscBell } from 'react-icons/vsc';
import { IoSettingsOutline } from 'react-icons/io5';

export default function NavigationHeader() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-end px-2">
            <div className="flex items-center gap-5">
                <button
                    aria-label="Settings"
                    className="text-green-600"
                    onClick={() => navigate('/settings')}
                >
                    <IoSettingsOutline size={22}/>
                </button>

                <button
                    aria-label="Notifications"
                    className="text-green-600"
                >
                    <VscBell size={22} />
                </button>
            </div>
        </div>
    );
}