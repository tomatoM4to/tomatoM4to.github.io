---
title: "Data Communications - HTTP"
description: "2026년 1학기 데이터 통신 Application Layer 개요와 HTTP 프로토콜에 대한 정리"
date: "2026-04-25"
keywords: "Network, HTTP, KNU"
---

## Application Layer
Application layer 는, **Process 간의 통신**을 지원하는 계층으로, `HTTP`, `FTP`, `SMTP`, `DNS` 등 다양한 프로토콜이 존재한다.

Process 간의 통신을 지원하기 위해, Network 에 참여하는 Host 들의 식별자인 `IP Address` 뿐만 아니라 **Host 내에서 실행되는 Process 들의 식별자**인 `Port Number` 도 필요하다. 앱 개발자가 어떤 Port Number 를 사용할지는 자유지만, 일반적으로 `0~1023` 까지의 Port Number 는 **Well-known Port** 라고 불리는 범위로, 특정 서비스에 할당되어 있다.
* `HTTP` : 80
* `FTP` : 21
* `SMTP` : 25
* `DNS` : 53

이 다음부터 등장하는 `Transport Layer` 는 OS 레벨에서 동작하는 Protocol 로, Application Layer Protocol 들이, 데이터의 무결성을 얼마나 중요하게 생각하는지에 따라, `TCP`, `UDP` 등을 선택하여 사용할 수 있다.

> 누구나 문서를 보고 구현할 수 있는 RFC 문서로 정의된 Open Protocols 들로 `HTTP`, `SMTP` 같은 규격도 있지만 특정 기업이 독점하는 Proprietary protocols 도 존재한다. (Skype, zoom)

### Client-Server Model
**항상 켜져 있고 고정된 IP 주소를 가진 Server** 가 존재 하고, **Client 는 Server 에 접속**하여 Service 를 요청하는 모델

가장 대표적인 Architecture Model 이며, `HTTP`, `FTP`, `SMTP`, `DNS` 등 대부분의 Application Layer Protocol 들이 이 모델을 따른다.

> Server 는 한대만 있지 않고 Mirror Server 형태로 여러대 존재 가능

> CDN(Content Delivery Network) 도 Server-Client 모델의 한 형태로 볼 수 있음, CDN 은 전세계에 분산된 Server 들이 존재하여, 사용자에게 가장 가까운 Server 로부터 컨텐츠를 제공하는 형태

### Socket
App Layer 에서 Transport Layer 로 데이터를 전달하기 위해 사용되는 인터페이스

> Transport Layer 는 OS 에서 제공하는 서비스, 실제로 Device Driver 형태로 OS 커널에 구현되어 있음

> 특별해 보이지만 File 의 Read/Write 와 유사한 개념으로, OS 가 해당 File 을 추적하며 Data 가 쓰여지면 해당 데이터를 전송하는 형태로 동작함

## HTTP Spec
* Request-Response Model
* **TCP 기반**의 Application Layer Protocol
* **State-less Protocol** : 각 Request-Response Cycle 은 철처히 독립적으로 동작함

> TCP 연결을 맺는 1 RTT와 파일을 Request-Response하는 1 RTT를 합쳐 2 RTT가 필요하다. (TCP Handshake + HTTP Request-Response)

> State-less 하지만 Cookies 를 이용해 사용자의 상태를 유지할 수 있음

**Request-Response Example**
```http
GET /index.html HTTP/1.1\r\n
Host: www.example.com\r\n
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36\r\n
Accept: text/html,application/xhtml+xml\r\n
Accept-Language: en-US,en;q=0.5\r\n
Accept-Encoding: gzip,deflate\r\n
Connection: keep-alive\r\n
\r\n
```
* `index.html` : requesting resource
* `HTTP/1.1` : HTTP version
* `\r\n` : HTTP header 의 끝을 나타내는 구분자
* 마지막 `\r\n` 이후에 **HTTP Body** 가 존재할 수 있음, GET 요청에는 일반적으로 Body 가 없음
  * HTTP Body 말고도 Payload, Entity 라고도 불림
  * Body 에는 JSON, XML, image 같은 바이너리 형태 등등 어떤 형태든 담길 수 있음

**Response Example**
```http
HTTP/1.1 200 OK\r\n
Date: Wed, 21 Apr 2026 12:00:00 GMT\r\n
Server: Apache/2.4.41 (Ubuntu)\r\n
Content-Type: text/html; charset=UTF-8\r\n
Content-Length: 1234\r\n
\r\n
data data data data...
```

