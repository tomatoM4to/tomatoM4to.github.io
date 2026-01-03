---
title: "JavaScript Asynchronous (3) - async&await"
description: ""
date: "2026-01-03"
keywords: "JavaScript"
---

## async/await
기존 Promise 의 동작으로 콜백 기반의 비동기 작업의 가독성을 어느정도 해결할 수 있었지만, 여전히 `then` 체이닝이 길어지면 가독성이 떨어지는 문제는 남아있었다. 이를 해결하기 위해 ES2017(ES8) 에서 `async` 와 `await` 키워드가 도입되었다.

`async` 키워드로 선언된 함수는 다음과 같은 특징을 가진다.
1. 항상 Promise 를 반환한다, 함수 내부에서 명시적으로 Promise 를 반환하지 않더라도, 반환값은 자동으로 `Promise.resolve()` 로 감싸진다.
2. 함수 내부에서 `await` 키워드를 사용할 수 있다, `await` 키워드는 `async` 함수 내에서만 사용 가능하다.
3. `await` 키워드는 Promise 가 이행될 때까지 **함수의 실행을 일시 중지**한다. 이때 중요한 점은 메인 스레드를 차단(Block)하는 것이 아니라, **해당 함수의 실행 컨텍스트만 스택에서 내려가고 다른 작업을 처리할 수 있게 한다는 점**이다.
4. 이후 Promise 가 이행되면, 다시 함수의 실행 컨텍스트가 스택에 올라오면서 **함수의 실행이 재개**된다. 이때 `await` 표현식은 이행된 Promise 의 결과값으로 평가된다.
5. Promise 가 거부(rejected)될 경우, `try/catch` 블록을 통해 에러를 처리할 수 있다.

아래 코드를 보자, 두 함수는 이론적으로 같은 함수다.
```ts
async function foo() {
  return "완료!";
}

function bar() {
  return Promise.resolve("완료!");
}
```

`async/await` 키워드는 결국 Promise 의 가독성을 향상시키기 위해 도입되었기에, 어떻게 동작하는지 파악하는게 중요하다. 설명보단 예제가 빠르니, 바로 코드로 넘어가겠다.

```ts
function delay() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}

// then 체이닝 방식
delay()
  .then(() => {
    console.log("1초 후 실행");
    return delay();
  })
  .then(() => {
    console.log("또 1초 후 실행");
  });

// async/await 방식
async function runDelays() {
  await delay();
  console.log("1초 후 실행");
  await delay();
  console.log("또 1초 후 실행");
}
```
`runDelays()` 함수의 동작 방식만 살펴보자.
1. `runDelays` 함수가 호출되면, 내부에서 첫 번째 `await delay()` 가 실행된다.
2. `delay` 함수가 반환한 Promise 가 이행(fulfilled) 될 때까지 **함수의 실행이 일시 중지**된다.
3. 1초 후, `delay` 함수의 Promise 가 이행되면, **함수의 실행이 재개**되고, `1초 후 실행` 이 출력된다.
4. 동일한 방식으로 두 번째 `await delay()` 도 처리된다.




이번엔 좀더 자주 사용되는 패턴으로 `async/await` 의 동작 방식을 살펴보자.

```ts
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("에러 발생:", error);
  }
}
```
1. `fetchData` 함수가 호출되면, 내부에서 `fetch` 함수가 호출되고, 이 함수는 Promise 를 반환한다.
2. `await` 키워드는 `fetch` 함수가 반환한 Promise 가 이행(fulfilled) 될 때까지 **함수의 실행을 일시 중지**한다.
3. Promise 가 이행되면, `response` 변수에 이행된 값이 할당되고, **함수의 실행이 재개**된다.
4. 동일한 방식으로 `response.json()` 도 Promise 를 반환하고, `await` 키워드로 이행될 때까지 대기한다.
5. 만약 `fetch` 나 `response.json()` 중 하나라도 거부(rejected) 된다면, 제어 흐름은 `catch` 블록으로 이동하여 에러가 처리된다.
6. `fetchData` 함수는 최종적으로 Promise 를 반환하며, 호출자는 이 Promise 를 통해 함수의 완료 여부를 알 수 있다.

Promise 의 `reject` 로 인한 에러 처리도 `try/catch` 블록으로 간단히 처리할 수 있어, 비동키 코드를 더욱 직관적으로 작성할 수 있다.

> 가장 중요한 점은 `await` 키워드가 Promise 가 이행(fulfilled) 될 때까지 함수의 실행을 일시 중지시키고 재개시킨다는 점이다. 이로 인해 비동기 작업이 마치 동기 작업처럼 보이게 되어, 코드의 가독성이 크게 향상된다.

