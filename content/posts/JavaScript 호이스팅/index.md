---
title: "JavaScript 호이스팅"
description: "var, let, const 키워드로 선언된 변수와 함수 선언문이 호이스팅 되는 방식을 알아봅시다."
date: "2025-12-30"
keywords: "JavaScript"
---


# 호이스팅 (Hoisting)

JavaScript 엔진은 코드를 실행하기 위한 하나의 작업단위인 **실행 컨텍스트 (Execution Context)** 라는 것을 생성한다. 실행 컨텍스트는 크게 두 단계로 나눌 수 있다.

1. Creation Phase (생성 단계): 변수, 함수 선언문 등이 메모리에 할당되는 단계
2. Execution Phase (실행 단계): 실제 코드가 실행되는 단계

여기서 실제 **코드가 실행되기 전에 변수와 함수 선언문이 메모리에 할당되는 현상을 호이스팅** 이라고 부른다.

다음 예제를 통해 호이스팅이 어떻게 동작하는지 살펴보자.

```ts
console.log(a);   // undefined
var a = 10;

console.log(b);   // ReferenceError: Cannot access 'b' before initialization
let b = 20;

console.log(c);   // ReferenceError: Cannot access 'c' before initialization
const c = 30;

console.log(d);   // ReferenceError: d is not defined

console.log(foo);   // [Function: foo]
foo()               // "Hello, world!"
function foo() {
  console.log("Hello, world!");
}

console.log(foo2);  // ReferenceError: Cannot access 'foo2' before initialization
foo2();             // ReferenceError: Cannot access 'foo2' before initialization
const foo2 = () => {
  console.log("Hello, arrow function!");
}

const car = new Car('red'); // ReferenceError: Cannot access 'Car' before initialization
class Car {
  constructor(color) {
    this.color = color;
  }
}
```

1. `var` 키워드로 선언된 변수는 호이스팅 되면서 `undefined` 로 초기화 된다.
2. `let`, `const` 키워드로 선언된 변수는 호이스팅 되지만, **초기화 되지 않아** 접근 시 `ReferenceError: Cannot access` 가 발생한다.
3. `d` 는 선언되지 않았기 때문에 접근 시 `not defined` 에러 가 발생한다.
4. `function` 은 호이스팅 되어 **선언과 정의가 모두 메모리에 할당**된다. 따라서 함수 선언문은 **선언 이전에 호출해도 정상적으로 동작**한다.
5. Arrow Function 은 변수에 할당되는 형태이므로, `let` 또는 `const` 처럼 호이스팅 되지만 초기화 되지 않아 접근 시 `ReferenceError: Cannot access` 가 발생한다.
6. `class` 는 호이스팅 되지만, `let` 과 `const` 처럼 초기화 되지 않아 접근 시 `ReferenceError: Cannot access` 가 발생한다.

> 호이스팅은 변수와 함수 선언문이 코드의 최상단으로 끌어올려지는 것처럼 동작한다는 의미에서 붙여진 이름이다. 하지만 실제로 코드를 끌어올리는 것이 아니라, 자바스크립트 엔진이 실행 컨텍스트를 생성하는 과정에서 변수와 함수 선언을 메모리에 미리 등록해두기 때문에 발생하는 현상을 말한다.

> **면접을 위한 정리글:** let, const, class, function, var 모두 호이스팅 되며, var 와 function 은 선언과 초기화가 동시에 이루어지고, let, const, class 는 선언만 이루어진다. 따라서 var 와 function 은 선언 이전에 접근해도 정상 동작하지만, let, const, class 는 초기화 되지 않은 상태이므로 접근 시 ReferenceError 가 발생한다.

## TDZ (Temporal Dead Zone)
`let`, `const`, `class` 로 선언된 변수와 클래스는 호이스팅 되지만, 초기화 되지 않은 상태에서 접근하려고 하면 `ReferenceError: Cannot access` 가 발생한다. 이 초기화 되지 않은 상태 or 구간을 **일시적 사각지대 (Temporal Dead Zone, TDZ)** 라고 부른다.


## !TDZ
`var`, `function`, `import` 구문은 호이스팅 되면서, 초기화 까지 완료되므로 TDZ 에서 벗어난다. 따라서 선언 이전에 접근해도 정상적으로 동작한다.

권장되는 방식은 아니지만 아래 코드는 정상적으로 동작한다.

```ts
myFunction();

import { myFunction } from './myModule';
```

## Scope 와 Hoisting
변수와 함수 선언문이 어느 스코프에 속하는지에 따라 호이스팅의 동작 방식이 달라진다.

1. **전역 스코프:** 전역에서 선언된 변수와 함수는 전역 실행 컨텍스트의 최상단으로 호이스팅 된다.
2. **함수 스코프:** `var` 키워드로 선언된 변수와 함수 선언문은 자신을 감싸는 가장 가까운 함수의 최상단으로 호이스팅 된다.
3. **블록 스코프:** `let`, `const`, `class`는 블록(`{ }`)을 기준으로 호이스팅 된다. 즉, 선언된 블록 내부에서만 접근할 수 있다.

```ts
function example() {
  if (true) {
    var x = 10;          // 함수 스코프에 호이스팅
    let y = 20;          // 블록 스코프에 호이스팅
    const z = 30;        // 블록 스코프에 호이스팅
  }
  console.log(x); // 10
  console.log(y); // ReferenceError: y is not defined
  console.log(z); // ReferenceError: z is not defined
}
```

`ReferenceError: Cannot access` 가 아닌 `ReferenceError: is not defined` 가 발생한다. 이를 통해 `let`, `const` 가 블록 스코프에 호이스팅 됨을 알 수 있다.

> 😩 호이스팅은 그저 면접을 위한 지식일뿐.. 그냥 let 과 const 만 쓰자.