import { createContext, ReactNode, useCallback, useState, useMemo } from "react";

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

type ThemeContextType = {
  theme: Theme;
  setTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, _setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return Theme.Light;
    }
    const isDark = document.documentElement.classList.contains('dark');
    return isDark ? Theme.Dark : Theme.Light;
  });

  const setTheme = useCallback(() => {
    _setTheme((pre) => {
      const newTheme: Theme = pre === Theme.Light ? Theme.Dark : Theme.Light;
      if (newTheme === Theme.Dark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.removeItem('theme');
      }
      return newTheme;
    })
  }, []);

  const value = useMemo(() =>{
    return { theme, setTheme }
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}