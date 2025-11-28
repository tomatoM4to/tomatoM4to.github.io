import { Link } from 'react-router';
import { Theme, useTheme } from '@src/hooks/useTheme';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      className="theme-toggle"
      onClick={setTheme}
      aria-label={`Switch to ${theme === Theme.Light ? Theme.Dark : Theme.Light} mode`}
      title={`Switch to ${theme === Theme.Light ? Theme.Dark : Theme.Light} mode`}
    >
      {theme === Theme.Light ? '🌙' : '☀️'}
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
