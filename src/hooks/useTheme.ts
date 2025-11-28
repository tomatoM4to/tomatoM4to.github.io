import { useState } from "react";

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

export function useTheme() {
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
  })

  function setTheme() {
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
  }

  return { theme, setTheme }
}