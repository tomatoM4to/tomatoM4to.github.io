---
title: "Data Communications - SMTP"
description: "2026년 1학기 데이터 통신 Application layer - SMTP"
date: "2026-04-27"
keywords: "Network, KNU"
---

## SMTP

Email System 은 크게 User Agent, Mail Server, SMTP 로 구성되어 있다.

* User Agent : 이메일을 작성하고 읽는 프로그램 (Gmail, Outlook)
* Mail Server : 이메일을 저장하고 전달하는 서버 (Gmail 서버, Outlook 서버)
  * Message Queue : 이메일이 전달되기 전까지 임시로 저장되는 공간
  * Mailbox : 수신자를 위해 도착한 Main 들이 저장되는 공간
* SMTP Simple : Mail Transfer Protocol, Mail Server 간의 통신에 사용됨

> TCP 기반이며 기본 포트는 25번, Persistent Connection 을 지원하여, 하나의 TCP 연결로 여러 이메일을 전송할 수 있음

## SMTP 통신 과정
> Client $\rightarrow$ Server $\rightarrow$ Server $\rightarrow$ Client

1. Alice 가 UA 로 Mail 을 작성해 **자신의 Mail Server** 로 전달, Push, UA 와 Mail Server 사이에 **TCP 연결** 및 **SMTP 통신** 수행
2. **Alice 의 Mail Server** 가 **Bob 의 Mail Server** 로 Mail 을 전달, Push, **TCP 연결**과 **SMTP Handshake** 수행 후 **SMTP 통신** 수행
3. Bob 이 메일 앱을 실행하면 UA 가 `HTTP` 나 `IMAP` 등을 사용하여 **Server 에서 Mail 을 Pull** 함

### Mail Access Protocol
`SMTP` 는 Mail 을 수신자의 **Mail Server 로 Push** 할때 까지만 사용된다.

최종적으로 수신자의 UA 가 Server 로부터 `HTTP` 나 `IMAP` 와 같이 별도의 Pull Protocol 을 사용하여 Mail 을 가져오는 형토래 동작한다.

자세히 살펴보면, `SMTP` 는 **Server 가 수신자일 경우**에만 사용되는걸 볼 수 있다.

Gmail, Outlook 등 현대의 웹메일 서비스들은 최종적으로 메일을 전달할 때 `HTTP` 를 사용한다.

### SMTP Handshake
TCP 연결이 맺어진 후, 서로의 Server 가 SMTP 통신이 가능한지 확인하기 위해 Handshake 를 수행한다.

* c : Client
* s : Server

```SMTP
telnet hamburger.edu 25
s: 220 hamburger.edu
c: HELO crepes.fr
s: 250 Hello crepes.fr, pleased to meet you
```

> `pleased to meet you` 같은 친절한 인사말이 포함되어 있는데, 이는 비유가 아니라 실제 Network 를 타고 전송되는 메시지다, 과거 개발자들이 `[상태코드] [인사말]` 형태로 테스트 하던 시절의 흔적이 남아있는 것

이후 서로의 Server 의 상태가 확인되면 진짜 이메일을 전송하는 SMTP 통신이 시작된다.

```SMTP
c: MAIL FROM: <alice@crepes.fr>
s: 250 alice@crepes.fr... Sender ok

c: RCPT TO: <bob@hamburger.edu>
s: 250 bob@hamburger.edu... Recipient ok

c: DATA
s: 354 Enter mail, end with "." on a line by itself

c: To: bob@hamburger.edu
c: From: alice@crepes.fr
c: Subject: Hello Bob!
c:
c: Do you like ketchup?
c: How about pickles?
c: .
s: 250 Message accepted for delivery

c: QUIT
s: 221 hamburger.edu closing connection
```

* **배송 정보 설정 (Envelope)** : `MAIL FROM` 은 보내는 사람의 주소를, `RCPT TO` 는 받는 사람의 주소를 Server 에 알리는 과정, Server 가 해당 주소를 확인하면 `250 OK` 응답을 준다.
* **데이터 전송 준비 (DATA)** : Client 가 `DATA` 명령을 보내면, Server 는 `354` 코드를 주며 Message Body 를 입력받을 준비가 되었음을 알림
* `DATA` 이후에 오는 `To:`, `From:`, `Subject:` 등은 Header 정보들이고, 이후 한줄 비운 다음 진짜 Body 를 작성함
* `.` 로 Body 의 끝을 알림
* `QUIT` 명령으로 SMTP 세션을 종료

> 각 라인의 끝에는 `\r\n`(CRLF) 이 포함되어 있다.

## HTTP 와의 차이점
* SMTP 는 전송하는 모든 메시지(Header + Body) 가 **반드시 7-bit ASCII** 여야 한다.
* HTTP 는 각각의 Object 를 별도의 Request-Response Cycle 로 처리하지만, SMTP 는 **하나의 Object 로 묶어서 처리**한다.

요약하면, Image 를 보낸다 가정하면, 바이너리 데이터를 base64 로 인코딩 하여 7-bit ASCII 로 만든 다음, 그냥 Text 에 욱여넣어 보내는 형태

```SMTP
Content-Type: multipart/mixed; boundary="----MyBoundary"

------MyBoundary
Content-Type: text/plain

안녕 밥! 여행 사진 첨부할게.
------MyBoundary
Content-Type: image/jpeg
Content-Transfer-Encoding: base64

/9j/4AAQSkZJRgABAQEAAAAAA... (이미지가 변환된 수만 줄의 알 수 없는 텍스트)
------MyBoundary--
```

위 예시에서 `DATA` 이후 명령을 보낼때, Image 또한 `------MyBoundary` 로 구분한 다음 base64 로 인코딩 된 거대한 텍스트를 그대로 보내는 형태를 취한다.