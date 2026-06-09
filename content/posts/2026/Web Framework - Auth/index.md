---
title: "Web Framework - Auth"
description: "202601 웹프레임워크, JWT 로 사용자 인증하기"
date: "2026-06-09"
keywords: "Express, JavaScript, KNU"
---

## Authentication
1. **식별(Identification)**: `User.findOne({username})`, DB 에서 유저 찾기
2. **검증(Verification)**: `bcrypt.compare()`
3. **상태 유지(Session Management)**: 검증 후 Session 을 만들고나 JWT 발급

## hash function
* **임의의 길이의 데이터를 고정된 길이의 데이터로 변환**해 주는 수학적 알고리즘
* **단방향성**: 결괏값(해시)을 통해 원본 데이터를 다시 역산하는 것이 불가능
* 입력값이 같으면 항상 같은 hash 를 반환해야 하며, 조금만 변경해도 완전히 다른 값을 반환 해야 함

password 저장, 데이터 무결성, 자료구조 등등 매우 다양항 분야에서 활용, 대표적인 hash 알고리즘으로 SHA-256 이 있음

> password 저장 시 hash 값을 DB 에 저장 해야 함 (보안적으로도 중요하며 법적으로도 중요)

## bcrypt
```bash
npm install bcrypt
```

### hash

`bcrypt.hash(data, saltRounds, callback)`
* `data`: 해시하려는 값
* `saltRounds`: hash 를 반복할 횟수 (보통 5에서 10 사이의 숫자를 사용)
* `callback`: 입력값을 hash 한 후에 실행할 함수

```javascript
const password = "password1234";

// bcrypt.hash(data, 해시를 반복할 횟수, callback);
bcrypt.hash(password, 10, (err, hash) => {
  try {
    // hash 된 password 를 DB 에 저장하거나 다른 처리
  }
  catch (err) {
    // err 처리
  }
});
```

### compare

`bcrypt.compare(data, encrypted, callback)`
* `data`: 비교할 입력값
* `encrypted`: 비교할 대상
* `callback`: 값 2개를 비교한 후에 실행할 함수

```javascript
const loginPassword = '로그인 비밀번호';
const hashedPassword = 'DB에서 가져온 해시 값';

bcrypt.compare(loginPassWord, hashedPassword, (err, result) => {
  try {
    if (result === true) {
      // 비밀번호 일치
    }
    else {
      // 불일치
    }
  }
  catch (err) {
    // err 처리
  }
})

```

## Token
* HTTP 는 기본적으로 Stateless 한 Protocol
* HTTP 는 Request 를 처리하면 Server 와의 연결을 종료하는 Connectionless 한 Protocol

해당 특성으로 인해 **지속적인 연결이 필요한 인증된 사용자** 를 만들기 위해선 **Client 와 Server 사이 간 User 를 인식 할 수 있는 정보**를 가지고 있어야 함

해당 기능을 구현하기 위한 기술로 아래 3가지가 있다
* Cookie
* Session
* JWT

수업에서 살펴볼 JWT, 즉 Token 방식을 Session 과 비교해서 설명하면

1. **Session** 은 **Server 와 Client 각각 SessionID 를 저장**하고, Client 가 Request 를 보낼 시 Cookie 에 SessionID 를 포함하여 Request 를 보냄, Server 측은 SessionID 를 검증하고 인증된 사용자인지 판별
2. **Token** 은 **Server 측에서 인증에 필요한 정보를 인코딩 및 서명하여 Client 에 전달**함, Client 측에서 Request 를 보낼 때 **Http Header 에 Token 을 포함**하여 Request 를 보내면, **Server 측은 해당 Token 을 디코딩 및 서명 검증** 해서 해당 User 가 인증된 사용자인지 판별

핵심점은 결국 인증에 필요한 정보를 **Server 와 Client 둘다 저장**하냐, **Client 에만 저장**하냐의 차이

예전엔 Session 방식을 기본으로 사용했지만 현대는 Service 가 너무 커지며 Distributed System 같은 기술이 등장하면서 Token 방식을 도입하게 되었음, Token 방식은 따로 공간을 차지하지도 않으며 Server 같 공유도 가능하기 때문

