import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

const artifacts = fileURLToPath(new URL('./artifacts/', import.meta.url));

export default defineConfig({
  testDir: '.',
  // 테스트들이 하나의 정적 배포 링크를 교체하므로 서로 겹치지 않게 실행한다.
  workers: 1,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  // 재시도로 새 context를 만들면 최초 접속의 캐시 갱신 실패가 가려질 수 있다.
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 5_000 },
  outputDir: `${artifacts}/results`,
  reporter: [
    ['list'],
    ['html', { outputFolder: `${artifacts}/report`, open: 'never' }],
    ['json', { outputFile: `${artifacts}/report.json` }],
  ],
  use: {
    baseURL: 'http://localhost',
    browserName: 'chromium',
    navigationTimeout: 15_000,
    actionTimeout: 15_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'e2e',
      testMatch: '**/e2e/**/*.spec.ts',
      use: { serviceWorkers: 'block' },
    },
    {
      name: 'cache',
      testMatch: '**/cache/**/*.spec.ts',
    },
  ],
});