> 일시 중지라는 의미는 Call Stack 에서 해당 함수의 실행 컨텍스트가 내려가고, 이벤트 루프가 다른 작업을 처리할 수 있게 된다는 의미다. 이후 Promise 가 이행되면, 다시 Call Stack 에 해당 함수의 실행 컨텍스트가 올라오면서 함수의 실행이 재개된다.

> `async/await` 로 인한 함수의 중지와 재개는 이벤트 루프나 큐와는 관련이 없다. 이는 V8 인젠의 실행 컨텍스트(Execution Context) 관리 영역에서 일어나는 일이다. 큐는 그 후 Promise가 해결(Settled)되었을 때, 멈췄던 함수를 다시 실행하기 위한 스케줄링 용도로만 사용된다.

> `await` 키워드로 인해 함수가 일시 중지되고 다시 재개되는 방식이 어색할 수 있는데, 이러한 동작은 `async/await` 보다 먼저 도입된 Generator 로 쉽게 구현할 수 있다.

### await 과 generator
아래 코드는 fetchData 가 Babel 로 트랜스파일링(transpiling) 되었을 때의 예제다. `async/await` 이 어떻게 동작하는지 이해하는데 도움이 될 것이다.

```ts
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("에러 발생:", error);
  }
}

function _fetchData() {
  _fetchData = _asyncToGenerator(function* () {
    try {
      const response = yield fetch("https://api.example.com/data");
      const data = yield response.json();
      console.log(data);
    } catch (error) {
      console.error("에러 발생:", error);
    }
  });
  return _fetchData.apply(this, arguments);
}
```

복잡해 보이지만 **구조의 변화**에 주목해서 보자.

핵심은 `async function`이 `function*`(Generator)으로 바뀌고, `await` 키워드가 `yield`로 변환되었다는 점이다. 이를 통해 `await`를 만났을 때 함수가 **실제로는 `yield`를 통해 실행을 멈추고 제어권을 밖으로 넘긴다**는 것을 시각적으로 확인할 수 있다.

또한, 제너레이터는 스스로 작동하지 않기 때문에(수동으로 `next`를 호출해야 함), 이를 자동으로 실행시켜 줄 **`_asyncToGenerator`라는 헬퍼 함수**가 감싸고 있는 구조도 확인할 수 있다.

