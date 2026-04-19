---
title: "Web Framework - Express 개요"
description: "202601 웹프레임워크, Express 프레임워크의 개요와 주요 기능, npm을 이용한 설치 방법, 라우팅과 요청 객체에 대한 설명"
date: "2026-04-19"
keywords: "Express, JavaScript, KNU"
---

## Express 에 포함된 기능
* **Routing:** URL 경로에 따라 요청을 처리하는 기능
* **Middleware**: 요청과 응답 사이에서 실행되는 함수로, 요청을 처리하기 전에 필요한 작업을 수행할 수 있도록 도와주는 기능
* **Template Engine:** HTML 템플릿을 렌더링하여 동적인 웹 페이지를 생성하는 기능
* **Static Files:** CSS, JavaScript, 이미지 등과 같은 정적 파일을 제공하는 기능

## npm init
```bash
npm init
```
1. **package name**: 프로젝트 이름
2. **version**: 프로젝트 버전
3. **description**: 프로젝트 설명
4. **entry point**: 프로젝트의 진입점 파일 (예: app.js)
5. **test command**: 테스트 명령어 (예: npm test)
6. **git repository**: Git 저장소 URL
7. **keywords**: 프로젝트와 관련된 키워드 (예: express, web, framework)
8. **author**: 제작자 이름
9. **license**: 프로젝트 라이선스 (예: MIT)

> 나머진 그냥 Enter 로 넘어가는데, 4번 항목만 따로 `app.js`로 입력해주자.

> `-y` 옵션을 사용하면 모든 질문에 기본값으로 자동 응답하여 `package.json` 파일을 생성할 수 있다.

## express, nodemon
```bash
npm install express
npm install --save-dev nodemon
```
* `express`: Express 프레임워크
* `nodemon`: 개발 중에 파일이 변경될 때 자동으로 서버를 재시작해주는 도구

**Command Options**
* `--save-dev` or `-D`: **개발 의존성**으로 패키지를 설치할 때 사용
* `--save`: **일반 의존성**으로 패키지를 설치할 때 사용 (npm 5 이상에서는 **기본값**이 `--save` 이므로 생략 가능)

결과적으로 아래와 같이 `package.json` 파일이 만들어 진다.
```json
{
  "name": "project-name",
  "version": "1.0.0",
  "description": "",
  "license": "ISC",
  "author": "",
  "type": "commonjs",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^5.2.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

`app.js` 파일을 생성하고 아래와 같이 Express 서버를 간단히 만들어보자.

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.status(200);
  res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
```

* `-g` 옵션을 **사용해 전역 설치**했다면, 프로젝트를 구동할때 `nodemon app.js` or `nodemon app` 명령어로 실행하면 된다.
* `-g` 옵션을 **쓰지 않고 프로젝트 의존성으로 설치**했다면, `package.json` 파일의 `scripts` 항목을 아래와 같이 수정해야 한다. 혹은 `npx nodemon app.js` 명령어 사용

```json
"scripts": {
  "dev": "nodemon app.js",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```
이후부턴 `npm run dev` 명령어로 서버를 실행할 수 있다.

> 교재에선 `npm install nodemon -g --save-dev` 를 사용해 전역 설치함

> `package.json` 파일의 `scripts` 항목을 수정하는건, 교재에선 없고 내가 추가해서 작성함

## Routing
```javascript
app.get('/', (req, res) => {
  res.status(200);
  res.send('Hello World!');
});

app.get('/contacts', (req, res) => {
  res.status(200).send('Contacts Page');
});

app.post('/contacts', (req, res) => {
  res.status(201).send('Contact Created');
})
```
* `app`: Express 애플리케이션 인스턴스
* `METHOD`: HTTP GET 요청을 처리하는 메서드, `get`, `post`, `put`, `delete` 등이 있다.
* `'/'`: 요청 URL 경로, 루트 경로를 의미
* `(req, res) => { ... }`: 요청과 응답 객체를 매개변수로 받는 콜백 함수, 요청이 들어올 때 실행됨

> Express 의 라우팅에서 URL 경로는 반드시 `/` 로 시작해야 한다.

