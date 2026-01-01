---
title: "JavaScript 이벤트 루프"
description: "싱글 스레드 언어인 JavaScript가 비동기 I/O를 처리하는 방식과 V8, libuv, 이벤트 루프의 동작 원리를 알아봅니다."
date: "2026-01-01"
keywords: "JavaScript"
---

## Single Threaded
많은 사람들이 JS가 싱글 스레드라고 강조하지만, **실제로 동작하는 런타임 환경인 브라우저나 Node.js** 를 보면 이야기가 조금 다른데, 실제로 비동기 I/O나 타이머 같은 특정 작업에 한해서는 시스템 커널이나 별도의 스레드 풀을 사용하는 멀티 스레드 방식으로 동작한다.

이렇게 JS 에서 처리하지 못하는 작업들을 외부에 위임하는 방식을 통해, JS 는 싱글 스레드 이면서 Non Blocking I/O 를 구현할 수 있다.

Node.js 가 이러한 방식을 구현하기 위해 사용하는 주요 구성 요소는 다음 3가지다.
1. V8
2. 이벤트 루프
3. libuv (c++ 로 작성된 비동기 I/O 라이브러리)

> libuv 나 브라우저 가 상황에 따라 별도의 스레드를 생성하여 작업을 처리할 수 있지만, V8 엔진을 포함한 3가지 요소가 상호작용하는 방식은 메인스레드 하나에서 이루어진다.

> 최신 JS 는 Web Worker 나 Worker Threads 같은 외부에 위임하지 않고도 멀티 스레드를 활용할 수 있는 방법을 제공하지만, 여기서는 다루지 않는다.

> 브라우저 환경에선 libuv 의 역할을 브라우저가 수행한다.

## V8 Engine
V8 엔진은 구글에서 설계한 오픈소스 자바스크립트 엔진이다. Node.js나 브라우저에 탑재되어 `*.js` 로 작성된 스크립트를 실행하는 핵심적인 역할을 담당한다.

> Node.js는 V8을 포함하여 libuv 등 여러 구성 요소로 이루어진 런타임 환경이다. (브라우저 역시 V8과 렌더링 엔진 등이 결합된 환경)

이때 V8 이 실행하는 JS 는 싱글스레드로 동작한다. (V8 자체는 GC, 컴파일 최적화 같은 작업을 위해 내부적으로 멀티스레드를 사용할 수 있다.)

V8 엔진이 어떤 순서로 코드를 실행하는지 보단, V8 이 실행을 위해 어떤 장치들을 포함하고 있는지를 간단하게 살펴보자.

![V8 Architecture](/img/js/v8-architecture.webp)

1. **Call Stack:** 함수 호출을 관리하는 자료구조
2. **Heap Memory:** 객체, 배열 등 참조 타입 데이터가 저장되는 공간
3. **Ignition & TurboFan:** 인터프리터와 JIT 컴파일러의 조합으로 빠른 실행 속도 구현
4. **Garbage Collector:** 더 이상 참조되지 않는 메모리를 자동으로 해제

여기서 콜스택(Call Stack) 은 함수 호출을 관리하는 자료구조로, 함수가 호출될 때마다 해당 함수의 실행 컨텍스트가 콜스택에 쌓이고, 함수가 종료되면 콜스택에서 제거되는 방식으로 동작한다. 실제론 실행 컨텍스트 라고 부르지만, 이해를 돕기 위해 함수라고 표현하겠다.

다음 코드를 보고 콜스택이 어떻게 동작하는지 살펴보자.

```ts
function first() {
  console.log('First');
}

function second() {
  first();
  console.log('Second');
}

function third() {
  second();
  console.log('Third');
}

third();
```

해당 코드는 순서대로 `First`, `Second`, `Third` 를 출력한다. 콜스택 관점에선 다음과 같이 동작한다.

1. `third()`
2. `third()`, `second()`
3. `third()`, `second()`, `first()`
4. `third()`, `second()` (first 실행)
5. `third()` (second 실행)
6. (third 실행)

## Node.js API / Browser API
V8 엔진은 JS 를 효율적으로 빠르게 실행하긴 하지만, 파일 읽기/쓰기, **네트워크 요청 같은 I/O 작업을 직접 처리하지는 못한다.** 애초에 `fetch` 나 `readFile` 같은 함수들은 V8 엔진이 제공하는 함수가 아니다.

이러한 함수들은 Node.js API 나 Browser API 가 제공하는 함수들로, V8 엔진이 아닌 별도의 환경에서 동작한다. 이게 바로 JS 가 싱글 스레드이면서도 비동기 I/O 를 처리할 수 있는 이유다.

그림으로 보면 이해가 편하다.

![Node.js and Browser APIs](/img/js/nodejs-browser-apis.webp)

