---
title: "Software Engineering - Testing"
description: "202601 소프트웨어 공학 기말고사 대비 Testing 정리"
date: "2026-06-17"
keywords: "KNU, Test"
---

## The Reality of Testing

> pdf: 완벽하게 코드를 짰다고 생각해도, 아주 작은 실수 하나가 거대한 재앙을 불러올 수 있습니다. 64비트 부동소수점을 16비트 정수로 변환하다 발생한 예외 처리 오류로 10억 달러짜리 Ariane 5 로켓이 폭발했고, 단 한 줄의 잘못된 코드로 인해 화성 탐사선(Mars Polar Lander)이 추락했습니다.

* **불완전성**: 모든 경우의 수를 테스트하는 완벽한 테스트(Exhaustive testing)는 불가능
* **파괴적인 활동**: 좋은 테스팅이란건 시스템을 어떻게든 실패하게 만드려는 파괴적인 활동임, 따라서 개발자가 스스로 자신의 코드를 객관적으로 테스트 하기는 매우 어렵다.

## Stages of Development Testing
* **Unit Testing(단위 테스트)**: 객체나 메서드 수준의 아주 작은 코드 단위가 예상대로 동작하는지 확인
* **integration Testing(통합 테스트)**: 프론트엔드와 백엔드처럼 서로 다른 소프트웨어 컴포넌트 간의 인터페이스가 일관되게 연결되는지 확인
* **System Testing**: 운영 환경에서 하드웨어와 소프트웨어가 통합된 전체 시스템을 테스트
* **Regression Testing(회귀 테스트)**: 코드를 수정한 후, 기존에 잘 작동하던 기능에 새로운 결합이 발생하지 않았는지 다시 테스트

## Whitebox Testing
> 내부 데이터 구조와 제어 구조에 대한 지식을 바탕으로 테스팅 수행

### A. Basis Path Testing (기본 경로 테스팅)
> 코드 내의 모든 독립적인 경로를 최소 한번씩은 실행해보는 것을 목표로 함

1. **Flow Graph 그리기**: 코드를 Node(명령어) 와 Edge(흐름) 로 이루어진 그래프로 그림
2. **Cyclomatic Complexity $V(G)$ 계산**: 코드의 논리적 복잡도를 정량화한 지표로, 테스트해야 할 경로의 상한선(Upper bound)을 제시, Node, Edge, 그리고 그래프 내부의 닫힌 영역(Region)의 개수를 통해 계산
3. **Basis Set 도출**: 순환 복잡도를 바탕으로 독립적인 경로들의 집합(Basis set) 을 찾아냄
4. **Test Case 작성**: 이 경로들을 모두 실행하도록 테스트 케이스를  짬

![flow-graph-example](/img/software-engineering/flow-graph-example.webp)

> 소스 코드의 제어 흐름을 시각화하기 위해, 중간에 분기(갈림길)가 없는 순차적인 코드들을 하나의 노드로 병합하여 흐름도(Flow Graph)로 매핑하는 과정, 빨간 번호가 Node 가 됨

![flow-graph-cyclomatic-complexity](/img/software-engineering/flow-graph-cyclomatic-complexity.webp)

> 완성된 흐름도에서 닫힌 영역(Region)들을 찾아내어, 테스트해야 할 독립 경로의 상한선인 순환 복잡도 $V(G)$ 를 계산하는 모습

> $V(G) = \text{Edges} - \text{Nodes} + 2$ 또는 $V(G) = \text{분기 노드(Predicate nodes) 수} + 1$

![flow-graph-independent-paths](/img/software-engineering/flow-graph-independent-paths.webp)

> 계산된 순환 복잡도를 바탕으로, 빠짐없이 테스트해야 하는 각각의 독립적인 실행 경로(Basis Set)들을 선으로 추적해 낸 결과

### B. Condition Testing (조건 테스팅)
> 로직 내의 단순/복합 조건들이 True 일 때와 False 일 때를 모두 검증

* **Branch Testing**: `(A > B) AND (C < D)` 와 같은 조건이 있다면, 전체 조건뿐만 아니라 `A > B` 와 `C < D` 각각의 True/False 분기를 모두 테스트
* **Domain Testing**: 관계 연산자 (`>`, `<`, `=`) 의 오류를 잡기 위해, 두 값이 같을 때, 클 때, 작을 때의 경계값을 테스트
* **MC/DC**: 각 개별 조건이 전체 결과에 독립적으로 어떤 영향을 미치는지 확인하는 매우 엄격한 커버리지 기준

### Loop Testing
> 알고리즘에서 메모리 누수를 잡거나 대량의 데이터를 순회할 때 가장 오류가 많이 나는 반복문을 집중적으로 파고듬

