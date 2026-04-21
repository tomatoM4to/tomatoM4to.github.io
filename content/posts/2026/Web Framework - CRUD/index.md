---
title: "Web Framework - CRUD"
description: "202601 웹프레임워크, MongoDB 와 Express 를 활용한 CRUD 앱"
date: "2026-04-21"
keywords: "Express, JavaScript, KNU"
---

## RESTful API
**HTTP Method 의 설계 의도**에 맞게 API 를 설계하는것, **URI 는 명사형 소문자**로 표현하고, HTTP Method 는 행위를 표현하는것이 일반적이다.

예를들어, Todo List 앱에서 할 일 항목을 관리하는 API 를 설계할 때 다음과 같이 RESTful API 를 설계할 수 있다.

| HTTP Method | URI           | Description          |
|-------------|---------------|----------------------|
| GET         | /todos        | 모든 할 일 항목 조회 |
| GET         | /todos/:id    | 특정 할 일 항목 조회 |
| POST        | /todos        | 새로운 할 일 항목 생성 |
| PUT         | /todos/:id    | 특정 할 일 항목 전체 업데이트 |
| PATCH       | /todos/:id    | 특정 할 일 항목 일부 업데이트 |
| DELETE      | /todos/:id    | 특정 할 일 항목 삭제 |

이밖에도 **자원간의 계층**이 있다면 `/` 로 구분하거나, **단어가 2개 이상**일땐 **케밥 표기법**을 사용하는 일종의 개발자들간의 약속을 의미한다.

> 교재에선 카멜 표기법이라 나와 있는데 `-` 을 쓰는 방식은 케밥 표기법이라 수정함

## CRUD Overview
**Create, Read, Update, Delete** 의 약자로, 데이터의 생성, 조회, 수정, 삭제의 네 가지 기본적인 기능을 의미한다.

| HTTP Method | CRUD Operation | Description          |
|-------------|----------------|----------------------|
| POST        | Create         | 새로운 데이터 생성      |
| GET         | Read           | 데이터 조회            |
| PUT         | Update         | 데이터 수정            |
| DELETE      | Delete         | 데이터 삭제            |

## MVC Pattern
**Model-View-Controller** 의 약자로, 애플리케이션을 **세 가지 주요 구성 요소**로 분리하는 **소프트웨어 디자인 패턴**을 의미한다.

* **Model**: 애플리케이션의 **데이터 구조**를 정의하고, **데이터베이스를 통해 자료를 저장, 검색, 수정** 하는 역할, 해당 Project 에선 Mongoose 가 Model 역할을 한다.
* **View**: Controller 나 Model 의 처리 결과를 시각적으로 보여주는 역할 (고전적은 Front-end)
* **Controller**: Model 과 View 사이에 위치하며, **Request** 에 따라 **Model 이나 View 를 제어**하는 역할, 대부분의 로직이 Controller 에 작성된다.

> Router 도 Controller 의 일부로 볼 수 있고, 따로 보기도 한다.

만약 모든 연락처 불러오기라면 이런 순서로 실행된다고 설명할 수 있다.
1. Client 가 Controller 에 Request 를 보낸다.
2. Controller 는 정보를 처리하기 위해 Model 에 요청을 전송
3. Model 은 DB 에서 모든 연락처 정보를 달라고 요청
4. DB 는 Model 에 모든 연락처 정보를 반환
5. Model 은 받은 정보를 Controller 에 반환
6. Controller 는 받은 정보를 View 에 전달
7. View 는 해당 정보를 Client 에게 전달

> 혹은 Router 가 Request 를 받아서 Controller 에 전달하는 형태로도 볼 수 있다.
>
> Client -> Router -> Controller -> Model -> DB -> Model -> Controller -> View -> Client

## CRUD
```bash
npm install express-async-handler
```

express 는 4.0 버전까지 `async/await` 에서 발생하는 err 를 자동으로 캐치하지 못하는 문제가 있었다. 그래서 모든 라우터 핸들러를 `try-catch` 문으로 감싸야 했는데, `express-async-handler` 패키지를 사용하면 이를 간단하게 해결할 수 있다.