Token 방식으로 인증을 하기 위한 순서
1. Client 가 Login Request 를 보냄
2. Server 는 DB 에 Client 가 있는지 확인
3. Client 가 확인되면 Server 에서 Token 을 발급하고, Token 을 포함은 Response 를 Client 에게 보냄
4. Client 측에서 Cookie 에 Token 을 저장
5. Client 에서 Login 이 필요한 Service 에 Request 를 보낼 때, 브라우저가 자동으로 Header 에 `Cookie: token=...` 형태로 Request 를 보냄
6. Server 측에서 사용자 검증 후 Response


> 이론적으로 Token 방식은 Server 측에 ID 를 저장하지 않지만, 여러 이슈로 인해 현대는 Session 방식과 Token 방식을 결합한 Refresh Token, Access Token 방식을 사용함, 구현은 그만큼 더 까다로워 짐

> Cookie 는 Http 표준 스팩이면서, Response Header 에 Cookie 가 있다면 브라우저가 자동으로 저장하고 이후 Request 에 Cookie 와 함께 Request 함

> Token 같은 경우 Cookie 가 아닌 Session storage, Local storage 에 저장하거나 아예 Memory 레벨에서 저장해 탭을 끄면 아예 사라지도록 만들 수도 있음, Cookie 가 아닌곳에 저장할 시 `Authorization: Bearer <token>` 형태로 Request 를 보냄

> Token의 Payload는 누구나 디코딩해서 내용을 볼 수 있으므로 비밀번호 등 민감한 정보를 담으면 안 됨. 또한, Token 자체가 권한을 증명하는 출입증(Bearer) 역할을 하므로 탈취를 막기 위해 반드시 통신 구간 전체를 암호화하는 Https 가 선행되어야 함.

## JWT
> [https://www.jwt.io/](https://www.jwt.io/)
>
> 해당 웹사이트에서 어떻게 정보를  Encoding 하고 Decoding 하는지 눈으로 볼 수 있다.

JWT 는 **Header, Payload, Verify Signature** 로 구성되며, 해당 정보는 `.` 으로 구분된다.

* **Header**: Token 의 알고리즘 유형
* **Payload**: 사용자 인증 정보가 담겨 있음, Payload 에 있는 각각의 Filed 를 Claim 이라고 함
* **Verify Signature**: 인코딩된 **Header와 Payload를 결합**한 후, **Server만 아는 Secret Key를 사용해 생성한 해시값** (위변조 방지용 서명)

**Encoded Token**
```jwt
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
```

**Decoded Token [Header]**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Decoded Token [Payload]**
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "iat": 1516239022
}
```

**Secret Key (서버 보관용)**
```
a-string-secret-at-least-256-bits-long
```

요약하면 해당 Token 은 `HS256` 으로 서명(Sign)되어 있으며 사용자의 `name` 은 `"John Doe"` 임을 알 수 있다.

Server 가 해당 JWT 를 검증하는 순서
1. Encoding 된 Header 와 Payload, 그리고 **Secret Key (서버 보관용)** 를 합쳐서 **HS256** 함수를 돌림
2. **Verify Signature** 와 비교해 정말 Server 측에서 생성한 JWT 가 맞는지 검증

Express 에서 JWT 인증을 하기 위해 아래 라이브러리를 설치하자

```bash
npm install cookie-parser
npm install jsonwebtoken
```

심플한 사용 방법
* `jwt.sign(페이로드, 비밀키, [옵션, 콜백])`
* `jwt.decode(토큰, 비밀키, [옵션])`
* `jwt.verify(토큰, 비밀키, [옵션])`

> `.env` 에 `JWT_SECRET=secret` 추가 해야 함

## Project
> [https://github.com/tomatoM4to/Express-example-code/tree/auth](https://github.com/tomatoM4to/Express-example-code/tree/auth)

여기서 사용되는 인증은 그저 컨텐츠를 보거나 업로드, 삭제, 수정할 수 있는 사용자 생성을 의미함, 각 사용자마다 권한을 분리하는 기능은 존재하지 않음
1. Check Login Middleware, `/contacts` Router 에 적용
2. Login form
3. Logout 은 GET 요청과 `<a />` 로 구현됨