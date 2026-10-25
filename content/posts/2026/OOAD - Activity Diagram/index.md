---
title: "OOAD - Activity Diagram"
description: "UML 다이어그램 중 Activity Diagram에 대한 설명과 예제"
date: "2026-10-23"
keywords: "OOAD, KNU"
---

![uml](/img/OOAD/ump.webp)

## Functional Modeling - Activity Diagram
Activity Diagram은 UML을 Behavior Diagram중 하나로, 시스템이나 비즈니스 프로세스에서 작업들이 어떤 순서와 조건으로 수행되는지를 표현하는 다이애그램이다.

주요 목적은 다음과 같다.

* **실행 순서:** 어떤 작업이 먼저 수행되는가?
* **조건 분기:** 어떤 조건에서 서로 다른 작업이 실행되는가?
* **병렬처리:** 어떤 작업들을 동시에 실행할 수 있는가?
* **데이터 이동:** 작업 사이에 어떤 객체나 데이터가 전달되는가?
* **책임 구분:** 누가 해당 작업을 수행하는가?

> 사람이 수행하는작업, 컴퓨터로 처리하는 작업 모두 포함할 수 있다.

## 다이어그램의 핵심 구성 요소

![activity diagram overview](/img/OOAD/activity-diagram-name-and-symbol-table.webp)

### Action vs Activity
* `Action`: 더이상 분해하지 않는 하나의 행동 단위
* `Activity`: 여러 Action으로 구성되는 활동

Activity Diagram은 하나의 Activity에 포함된 Action들과 실행 흐름을 표현한다.

복잡한 작업은 별도의 하위 Activity로 정의할 수 있으며, 상위 Activity Diagram에서는 Call Behavior Action을 통해 이를 호출할 수 있다. 함수를 정의하고 호출하는 구조와 유사

### Object Node
Activity사이에서 전달되는 객체나 데이터를 나타내는 노드, 행동을 의미하는 것이 아니라 행동에서 생성되거나 다른 행동으로 전달되는 객체를 나타낸 다.

UML에서는 `:ClassName` 또는 `objectName:ClassName`같은 표기법을 사용할 수 있다.

### Control Flow vs Object Flow

| 구분 | Control Flow | Object Flow |
| --- | ------------ | ----------- |
| 의미 | 실행 제어의 전달 | 객체 또는 데이터의 전달 |
| 초점 | 다음에 무엇을 실행하는가? | 어떤 데이터가 이동하는가? |
| 예시 | 주문 접수 → 결제 처리 | 주문 정보 → 결제 처리 |

두 Flow 모두 Action을 연결하지만, 의미가 다르다.

* Control Flow는 실행 순서를 제어한다.
* Object Flow는 필요한 객체 또는 데이터를 다음 작업으로 전달한다.

> 자료에선 Object Flow를 점선으로 표시하지만, UML 2.5.x 표준에선 실선을 사용한다. 따라서 모양에 집중하는게 아니라 전달되는 대상의 의미를 구분하는 것이 중요하다.

### Flow Final vs Activity Final
* `Flow Final`: 병렬 작업 중 특정 흐름만 종료
* `Activity Final`: 해당 Activity 전체의 실행 종료

### Decision/Merge vs Fork/Join
![Decision/Merge vs Fork/Join](/img/OOAD/activity-diagram-example1.webp)

> Merge는 다른 경로를 기다리는 동기화지점이 아니고, Join은 필요한 병렬 흐름의 완료를 기다린다는 큰 차이점이 존재함

### Swimlane - 책임 분리
작업을 수행하는 주체별로 다이어그램을 구획하는 방법

* Customer, Manager
* Sales, Accounting
* Order System, Payment System
* Controller, Service
* Warehouse

가령 사용자가 주문하고 결제 시스템이 결제를 처리하며 창고에서 상품을 배송한다면, 각각 별도의 Swimlane을 사용해 책임을 명확히 할 수 있다.

## 확장 요소

기본 요소보다 복잡한 Process를 표현할 때 사용하는 요소들

| 요소 | 핵심 개념 | 용도 |
| --- | -------- | --- |
| Pin | Action의 입력, 출력 | 데이터 전달 명시 |
| Streaming Parameter | 실행 중 지속적인 입력, 출력 | 연속 데이터 처리 |
| Exception Output | 예외 결과를 출력 | 정상 흐름과 예외 흐름 구분 |
| SendSignal | 비동기 신호 송신 | 이벤트 통지 |
| ReceiveSignal | 비동기 신호 수신 | 이벤트에 대한 반응 |
| Interruptible Region | 영역 내 실행 중단 | 취소, 중단 처리 |
| Activity Group | 활동의 그룹화 | 복잡한 프로세스의 범위 표현 |

