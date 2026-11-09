# Overview

[서버 유닛 테스트](../server/utils.test.ts)는 코드 옆에 두고 Node 내장 테스트 러너와 기존 `tsx`로 실행한다. 임시 디렉터리의 입력으로 서버 함수의 계약을 검증하며 실제 `content/posts`를 읽거나 수정하지 않는다.

기존 `tests/`는 실제 앱과 [SSG 생성기](SSG.md)에 테스트 전용 글·에셋을 입력하고, Docker의 Nginx와 Playwright Test로 사용자 동작·캐시 최신성·초기 동기화 비용을 검증한다. 실제 `content/posts`는 테스트 빌드에 포함하지 않는다.

# Checkpoint

## 서버 유닛 테스트

Node와 프로젝트 의존성이 설치된 환경에서 프로젝트 루트의 다음 명령으로 실행한다. 브라우저·Nginx·정적 배포 빌드는 필요하지 않다.

```bash
npm run test:unit:typecheck
npm run test:unit
```

- 실행 대상은 `server/*.test.ts`이며 기존 Playwright 명령과 독립적이다. [전용 타입 설정](../tsconfig.test.json)은 테스트가 가져오는 서버 코드도 검사하며 파일을 생성하지 않는다.
- [HTML 생성기](../server/gen-static.test.ts)와 [JSON 생성기](../server/gen-api-resource.test.ts)는 전달받은 입력과 임시 출력 경로로 산출물을 검사한다. 파일 시스템을 포함하는 통합 테스트이며 브라우저나 실제 콘텐츠 로더는 사용하지 않는다. 생성 모듈의 경계는 [SSG 문서](SSG.md#checkpoints)를 따른다.
- [메타 생성 테스트](../server/meta.test.ts)는 실제 SSR·SSG에서 사용하는 함수를 호출한다. 제목과 설명은 HTML 구조가 아닌 텍스트이므로 특수문자가 태그나 속성의 경계를 바꾸지 않아야 한다. React 렌더러나 가짜 메타 생성 함수를 거치지 않고 이 계약을 검증한다.
- `utils.ts`는 import 시 작업 디렉터리를 고정한다. 테스트 프로세스에서 임시 경로로 이동해 모듈을 로드한 뒤 원래 경로로 복구하고, 종료 시 임시 입력을 제거한다. 같은 모듈 인스턴스가 사용하는 입력을 테스트별로 초기화하므로 파일 안의 테스트는 순차 실행한다.
- 중복 글 ID·필수 메타데이터·날짜 검증과 HTML 치환·직렬화는 정상 계약을 기대하는 회귀 테스트다. 현재 구현에서 검증이나 이스케이프가 빠진 경우 테스트는 실패하며, 기존 동작을 정답으로 고정하거나 실패를 skip·todo로 숨기지 않는다.

## 실행과 결과

프로젝트 루트에서 실행한다. 호스트에는 Docker가 필요하며 Node·Chromium은 컨테이너에서 실행한다. [Compose 설정](../compose.test.yaml)은 개발·정적 미리보기 서버와 별도 프로젝트를 사용한다.

```bash
# 정적 빌드와 타입 검사 후 E2E·캐시·성능 테스트 실행
docker compose -f compose.test.yaml up --build --renew-anon-volumes --force-recreate --abort-on-container-exit --exit-code-from test

# 컨테이너와 테스트 배포용 익명 볼륨 정리
docker compose -f compose.test.yaml down -v
```

종류별 실행은 테스트 서버를 새로 준비한 뒤 필요한 명령을 선택한다.

```bash
docker compose -f compose.test.yaml up --build -d --renew-anon-volumes --force-recreate static
docker compose -f compose.test.yaml run --build --rm test npm run test:e2e
docker compose -f compose.test.yaml run --build --rm test npm run test:cache
docker compose -f compose.test.yaml run --build --rm test npm run test:performance
```

- [러너 이미지](../tests/Dockerfile)를 빌드할 때 `npm run test:typecheck`로 테스트와 SW 초기화 모듈의 타입을 검사한다. 전체 앱의 타입 검사를 대신하지 않는다. `@playwright/test`와 Docker 이미지 버전은 함께 갱신한다.
- 실패하면 러너 종료 코드는 1이며 전체 실행 명령도 이를 전달한다. 리포트는 호스트의 `tests/artifacts/`에 남고 `down -v`로 지워지지 않는다. 같은 경로를 다음 실행에서도 사용하므로 비교할 결과는 재실행 전에 보관한다.
- HTML 리포트는 `tests/artifacts/report/index.html`, JSON은 `tests/artifacts/report.json`이다. 실패 trace·스크린샷은 `tests/artifacts/results/`에 남는다. Node 환경에서는 `npm run test:report`로 HTML 리포트를 제공할 수 있다. 산출물은 Git과 Docker 빌드 입력에서 제외한다.

## 테스트 범위

[Playwright 설정](../tests/playwright.config.ts)의 프로젝트별로 실행 대상을 구분한다. 새 테스트는 해당 디렉터리에 `*.spec.ts`로 추가한다.

| 위치 | 검증 대상 |
| --- | --- |
| [e2e](../tests/e2e/static-site.spec.ts) | SW를 차단한 글 직접 접속·SPA 탐색, 코드 블록·수식·Mermaid, 정적 라우팅·조건부 요청·404 |
| [e2e/request-failures.spec.ts](../tests/e2e/request-failures.spec.ts) | 홈·태그·글의 응답 순서 역전, 검색 JSON 전체 성공·일부 HTTP 오류·네트워크 실패 |
| [cache/refresh.spec.ts](../tests/cache/refresh.spec.ts) | SW 허용/차단 × 일반/느린 이미지 로딩에서 배포 후 첫 접속의 목록과 캐시 재사용 |
| [cache/bootstrap.spec.ts](../tests/cache/bootstrap.spec.ts) | 검색·태그 직접 접속, SW 미지원·등록 실패, 맵 저장 실패 응답·확인 응답 유실 |
| [performance](../tests/performance/bootstrap.spec.ts) | SW 미지원 기준선·최초 설치·캐시 준비 후 재방문·등록 지연 실패의 로컬 측정 |
| [fixtures](../tests/fixtures) · [support](../tests/support/static-site.ts) | 두 배포의 입력과 배포 링크 교체·버전 맵·Nginx 로그 조회 |

## 배포와 캐시 격리

- A는 기존 글 하나를 포함하고, B는 기존 글을 유지하면서 새 글과 변경된 SVG를 추가한다. 둘을 미리 전체 빌드해 두고 `/srv/site` 심볼릭 링크만 원자적으로 교체한다. 이전 산출물은 프로젝트 밖에 보관해 다음 Tailwind 소스 탐색에 섞이지 않게 한다.
- A·B의 앱 번들과 SW는 같아야 하고 JSON·테스트 SVG의 버전은 달라야 한다. SVG는 현재 파일명·크기 기반 버전 정책으로 변경이 구분되도록 크기도 바꾼다. 동일 크기 에셋 변경이나 SW 스크립트 자체의 업그레이드는 이 배포 시나리오의 검증 대상이 아니다.
- 각 테스트는 배포 A와 새 browser context에서 시작한다. 배포 전환 중에는 탭만 닫고 같은 context에서 새 탭으로 접속하여 SW·Cache Storage·HTTP 캐시를 유지한다. `--renew-anon-volumes`는 재실행 시 이전 빌드가 담긴 서버 볼륨이 재사용되는 것을 막는다.
- Nginx는 [공통 정적 서버 설정](../nginx/default.conf.template)과 HTTP TTL 1초를 사용한다. 이 TTL은 Cache Storage의 만료 시간이 아니다. 브라우저와 Nginx는 네트워크를 공유하여 같은 `http://localhost`에 접속하며, 러너는 배포 볼륨으로만 전환을 제어한다. Docker 소켓이나 관리 API는 사용하지 않는다.
- 하나의 배포 링크를 공유하므로 `workers: 1`로 실행한다. 병렬화하려면 먼저 worker별 서버·볼륨을 분리해야 한다. 재시도는 새 context에서 첫 접속 실패를 가릴 수 있어 끈다.

## 재현 조건과 판정

- 요청 실패 E2E는 SW를 차단하고 API 응답을 제어한다. 이전 응답을 보류한 상태에서 현재 경로의 결과가 먼저 표시된 것을 확인한 뒤 이전 응답을 해제한다. 응답 취소도 허용하며, 취소하지 않는 구현에서는 늦은 응답이 화면과 글 메타데이터를 덮지 않아야 한다. 글 경로 간 전환은 `popstate`로 같은 React 루트에서 재현한다.
- 검색 JSON 일부가 실패하면 사용자가 검색 자료의 불완전함을 알 수 있는 오류 안내가 있어야 한다. 일부 결과를 계속 제공할지 여부는 강제하지 않으며, 전체 성공 시 후속 페이지의 글도 검색되는지 함께 확인한다. 이 테스트는 실제 HTTP 캐시나 SW 캐시 적중을 판정하는 테스트와 구분한다.
- `cache-probe.svg`는 같은 URL의 이미지 내용 갱신을 확인하는 에셋이다. 썸네일 표시 검증이 아니며, 새 맵 반영 이후 fetch한 본문과 캐시 재사용을 확인한다.
- `cache-load-gate.svg`는 `load` 이벤트를 늦추는 장치다. B 문서에 숨긴 eager 이미지를 삽입하고 [Nginx](../tests/nginx-delay.conf)에서 해당 응답만 초당 256바이트로 제한한다. 고유 query로 이전 이미지 캐시를 피한다. 자연 접속 결과와 이 통제 조건의 결과를 구분하며, 특정 실사이트 이미지가 원인이었다고 단정하지 않는다.
- 일반 갱신 시나리오는 HTTP TTL 경과를 기다린 뒤 접속하며 HTTP 캐시를 지우거나 요청을 모킹하지 않는다. 검색·태그 직접 접속 검증은 TTL 대기 없이 배포를 전환해 HTTP 재검증 경로도 확인한다. 오류 조건은 초기 스크립트에서 SW API 동작을 주입한다.
- 캐시 준비는 controller·맵·저장 응답 상태로 기다린다. `HIT-0-RTT`뿐 아니라 Nginx 요청 수가 늘지 않았는지도 확인한다. SW를 거친 응답이라는 사실이나 짧은 소요 시간만으로 캐시 적중을 판정하지 않는다.
- 첫 접속의 새 글 표시에는 `expect.soft`를 사용한다. 실패 상태를 유지한 채 맵 반영 뒤 에셋 갱신과 추가 새로고침 결과까지 수집하기 위한 것이다. 나중의 새로고침 성공으로 최초 실패를 덮지 않는다.
- 리포트의 `cache-evidence`에는 실제 첫 목록 응답과 문서/SW/캐시 버전, `nginx-access`에는 서버 요청 기록이 들어간다. `first-visit` 이미지는 추가 새로고침 전 화면이다. 실패 시 자동 스크린샷은 진단용 새로고침 이후일 수도 있으므로 첫 접속 판정에는 해당 첨부를 사용한다.
- 루트 동기화의 정책과 보장 범위는 [ETag-Map의 Checkpoint](ETag-Map.md#checkpoint)를 따른다. 이 테스트 통과가 여러 탭의 맵 충돌, 초기 에셋 전체의 최신성, GitHub Pages CDN 동작까지 보장하지는 않는다.

## 성능 수치 해석

- 각 조건을 5회 측정하고 `bootstrap-performance`에 원시 표본과 중앙값·최솟값·최댓값을 첨부한다. 재방문은 첫 설치와 제어된 방문으로 캐시를 채운 뒤 HTTP TTL이 지난 상태에서 측정한다.
- `app:cache-sync`는 SW 준비·맵 저장 확인을 기다린 시간이다. 최초 방문에는 SW 다운로드·설치·제어권 확보가 포함될 수 있으며, 기존 controller가 있는 재방문은 주로 메시지·로컬 저장을 기다린다. 등록이 끝나지 않는 조건은 완료되지 않는 Promise를 의도적으로 주입하며 약 2초의 타임아웃 비용을 확인한다.
- FCP는 첫 콘텐츠 표시, `app:hydrate-start`는 hydration 호출, 테마 버튼 마운트와 목록 DOM 표시는 각각 별도의 시점이다. 테마 버튼 클릭도 확인하지만 이 값들을 hydration 전체 완료 시간이나 사용자 입력 지연으로 해석하지 않는다.
- 로컬 Nginx·Chromium의 소수 표본이며 외부 폰트·CPU·스토리지·네트워크에 영향을 받는다. 서로 다른 캐시 준비 상태의 수치를 단순 비교해 개선율을 계산하거나, 100ms 미만 표본으로 실서비스 전체의 성능 상한을 판단하지 않는다.

# Diagram

```mermaid
flowchart LR
    App["앱·SSG 생성기"] --> Build["Node 빌드"]
    Fixture["테스트 글·에셋 A/B"] --> Build
    Build --> Volume["공유 볼륨 · 배포 A/B + site 링크"]
    Volume --> Nginx["Nginx · 정적 파일 + HTTP TTL 1초"]
    Config["Playwright 설정"] --> Runner["E2E·캐시·성능 프로젝트"]
    Runner -->|배포 링크 교체| Volume
    Runner --> Browser["Chromium · 테스트별 context"]
    Browser -->|동일 origin 요청| Nginx
    Nginx --> Logs["접근 로그"]
    Browser --> Report["HTML·JSON 리포트 · 첨부 · 실패 trace"]
    Logs --> Report
```
