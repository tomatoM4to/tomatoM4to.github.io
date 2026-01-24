---
title: "HTTP (6) - 기반 기술"
description: "HTTP 프로토콜의 기반 기술에 대해 알아봅니다."
date: "2025-07-01"
keywords: "HTTP, Network"
---

# Header

기반 기술이라 했지만 사실 Header 를 다루는 내용

이전까지 다룬 Header 는 기본적인 메타 데이터를 나타내는 Header 로서 이해하는데 큰 어려움이 없었을것

물론 여기서 소개하는것도 그렇게 어렵진 않지만 기술적인 내용이 좀 들어감

***

# Cache

Response 받은 자원의 사본을 Client 측에서 잠시 저장해두는 기술, 혹은 기법 이라고 할 수 있음

여기서 사본이라 함은 언제든 Server 측의 데이터와 달라질 수 있다는것

그러므로 개발자는 Cache 를 사용함으로써 비용적 절감과 Client 와 Server 간의 불일치되는 데이터들을 최소화 할 수 있도록 해야함

> 이렇게 Cache 된 데이터가 얼마나 최신 원본 데이터와 유사한지를 나타내는 표현으로서 Cache freshness 라고 함

실제 웹사이트들은 Server 의 비용을 줄이기 위해 Cache 를 적극적으로 활용함

웹개발에서 사용되는 Cache 는 크게 두가지로 구분됨

* Private Cache : 클라이언트 측에서만 사용하는 Cache, 각 Client 개인별로 저장됨
* Public Cache : Client 와 Server 사이에 위치하여 여러 클라이언트가 공유하는 Cache

캐싱을 적용하고 싶다면 Header 에 `Cache-Control` 이라는 Header 를 사용하여 Cache 의 동작 방식을 제어 해야 함

만약 명시적으로 Cache 를 사용하지 않으려면 `Cache-Control: no-store` 를 사용하여 Cache 를 비활성화 할 수 있음

자주 쓰이는 예시

| Cache-Control Header | 의미 |
|----------------------|------|
| `no-cache`           | Cache 를 사용하되, 항상 재검증 필요 |
| `no-store`           | Cache 를 사용하지 않음 |
| `max-age=3600`       | Cache 를 1시간 동안 유효하게 유지 |
| `public`             | 공용 캐시 혀용 |
| `private`            | 브라우저 캐시에만 저장 |
|`max-age=3600`        | Cache 를 1시간 동안 유효하게 유지 |

여기선 Private Cache 에 대해 서만 알아볼 예정, Public Cache 는 별도의 주제로 다루어질 예정

## Cache freshness 검사

가장 기본적인 방법으론 HTTP 응답 시 `Cache-Control` 헤더를 사용하여 Cache 의 유효 기간을 설정하는 것

해당 Header 는 해당 Response 를 Caching 할 때, Cache 가 얼마나 오랫동안 유효한지를 나타냄

아래 예시는 `GET /profile.jpg HTTP/1.1` 요청에 대한 응답으로, `Cache-Control` 헤더를 사용하여 Cache 의 유효 기간을 설정하는 방법을 보여줌

```http:Response
HTTP/1.1 200 OK
Cache-Control: private, max-age=3600
Content-Type: image/jpeg
```
> 여기서는 `max-age=3600` 으로 설정되어 있어, 응답이 1시간 동안 유효함을 나타냄

이후 브라우저는 해당 Response 를 캐시에 저장하고, `max-age` 시간 동안 서버에 다시 요청하지 않음

> Cache 는 개발자가 직접 제어할 수 있는 부분이지만, 기본적으론 브라우저가 Cache 를 관리함, `Cache-Control` 헤더를 잘 설정하면 브라우저가 Cache 를 효율적으로 관리할 수 있으므로 매우 중요한 옵션임

## Etag

유용한 Cache 지만 지나친 Cache 는 Server 측의 데이터와 불일치되는 문제를 발생시킬 수 있음

그러므로 Cache 를 사용할 때는 Cache 가 최신 상태인지 확인하는 방법이 필요함

이를 위해 `Etag`, `If-None-Match` 헤더를 사용함

**Etag 기반 캐시 흐름**

```http:첫번째-Request
GET /data.json HTTP/1.1
```

