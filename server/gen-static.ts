import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  createHTML,
  createTemplate,
  createInitialData,
  type Render,
  delay
} from '@server/utils.ts';

const PROJECT_ROOT = process.cwd();

const pages: string[] = [
  "",
  "search",
  "tags",
  ...fs.readdirSync(path.join(PROJECT_ROOT, 'content', 'posts')).map((postname) => `posts/${postname}`),
];

const DIST_PATH = path.join(PROJECT_ROOT, 'dist');
const template = await createTemplate();

async function generatePage(route: string) {
  const initialData = await createInitialData(route);

  // Replace "?" with "_" for filenames
  const cleanRoute = route.replace(/\?/g, "_").replace(/%20/g, "-");
  const entryUrl = pathToFileURL(path.join(DIST_PATH, "server", "entry-server.js")).href;
  const render: Render = (await import(entryUrl)).render;
  const html = await render({url: route, initialData: initialData});

  // clone the template with template.html [this file if that page not required SSG then SSR will use]
  if (route === "") {
    const filePath = path.join(DIST_PATH, "template.html");
    console.log(`✅ Generated: ${filePath}`);
    fs.writeFileSync(filePath, template, "utf-8");
  }
  const outputHtml = createHTML({
    template: template,
    head: html.head,
    body: html.body,
    initialData: initialData ? JSON.stringify(initialData) : "null"
  });

  // Ensure directory exists before writing file
  const outputDir = path.join(DIST_PATH, path.dirname(cleanRoute));
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true }); // Create parent directories if needed
  }

  const filePath = path.join(
    DIST_PATH,
    route === "/" || route === "" ? "index.html" : `${cleanRoute}.html`
  );

  fs.writeFileSync(filePath, outputHtml, "utf-8");
  console.log(`✅ Generated: ${filePath}`);
};


async function generatePagesSequentially() {
  // copyContentToDistDirectory();
  for (const route of pages) {
    await generatePage(route);
    await delay(100); // Wait for 0.1 second before processing the next page (Not req)
  }
}

generatePagesSequentially();

