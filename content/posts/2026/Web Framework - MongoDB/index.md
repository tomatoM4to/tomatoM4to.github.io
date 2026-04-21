---
title: "Web Framework - MongoDB"
description: "202601 웹프레임워크, MongoDB 세팅 및 Express 와의 연동"
date: "2026-04-20"
keywords: "Database, JavaScript, KNU"
---

## NoSQL
**Not Only SQL** 의 약자로, 전통적인 관계형 데이터베이스(RDBMS)와는 **다른 방식**으로 데이터를 저장하고 관리하는 데이터베이스 시스템을 의미

MongoDB 같은 경우 **BSON(Binary JSON)** 형식으로 데이터를 저장하여, 유연한 스키마와 높은 확장성을 제공


## MongoDB 컨셉
MongoDB 는 Collection과 Document로 데이터를 저장
* **Collection**: RDBMS의 테이블과 유사한 개념으로, Document의 집합
* **Document**: RDBMS의 행과 유사한 개념으로, JSON과 유사한 구조로 데이터를 저장하는 단위

예를들어, Todo List 앱에서는 `todos` 라는 **Collection**을 만들어서, 각 할 일 항목을 **Document**로 저장할 것이다.

나중에 보겠지만 **Collection 에 해당 Document 들이 수없이 저장**될 수 있기 때문에, Document 는 RDBMS의 행과는 다르게 **유연한 구조**를 가질 수 있다.

```json
{
   "_id": ObjectId("..."),
   "title": "할 일 제목",
   "description": "할 일 설명",
   "completed": false,
   "createdAt": ISODate("2026-04-10T12:00:00Z")
}
```

예를들어  다른 할 일 항목에서는 `description` 필드가 **없거나**, 추가적으로 `dueDate` 필드가 **있을 수도** 있다. 이러한 유연한 구조는 **MongoDB의 큰 장점** 중 하나이다.

> `_id` 필드는 Primary Key 역할을 하며, MongoDB가 자동으로 생성하는 고유한 식별자다.

> 자유로운 구조는 장점이지만 반대로 단점이 되기도 한다. 예를들어 data 가 날짜로 들어갔다 문자로 들어갔다 난해해 질수 있기 때문, 그래서 Schema 를 강제해주는 ODM(Object Document Mapper) 라이브러리를 거의 필수적으로 사용 (해당 내용은 내가 임의로 작성)

## MongoDB Atlas

MongoDB Atlas 는 MongoDB의 클라우드 서비스로, MongoDB 데이터베이스를 쉽게 생성, 관리, 확장할 수 있도록 도와주는 플랫폼

[https://www.mongodb.com/ko-kr](https://www.mongodb.com/ko-kr)

### cluster 생성
회원가입을 하면 자동으로 cluster 를 만드는 과정이 진행된다. cluster 는 MongoDB 데이터베이스의 인스턴스를 의미하니 만들어 주도록 하자

20260420 기준 왼쪽 사이드바에에서 **Data Explorer** 메뉴를 선택하고 아까 문단 Cluster 에 connect 하면 Sample data 가 보이는것을 확인할 수 있다.

### Database & Collection 생성
`+` 버튼을 눌러 새로은 DB 를 만들거나, DB 내부에 새로운 Collection을 만들수 있다. 여기선 `myContacts` DB 와 `contacts` Collection 을 만들어 본다

### User 생성
왼쪽 사이드바에서 `SECURITY/Database & Network Access` 메뉴로 이동하여 새로운 USER 를 추가할 수 있다.

새로운 USER 를 추가하고 VsCode 에서 MongoDB Extension 을 설치하여, MongoDB Atlas 에 연결해보도록 하자

연결할땐 Project Overview 페이지에서 Connect 버튼을 눌러 string 을 복사하하고 사용하면 된다.

### Error
그와중에 에러 떠서 Docker 로 실행함, IP 화이트리스트도 아니고 여럿 찾아보니 통신사 DNS 가 스트링을 해석 못해서 생기는 문제라는데, 배보다 배꼽이 더 커서 Docker 로 실행하는 방법으로 해결했다.

`docker-compose.yml`

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: local-mongo
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secret
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

```bash
docker-compose up -d
```

> mongodb://admin:secret@localhost:27017

## Express 와 MongoDB 연동

```bash
npm install mongoose dotenv
```
* `mongoose` 는 MongoDB와 Node.js 애플리케이션 간의 상호 작용을 쉽게 해주는 ODM(Object Document Mapper) 라이브러리
* `dotenv` 는 환경 변수를 쉽게 관리할 수 있도록 도와주는 라이브러리

`.env` 파일에 MongoDB 연결 문자열을 저장

```env
MONGO_URI=mongodb://admin:secret@localhost:27017/myContacts?authSource=admin
```

이후 `config/dbConnect.js` 파일을 만들어 MongoDB 연결 설정을 작성

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = dbConnect;
```

`app.js` 파일에서 MongoDB 연결을 초기화

```javascript
const express = require('express');
const dbConnect = require('./config/dbConnect');

const app = express();
dbConnect();
```

> `authSource=admin` 는 해당 계정이 admin 데이터 베이스에 소속되어 있단걸 MongoDB 에게 알려주는 역할을 함

## Schema & Model
MongoDB 는 다른 RDBMS 와는 다르게, **Collection 에** 어떤 형식의 JSON Document 가 저장될지에 대한 **제약이 없다.**

하지만 Schema 를 정의해주는 **ODM 라이브러리**를 사용하면, **Document의 구조를 강제**할 수 있다. **Mongoose** 는 **Schema 와 Model 을 통해 이를 지원**한다.

* **Schema**: Document의 구조를 정의하는 객체로, 필드의 타입, 유효성 검사, 기본값 등을 설정할 수 있다.
* **Model**: Schema를 기반으로 생성된 객체로, **실제 데이터베이스와 상호 작용**하는 역할을 한다.

### mongoose.Schema
* `name`, `age`, `email` 필드를 가진 UserSchema 를 정의
* `type` 속성으로 각 필드의 데이터 타입을 지정
  * `String`, `Number`, `Boolean`, `Date`, `Array`, `Object`, `Mixed`
* `required` 속성으로 필수 필드 여부를 설정

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});
```

### mongoose.model
Schema 를 기반으로 Model 을 생성하는 함수, `mongoose.model('ModelName', schema)` 형태로 사용

```javascript
const User = mongoose.model('User', userSchema);
```

해당 로직이 실행해면 MongoDB 에 `users` 라는 Collection 이 자동으로 생성되고, **User 모델을 통해 해당 Collection 에 Document 를 추가하거나 조회**할 수 있다.

`User` 와 같이 **대문자 단수 모델**을 만들면 MongoDB 에는 **소문자 복수형**인 `users` 라는 Collection 이 만들어지는게 **Mongoose 의 기본 동작** 방식이다.

### Example
`models/contactModel.js` 파일을 만들어 Contact 모델을 정의

```javascript
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  office: {
    type: String,
  },
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
```

`required: [true, 'Phone number is required']` 형태로 작성하면, 해당 필드가 누락되었을 때 Mongoose 가 자동으로 에러 메시지를 생성해준다.

> 이후 CRUD 에서 계속 진행