```http:첫번째-Response
HTTP/1.1 200 OK
ETag: "v1"
```

이후 브라우저는 Response 를 캐시하고 `Etag "v1"` 을 저장

> `Etag` 는 서버가 해당 리소스의 버전을 식별하는 문자열로, 리소스가 변경될 때마다 새로운 `Etag` 값을 생성함, `Etag` 값은 Base64 인코딩이나 해시값 등 다양한 형식으로 표현될 수 있음

```http:두번째-Request
GET /data.json HTTP/1.1
If-None-Match: "v1"
```

> `If-None-Match` 헤더는 브라우저가 이전에 받은 Etag 값을 서버에 전달함, 만약 `Etag` 값이 서버의 데이터와 일치한다면 해당 데이터는 변경되지 않았다는 거고, 일치하지 않는다면 데이터가 변경되었다는 거임

이후 `data.json` 의 데이터가 변경되지 않았다면 서버는 `304 Not Modified` 응답을 보내고, 브라우저는 캐시된 데이터를 사용함

만약 데이터가 변경되었다면 서버는 새로운 `Etag` 값을 포함한 `200 OK` 응답을 보내고, 브라우저는 새로운 데이터를 캐시함

```http:변경되지-않았을때-Response
HTTP/1.1 304 Not Modified
```

```http:변경되었을때-Response
HTTP/1.1 200 OK
ETag: "v2"
```

***

# Cookie

이전에 **HTTP 는 상태를 유지하지 않는 State-less 프로토콜** 이라고 했었음

하지만 이렇게 모든 HTTP 의 요청이 독립적이라면, 어떻게 사용자를 식별하고 유지할 수 있을까?

이렇듯 사용자의 상태를 유지하기 위해 HTTP 에서 사용되는 기술이 Cookie 임, 유투브 동영상을 볼때마다 구글 로그인을 할 수는 없으니까

기본적으로 Cookie 는 **서버가 클라이언트에게 보내는 작은 데이터 조각**으로, 클라이언트는 이 데이터를 저장하고 이후 요청 시 서버에 다시 전송함

그러므로 이러한 과정으로 HTTP 요청으로 사용자의 상태를 유지할 수 있음, 해당 예시는 **Session 인증** 라고 불리는 방식의 과정을 간략하게 설명한 것

> Session 이란 서버가 클라이언트의 상태를 유지하기 위해 사용하는 기술로, 클라이언트가 서버에 로그인하면 서버는 해당 클라이언트에 대한 정보를 저장하고, 이후 요청 시 이 정보를 사용하여 클라이언트를 식별함

1. Client 가 서버에게 로그인 요청을 보냄 (id, password 등)
2. 서버는 해당 요청을 처리하고, 해당 요청이 성공적이라면, 클라이언트에게 Session ID 를 포함한 Cookie 를 응답함
3. Client 는 이 Cookie 를 저장
4. Client 는 이후 해당 서버에 요청 시 이 Cookie 를 포함해 요청함
5. 서버는 요청을 받으면, 해당 Cookie 를 확인하여 클라이언트를 식별하고, 필요한 작업을 수행함

> 부스러기 같다 하여 Cookie 라고 불림
>
> Cookie 를 서버로부터 전달 받는다면, 이후 브라우저는 해당 Server 에 요청을 보낼때 자동으로 Cookie 를 포함하여 요청함

기본적으로 `<이름, 값>` 쌍의 형태를 가지고, 대표적으로 인증을 위해 사용하기도 하지만 다양한 용도로 사용될 수도 있음

이렇게 Request 와 Response 에서 Cookie 를 주고 받는 방식으로 HTTP 의 상태를 유지할 수 있음

그리고 Request 와 Response 시 Header 가 약간 다름

* `Set-Cookie` : 서버가 클라이언트에게 Cookie 를 설정할 때 사용함
* `Cookie` : 클라이언트가 서버에 요청할 때 사용하는 Header 로, 클라이언트가 저장한 Cookie 를 서버에 전송함

## Cookie 속성

TODO: 사진, Application → Storage → Cookies

Value 외에도 다양한 속성을 가질 수 있음

