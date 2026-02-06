---
title: "HTTP (2) - Method"
description: "HTTP 프로토콜의 다양한 메서드에 대해 알아봅니다."
date: "2025-06-25"
keywords: "HTTP, Network"
---

# Http 메서드

Http 메서드의 종류는 많지만 가장 많이 사용되는 몇가지를 정리해볼 예정

먼저 알아둬야 할것은, Http 메서드는 일종의 약속으로서 필요하다면 직접 정의할 수도 있음

하지만 일반적으로 Client 와 Server 간의 통신에선 Client 의 브라우저가 표준에 맞지 않는 메서드를 거부할 수도 있기에, 표준에 정의된 메서드를 사용하는 것이 좋음

하지만 많은 경우 1번 API 는 GET, 2번 API 는 POST, 3번 API 는 PUT 등과 같이 메서드들을 완전히 구분짓는건 매우 어려움

많은 부분이 개발자가 어떻게 설계하는지에 달려있음

## GET

- 서버로부터 데이터를 요청할 때 사용됨
- 일반적으로 Body 없이 요청을 보냄
- Body 를 사용하지 않는 대신 URL에 쿼리 파라미터를 포함하여 데이터를 전달 하는것이 일반적
- 예시: `GET /users?id=123 HTTP/1.1`

GET 메서드는 주로 데이터를 조회할 때 사용되며, 서버에 데이터를 요청하는 가장 일반적인 방법

Body 없이 요청을 보내는것이 표준에 정의되어 있음

> A payload within a GET request message has no defined semantics; sending a payload body on a GET request might cause some existing implementations to reject the request.
>
> [https://www.rfc-editor.org/rfc/rfc7231#section-4.3.1](https://www.rfc-editor.org/rfc/rfc7231#section-4.3.1)

## POST
- Sign in, Sign up, 데이터 생성, 결제 등 Client 가 Server 에게 데이터를 전송할 때 사용됨
- 데이터는 Body에 포함되어 전송됨

가장 범용적으로 사용되는 Http 메서드로, GET, PUT, DELETE 등 다양한 작업을 하는데 문제 없이 사용할 수 있음

하지만 Http 표준에선 POST 는 데이터를 생성하기 위한 메서드로 정의되어 있음

> POST serves many useful purposes in HTTP, including the general purpose of “this action isn't worth standardizing.”

만약 게시글 만들기 기능을 구현한다고 가정해보자, 이때 사용자가 입력한 데이터를 서버에 전송하기 위해 POST 메서드를 사용함

이때 요청 메시지는 다음과 같은 형태가 될 것임

```http
POST /users HTTP/1.1
Content-Type: application/json

{
    "id": 123,
    "title": "Hello World",
    "content": "This is my first post!"
}
```

만약 서버에서 처리가 정상적으로 완료가 된다면 Server 는 Client 에게 해당 포스팅이 생성된 위치와 201 Created 상태 코드를 반환할 것임

Location 이나 Body 에 데이터를 포함할것은 선택사항, 지금은 예시를 위해 포함함

```http
HTTP/1.1 201 Created
Location: /users/123
Content-Type: application/json

{
    "id": 123,
    "title": "Hello World",
    "content": "This is my first post!"
}
```

## HEAD
- GET과 유사하지만, 응답 Body 을 포함하지 않음
- 주로 응답 헤더만 확인하고 싶을 때 사용됨

## PUT
- 서버에 있는 리소스를 업데이트할 때 사용됨
- POST 처럼 Body 에 데이터를 포함하여 전송하는것이 일반적
- PUT 메서드는 주로 리소스의 전체를 업데이트할 때 사용됨

## PATCH
- PUT과 유사하지만, 리소스의 일부를 업데이트할 때 사용됨
- 예를 들어, 게시글의 제목만 변경하고 싶을 때 사용

## DELETE
- 서버에 있는 리소스를 삭제할 때 사용됨