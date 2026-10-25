---
title: "OOAD - Behavioral Modeling"
description: "Behavioral Modeling에 대한 설명과 예제, Sequence Diagram, State Machine Diagram"
date: "2026-10-26"
keywords: "OOAD, KNU"
---

![uml](/img/OOAD/ump.webp)

## Behavioral Modeling

Behavioral Modeling은 시스템 내부에서 객체들이 어떻게 상호작용하며, 시간에 따라 상태가 어떻게 변화하는지 표현하는 동적 모델링이다.

| 모델 | 핵심 질문 | 대표 다이어그램 |
| :--- | :--- | :--- |
| Functional Model | 시스템은 무엇을 해야 하는가? | Use Case, Activity |
| Structural Model | 시스템은 무엇으로 구성되는가? | Class Diagram |
| Behavioral Model | 객체들은 어떻게 상호작용하고 변화하는가? | Sequence, State Machine |


다루는 주요 다이어그램은 다음과 같다.
* **Sequence Diagram:** 객체간 메시지 전달을 시간 순서로 표현
* **State Machine Diagram:** 객체가 시간의 흐름에 따라 어떤 State에 머무르고, 특정 Event나 조건에 의해 다른 상태로 전이 하는지 표현

## Sequence Diagram

![sequence-diagram-example](/img/OOAD/sequence-diagram-example1.webp)

UML의 Interaction Diagram 중 하나로, 객체들이 메시지를 주고받는 과정을 시간 순서에 따라 표현하는 다이어그램이다.

주요 목적은 유즈케이스의 실행 과정에서 어떤 객체가 참여하고, 어떤 메시지를 주고받으며, 어떤 순서로 기능이 수행되는지 표현하는 것이다.

* **수직측:** 시간의 흐름 (위→아래)
* **수평측:** 상호작용에 참여하는 객체
* **Instance Form:** 특정 시나리오 하나를 상세하게 표현
* **Generic Form:** 시나리오에서 발생 가능한 대안과 분기를 포함하여 표현

### 구성 요소
![sequence_diagram_2column_table](/img/OOAD/sequence_diagram_2column_table.webp)

> Lifeline은 객체가 존재하는 흐름을 나타내고, Execution Occurrence는 객체가 작업을 수행하는 구간을 나타낸다. 둘은 같은 개념이 아니다.

### 메시지의 종류
| 메시지 | 의미 |
| :--- | :--- |
| Synchronous Message | 동기 호출. 일반적으로 호출한 쪽이 작업 완료를 기다림 |
| Asynchronous Message | 비동기 호출. 호출한 쪽이 완료를 기다리지 않고 진행할 수 있음 |
| Return Message | 결과나 반환값을 전달 |
| Self Message | 객체가 자기 자신의 작업을 호출 |
| Create Message | 새로운 객체를 생성하는 메시지 |
| Delete Message | 객체의 생명주기를 종료시키는 메시지 |

### Combined Fragment
시퀀스 다이어그램에서는 단순한 메시지 순서뿐 아니라 조건문, 반복문, 병렬 실행도 표현할 수 있다.

![sequence-diagram-frame](/img/OOAD/sequence-diagram-frame.webp)

| 키워드 | 의미 | 프로그래밍 개념 |
| :--- | :--- | :--- |
| `alt` | 여러 조건에 따른 대안적 실행 | `if-else` |
| `opt` | 조건이 참일 때만 실행 | `if` |
| `loop` | 정해진 조건이나 횟수만큼 반복 | `for`, `while` |
| `par` | 여러 상호작용의 병렬 실행 | 병렬 처리 |
| `ref` | 다른 시퀀스 다이어그램 참조 | 별도 상호작용 재사용 |

> `loop(1,5)`는 최소 1회부터 최대 5회까지 반복할 수 있다는 의미다. `ref`는 다른 다이어그램에 정의된 상호작용을 참조하므로 복잡한 다이어그램을 분리하는 데 사용할 수 있다.

### Sequence Diagram - Example
![sequence-CD-Selection-Company](/img/OOAD/sequence-CD-Selection-Company.webp)


## State Machine Diagram
State Machine Diagram은 하나의 객체가 생명주기 동안 어떤 상태를 거치며, 어떤 이벤트와 조건에 의해 다른 상태로 전이되는지 표현하는 동적 다이어그램이다.

