import { useEffect, useState } from 'react';

import EmptyState from '../../components/EmptyState';
import { DocumentIcon } from '../../components/icons';
import SubPageHeader from '../../components/SubPageHeader';

export default function TravelRecord() {
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
            className={`min-h-screen pb-20 pt-3 transition-colors duration-200 ${isDark ? 'bg-[#101714]' : 'bg-[#F4F8F6]'
                }`}
        >
            <SubPageHeader title="" />
            {/* Empty State */}
            <div className="flex min-h-[calc(100vh-150px)] items-center justify-center px-4">
                <EmptyState
                    variant={isDark ? 'dark' : 'light'}
                    icon={<DocumentIcon width={64} height={64} />}
                    title="No Travel Record"
                    description="Once you have a travel record, the details will display here."
                />
            </div>
        </div>
    );
}