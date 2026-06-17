---
title: "Software Engineering - Refactoring"
description: "202601 소프트웨어 공학 기말고사 대비 Refactoring 파트 정리"
date: "2026-06-17"
keywords: "KNU"
---


## 리팩토링의 정의와 목표
* **리팩토링의 본질**: 외부에서 보이는 기능의 변경이나 추가 없이, 내부 코드 구조를 체계적으로 개선하여 복잡한 코드를 깨끗하고 단순하게 만드는 프로세스
* **안전한 진행**: 리팩토링은 절대 감으로 한번에 고치는게 아니라, Step-byStep 으로 코드를 수정하고, 변경이 일어날 때마다 즉시 자동화 테스트를 실행하여 기능이 망가지지 않았음을 보장해야 함
* **Clean Code**: 리팩토링의 최종 목적지는 다른 개발자가 읽어도 의도가 명확하고, 중복이 없으며, 클래스가 최소화 되어 있고, 모든 테스트를 통과하는 Clean Code를 만드는것

**3대 지표**
* **유지 보수성**: 코드 수정 및 버그 대응을 쉽게 만듬
* **가독성**: 개발자 간의 직관적인 코드 이해를 도움
* **확장성**: 새로운 기능을 유연하게 추가할 수 있는 구조를 확보함

## 기술 부채와 발생 원인
> 리팩토링을 수행하는 가장 궁극적인 목적은 소프트웨어의 기술 부채를 해결하고 방지하기 위함

**주요 부채의 원인들**
* **비즈니스 압박**: 너무 촉박한 일정 때문에 완성도가 떨어지는 기능을 일단 출시하는 경우
* **컴포넌트 간의 강한 결합**: 프로젝트가 독립적인 모듈이 아니라 거대한 단일체처럼 엉켜 있어, 한 곳을 고치면 다른 곳들이 줄줄이 깨짐
* **테스트 및 문서화 부족**: 사전 검증 없이 프로덕션에 배포되거나, 문서가 없어 팀원이 바뀌었을 때 프로젝트 이해도를 떨어뜨림
* **지연된 리팩토링**: 리팩토링을 제때 하지 않고 미룰수록 나중에 작업할 코드가 기하급수적으로 증가

## Code Smell
> 프로그램이 당장 Error 를 내지는 않지만, 내부 구조에 심각한 문제가 있음을 암시하는 증상들

### Bloaters
> 코드가 시간이 흐르면서 ㅔ어가 힘들 정도로 비대해진 상태
* **Long Method**: 메서드가 너무 길어짐, 코드 내에 주석을 달고 싶어 질때가 바로 해당 주석을 뜯어 새로운 sub-method 로 분리해야 한다는 신호
* **Large Class**: 하나의 클래스가 너무 많은 책임과 필드를 가지고 있는 상태
* **Long Parameter List**: 메서드의 매개변수가 3~4개를 넘어가 가독성이 떨어지고 매핑 실수를 유발하는 상태
* **Data Clumps**: 항상 같이 몰려다니는 변수 묶음

```java
// Long Method
public class ReportGenerator {
    public void generateReport(User user) {
        // Section 1 - User Validation
        if (user == null || !user.isValid()) {
            throw new IllegalArgumentException("Invalid user");
        }
        // Section 2 - Report Header
        String report = "";
        report += "Report for user: " + user.getName();
        report += "\n" + "===================";
        // Section 3 - Report Body
        report += "\n" + "Email: " + user.getEmail();
        report += "\n" + "Age: " + user.getAge();
        // ... more lines of code
        System.out.println(report);
    }
}
```
```java
// Long Parameter List
public void doSomething(
    String name,
    int id,
    String deptCode,
    String regNumber
) {
    ...
}
```
```java
// Data Clump
public class Order {
    private String streetAddress;
    private String city;
    private String state;
    private String postalCode;
}
```

### Object-Orientation Abusers
> 객체지향(OOP)의 핵심 원칙들을 잘못 적용하거나 불완전하게 사용했을 때

* **Switch Statements**: 조건 분기문이 무분별하게 반복되는 상태, OOP 의 다형성을 활용하여 하위 클래스 확장으로 해결해야 함
* **Refused Bequest**: 부모 클래스를 상속받았는데, 부모가 물려준 메서드나 데이터가 자식 클래스에게 전혀 필요가 없어 거부하는 상태, 잘못된 상속 구조의 대표적 증상

```java
// Switch statements
class Animal {
    String type;
    String makeSound() {
        switch (type) {
            case "cat": return "meow";
            case "dog": return "woof";
            default:
                throw new IllegalStateException();
        }
    }
}
```

