---
title: "Web Framework - 개요"
description: "2026년 1학기 웹프레임워크 수업 개요"
date: "2026-03-06"
keywords: "Express, JavaScript, KNU"
---

## library vs framework

* **Library**: 개발자가 필요할 때 호출하여 사용하는 도구 모음. 재사용 가능하도록 설계한 Class 나 Function, DLL(Dynamic Link Library) 같은 것들이 라이브러리에 해당.
* **Framework**: 애플리케이션 개발 같은 특정한 목적을 위해 미리 작성된 코드베이스, 개발자는 프레임워크가 제공하는 구조와 규칙에 따라 코드를 작성한다. 프레임 워크는 여러 라이브러리들을 포함하고 있다.
* **Web Framework**: 웹 애플리케이션 개발을 위한 프레임워크. HTTP 요청 처리, 라우팅, 템플릿 렌더링, 데이터베이스 연동, 세션 관리 등 웹 개발에 필요한 기능들을 제공.

> 학술적으로 정해진게 아니기 때문에 뭐가 Library 고 Framework 고 하는지 명확한 기준은 없다. 둘다 결국 **A set of pre-written code** 라는 점

## Front-end vs Back-end
* **Front-end:** 사용자와 직접 상호작용하는 부분, 웹사이트의 UI/UX 를 담당
* **Back-end:** 서버에서 실행되는 부분, 데이터 처리, 비즈니스 로직, 데이터베이스 연동, 인증, 보안 등을 담당

> 비즈니스 로직은 Back-end에서 자주 등장하는 용어로, 애플리케이션이 제공하는 서비스의 핵심 기능과 규칙을 정의하는 코드나 시스템을 의미한다. 예를 들어, 쇼핑몰 웹사이트에서 상품 검색, 장바구니 관리, 결제 처리 등이 비즈니스 로직에 해당할 수 있다.

자주 사용되는 Front-end Framework 로는 다음이 있다.
1. **React:** JavaScript(JSX), TypeScript(TSX)
2. **Vue.js:** JavaScript, TypeScript
3. **Angular:** TypeScript

자주 사용되는 Back-end Framework 로는 다음이 있다.
1. **Express:** Node.js 기반, JavaScript
2. **Spring Boot:** Java 기반, Spring 의 복잡한 초기 설정을 간소화한 프레임워크
3. **Django:** Python 기반, MTV(Model-Template-View) 아키텍처 패턴을 따름, Instagram 이 Django 를 기반으로 서비스를 시작함
4. **Laravel:** PHP 기반, MVC(Model-View-Controller) 아키텍처 패턴을 따름

> 여기선 Express 를 중심으로 Back-end Framework 를 살펴볼 예정

> Express 는 다른 3가지 Framework 와 달리 최소한의 기능(라우팅, 미들웨어) 만 제공한다. 그만큼 가볍고 유연한 개발이 가능하지만, 그만큼 직접 구현해야 하는 부분이 많아질 수 있다.

## 살펴볼 기초 지식
* **Node.js:** JavaScript 런타임, 서버에서도 JavaScript 를 사용할 수 있게 해주는 환경, Chrome V8 Engine 기반으로 만들어짐
* **Express:** Node.js 기반의 웹 프레임워크
* **MongoDB:** NoSQL 데이터베이스, JSON 을 확장한 BSON(Binary JSON) 형태로 데이터를 저장
* **HTTP:** HyperText Transfer Protocol, 웹에서 클라이언트와 서버 간의 통신을 위한 Protocol
* **RESTful API:** HTTP 를 설계된 의도대로 규격화해서 API 를 만드는 것
* **API:** Application Programming Interface, 소프트웨어 간의 상호작용을 위한 인터페이스

## NPM (Node Package Manager)
Node.js 의 패키지 매니저로 **개발 환경을 빠르게 구축**할 수 있게 해주는 도구, NPM Community 에서 관리하는 수많은 **패키지들을 다운로드 받아 사용할 수 있음,** Express 도 NPM 을 통해 설치하는것이 일반적

Node.js 를 설치하면 NPM 도 함께 설치됨, 이밖에도 Yarn, pnpm 같은 대체 패키지 매니저들도 존재하지만, 여기선 NPM 을 사용할 예정

프로젝트를 시작할 디렉토리로 이동하고 `npm init` 명령어를 입력하면 `package.json` 파일이 생성되고, 프로젝트에 대한 기본 정보와 의존성 패키지들을 관리할 수 있게 된다. 이후 `npm install <package-name>` 명령어로 필요한 패키지를 설치할 수 있다.

