---
title: "Web Framework - Express Router"
description: "202601 웹프레임워크, Express 프레임워크의 Router에 대한 설명, 예제코드"
date: "2026-04-19"
keywords: "Express, JavaScript, KNU"
---

## Router

URL 경로에 따라 다른 응답을 반환하는 기능

Express 프레임워크에서는 `express.Router()` 를 사용하여 라우터를 생성하고 관리할 수 있다.

```javascript
const express = require('express');
const app = express();

const router = express.Router();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

router.get('/', (req, res) => {
  res.status(200);
  res.send('GET: contacts');
});

router.post('/', (req, res) => {
  res.status(201);
  res.send('POST: contacts');
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.status(200);
  res.send(`GET: contact with id ${id}`);
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  res.status(200);
  res.send(`PUT: update contact with id ${id}`);
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  res.status(200);
  res.send(`DELETE: delete contact with id ${id}`);
});

app.use('/contacts', router);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

> `app.use(PATH, Middleware)` 함수에 **특정 경로에 대해 Middleware 를 등록**할 수 있다. Express 는 **모든 요청에 대한 처리가 Middleware 체인**을 통해 이루어 지므로 `router` 또한 Middleware 로 등록해야 사용 가능하다.

> `app.use(Middleware)` 처럼 경로를 지정하지 않고 Middleware 를 등록할 수도 있는데, **이 경우 모든 요청에 대해 해당 Middleware 가 실행**된다.

> `router` 를 다른 Module 로 분리하여 관리할 수 있다.

위의 경우 `/` 와 `:id` 가 반복되니 아래처럼 코드를 좀더 간결하게 작성할 수도 있다.
```javascript
router.route('/')
  .get((req, res) => {
    res.status(200);
    res.send('GET: contacts');
  })
  .post((req, res) => {
    res.status(201);
    res.send('POST: contacts');
  });

router.route('/:id')
  .get((req, res) => {
    const id = req.params.id;
    res.status(200);
    res.send(`GET: contact with id ${id}`);
  })
  .put((req, res) => {
    const id = req.params.id;
    res.status(200);
    res.send(`PUT: update contact with id ${id}`);
  })
  .delete((req, res) => {
    const id = req.params.id;
    res.status(200);
    res.send(`DELETE: delete contact with id ${id}`);
  });
```

> RESTful API 설계 원칙대로면, 자세한 설명 없이도 각 HTTP 메서드와 URL 경로만 보고도 어떤 기능을 하는 API 인지 쉽게 알 수 있다.
> * `GET /contacts`: 전체 연락처 보기
> * `POST /contacts`: 연락처 생성
> * `GET /contacts/:id`: 특정 연락처 보기 (상세 보기)
> * `PUT /contacts/:id`: 특정 연락처 수정
> * `DELETE /contacts/:id`: 특정 연락처 삭제

`routes/contacts.js` 파일로 라우터를 분리하여 관리할 수도 있다.
```javascript
// routes/contacts.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('GET: contacts');
});

router.post('/', (req, res) => {
  res.send('POST: contacts');
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.send(`GET: contact with id ${id}`);
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  res.send(`PUT: update contact with id ${id}`);
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  res.send(`DELETE: delete contact with id ${id}`);
});

module.exports = router;
```

```javascript
// app.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/contacts', require('./routes/contacts'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

> `app.use(PATH, require())` 패턴을 쓸때는, `require()` 로 불러오는 Module 이 Express Router Function 이어야 한다.