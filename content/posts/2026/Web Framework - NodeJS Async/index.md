---
title: "Web Framework - NodeJS Async"
description: "202601 웹프레임워크, Asynchronous Programming"
date: "2026-04-12"
keywords: "Express, JavaScript, KNU"
---

## Asynchronous Programming
`Network I/O`, `File I/O`, `Database I/O` 등과 같이 **시간이 오래 걸리는 작업**을 처리할 때, 프로그램이 멈추지 않고 다른 작업을 계속할 수 있도록 하는 프로그래밍 패러다임

JS 에서는 `Callback`, `Promises`,` async/await` 을 사용하여 비동기 프로그래밍을 구현할 수 있다.

```javascript
function displayA() {
  console.log("A");
}

function displayB() {
  setTimeout(() => {
    console.log("B");
  }, 1000);
}

function displayC() {
  console.log("C");
}

displayA();
displayB();
displayC();
```

## Callback Function
**다른 함수의 매개변수(Parameter) 로 전달되는 함수**로, **비동기 작업이 완료된 후에 호출되어야 하는 함수를 전달**하여, 비동기 흐름을 제어하는데 많이 사용된다.

만약 `displayA()` 함수 뒤에 `displayB()` 함수가 호출되어야 하는 경우, `displayA()` 함수가 완료될 때까지 기다려야 하는데, 이때 **Callback Function** 을 사용하여 `displayA()` 함수가 완료된 후에 `displayB()` 함수를 호출할 수 있다.

```javascript
function displayA(callback) {
  setTimeout(() => {
    console.log("A: Data fetched from server");
    callback();
  }, 1000);
}

function displayB() {
  console.log("B: Data processed and displayed");
}

displayA(displayB);
```

이렇듯 Asynchronous Programming은 Async Function 과 Sync Function이 혼재되어 있는 경우, 프로그램의 흐름을 제어하기 어렵게 만들 수 있다. **Callback Function** 같은 경우 예전에 많이 사용되었지만, 코드가 복잡해지고 가독성이 떨어지는 문제점이 있다. 이를 해결하기 위해 `Promises`와 `async/await`가 도입되었다.

## Promise
`Promise`는 **비동기 작업의 결과를 나타내는 객체**로, **비동기 작업을 이행(fulfilled), 거부(rejected), 대기(pending) 상태로 관리**할 수 있다.

핵심은 `Promise` 는 비동기 작업의 상태와 결과 를 나타내는 객체일 뿐이며, **실제로 비동기 작업을 수행**하는 것은 여전히 `Promise` 에 전달된 **Callback Function** 라는 점

`Promise`는 `then()`, `catch()`, `finally()` 메서드를 사용하여 비동기 작업의 결과를 순서대로 처리할 수 있다.

```javascript
const displayA = new Promise((resolve, reject) => {
  const success = true;
  setTimeout(() => {
    if (success) {
      resolve("A: Data fetched from server");
    }
    else {
      reject("A: Failed to fetch data");
    }
  }, 1000);
});

displayA
  .then((data) => {
    console.log(data);
    console.log("B: Data processed and displayed");
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```
1. `displayA` 이름을 가진 `Promise` 객체가 생성되며 Callback Function 이 실행, 아직 `resolve` 또는 `reject` 되지 않은 **Pending** 상태로 시작한다.
2. 1초가 지난 후 `setTimeout` 함수의 Callback이 `resolve()` 를 실행, `displayA` 는 **Fulfilled** 상태가 된다.
3. `then()` 메서드가 호출되어, `resolve()` 에 전달된 데이터가 `data` 매개변수로 전달, log 가 출력된다
4. 만약 `reject()` 가 호출되었다면, `catch()` 메서드가 실행되어 `Error: A: Failed to fetch data` 가 출력된다.