> Babel 로 `async/await` 이 어떻게 트랜스파일링 되는지 궁금하다면, [Babel REPL](https://babeljs.io/repl) 에서 직접 코드를 입력해보자. 해당 코드는 ENV PRESET 을 체크하고 NODE 버전을 6으로 설정했다. (최신 브라우저는 `async/await` 를 지원하기에 트랜스파일링이 일어나지 않는다.)

## await Waterfall

`async/await` 를 사용하면, 여러 비동기 작업을 직렬적으로 처리해 코드가 매우 직관적으로 변하기는 하는데, 직렬적이라는 뜻은 곧 병목이 될 수 있다는 뜻이기도 하다. 이런 현상을 보통 Waterfall 이라고 부른다.

아래의 상황은 유저 정보도 가져오고, 유저의 게시글도 가져와야 하는 상황이다. 두 작업은 서로 의존성이 없지만, `await` 키워드로 인해 직렬적으로 처리되어 불필요하게 시간이 더 걸리게 된다.

```ts
async function getMyPageData() {
  // 1. 유저 정보 가져오기 (3초 걸림)
  const user = await fetchUser();

  // 2. 게시글 가져오기 (3초 걸림) -> 위 작업이 끝날 때까지 멍하니 대기함
  const posts = await fetchPosts();

  console.timeEnd("소요 시간"); // 총 6초 이상 걸림
  return { user, posts };
}
```

### Promise.all

이런 경우 `Promise.all` 을 사용해 병렬적으로 처리할 수 있다. `Promise.all` 은 여러 Promise 를 병렬적으로 실행하고, 모든 Promise 가 이행(fulfilled) 될 때까지 기다린다.

```ts
async function getMyPageData() {
  console.time("소요 시간");

  // 1. await 없이 함수를 호출만 함 -> Promise 객체가 바로 생성되고 요청은 이미 출발
  const userPromise = fetchUser();
  const postsPromise = fetchPosts();

  // 2. 두 Promise를 배열로 묶어서 await -> 둘 다 끝날 때까지 기다림
  const [user, posts] = await Promise.all([userPromise, postsPromise]);

  console.timeEnd("소요 시간"); // 가장 오래 걸리는 작업 기준 (약 3초)
  return { user, posts };
}
```

> `userPromise`와 `postsPromise`를 만드는 순간 이미 비동기 요청은 브라우저(또는 Node.js) 백그라운드에서 시작된다. Promise.all은 단지 그 결과들이 다 모이는 시점을 기다려줄 뿐

> 그렇다고 해서 1000개, 10000개의 요청을 한꺼번에 보내는 것은 좋지 않다. 너무 많은 동시 요청은 네트워크 병목 현상을 일으킬 수 있다. 이런 경우에는 적절한 개수로 나누어(batch) 처리하는 것이 좋다.


### Promise.allSettled
`Promise.all` 은 모든 Promise 가 이행(fulfilled) 되어야만 결과를 반환한다. 만약 하나라도 거부(rejected) 되면, 전체가 거부된다. 하지만, 모든 Promise 의 결과를 개별적으로 확인하고 싶을 때도 있다. 이럴 때는 `Promise.allSettled` 를 사용한다.

```ts
async function getMyPageData() {
  console.time("소요 시간");

  const userPromise = fetchUser();
  const postsPromise = fetchPosts();

  // Promise.allSettled 사용
  const results = await Promise.allSettled([userPromise, postsPromise]);

  // results 는 각 Promise의 상태와 결과를 포함한 객체들의 배열을 반환
  // [
  //   {status: "fulfilled", value: {…}},
  //   {status: "rejected",  reason: Error: an error}
  // ]
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      console.log("이행된 값:", result.value);
    } else {
      console.log("거부된 이유:", result.reason);
    }
  });
  console.timeEnd("소요 시간");
}
```

> 대부분의 경우 Promise.all 과 Promise.allSettled 를 적절히 사용하면, async/await 로 인한 Waterfall 현상을 효과적으로 해결할 수 있다.

### Promise.any
한번 이런 생각을 해보자, 어떤 이미지를 보여줘야 하는데 원본서버A, CDN서버B, 백업서버C 이렇게 3군데에서 이미지를 가져올 수 있다고 하자. 어디서든 이미지를 가져오기만 하면 된다. 이럴때 `Promise.any` 를 사용하면 된다. `Promise.any` 는 전달된 Promise 들 중에서 **가장 먼저 이행(fulfilled)** 되는 Promise 의 결과값을 반환한다.

특징점으론 3개중 2개의 Promise 가 거부(rejected) 되더라도, **하나만 이행(fulfilled) 되면 성공으로 간주**한다는 점이다. 단, 모든 Promise 가 거부(rejected) 되면, `AggregateError` 라는 특수한 에러 객체를 던진다.

```ts
try {
  const image = await Promise.any([
    fetch('https://cdn-a.com/img.png'), // 빠르지만 가끔 터짐
    fetch('https://cdn-b.com/img.png'), // 느리지만 안정적
    fetch('https://origin.com/img.png') // 최후의 보루
  ]);
  console.log("이미지 로드 성공!");
} catch (err) {
  // 모든 요청이 다 실패했을 때만 여기로 옴
  // err는 'AggregateError'라고 부르는 특수 에러 객체
  console.log("모든 서버가 다운되었습니다.");
}
```

### Promise.race

마지막으로 소개할 친구는 `Promise.race` 다. 이름처럼 경주(Race)를 시키는 것이다. 배열에 전달된 Promise 중 가장 먼저 끝나는(성공이든 실패든) 하나의 결과만 반환한다.

타임아웃을 구현하는 가장 흔한 패턴이기도 하다.

```ts
async function getDataWithTimeout() {
  try {
    const data = await Promise.race([
      fetch('/api/data'), // 1. 실제 데이터 요청
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("시간 초과!")), 5000) // 2. 5초 뒤에 실패
      )
    ]);
    console.log("데이터 수신 성공:", data);
  } catch (error) {
    console.log("에러 발생:", error.message); // 5초가 지나면 무조건 여기로 옴
  }
}
```

> `Promise.any` 와 `Promise.race` 를 통해 먼저 결과를 반환받더라도, 채택되지 못한 나머지 비동기 작업(네트워크 요청 등)이 자동으로 취소되지는 않는다. 최신 자바스크립트는 이 문제를 해결하기 위해 `AbortController` 라는 API를 제공한다. 관심있다면 [MDN 문서](https://developer.mozilla.org/ko/docs/Web/API/AbortController)를 참고하자.
