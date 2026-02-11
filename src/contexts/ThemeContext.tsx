import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const THEME_KEY = 'portfolio-theme'; // saved to localStorage for next visit

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (value: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

function parseStoredTheme(raw: string | null): Theme {
  if (raw === Theme.Light || raw === Theme.Dark) return raw;
  return Theme.Light;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      return parseStoredTheme(localStorage.getItem(THEME_KEY));
    } catch {
      return Theme.Light;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* noop */
    }
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]); // persist theme for next access

  const setTheme = (value: Theme) => setThemeState(value === Theme.Light ? Theme.Light : Theme.Dark);
  const toggleTheme = () => setThemeState((t) => (t === Theme.Dark ? Theme.Light : Theme.Dark));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
