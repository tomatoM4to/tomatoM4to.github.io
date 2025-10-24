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
  let initialData = JSON.stringify('');
  if (url === '') {
    return initialData;
  }
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
 * 포스트 이름으로 index.md 를 읽고 반환
 * @param {string} name - 포스트 디렉토리 이름
 * @returns {Promise<string>} 마크다운 파일의 내용
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