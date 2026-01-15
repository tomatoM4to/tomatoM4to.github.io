---
title: "JavaScript Prototypes"
description: "JavaScript 가 상속을 구현하는 방법인 프로토타입에 대해 알아봅니다."
date: "2026-01-15"
keywords: ""
---

## Object & Instance

## Prototype-based programming

프로토타입 기반 언어는, 객체지향 언어의 한 종류로서, **모든 객체가 상속을 위한 템플릿으로써 프로토타입 객체(prototype object)를 가진다는 의미**다.

자바스크립트에서 실제로 확인 해보자.

```ts
const parent = {};
console.log(Object.prototype);  // [Object: null prototype] {}
console.log(parent.__proto__);  // [Object: null prototype] {}
console.log(parent.__proto__ === Object.prototype);  // true

console.log(Object.__proto__);  // null
```

`parent` 객체에 `__proto__` 속성을 정의하지 않았는데도 자동적으로 생성되었다.

`__proto__` 속성은 해당 객체의 프로토타입 객체, 즉 상속을 위한 템플릿 객체를 가리킨다. 익숙한 표현으론 부모 객체를 가리킨다 고도 할 수 있다.

> `Object`

## Prototype Chain