* 반복문을 아예 건너뛸 때(0번), 딱 1번 돌 때, 2번 돌 때, 최대치보다 한 번 덜 돌 때($n-1$), 최대치만큼 돌 때($n$), 최대치를 초과했을 때($n+1$)를 모두 테스트
* 중첩 루프(Nested Loops)의 경우, 가장 안쪽 루프부터 테스트를 시작하여 바깥쪽으로 범위를 넓혀나감

### Data Flow Testing
> 변수가 특정 지점에서 올바른 값을 가지고 있는지 확인

변수가 정의(Definition)되는 위치부터 사용(Use)되는 위치까지의 경로인 DU Chain (Definition-Use Chain)을 추적하여, 변수가 초기화되지 않고 사용되거나 잘못 덮어씌워지는 것을 방지

## Blackbox Testing
> 내부 소스 코드나 로직을 전혀 몰라도, 입력(Input)과 출력(Output)만을 가지고 시스템의 기능과 인터페이스를 검증하는 방식, 개발한 API 엔드포인트에 요청을 보내고 예상한 JSON 응답이 올바르게 돌아오는지 확인하는 과정이라 이해하면 됨

### 동치 분할 (Equivalence Partitioning)
> 입력될 수 있는 값의 범위는 무한하므로, 시스템이 '동일한 방식'으로 처리할 것으로 예상되는 그룹(Subdomain)으로 나눔, 유효한 데이터 그룹과 유효하지 않은 데이터 그룹에서 각각 대표값 하나씩만 뽑아서 테스트하여 효율성을 높임

### 경계값 분석 (Boundary Testing)
> 프로그래밍에서 버그는 보통 범위의 중간보다는 경계(Boundary)에서 발생, 따라서 따라서 최솟값, 최댓값, 그리고 그 경계를 살짝 벗어난 값(바로 위/아래)들을 집중적으로 타격하여 테스트

## Test Pyramid
* **이상적인 구조**: 빠르고 독립적인 Unit Test(80%) 기반으로 Integration Test(15%), 그리고 전체 시스템을 확인하는 E2E 테스트(5%) 로 구성됨
* **Ice Cream Cone Antipattern**: 반대로, 자동화된 Unit Test 는 부족하고 GUI 를 통한 수동 테스트나 무거운 E2E 테스트에만 의존하는 역삼각형 구조, 이는 피드백 루프를 매우 느리게 만들고 유지보수 비용을 급증 시킴

## Test Best Practices
> 프로덕션 코드를 리팩토링할 때마다 테스트가 의미 없이 깨져버리는 '깨지기 쉬운 테스트(Brittle Tests)'는 개발 속도를 늦추고 큰 스트레스를 유발하므로, 파이프라인에서 자동화 테스트가 견고하게 돌아하기 위한 핵심 설계 원칙