**요약**
* **Request:** `GET`, `POST`, `PUT`, `DELETE` 등 다양한 HTTP Method 가 존재하며, 각 Method 는 특정한 의미를 가지며, Server 는 해당 Method 에 따라 다른 방식으로 요청을 처리한다.
* **Response:** `200 OK`, `404 Not Found`, `500 Internal Server Error` 등 다양한 Status Code 가 존재하며, 각 Status Code 는 요청이 성공적으로 처리되었는지, 클라이언트의 요청에 문제가 있는지, 서버에 문제가 있는지 등을 나타낸다.

**HTTP Version**
* `HTTP/1.0` : 1996 년에 발표된 최초의 HTTP 버전, **각 요청마다 새로운 TCP 연결을 생성**하는 방식 (Non-persistent)
* `HTTP/1.1` : Persistent Connection 을 도입하여, **하나의 TCP 연결로 여러 요청을 처리**할 수 있도록 개선, First-Come-First-Serve 방식으로 만약 앞에 요청이 오래 걸리는 경우 뒤에 있는 요청들도 지연되는 문제 발생
* `HTTP/2` : 2015 년에 발표된 버전, 객체를 통째로 보내는 대신, Frame 단위로 나누어 TCP 연결 위에서 교차로 섞에 보내는 Multiplexing 를 도입하여, 큰 File 뒤 작은 File 이 지연되는 문제를 해결
* `HTTP/3` : 2020 년에 발표된 버전, 무거운 TCP 대신 UDP 를 사용, 패킷이 유실되어도 다른 파일 전송에는 영향을 주지 않도록 아키텍처를 전면 수정

## HTTP Cookie
HTTP 자체는 Stateless 지만, Login 과 같이 사용자의 상태를 우지해야 하는 경우 Cookies 를 이용하여 상태를 유지할 수 있다.

Cookies 의 핵심 구성 요소 4가지
* HTTP Response Header 의 `Set-Cookie` 필드 : Server 가 Client 에게 Cookie 를 설정하라고 지시하는 필드
* HTTP Request Header 의 `Cookie` 필드 : Client 가 Server 에게 Cookie 를 보낼때 사용하는 필드
* Client 의 경우 브라우저에 Cookie 를 저장하고 관리함
* Server 는 Cookie 를 저장하기 위해 별도의 Database 를 운영할 수 있음

### Security: Tracking
Cookie 는 귀여운 이름과는 달리 매우 민감한 정보를 담고 있을 수 있기 때문에 신경써서 관리 해야 함

* First-party Cookie : 사용자가 방문한 웹사이트에서 설정한 Cookie, 일반적으로 로그인 상태 유지, 사용자 선호도 저장 등에 사용
* Third-party Cookie : 사용자가 방문한 웹사이트가 아닌 다른 도메인에서 설정한 Cookie, 광고 네트워크, 분석 서비스 등에서 사용자의 행동을 추적하는 데 사용

**Setup**
1. `nytimes.com` (사용자가 방문한 웹사이트)
2. `ADX.com` (광고 회사)
3. `socks.com` (사용자가 방문한 웹사이트)
4. 1634 는 `nytimes.com` 에서 설정한 first-party Cookie 의 ID, 7493 는 `ADX.com` 에서 설정한 third-party Cookie 의 ID 라고 생각하자.

이경우 `ADX.com` 은 Third-party Cookie 를 이용하여 사용자의 행동을 추적할 수 있다. 다음과 같은 시나리오를 생각해보자.
1. 사용자가 `nytimes.com` 에 방문
2. `nytimes.com` 에서 first-party Cookie 설정 (1634)
3. 해당 웹사이트에 `ADX.com` 의 광고가 포함되어 있어, `ADX.com` 에서 third-party Cookie 설정 (1634, 7493)
4. 사용자가 `socks.com` 에 방문
5. `socks.com` 에서 `ADX.com` 의 광고가 포함되어 있어, `ADX.com` 은 기존에 설정된 third-party Cookie (1634, 7493) 를 기반으로 행동

결과적으로 `ADX.com` 은 `(7493: nytimes.com, 7493: socks.com)` 형태로 사용자의 행동을 추적할 수 있다.

