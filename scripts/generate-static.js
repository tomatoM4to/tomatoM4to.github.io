import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { getMarkdown } from './utils.js';

const PROJECT_ROOT = process.cwd();
const pages = [
  "",
  "posts/database",
  "posts/docker",
  "posts/network",
]; // Define the pages for pre-rendering

const distPath = path.join(PROJECT_ROOT, 'dist');
const template = fs.readFileSync(
  path.resolve(distPath, "client", "index.html"),
  "utf-8"
);
// artifical delay fn
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generatePage = async (route) => {
  /** @type {string} */
  const initialData = await getMarkdown(route);

  const cleanRoute = route.replace(/\?/g, "_").replace(/%20/g, "-"); // Replace "?" with "_" for filenames
  const entryUrl = pathToFileURL(path.join(distPath, "server", "entry-server.js")).href;
  const render = (await import(entryUrl)).render;
  const html = await render(route, initialData);

  // clone the template with template.html [this file if that page not required SSG then SSR will use]
  if (route === "") {
    const filePath = path.join(distPath, "client", "template.html");
    console.log(`✅ Generated: ${filePath}`);
    fs.writeFileSync(filePath, template, "utf-8");
  }

  // console.log(html.html, 'html');

  // Inject head and body content properly
  const outputHtml = template
    .replace("<!--app-head-->", html.head ?? "") // Inject head content
    .replace("<!--app-html-->", html.html ?? "") // Inject body content
    .replace(
      "<!--app-window-->",
      `<script>window.__INITIAL_DATA__ = ${initialData}</script>`
    )

  // console.log(outputHtml, 'output23123');

  // Ensure directory exists before writing file
  const outputDir = path.join(distPath, "client", path.dirname(cleanRoute));
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true }); // Create parent directories if needed
  }

  const filePath = path.join(
    distPath,
    "client",
    route === "/" || route === "" ? "index.html" : `${cleanRoute}.html`
  );

  fs.writeFileSync(filePath, outputHtml, "utf-8");
  console.log(`✅ Generated: ${filePath}`);
};

const copyContentToDistDirectory = () => {
  const sourcePath = path.join(PROJECT_ROOT, 'content', 'posts');
  const destPath = path.join(PROJECT_ROOT, 'dist', 'client', 'api');

  if (fs.existsSync(sourcePath)) {
    fs.cpSync(sourcePath, destPath, { recursive: true });
    console.log(`✅ Copied content directory to: ${destPath}`);
  } else {
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

