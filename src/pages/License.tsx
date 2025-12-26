import { useHead } from '@src/hooks/useHead';
import { SITE_NAME, SITE_DOMAIN } from '@src/shared/common';
import '@src/styles/License.css';

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
    <div className="license-container">
      <div className="license-header">
        <h1 className="license-title">Open Source Licenses</h1>
        <p className="license-description">
          This project is built using the following open source software.
        </p>
      </div>

      <div className="license-list">
        {dependencies.map((dep) => (
          <div key={dep.name} className="license-item">
            <h2 className="license-name">{dep.name}</h2>
            <span className="license-type">{dep.type}</span>
            <div>
              {dep.url && (
                <a
                  href={dep.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="license-link"
                >
                  Visit Website →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
