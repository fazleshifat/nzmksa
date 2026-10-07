import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

import { Preferences } from '@capacitor/preferences';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
    setTheme: (theme: Theme) => Promise<void>;
    toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined
);

const THEME_KEY = 'absher_theme';

export function ThemeProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [theme, setThemeState] = useState<Theme>('light');

    /*
     * Load saved theme when the app starts.
     */
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const { value } = await Preferences.get({
                    key: THEME_KEY,
                });

                if (value === 'dark' || value === 'light') {
                    setThemeState(value);
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
            }
        };

        loadTheme();
    }, []);

    /*
     * Apply theme to the document.
     *
     * This makes the theme available globally and also
     * gives us the option to use dark-mode CSS later.
     */
    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
        }
    }, [theme]);

    /*
     * Change and save theme.
     */
    const setTheme = async (newTheme: Theme) => {
        try {
            setThemeState(newTheme);

            await Preferences.set({
                key: THEME_KEY,
                value: newTheme,
            });
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    /*
     * Toggle between light and dark.
     */
    const toggleTheme = async () => {
        const newTheme: Theme =
            theme === 'light' ? 'dark' : 'light';

        await setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                isDark: theme === 'dark',
                setTheme,
                toggleTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            'useTheme must be used inside ThemeProvider'
        );
    }

    return context;
}