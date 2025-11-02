import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { getMarkdownFromUrl } from './utils.js';

const PROJECT_ROOT = process.cwd();

const pages = [
  "",
  "search",
  "tags",
  ...fs.readdirSync(path.join(PROJECT_ROOT, 'content', 'posts')).map((postname) => `posts/${postname}`),
];

const DIST_PATH = path.join(PROJECT_ROOT, 'dist');
const template = fs.readFileSync(
  path.resolve(DIST_PATH, "client", "index.html"),
  "utf-8"
);

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};


async function generatePage(route) {
  let initialData = JSON.stringify('No initial data');
  if (route.includes('posts')) {
    initialData = await getMarkdownFromUrl(route);
  }

  // Replace "?" with "_" for filenames
  const cleanRoute = route.replace(/\?/g, "_").replace(/%20/g, "-");
  const entryUrl = pathToFileURL(path.join(DIST_PATH, "server", "entry-server.js")).href;
  const render = (await import(entryUrl)).render;
  const html = await render(route, initialData);

  // clone the template with template.html [this file if that page not required SSG then SSR will use]
  if (route === "") {
    const filePath = path.join(DIST_PATH, "client", "template.html");
    console.log(`✅ Generated: ${filePath}`);
    fs.writeFileSync(filePath, template, "utf-8");
  }

  // Inject head and body content properly
  const outputHtml = template
    .replace("<!--app-head-->", html.head ?? "")
    .replace("<!--app-html-->", html.html ?? "")
    .replace(
      "<!--app-window-->",
      `<script>window.__INITIAL_DATA__ = ${initialData}</script>`
    )

  // Ensure directory exists before writing file
  const outputDir = path.join(DIST_PATH, "client", path.dirname(cleanRoute));
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true }); // Create parent directories if needed
  }

  const filePath = path.join(
    DIST_PATH,
    "client",
    route === "/" || route === "" ? "index.html" : `${cleanRoute}.html`
  );

  fs.writeFileSync(filePath, outputHtml, "utf-8");
  console.log(`✅ Generated: ${filePath}`);
};

function copyContentToDistDirectory() {
  const sourcePath = path.join(PROJECT_ROOT, 'content', 'posts');
  const destPath = path.join(PROJECT_ROOT, 'dist', 'client', 'api');

  if (fs.existsSync(sourcePath)) {
    fs.cpSync(sourcePath, destPath, { recursive: true });
    console.log(`✅ Copied content directory to: ${destPath}`);
  }
  else {
    console.log(`⚠️ Content directory not found: ${sourcePath}`);
  }
};

async function generatePagesSequentially() {
  copyContentToDistDirectory();
  for (const route of pages) {
    await generatePage(route);
    await delay(100); // Wait for 0.1 second before processing the next page (Not req)
  }
}

generatePagesSequentially();