브라우저 환경에선 Web API 라고 부르기도 한다. 각 환경에서 제공하는 API 들은 같은것도 있고, 다른 것도 있다.
* 브라우저: `DOM`, `fetch`, `Canvas` 등
* Node.js: `fs`, `path`, `os` 등

## libuv
`fetch`, `setTimeout`, `fs.readFile` 같은 비동기 I/O 작업들은 V8 엔진이 아닌 별도의 환경에서 동작한다고 했다. 그렇다면 이 작업들은 어떻게 처리되고, 다시 V8 엔진으로 돌아오는 걸까?

이걸 담당하는 것이 바로 libuv 라는 **C++ 로 작성된 비동기 I/O 라이브러리**다. libuv 는 본래 Node.js를 지원하기 위해 작성된 크로스 플랫폼 라이브러리로서, 윈도우(Windows), 리눅스(Linux), 맥(macOS) 등 서로 다른 운영체제 환경에서도 동일한 비동기 동작을 보장하기 위해 만들어졌다.

최종적으로 완성된 V8 엔진, Node.js API, libuv 가 상호작용하는 방식을 그림으로 살펴보자.

![libuv architecture](/img/js/libuv-architecture.webp)

image source: [@RichOnTheWeb](https://x.com/RichOnTheWeb/status/494959181871316992)

`fetch`, `setTimeout`, `fs.readFile` 같은 비동기 I/O 작업이 호출될때 실제 동작하는 순서는 다음과 같다.
1. V8 엔진이 비동기 I/O 작업을 Node.js API (또는 Browser API) 를 통해 libuv 에 위임
2. libuv 가 해당 작업을 처리 (필요시 별도의 스레드 생성)
3. 작업이 완료되면 **콜백 함수를 이벤트 큐에 등록**
4. 이벤트 루프가 콜스택이 비어있는지 확인 후, **콜백 함수를 콜스택으로 이동**

> libuv 는 커널에 작업을 위임 할 수도 있고, 자체적으로 스레드 풀을 사용하여 작업을 처리할 수도 있다.

> 이 거대한 시스템은 하나의 메인 스레드에서 동작한다. 이벤트루프를 위한 스레드 같은건 없다.

> 위 그림에선 하나의 EVENT QUEUE 만 그려져 있지만, 실제론 여러개의 큐가 존재한다.

## Event Loop
이벤트 루프는 별도의 스레드에서 동작하는게 아니라 메인스레드에서 돌아가는 하나의 거대한 `while` 루프라고 생각하면 된다.

그리고 이러한 이벤트 루프는 여러 단게(Phase) 로 나뉘어져 있고 각 단계는 별도의 큐를 감시한다. 아래 의사 코드는 이벤트 루프가 어떤 순서로 콜백을 처리하는지 보여준다.

```
while (처리해야할 비동기 작업이 남아있나?) {
  1. [Timer Phase] `setTimeout()`, `setInterval()` 콜백
  2. [Pending i/o callback phase] TCP 에러 같은 특수한 상황에서 지연된 콜백 처리
  3. [Idle, Prepare phase] Node.js 점검 - 무시해도 상관 없음
  4. [Poll Phase] Network, File I/O 등 거의 모든 비동기 작업의 콜백
  5. [Check Phase] `setImmediate` 콜백
  6. [Close Phase] socket.on('close', ...), stream.on('close', ...) 등 사용이 끝난 소켓이나 파일을 닫을 때 실행되는 콜백
}
```

위 순서를 이해하면 아래의 코드의 출력 순서를 예측할 수 있다.

```ts
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => console.log(3), 0);
  setImmediate(() => console.log(2));
});

setImmediate(() => console.log(1));
```
1. 스크립트 실행: `readFile`은 libuv에 위임되고, `setImmediate(1)`은 Check 페이즈 큐에 등록
2. 첫번째 출력 (1): 파일 I/O 는 CPU 연산보다 느리기에, 파일이 읽히는 동안 Check Phase 에서 `() => console.log(1)` 실행
3. I/O 작업 완료: Poll Phase 에서 `readFile` 콜백이 실행되고, Timer Phase 와 Check Phase 에 각각 콜백 등록
4. 두번째 출력 (2): Poll Phase 가 끝나고 바로 다음 Check Phase 에서 `() => console.log(2)` 실행
5. 세 번째 출력 (3): 루프가 다시 Timer Phase 로 돌아가 `() => console.log(3)` 실행

결론적으로 출력 순서는 `1`, `2`, `3` 이 99% 확률로 보장된다.


> 가장 중요한 핵심은 콜스택이 비어있을 때 큐에서 콜백을 꺼내 콜스택에 넣는다는 점이다.

> 더 자세한 내용은 [Node.js Event Loop 공식 문서](https://nodejs.org/ko/learn/asynchronous-work/event-loop-timers-and-nexttick) 를 참고하자.
