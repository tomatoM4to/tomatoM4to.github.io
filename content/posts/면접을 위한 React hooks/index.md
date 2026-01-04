---
title: "면접을 위한 React hooks"
description: "면접에서 자주 나오는 React hooks 들을 정리해봅시다."
date: "2026-01-04"
keywords: "React"
---
## ⭐⭐⭐⭐⭐
### useState
1. 상태가 변경되면 컴포넌트가 리렝더링 됨
2. 상태 변경 함수는 **비동기적으로 작동**
3. 상태 변경 함수를 호출한다고 해서, 즉시 상태가 변경되지 않음, React는 성능을 위해 여러 번의 state 변경 요청을 하나로 묶어서(Batching) 처리한 뒤, 컴포넌트를 리렌더링할 때 비로소 변경된 값을 적용
3. 함수형 업데이트 지원: 이전 상태에 기반한 새 상태 계산 가능
4. 초기 상태는 함수로 전달 가능 (초기 렌더링 시에만 실행됨)

### useEffect
`useEffect` 는 기본적으로 화면이 다 그려진 후 비동기적으로 실행됨, 해당 컴포넌트는 외부 시스템과 상호작용할 때 주로 사용됨, useEffect 는 예전 클래스 컴포넌트의 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` 를 합친 것과 같음

외부 시스템 예시
1. 네트워크
2. 브라우저 DOM
3. 애니메이션
4. 다른 UI 라이브러리
5. 기타 React 가 아닌 코드들

`useEffect` 함수에 전달할 콜백함수의 반환값은 반드시 cleanup 함수 여야 함, cleanup 함수는 컴포넌트가 언마운트 될 때나, 다음 이펙트가 실행되기 전에 호출됨 대표적인 사용 예시로는
1. `setTimeout` 또는 `setInterval` 정리
2. `window.addEventListener` 로 등록한 이벤트 리스너 제거
3. WebSocket 연결 종료

정리하지 않으면 메모리 누수 등의 문제가 발생할 수 있음

`useEffect` 의 두 번째 인자인 의존성 배열(dependency array)을 통해 언제 이펙트가 실행될지 제어 가능
1. 빈 배열 (`[]`) 을 전달하면, 이펙트는 컴포넌트가 처음 마운트될 때만 실행됨
2. 특정 상태나 props 를 배열에 포함시키면, 해당 값이 변경될 때마다 이펙트가 실행됨, 컴포넌트가 전부 다 그려진 후에 실행됨
3. 의존성 배열을 생략하면, 이펙트는 컴포넌트가 리렌더링될 때마다 매번 실행됨
4. 배열에 객체정보를 넣을 때는 주의가 필요, 객체는 참조형이기 때문에, 객체 내부 값이 바뀌어도 참조가 같으면 변경되지 않은 것으로 간주되어 이펙트가 실행되지 않음
5. 반대로 컴포넌트 내부에 `const obj = { id: 1 }` 처럼 객체를 선언하고 의존성 배열에 넣으면, 컴포넌트가 리렌더링 될 때마다 **새로운 객체**가 만들어짐, 따라서 불필요한 이펙트 실행이 발생할 수 있음

### useRef
**DOM 요소에 직접 접근**하거나, 렌더링을 유발하지 않는 **가변 값을 저장**할 때 사용
1. `useRef` 로 생성된 객체는 `.current` 프로퍼티를 가짐
2. 이 객체는 컴포넌트의 전체 생명주기 동안 동일한 참조를 유지
3. `.current` 프로퍼티에 값을 할당해도 컴포넌트가 리렌더링되지 않음

DOM 에 접근하는 가장 대표적인 예시
```tsx
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```
1. `const inputRef = useRef(null)`로 빈 껍데기(참조 객체)를 만듦
2. <input ref={inputRef} />가 렌더링될 때, React는 실제 DOM 노드가 생성되면 그 노드를 inputRef.current에 집어넣음
3. 버튼을 클릭하면 `handleClick`이 실행되고, `inputRef.current`(실제 input 태그)에 있는 브라우저 네이티브 API인 `.focus()`를 호출

### useContext
전역 상태 관리를 위해 사용, Context API 와 함께 사용되어, 컴포넌트 트리 전체에 데이터를 전달할 수 있음

하지만 과도한 사용은 컴포넌트의 재사용성을 떨어뜨릴 수 있으므로, 필요한 경우에만 사용하는 것이 좋음

그리고 `useContext` 를 사용할 때는, Context 값이 변경되면 해당 Context 를 구독하는 모든 컴포넌트가 리렌더링된다는 점을 유의해야 함

> 최신 React 에서는 상태 관리 라이브러리(Redux, MobX 등) 또는 React Query 같은 데이터 패칭 라이브러리를 사용하는 것이 더 일반적이지만, 간단한 전역 상태 관리에는 `useContext` 가 여전히 유용함

## ⭐⭐⭐⭐
### useMemo
`const value = useMemo(calculateValue, dependencies)`
1. 첫 번째 인자인 `calculateValue` 는 메모이제이션할 값을 계산하는 함수, 순수해야 하며인자를 받지 않고, 모든 타입의 값을 반환할 수 이썽야 함
2. 두 번째 인자인 `dependencies` 는 배열로, 이 배열에 포함된 값들이 변경될 때에만 `calculateValue` 함수가 다시 호출되어 값을 재계산, 배열이 비어있으면 컴포넌트가 처음 렌더링될 때 한 번만 계산됨

값을 비교할때는 React는 내부적으로 `Object.is` 로 비교, `dependencies` 배열의 값들이 바뀔때마다 실행된다는 점에서 `useEffect` 와 매커니즘 자체는 똑같지만, 실행 시점과 목적이 완전히 다름

| `useEffect`                  | `useMemo`               |
|-----------------------------|-------------------------|
| 화면이 다 그려진 후에 실행     | 렌더링 과정에서 실행        |
| 부수효과(side effect)를 처리 | 값(연산 결과)을 메모이제이션 |

**주의점**
* `console.log` 같은 부수효과를 `useMemo` 안에서 실행하지 말 것
* API 호출 (`fetch` 등) 같은 비동기 작업을 `useMemo` 안에서 실행하지 말 것
* DOM 조작을 `useMemo` 안에서 실행하지 말 것

`useMemo` 는 렝더링 도중 발생하기에 사이트 이펙트를 발생시키면 렌더링이 꼬이거나 예상치 못한 버그가 발생, 그리고 React 의 순수성(purity) 원칙에도 어긋남

### useCallback
React 에선 컴포넌트 내부에 함수를 선언하는 경우가 많음, 이렇게 함수 생성을 캐싱하는 것이 `useCallback` 의 주요 목적

`const memoizedCallback = useCallback(callback, dependencies)`

사실 내부적으로 `useMemo` 와 동일하게 동작, `useCallback(fn, deps)` 는 `useMemo(() => fn, deps)` 와 완전하게 동일, 그저 함수의 결과를 반환하냐, 함수 자체를 반환하냐의 차이

### memo
컴포넌트의 불필요한 리렌더링을 방지하기 위해 사용, `React.memo` 는 고차 컴포넌트(Higher-Order Component)로, 컴포넌트를 감싸서 메모이제이션된 버전을 반환, props 가 변경되지 않으면 이전에 렌더링된 결과를 재사용

hook 은 아니지만 `useCallback` 과 `useMemo` 와 함께 React 성능 최적화에 빠지지 않는 도구이기에 함께 정리

보통 자식 컴포넌트에 props 에 함수를 전달할 때, 부모 컴포넌트의 함수가 매번 새로 생성되기 때문에, 자식 컴포넌트가 불필요하게 리렌더링되는 경우가 많음, 이럴 때 `useCallback` 과 `React.memo` 를 함께 사용하면 성능 최적화에 도움이 됨

`useMemo` 도 마찬가지로, 자식 컴포넌트에 복잡한 객체나 배열을 props 로 전달할 때, 매 렌더링마다 새로운 참조가 생성되어 자식 컴포넌트가 불필요하게 리렌더링되는 경우가 있음, 이럴 때 `useMemo` 와 `React.memo` 를 함께 사용하면 성능 최적화에 도움이 됨

## ⭐⭐⭐
### useReducer
### useLayoutEffect
### useImperativeHandle
### useId

## ⭐⭐
### useOptimistic
### useActionState
### useEffectEvent

## ⭐
### DebugValue
### useInsertionEffect
