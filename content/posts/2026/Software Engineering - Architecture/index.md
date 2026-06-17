---
title: "Software Engineering - Architecture"
description: "202601 소프트웨어 공학 기말고사 software-architecture 정리"
date: "2026-06-17"
keywords: "KNU"
---

## Software Architecture
> System 을 구성하는 요소(Elements), 그 요소들의 외부 속성, 그리고 요소들 간의 관계(Relationships)를 정의하는 전체적인 구조

### 아키텍트의 핵심 역할
> 정책(Policy)과 세부사항(Details)의 분리: System 의 핵심 비즈니스 로직(정책)을 식별하고, 이를 DB나 웹서버, 프레임워크 같은 세부사항과 철저히 분리, 이르 통해, 세부 기술에 대한 결정을 최대한 미루고 유연성 확보 가능

### Architectural Theorems
* **제 1법칙**: 소프트웨어 아키텍처의 모든 것은 Trade-off다.
* **제 2법칙**: How 보단 Why 가 훨씬 중요

### 아키텍처 파티셔닝과 클린 아키텍처
> 시스템을 최상위 수준에서 어떻게 나눌것인가(Partitioning)에 대한 두 가지 접근법과, 이를 극복하기 위한 설계 철학

* **Technical Partitioning (기술적 분할)**: 프레젠테이션, 비즈니스 룰, 퍼시스턴스(DB) 등 기술적인 역할을 기준으로 계층을 나눈다. (예: MVC 패턴)
* **Domain Partitioning (도메인 분할)**: 결제, 재고 관리, 배송 등 독립적인 비즈니스 도메인이나 워크플로우를 기준으로 나눈다. (예: 마이크로서비스)

### 클린 아키텍처

![Clean Architecture](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FucRcI%2FbtsC33jYZoY%2FAAAAAAAAAAAAAAAAAAAAAG4ZabQjj2gXNsS-v7JUafM2qrMR4xx6-Y-S-Oa_nJbd%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1782831599%26allow_ip%3D%26allow_referer%3D%26signature%3DN%252FPxGFlfMaYkB5VeoNGLo5pBCR8%253D)