### Change Preventers
> 소프트웨어를 고치기 어렵게 만드는 주범으로서 하나의 기능을 수정하기 위해 수많은 클래스를 찾아다니며 칼질을 하게 만드는 구조적 결함, 단일 책임 원칙(SRP) 를 위반했을 대 발생

* **Divergent Change(발산적 수정)**: 하나의 클래스가 너무 여러가지 이유로 변경되는 경우, 예를들어 DB 포맷이 바뀌어도 해당 클래스를 고쳐야 하는 경우
* **Shotgun Surgery(산탄총 수술)**: 코드를 고칠 때, 하나의 변경 사항 때문에, 수많은 서로 다른 클래스의 사방을 찔러가며 조금씩 고쳐야 하는 상황

### Dispensables
> 당장 삭제해도 시스템에 아무런 악영향을 주지 않으며, 오히려 없애야 코드가 더 깨끗하고 효율적으로 변하는 요소들
```java
public void howToDoInJava_method2()
{
    System.out.println("how to do");
    boolean x = true;
    if (x) {
        return;
    }
    else {
        return; // dead code
    }
}
```

* **Duplicate Code**: 여러 위치에 중복되어 존재하는 동일한 코드 구조
* **Comments(불필요한 주석)**: 변수명이 엉망이라 구구절절 설명해 놓은 주석들
* **Dead Code**: 절대 실행될 리 없는 무덤 속 코드나 시스템 내부에서 쓰이지 않고 방치된 더미 코드
* **Speculative Generality**: "나중에 언젠가 쓰겠지?" 하고 미리 만들어둔 불필요한 추상 클래스나 범용 인터페이스 구조

### Couplers (과도한 커플링 스멜)
> 클래스 간의 의존성이 너무 강하게 엮여 있거나, 반대로 아무 책임 없이 전달 역할만 대행하는 상태

* **Feature Envy (기능 편애)**: 자기가 속한 클래스의 필드보다, 남의 클래스에 있는 메서드나 데이터에 더 깊은 관심과 제어를 쏟는 메서드의 증상, 이경우 해당 메서드를 아예 상대방 클래스로 옮겨야 함
* **Message Chains**: `obj.getDept().getSubDept().getHOD().getId();` 처럼 꼬리에 꼬리를 물고 기차처럼 길게 객체를 호출하는 형태

### 코드 스멜 자동 탐지 도구
* **Checkstyle**: 룰을 설정하여 코드 스멜을 플래그하고 개선 가이드를 주는 도구
* **SonarQube**: 자바를 포함한 다국어 환경에서 아키텍처 결함과 스멜을 잡아내는 대표 플랫폼
* **PMD**: 미리 정의된 룰셋을 기반으로 소스코드를 정적 분석하여 스멜을 제거하는 분석기


## Refactoring Techniques
* **Extract Method(메서드 추출)**: 긴 메서드 내부에서 논리적으로 묶일 수 있는 코드 블록을 독립된 메서드로 만듬
* **Replace Temp with Query(임시 변수를 질의 함수로 바꾸기)**: 불필요한 임시 변수(`temp`) 를 선언하여 계산 결과를 담아두는 대신, 그 계산 자체를 메서드(`query`)로 빼서 필요할 때마다 호출
* **Move Method**: 어떤 메서드가 자기가 속한 Class 보다 다른 Class 의 데이터를 더 많이 참조하고 있다면, 그 메서드를 데이터가 있는 Class 쪽으로 옮김
* **Extract Class**: 하나의 Class 안에 성격이 다른 필드들이 뭉쳐 있을때(Data Clumps), 이 뭉치들을 떼어내어 아예 새로운 Class 로 분리
* **Replace Magic Number with Symbolic Constant**: 상수를 변수화
* **Replace Conditional with Polymorphism**: `if-else` 나 `switch` 문을 OOP 적으로 풀어냄

## Quiz

1. 리팩토링(Refactoring)의 올바른 정의 및 원칙으로 가장 적절하지 않은 것은?
   - A. 외부에서 관찰 가능한 기능(Functionality)의 변경 없이 내부 구조만 개선한다.
   - B. 버그를 수정하거나 새로운 기능을 추가하는 작업은 리팩토링 과정과 철저히 분리되어야 한다.
   - C. 리팩토링은 한 번에 시스템 전체를 뒤엎는 방식으로 진행하여 구조적 결함을 단번에 해결해야 한다.
   - D. 리팩토링 후에는 기존에 작성된 모든 자동화 테스트가 정상적으로 통과해야 한다.

   **정답: C**

2. 다음 중 소프트웨어 개발에서 '기술 부채(Technical Debt)'를 급격히 증가시키는 원인으로 보기 어려운 것은?
   - A. 비즈니스 일정 압박으로 인한 테스트 코드 작성 생략
   - B. 모듈 간의 결합도(Coupling)를 낮추고 응집도(Cohesion)를 높이는 설계
   - C. 지연된 리팩토링(Delayed Refactoring)
   - D. 시스템 아키텍처에 대한 문서화 부족 및 팀원 간 소통 부재

   **정답: B**