오해하기 쉬운 부분은 `ADX.com` 은 first-part Cookie 를 설정할수도, 볼수도 없다, Header 에 `Referer: socks.com` 와 같은 정보를 자동적으로 포함시키기 때문에 `ADX.com` 은 first-part Cookie 의 유무와는 상관 없이, `socks.com` 에서 `ADX.com` 의 광고가 포함된 페이지에 방문할 때마다 third-party Cookie 를 이용하여 사용자의 행동을 추적할 수 있다.

> 브라우저는 Cookie 가 설정되면 자동으로 해당 Cookie 와 함께 Request 를 보내는 방식으로 동작하기 때문에

> 이때문에 최근 브라우저들은 Third-party Cookie 를 차단하는 기능을 도입하고 있음

> 추천 광고와 같은 개인 맞춤형 기능들이 동작하는 원천이기도 함

## Web Cache
교재에선 `Proxy Cache` 와 `Browser Cache` 두 가지 형태로 설명한다. 둘다 원본 Server 를 대신하여 Client 의 요청을 처리하는 Entity 라는 공통점이 존재한다.

* Proxy Cache : Client 와 Server 사이에 위치하는 Cache Server, 단체에서 운영하는 경우가 많음, 여러 Client 들이 공유하는 형태로 동작
* Browser Cache : Client 의 브라우저에 위치하는 Cache, 각 Client 마다 독립적으로 존재하는 형태로 동작

> 최근 HTTPs 의 보급으로 인해 Proxy Cache 의 활용이 줄어들고 있음, HTTPs 는 End-to-End 암호화를 제공하기 때문에 Proxy Cache 가 원본 Server 의 데이터를 볼 수 없게 됨

> 하지만 여전히 기업의 보안을 위해 Proxy Cache 를 활용하는 경우도 존재함

### Proxy Cache
학교나 기업 같은 기관의 네트워크 게이트웨이에 설치되는 Cache Server

원본 Server 에겐 Client 처럼, Client 에겐 Server 처럼 동작하는 이중 역할을 수행한다.

**가정**
1. 기관 내부에서 요구되는 트래픽은 `1.50 Mbps`
2. 기관 외부 접속 링크 대욕폭은 `1.54 Mbps`

문제 상황: 링크 사용률이 약 `97%(1.50/1.54)`에 달해 큐잉 지연(Queueing delay)이 기하급수적으로 증가한다.

**해결책**
1. 외부 접속 링크의 대역폭을 증설함
2. Proxy Cache 도입, 이때 Cache Hit Rate 가 `0.4` 라고 가정해보자, `60%` 만이 외부 접속 링크를 사용함

위의 가정대로 Proxy Cache 를 도입한다면, 링크 사용율은 `1.50 * 0.6 = 0.9 Mbps` 로 감소하여, 큐잉 지연이 크게 줄어들게 된다.

링크 사용률은 `58% (0.9/1.54)`로 감소하여, 큐잉 지연이 사실상 없어진다.

### Browser Cache & Conditional GET
Server 로부터 Response 를 받을 시, Header 에 `Cache-Control: max-age=<seconds>` 형태로 필드가 포함되어 있다면, 해당 Resource 는 `<seconds>` 초 동안 브라우저에 Cache storage 에 저장된다.

**30분이 설정되어 있다고 가정**하면 30분 동안 사용자가 새로고침 하거나 해당 페이지에 다시 접속하면, **브라우저는 Server 에 접근조차 하지 않고**, Cache Storage 에 **저장된 Resource 를 그대로** 보여준다.

1시간이 경과해 Cache 가 **상한(Stale)** 상태가 되면, 브라우저는 **Conditional GET** 요청을 Server 에 보낸다. Cache 가 상한 상태이지만, **아직 유효한 상태일 수도 있기 때문**에 바로 삭제하지 않는다.

1. 브라우저가 Server 에 Conditional GET 요청을 보낸다. Request Header 에 `If-modified-since: <date>` 필드를 포함
2. Server 는 Resource 가 변경되었는지 여부에 따라, `200 OK` 또는 `304 Not Modified` 상태 코드를 응답한다.
  * `200 OK` : Resource 가 변경되었음을 나타내며, 브라우저는 새로운 Resource 를 Cache Storage 에 저장하고 사용자에게 보여준다. (Payload 포함)
  * `304 Not Modified` : Resource 가 변경되지 않았음을 나타내며, 브라우저는 기존에 Cache Storage 에 저장된 Resource 를 그대로 사용자에게 보여준다. (Payload 없음)

`304 Not Modified` 일 경우 **RTT 는 발생**하지만, **Payload 가 없기 때문**에 매우 빠르게 응답이 이루어진다.