> **Event Loop 를 포함한 자세한 동작 순서**
> 1. V8 엔진은 `new Promise` 생성자 안의 **Callback Function 을 즉시 동기(Sync) 방식으로 실행**한다.
> 2. 그 과정에서 `setTimeout` 과 같은 비동기 함수가 호출되면, **백그라운드(Web API, Node.js API) 로 위임**하고 **Call stack 에서 제거**된다.
> 3. 지정된 시간이 지나면 `setTimeout` 의 Callback Function 은 **Task Queue(Macrotask Queue) 에 추가**되고, Call stack 이 비어있을 때 Call stack 으로 이동하여 실행된다.
> 4. `resolve()` 가 호출되어 Promise 가 Fulfilled 상태가 되면, **연결된 `then()` 의 Callback Function 이 Microtask Queue 에 들어가게 되며,** Call stack 이 비어질 때 우선적으로 실행된다.

위 예제는 이해를 돕기 위한 예제고, 아래 예제는 실전에서도 매우 자주 사용되는 `Promise` 예제다.

```javascript
const getUser = fetch("https://jsonplaceholder.typicode.com/users/1")
  .then((response) => response.json())
  .then((user) => console.log(user))
  .catch((error) => {
    console.error("Error:", error);
  });
```
1. `fetch()` 함수는 네트워크 요청을 보내고, `Promise` 객체를 반환한다. **Pending** 상태
2. 요청이 정상적으로 완료되면 **Fulfilled** 상태가 되고, 첫 번째 `then()` 메서드가 실행되어 응답을 JSON으로 변환한다.
3. 계속 `then()` 메서드가 체이닝되는 형태로, 사용자 정보를 가져오고, 그 정보를 화면에 보여주거나 다시 다른 API 요청을 보내는 등의 작업을 수행할 수 있다.

> `fetch` 함수는 네트워크 요청을 보내고, `Promise` 객체를 반환하는 함수로, 비동기적으로 데이터를 가져오는 데 사용된다

> `response.json()` 메서드 역시 Promise를 반환하기 때문에, 변환이 완료된 후 다음 `.then()`으로 체이닝이 가능한 것

## async/await

ECMA2017 버전에서 도입된 `async/await`는 `Promise` 기반의 비동기 코드를 더 간결하고 읽기 쉽게 작성할 수 있도록 해준다. `async` 키워드는 함수가 비동기 함수임을 나타내며, **내부에서 무엇을 반환하든 항상 Promise 객체를 반환**하도록 만든다.

* `async`: 함수 앞에 붙이며, 해당 함수는 항상 `Promise` 를 반환
* `await`: `Promise` 가 처리될 때 까지 함수의 실행을 잠시 멈추고 대기

이또한 마찬가지로 `async` 로 선언한다 해서 함수 전체가 비동기로 실행되는게 아니라, `fetch` 같은 비동기 함수를 `await` 으로 기다려 **마치 동기적으로 실행되는 것처럼 보이게 하는것이 핵심**이다.

```javascript
async function getUser() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    const user = await response.json();
    console.log(user);
  }
  catch (error) {
    console.error("Error:", error);
  }
}
getUser();
```

1. `getUser` 함수는 `async` 키워드로 선언되어 비동기 함수가 된다. (`await` 키워드를 사용할 수 있게 된다.)
2. `fetch()` 함수가 호출되고, `await` 키워드로 인해 `fetch()` 가 반환하는 `Promise`가 해결(Fulfilled, Rejected)될 때까지 기다린다. (Rejected 될 경우 `catch` 블록으로 이동)
3. `response.json()` 메서드도 `Promise`를 반환하므로, 다시 `await` 키워드로 기다린다.
4. 이후 사용자 이름을 출력하고, 다시 `fetch()` 함수를 사용하여 사용자의 게시물을 가져오는 작업을 수행한다. 이 과정에서도 `await` 키워드를 사용하여 비동기 작업이 완료될 때까지 기다린다.
5. 모든 비동기 작업이 완료되면 사용자 이름과 게시물이 출력된다. 만약 어떤 단계에서 에러가 발생하면, `catch` 블록이 실행되어 에러 메시지가 출력된다.

