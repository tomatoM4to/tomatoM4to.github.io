---
title: "Web Framework 1주차"
description: "강원대학교 컴퓨터공학과 2026년 1학기 웹프레임워크 수업 1주차 강의 내용 정리, 요약"
date: "2026-03-06"
keywords: "Web Framework"
---

## library vs framework

* **Library**: 개발자가 필요할 때 호출하여 사용하는 도구 모음. 재사용 가능하도록 설계한 Class 나 Function, DLL(Dynamic Link Library) 같은 것들이 라이브러리에 해당.
* **Framework**: 애플리케이션 개발 같은 특정한 목적을 위해 미리 작성된 일종의 틀(본문, 코드베이스, ..), 개발자는 프레임워크가 제공하는 구조와 규칙에 따라 코드를 작성한다. 이러한 프레임 워크는 여러 라이브러리들을 포함하고 있다.
* **Web Framework**: 웹 애플리케이션 개발을 위한 프레임워크. HTTP 요청 처리, 라우팅, 템플릿 렌더링, 데이터베이스 연동 등 웹 개발에 필요한 기능들을 제공.

### 핵심 차이점: 제어의 역전 (IoC)
Library 는 개발자가 전체적인 흐름을 주도하고 필요할 때 호출하는 방식이라면, Framework 는 미리 만들어진 시스템(틀) 이 개발자가 작성한 코드를 호출하는 방식으로서 제어권이 프레임 워크에 있다.

> 이론적으론 이렇지만 현실에선 칼로 딱 잘라 뭐는 Library, 뭐는 Framework 라고 구분하기 어려운 경우가 많다.

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

**몇가지 짚어볼점**
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

**몇가지 짚어볼점**
* Spring Boot 는 Spring 의 복잡한 초기 설정을 간소화한 프레임워크
* Instagram 이 Django 를 기반으로 서비스 되고 있음

> 한국은 Spring Boot 의 점유율이 압도적이지만, 위에서 소개된 프레임워크들은 모두 글로벌 대규모 서비스에서 검증된 훌륭한 도구들이므로, 뭐가 더 좋고, 나쁘다 할 수 없음
