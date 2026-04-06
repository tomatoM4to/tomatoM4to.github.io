---
title: "Web Framework 1주차"
description: "강원대학교 컴퓨터공학과 2026년 1학기 웹프레임워크 수업 1주차 강의 내용 정리, 추가 및 보충"
date: "2026-03-06"
keywords: "Express, JavaScript, KNU"
---

## library vs framework

* **Library**: 개발자가 필요할 때 호출하여 사용하는 도구 모음. 재사용 가능하도록 설계한 Class 나 Function, DLL(Dynamic Link Library) 같은 것들이 라이브러리에 해당.
* **Framework**: 애플리케이션 개발 같은 특정한 목적을 위해 미리 작성된 일종의 틀(본문, 코드베이스, ..), 개발자는 프레임워크가 제공하는 구조와 규칙에 따라 코드를 작성한다. 이러한 프레임 워크는 여러 라이브러리들을 포함하고 있다.
* **Web Framework**: 웹 애플리케이션 개발을 위한 프레임워크. HTTP 요청 처리, 라우팅, 템플릿 렌더링, 데이터베이스 연동 등 웹 개발에 필요한 기능들을 제공.

### 핵심 차이점: 제어의 역전 (IoC)
Library 는 개발자가 전체적인 흐름을 주도하고 필요할 때 호출하는 방식이라면, Framework 는 미리 만들어진 시스템(틀) 이 개발자가 작성한 코드를 호출하는 방식으로서 제어권이 프레임 워크에 있다.

> 이론적으론 이렇지만 현실에선 칼로 딱 잘라 뭐는 Library, 뭐는 Framework 라고 구분하기 어려운 경우가 많다.

> Library 나 Framework 나 결국 pre-written code 라는 점에서는 동일

## Front-end vs Back-end

| 구분 | Front-end | Back-end |
| --- | --- | --- |
| 실행 위치 | 클라이언트(예: 브라우저) | 서버 |
| 주된 관심사 | UI/UX | 데이터 & 비즈니스 로직 |
| 다루는 것 | 화면, 상태, 등등 | DB, API, 인증, 등등 |
| 사용자와의 거리 | 직접 상호작용 | 보이지 않음 |
| 실패 시 | 사용자의 불편함 | 서비스 전체 오류 |

> 비즈니스 로직은 Back-end에서 자주 등장하는 용어로, 애플리케이션이 제공하는 서비스의 핵심 기능과 규칙을 정의하는 코드나 시스템을 의미한다. 예를 들어, 쇼핑몰 웹사이트에서 상품 검색, 장바구니 관리, 결제 처리 등이 비즈니스 로직에 해당할 수 있다.


### Front-end Framework

UI/UX 를 최적화 하는 도구, 사용자 화면 구성, 이벤트 처리, 상태 관리, API 호출 등등을 담당

| 구분 | React | Vue.js | Angular |
| --- | --- | --- | --- |
| 개발사 | Facebook | Community | Google |
| 학습 곡선 | 중간 | 낮음 | 높음 |
| 언어 | JavaScript (JSX) | JavaScript | TypeScript |

* React 는 UI 라이브러리로 시작했고 아직도 라이브러리로서 소개되고 있지만, 생태계가 워낙 커져서 프레임워크로 불리는 경우도 많음
* React 는 최근 Server Component 라는 개념이 도입되면서 React 가 서버쪽 렌더링 까지 일부 관여하게 되며, Front-end 와 Back-end 의 경계가 점점 모호해지고 있음
* Front-end 에선 DB 연동이나 중요한 API Key 같은 민감한 정보는 절대 포함되게 않도록 주의해야 함, 이 일은 Back-end 의 몫


### Back-end Framework
DB 연동, Authentication, API 설계, 등등을 담당하는 도구

| 구분 | Express | Spring Boot | Django | Laravel |
| --- | --- | --- | --- | --- |
| 개발사 | Community | Pivotal | Django Software Foundation | Taylor Otwell |
| 학습 곡선 | 낮음 | 높음 | 중간 | 낮음 |
| 언어 | JavaScript | Java | Python | PHP |

* Spring Boot 는 Spring 의 복잡한 초기 설정을 간소화한 프레임워크
* Instagram 이 Django 를 기반으로 서비스 되고 있음

