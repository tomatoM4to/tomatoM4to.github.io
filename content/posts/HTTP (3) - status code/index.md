---
title: "HTTP (3) - Status Code"
description: "HTTP 프로토콜의 상태 코드에 대해 알아봅니다."
date: "2025-06-28"
keywords: "HTTP, Network"
---

# Http 상태 코드

Http 메서드는 Client 가 Server 에게 요청을 보낼 때 사용되는 방법이라면, Http 상태 코드는 Server 가 Client 의 요청에 대한 응답을 나타내는 코드임

* 100번대 : 정보성 상태 코드
* 200번대 : 성공 상태 코드
* 300번대 : 리다이렉션 상태 코드
* 400번대 : 클라이언트 오류 상태 코드
* 500번대 : 서버 오류 상태 코드

100번대는 거의 사용하지 않음, 이또한 완전히 구분되는 경우보다 모호한 경우가 많기에 개발자가 어떻게 설계하는지에 달려있음

다른 상태 코드는 명확하다 300번대가 살짝 모호할 수 있으니 따로 설명하겠음

***

# 200번대 상태 코드

**요청이 성공했음** 을 의미

| 상태 코드 | 설명 |
| ---------- | ---- |
| 200 OK | 요청이 성공적으로 처리됨 |
| 201 Created | 요청이 성공적으로 처리되었고, 새로운 리소스가 생성됨 |
| 202 Accepted | 요청이 수락되었지만, 아직 요청한 작업을 끝내지 않았음 |
| 204 No Content | 요청이 성공했지만, 반환할 콘텐츠가 없음 |

***

# 300번대 상태 코드

먼저 공식문서에서 말하는 Redirect 상태 코드의 정의를 살펴보자

