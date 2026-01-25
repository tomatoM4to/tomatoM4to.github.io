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
    const currentTheme: string | null = document.documentElement.getAttribute('data-theme');
    switch (currentTheme) {
      case Theme.Light:
        return Theme.Light;
      case Theme.Dark:
        return Theme.Dark;
      default:
        return Theme.Light;
    }
  });

  const setTheme = useCallback(() => {
    _setTheme((pre) => {
      const newTheme: Theme = pre === Theme.Light ? Theme.Dark : Theme.Light;
      document.documentElement.setAttribute('data-theme', newTheme);
      switch (newTheme) {
        case Theme.Light:
          localStorage.removeItem('theme');
          break;
        case Theme.Dark:
          localStorage.setItem('theme', newTheme);
          break;
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