3. 어떤 메서드가 100줄이 넘어갈 정도로 너무 길어져서(Long Method), 개발자가 특정 로직 블록마다 구구절절 주석(Comment)을 달아두었다. 이 코드 스멜을 해결하기 위해 가장 우선적으로 적용해야 할 리팩토링 기법은 무엇인가?
   - A. Extract Method (메서드 추출)
   - B. Move Method (메서드 이동)
   - C. Replace Conditional with Polymorphism (조건문을 다형성으로 바꾸기)
   - D. Replace Magic Number with Symbolic Constant (매직 넘버를 상수로 바꾸기)

   **정답: A**

4. "하나의 기능을 수정하기 위해 시스템 내부의 수많은 클래스 파일을 열어 사방을 조금씩 고쳐야 하는" 구조적 결함을 뜻하는 코드 스멜은 무엇인가?
   - A. Divergent Change (발산적 수정)
   - B. Shotgun Surgery (산탄총 수술)
   - C. Feature Envy (기능 편애)
   - D. Data Clumps (데이터 뭉치)

   **정답: B**

5. obj.getDepartment().getSubDepartment().getManager().getId()와 같이 객체들이 꼬리에 꼬리를 물고 호출되는 구조는 객체지향의 디미터 법칙(Law of Demeter)을 위반한다. 이 코드 스멜의 정확한 명칭은 무엇인가?
   - A. Inappropriate Intimacy (부적절한 친밀함)
   - B. Refused Bequest (유산 거부)
   - C. Speculative Generality (추측성 일반화)
   - D. Message Chains (메시지 체인)

   **정답: D**

6. 다음 중 시스템에 아무런 악영향을 주지 않으므로 과감히 삭제(또는 개선)해야 하는 'Dispensables(불필요한 요소)' 카테고리에 속하지 않는 코드 스멜은?
   - A. Duplicate Code (중복 코드)
   - B. Dead Code (죽은 코드)
   - C. Switch Statements (스위치 문)
   - D. Comments (불필요한 주석)

   **정답: C**

7. Customer 클래스의 calculateFee() 메서드가 자신의 데이터는 거의 사용하지 않고, Rental 클래스의 데이터(대여 일수, 비디오 종류 등)를 집중적으로 가져와서 계산을 수행하고 있다. 이 'Feature Envy(기능 편애)' 스멜을 해결하기 위한 가장 적절한 방법은?
   - A. calculateFee() 메서드를 Rental 클래스로 이동시킨다 (Move Method).
   - B. Customer 클래스와 Rental 클래스를 하나로 합친다 (Inline Class).
   - C. Rental 클래스의 데이터를 모두 Public으로 열어 접근을 쉽게 만든다.
   - D. calculateFee() 내부의 로직을 지우고 주석으로 대체한다.

   **정답: A**

8. 코드 내부에 불필요한 임시 변수(temp)를 선언하여 계산 결과를 담아두는 대신, 그 계산식 자체를 별도의 메서드(query)로 추출하여 필요할 때마다 호출하도록 변경하는 리팩토링 기법은?
   - A. Replace Type Code with Subclasses
   - B. Replace Temp with Query
   - C. Remove Setting Method
   - D. Extract Class

   **정답: B**

9. 비디오 대여 시스템에서 영화의 종류(일반, 신작, 어린이용)에 따라 요금을 다르게 계산하는 거대한 switch-case 문이 발견되었다. 이를 객체지향적으로 해결하기 위해 '조건문을 다형성으로 바꾸기(Replace Conditional with Polymorphism)' 기법을 적용할 때, 구조적 기반이 되는 디자인 패턴은 무엇인가?
   - A. 싱글톤 패턴 (Singleton Pattern)
   - B. 옵저버 패턴 (Observer Pattern)
   - C. 전략 패턴 (Strategy Pattern)
   - D. 데코레이터 패턴 (Decorator Pattern)

   **정답: C**

10. 프로덕션 코드를 작성할 때는 중복을 최소화하는 'DRY(Don't Repeat Yourself)' 원칙이 중요하지만, 테스트 코드를 작성할 때는 약간의 중복을 허용하더라도 위에서 아래로 한눈에 읽히는 명확성을 더 중시한다. 이 테스트 코드 작성 원칙을 뜻하는 약어는 무엇인가?
   - A. KISS (Keep It Simple, Stupid)
   - B. YAGNI (You Aren't Gonna Need It)
   - C. SOLID
   - D. DAMP (Descriptive And Meaningful Phrase)

   **정답: D**