* domain : Cookie 가 유효한 도메인, 기본적으로 현재 도메인, naver.com 에서 발생된 Cookie 를 google.com 에서 사용할 수 없음
* path : Cookie 가 유효한 경로, 기본적으로 현재 경로, `/` 로 설정하면 해당 도메인의 모든 경로에서 유효함
    - `example.com/path` 와 `example.com/otherpath` 에서 각각 다른 Cookie 를 설정할 수 있음
    - `example.com/path` 에서 설정된 Cookie 는 지정된 경로 외에도 `/path` 하위 경로에서도 유효함
* Max-Age : Cookie 의 유효 기간, 초 단위로 설정함, 기본적으로 브라우저가 종료될 때까지 유효함
* Expires : Cookie 의 만료 날짜, `Max-Age` 와 함께 사용되며, `Max-Age` 가 우선됨
* Secure : HTTPS 연결에서만 Cookie 를 전송함, HTTP 연결에서는 전송되지 않음
* HttpOnly : JavaScript 에서 Cookie 를 접근할 수 없도록 함, XSS 공격을 방지하기 위해 사용됨
* SameSite : CSRF 공격을 방지하기 위해 사용됨, `Strict`, `Lax`, `None` 중 하나의 값을 가짐
    - `Strict` : 동일한 사이트에서만 Cookie 를 전송함, 가장 안전한 옵션
    - `Lax` : 동일한 사이트 또는 안전한 HTTP 메서드(예: GET)로 요청할 때만 Cookie 를 전송함, 적절한 보안과 편의성을 제공함
    - `None` : 모든 요청에 대해 Cookie 를 전송함, 반드시 `Secure` 속성과 함께 사용해야 함

> CSRF 공격
> 1. 사용자가 로그인한 상태에서 악성 사이트 방문
> 2. 악성 스크립트가 `POST https://yourbank.com/transfer` 요청 시도
> 3. 브라우저는 기존 쿠키(sessionId)를 자동 포함
> 4. 서버는 요청을 신뢰하고 수행 → 피해 발생

이렇듯 Cookie 는 탈취당할 시 보안에 큰 위협이 될 수 있으므로, 적절한 속성을 설정하여 보안을 강화해야 함

아래 예시는 적절한 보안 설정을 갖춘 Cookie 의 예시임

```http:Response
HTTP/1.1 200 OK
Set-Cookie: sessionId=abc123; Path=/; HttpOnly; Secure; SameSite=Lax
```

***

# Web Storage

이전에 설명했던 Cache 나 Cookie 는 브라우저가 자동으로 관리하는 기술이었음, 물론 개발자가 직접 제어할 수 있지만, 브라우저가 자동으로 관리해줌

하지만 개발자가 직접 데이터를 저장하고 관리할 수 있는 기술도 있음, 바로 Web Storage 임

Web Storage 는 브라우저가 제공하는 API 로, 클라이언트 측에서 데이터를 저장하고 관리할 수 있는 기술임, HTTP 요청과는 별개로 동작함

그리고 Cache 나 Cookie 보다 더 많은 데이터를 저장할 수 있음

Web Storage 는 크게 두 가지로 구분됨
* Local Storage : 브라우저에 데이터를 영구적으로 저장함, 브라우저를 닫아도 데이터가 유지됨
* Session Storage : 브라우저 세션 동안 데이터를 저장함, 브라우저를 닫으면 데이터가 사라짐

TODO: 사진, Application → Storage → Local Storage

***

# Accept

HTTP 가 발전하고 Web 시장이 성장함에 따라서 같은 HTTP 요청에 대해서 다양한 형태의 Response 를 제공할 수 있는 방법이 필요해짐

예를들어, 사용자가 영어를 사용하는 경우와 한국어를 사용하는 경우에 따라 같은 `GET /index.html` 요청에 대해 다른 HTML 문서를 제공할 수 있어야 함

이러한 기능을 제공하기 위해 HTTP 에서 사용되는 기술이 Accept 헤더임

* `Accept`: 선호하는 미디어 타입
* `Accept-Language`: 선호하는 언어
* `Accept-Encoding`: 선호하는 인코딩 방식

```http:Request
GET /index.html HTTP/1.1
Accept: text/html
Accept-Language: en-US
```

해당 요청은 `text/html` 형식의 응답을 선호하며, 영어(미국)로 응답을 받고 싶다는 의미임