## Parameters
```javascript
app.get('/contacts/:id', (req, res) => {
  const id = req.params.id;
  res.status(200).send(`Contact ID: ${id}`);
});

app.put('/contacts/:id', (req, res) => {
  const id = req.params.id;
  res.status(200).send(`Contact ID: ${id} updated`);
});

app.delete('/contacts/:id', (req, res) => {
  const id = req.params.id;
  res.status(200).send(`Contact ID: ${id} deleted`);
});
```
이후 `http://localhost:3000/contacts/123` URL로 GET 요청을 보내면, `Contact ID: 123` 이라는 응답이 반환된다.

> `:param` 은 **URL 경로에서 동적으로 변하는 부분**을 나타내며, `req.params.param` 을 통해 해당 값을 추출할 수 있다.

## req object
`console.log(req)` 명령어로 요청 객체를 출력하면, HTTP 요청에 대한 다양한 정보가 담긴 객체가 출력된다. 방대한 정보 중에서 자주 사용되는 몇 가지 속성은 다음과 같다.

* `req.body`: `POST`, `PUT` 요청에서 **클라이언트가 보낸 데이터**가 담긴 객체
* `req.cookies`: Client 에 저장된 쿠키 정보를 서버로 보냈을 경우 해당 쿠키 정보가 담긴 객체
* `req.headers`: HTTP 요청 헤더 정보가 담긴 객체
* `req.params`: URL 경로에서 동적으로 변하는 부분이 담긴 객체 (예: `/contacts/:id` 에서 `id` 값이 담긴 객체)
* `req.query`: URL **쿼리 문자열**에서 전달된 데이터가 담긴 객체 (예: `/search?query=example` 에서 `query` 값이 담긴 객체)

> Express 는 기본적으로 Body 를 해석하지 못하여, `req.body` 가 `undefined` 로 나온다, 정상적으로 읽기 위해선 반드시 Body Parser Middleware 를 등ㅇ록해야 한다.

## res object
Server 가 클라이언트로 응답을 보낼 때 사용하는 객체로, 다양한 메서드와 속성을 제공한다. 자주 사용되는 몇 가지 메서드는 다음과 같다.

* `res.download`: 파일을 내려받는다.
* `res.end`: 응답을 종료한다.
* `res.json`: JSON 형식으로 응답을 보낸다.
* `res.jsonp`: JSONP 지원을 통해 JSON 응답을 전송한다.
* `res.redirect`: 클라이언트를 다른 URL로 리디렉션한다.
* `res.render`: View Template 엔진을 사용하여 HTML을 렌더링한다.
* `res.send`: 어떤 유형이든 `res.send()` 안의 데이터를 클라이언트로 전송한다.
* `res.sendFile`: 지정한 경로의 File 을 읽어서 내용을 Client 로 전송한다.
* `res.sendStatus`: 상태 메시지와 함께 HTTP 상태 코드를 클라이언트로 전송한다.
* `res.status`: HTTP 상태 코드를 설정한다.

```javascript
app.get('/json', (req, res) => {
  res.status(200).json({ message: 'Hello, World!' });
});

app.get('/html', (req, res) => {
  res.status(200);
  res.sendFile(__dirname + '/index.html');
});

app.get('/404', (req, res) => {
  res.sendStatus(404);
});
```

> File 을 찾지 못하면 `404 Not Found` 가 자동적으로 처리된다.

> `sendStatus` 는 `res.status(code).send(statusMessage)` 의 축약형으로, **상태 코드**와 함께 **표준 상태 메시지**를 클라이언트로 전송한다.

## All Code
```javascript
const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(req.headers);
});

app.get('/contacts', (req, res) => {
  res.status(200).send('Contacts Page');
});

app.post('/contacts', (req, res) => {
  res.status(201).send('Contact Created');
});

app.get('/contacts/:id', (req, res) => {
  const id = req.params.id;
  res.status(200).send(`Contact ID: ${id}`);
});

app.put('/contacts/:id', (req, res) => {
  const id = req.params.id;
  res.status(200).send(`Contact ID: ${id} updated`);
});

app.delete('/contacts/:id', (req, res) => {
  const id = req.params.id;
  res.status(200).send(`Contact ID: ${id} deleted`);
});

app.get('/example', (req, res) => {
  res.status(200).json({ message: 'Hello, World!' });
});

app.get('/html', (req, res) => {
  res.status(200);
  res.sendFile(__dirname + '/index.html');
});

app.get('/404', (req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
```