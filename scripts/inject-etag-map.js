import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const PROJECT_ROOT = process.cwd();
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const POSTS_DIR = path.join(PROJECT_ROOT, 'content', 'posts');

function getETagForFile(filePath, type = 'default') {
  if (type === 'hash') {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  } else {
    const stats = fs.statSync(filePath);
    return `${path.basename(filePath)}-${stats.size}`;
  }
}

function getAllPostPathsSync() {
  const postMap = new Map();
  if (!fs.existsSync(POSTS_DIR)) return postMap;
  
  const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    if (/^\d{4}$/.test(entry.name)) {
      const yearDir = path.join(POSTS_DIR, entry.name);
      const posts = fs.readdirSync(yearDir, { withFileTypes: true });
      for (const post of posts) {
        if (post.isDirectory()) {
          postMap.set(post.name, path.join(yearDir, post.name, 'index.md'));
        }
      }
    } else {
      postMap.set(entry.name, path.join(POSTS_DIR, entry.name, 'index.md'));
    }
  }

  return postMap;
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      walkDir(filePath, callback);
    } else {
      callback(filePath);
    }
  }
}

function main() {
  const etagMap = {};
  const postMap = getAllPostPathsSync();

  // 1. Scan dist directory
  walkDir(DIST_DIR, (filePath) => {
    const relativePath = path.relative(DIST_DIR, filePath).replace(/\\/g, '/');
    
    // Exclude server directory and template files
    if (relativePath.startsWith('server/') || relativePath === 'template.html') {
      return;
    }

    let urlPath = '/' + relativePath;

    // Handle HTML files
    if (urlPath.endsWith('.html')) {
      if (urlPath === '/index.html') {
        urlPath = '/';
      } else if (urlPath.startsWith('/posts/')) {
        const postName = path.basename(urlPath, '.html');
        urlPath = '/posts/' + postName;
        // Use MD hash for posts
        const mdPath = postMap.get(postName);
        if (mdPath && fs.existsSync(mdPath)) {
          etagMap[urlPath] = getETagForFile(mdPath, 'hash');
          return;
        }
      } else {
        urlPath = urlPath.slice(0, -5); // remove .html
      }
    }

    // Determine ETag type
    const ext = path.extname(filePath);
    // HTML, JSON, MD files are content-hashed
    const type = (ext === '.json' || ext === '.md' || ext === '.html') ? 'hash' : 'default';
    
    etagMap[urlPath] = getETagForFile(filePath, type);
  });

  const etagMapJson = JSON.stringify(etagMap);
  const scriptTag = `<script id="etag-maps">window.__ETAG_MAP__ = ${etagMapJson};</script>`;

  // 2. Inject into all HTML files in dist
  walkDir(DIST_DIR, (filePath) => {
    if (path.extname(filePath) === '.html') {
      let content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes('<!--etag-maps-->')) {
        content = content.replace('<!--etag-maps-->', scriptTag);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ Injected ETag map into: ${filePath}`);
      }
    }
  });

  console.log('🎉 ETag map injection completed.');
}

main();
