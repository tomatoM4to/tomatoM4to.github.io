import fs from "fs";
import path from "path";
const pages = [
  "", // Home page
  "about", // About page
]; // Define the pages for pre-rendering

const distPath = path.resolve("dist");
const template = fs.readFileSync(
  path.resolve(distPath, "client/index.html"),
  "utf-8"
);
// artifical delay fn
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generatePage = async (route) => {
  const cleanRoute = route.replace(/\?/g, "_").replace(/%20/g, "-"); // Replace "?" with "_" for filenames
  const render = (await import("./dist/server/entry-server.js")).render;
  const html = await render(route);

  // clone the template with template.html [this file if that page not required SSG then SSR will use]
  if (route === "") {
    const filePath = path.join(`${distPath}/client`, "template.html");
    console.log(`✅ Generated: ${filePath}`);
    fs.writeFileSync(filePath, template, "utf-8");
  }

  // console.log(html.html, 'html');

  // Inject head and body content properly
  const outputHtml = template
    .replace("<!--app-head-->", html.head ?? "") // Inject head content
    .replace("<!--app-html-->", html.html ?? ""); // Inject body content

  // console.log(outputHtml, 'output23123');

  // Ensure directory exists before writing file
  const outputDir = path.join(`${distPath}/client`, path.dirname(cleanRoute));
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true }); // Create parent directories if needed
  }

  const filePath = path.join(
    `${distPath}/client`,
    route === "/" || route === "" ? "index.html" : `${cleanRoute}.html`
  );

  fs.writeFileSync(filePath, outputHtml, "utf-8");
  console.log(`✅ Generated: ${filePath}`);
};

async function generatePagesSequentially() {
  for (const route of pages) {
    await generatePage(route);
    await delay(100); // Wait for 0.1 second before processing the next page (Not req)
  }
}

generatePagesSequentially();