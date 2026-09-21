import { useEffect, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { useNavigate, useLocation } from 'react-router-dom';

const useAndroidBackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const iqamaOpenRef = useRef(false);

    useEffect(() => {
        const handleIqamaOpen = () => {
            iqamaOpenRef.current = true;
        };

        const handleIqamaClose = () => {
            iqamaOpenRef.current = false;
        };

        window.addEventListener(
            'absher-iqama-open',
            handleIqamaOpen
        );

        window.addEventListener(
            'absher-iqama-close',
            handleIqamaClose
        );

        let listenerHandle:
            Awaited<ReturnType<typeof CapacitorApp.addListener>> | null =
            null;

        const setupBackButton = async () => {
            listenerHandle = await CapacitorApp.addListener(
                'backButton',
                ({ canGoBack }) => {
                    // 1. If Iqama viewer is open, close it first
                    if (iqamaOpenRef.current) {
                        window.dispatchEvent(
                            new CustomEvent('absher-close-iqama')
                        );
                        return;
                    }

                    // 2. Login → Welcome
                    if (location.pathname === '/login') {
                        navigate('/welcome', { replace: true });
                        return;
                    }

                    // 3. Welcome → exit the Android app
                    if (
                        location.pathname === '/' ||
                        location.pathname === '/welcome'
                    ) {
                        CapacitorApp.exitApp();
                        return;
                    }

                    // 4. Home → exit the Android app
                    if (location.pathname === '/home') {
                        CapacitorApp.exitApp();
                        return;
                    }

                    // 5. Other pages → go back normally
                    if (canGoBack) {
                        navigate(-1);
                        return;
                    }

                    // 6. Fallback
                    CapacitorApp.exitApp();
                }
            );
        };

        setupBackButton();

        return () => {
            window.removeEventListener(
                'absher-iqama-open',
                handleIqamaOpen
            );

            window.removeEventListener(
                'absher-iqama-close',
                handleIqamaClose
            );

            listenerHandle?.remove();
        };
    }, [navigate, location.pathname]);
};

export default useAndroidBackButton;