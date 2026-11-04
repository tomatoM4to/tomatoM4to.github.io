ARG PLAYWRIGHT_VERSION=1.64.1

FROM node:24-bookworm-slim AS fixtures

WORKDIR /app
RUN chown node:node /app
USER node

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

# 실제 글과 테스트 러너는 빌드 입력에서 제외하고 앱의 생성기에 fixture만 전달한다.
COPY --chown=node:node index.html vite.config.ts tsconfig*.json ./
COPY --chown=node:node src ./src
COPY --chown=node:node shared ./shared
COPY --chown=node:node server ./server
COPY --chown=node:node scripts ./scripts
COPY --chown=node:node public/sw.js public/terminal.svg public/reze.webp ./public/
COPY --chown=node:node tests/fixtures/a/content ./content
COPY --chown=node:node tests/fixtures/a/public ./public
# 이전 산출물이 다음 Tailwind 소스 탐색에 포함되지 않도록 프로젝트 밖에 보관한다.
RUN npm run build && mv dist /tmp/release-a

COPY --chown=node:node tests/fixtures/b/content ./content
COPY --chown=node:node tests/fixtures/b/public ./public
RUN npm run build && mv dist /tmp/release-b

FROM nginx:1.30.6-alpine AS static

ENV HTTP_CACHE_TTL=1s
ENV NGINX_ACCESS_LOG=/srv/access.log

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY tests/nginx-delay.conf /etc/nginx/conf.d/test-delay.conf
COPY --from=fixtures /tmp/release-a /srv/releases/a
COPY --from=fixtures /tmp/release-b /srv/releases/b
RUN ln -s releases/a /srv/site

FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble AS test

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY tsconfig.json ./
COPY tests ./tests
RUN npm run test:typecheck

ENV CI=1
CMD ["npm", "test"]
