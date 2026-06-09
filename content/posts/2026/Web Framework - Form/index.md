---
title: "Web Framework - Form"
description: "202601 웹프레임워크, Form 처리"
date: "2026-06-06"
keywords: "Express, JavaScript, KNU"
---

## Form
App 에서 Login 하거나 어떠한 Request 를 보낼때 사용자가 입력하는 UI

```html
<!--  -->
<form method="POST">
  이름: <input type="text" name="name">
  이메일: <input type="text" name="email">
  전화번호: <input type="text" name="phone">
  <button type="submit">저장하기</button>
</form>
```

1. GET 일 경우, 해당 Data 들이 **QueryString** 형태로 **URL 에 추가**됨, URL 자체가 보내고자 하는 데이터
2. POST 일 경우, 해당 Data 들이 **QueryString** 형태로 **Body 에 포함**되어 Request 를 보냄
3. `name` 속성은 **QueryString 의 변수에 들어갈 Variable** 을 지정하는 부분, Server 측에서 인식하기 위한 필수값
4. Form 의 요청 방식은 GET 과 POST 뿐, 다른 요청방식을 처리하려면 AJAX 나 **Nodejs 의 method-override** 를 사용

> 1, 2, 3 은 임의로 추가

> Post 시 Body 에 QueryString 과 똑같이 생긴 포맷으로 데이터가 들어가는데, 해당 포맷의 공식 명칭은 `application/x-www-form-urlencoded`

### action
`<form>` 태그의 action 속성은 폼 데이터(form data)를 서버로 보낼 때 해당 데이터가 도착할 **URL을 명시**, URL 은 absolute URL 과 relative URL, 두가지를 지정 가능, 지정하지 않으면 현재 위치한 URL 을 목적지로 요청을 보냄

예를들어, `/users/add` 페이지에 아래와 같은 form 이 있다면

```html
<form method="POST">
  이름: <input type="text" name="name">
  <button type="submit">저장</button>
</form>
```

Express 측은 아래와 같은 코드를 작성할 수 있다.

```javascript
// 1. 폼 화면을 보여주는 역할 (브라우저 주소창 입력)
app.get('/users/add', (req, res) => {
    res.render('addForm');
});

// 2. 폼 데이터를 받아서 처리하는 역할 (폼의 submit 버튼 클릭)
app.post('/users/add', (req, res) => {
    console.log(req.body.name); // 제출된 데이터 처리
    res.redirect('/users');     // 처리 후 다른 페이지로 이동
});
```

> 해당 부분은 임의로 추가

### urlencoded
form 은 URL 기반으로 데이터를 전송하기 때문에, 한글 데이터 같은 경우 **ASCII 로 Encoding** 된다.

Encoding 된 데이터를 Express 측에서 Decoding 하기 위한 Middleware 를 추가해야 정상적으로 Client 가 보낸 데이터를 Express 측에서 사용할 수 있음

* `extended: false`: Node.js 의 querystring 사용, 간단한 문자열이나 단순 배열을 Parsing
* `extended: true`: Express 의 qs 사용, 복잡한 객체나 배열까지 Parsing

> * **Decoding**: 네트워크를 타고 넘어온 ASCII 문자열을 원래의 문자로 복원하는 과정
> * **Parsing**: 복원된 텍스트를 잘라내어 백엔드에서 다루기 위한 Object 구조로 조립하는 과정

```javascript
const express = require('express');
const dbConnect = require('./config/dbConnect');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./public"));

dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", require("./routers/contactRouter"));
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

### method-override

```bash
npm install method-override
```

```javascript
const express = require('express');
const methodOverride = require('method-override');
const dbConnect = require('./config/dbConnect');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./public"));
app.use(methodOverride("_method"));

dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", require("./routers/contactRouter"));
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

이후 form 의 QueryString 에 `?_method=PUT` 값을 넣어, POST 요청을 PUT 요청으로 Override 한다.

```html
<form action="<%= contact._id %>?_method=PUT" method="POST">
  ...
</form>
```

## Project

> [https://github.com/tomatoM4to/Express-example-code/tree/form](https://github.com/tomatoM4to/Express-example-code/tree/form)

### Issue 1

```javascript
router.route("/")
    .get(getAllContacts)
    .post(createContact);

router.route("/add")
    .get(addContactForm);

router.route("/:id")
    .get(getContact)
    .put(updateContact)
    .delete(deleteContact);
```

Express 의 라우팅은 Top-Down 순차 평가 방식이기 때문에 `/add` 를 `/:id` 보다 밑에 둘시, `localhost:3000/add` 에 접속하면 Express 는 `/add` 를 `/:id` 패턴에 먼저 매핑시켜 버림

### Issue 2
```javascript
const createContact = asyncHandler(async (req, res, next) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        const error = new Error("All fields are required");
        error.status = 400;
        return next(error);
    }
    const contact = await Contact.create({
        name,
        email,
        phone
    });
    // res.status(201).send(contact);
    res.redirect("/");
});
```
전통적인 form은 데이터를 Request하고 받은 Response를 그대로 브라우저 화면에 새로 렌더링(새로고침) 해버린다.

### Issue 3
form 의 POST 는 기본적으로 데이터를 Body 에 담아서 보내지만, `action="URL"` 은 숨겨주지 않는다. 브라우저 화면에 뜰 수도 있음

### 이슈 4

```html
<tbody>
  <% contacts.forEach(contact => { %>
    <tr>
      <td><%= contact.name %></td>
      <td><%= contact.email %></td>
      <td><%= contact.phone %></td>
      <td>
        <a href="/<%= contact._id %>" class="btn update" title="수정">
          <i class="fas fa-pencil-alt"></i>
        </a>
        <form action="/<%= contact._id %>?_method=DELETE" method="POST" style="display:inline">
          <input type="submit" class="btn delete" title="삭제" value="X" />
        </form>
      </td>
    </tr>
  <% }); %>
</tbody>
```

`<a/>` 는 사실상 GET 요청과 기능적으로 완전히 동일
* `<a/>`: 정적, 미리 정의해둥 URL 로만 이동
* `<form method="GET">`: 동적, 사용자가 `<input name="search">` 에 검색어 등을 입력하고 제출하면, 브라우저가 알아서 action URL 뒤에 `?search=값` 형태로 동적인 쿼리스트링을 조립해서 GET 요청을 날려줌