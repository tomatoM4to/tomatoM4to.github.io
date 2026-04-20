---
title: "Web Framework - Express Middleware"
description: "202601 웹프레임워크, Express 프레임워크의 Middleware에 대한 설명, 예제코드"
date: "2026-04-19"
keywords: "Express, JavaScript, KNU"
---

## Middleware

Client 의 Request 와 Server 의 Response 사이의 **중간에서 목적에 맞게 특정 처리를 하는 기능 혹은 함수**를 의미한다.

Middleware Function 은 기본적으로 **3가지 매개변수**를 가진다.
1. `req`: Client 의 Request 객체
2. `res`: Server 의 Response 객체
3. `next`: 다음 Middleware Function 을 호출하는 함수

Middleware 는 현재의 req-res **응답 주기를 종료**하거나, **반드시** `next()` **를 호출하여 제어권을 다음 Middleware 로** 넘겨야 한다. `next()` 가 호출되지 않으면 Client 는 응답을 받지 못하고 요청이 타임아웃 될 수 있다.

> 이전까지 `next()` 를 쓰지 않은 이유는 응답주기를 종료하는 `res.send()`, `res.json()`, `res.end()`, `res.render()` 등을 사용했기 때문이다.

Middleware 가 할 수 있는 일들
1. 모든 요청, 특정 요청에 대한 Logging
2. 사용자 인증 및 권한 확인 (Authentication & Authorization)
3. Body parsing
4. CORS 설정
5. 에러 처리

### Middleware 의 종류
Express Middleware 는 사용 방식과 위치에 따라 3가지로 분류할 수 있다.

1. **Application-level Middleware**: `app.use()`, `app.get()`, `app.post()` 등으로 등록하는 Middleware
2. **Router-level Middleware**: `express.Router()` 로 생성한 **라우터에 등록하는 Middleware**
3. **Error-handling Middleware**: 4개의 매개변수 `(err, req, res, next)` 를 가지며, 에러를 처리하는 Middleware, 일반 Middleware 에서 `next(err)` 형태로 에러를 넘기면, 이 Middleware 가 포착한다. **앱의 가장 마지막 하단에 정의해야 한다.**

추가로 **built-in Middleware** 와 **third-party Middleware** 로도 분류할 수 있다.
1. **Built-in Middleware**: Express 가 **기본적으로 제공**하는 Middleware (예: `express.json()`, `express.static()`)
2. **Third-party Middleware**: **외부 라이브러리**에서 제공하는 Middleware (예: `cors`, `morgan`)

### body-parser middleware
User 가 Body 에 데이터를 담아서 요청할 때, Server 는 이 데이터를 **파싱하여 JavaScript 객체로 변환**해야 한다. 해당 Middleware 를 등록하지 않으면 `req.body` 는 `undefined` 이다.

자주 사용되는 Body Parser Middleware
1. `express.json()`: JSON 형식의 Body 를 파싱하여 `req.body` 에 저장
2. `express.urlencoded({ extended: true })`: URL-encoded 형식의 Body 를 파싱하여 `req.body` 에 저장
3. `raw()`: 바이너리 데이터 파싱
4. `text()`: 텍스트 데이터 파싱

> `raw()` 과 `text()` 는 Express 의 기본 Middleware 가 아니므로, `body-parser` 패키지를 설치하여 사용해야 한다.

> `app.use()` 로 등록되는 Middleware 는 상단부터 하단으로 순차적으로 실행된다. 따라서 Body Parser Middleware 는 **라우터보다 상단에 등록**해야 라우터에서 `req.body` 를 사용할 수 있다.

### express.json()

