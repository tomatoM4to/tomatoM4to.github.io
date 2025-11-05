import fs from "node:fs/promises";
import path from 'node:path';

const PROJECT_ROOT = process.cwd();

/**
 * URL 경로에서 마크다운 파일을 읽어 JSON 문자열로 반환
 * @param {string} url - 마크다운 파일이 위치한 URL 경로 ex) 'posts/database', 'posts/docker'
 * @returns {Promise<string>} JSON으로 직렬화된 마크다운 내용 또는 빈 문자열
 * @throws {Error} 파일 읽기에 실패한 경우 File not found 문자열 반환
 */
export async function getMarkdownFromUrl(url) {
  let initialData = '';
  const initialDataPath = path.join(PROJECT_ROOT, "content", url, 'index.md');
  try {
    initialData = await fs.readFile(initialDataPath, 'utf-8');
    return JSON.stringify(initialData);
  }
  catch {
    return JSON.stringify(`ERROR : File not found : ${initialDataPath}`);
  }
}

/**
 * 포스트 이름을 기반으로 Markdown 파일을 plaintext 로 반환
 * @param {string} name - 포스트 디렉토리 이름
 * @returns {Promise<string>} plaintext
 * @throws {Error} 파일 읽기에 실패한 경우 File not found 문자열 반환
 */
export async function getMarkdownFromName(name) {
  const markdownPath = path.join(PROJECT_ROOT, 'content', 'posts', name, 'index.md');
  try {
    const markdown = await fs.readFile(markdownPath, 'utf-8');
    return markdown;
  }
  catch {
    return `ERROR : File not found : ${markdownPath}`;
  }
}


/**
 * build:client 이후 생성된 dist/client/index.html 을 비동기적으로 읽어드리는 함수
 * @returns {Promise<string>}
 */
export async function createTemplate() {
  const p = path.join(PROJECT_ROOT, "dist", 'client', 'index.html');
  return await fs.readFile(p, 'utf-8');
}


/**
 * 템플릿에 선언된 <!--app-xxxx--> 을 각 값에 맞게 교체해주는 함수
 * @param {String} template
 * @param {String} head
 * @param {String} body
 * @param {String} initialData
 */
export function createHTML(template, head, body, initialData) {
  const html = template
    .replace(`<!--app-head-->`, head)
    .replace(`<!--app-html-->`, body)
    .replace(
      `<!--app-window-->`,
      `<script>window.__INITIAL_DATA__ = ${initialData}</script>`
    );
    return html;
}