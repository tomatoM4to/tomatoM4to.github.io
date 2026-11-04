# Overview
React와 Vite 기반의 Markdown 블로그입니다. SSR로 빠르게 개발하고, 실제 배포는 SSG로 생성한 정적 산출물을 GitHub Pages에 올립니다. 두 환경은 렌더러를 공유하지만 데이터 제공 방식과 실행 시점이 달라 동작이 완전히 같지는 않습니다.

클라이언트가 요청할 데이터는 빌드 시 JSON 에셋으로 생성해 GitHub Pages를 정적 API 서버처럼 활용합니다. 클라이언트에서는 [Rethinking Web Caching](https://conferences.sigcomm.org/hotnets/2024/papers/hotnets24-124.pdf)의 아이디어를 적용해, 미리 전달한 버전 맵과 Service Worker로 캐시 재검증에 필요한 네트워크 레이턴시를 줄입니다.

# Commands
```bash
npm install          # 의존성 설치
npm run dev          # SSR 개발 서버
npm run build        # 배포용 전체 빌드: HTML·JSON·에셋·ETag 맵
npm run start:ssg    # 전체 빌드 후 dist/ 정적 서빙
npm run start:ssr    # 빌드 후 Express SSR 실행

npm run build:client # 클라이언트 번들 생성
npm run build:server # SSR 렌더러 번들 생성
npm run build:ssr    # 클라이언트·서버 번들 생성
npm run build:ssg    # 번들 빌드 후 정적 HTML 생성
npm run build:api    # 정적 JSON 생성

npm run convert      # public/img/ 하위 폴더의 JPG·JPEG·PNG를 WebP로 변환
```

# Docker
```bash
# Dev
docker compose -f compose.dev.yaml up --build --watch
```

# Posting
- `content/posts/<연도>/<글 ID>/index.md`에 Markdown으로 작성합니다.
- 글 ID는 연도와 무관하게 중복되지 않게 정하며, `/posts/<글 ID>` URL에 사용됩니다. 기존 ID 변경은 링크와 댓글 연결에 영향을 주므로 주의해야 합니다.
- 이미지는 `public/img/<글 ID>/`에 두고 본문에서는 `/img/<글 ID>/파일명.webp`처럼 참조합니다.

본문 앞에 YAML front matter를 작성해 각 글마다 메타데이터를 정의할 수 있습니다.
```yaml
---
title: "글 제목"
description: "글 요약"
date: "2026-11-04"
keywords: "JavaScript, Network"
image: "/img/글 ID/cover.webp" # 선택
---
```