* **Public API를 통해 테스트하라**: 내부 구현(Private 메서드)이나 세부 로직을 직접 찌르지 말아라, 내부 구조가 효율적으로 바뀌더라도, 외부로 노출된 Public API의 결과 동작이 같다면 테스트는 통과해야 함
* **상호작용(Interactions)이 아닌 상태(State)를 테스트하라**: 내부적으로 특정 메서드가 몇 번 호출되었는지(과도한 Mocking)를 검증하기보다, 작업이 끝난 후 데이터베이스나 시스템의 최종 상태가 올바르게 변경되었는지를 확인하는 것이 훨씬 안전
* **메서드가 아닌 행동(Behaviors)을 테스트하라**: `testDisplay()`처럼 단순히 메서드 이름에 맞춰 테스트를 짜지 말아라, `display_showsItemName()`처럼 **특정 상황에서 시스템이 어떻게 행동해야 하는지**를 기준으로 테스트를 작성하고 명명해야 함
* **Given-When-Then 구조**: 테스트 코드를 읽기 쉽도록 `준비(Given) - 실행(When) - 검증(Then)` 구조로 블록을 나누어 명확히 작성
* **테스트 코드에 로직(Logic)을 넣지 말 것**: 테스트 코드 안에 `if`문이나 `for`문, 문자열 조립(`+`) 같은 연산 로직이 들어가면, 테스트 코드 자체에 버그가 숨어버림, 눈에 바로 보이는 명시적인 값을 하드코딩해서 대입하는게 좋음
* **DRY보다는 DAMP**: 실제 프로덕션 코드에서는 중복을 제거(DRY: Don't Repeat Yourself)하는 것이 생명이지만, 테스트 코드에서는 약간의 중복이 있더라도 위에서 아래로 한눈에 읽히는 명확성(DAMP: Descriptive And Meaningful Phrase)이 훨씬 더 중요

## Check Exam

1. 소프트웨어 개발 단계별 테스팅 중, 코드를 수정한 후 기존에 잘 작동하던 기능에 새로운 결함(Defect)이 발생하지 않았는지 확인하기 위해 수행하는 테스트는 무엇인가요?
  - 시스템 테스트 (System Testing)
  - 회귀 테스트 (Regression Testing)
  - 통합 테스트 (Integration Testing)
  - 단위 테스트 (Unit Testing)
  > 2

2. 화이트박스 테스팅 기법 중, 변수에 값이 할당(정의, DEF)되는 위치부터 연산이나 조건문에서 사용(USE)되는 위치까지의 경로를 추적하여 변수가 초기화되지 않거나 잘못 덮어씌워지는 오류를 찾는 기법은 무엇인가요?
  - 루프 테스팅 (Loop Testing)
  - 데이터 흐름 테스팅 (Data Flow Testing)
  - 기본 경로 테스팅 (Basis Path Testing)
  - 조건 테스팅 (Condition Testing)
  > 2

3. 블랙박스 테스팅에서 '비밀번호의 길이는 8자 이상, 15자 이하로 설정해야 합니다'라는 요구사항이 주어졌을 때, 경계값 분석(Boundary Testing)을 위해 설정할 입력값 테스트 세트로 가장 이상적인 것은?
  - 7, 9, 14, 16
  - 1, 8, 15, 100
  - 7, 8, 15, 16
  - 8, 11, 15
  > 3

4. 블랙박스 테스팅 기법 중 하나로, 무한한 입력 공간을 시스템이 '동일한 방식'으로 처리할 것으로 예상되는 하위 그룹(Subdomain)으로 나누어 테스트 케이스 개수를 줄이는 기법은?
  - 동치 분할 (Equivalence Partitioning)
  - 경계값 분석 (Boundary Value Analysis)
  - 상태 전이 테스팅 (State Transition Testing)
  - 결정 표 테스팅 (Decision Table Testing)
  > 1

5. 테스트 커버리지 기준 중 가장 엄격한 기준 중 하나로, 각 개별 조건(Condition)이 다른 조건들에 영향을 받지 않고 전체 결과(Decision)에 독립적으로 영향을 미치는지 확인하는 것은?
  - Statement Coverage (구문 커버리지)
  - Decision Coverage (결정 커버리지)
  - MC/DC (Modified Condition/Decision Coverage)
  - Condition Coverage (조건 커버리지)
  > 3

6. 건강하고 유지보수하기 쉬운 '이상적인 테스트 피라미드(Test Pyramid)' 구조에서, 가장 밑바탕에 위치하며 가장 큰 비중(약 80%)을 차지해야 하는 테스트 유형은?
  - 통합 테스트 (Integration Test)
  - 수동 GUI 테스트 (Manual GUI Test)
  - 단위 테스트 (Unit Test)
  - End-to-End (E2E) 테스트
  > 3

7. 다음 중 '깨지기 쉬운 테스트(Brittle Test)'를 방지하고 유지보수성을 높이기 위한 테스트 코드 베스트 프랙티스로 잘못된 것은 무엇인가요?
  - 테스트 코드는 메서드 이름 자체가 아니라, 시스템이 달성해야 하는 특정 행위(Behaviors)를 중심으로   작성해야 한다.
  - 테스트는 내부 상호작용(Interactions)의 횟수보다는 시스템의 최종 상태(State)를 검증해야 한다.
  - 내부 동작의 완벽한 검증을 위해 Private 메서드를 직접 호출하여 모든 세부 로직을 테스트한다.
  - 테스트 코드 내부에는 if, for 등 복잡한 제어 로직을 넣지 않고 직관적으로 작성한다.
  > 3

8. 프로덕션 코드에서는 중복 제거(DRY)가 매우 중요하지만, 테스트 코드에서는 DAMP 원칙을 종종 더 선호합니다. DAMP 원칙이 의미하는 바와 가장 가까운 것은 무엇인가요?
  - 테스트 실행 속도를 높이기 위해 메모리 접근을 최소화한다.
  - 테스트 환경을 항상 무작위(Random)로 설정하여 엣지 케이스를 발견한다.
  - 완벽한 코드 재사용성을 위해 모든 테스트 설정을 하나의 전역 함수로 완전히 묶어둔다.
  - 약간의 코드 중복이 발생하더라도, 각 테스트 메서드가 위에서 아래로 읽힐 때 설명적이고 의미가 명확하도록(Descriptive And Meaningful Phrase) 작성한다.
  > 4

9. 루프 테스팅(Loop Testing)에서 최대 반복 횟수가 $n$ 인 단순 반복문을 검증할 때, 일반적으로 테스트를 권장하는 반복 횟수에 포함되지 않는 것은?
  - A.0회 (루프를 완전히 건너뜀)
  - B.1회 및 2회 (루프를 한두 번만 실행)
  - C.n−1회, n회, n+1회
  - D.가능한 최대 메모리를 소모할 때까지의 무한루프 반복
  > 4