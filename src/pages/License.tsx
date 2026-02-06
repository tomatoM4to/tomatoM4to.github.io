import { useHead } from '@src/hooks/useHead';
import { SITE_NAME, SITE_DOMAIN } from '@src/shared/common';

interface Dependency {
  name: string;
  version: string;
  type: 'dependency' | 'devDependency';
  url?: string;
}

const dependencies: Dependency[] = [
  { name: 'react', version: '^19.1.1', type: 'dependency', url: 'https://react.dev' },
  { name: 'react-dom', version: '^19.1.1', type: 'dependency', url: 'https://react.dev' },
  { name: 'react-router', version: '^7.9.4', type: 'dependency', url: 'https://reactrouter.com' },
  { name: 'vite', version: '^7.1.5', type: 'devDependency', url: 'https://vitejs.dev' },
  { name: 'typescript', version: '~5.9.2', type: 'devDependency', url: 'https://www.typescriptlang.org' },
  { name: 'express', version: '^5.1.0', type: 'dependency', url: 'https://expressjs.com' },
  { name: 'react-markdown', version: '^10.1.0', type: 'dependency', url: 'https://github.com/remarkjs/react-markdown' },
  { name: 'remark-gfm', version: '^4.0.1', type: 'dependency', url: 'https://github.com/remarkjs/remark-gfm' },
  { name: 'react-syntax-highlighter', version: '^16.1.0', type: 'dependency', url: 'https://github.com/react-syntax-highlighter/react-syntax-highlighter' },
  { name: '@giscus/react', version: '^3.1.0', type: 'dependency', url: 'https://giscus.app' },
  { name: 'gray-matter', version: '^4.0.3', type: 'devDependency', url: 'https://github.com/jonschlinkert/gray-matter' },
  { name: 'sharp', version: '^0.34.5', type: 'devDependency', url: 'https://sharp.pixelplumbing.com' },
];

export default function License() {
  useHead({
    title: `License - ${SITE_NAME}`,
    url: `${SITE_DOMAIN}/license`
  }, []);

  return (
    <div className="w-full max-w-[820px] mx-auto">
      <header className="mb-8 pb-6 border-b">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">Open Source Licenses</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          This project is built using the following open source software.
        </p>
      </header>

      <div className="grid gap-4">
        {dependencies.map((dep) => (
          <div
            key={dep.name}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-transparent hover:bg-muted/30 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-medium">{dep.name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                dep.type === 'dependency'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {dep.type === 'dependency' ? 'prod' : 'dev'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground font-mono">{dep.version}</span>
              {dep.url && (
                <a
                  href={dep.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline underline-offset-4"
                >
                  Visit
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
