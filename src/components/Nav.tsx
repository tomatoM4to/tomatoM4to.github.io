import { Link } from 'react-router';
import { useTheme } from '@src/hooks/useTheme';
import { useMount } from '@src/hooks/useMount';
import { Theme } from '@src/context/Theme';
import { Button } from '@src/ui/button';
import { Moon, Sun, Tag, Search } from 'lucide-react';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { isMount } = useMount();

  if (!isMount) {
    return <Button variant="ghost" size="icon" className="h-9 w-9" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={setTheme}
      aria-label={`Switch to ${theme === Theme.Light ? Theme.Dark : Theme.Light} mode`}
      title={`Switch to ${theme === Theme.Light ? Theme.Dark : Theme.Light} mode`}
      className="h-9 w-9"
    >
      {theme === Theme.Light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
}

function Logo() {
  return (
    <Link to='/' className='text-xl font-semibold tracking-tight hover:text-primary'>
      tomatoM4to
    </Link>
  )
}

export default function Nav() {
  return (
    <nav className='flex justify-between items-center pt-12 pb-12 mb-16'>
      <Logo />
      <div className='flex gap-1 items-center'>
        <Button variant="ghost" size="sm" asChild>
          <Link to='/tags' className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">태그</span>
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to='/search' className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">검색</span>
          </Link>
        </Button>
        <ThemeToggle />
      </div>
    </nav>
  )
}
