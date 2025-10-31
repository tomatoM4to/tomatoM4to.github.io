import { Link } from 'react-router';
import { useState } from 'react';

function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')}
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
