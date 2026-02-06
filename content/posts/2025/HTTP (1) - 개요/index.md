---
title: "HTTP (1) - 개요"
description: "HTTP 프로토콜의 기본 개념과 동작 방식에 대해 알아봅니다."
date: "2025-06-24"
keywords: "HTTP, Network"
---

**Reference**
* [https://youtu.be/N_qURj2Wtn8?si=W50nFs9gqRjnJb1h](https://youtu.be/N_qURj2Wtn8?si=W50nFs9gqRjnJb1h)
* [https://developer.mozilla.org/ko/docs/Web/HTTP](https://developer.mozilla.org/ko/docs/Web/HTTP)

# Http 의 4가지 특성

## 요청-응답 기반 프로토콜
- 서버 클라이언트 모델
- Request 가 주어지면 서버는 Response 를 반환, 이 두 메시지는 서로 다른 형태를 가짐

## 미디어 독립적 프로토콜
- HTTP 는 텍스트, 이미지, 비디오 등 다양한 형태의 데이터를 전송할 수 있음
- HTTP 는 그저 데이터 전송을 위한 Interface 역할을 함
- HTML, WEBP, PNG, JSON, PDF 등등
- 파일을 식별하기 위해 확장자를 사용하든 HTTP 에선 **Media Type** 를 이용하여 메세지 가 어떤 형식인지 알려줌
- 예를 들어, `Content-Type: text/html` 이라고 하면 HTML 문서
- 타입은 `type/subtype` 형태로 표현됨
- 예시: `text/html`, `image/webp`, `application/json`
- `*` 와 같은 와일드카드를 사용하여 모든 타입을 지정할 수도 있음
- 예시: `image/*`, `application/*`

**자주 사용되는 미디어 타입 정리**
| 타입 | 타입 설명 | 서브타입 | 서브타입 설명 |
|------|-----------|----------|----------------|


## 상태를 유지하지 않는 프로토콜

일반적으로 HTTP 는 한 서버가 많은 클라이언트의 요청을 처리할 수 있도록 설계됨, 만약 서버가 모든 클라이언트의 상태를 기억한다면 서버의 부하가 증가하고 확장성이 떨어짐

추가적으로 현대의 웹 애플리케이션은 종종 여러 서버에 걸쳐 분산되어 있기 때문에, 각 서버가 클라이언트의 상태를 기억하는 것은 복잡도가 증가하게 되고 중복되는 상태 정보를 저장하는 등 비효율적인 구조가 될 수 있음

결국 Stateless 한 특성은 Client 가 얼마든지 확장되어도 서버는 문제없이 처리할 수 있도록 해줌

- Stateless Protocol 이라 불림
- Server 가 HTTP 요청을 보낸 Client 와 관련된 상태를 기억하지 않는다는 의미
- Client 의 모든 HTTP 요청은 기본적으로 독립적인 요청으로 간주
- 그렇기 때문에, 로그인 세션, 장바구니 등과 같은 상태 정보를 유지하려면 별도의 메커니즘이 필요

하지만 이러한 방식은 확장성(scalability) 엔 도움이 되지만 같은 요청을 다시 보내야 하는 경우(예: 페이지 새로고침) 단점이 될 수 있음

이러한 단점을 해결하기 위해 Cookie, Cache, WebStorage 와 같은 방식과 함께 사용됨, 이후 알아볼 예정


## 지속 연결을 지원하는 프로토콜

**Persistent Connection** OR **Keep-Alive Connection** 라고도 불림

결론부터 말하면 하나의 TCP 연결상에서 여러 개의 Request-Response 쌍을 처리할 수 있는 기술을 의미함

**비지속 연결의 특징**
- HTTP 1.0 이하 버전에서 사용됨
- TCP 연결 수립 후, 요청에 대한 응답을 받으면 연결 종료
- 추가적인 Request-Response 쌍을 처리하기 위해선 다시 TCP 연결 수립부터 반복

**지속 연결의 특징**
- HTTP 1.1 이상에서 기본적으로 지원됨
- 하나의 TCP 연결을 통해 여러 개의 Request-Response 쌍을 처리

***

# HTTP 메시지 구조

기본적으로 HTTP 1.1 버전을 기준으로 개념적으로 설명할 예정, 이후 실제로 어떻게 생겼는지 알아볼 예정

* 가장 많이 사용되는 HTTP 버전
* 평문 형태의 메시지라 읽기가 쉽고, 디버깅이 용이함

기본적으로 HTTP 메시지는 크게 두 부분으로 나뉨
1. Start Line
    - Start Line 은 메시지의 첫 번째 줄로, 요청(Request) 또는 응답(Response)의 종류와 관련된 정보를 포함
    - Request 의 경우 `GET /index.html HTTP/1.1` 와 같은 형태로, 요청의 종류와 대상, HTTP 버전을 포함
    - Response 의 경우 `HTTP/1.1 200 OK` or `HTTP/1.1 404 Not Found` 와 같은 형태로, HTTP 버전과 상태 코드, 상태 메시지를 포함
2. Header Line
    - HTTP 통신을 하기 위해 필요한 부가 정보를 포함
    - 0개 일 수도 있음, 하지만 실제론 굉장히 많은 header 가 포함되어 있음
    - `:` 기준으로 header-name 과 하나 이상의 header-value 로 구성
    - 예시: `Content-Type: text/html`, `User-Agent: Mozilla/5.0`
2. Body
    - 실제 데이터가 포함되는 부분
    - Request의 경우, 서버에 전송할 데이터가 포함되고, Response의 경우, 서버가 클라이언트에 전송할 데이터가 포함됨
    - 선택적 부분으로, 필요하지 않은 경우 비워둘 수 있음
    - 예시: HTML 문서, JSON 데이터, 이미지 파일 등

이전에 Http 는 데이터 종류에 상관없이 전송할 수 있는 플로토콜 이기에 Body 엔 다양한 형태의 데이터가 포함될 수 있음, 그러기에 학습하는 입장에선 Header Line 의 구조를 이해하는것이 중요함


## CURL 로 HTTP 메시지 구조 확인하기

Http 구조를 확인하기 위한 아주 좋은 도구와 서비스가 있음

`curl` 명령어는 HTTP 요청을 보내고 응답을 받을 수 있는 커맨드라인 도구로, HTTP 메시지의 구조를 확인하는 데 유용함

그리고 `httpbin.org` 는 HTTP 요청을 테스트할 수 있는 서비스로, 다양한 HTTP 요청을 보내고 그 결과를 확인할 수 있음

```bash
curl -v https://httpbin.org/get
```

`-v` 옵션은 verbose 모드로, 요청과 응답의 상세 정보를 출력함

결과적으로 아래의 Request 메시지를 확인할 수 있음, 해당 메시지를 `httpbin.org` 서버에 GET 요청을 보낸거임

```http:Request
GET /get HTTP/2
Host: httpbin.org
User-Agent: curl/8.5.0
Accept: */*

```

빈줄 뒤에 아무것도 없는것을 보니 Body 가 없는 Request 메시지임, 각각의 줄은 다음과 같은 의미를 가짐

1. Start Line
   - `GET /get HTTP/2` : GET 메서드를 사용하여 `/get` 리소스를 요청하며, HTTP 버전은 2임
2. Header Line
    - `Host: httpbin.org` : 요청을 보낼 호스트 이름
    - `User-Agent: curl/8.5.0` : 요청을 보낸 클라이언트의 정보
    - `Accept: */*` : 클라이언트가 어떤 타입의 응답을 받을 수 있는지 지정, 여기서는 모든 타입을 허용함

그에 대한 Response 메시지 또한 확인할 수 있음

```http:Response
HTTP/2 200
date: Tue, 24 Jun 2025 11:32:16 GMT
content-type: application/json
content-length: 253
server: gunicorn/19.9.0
access-control-allow-origin: *
access-control-allow-credentials: true

{
  "args": {},
  "headers": {
    "Accept": "*/*",
    "Host": "httpbin.org",
    "User-Agent": "curl/8.5.0",
    "X-Amzn-Trace-Id": "Root=1-685a8cc0-0a2a718351292ebf71b68461"
  },
  "origin": "your_ip_address",
  "url": "https://httpbin.org/get"
}
```

1. Start Line
   - `HTTP/2 200` : HTTP 버전과 상태 코드
2. Header Line
    - `date: Tue, 24 Jun 2025 11:32:16 GMT` : 요청이 처리된 날짜와 시간
    - `content-type: application/json` : 응답의 콘텐츠 타입
    - `content-length: 253` : 응답 본문의 길이
    - `server: gunicorn/19.9.0` : 서버 정보
    - `access-control-allow-origin: *` : CORS 정책
    - `access-control-allow-credentials: true` : CORS 정책
3. Body
    - JSON 형태로 body 를 받았음