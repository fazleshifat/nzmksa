import { useEffect, useState } from 'react';
import SubPageHeader from '../../components/SubPageHeader';
import EmptyState from '../../components/EmptyState';
import { DocumentIcon } from '../../components/icons';

export default function DrivingLicense() {
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
            className={`flex min-h-screen flex-col ${isDark ? 'bg-black' : 'bg-[#F4F8F6]'
                }`}
        >
            <SubPageHeader title="" />

            <div className="flex flex-1 items-center justify-center px-4">
                <EmptyState
                    variant={isDark ? 'dark' : 'light'}
                    icon={<DocumentIcon width={64} height={64} />}
                    title="No Driving License"
                    description="Once you have a Driving License, the details will display here."
                />
            </div>
        </div>
    );
}