강의에선 두 가지 State Machine을 소대한다.
* **Behavioral State Machine:** 객체의 상태 변화 및 이에 따른 동작 표현
* **Protocol State Machine:** 특정 상태에서 허용되는 연산과 호출 순서 표현

> Behavioral State Machine은 모든 객체에 작성하는 것이 아니라, 생명주기가 복잡한 객체를 대상으로 작성하는 것이 기본이다.

### 구성 요소


![state-machine-symbol](/img/OOAD/state-machine-symbol.webp)

> State는 단순한 변수값만을 의미하지 않는다. 강의에서는 특정 시점의 객체 속성값과 다른 객체와의 관계를 통해 상태를 정의한다.

### Transition 표현
상태 전이는 일반적으로 다음 형식으로 표현한다.

![state-machine-transition](/img/OOAD/state-machine-transition.svg)

* `Event`: 전이를 발생시키는 사건
* `Condition`: 전이 가능 여부를 결정하는 조건
* `Effect`: 전이가 발생할 때 실행되는 작업

예를 들어 `submit [valid] / saveOrder()`는 submit 이벤트가 발생했을 때 valid 조건이 참이어야 상태가 전이되고, 그 과정에서 saveOrder 작업을 수행한다는 의미다.

### Event, Action, Activity 구분
| 개념 | 의미 | 특징 |
| :--- | :--- | :--- |
| Event | 특정 시점에 발생하는 사건 | 상태 전이를 유발할 수 있음 |
| Action | 원자적인 작업 | 실행 중 중단할 수 없는 단위로 모델링 |
| Activity | 여러 단계로 이루어진 작업 | 실행 도중 중단 가능 |


그리고 상태 내부에서는 특별한 키워드를 사용한다.

| 키워드 | 의미 |
| :--- | :--- |
| `entry /` | 상태에 진입할 때 실행 |
| `exit /` | 상태에서 빠져나갈 때 실행 |
| `do /` | 해당 상태에 있는 동안 수행 |
| `after()` | 지정한 시간이 경과한 후 이벤트 발생 |
| `at()` | 지정한 시점에 이벤트 발생 |
| `when()` | 지정한 조건이 참이 되었을 때 이벤트 발생 |

Login 예제에선 다음처럼 표현한다.

```text
+-----------------------------------+
|               Login               |
+-----------------------------------+
| entry / type 'login'              |
| exit / clear password             |
| do / get username                 |
| do / get password                 |
+-----------------------------------+
| submit / login(userID, passwd)    |
| help / display help               |
+-----------------------------------+
```

### State Machine Diagram - Example
![state-CD-Selection-Company](/img/OOAD/state-CD-Selection-Company.webp)


## Summary and Discussion
#### Sequence Diagram과 Behavioral State Machine의 차이
두 다이어그램 모두 시스템의 동적인 행동을 표현하지만, 관찰하는 대상과 목적이 다르다.

| 구분 | Sequence Diagram | Behavioral State Machine |
| :--- | :--- | :--- |
| 핵심 목적 | 객체 간 상호작용 표현 | 객체의 상태 변화 표현 |
| 중심 대상 | 여러 객체 | 주로 하나의 객체 |
| 표현 내용 | 메시지의 전달 순서 | 상태와 상태 간 전이 |
| 시간 개념 | 위에서 아래로 진행 | 객체의 생명주기에 따라 변화 |
| 주요 구성 요소 | Object, Lifeline, Message | State, Event, Transition |
| 조건 표현 | Guard, Combined Fragment | Guard Condition |
| 분석 기준 | Use Case 및 시나리오 | Class 및 객체의 생명주기 |
| 핵심 질문 | 객체들이 어떻게 협력하는가? | 객체가 어떤 사건에 의해 변화하는가? |

#### 어떤 애플리케이션에서 두 다이어그램이 모두 필요한가?
강의에서는 Behavioral State Machine을 모든 객체에 작성하는 것이 아니라, 생명주기가 복잡한 객체에 대해서만 작성하도록 권장한다.

따라서 여러 객체 사이에 복잡한 상호작용이 발생하면서 동시에 상태 변화도 중요한 시스템이라면 두 다이어그램 모두 유용하다.

#### 두 다이어그램이 모두 필요하지 않은 애플리케이션도 있을까?
사용자가 숫자를 입력하면 시스템이 연산을 수행하고 결과를 반환한다. 이때 객체 간 상호작용이 매우 단순하다면 Sequence Diagram 없이도 구현 과정을 이해할 수 있다.