자동으로 생성되는 주요 파일과 디렉토리
* `package.json`: 프로젝트의 메타데이터와 의존성 패키지 정보를 담고 있는 파일, scripts 항목을 통해 자주 사용하는 명령어들을 단축해서 사용할 수 있게 해주는 기능도 있음
* `package-lock.json`: 설치된 패키지들의 정확한 버전 정보를 기록하는 파일, 없어도 프로젝트는 동작하지만, 팀 프로젝트에서는 버전 충돌을 방지하기 위해 사용하는걸 권장
* `node_modules/`: 설치된 패키지들이 저장되는 디렉토리

> 자세한 사항은 NPM Semantic Versioning 을 검색

## 패키지 버전 정보
패키지가 설치되면 `package.json` 파일의 `dependencies` 항목에 패키지 이름과 버전 정보가 추가된다. 버전 정보는 특정 버전을 고정하거나, 범위를 지정할 수 있다.

| 버전 정보 | 의미 |
| --- | --- |
| `1.0.0` | `1.0.0` 고정 |
| `>1.0.0` | `1.0.0` 보다 높은 버전 중 최신 버전 |
| `<5.0.0` | `5.0.0` 보다 낮은 버전 중 최신 버전 |
| `~1.2.3` | `1.2.x` 버전 중 최신 버전, < `1.3.0` |
| `^1.2.3` | `1.x.x` 버전 중 최신 버전, < `2.0.0` |

특정 버전을 명시하고 패키지를 설치하는 방법
* `npm install react@17.0.2`
* `npm install react@~17.0.2`

아무것도 명시하지 않고 패키지를 설치하면 최신 버전중 `^` 범위로 설치된다.

## modules vs packages
* **package:** NPM 에 등록하고 배포할 수 있는 하나의 묶음, 다른사람 혹은 나의 또다른 프로젝트와 코드를 공유하고 배포하는것이 주 목적, `package.json` 파일이 반드시 있어야 함, `npm install xxx` 명령어로 설치할 수 있는 것들이 패키지
* **module:** Node.js 에서 하나의 파일이 하나의 모듈로 간주됨, `package.json` 이 있는 폴더일 수도 있지만, 단순한 JavaScript 파일도 모듈이 될 수 있음

## 소개된 기본 문법
* **변수 선언:** `var`, `let`, `const` 차이 (호이스팅 까진 언급 안함)
  * `var`: 함수 스코프, 재선언과 재할당 모두 가능, 호이스팅 발생
  * `let`: 블록 스코프, 재선언 불가능, 재할당 가능, 호이스팅 발생하지만 TDZ(Temporal Dead Zone) 때문에 선언 전에 접근 불가능
  * `const`: 블록 스코프, 재선언 불가능, 재할당 불가능, 호이스팅 발생하지만 TDZ 때문에 선언 전에 접근 불가능
* **template literals:** `${variable}`
* **인수(arguments)** vs **매개변수(parameters)**
  * **인수(arguments):** 함수를 호출할 때 전달하는 값, `greeting("Alice")` 에서 `"Alice"` 가 인수
  * **매개변수(parameters):** 함수 정의에서 사용하는 변수, `function greeting(name) { ... }` 에서 `name` 이 매개변수
* **함수 표현식(Function Expression)** vs **함수 선언식(Function Declaration)**
  * **함수 선언식:** `function A() { ... }`, 호이스팅 발생
  * **함수 표현식:** `const B = function() { ... }`, 호이스팅 발생하지 않음
* 즉시 실행 함수 표현식 (IIFE)
* Arrow function: `() => { ... }`, `return` 키워드 생략 가능

```javascript
var name = "Alice";
var name = "Bob"; // var 는 재선언 가능

let age = 30;
// let age = 40; // SyntaxError: Identifier 'age' has already been declared

const PI = 3.14;
// PI = 3.14159; // TypeError: Assignment to constant variable.

// 함수 선언식 (Function Declaration)
function A(name) {
  return `Hello, ${name}!`;
}

// 함수 표현식 (Function Expression)
const B = function(name) {
  return `Hi, ${name}!`;
};

// Arrow function, ES6 에 도입된 간결한 함수 표현식
const C = (name) => {
  return `Hey, ${name}!`;
};

let D = name => `D: Welcome, ${name}!`;
var E = name => `E: Welcome, ${name}!`;

// 선언과 동시에 실행되는 함수 (IIFE)
(function(name) {
  console.log(`Welcome, ${name}!`);
})("Charlie");
```

> `var E = name => ...` 처럼 `var` 로 선언된 변수에 화살표 함수를 할당하는 것도 가능하지만, 함수 자체는 할당되기 전이므로 호출하려고 하면 `TypeError: E is not a function` 이 발생한다.