> 개발 관점에선 취소 가능한 긴 작업이나 사용자 요청에 따른 작업 중단을 표현할 때 유용한 개념들

## Activity Diagram작성 방법
자료에서 제시하는 과정엔 총 5단계가 있다.

1. Scope 정의: 표현할 프로세스의 범위와 목적을 결정하고 적절한 제목을 작성
2. Activity 및 Flow 식별: 수행되는 작업을 나열하고 작업 간 Control Flow와 Object Flow를 파악
3. Decision 식별: 조건에 따라 달라지는 경로를 찾음
4. Parallelism 식별: 동시에 수행할 수 있는 작업과 동기화 지점을 파악
5. 다이어그램 작성

## Example
Create an activity diagram using the following business process
* The first step is to see an eye doctor who will give a prescription.
* Once you have a prescription, you go to a glasses store, where select
* your frames and place the order for your glasses.
* Once the glasses have been made, you return to the store for a fitting
and pay for the glasses.

![activity diagram example](/img/OOAD/activity-diagram-example2.webp)

위 프로세스에선 다음과 같은 Object Node가 존재함을 볼 수 있다.
* `Prescription`: 시력 검사 결과인 처방전
* `Frame`: 고객이 선택한 안경테
* `Glasses`: 제작된 안경
* `Fitted Glasses`: 피팅이 완료된 안경

> Activity Diagram은 같은 프로세스라도 모델링의 상세 수준에 따라 다르게 표현할 수 있다. 예를들어 위 예제에서 Notify Customer와 Fit glasses는 하나의 Action으로 해석할 수도 있다.

> 결론적으로, Activity Diagram은 모든 세부 동작을 반드시 그리는 것이 아니라 분석 목적과 범위에 맞는 수준으로 행동의 추상화 수준을 결정하는 것이 매우 중요하다.

## Summary and Discussion
#### What is the purpose of an Activity Diagram?
Activity Diagram의 목적은 시스템 또는 비즈니스 프로세스의 동작을 작업 간 제어 프름과 데이터 흐름으르로 모델링 하는 기법이다.

이를 구체화 하면
1. 순차적인 작업 흐름 표현 - 어떤 작업이 먼저 수행되는가?
2. 조건 분기 표현 - 특정 조건에 따라 어떤 경로로 진행하는가?
3. 병렬 처리 표현 - 어떤 작업들이 병렬로 실행되는가?
4. 데이터 흐름 표현 - 작업 사이에서 어떤 데이터나 객체가 이동하는가?
5. 책임 구분 - 어떤 사용자, 부서, 시스템이 작업을 수행하는가?

여기서 중요한 점은 반드시 코드의 실행 순서만을 나타내지는 않난다는 점이다. 예를들어 병원 예약 시스템에서 환자가 정보를 입력하고, 직원이 확인하고, 시스템이 예약을 처리하는 전체 비즈니스 프로세스를 표현할 수 있다.

#### Why use Activity Diagram instead of Flowchart or SDL?
Flowchart는 절차를 설명하는 데 간단하고 효과적이지만, Activity Diagram은 복잡한 시스템의 행동을 더 체계적으로 표현할 수 있다는 장점이 있다.

Flowchart도 표기법을 확장하면 데이터나 병렬 처리를 표현 사능하지만 일반적으론 이렇다는 점이다.

## Checklist
### Q
1. Activity Diagram은 구조 다이어그램인가, 행위 다이어그램인가?
2. Decision과 Fork는 어떤 차이가 있는가?
3. Merge와 Join은 어떻게 다른가?
4. Control Flow와 Object Flow의 차이는?
5. Activity Final과 Flow Final의 차이는?
6. Swimlane의 목적은 무엇인가?
7. Interruptible Region은 언제 사용 하는가?


### A
1. 행위 다이어그램
2. Decision은 조건에 따른 선택, Fork는 병렬 실행
3. Merge는 대안 경로의 합류, Join은 병렬 흐름의 동기화
4. Control Flow는 실행 제어의 전달, Object Flow는 객체나 데이터의 전달
5. Activity Final은 전체 활동 종료, Flow Final은 해당 흐름만 종료
6. 각 작업을 수행하는 책임 주체를 구분하는 것
7. 활용 영역 안에서 실행 중인 작업들을 중단할 수 있어야 할때