> The 3xx (Redirection) class of status code indicates that further action needs to be taken by the user agent in order to fulfill the request. There are several types of redirects
>
> [https://www.rfc-editor.org/rfc/rfc9110#name-redirection-3xx](https://www.rfc-editor.org/rfc/rfc9110#name-redirection-3xx)

상황으로 설명하는것이 가장 이해하기가 쉬운데, 이런 상황을 가정 할 수 있음

> 1. 사용자가 A 페이지를 요청했는데, 해당 페이지가 B 페이지로 이동되었음
> 2. 이때 서버는 `301 Moved Permanently` 상태 코드를 반환하고, `Location` 헤더에 B 페이지의 URL을 포함하여 클라이언트에게 알려줌
> 3. Client 는 이 정보를 바탕으로 자동으로 B 페이지를 새로 요청하게 됨 (브라우저의 경우 자동 처리됨)

이를 HTTP 메시지 흐름으로 표현하면 다음과 같음

```
1. 클라이언트 → 서버
GET /A HTTP/1.1
Host: example.com

2. 서버 → 클라이언트
HTTP/1.1 301 Moved Permanently
Location: /B

3. 클라이언트 → 서버
GET /B HTTP/1.1
Host: example.com

4. 서버 → 클라이언트
HTTP/1.1 200 OK
Body: (B 페이지의 실제 콘텐츠)
```

이렇듯 Client 즉 브라우저는 300번대 상태 코드를 받으면 헤더에 `Location` 이라는 필드를 확인하고, 해당 URL로 자동으로 요청을 보내게 됨

## 영구적인 Redirect

하지만 300번대 코드별로 브라우저가 자동으로 요청을 보내는 방식이 다름

먼저 영구적인 리다이렉션에 해당하는 상태 코드는 다음과 같음
- 301 Moved Permanently
- 308 Permanent Redirect

결론부터 말하자면 308 코드를 쓰는것이 좋음

RFC 9110 에서 말하는 301 에 대한 설명중 다음과 같은 설명이 포함됨

> For historical reasons, a user agent MAY change the request method from POST to GET for the subsequent request. If this behavior is undesired, the 308 (Permanent Redirect) status code can be used instead.

일단 이러한 설명이 생긴 이유는 다음과 같음

```
1. 클라이언트 → 서버
POST /A HTTP/1.1
Host: example.com

2. 서버 → 클라이언트
HTTP/1.1 301 Moved Permanently
Location: /B
```

위 예시와 다른점은 첫번째의 `클라이언트 → 서버` 의 Method 가 `POST` 라는 점임

이제 이때 3번째의 `클라이언트 → 서버` 는 어떤 Method 를 사용해야 할까? 직관적으로 `GET` 을 사용해야 할 것 같지만 실제론 `GET` 과 `POST` 둘다 사용될 수 있다라는 의미

이렇게 불확실함을 줄이기 위해선 `308 Permanent Redirect` 상태 코드를 사용하는 것이 좋음, 만약 `308` 상태 코드를 사용한다면, 클라이언트는 원래의 요청 메서드인 `POST` 를 그대로 유지하여 `/B` 페이지로 요청을 보낼 것임

첫번째 요청이 `GET` 이라면 둘다 사용해도 무방함

추가적인 예기로, 영구적인 Redirect 는 주로 URL 변경이나 리소스 이동 시 사용됨, 예를 들어, 웹사이트의 구조가 변경되어 특정 페이지가 다른 URL로 이동한 경우에 사용됨, 이러한 경우 크롤러나 검색엔진에 큰 영향을 끼칠 수 있음

## 임시적인 Redirect

영구적이라면 일시적인 Redirect 도 있다는 뜻, 관련된 예기는 위와 비슷하니 간단히 표로 정리하겠음

| 상태 코드 | 설명 |
| ---------- | ---- |
| 302 Found | 재요청 Method 변경 가능 |
| 303 See Other | 재요청 Method GET 으로 번경 |
| 307 Temporary Redirect | 재요청 Method 변경 하지 않음 |

***

# 400번대 상태 코드

**클라이언트의 요청에 오류가 있음을 의미**, 클라이언트가 잘못된 요청을 보냈거나, 요청한 리소스가 존재하지 않는 경우에 사용됨

| 상태 코드 | 설명 |
| ---------- | ---- |
| 400 Bad Request | 클라이언트의 요청이 잘못되었음 |
| 401 Unauthorized | 인증이 필요함, 클라이언트가 인증되지 않았거나 인증 정보가 잘못되었음 |
| 403 Forbidden | 클라이언트가 요청한 리소스에 접근할 수 없음, 권한이 없거나 서버가 요청을 거부함 |
| 404 Not Found | 요청한 리소스가 존재하지 않음, URL이 잘못되었거나 리소스가 삭제되었을 수 있음 |
| 405 Method Not Allowed | 요청한 HTTP 메서드가 해당 리소스에 대해 허용되지 않음, 예를 들어, GET 요청을 POST로 보내는 경우 |

## Authentication vs Authorization

* Authentication (인증) : 사용자가 누구인지 확인하는 과정, 예를 들어, 로그인 시도
* Authorization (권한 부여) : 사용자가 특정 리소스에 접근할 수 있는지 확인하는 과정, 예를 들어, 사용자가 특정 페이지에 접근할 수 있는 권한이 있는지 확인

***

# 500번대 상태 코드
**서버에서 오류가 발생했음을 의미**, 클라이언트의 요청은 올바르지만 서버가 요청을 처리하는 과정에서 문제가 발생한 경우에 사용됨

| 상태 코드 | 설명 |
| ---------- | ---- |
| 500 Internal Server Error | 서버 내부에서 오류가 발생했음, 일반적인 오류 코드로, 구체적인 원인은 알 수 없음 |
| 501 Not Implemented | 서버가 요청한 기능을 지원하지 않음, 예를 들어, 특정 HTTP 메서드를 지원하지 않는 경우 |
| 502 Bad Gateway | 서버가 게이트웨이 또는 프록시 역할을 하는 경우, 상위 서버로부터 잘못된 응답을 받았음, 쉽게말해 중간 서버에서 오류가 발생 |
| 503 Service Unavailable | 서버가 일시적으로 사용할 수 없음, 과부하 또는 유지 보수 등의 이유로 서비스가 중단되었을 수 있음 |

참고로 오류 메시지를 너무 자세하게 노출하는것 또한 보안상 좋지 않음, 예를 들어, `500 Internal Server Error` 상태 코드가 발생했을 때, 서버가 어떤 오류가 발생했는지 자세히 노출하는 것은 공격자에게 유용한 정보를 제공할 수 있음

개발자가 trade-off를 고려해야 함, 예를 들어, 개발 환경에서는 자세한 오류 메시지를 노출하고, 운영 환경에서는 최소한의 정보만 노출하는 것이 좋음