> 5.0 버전부터는 해당 문제가 해결되어 `try-catch` 문 없이도 `async/await` 를 사용할 수 있다. 교재에선 그냥 사용

기존 코드를 마이그레이션 한 코드 링크

[Controller Example GitHub](https://github.com/tomatoM4to/Express-example-code/tree/CRUD-Controller-Example)

MongoDB 에서 데이터를 컨트롤 해보자, 주로 사용하는 함수는 다음과 같다.

```javascript
// 새로운 Document 생성, 생성된 Document 반환
Contact.create({
  name: 'John Doe',
  email: 'example@axample.com',
  phone: '123-456-7890'
});

// 조건이 일치하는 모든 Document 를 찾아 Array 형태로 반환, 아무것도 없다면 [] 반환
Contact.find();
Contact.find({ name: 'John Doe' });

// 조건에 일치하는 Document 중 가장 첫번째로 검색된 Document 반환, 아무것도 없다면 null 반환
Contact.findOne({ name: 'John Doe' });

// 조건에 해당하는 Document 를 찾아 업데이트
// 실행 결과 객체(matchedCount, modifiedCount 등)를 반환함!
Contact.updateOne({ name: 'John Doe' }, { phone: '987-654-3210' });
Contact.updateMany({ name: 'John Doe' }, { phone: '987-654-3210' });

// 조건에 해당하는 Document 삭제
// 삭제된 Document가 아니라 실행 결과 객체(deletedCount 등)를 반환함!
Contact.deleteOne({ name: 'John Doe' });
Contact.deleteMany({ name: 'John Doe' });

// ID 를 기준으로 Document 반환, 아무것도 없다면 null 반환
Contact.findById('12345');

// ID 를 기준으로 Document 업데이트
// { new: true } 옵션을 주어야 '업데이트가 완료된 최신 Document'를 반환
// (옵션이 없으면 수정되기 전의 Document 반환)
Contact.findByIdAndUpdate('12345', { phone: '987-654-3210' }, { new: true });

// ID 를 기준으로 Document 삭제
// 삭제된 해당 Document를 반환함, 아무것도 없다면 null 반환
Contact.findByIdAndDelete('12345');
```

> return 정보는 다루지 않았지만, 내가 임의적으로 추가함

> 추가 정보인데, MongoDB 는 Database 가 없어도, Database 의 Collection 이 없어도 URI 랑 Model 만 제대로 작성 했다면 문제 없이 작동한다. (알아서 만들어줌)

생성된 Document 는 아래처럼 생겼다

```json
[
    {
    "_id": "69e7456dce428983bd0e2714",
    "name": "John",
    "email": "example@example.com",
    "phone": "1111-0000-0000",
    "createdAt": "2026-04-21T09:37:49.688Z",
    "updatedAt": "2026-04-21T09:37:49.688Z",
    "__v": 0
  },
]
```

여기서 `_id` 는 MongoDB 가 자동으로 생성하는 고유 식별자, 로 해당 값을 query-string 으로 전달해 특정 Document 를 조회하는 로직을 작성할 수 있다.

> [CRUD Example Github](https://github.com/tomatoM4to/Express-example-code/tree/CRUD-MongoDB-Example)

교재에선 update 와 delete 를 `Contact.findById()` 로 받아봐 해당 instance 를 활용하여 처리했지만, 강의에선 `Contact.findByIdAndUpdate()`, `Contact.findByIdAndDelete()` 함수를 활용

ErrorHandler 와 next 함수또한 강의에선 안썼지만 내 예제코드에선 임의로 작성했다.

```javascript
// findById() 활용
const contact = await Contact.findById(req.params.id);

if (!contact) {
  res.status(404);
  throw new Error('Contact not found');
}

// 교재에선 조건 문 없이 바로 할당
contact.name = req.body.name || contact.name;
contact.email = req.body.email || contact.email;
contact.phone = req.body.phone || contact.phone;

// 교재에선 await 없었음
await contact.save();

// delete()
const contact = await Contact.findById(req.params.id);

if (!contact) {
  res.status(404);
  throw new Error('Contact not found');
}

await contact.deleteOne();
```
