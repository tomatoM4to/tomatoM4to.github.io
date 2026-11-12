# Overview
[Rethinking Web Caching: An Optimization for the Latency-Constrained Internet](https://conferences.sigcomm.org/hotnets/2024/papers/hotnets24-124.pdf) (HotNets 2024)의 검증 토큰 선전달 아이디어를 정적 배포에 적용한다. 빌드에서 계산한 버전 맵을 HTML로 전달해 리소스별 재검증 왕복을 줄이며, HTML 내비게이션은 네트워크를 우선한다.

# Checkpoints

배포 단위의 최신성은 [설계 정책](design-decisions.md#설계-전제와-정책), 버전 판정·동기화 대기·배포 혼용의 비용은 [트레이드오프](design-decisions.md#수용한-트레이드오프), 캐시 적중과 실패·오프라인 동작은 [알려진 제약](design-decisions.md#지원-범위와-알려진-제약)을 따른다.

- 맵 키는 디코딩된 URL 경로다. `/index.html`은 `/`, 다른 HTML은 확장자를 뺀 경로로 등록하며 `server/`와 `template.html`은 제외한다. 생성기와 SW가 경로를 다르게 해석하면 버전 비교가 성립하지 않는다. [맵 생성](../scripts/inject-etag-map.js) · [Service Worker](../public/sw.js)
- `$&`, `$$`도 허용된 이름의 일부다. 맵 주입에서 치환 토큰으로 해석하거나 스크립트 경계를 바꾸지 않도록 원문 키를 보존한다. [주입 회귀 테스트](../server/inject-etag-map.test.ts) · [태그 URL E2E](../tests/e2e/content-urls.spec.ts)
- 맵 저장·조회는 URL이 아닌 브라우저의 클라이언트 ID로 연결한다. `UPDATE_ETAG_MAP`의 `event.source.id`와 fetch의 `event.clientId`가 같은 문서를 식별해야 하며, 같은 URL로 연 문서도 서로의 맵을 덮지 않아야 한다. [문서별 맵 테스트](../tests/cache/client-maps.spec.ts)
- `ETAG_MAP_READY`의 `protocolVersion: 1`은 문서별 맵 저장·조회 지원을 뜻한다. 버전 없는 ACK는 전역 맵 워커도 보낼 수 있으므로 준비 완료로 인정하지 않는다. `load`나 메시지 전송 완료가 아닌 Cache Storage 저장 완료를 확인하고, 준비 중 controller가 바뀌면 이전 controller의 ACK는 인정하지 않는다. [동기화 구현](../src/lib/serviceWorker.ts) · [업그레이드 테스트](../tests/cache/upgrade.spec.ts)
- API 우회의 `__sw_bypass`는 요청마다 고유해야 ACK를 모르는 이전 SW도 같은 URL의 응답을 재사용하지 못한다. 현재 SW와 [전역 맵 워커 fixture](../tests/fixtures/sw-global.js)는 해당 query를 제거해 네트워크로 전달하되 캐시 조회·저장을 생략한다. [초기화 실패 테스트](../tests/cache/bootstrap.spec.ts)
- SW 종료 뒤에도 판정 기준을 복구하도록 문서별 맵을 Cache Storage에 보관한다. 종료된 문서와 이전 전역 맵은 정리하되, 정리 실패가 유효한 맵의 저장 ACK를 막아서는 안 된다. 활성화 시에는 `tomato-etag-cache-`로 시작하는 블로그의 이전 캐시만 삭제해 같은 출처의 다른 앱 캐시를 보존한다. [Service Worker](../public/sw.js) · [활성화 회귀 테스트](../server/service-worker.test.ts)
- 내비게이션·`.html`·`/`·`/posts/`는 HTML의 네트워크 우선 경로다. `/api/posts/`는 글 URL과 이름이 비슷해도 에셋·API의 버전 비교 대상으로 유지한다. [요청 분기](../public/sw.js)

# Diagrams
## 버전 맵 전달과 요청 처리 정책
빌드에서 만든 맵이 SW에 전달되는 경로와, 요청 종류·버전 일치·네트워크 실패에 따라 응답을 선택하는 기준을 보여준다.

```mermaid
flowchart TD
    Build["빌드 · 버전 맵 계산"] --> HTML["HTML · window.__ETAG_MAP__"]
    HTML --> Client["클라이언트 · UPDATE_ETAG_MAP"]
    Client -->|source.id| Map["Cache Storage · /__etag_map__/clientId"]
    Map --> Ack["저장 완료 응답 · protocolVersion 1"]
    Ack --> Hydrate["hydrateRoot · 페이지 effect 시작"]
    Client -->|미지원·실패·시간 초과·controller 전환| Bypass["API 캐시 우회 설정"]
    Ack -->|현재 controller 확인| Resume["API 캐시 사용 재개"]
    Bypass --> Hydrate

    Request["SW가 제어하는 요청"] --> Scope{"동일 출처 GET?"}
    Scope -->|아니오| Browser["브라우저 기본 처리"]
    Scope -->|예| Nav{"내비게이션 또는 HTML 경로?"}
    Nav -->|예| Network["네트워크 요청"]
    Nav -->|아니오| Match{"캐시와 맵의 버전이 모두 있고 일치?"}
    Map -.->|요청 clientId의 맵| Match
    Match -->|예| Hit["캐시 응답 · HIT-0-RTT"]
    Match -->|아니오| Network
    Network -->|정상 응답| Save["네트워크 응답 반환 + 비동기 캐시 저장"]
    Network -->|HTTP 오류| HttpError["오류 응답 반환 · 저장 안 함"]
    Map -.->|버전이 있는 에셋·API에 X-SW-ETag 부여| Save
    Network -->|요청 실패| Cached{"기존 캐시 있음?"}
    Cached -->|예| Fallback["기존 캐시 응답"]
    Cached -->|아니오| Error["요청 실패"]
```

## 재방문 시 캐시 조회와 갱신 순서
SW가 제어하는 온라인 재방문에서 React의 초기 effect 요청이 실행되는 순서다. 브라우저가 hydration 이전에 시작한 에셋 요청은 이 순서에 포함하지 않는다.

```mermaid
sequenceDiagram
    participant B as 브라우저 · 페이지 코드
    participant W as Service Worker
    participant C as Cache Storage
    participant S as GitHub Pages

    B->>W: HTML 내비게이션
    W->>S: HTML 요청 · 네트워크 우선
    S-->>W: HTML + 빌드 시 주입한 버전 맵
    par HTML 캐시 저장
        W->>C: HTML 응답 복사본 저장
    and 페이지 응답
        W-->>B: HTML 반환
    end
    Note over B,W: load 대기 없이 현재 controller에 맵 전달
    B->>W: UPDATE_ETAG_MAP · window.__ETAG_MAP__
    W->>C: /__etag_map__/clientId 저장
    C-->>W: 저장 완료
    W-->>B: ETAG_MAP_READY
    B->>B: hydrateRoot · 초기 effect 실행

    loop 동일 출처 에셋·API 요청
        B->>W: 리소스 요청
        W->>C: 캐시 응답과 요청 clientId의 버전 맵 조회
        C-->>W: 캐시의 X-SW-ETag + 맵의 현재 버전
        W->>W: 디코딩한 경로로 버전 비교
        alt 캐시가 있고 두 버전이 일치
            W-->>B: 캐시 응답 · HIT-0-RTT
            Note over W,S: 리소스 재검증 요청 없음
        else 캐시 없음 또는 버전 불일치·누락
            W->>S: 리소스 요청
            S-->>W: 리소스 응답
            par 캐시 저장
                W->>C: 응답 복사본 저장<br/>맵에 버전이 있으면 X-SW-ETag 부여
            and 페이지 응답
                W-->>B: 네트워크 응답 반환
            end
        end
    end
    Note over B,C: 문서마다 자기 맵으로 버전을 판정<br/>다른 문서의 맵 전송은 자기 맵에 영향을 주지 않음
```

# Tests

[문서별 맵 테스트](../tests/cache/client-maps.spec.ts)는 이전 문서가 맵을 다시 보낸 뒤 새 문서의 목록 요청, SW 재시작 후 캐시 재사용, 맵 없는 문서의 네트워크 요청, 종료된 문서와 이전 전역 맵의 정리를 검증한다. [기존 배포 갱신 테스트](../tests/cache/refresh.spec.ts)는 문서별 맵을 조회해 첫 목록 응답과 캐시 버전의 근거를 기록한다. 실행 방법은 [테스트 문서](testing.md)를 따른다.

[업그레이드 테스트](../tests/cache/upgrade.spec.ts)는 과거 전역 맵 워커를 실제로 설치한 Chromium에서 설치 지연·실패, 두 문서의 맵 재전송, controller 전환 중 저장 지연·시간 초과와 늦은 ACK, 전환 후 SW 재시작을 검증한다. 표시 목록·실제 ACK·응답 헤더와 Nginx 요청 수를 함께 확인한다.
