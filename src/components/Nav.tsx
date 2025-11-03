import { Link } from 'react-router';
import { useState } from 'react';

type Theme = 'light' | 'dark';

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme !== 'light' && currentTheme !== 'dark') {
      return 'light';
    }

    return currentTheme;
  })

  function toggleTheme() {
    setTheme((pre) => {
      const newTheme = pre === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);

      if (newTheme === 'light') {
        localStorage.removeItem('theme');
      }
      else {
        localStorage.setItem('theme', newTheme);
      }
      return newTheme;
    })
  }

  return { theme, toggleTheme };
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

function Logo() {
  return (
    <Link to='/' className='navbar-logo'>
      tomatoM4to
    </Link>
  )
}

export default function Nav() {
  return (
    <nav className='navbar'>
      <Logo />
      <div className='navbar-link'>
        <Link to='/tags'>태그</Link>
        <Link to='/search'>검색</Link>
        <ThemeToggle />
      </div>
    </nav>
  )
}
