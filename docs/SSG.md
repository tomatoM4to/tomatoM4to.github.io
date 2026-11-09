# Overview
빠른 개발용 SSR의 렌더러를 빌드 시점에 재사용해 HTML을 만들고, 클라이언트 요청에 사용할 JSON을 에셋으로 생성한다. 요청마다 렌더링하는 SSR 환경과 동작이 완전히 같지는 않으며, 최종 서비스는 Express 없이 GitHub Pages에서 정적 HTML·JSON·에셋으로 제공한다.

# Checkpoints
- [생성 모듈](../server/gen-static.ts)은 import 시 콘텐츠나 빌드 산출물을 읽지 않는다. [HTML 실행 진입점](../server/build-static.ts)과 [JSON 실행 진입점](../server/build-api.ts)이 실제 입력을 준비하며, 생성 함수는 전달받은 데이터·렌더러·출력 경로만 사용한다. 빌드 경로를 고정하거나 실행을 import에 결합하지 않아야 [격리된 생성기 테스트](testing.md#서버-유닛-테스트)를 유지할 수 있다.
- [HTML 생성 대상](../server/gen-static.ts)은 `/`, `/search`, `/tags`, `/license`, `/posts/<글 ID>`다. 루트는 `index.html`, 나머지는 `<경로>.html`로 저장한다. Footer 등에서 노출하는 페이지는 정적 HTML도 제공해 직접 접속과 새로고침을 지원해야 한다.
- 글 ID는 연도를 제외한 폴더명이다. HTML·JSON·클라이언트 링크·ETag 키가 같은 글을 가리켜야 하며, HTML 생성기의 `?` → `_`, `%20` → `-` 치환은 다른 경로 생성 코드에 공통 적용되지 않는다.
- 중복 글 ID와 잘못된 메타데이터는 자동 보정하거나 덮어쓰지 않고 빌드를 실패시킨다. [공통 콘텐츠 로더](../server/utils.ts)의 문자열 필드·실제 날짜 검증을 HTML·상세 JSON·목록·태그 집계에서 동일하게 적용해야 한다. 날짜는 `YYYY-MM-DD` 문자열이며 `image`는 생략할 수 있다.
- [정적 API 생성기](../server/gen-api-resource.ts)는 글 상세, 페이지별 최근 글, 태그별 글 목록 JSON을 만든다. 목록 계약은 `{ len, data }`이며, 최근 글은 페이지 단위로 생성하고 태그별 목록은 브라우저에서 페이지를 나눈다.
- Express의 `/api/tags/all-tags.json`에 대응하는 전체 태그 집계 파일은 별도로 생성하지 않는다. 현재 태그 화면은 HTML에 주입된 `initialData.tags`를 사용한다.
- 빌드는 클라이언트·서버 번들 → HTML → JSON → [ETag 맵 주입](ETag-Map.md) 순서다. 일부 단계만 실행하면 최신 배포 산출물이 완성되지 않는다. [배포 워크플로](../.github/workflows/deploy.yml)는 `npm run build` 후 `dist/`를 업로드한다.
- `npm run start:ssg`는 산출물의 로컬 확인용이다. 서버별 URL 해석이 다를 수 있으므로 확장자 없는 직접 접근과 새로고침은 GitHub Pages에서도 확인해야 한다. SPA 내부 이동 성공만으로 해당 HTML 파일의 존재를 판단할 수 없다.

# Diagrams
## 정적 산출물 생성과 배포 후 사용
빌드에서 HTML·JSON·에셋을 생성해 GitHub Pages에 배포하고, 브라우저가 각 산출물을 사용하는 흐름을 보여준다.

```mermaid
flowchart TD
    subgraph Build["빌드 환경 · Node.js"]
        V["Vite 클라이언트·서버 빌드"] --> T["HTML 템플릿 + 에셋"]
        V --> R["공통 SSR 렌더러"]
        D["콘텐츠 로더"] -->|초기 데이터| R
        R --> H["build-static.ts → gen-static.ts · 정적 HTML"]
        T --> H
        H -->|다음 빌드 단계| J["build-api.ts → gen-api-resource.ts · 정적 JSON"]
        D --> J
        J --> M["inject-etag-map.js · HTML에 버전 맵 주입"]
        H --> M
        T --> M
    end
    M --> P["GitHub Pages · dist 정적 배포"]
    P -->|직접 접근 · HTML + 초기 데이터 + 에셋| B["브라우저 · hydration"]
    B --> C["React Router · 클라이언트 탐색"]
    C -->|JSON 요청| P
    P -->|JSON 응답| C
```

# Tests

[HTML 생성기 테스트](../server/gen-static.test.ts)는 경로별 초기 데이터와 테스트용 렌더러를 사용해 템플릿 보관·파일 경로·실패 전달을 검사한다. [JSON 생성기 테스트](../server/gen-api-resource.test.ts)는 글 상세 데이터·페이지 경계·태그별 목록과 파일 저장 실패를 검사한다. 파일 저장까지 포함하는 테스트는 임시 디렉터리에서 실행하며, 실제 렌더러를 연결한 브라우저 동작은 [기존 E2E](testing.md)에서 검증한다.
