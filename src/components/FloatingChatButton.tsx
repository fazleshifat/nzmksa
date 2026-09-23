import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AiOutlineMessage } from 'react-icons/ai';

export default function FloatingChatButton() {
    const location = useLocation();

    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated || role === 'admin') {
        return null;
    }

    const pathname = location.pathname.toLowerCase();

    const hiddenRoutes = [
        '/admin',
        '/iqama',
        '/qr',
    ];

    const shouldHide = hiddenRoutes.some((route) =>
        pathname.includes(route)
    );

    if (shouldHide) {
        return null;
    }

    return (
        <button
            type="button"
            aria-label="Open chat"
            className="
        fixed
        bottom-24
        right-1/2
        z-[100]
        flex
        h-14
        w-14
        -translate-x-[calc(-50%+174px)]
        items-center
        justify-center
        rounded-full
        bg-[#197653]
        text-white
        shadow-lg
        shadow-black/20
        transition-transform
        active:scale-90
      "
        >
            <AiOutlineMessage size={26}/>
        </button>
    );
}