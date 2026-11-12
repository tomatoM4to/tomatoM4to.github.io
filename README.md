# Overview
React와 Vite 기반의 Markdown 블로그입니다. SSR로 빠르게 개발하고, 실제 배포는 SSG로 생성한 정적 산출물을 GitHub Pages에 올립니다. 두 환경은 렌더러를 공유하지만 데이터 제공 방식과 실행 시점이 달라 동작이 완전히 같지는 않습니다.

클라이언트가 요청할 데이터는 빌드 시 JSON 에셋으로 생성해 GitHub Pages를 정적 API 서버처럼 활용합니다. 클라이언트에서는 [Rethinking Web Caching](https://conferences.sigcomm.org/hotnets/2024/papers/hotnets24-124.pdf)의 아이디어를 적용해, 미리 전달한 버전 맵과 Service Worker로 캐시 재검증에 필요한 네트워크 레이턴시를 줄입니다.

이 캐시 정책은 글·JSON·에셋을 배포 단위로 생성하는 정적 블로그를 전제로 합니다. 캐시 판단의 기준은 HTML에 포함된 빌드 시점의 버전 맵이며, 새 배포의 맵은 HTML을 다시 받을 때 반영됩니다. 실시간 데이터 변경을 반영해야 하는 서비스에는 별도의 최신성 정책이 필요합니다.

Service Worker는 문서별로 맵을 분리해 탭 사이의 덮어쓰기를 막고, 응답 캐시는 URL별로 공유합니다. 배포 후에도 열려 있는 이전 문서가 캐시에 없는 리소스를 요청하면 새 배포의 응답을 받을 수 있습니다. 이 프로젝트는 배포 경계에서 이전 문서와 새 리소스가 함께 사용될 수 있음을 허용합니다. 자세한 정책과 검증 범위는 [캐시 설계 문서](docs/ETag-Map.md)를 참고하세요.

# Checkpoints

- 글의 대표 이미지 기능은 현재 지원하지 않습니다. `image` 필드와 관련 코드는 향후 지원 가능성을 열어두기 위해 남겨둔 것입니다. 본문에 삽입하는 이미지는 사용할 수 있습니다.
- 검색은 GitHub Pages에서 검색에 필요한 전체 목록 JSON을 내려받은 뒤 브라우저에서 수행합니다. 일부 자료만으로 검색하면 실제로 있는 글이 검색 결과에서 누락될 수 있으므로, 전체 목록 JSON이 준비될 때까지 검색 입력을 비활성화하는 것은 의도된 정책입니다. 일부 요청이 실패해도 불완전한 자료로 검색을 활성화하지 않습니다. 관련 계약은 [검색 구현](src/pages/Search.tsx)과 [요청 실패 테스트](tests/e2e/request-failures.spec.ts)에서 확인할 수 있습니다.

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
## 개발 서버 · Express SSR
`http://localhost:5173`에서 개발합니다. 소스 변경은 Compose Watch로 동기화하고 Vite HMR·서버 watch로 반영합니다. Markdown 변경은 서버를 재시작하고, 의존성 파일 변경은 이미지를 재빌드합니다.

```bash
docker compose -f compose.dev.yaml up --build --watch
```

## 정적 서버 · Nginx SSG
GitHub Pages의 정적 배포를 로컬에서 확인하는 환경입니다. Docker에서 전체 빌드로 생성한 HTML·JSON·에셋을 Nginx가 `http://localhost:4173`에서 제공합니다. 소스나 글을 변경해도 자동 반영되지 않으며, 아래 `up --build -d` 명령을 다시 실행해 산출물을 재빌드하고 서버를 교체합니다.

SSG 서버는 HTTP 캐시 TTL을 기본 1초로 설정하고 ETag·Last-Modified 조건부 요청을 지원합니다. `HTTP_CACHE_TTL` 환경 변수로 TTL을 변경할 수 있습니다(예: `10m`). 변경 후 `docker compose -f compose.ssg.yaml up -d`로 반영합니다. 이 TTL은 SW의 Cache Storage를 만료시키지 않습니다.

확장자 없는 페이지는 대응하는 `.html`을 제공하고, 없는 파일은 404를 반환합니다. GitHub Pages의 CDN까지 재현하는 환경은 아닙니다.

```bash
# 전체 빌드 및 정적 서버 실행·갱신
docker compose -f compose.ssg.yaml up --build -d

# 요청 로그 확인
docker compose -f compose.ssg.yaml logs -f static

# 정적 서버 종료
docker compose -f compose.ssg.yaml down
```

프로젝트의 E2E·캐시·성능 테스트는 [테스트 문서](docs/testing.md)를 참고하세요. Docker 안에서 Node·TypeScript·Playwright Test로 실행합니다.

# Posting
- `content/posts/<연도>/<글 ID>/index.md`에 Markdown으로 작성합니다.
- 글 ID는 연도와 무관하게 중복되지 않게 정하며, `/posts/<글 ID>` URL에 사용됩니다. 기존 ID 변경은 링크와 댓글 연결에 영향을 주므로 주의해야 합니다.
- 글 ID는 대소문자와 무관하게 `.html`로 끝날 수 없습니다. 정적 HTML 파일 주소와 다른 글의 URL이 겹치는 것을 방지하기 위한 제한이며, 태그에는 적용하지 않습니다.
- 글 ID와 태그는 한글·공백·`C++`·`C#`·`R&D`·`%`를 허용합니다. 이름과 생성 파일명은 원문을 유지하고, 링크·API 요청의 URL에서 인코딩합니다.
- Windows·Linux에서 같은 산출물을 만들기 위해 `< > : " / \ | ? *`, 제어 문자, Windows 예약 이름(`CON`, `NUL.txt` 등), 끝 공백·마침표는 거부합니다. 생성 파일명은 확장자 포함 UTF-8 255바이트 이내여야 합니다. 잘못된 글 ID·태그는 원본 경로와 이유를 표시하며 빌드를 실패시킵니다.
- `keywords`는 쉼표로 태그를 구분하고 주변 공백을 제거합니다. 태그 안의 쉼표는 지원하지 않으며, 빈 문자열은 태그 없는 글로 허용합니다. `CI/CD`처럼 경로 구분자가 포함된 태그는 사용할 수 없습니다.
- 이미지는 `public/img/<글 ID>/`에 두고 본문에서는 `/img/<글 ID>/파일명.webp`처럼 참조합니다.

본문 앞에 YAML front matter를 작성해 각 글마다 메타데이터를 정의할 수 있습니다.
```yaml
---
title: "글 제목"
description: "글 요약"
date: "2026-11-04"
keywords: "JavaScript, Network"
image: "/img/글 ID/cover.webp" # 선택, 대표 이미지 기능은 현재 미지원
---
```
