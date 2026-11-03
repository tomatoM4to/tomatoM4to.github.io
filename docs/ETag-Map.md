# Overview
[Rethinking Web Caching: An Optimization for the Latency-Constrained Internet](https://conferences.sigcomm.org/hotnets/2024/papers/hotnets24-124.pdf) (HotNets 2024)의 검증 토큰 선전달 아이디어를 정적 배포에 적용한다. 빌드에서 계산한 버전 맵을 HTML로 전달해 리소스별 재검증 왕복을 줄이며, HTML 내비게이션은 네트워크를 우선한다.

# Checkpoint
- 이 맵은 HTTP 서버의 `ETag` 응답 헤더가 아닌 자체 버전 정보다. [생성기](../scripts/inject-etag-map.js)는 JSON·HTML·MD를 MD5로 계산하고, 글 HTML은 원본 Markdown 해시를 사용한다. 나머지 에셋은 `파일명-크기`이므로 같은 이름·크기의 내용 변경을 구분하지 못한다.
- 키는 디코딩된 URL 경로다. `/index.html`은 `/`, 다른 HTML은 확장자를 뺀 경로로 등록하며, `server/`와 `template.html`은 맵에서 제외한다. [Service Worker](../public/sw.js)도 조회 전에 `pathname`을 디코딩한다.
- [클라이언트 진입점](../src/entry-client.tsx)은 프로덕션에서만 SW를 등록한다. 페이지 load 후 등록 완료 시점과 `controllerchange`에 `window.__ETAG_MAP__`을 전달하고, SW는 `/__etag_map__`에 저장한다. SPA 이동만으로 새 맵을 받지는 않는다.
- 최초 방문에 에셋을 미리 캐시하지 않는다. SW가 제어하는 요청으로 응답과 `X-SW-ETag`가 저장된 뒤에야 버전 일치 시 `HIT-0-RTT` 응답이 가능하다. 맵에 버전이 없는 리소스는 이 경로로 반환하지 않는다.
- 네트워크 우선 대상은 내비게이션, `.html`, `/`, `/posts/` 경로다. `/api/posts/`는 버전 비교 대상이다. HTML에 맵 항목이 있어도 HTML 요청에서는 버전 비교를 생략한다.
- 네트워크 요청이 실패하면 기존 캐시를 사용하므로 오프라인 응답은 오래된 버전일 수 있다. 캐시가 없는 요청은 실패하며, HTTP 오류 상태는 별도로 검사하지 않아 404·500 응답만으로 캐시 fallback이 실행되지는 않는다.

# Architecture
## 버전 맵 전달과 요청 처리 정책
빌드에서 만든 맵이 SW에 전달되는 경로와, 요청 종류·버전 일치·네트워크 실패에 따라 응답을 선택하는 기준을 보여준다.

```mermaid
flowchart TD
    Build["빌드 · 버전 맵 계산"] --> HTML["HTML · window.__ETAG_MAP__"]
    HTML --> Client["클라이언트 · UPDATE_ETAG_MAP"]
    Client --> Map["Cache Storage · /__etag_map__"]

    Request["SW가 제어하는 요청"] --> Scope{"동일 출처 GET?"}
    Scope -->|아니오| Browser["브라우저 기본 처리"]
    Scope -->|예| Nav{"내비게이션 또는 HTML 경로?"}
    Nav -->|예| Network["네트워크 요청"]
    Nav -->|아니오| Match{"캐시와 맵의 버전이 모두 있고 일치?"}
    Map -.-> Match
    Match -->|예| Hit["캐시 응답 · HIT-0-RTT"]
    Match -->|아니오| Network
    Network -->|응답 수신| Save["네트워크 응답 반환 + 비동기 캐시 저장"]
    Map -.->|버전이 있는 에셋·API에 X-SW-ETag 부여| Save
    Network -->|요청 실패| Cached{"기존 캐시 있음?"}
    Cached -->|예| Fallback["기존 캐시 응답"]
    Cached -->|아니오| Error["요청 실패"]
```

## 재방문 시 캐시 조회와 갱신 순서
SW가 제어하는 온라인 재방문의 흐름이다. 리소스 요청은 맵 저장 이후를 예로 들며, 실제 초기 로딩 요청과 맵 전달은 동기화되어 있지 않다.

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
    Note over B,W: load 후 SW 등록 완료 시 맵 전달<br/>controllerchange 시에도 전달
    B->>W: UPDATE_ETAG_MAP · window.__ETAG_MAP__
    W->>C: /__etag_map__ 저장

    loop 동일 출처 에셋·API 요청
        B->>W: 리소스 요청
        W->>C: 캐시 응답과 버전 맵 조회
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
    Note over B,C: 새 HTML의 맵으로 교체되면<br/>변경된 버전의 리소스는 다음 요청에서 다시 받음
```