```javascript
const express = require('express');
const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

시나리오는 Client 가 POST 요청으로 Body 에 JSON 데이터를 담아서 보낸다고 가정하자.

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/json', (req, res) => {
  console.log(req.body);
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).send('Missing required fields: name, email, phone');
  }

  res.status(201).send(`User ${name} created successfully!`);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

Request example:
```json
{
  "name": "Alice",
  "email": "example@example.com",
  "phone": "0000-0000-0000"
}
```

### express.urlencoded({ extended: true })
Client 가 Body 에 Query-string 형식의 데이터를 담아서 보낸다고 가정하자.

* **Query-string 형식**: `name=Alice&email=example%40example.com&phone=0000-0000-0000`
* `{extended: true}` 옵션은 **중첩된 객체**를 허용 (qs 라이브러리를 사용하여 파싱)
* `{extended: false}` 옵션은 **중첩된 객체를 허용하지 않고, 단일 레벨의 객체만 파싱** (querystring 라이브러리를 사용하여 파싱)

> 중첩된 구조는 `?user[name]=kim&user[age]=20` 와 같이 표현할 수 있다. JSON 형식으론 `{"user": {"name": "kim", "age": 20}}` 와 같다. `extended: true` 옵션이 없으면 이런 형태의 데이터는 파싱할 수 없다.

```javascript
app.post('/urlencoded', (req, res) => {
  console.log(req.body);
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).send('Missing required fields: name, email, phone');
  }

  res.status(201).send(`User ${name} created successfully!`);
});
```

Thunder Client 에선 Body/Form-encode 탭에서 key-value 쌍으로 데이터를 각각 넣거나, 아래 코드를 실행하여 테스트 해보자

```javascript
fetch('http://localhost:3000/urlencoded', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'name=Alice&email=example%40example.com&phone=0000-0000-0000'
})
.then(response => response.text())
.then(data => console.log('성공:', data));
```

알수 있는건 `Content-Type` 헤더에 따라 Express 가 자동으로 그에 맞는 Body Parser Middleware 를 사용하여 Body 를 파싱한다는 것이다.

> Query-String 형식으로 데이터를 보내는 경우 `@` 같은 특수문자 처리를 위해 Client 측에서 `urlSearchParams` API 등을 사용하여 데이터를 인코딩 해서 보내는것이 좋다.

> 강의에선 그냥 넘어가고 테스트 하는 부분은 내가 임의로 추가함

### error-handling Middleware

자주 발생하는 상태 코드
* `400 Bad Request`: 클라이언트의 요청이 잘못되었거나 유효하지 않은 경우
* `401 Unauthorized`: 권한이 없어 거정되었지만 인증을 시도할 수 있는 경우
* `403 Forbidden`: 권한이 없어 거절된 경우 (User 가 접근하면 안되는 리소스에 접근하려는 경우)
* `404 Not Found`: 요청한 리소스를 찾을 수 없는 경우
* `500 Internal Server Error`: 서버에서 예기치 않은 에러가 발생한 경우

```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};
```

* `err`: 발생한 Error 객체
  * `err.message`: 에러 메시지
  * `err.name`: 에러 이름
  * `err.stack`: 에러 스택 트레이스 (발생 위치)
  * `err.status`: 에러 상태 코드 (개발자가 직접 추가할 수 있음)
* `req`, `res`, `next`: 일반 Middleware 와 동일

`./middleware/errorHandler.js` 파일을 생성하고 다음 코드를 작성하자.

```javascript
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;

  switch (status) {
    case 400:
      res.status(status).json({ error: 'ErrorHandler - Bad Request', message: err.message });
      break;
    case 401:
      res.status(status).json({ error: 'ErrorHandler - Unauthorized', message: err.message });
      break;
    case 403:
      res.status(status).json({ error: 'ErrorHandler - Forbidden', message: err.message });
      break;
    case 404:
      res.status(status).json({ error: 'ErrorHandler - Not Found', message: err.message });
      break;
    default:
      res.status(status).json({ error: 'ErrorHandler - Internal Server Error', message: err.message });
      break;
  }
};

module.exports = errorHandler;
```

이후 지금까지 작성한 코드를 다음과 같이 수정할 수 있다.

```javascript
const express = require('express');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/json', (req, res, next) => {
  console.log(req.body);
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    const err = new Error('Missing required fields: name, email, phone');
    err.status = 400;
    return next(err);
  }

  res.status(201).json({ message: 'Create Contacts' });
});

app.post('/urlencoded', (req, res, next) => {
  console.log(req.body);
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    const err = new Error('Missing required fields: name, email, phone');
    err.status = 400;
    return next(err);
  }

  res.status(201).send(`User ${name}, ${email}, ${phone} created successfully!`);
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

> 중요한 특징점
> 1. 가장 마지막에 `app.use(errorHandler)` 로 에러 핸들링 Middleware 를 등록해야 한다.
> 2. 일반 Middleware 에서 `next(err)` 형태로 에러를 넘기면, 에러 핸들링 Middleware 가 포착하여 처리한다.

### Middleware 의 순서
Middleware 는 등록된 순서대로 실행된다. 따라서 Middleware 의 **등록 순서**가 중요하다. 일반적으로 다음과 같은 순서로 Middleware 를 등록한다.

1. express 를 비롯한 package import
2. express instance 생성
3. Route 나 Error Handler 이외의 Middleware 등록, 예를 들어 Body Parser Middleware, CORS Middleware, Logging Middleware 등
4. Route 등록
5. Error Handler 등록
6. Server Listen

## Custom Middleware

```javascript
const express = require('express');
const app = express();

const logger = (req, res, next) => {
  console.log(`logger - ${req.method} ${req.url}`);
  next();
};

app.use(logger);

app.get('/', (req, res, next) => {
  res.send('Hello World!');
  setTimeout(() => {
    next();
  }, 1000);
});

app.use(logger);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

TODO