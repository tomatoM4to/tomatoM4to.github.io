import fs from "node:fs/promises";
import path from 'node:path';
import matter from "gray-matter";

const PROJECT_ROOT = process.cwd();

/**
 * URL 경로에서 마크다운 파일을 읽어와 파싱된 객체로 반환합니다.
 * URL에 'posts'가 포함되지 않은 경우 null을 반환합니다.
 *
 * @param {string} url - 마크다운 파일의 URL 경로 ex) 'posts/database', 'posts/docker'
 * @returns {Promise<import('gray-matter').GrayMatterFile<string>> | null} 파싱된 마크다운 객체 또는 null
 * @returns {string} returns.content - 마크다운 본문 내용
 * @returns {string} returns.excerpt - 발췌문 (보통 빈 문자열)
 * @returns {Object} returns.data - ex) data: { title: 'TOML', categories: 'front matter toml' }
 *
 * @throws {Error} 파일을 찾을 수 없거나 읽기에 실패한 경우
 *
 * @example
 * // 사용 예시
 * const postData = await createInitialData('posts/database');
 * console.log(postData.data.title); // 글 제목 출력
 * console.log(postData.content);    // 마크다운 내용 출력
 */
export async function createInitialData(url) {
  if (!url.includes('posts')) {
    return JSON.stringify("");
  }
  const initialDataPath = path.join(PROJECT_ROOT, "content", url, 'index.md');
  let fileContent;
  try {
    fileContent = await fs.readFile(initialDataPath, 'utf-8');
  }
  catch (err) {
    console.error(`[ERROR] File not found or unreadable: ${initialDataPath}`, err);
    throw new Error(`File not found: ${initialDataPath}`);
  }
  return matter(fileContent);
}

/**
 * 포스트 이름을 기반으로 Markdown 파일을 plaintext 로 반환
 * @param {string} name - 포스트 디렉토리 이름 ex) 'database', 'network'
 * @returns {Promise<string>} plaintext
 * @throws {Error} 파일 읽기에 실패한 경우 File not found
 */
export async function getMarkdown(name) {
  const markdownPath = path.join(PROJECT_ROOT, 'content', 'posts', name, 'index.md');
  try {
    const markdown = await fs.readFile(markdownPath, 'utf-8');
    return markdown;
  }
  catch (err) {
    console.error(err);
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
    .replace(`<!--app-head-->`, head ?? '')
    .replace(`<!--app-html-->`, body ?? '')
    .replace(
      `<!--app-window-->`,
      `<script>window.__INITIAL_DATA__ = ${initialData}</script>`
    );
    return html;
}