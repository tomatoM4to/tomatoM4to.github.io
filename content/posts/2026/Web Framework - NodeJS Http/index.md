---
title: "Web Framework - NodeJS Http"
description: "202601 웹프레임워크, Node.js 의 Http core module 를 사용하여 간단한 백엔드 서버를 만드는 방법"
date: "2026-04-14"
keywords: "Express, JavaScript, KNU"
---

## HTTP
1. Web Client 와 Web Server 간의 통신을 위한 프로토콜
2. Request 와 Response 로 구성
3. Stateless: 각 요청이 독립적이며, 이전 요청과의 상태를 유지하지 않음

### 요청 메서드
1. **GET**: 서버에서 정보를 조회, URL 을 통한 웹페이지 접속이 대표적인 예시
2. **POST**: 서버에 데이터를 전송할때 사용
3. **PUT**: 서버의 기존 리소스를 업데이트할때 사용
4. **DELETE**: 서버의 리소스를 삭제할때 사용

### Status Code
1. **1xx**: 계속 처리 중
2. **2xx**: 성공
  1. **200 OK**: 요청이 성공적으로 처리됨
  2. **201 Created**: 요청이 성공적으로 처리되어 새로운 리소스가 생성됨
  3. **204 No Content**: 요청이 성공적으로 처리되었지만, 반환할 콘텐츠가 없음
3. **3xx**: 리다이렉션, URL이 변경되었기에 클라이언트가 새로운 URL로 요청을 보내야 함
  1. **301 Moved Permanently**: 요청한 리소스가 영구적으로 새로운 URL로 이동됨
3. **4xx**: 클라이언트 오류, 클라이언트의 요청이 잘못되었거나, 요청한 리소스가 존재하지 않을 때 발생
  1. **400 Bad Request**: 클라이언트의 요청이 잘못되어 서버가 이해할 수 없음
  2. **401 Unauthorized**: 인증이 필요한 리소스에 대해 인증되지 않은 요청이 들어왔을 때 발생
  3. **403 Forbidden**: 클라이언트가 금지된 리소스에 접근하려고 할 때 발생, 숨겨야 하는 리소스에 대한 접근 시도일 때 발생, 근데 403이라고 알려주면 아 이곳에 뭔가 있구나 라고 알려주는 꼴이 되기 때문에, 보통은 404 Not Found 로 응답하는 경우가 많다.
  4. **404 Not Found**: 요청한 리소스가 서버에 존재하지 않을 때 발생
5. **5xx**: 서버 오류, 서버가 요청을 처리하는 과정에서 문제가 발생했을 때 발생
  1. **500 Internal Server Error**: 서버 내부에서 예기치 않은 오류가 발생하여 요청을 처리할 수 없음
  2. **503 Service Unavailable**: 서버가 일시적으로 과부하 상태이거나 유지보수 중일 때 발생

## Ip address & Port
* **IP Address**: 네트워크 상에서 장치를 식별하는 고유한 주소, IPv4 와 IPv6 가 존재
* **Domain Name**: IP 주소를 사람이 이해하기 쉬운 형태로 변환한 것, DNS(Domain Name System) 를 통해 IP 주소로 변환되어 통신이 이루어짐
* **Port**: IP 주소 내에서 특정 프로세스나 서비스를 식별하는 번호, `16bit(0~65535)` 범위, 1024 이하의 포트는 시스템에서 예약되어 있음, `:` 뒤에 포트 번호를 명시, 브라우저 상에선 자동으로 80번 포트를 사용하여 통신
* **Socket**: IP 주소와 포트 번호의 조합, 네트워크 통신의 종착점, IP 주소와 포트 번호를 함께 사용하여 클라이언트와 서버 간의 통신을 가능하게 함

> 원격주소: 서버의 실제 IP 주소와 포트 번호

## Http Server

> Http core module 를 가져온 후 `createServer(req, res)` 메서드를 사용하여 서버 객체를 생성
> * `req`: 클라이언트의 요청 정보를 담고 있는 객체
> * `res`: 서버가 클라이언트에게 응답을 보낼 때 사용하는 객체

