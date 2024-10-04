import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
  const darkThemeMediaQuery = useRef(
    window.matchMedia('(prefers-color-scheme: dark)')
  );
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const root = window.document.documentElement;

  const removeAllThemeClasses = useCallback(
    () => root.classList.remove('light', 'dark'),
    [root.classList]
  );

  const setThemeClass = useCallback(
    (themeClass: Exclude<Theme, 'system'>) => {
      root.classList.add(themeClass);
      root.style.setProperty('color-scheme', themeClass);
    },
    [root.classList, root.style]
  );

  const handleSystemThemeChange = useCallback(() => {
    removeAllThemeClasses();
    setThemeClass(darkThemeMediaQuery.current.matches ? 'dark' : 'light');
  }, [removeAllThemeClasses, setThemeClass]);

  const removeColorSchemePreferenceListener = useCallback(() => {
    darkThemeMediaQuery.current.removeEventListener(
      'change',
      handleSystemThemeChange
    );
  }, [handleSystemThemeChange]);

  useEffect(() => {
    if (theme === 'system') {
      handleSystemThemeChange();

      return darkThemeMediaQuery.current.addEventListener(
        'change',
        handleSystemThemeChange
      );
    }

    removeAllThemeClasses();
    removeColorSchemePreferenceListener();
    setThemeClass(theme);

    return removeColorSchemePreferenceListener;
  }, [
    darkThemeMediaQuery,
    handleSystemThemeChange,
    removeAllThemeClasses,
    removeColorSchemePreferenceListener,
    root.classList,
    setThemeClass,
    theme,
  ]);

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={{
        theme,
        setTheme: (theme: Theme) => {
          localStorage.setItem(storageKey, theme);
          setTheme(theme);
        },
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider!');

  return context;
};
