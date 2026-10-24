---
title: "OOAD - Use Case Diagram"
description: "UML 다이어그램 중 Use Case Diagram에 대한 설명과 예제"
date: "2026-10-24"
keywords: "OOAD, KNU"
---

## Functional Modeling – Use Case Diagram
Use Case Diagram은 UML의 Behavior Diagram중 하나로, 시스템 외부의 사용자가 시스템과 어떻게 상호작용하며 어떤 기능을 이용할 수 있는지를 표현하는 다이어그램이다.

핵심은 **시스템이 무엇을 해야하는가(What)** 를 정의하는 것이며, 기능의 구체적인 구현 방법(How)은 표현하지 않는다.

## Use Case Diagram의 목적
주요 목적은 다음과 같다.
* **기능 요구사항 정의:** 시스템이 제공해야 하는 기능을 식별한다.
* **사용자와 시스템의 상호작용:** 누가 어떤 기능을 사용하는지 표현한다.
* **시스템 범위 정의:** 시스템 내부와 외부의 책임을 구분한다.
* **기능 간 관계 표현:** 기능의 공통 동작, 선택적 동작, 일반화 관계를 나타낸다.
* **후속 설계의 기반:** 클래스 다이어그램, 시퀀스 다이어그램, 테스트 시나리오 등의 출발점 으로 활용한다.

> 강의 자료에선 Use Case Diagram을 시스템 개발 생명주기(SDLC)의 초기 요구사항 수집 및 정의 단계에서 작성하는 것으로 설명한다.

## 핵심 구성 요소

유즈케이스 다이어그램은 크게 네 가지 요소로 구성된다.

![Use-Case-Components-Table](/img/OOAD/Use-Case-Components-Table.webp)

### Actor
시스템과 상호작용하는 외부 개체의 Role 이다.

반드시 사람일 필요는 없고, 외부 소프트웨어, 장치, 조직, 시간에 따라 동작을 유발하는 요소 등도 Actor가 될수 있다.

중요한 특징은 다음과 같다.

* 한 명의 사람이 여러 Actor 역할을 수행할 수 있다.
* 여러 사람이 동일한 Actor 역할을 수행할 수 있다.
* Actor는 시스템 경계 바까톡에 배치한다.
* Actor는 구체적인 인물이나 객체보다 역할을 중심으로 정의한다.

예를 들어 쇼핑 시스템에서 한 사람이 **구매자**이면서 **판매자**일 수 있다. 그러나 두 역할이 수행하는 기능이 다르다면 서로 다른 액터로 구분한다.

### Use Case
Use Case는 액터가 특정 목적을 달성하기 위해 시스템과 상호작용하는 기능 단위다.

예를 들어 다음과 같다.
* 상품 검색
* 상품 주문
* 주문 취소
* 재고 관리

Use Case 하나는 기본적으로 하나의 완결된 사용자 목표를 표현하지만, 목표를 달성하는 과정에는 여러 실행 경로가 있을 수 있다.

### System Boundary
시스템 경계는 사각형으로 표현한다.
* 사각형 안에는 시스템이 제공하는 Use Case를 배치한다.
* 사각형 바깥에는 시스템과 상호작용하는 Actor를 배치한다.
* 사각형 상단에는 시스템 이름을 표시한다.

핵심은 시스템 내부엣거 수행하는 팩임과 외부 개체의 책임을 구분하는 것

### Relationship
관계는 Actor와 Use Case 사이 또는 Use Case와 Use Case 사이에 형성된다.

중요한 관계는 4종류다.
* Association
* Include
* Extend
* Generalization

### Association - 연관 관계

![Association - 연관 관계](/img/OOAD/usecase-example1.svg)

* 실선으로 연결한다.
* 일반적으로 화살표를 표시하지 않는다.
* 연결된 Actor가 해당 Use Case에 참여함을 나타낸다.

### Include - 포함 관계
![Include - 포함 관계](/img/OOAD/usecase-example2.svg)

온라인 선결게 시스템에서 모든 주문이 결제 처리를 요구한다면 `상품 주문`은 `결제 처리`를 포함할 수 있다.
* 점선 화살표를 사용한다.
* `<<include>>`를 표기한다.
* 기본 Use Case → 포함되는 Use Case 방향이다.

### Extend - 확장 관계
![Extend - 확장 관계](/img/OOAD/usecase-example3.svg)

특정 조건에서 기본 Use Case에 선택적인 동작을 추가하는 관계다.

위 이미지는 상품 주문 과정에서 고객이 쿠폰을 보유하고 적용하기로 선택했을 때만 쿠폰 적용 동작이 실행되는 경우다.
* 점선 화살표를 사용한다.
* `<<extend>>`를 표기한다.
* 확장 Use Case → 기본 Use Case 방향이다.
* 기본 Use Case는 확장 동작 없이도 완결될 수 있다.

> 모든 조건 분기를 별도의 Extend로 만들 필요는 없다. 단순한 성공 실패 분기는 Use Case 명세의 대안 흐름으로 표현해도 된다.

### Generalization – 일반화 관계
![Generalization – 일반화 관계](/img/OOAD/usecase-example4.svg)

Actor 또는 Use Case 사이에서 일반적인 개념과 특수한 개념의 관계를 나타낸다.
* 실선과 속이 빈 삼각형 화살촉을 사용한다.
* 자식(특수) → 부모(일반) 방향이다.
* 일반화된 Actor의 관계를 특수화된 Actor가 상속할 수 있다.

> 자료에선 Actor 뿐 아니라 Use Case 자체의 일반화도 다룬다.

## Use Case 와 Scenario의 차이
유즈케이스는 하나의 기능을 나타내며, 그 기능을 수행하는 과정에는 여러 실행 경로가 존재할 수 있다.

시나리오는 유즈케이스가 실제로 수행되는 하나의 구체적인 실행 사례다.

## Use Case Description – 유즈케이스 명세서
유즈케이스 다이어그램이 기능의 전체 구조를 보여준다면, 유즈케이스 명세서는 개별 기능의 구체적인 동작을 설명한다.

