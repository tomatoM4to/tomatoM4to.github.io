import { Link } from 'react-router';
import { Button } from '@src/ui/button';
import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className='mt-auto pt-24 pb-12 border-t border-border'>
      <div className='flex flex-col items-center gap-6'>
        <div className='flex gap-2'>
          <Button variant="ghost" size="sm" asChild>
            <a href="https://github.com/tomatoM4to" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="https://github.com/tomatoM4to/tomatoM4to.github.io" target="_blank" rel="noopener noreferrer">
              Repo
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/license">License</Link>
          </Button>
        </div>
        <p className='text-sm text-muted-foreground'>
          © {new Date().getFullYear()} tomatoM4to. Code is Open Source.
        </p>
      </div>
    </footer>
  )
}
