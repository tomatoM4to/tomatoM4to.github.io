---
title: "Web Framework - EJS"
description: "202601 웹프레임워크, Express 프레임워크 EJS 적용하기"
date: "2026-06-04"
keywords: "Express, JavaScript, KNU"
---

## Template Engine
단순한 Static File 서빙을 넘어, Runtime 에 App 의 State 나 DB 쿼리 결과를 HTML 에 바인딩하여 **동적으로 DOM 트리를 구성**하기 위한 렌더링 도구.

* **Template File**: 순수 HTML 에 템플릿 엔진만의 독자적인 문법이 결합된 형태, View 스키마 역할을 함
* **Template Engine**: Template File 을 순수 HTML 로 컴파일 하는 런타임 모듈

> `DB` -> `Controller` -> `Template Engine (Template File + Data 객체 결합)` -> `HTML 응답` -> `Browser`

> 해당 강의에선 EJS 를 사용, 이외에서 Pug 나 Handle Bar 등이 존재

> 모던 웹 생태계 에선 React 나 Vue 가 View 의 역할을 전담하고, 백엔드는 순수하고 JSON 데이터만 던져주는 방식이 흔하지만, 해당 강의는 고전적인 SSR 아키텍처를 설명

Template Engine 을 도입하기 전 Server 에서 UI 를 렝더링 하기 위한 코드 (비즈니스 로직과 UI 가 완전히 결합됨)

```javascript
app.get('/user', (req, res) => {
    const user = db.getUser(); // 비즈니스 로직 (Data)

    // HTML 문자열에 데이터를 직접 더하기 (View)
    let html = "<h1>User Information</h1>";
    html += "<p>Name: " + user.name + "</p>";
    html += "<p>Email: " + user.email + "</p>";
    html += "<p>Phone: " + user.phone + "</p>";

    res.send(html);
});
```

이후 Template Engine 도입 후 코드

```javascript
app.get('/user', (req, res) => {
    const userData = db.getUser();

    // 템플릿 파일명과 데이터 객체만 엔진에 던짐
    res.render('profile', { user: userData });
});
```

`profile.ejs` 는 다음과 같은 형태

```html
<h1>User Information</h1>
<p>Name: <%= user.name %></P>
<p>Email: <%= user.email %></P>
<p>Phone: <%= user.phone %></P>
```

## Express Settings
EJS 는 기본 포함되는 라이브러리가 아니기에 먼저 설치부터 진행해야 한다.

```bash
npm install ejs
```

이후 Express 에 연결

> Template Engine 이 위치하는 인스턴스 생성 직후, 최상위 영역에 위치해야 함

```javascript
const app = express();

app.set("view engine", "ejs");  // 템플릿 엔진 설정, 파일 확장자가 .ejs 인 파일을 템플릿 파일로 인식
app.set("views", "./views");    // 템플릿 엔진이 템플릿을 어디서 찾을지 경로 설정

// app.set('views', path.join(__dirname, 'views'));  // 이게 좀더 안정적이지만, 수업에선 위 코드를 사용
```

> `app.set(key, value)` 는 Express 에서 App Level 의 전역 설정(Configuration) 을 저장하는 Key-Value 레지스트리

기본 문법을 익히기 전이니 아래 코드를 `~/views/getAll.ejs` 에 작성하자.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Get All Contacts</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
  <h1><i class="fa-solid fa-address-card"></i>Contacts Page</h1>
</body>
</html>
```

이후 이전의 `getAllContacts` 함수를 아래처럼 수정

```javascript
const getAllContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find();
    res.render("getAll");
});
```

이제 `localhost:3000` 으로 접속하면 렌더링된 화면이 보임, 하지만 위 예제는 정적인 파일과 다를게 없으니 다음 챕터에서 동적인 데이터를 주입하는 예제 소개

## EJS (Embedded Javascript)

* `<%= %>`: 변수 값을 HTML 에 출력, XSS 공격 방지를 위해 HTML 태그를 문자열로 변환하여 출력함
* `<% %>`: 제어 흐름(조건문, 반복문 등) 이나 JavaScript 순수 로직을 작성, 화면에 출력되지 않음
* `<%- %>`: 변수에 담긴 문자열을 이스케이프(Escape) 처리 없이 순수 HTML로 렌더링
* `include()`: 다른 `.ejs` 파일의 내용을 읽어와 텍스트로 반환, 보통 `<%- include('...') %>` 형태로 결합하여 모듈화된 HTML 을 재사용

하나하나 자세히 살펴보겠지만, 위 코드를 아래처럼 변경해보자

```html
<body>
  <h1><i class="fa-solid fa-address-card"></i>Contacts Page</h1>
  <h2><%= heading %></h2>
  <ul>
    <% user.forEach(user => { %>
      <li>
        <strong>Name: </strong> <%= user.name %>
      </li>
      <li>
        <strong>E-mail: </strong><%= user.email %>
      </li>
    <% }); %>
  </ul>
</body>
```

```javascript
const getAllContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find();
    res.render("getAll", { heading: "User List", user: contacts});
});
```

## express.static
* `~/views`: ejs 같은 Template File
* `~/public`: `.webp`, `.css`, `.js` 같은 정적 파일들이 위치

`express.static("./public")` 은 내장 미들웨어로, 클라이언트가 정적파일을 요청하면 해당 파일이 있는지 검사하고 있다면 클라이언트에게 Response 하는 방식으로 동작한다. 덕분에 `<link rel="stylesheet" href="/css/style.css">` 을 처리하기 위해 일일이 라우터를 만들지 않아도 괜찮음

```javascript
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./public"));
```

이후 `~/public/css/style.css` 를 만들고 아래 코드를 추가하자.

```css
* {
  margin:0;
  padding:0;
}
body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
h1 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 3em;
  margin-bottom: 20px;
}
h1 i {
  margin-right: 0.8em;
}
h2 {
  margin-bottom: 15px;
}
```

이후 `getAll.ejs` 의 header 에 `<link rel="stylesheet" href="/css/style.css">` 추가

Network 탭을 보면 브라우저가 자동으로 `localhost:3000/css/style.css` 를 요청했을때 express 가 해당 요청을 `~/public/css/style.css` 로 매핑시켜 Response 하도록 작동하는 모습을 볼 수 있다.

> `public` 을 Static File 의 Root 로 삼아놨기 때문에, Frontend 상에 `./public` 으로 임의로 선언하면 안됨을 주의

> `/` 로 시작함을 주의

## Project

1. `getAll.ejs` 는 지우고 `index.ejs`, `add.ejs`, `update.ejs` 추가
2. 중복된 HTML 태그를 `<%- %>` 로 제거 (Header 와 Footer)

지금 현재까지는 `index.ejs` 만 render 하는중

> [https://github.com/tomatoM4to/Express-example-code/tree/ejs](https://github.com/tomatoM4to/Express-example-code/tree/ejs)

> 중복된 UI 는 `views/include` 디렉토리에 생성, 해당 디렉토리 내의 파일들은 다른 `.ejs` 파일과 구분하기 위해 `_` 접두사를 붙이는것이 관례

> `<%- include('./include/_header') %>`, `<%- include('./include/_footer') %>`

