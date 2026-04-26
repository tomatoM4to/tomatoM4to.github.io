---
title: "Data Communications - HTTP"
description: "2026년 1학기 데이터 통신 Application layer - HTTP"
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
* TCP 기반의 Application Layer Protocol
* State-less Protocol : Client 와 Server 간의 연결이 지속되지 않고, 각 요청이 독립적으로 처리되는 형태

> 한번의 Request-Response Cycle 를 위해선 최소 2번의 RTT 가 필요하다. (TCP Handshake + HTTP Request-Response)

> State-less 하지만 Cookies 를 이용해 사용자의 상태를 유지할 수 있음

**Request-Response Example**
```http
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: keep-alive
==>
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 1234
```