> `await`을 만나면, 해당 `async` 함수의 실행이 일시 정지되고 **Call stack 에서 제거**된다. 이후 남은 코드들은 **메모리에 보관**되어 있다가, `Promise`가 **Fulfilled 되면 Microtask Queue를 거쳐 다시 Call stack으로** 올라와 실행이 재개된다.

> `async/await` 은 `Promise` 와 `then` 을 쓰기 편하게 포장해놓은 Syntax Sugar 일 뿐 실제 동작은 `Promise` 와 동일하다.

> `await` 은 비동기 처리를 직렬로 수행하기 때문에, 편리하지만 성능 이슈가 생길 수 있다. 이럴땐 `Promise.all()` 등 을 사용하여 병렬로 처리할 수 있다. (설명 생략)

> 시험삼아 `await response.json();` 에서 `await` 키워드를 제거하고 `user` 를 출력해보면 `Promise { <pending> }` 가 출력된다.

## Blocking I/O
> `Blocking I/O`: I/O 작업이 완료될 때까지 프로그램의 실행이 멈추는 방식. `readFileSync()` 같은 동기 함수가 대표적이다.


아래는 Blocking I/O 의 대표적인 예시로서, `fs.readFileSync()` 함수가 실행되면 전체 프로그램이 멈추고, 파일 읽기가 완료된 후에야 다음 코드가 실행된다.
```javascript
const fs = require('fs');

const data = fs.readFileSync('example.txt');
console.log("File content:", data.toString());
```

## Non-blocking I/O
> `Non-blocking I/O`: I/O 작업이 완료될 때까지 프로그램의 실행이 멈추지 않고, 다른 작업을 계속할 수 있는 방식. `readFile()` 같은 비동기 함수가 대표적이다.

```javascript
const fs = require('fs');

const data = fs.readFile('example.txt', (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  console.log("File content:", data.toString());
});
```

## Event Loop
> JavaScript 런타임에서 **비동기 작업을 처리하기 위한 매커니즘**으로, 콜백 함수들을 스케줄링하여 실행하는 역할을 한다.

[Event Loop](https://tomatom4to.github.io/posts/JavaScript%20Asynchronous%20(1)%20-%20%EC%9D%B4%EB%B2%A4%ED%8A%B8%20%EB%A3%A8%ED%94%84)

Node.js 는 V8 엔진과 libuv 를 포함한 JavaScript 런타임이란게 무슨 뜻인지 알 수 있다.
* V8: Google 에서 개발한 오픈소스 JavaScript 엔진
* libuv: Node.js 의 이벤트 기본 Non-blocking I/O 모델을 구현한 라이브러리, cpp 로 작성되어 있다.

## Promise Pattern
`readFile` 이나 `readdir` 같은 오래된 Node.js API 들은 콜백 패턴을 사용하기에 불편한 경우가 많다, 해당 함수들을 `Promise` 패턴으로 변환하는 방법이 있다.

```javascript
const fs = require('fs').promises;

fs.readdir('./')
  .then((data) => {
    console.log("Directory content:", data);
  })
  .catch((err) => {
    console.error("Error reading directory:", err);
  });
```

`Promise` 패턴으로 변환된 API 들은 `async/await` 와도 쉽게 호환되어, 비동기 코드를 더 간결하게 작성할 수 있다.

```javascript
const fs = require('fs').promises;

async function readDirAsync() {
  try {
    const data = await fs.readdir('./');
    console.log("Directory content:", data);
  }
  catch (err) {
    console.error("Error reading directory:", err);
  }
}
readDirAsync();
```

> `promise` 가 아닌 `promises` 오타 주의

> 만약 `await` keyword 를 제거하면, Console 에 `Directory content: Promise { <pending> }` 가 출력된다. `await` 키워드는 `Promise`가 해결될 때까지 기다리는 역할을 한다는 점을 다시 한번 강조