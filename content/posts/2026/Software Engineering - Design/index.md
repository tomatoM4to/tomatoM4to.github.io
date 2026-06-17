---
title: "Software Engineering - Design"
description: "202601 소프트웨어 공학 기말고사 Analysis and design 정리"
date: "2026-06-17"
keywords: "KNU"
---

## 구조적 분석/설계 다이어그램
* **ERD(Entity-Relationship Diagram)**: 데이터베이스 설계의 뼈대로, 시스템에서 관리할 데이터 개체(Entity)와 그들 간의 관계(Relationship)를 시각화한 다이어그램
* **DFD (Data Flow Diagram)**: 제어 흐름(`if`, `while`)은 철저히 무시하고, 데이터가 시스템 내의 프로세스를 거치며 어떻게 흘러가고(Flow) 저장되는지만 직관적으로 보여주는 다이어그램\
* **Data Dictionary (자료 사전)**: DFD에 나타난 모든 데이터의 이름, 의미, 구성 요소를 텍스트로 엄격하게 정의한 시스템의 단어장

## 객체지향 분석/설계
* **추상화**: 현실 세계의 복잡한 사물에서 시스템에 필요한 핵심적인 속성과 기능만 추출해 내는 과정
* **캡슐화**: 데이터와 이를 다루는 메서드를 하나의 묶음으로 만들고 외부에서 함부로 데이터에 접근하지 못하도록 숨김
* **상속**: 부모 클래스의 속성과 기능을 자식 클래스가 물려받아 재사용하고 확장함
* **다형성**: 하나의 메시지나 인터페이스가 상황에 따라 다르게 동작하는 특성 (오버로딩, 오버라이딩)

## UML 다이어그램의 분류
> UML 다이어그램은 크게 정적인것과 동적인것으로 나뉨

### 정적 다이어그램 (Structural Diagrams)
* 클래스 다이어그램
* 객체 다이어그램
* 컴포넌트 다이어그램

### 동적 다이어그램 (Behavioral Diagrams)
* 유스케이스 다이어그램
* 시퀀스 다이어그램
* 상태 다이어그램

## Quiz

1. 소프트웨어 개발 과정에서 '분석(Analysis)' 단계의 주된 목적을 가장 잘 설명한 것은?
   - A. 시스템을 어떻게(How) 구현할지 기술적인 구조와 프레임워크를 설계한다.
   - B. 사용자의 요구사항을 바탕으로 시스템이 '무엇(What)'을 해야 하는지 비즈니스 도메인을 정의한다.
   - C. 성능 최적화를 위해 데이터베이스 스키마와 인덱스를 구성한다.
   - D. 완성된 코드를 바탕으로 클래스 다이어그램을 역공학(Reverse Engineering)으로 추출한다.

   **정답: B**

2. 클래스 다이어그램에서 "전체-부분(Whole-Part)" 관계를 나타낼 때, '전체(Whole)가 소멸하면 부분(Part)도 함께 소멸하는 가장 강한 결합'을 의미하는 관계와 그 UML 기호로 알맞은 것은?
   - A. 연관 (Association) - 실선
   - B. 집합 (Aggregation) - 실선과 비어있는 마름모
   - C. 합성 (Composition) - 실선과 까맣게 칠해진 마름모
   - D. 의존 (Dependency) - 점선과 열린 화살표

   **정답: C**

3. 자바의 `implements` 키워드를 사용하여 인터페이스의 명세를 실제 클래스가 구현하는 관계를 나타내며, UML에서는 점선과 비어있는 닫힌 화살표로 표현되는 관계는?
   - A. 일반화 (Generalization)
   - B. 실체화 (Realization)
   - C. 의존 (Dependency)
   - D. 연관 (Association)

   **정답: B**

4. UML 다이어그램은 크게 정적 다이어그램과 동적 다이어그램으로 나뉜다. 다음 중 시간의 흐름과 무관하게 시스템의 뼈대와 구조를 보여주는 '구조적/정적 다이어그램(Structural Diagram)'에 해당하는 것은?
   - A. 시퀀스 다이어그램 (Sequence Diagram)
   - B. 유스케이스 다이어그램 (Use Case Diagram)
   - C. 상태 다이어그램 (State Machine Diagram)
   - D. 클래스 다이어그램 (Class Diagram)

   **정답: D**

5. 유스케이스 다이어그램에서, 사용자가 '결제하기' 기능을 수행할 때 시스템 내부적으로 '로그인 상태 확인' 기능이 무조건 함께 실행되어야 한다면, 이 두 유스케이스 사이의 올바른 관계는 무엇인가?
   - A. <<extend>> (확장)
   - B. <<include>> (포함)
   - C. 일반화 (Generalization)
   - D. 의존 (Dependency)

   **정답: B**

6. 시퀀스 다이어그램에서 생명선(Lifeline) 위에 직사각형 박스로 표시되며, 해당 객체가 현재 CPU를 점유하며 실행 중(일하고 있음)임을 나타내는 요소는?
   - A. 메시지 (Message)
   - B. 가드 (Guard)
   - C. 활성 구간 (Activation)
   - D. 전이 (Transition)

   **정답: C**

7. 시퀀스 다이어그램에서 한 객체가 다른 객체에게 메시지를 보낸 후, 응답을 기다리지 않고 곧바로 자신의 다음 작업을 계속 수행하는 메시지 타입은?
   - A. 동기 메시지 (Synchronous Message)
   - B. 비동기 메시지 (Asynchronous Message)
   - C. 반환 메시지 (Return Message)
   - D. 재귀 메시지 (Self Message)

   **정답: B**

8. 상태 다이어그램(State Machine Diagram)에서 객체의 상태를 한 상태에서 다른 상태로 넘어가게(Transition) 만드는 방아쇠 역할을 하는 사건을 무엇이라고 하는가?
   - A. 상태 (State)
   - B. 이벤트 (Event)
   - C. 가드 (Guard)
   - D. 액션 (Action)

   **정답: B**

9. 한 클래스가 다른 클래스를 멤버 변수(필드)로 유지하지 않고, 메서드의 파라미터나 리턴 타입으로 아주 잠깐만 사용하고 버리는 가장 약한 결합 관계를 무엇이라고 하는가?
   - A. 합성 (Composition)
   - B. 집합 (Aggregation)
   - C. 의존 (Dependency)
   - D. 연관 (Association)

   **정답: C**

10. 구조적 분석 기법에서 제어 흐름(if, while 등)은 철저히 무시하고, 데이터가 시스템 내의 프로세스를 거치며 어떻게 흘러가고 저장되는지만을 직관적으로 보여주는 다이어그램은?
   - A. ERD (Entity-Relationship Diagram)
   - B. DFD (Data Flow Diagram)
   - C. 자료 사전 (Data Dictionary)
   - D. 클래스 다이어그램 (Class Diagram)

   **정답: B**
