---
title: "HTTP (5) - Header"
description: "HTTP 프로토콜의 헤더에 대해 알아봅니다."
date: "2025-06-30"
keywords: "HTTP, Network"
---

# Header 복습

Header 는 HTTP 요청의 목적지, 클라이언트의 정보 등 통신에 필요한 메타데이터를 담고 있습니다.

이러한 Header 는 없을수도 있지만, 대부분의 경우 매우 많은 Header 가 포함된체 요청과 응답이 이루어 집니다.

이러한 헤더는 `key: value` 형태로 이루어져 있습니다.

## 요청 시 주로 사용되는 Header

가장 기본이 되는 Header 는 `Host`, `User-Agent`, `Accept` 등이 있습니다.

```http:Request
GET /get HTTP/2
Host: httpbin.org
User-Agent: curl/8.5.0
Accept: */*

```
* `Host`: 요청을 보낼 호스트 이름
* `User-Agent`: 요청을 보낸 클라이언트의 정보
* `Accept`: 클라이언트가 수용할 수 있는 콘텐츠 유형

정리하면 현재 Request 메시지의 경우 Client 가 `curl` 이라는 프로그램을 사용하여 `httpbin.org` 서버에 GET 요청을 보냈으며, 이 요청은 `/get` 리소스를 대상으로 하고 있습니다. 또한, 클라이언트는 모든 콘텐츠 유형을 수용할 수 있다고 명시하고 있습니다.

만약 해당 통신을 브라우저에서 테스트 해볼 경우 `User-Agent` 에는 운영체제 및 아키텍처, 렌더링 엔진, 브라우저 버전 등의 정보를 포함하고 있습니다.

이밖에도 추가적으로 사용되는 Header 는 다음과 같습니다.
* `Referer`: 현재 요청이 발생한 페이지의 URL
* `Authorization`: 인증 정보를 포함하는 헤더로, API 키나 토큰 등을 전달

이중에서 `Authorization` 헤더는 보안과 관련된 중요한 정보를 포함하고 있어, API 요청 시 인증을 위해 자주 사용됩니다. 가장 기본이 되는 경우는 `Basic` 인증 방식인데요.

`Basic` 인증 방식은 사용자 이름과 비밀번호를 Base64로 인코딩하여 전달하는 방식입니다.

만약 `id` 가 `username` 이고, `password` 가 `1234` 라면,`username:1234` 를 Base64로 인코딩한 값인 `dXNlcm5hbWU6MTIzNA==` 를 Authorization 헤더에 포함시켜 요청을 보낼 수 있습니다.

```http:Request
Authorization: Basic dXNlcm5hbWU6MTIzNA==
```

Base64 인코딩은 암호화가 아니기 때문에 보안이 매우 약한 편입니다. 그렇기에 반드시 HTTP 가 아닌 HTTPS 프로토콜을 사용하여 암호화된 연결을 통해 전송해야 합니다. 그렇지 않으면 중간에 누군가가 이 정보를 쉽게 탈취할 수 있습니다.


## 응답 시 주로 사용되는 Header

```http:Response
HTTP/2 200
date: Tue, 24 Jun 2025 11:32:16 GMT
content-type: application/json
content-length: 253
server: gunicorn/19.9.0
access-control-allow-origin: *
access-control-allow-credentials: true
```

* `date`: 응답이 생성된 날짜와 시간
* `content-type`: 응답의 콘텐츠 유형, 여기서는 JSON 형식임을 나타냄
* `content-length`: Body 본문의 길이, 바이트 단위로 표시
* `server`: 응답을 처리한 서버의 정보, 여기서는 `gunicorn` 서버임을 나타냄, 이밖에도 Server 의 OS 정보나 버전 정보 등을 포함할 수 있음
* `access-control-allow-origin`: CORS 정책에 따라 어떤 도메인에서 이 리소스에 접근할 수 있는지 지정
* `access-control-allow-credentials`: CORS 요청 시 자격 증명(쿠키, 인증 헤더 등)을 포함할 수 있는지 여부를 나타냄

> CORS 는 Cross-Origin Resource Sharing 의 약자로, 다른 출처의 리소스에 대한 접근을 제어하는 메커니즘입니다. 이는 보안상의 이유로 브라우저가 다른 도메인에서 리소스를 요청할 때 제한을 두기 위해 사용됩니다.

이밖에도 Response 에 자주 포함되는 헤더들을 추가로 정리해 보겠습니다.
* `Allow`: 요청이 허용되는 HTTP 메서드 목록을 나타냄, 예를 들어 `GET`, `POST`, `PUT` 등이 포함될 수 있음
    - 405 를 응답하는 메시지에 Allow 헤더가 포함되어 있는 경우
* `Retry-After`: 클라이언트가 요청을 다시 시도해야 하는 시간을 나타냄, 주로 서버가 일시적으로 과부하 상태일 때 사용됨
    - `Retry-After: 3600` 는 1시간 후에 다시 시도하라는 의미
    - 보통 503 응답과 함께 사용
* `Location`: 리다이렉션이 필요한 경우, 새 URL을 지정하는 헤더
    - 300번대 응답에서 자주 사용됨
* `WWW-Authenticate`: 클라이언트가 인증을 요구하는 경우, 인증 방법을 지정하는 헤더
    - 401 Unauthorized 응답에서 사용됨

## 공통으로 사용되는 Header

* `Date`
* `Connection`: 연결의 상태를 나타내는 헤더로, `keep-alive` 또는 `close` 값을 가질 수 있음, TCP 연결을 유지할지 여부를 결정
* `Content-length`: 메시지 본문의 길이를 바이트 단위로 나타내는 헤더
* `Content-Encoding`: Body 가 압축되거나 변환되었을때 사용하는 헤더로, 클라이언트가 Body 를 해석할 때 필요한 정보를 제공
    - 예시: `Content-Encoding: gzip`, `Content-Encoding: deflate`
* `Content-Language`: Body 가 어떤 언어로 작성되었는지를 나타내는 헤더
    - 예시: `Content-Language: en-US`, `Content-Language: ko-KR`
    - `언어코드-국가코드` 형태로 작성됨, `en-KR` 는 영어를 사용하는 한국을 의미
* `Content-Type`: Body 에서 사용된 미디어 타입

***

# HTTP Basic 인증 과정

Auth 는 웹개발시 매우 중요한 부분으로, HTTP 프로토콜에서도 인증을 위한 다양한 방법이 존재합니다. 그 중 가장 기본적인 방법이 HTTP Basic 인증입니다.

1. 인증되지 않은 Client 가 서버에 GET 요청을 전송
2. Server 는 401 Unauthorized 응답을 반환하며, `WWW-Authenticate` 헤더에 인증 방법을 명시
    - 예시: `WWW-Authenticate: Basic realm="Access to the staging site"`
3. Client 는 사용자로부터 인증 정보를 입력받아, `Authorization` 헤더에 Base64로 인코딩된 사용자 이름과 비밀번호를 포함하여 다시 요청
    - 예시: `Authorization: Basic dXNlcm5hbWU6MTIzNA==`
4. Server 는 `Authorization` 헤더를 확인하고, 인증 정보를 검증
5. 인증이 성공하면, Server 는 요청에 대한 응답을 반환
    - `HTTP/2 200 OK`