```javascript
const http = require('node:http');

const server = http.createServer((req, res) => {
  console.log('Received request:', req.method, req.url); // 요청 정보 출력

  res.statusCode = 200; // 응답 상태 코드 설정
  res.setHeader('Content-Type', 'text/plain'); // 응답 헤더 설정
  res.end('Hello, World!'); // 응답 본문 전송 및 연결 종료
});
```

Server 를 생성했으니 이제 해당 Server 에 접근할 수 있는 Port 를 열어주어야 한다. `listen(port, callback)` 메서드를 사용하여 Server 가 특정 Port 에서 클라이언트의 요청을 기다리도록 설정할 수 있다.

```javascript
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

이제 `http://localhost:3000/` or `http://127.0.0.1:3000/` 주소로 접속하면 `createServer()` 메서드에서 정의한 콜백 함수가 실행되어 `Hello, World!` 라는 응답이 반환된다.

> `localhost` or `127.0.0.1` 는 컴퓨터의 루프백 네트워크 인터페이스를 말한다, 인터넷 연결 없이도 웹서버를 개발 및 테스트 할 수 있다.

> 만약 외부에서 접근 가능한 서버를 만들고 싶다면, `server.listen(0.0.0.0:3000, ...)` 와 같이 IP 주소를 지정하여 외부에서 접근할 수 있도록 설정할 수 있다.

### Request Object
> Client 에서 Server 로 요청했을 때 사용하는 Object, `req` or `request` 로 작성하는게 관례

**req log example**
```json
TODO
```

### Response Object
> Server 에서 Client 로 넘겨는 Response Object, Header 와 Body 로 구성

먼저 Header 를 설정하는 방법부터 보자

```javascript
res.statusCode = 200;
res.setHeader('Content-Type', 'text/plain');
```
or
```javascript
res.writeHead(200, { 'Content-Type': 'text/plain' });
```

* `res.setHeader(name, value)`: 응답 헤더 설정
* `res.writeHead(statusCode, headers)`: 응답 상태 코드와 헤더를 한 번에 설정

Body 는 `res.write(data)` 메서드를 사용하여 데이터를 전송할 수 있다, `res.end(data)` 메서드는 응답 본문을 전송하고 연결을 종료한다.

```javascript
res.write('Hello, ');
res.write('World!');
res.end();
or
```
```javascript
res.end('Hello, World!');
```

### Response Html example

```javascript
const http = require('node:http');
const fs = require('node:fs');

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");
  const readStream = fs.createReadStream(__dirname + "/index.html", 'utf-8');
  readStream.pipe(res);
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

### Route Handling
*  URL 경로에 따라 다른 응답을 반환하는 기능, `req.url` 속성을 사용하여 요청된 URL 경로를 확인할 수 있다
* 폴더명 과 같은 물리적 경로가 아닌 논리적 경로, TODO: 물리적 경로를 사용할 수도 있지만, 라우팅 과는 다른 예기니 넘어감
* `GET` 이나 `POST`, `PUT`, `DELETE` 등 **같은 URL 경로라도 요청 메서드에 따라 다른 응답을 반환할 수 있다**

아래 예시 코드는 브라우저 상에서 오직 `http://localhost:3000/home` 과 `http://localhost:3000/about` 경로로만 접근이 가능하도록 설정한 코드이다, `root` 포함 그 외의 경로로 접근하면 **404 Not Found** 응답이 반환된다.

```javascript
const http = require('node:http');
const fs = require('node:fs');

const server = http.createServer((req, res) => {
  const { method, url } = req;
  res.setHeader("Content-Type", "text/plain");

  if (method === 'GET' && url === '/home') {
    res.statusCode = 200;
    res.end('Welcome to the home page!');
  }
  else if (method === 'GET' && url === '/about') {
    res.statusCode = 200;
    res.end('This is the about page.');
  }
  // else if (method === 'GET' && url === '/') {
  //   res.statusCode = 200;
  //   res.end('Welcome to the root page!');
  // }
  else {
    res.statusCode = 404;
    res.end('Page not found');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```