> 한국은 Spring Boot 의 점유율이 압도적이지만, 위에서 소개된 프레임워크들 모두 글로벌 대규모 서비스에서 검증된 훌륭한 도구들이므로, 뭐가 더 좋고, 나쁘다 할 수 없음


## 살펴볼 기초 지식
* Node.js: JavaScript 런타임, 서버에서도 JavaScript 를 사용할 수 있게 해주는 환경, Chrome V8 JavaScript 엔진을 기반으로 만들어짐
* Express: Node.js 기반의 웹 프레임워크, 간단한 API 서버 구축에 자주 사용
* MongoDB: NoSQL 데이터베이스, JSON 형태로 데이터를 저장
* HTTP: HyperText Transfer Protocol, 웹에서 클라이언트와 서버 간의 통신을 위한 프로토콜, 굳이 서버 클라이언트 관계가 아니더라도 서버-서버 간 통신에도 사용됨
* RESTful API: HTTP 를 설계된 의도대로 규격화해서 API 를 만드는 것
* API: Application Programming Interface, 소프트웨어 간의 상호작용을 위한 인터페이스

> Node.js 를 채택한 이유는, Front-end 과 Back-end 모두 JavaScript 로 개발할 수 있기 때문, 또 Node.js 는 비동기 I/O 모델을 사용하여 높은 성능과 확장성을 제공하기 때문에 웹 서버 개발에 적합함

## NPM (Node Package Manager)
Node.js 의 패키지 매니저로 개발 환경을 빠르게 구축할 수 있게 해주는 도구, 이밖에 NPM Community 에서 관리하는 수많은 패키지들을 다운로드 받아 사용할 수 있음, Express 도 NPM 을 통해 설치하는것이 일반적

Node.js 를 설치하면 NPM 도 함께 설치됨, 이밖에도 Yarn, pnpm 같은 대체 패키지 매니저들도 존재하지만, 여기선 NPM 을 사용할 예정

### 주요 명령어
* `npm init`: 새로운 Node.js 프로젝트를 초기화, `package.json` 파일 생성
* `npm install <package-name>`: 특정 패키지를 설치, `package.json` 파일에 의존성으로 추가
* `npm install`: `package.json` 파일에 명시된 모든 의존성 패키지를 설치

이밖에도 스크립트를 지정하거나, 패키지를 글로벌로 설치하는 등 다양한 기능이 있지만 여기에선 기초적인 명령어들만 소개

### 패키지 버전 정보
`npm install xxx` 명령어로 패키치를 설치하면 `package.json` 파일에 의존성으로 추가되는데, 이때 버전 정보를 명시할 수 있다. 보통은 손으로 직접 수정할 일은 없지만 다른 팀원들과 똑같이 맞추거나, 특정 버전에서 버그가 발생해 버전을 낮워야 할때 같은 특수한 상황에선 직접 수정할 일이 있을 수 있으니 알아두면 좋음

**명령어를 통해 버전을 명시하는 방법**
* `npm install react@17.0.2`
* `npm install react@~17.0.2`

기본값은 `^`

| 버전 정보 | 의미 |
| --- | --- |
| `1.0.0` | `1.0.0` 고정 |
| `>1.0.0` | `1.0.0` 보다 높은 버전 중 최신 버전 |
| `<5.0.0` | `5.0.0` 보다 낮은 버전 중 최신 버전 |
| `~1.2.3` | `1.2.x` 버전 중 최신 버전 |
| `^1.2.3` | `1.x.x` 버전 중 최신 버전 |


### modules vs packages
* **package**: NPM 에 등록하고 배포할 수 있는 하나의 묶음, 다른사람 혹은 나의 또다른 프로젝트와 코드를 공유하고 배포하는것이 주 목적, `package.json` 파일이 반드시 있어야 함, `npm install xxx` 명령어로 설치할 수 있는 것들이 패키지
* **module**: Node.js 에서 하나의 파일이 하나의 모듈로 간주됨, `package.json` 이 있는 폴더일 수도 있지만, 단순한 JavaScript 파일도 모듈이 될 수 있음


## 소개된 기본 문법
* 변수 선언: `var`, `let`, `const` 차이 (호이스팅 까진 언급 안함)
* template literals: `${variable}`
* 인자(arguments) vs 매개변수(parameters)
* 함수 표현식 vs 함수 선언식
* 즉시 실행 함수 표현식 (IIFE)
* Arrow function: `() => { ... }`, `return` 키워드 생략 가능