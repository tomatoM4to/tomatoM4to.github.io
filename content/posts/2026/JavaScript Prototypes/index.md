---
title: "JavaScript Prototypes"
description: "JavaScript 가 상속을 구현하는 방법인 프로토타입에 대해 알아봅니다."
date: "2026-01-15"
keywords: "JavaScript"
---

## Object & Instance

## Prototype-based programming

프로토타입 기반 언어는, 객체지향 언어의 한 종류로서, **모든 객체가 상속을 위한 템플릿으로써 프로토타입 객체(prototype object)를 가진다는 의미**다.

자바스크립트에서 실제로 확인 해보자.

```ts
function Person(name) {
    this.name = name;
}

const alice = new Person('Alice');

console.log(alice);                                 // Person { name: 'Alice' }
console.log(alice.__proto__);                       // Person {}
console.log(Person.prototype);                      // Person {}
console.log(alice.__proto__ === Person.prototype);  // true
```


## Prototype Chain

## Prototype Methods

Prototype 이 유용하게 쓰이는 이유 중 하나는, **객체가 공통적으로 사용하는 메서드(method)를 프로토타입 객체에 정의하여 메모리를 절약할 수 있기 때문**이다.

```ts
function Person(name) {
    this.name = name;
}

// 프로토타입(창고)에 딱 하나만 만듦
Person.prototype.sayHello = function() {
    console.log(`안녕, 나는 ${this.name}야.`);
};
const alice = new Person('Alice');
const bob = new Person('Bob');
console.log(alice.sayHello === bob.sayHello);  // true
```