[Resource](https://janechoi.tistory.com/79)

> 동심원 형태의 구조로, 가장 핵심적인 엔터프라이즈 비즈니스 규칙(Entities) 을 중앙에 두고, 바깥쪽으로 갈수록 UI, Web, DB 등 세부적인 프레임워크가 위치

> 의존성 규칙: 제어의 흐름(Flow of control)과 상관없이, 소스 코드의 의존성은 반드시 바깥쪽에서 안쪽(중심부)을 향해야 한다. 즉, 내부의 비즈니스 로직은 외부의 DB나 UI 변경에 절대 영향을 받아서는 안 된다.

### 아키텍처 뷰 (4+1 View Model)
> 하나의 아키텍처 다이어그램으로 모든 것을 설명할 수는 없음, 이해관계자(개발자, 시스템 엔지니어, 최종 사용자 등)의 관심사에 맞춰 시스템을 4가지 서로 다른 관점(View)으로 모델링하고, 이를 시나리오로 묶어내는 방식

* **Logical View (논리 뷰)**:
  * **대상**: 최종 사용자 (End-user)
  * **관심사**: 기능성 (Functionality)
  * **내용**: 시스템의 핵심 추상화, 객체, 클래스(컴포넌트) 간의 관계를 보여줌
* **Process View (프로세스 뷰)**:
  * **대상**: 시스템 설계자, 통합자
  * **관심사**: 성능, 가용성
  * **내용**: 런타임에 시스템이 상호작용하는 Process와 Thread 의 동적인 흐름을 보여줌
* **Development View (개발 뷰)**:
  * **대상**: 프로그래머, 매니저
  * **관심사**: 조직화, 재사용성
  * **내용**: 개발 환경 내에서 소프트웨어가 패키지나 서브시스템으로 어떻게 쪼개져 있는지(파일/레포지토리 구조)를 보여줌
* **Physical View**:
  * **대상**: 시스템 엔지니어
  * **관심사**: 확장성, 성능, 가용성
  * **내용**: 시스템의 하드웨어 노드 구조와, 그 위의 소프트웨어 컴포넌트가 어떻게 배포되고 통신하는지 보여줌
* **+1 (Scenarios/User Cases)**:
  * 위의 4가지 뷰를 하나로 연결하고 검증하는 핵심 유스케이스나 시나리오

## Architectural Patterns
> 다양한 환경에서 이미 검증되고 테스트된 좋은 설계의 모범 답안

### MVC (Model-View-Controller)
> 데이터(Model), 화면(View), 제어(Controller) 를 분리하여 상호작용을 관리하는 패턴

* **When used**: 동일한 데이터에 대해 여러 가지 뷰(다중 화면)를 제공해야 할 때, 사용자 상호작용이 많은 앱, UI와 비즈니스 로직을 분리하고 싶을 때 사용
* **장단점**: 프레젠테이션 로직을 분리해 UI 수정이 쉽지만(장점), 모델/뷰/컨트롤러 간의 통신이 많아져 구조가 복잡해질 수 있음(단점).

> 참고: 안드로이드 등에서는 MVC의 변형인 MVP, MVVM 패턴도 널리 쓰임

### Layered
> 시스템을 여러 개의 계층(Layer)으로 차곡차곡 쌓아 올리는 구조 (예: OSI 7계층, 일반적인 웹 시스템의 Presentation -> Business -> Data Layer)

* **특징**: 각 계층은 자신만의 독립적인 서비스를 제공하며, 오직 바로 인접한 계층(주로 바로 아래 계층)하고만 통신해야 함
* **When used**: 기존 시스템 위에 새로운 서비스를 올릴 때, 여러 팀이 나누어 개발하는 대규모 시스템, 다단계 보안(Multi-level security)이 필요할 때 사용
* **장단점**: 특정 계층만 빼서 교체하기 쉽고 관심사가 분리되지만(장점), 여러 계층을 거치다 보니 성능 저하(Performance overhead)가 발생할 수 있고 개발자가 임의로 계층을 건너뛰는(Bypassing) 문제가 생길 수 있음

### Pipe and Filter
> 데이터가 여러 개의 처리 단계(Filter)를 거치며 변환되는 구조, (예: 컴파일러의 Lexical -> Syntactic -> Semantic 분석 과정)

* **구조**: 각 필터는 입력을 받아 변환(Transformation)한 후 출력을 내보내며, 파이프(Pipe)는 이 필터들을 연결.
* **When used**: 데이터 처리 파이프라인, 배치(Batch) 처리 시스템, 스트림(Stream) 처리 등 데이터 변환이 순차적으로 일어나는 시스템에 사용.
* **장단점**: 필터를 재사용하거나 새로 추가하기 매우 쉽지만(장점), 필터들끼리 통신할 때 데이터 포맷을 맞추기 위한 파싱(Parsing) 및 변환 오버헤드가 큼, 또한, 상호작용이 많은 시스템에는 부적합(단점).

### Repository
> 대량의 데이터가 중앙 저장소(Repository)에 모여 있고, 여러 서브시스템이 이 중앙 데이터를 공유하며 상호작용하는 구조

* **When used**: 대용량의 데이터를 공유(Large volumes of shared data)해야 할 때, 데이터 저장 기간이 길 때, 데이터 변경이 다른 시스템의 액션을 유발(Data-driven)할 때 사용
* **장단점**: 컴포넌트들이 서로 독립적이라 관리가 일관되지만(장점), 중앙 저장소가 망가지면 시스템 전체가 멈추는 단일 장애점(Single point of failure) 문제가 있으며 병목 현상(Bottleneck)이 생기기 쉬움

### Client-Server
> 데이터와 처리 로직을 여러 대의 컴퓨터(컴포넌트)에 분산시키는 구조 (예: 인터넷 기반의 웹 서비스, 사내 이메일 서버)
* **구조**: 특정 서비스를 제공하는 서버(Server)들과, 그 서비스를 요청하는 여러 대의 클라이언트(Client)들로 구성
* **When used**: 많은 클라이언트가 공유 서비스에 접근할 때, 데이터가 여러 위치에서 접근되어야 할 때, 클라이언트의 요청 Load가 가변적일 때 사용
* **장단점**: 서비스 관리를 중앙화하고 서버를 복제해 Load balancing을 하기 쉽지만(장점), 네트워크에 완전히 종속되며 서버가 단일 장애점이 될 위험이 있음

## Quiz

1. 클린 아키텍처(Clean Architecture)의 의존성 규칙(Dependency Rule)에 대한 설명으로 가장 올바른 것은?
  - A. 의존성은 제어의 흐름과 동일하게 안쪽에서 바깥쪽으로 향해야 한다.
  - B. 데이터베이스 계층의 변경이 중심부의 비즈니스 로직(Entities)에 즉각적으로 반영되어야 한다.
  - C. 소스 코드의 의존성은 항상 바깥쪽에서 안쪽(중심부)을 향해야 한다.
  - D. 엔터프라이즈 비즈니스 규칙은 외부 UI 프레임워크에 직접적으로 의존하여 구성되어야 한다.

  **정답: C**

2. 소프트웨어 아키텍처의 제1법칙(First Law of Software Architecture)이 의미하는 바는 무엇인가?
  - A. 아키텍처 설계에서는 '어떻게(How)' 구현할 것인지가 '왜(Why)' 설계했는지보다 중요하다.
  - B. 아키텍처의 정책(Policy)과 세부사항(Details)은 항상 강하게 결합되어야 한다.
  - C. 소프트웨어 아키텍처의 모든 결정은 트레이드오프(Trade-off)를 수반한다.
  - D. 마이크로서비스 아키텍처는 모든 시스템에서 항상 최적의 성능을 보장한다.

  **정답: C**

3. 크루첸(Kruchten)의 4+1 View Model에서 런타임 시 시스템이 상호작용하는 프로세스(Process)의 동적인 흐름을 보여주며, 주로 시스템 설계자나 통합자가 성능 및 가용성을 분석할 때 사용하는 뷰(View)는 무엇인가?
  - A. Logical View
  - B. Process View
  - C. Development View
  - D. Physical View

  **정답: B**

4. 다음 중 파이프 앤 필터(Pipe and Filter) 아키텍처 패턴의 특징으로 올바르지 않은 것은?
  - A. 데이터가 여러 개의 기능적 처리 단계(Filter)를 거치며 순차적으로 변환되는 구조이다.
  - B. 각 필터는 재사용하거나 파이프라인에 새로 추가하기가 용이하다.
  - C. 데이터 포맷을 맞추기 위한 파싱 및 변환 오버헤드(Overhead)가 발생할 수 있다.
  - D. 사용자와의 빈번한 상호작용이 필요한 대화형(Interactive) 시스템에 가장 적합한 구조이다.

  **정답: D**

5. 대용량의 데이터를 공유(Large volumes of shared data)해야 하거나 데이터 저장 기간이 길 때, 그리고 데이터의 변경이 다른 시스템의 동작을 유발하는 데이터 주도(Data-driven) 시스템에 가장 적합한 아키텍처 패턴은 무엇인가?
  - A. Repository 패턴
  - B. Layered 패턴
  - C. Model-View-Controller (MVC) 패턴
  - D. Client-Server 패턴

  **정답: A**

6. 소프트웨어 아키텍트의 핵심 역할 중 하나로, 시스템의 핵심 비즈니스 로직을 식별하고 이를 데이터베이스나 프레임워크와 같은 세부 기술로부터 철저히 분리하는 원칙을 무엇이라고 하는가?
  - A. 의존성 역전 원칙 (Dependency Inversion Principle)
  - B. 정책(Policy)과 세부사항(Details)의 분리
  - C. 단일 책임 원칙 (Single Responsibility Principle)
  - D. 개발-폐쇄 원칙 (Open-Closed Principle)
  **정답: B**