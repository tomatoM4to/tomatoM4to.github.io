---
title: "JavaScript Asynchronous (2) - Promise"
description: "콜백 지옥을 해결하기 위해 등장한 Promise의 동작 원리와 상태 관리, 그리고 Microtask Queue와 Macrotask Queue의 차이점에 대해 깊이 있게 알아봅니다."
date: "2026-01-02"
keywords: "JavaScript"
---

## Microtask Queue 와 Macrotask Queue

[이벤트 루프](https://tomatom4to.github.io/posts/JavaScript%20%EC%9D%B4%EB%B2%A4%ED%8A%B8%20%EB%A3%A8%ED%94%84) 에서 이어지는 내용이다.

JS 는 V8 엔진 위에서 동작하는 싱글스레드 언어이면서, **비동기 I/O 작업을 위해 libuv 라는 C++ 로 만들어진 외부 라이브러리를 사용한다.** 그리고 이때 libuv 내부엔 이벤트 루프가 돌고 있고, 이 이벤트 루프는 Event Queue 를 관리한다. 이때 **Event Queue 는 Macrotask Queue 라고도 불린다.**

이러한 큐를 기반으로한 구조는 사실 V8 엔진 내부에도 하나 있다, Microtask Queue 라고 불리며, I/O 작업보단 **비동기 함수들의 가독성 및 실행 순서 제어에 목적**을 둔다.

표로 확인해 보자

| 관리 주체 | 큐 이름        | 포함되는 작업 종류                   | 우선순위 |
|-------|-----------------|-----------------------------------|---------|
| V8 엔진 | Microtask Queue | `Promise`, `process.nextTick` 등 | 1순위  |
| libuv | Macrotask Queue | `setTimeout`, `setInterval` 등    | 2순위  |


> Call Stack 이 비어있을 때, Microtask Queue 에 작업이 있다면 해당 작업들을 모두 처리한 후에야 Macrotask Queue 에서 콜백을 꺼내 처리한다.

## Promise 의 등장

엄밀히 말해 Promise 가 비동기 I/O 작업을 직접 처리하는건 아니다. Promise 가 등장한 이유는 기존 콜백 기반의 비동기 작업이 너무 복잡해지고 가독성이 떨어지는 문제를 해결하기 위함이었다.

아래 코드를 보고 Promise 가 어떻게 가독성 향상에 도움을 주는지 확인해보자.

```ts
// [1. 콜백 지옥]
setTimeout(() => {
  console.log(`Call back Timeout: 1`);
  setTimeout(() => {
    console.log(`Call back Timeout: 2`);
    setTimeout(() => {
      console.log(`Call back Timeout: 3`);
    }, 1000);
  }, 1000);
}, 1000);

// [2. Promise 체이닝]
const delay = () => new Promise(resolve => setTimeout(resolve, 1000));

delay()
  .then(() => {
    console.log(`Promise Timeout: 1`);
    return delay();
  })
  .then(() => {
    console.log(`Promise Timeout: 2`);
    return delay();
  })
  .then(() => {
    console.log(`Promise Timeout: 3`);
  });
```

Promise 는 인자로 `(resolve, reject) => {...}` 형태의 콜백 함수를 받는다. 이 콜백 함수 내부에 비동기 작업을 수행하는 코드를 작성하고, 작업이 성공했을 때는 `resolve` 를 호출하고, 실패했을 때는 `reject` 를 호출한다.

그리고 `then` 메서드를 사용해 `resolve` 가 호출되었을 때 실행할 콜백 함수를 등록할 수 있다. 이로 인해 비동기 작업이 연속적으로 이어질 때, 콜백 함수들이 중첩되는 현상을 피할 수 있어 코드의 가독성이 크게 향상된다. 반대로 `catch` 메서드를 사용해 `reject` 가 호출되었을 때 실행할 콜백 함수를 등록할 수도 있다.

> Promise 라고 이름이 지어진 이유는, 비동기 I/O 작업 은 결국 시간이 걸릴테니까.. 지금 당장은 언젠간 완료될거라는 **약속** 을 해준다는 의미에서 붙여진 이름이다. 그리고 진짜 약속처럼 약속이 지켜졌을 때(`resolve`), 혹은 지켜지지 않았을 때(`reject`) 에 대한 처리를 미리 정의해둘 수 있다.

## Promise 의 동작 방식

Promise 의 동작 방식을 이해할때 중요한 점은, **Promise 가 비동기 작업을 하는게 아니라 Promise 내부에 있는 함수가 비동기 일때 비동기 작업이 된다는 점**이다. 그런 의미에서 아래 코드는 순서대로 `스크립트 시작!`, `Promise 시작!`, `스크립트 끝!` 이 출력된다.

```ts
console.log('스크립트 시작!');
const myPromise = new Promise(() => {
  console.log('Promise 시작!');
});
console.log('스크립트 끝!');
```

V8 엔진은 Promise 를 만나면 우선 해당 Promise 객체를 생성하고, 내부의 콜백 함수를 **동기적으로 즉시 실행한다.**

그렇다면 좀더 복잡한 예제를 통해 Promise 의 동작 방식을 살펴보자.

```ts
const delay = () => new Promise(resolve => setTimeout(resolve, 1000));

delay()
  .then(() => {
    console.log(`Promise Timeout: 1`);
    return delay(); // 새로운 Promise 생성, 1초 후 resolve 호출
  })
  .then(() => {
    console.log(`Promise Timeout: 2`);
    return delay(); // 새로운 Promise 생성, 1초 후 resolve 호출
  })
  .then(() => {
    console.log(`Promise Timeout: 3`);
  });
```
1. `new Promise` 가 호출되면 **내부 콜백이 즉시 실행**되고, `setTimeout` 이 호출되어 libuv or 브라우저 에 작업 위임
2. 1초 후 `setTimeout` 콜백이 Macrotask Queue 에 등록
3. Call Stack 이 비어있을 때 Macrotask Queue 에서 콜백 꺼내 실행
4. `resolve` 가 호출되어 해당 Promise 가 이행(fulfilled) 상태가 됨
5. 이행된 Promise 의 `then` 콜백이 Microtask Queue 에 등록
6. Call Stack 이 비어있을 때 Microtask Queue 에서 `then` 콜백 꺼내 실행
7. 2~6 반복

위 설명에서 중요한 점은 Microtask Queue 에 등록되는 콜백은 Promise 에 전달한 콜백이 아닌 `resolve` 혹은 `reject` 가 호출된 이후에 실행되는 `then` 혹은 `catch` 콜백들이다. 이렇게 하면 결과적으로 `setTimeout` 라는 비동기 함수를 순차적으로 실행할 수 있게 된다.

## Promise 의 상태 관리

Promise 는 생성될 때부터 완료될 때까지 세 가지 상태(state)를 가진다.
1. 대기(pending): 초기 상태, 아직 이행(resolve)도 거부(reject)도 되지 않은 상태
2. 이행(fulfilled): 작업이 성공적으로 완료되어 `resolve` 가 호출된 상태
3. 거부(rejected): 작업이 실패하여 `reject` 가 호출된 상태

아래 코드를 통해 Promise 의 상태 변화를 추적해 보자.

```ts
// 1. 프로미스 생성
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("완료!");
  }, 1000);
});

// 2. 생성 직후 (아직 resolve 호출 전) -> Pending 상태 확인 가능
console.log(myPromise);

// 3. then 내부 (resolve 호출 후) -> Fulfilled 상태 확인 가능
myPromise
  .then(result => {
    console.log(myPromise);
  });
```

### resolve 와 fulfilled

Promise 에선 resolve 라는 단어가 많이 등장한다. 보통 해당 이름으로 지어진 함수를 Promise 내부에서 실행하면 Promise 의 상태가 pending 에서 fulfilled 로 변경된다. 그래서 `resolve` 를 단순히 Promise 를 fullfilled 상태로 만드는 함수라고 이해하는 경우가 많다.

하지만 엄밀히 말하면 `resolve` 함수는 **Promise 에 값을 고정(Lock-in)시키는 역할**을 하는걸로 이해하는게 좀더 정확하다. 이 과정에서 Promise 의 상태가 pending 에서 fulfilled 로 변경되는 것이다.

좀더 쉽게 말해 `resolve(new Promise(...))` 처럼 `resolve` 에 또다른 Promise 를 전달하면, **최종적으로 전달된 Promise 의 상태에 따라 원래 Promise 의 상태가 결정** 된다.

아래 코드는 분명 `resolve` 가 호출되었음에도 불구하고, 최종적으로 `catch` 블록이 실행되는 예제이다.

```ts
const myPromise = new Promise((resolve, reject) => {
  // 1. 분명히 resolve(해결) 함수를 호출
  // 하지만 내용물이 Rejected 상태인 Promise
  resolve(Promise.reject(new Error("폭탄")));
});

myPromise
  .then(() => console.log("성공?"))
  .catch(err => console.log("결과:", err.message));
```
1. `myPromise` 가 생성되고 내부 콜백이 즉시 실행됨
2. `resolve` 가 호출되고 콜백 인자로 `Promise.reject(new Error("폭탄"))` 가 전달됨
3. `myPromise` 의 상태는 **전달된 Promise 의 상태를 따르게 됨**
4. 전달된 Promise 는 거부(rejected) 상태이므로, `myPromise` 도 거부(rejected) 상태가 됨
5. 따라서 `then` 블록은 건너뛰고 `catch` 블록이 실행됨

> `resolve(new Promise(...))` 형태가 어색할순 있지만 이후 예기할 `async/await` 에서 굉장히 자주 등장하는 패턴이니 한번은 이해하고 넘어가자.

### reject
`reject` 는 좀더 단순하게 동작하는데, Promise 는 `reject` 를 호출시, 인자로 어떤 값을 넣던지간에 무조건 거부(rejected) 상태가 된다.

아래 코드는 `reject` 에 **fulfilled 상태의 Promise** 를 전달하는 예제이다.

```ts
new Promise((_, reject) => reject(Promise.resolve("성공!")))
  .catch(err => console.log(err));
```
fulfilled 상태의 Promise 가 `reject` 에 전달되었음에도 불구하고, 최종적으로 `catch` 블록이 실행되고, 에러의 원인이 **fulfilled 상태의 Promise** 객체가 되어 버리는 이상한 상황이 발생한다.

이러한 동작 특성과 디버깅 편의성을 위해, `reject` 의 인자로는 반드시 `new Error()` 객체를 전달하는 것이 좋다.
```ts
new Promise((_, reject) => reject(new Error("실패!")))
  .catch(err => console.log(err.message));
```

> `resolve` 는 문자열, 숫자, 객체 등 어떤 값이든 상관 없지만, **스택 트레이스(Stack Trace)**가 남지 않아 에러가 발생한 위치를 찾기 어렵기 때문에, 반드시 `new Error()` 를 전달하는 습관을 들이자.


## 자주 사용되는 Promise 패턴

`new Promise` 형태로 Promise 를 생성할땐 거의 99% 가 구형 비동기 함수를 Promise 기반으로 바꾸기 위해서다.

아래 코드는 `setTimeout` 과 `readFile` 함수를 Promise 기반으로 바꾸는 예제이다. 이 두 함수는 Promise 가 생기기 전부터 존재했던 구형 비동기 함수들이다.
```ts
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

delay(1000).then(() => console.log("1초 후 실행"));
```
```ts
import fs from 'fs';

function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    // 전통적인 (err, data) 콜백 패턴 처리
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    });
  });
}

readFilePromise('./readme.txt')
  .then(data => console.log(data))
  .catch(err => console.error("파일 읽기 실패:", err));
```

> `new Promise` 형태로 복잡한 로직을 작성하는 경우는 거의 없다, 모던 자바스크립트 환경에선 `async/await` 문법과 `Promise.all`, `Promise.race` 같은 유틸리티 메서드를 주로 사용한다. 이 부분은 이후 글에서 다룰 예정이다.