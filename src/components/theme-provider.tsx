import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const root = window.document.documentElement;

  const removeAllThemeClasses = useCallback(
    () => root.classList.remove('light', 'dark'),
    [root.classList]
  );

  const handleSystemThemeChange = useCallback(() => {
    removeAllThemeClasses();

    root.classList.add(darkThemeMediaQuery.matches ? 'dark' : 'light');
  }, [darkThemeMediaQuery.matches, removeAllThemeClasses, root.classList]);

  useEffect(() => {
    removeAllThemeClasses();

    if (theme === 'system') {
      handleSystemThemeChange();

      darkThemeMediaQuery.addEventListener('change', handleSystemThemeChange);

      return;
    }

    darkThemeMediaQuery.removeEventListener('change', handleSystemThemeChange);
    root.classList.add(theme);

    return () =>
      darkThemeMediaQuery.removeEventListener(
        'change',
        handleSystemThemeChange
      );
  }, [
    darkThemeMediaQuery,
    handleSystemThemeChange,
    removeAllThemeClasses,
    root.classList,
    theme,
  ]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
