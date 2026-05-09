---
title: "정처기 필기 - 제 4과목"
description: "정보처리기사 벼락치기 특강: 프로그래밍 언어 활용"
date: "2026-05-08"
keywords: "자격증"
---

## Kernel & Shell
* Kernel : OS 의 핵심 시스템, 프로세스 생성/종료, 메모리 할당, 파일 시스템 관리 등 하드웨어 제어
* Shell : 사용자와 시스템 간의 인터페이스
  * 기능: 명령 해석, 스크립트 실행, 사용자 환경 설정 등
  * 명령어: `echo`, `ls`, `cd`, `pwd`, `cat` 등

### Example 1
운영체제에서 커널의 기능이 아닌 것은?

1. 프로세스 생성, 종료
2. 사용자 인터페이스
3. 기억 장치 할당, 회수
4. 파일 시스템 관리

> 2

## Process Management
* Program: Disk에 저장된 실행 가능한 코드
* Process: Main Memory 에 위치하고 PCB를 가진 프로그램
  * OS 는 여러개의 Process 를 관리
  * Process 는 여러개의 Thread 를 가질 수 있음

> PCB: Process Control Block, 프로세스의 상태, 프로그램 카운터, 레지스터, 메모리 할당 정보 등을 포함하는 데이터 구조

* Code: 컴파일된 소스 코드가 저장되는 여역 (Text)
* Data: 전역 변수/정적 변수 저장 영역
* Stack: 함수 호출 시 지역 변수, 매개 변수, 반환 주소 등을 저장하는 영역
* Heap: 동적 메모리 할당 영역

> Thread 는 별도의 Stack을 가짐, Code, Data, Heap은 Thread 간에 공유됨

> Context Switch: CPU가 한 프로세스에서 다른 프로세스로 전환할 때, 현재 프로세스의 상태를 PCB에 저장하고 새로운 프로세스의 PCB에서 상태를 복원하는 과정

### Example 2
프로세스와 관련한 설명으로 틀린 것은?
1. 프로세스가 준비 상태에서 프로세서가 배당되어 실행 상태로 변화하는 것을 디스패치(Dispatch)라고 한다.
2. 프로세스 제어 블록(PCB)은 프로세스 식별자, 프로세스 상태 등의 정보로 구성된다.
3. 이전 프로세스의 상태 레지스터 내용을 보관하고 다른 프로세스의 레지스터를 적재하는 과정을 문맥 교환(Context Switching)이라고 한다.
4. 프로세스는 스레드(Thread) 내에서 실행되는 흐름의 단위이며, 스레드와 달리 주소 공간에 스택이 없다.

> 4

### Process Scheduling
![Process Scheduling](https://media.geeksforgeeks.org/wp-content/uploads/20250920114635603424/seven_state.webp)

[Source](https://www.geeksforgeeks.org/operating-systems/process-schedulers-in-operating-system/)

* 보조 메모리 부분은 제외
* Dispatch 순서는 FIFO, SJF, HRN, RR 이 대표적
* Dispatch 와 Timeout 이 발생할때 Context switching 발생
* **Ready**: CPU 할당 대기
* **Running**: CPU 할당
* **Wait or Block**: 이벤트 발생(I/O)
* **Exit**: 완료
* 해당 상태는 PCB 에 저장 (식별자, 상태 등)

### Scheduling Algorithm
* SJF(Shortest job first): 실행 시간이 가장 짧은 프로세스를 우선 처리
  * 기아 현상 발생 가능
* HRN(Highest Response-ratio Next): 시스템 응답 시간이 큰 순서로 처리, SJF 의 기아 문제를 해결하기 위해 고안
  * `(대기시간 + 실행시간) / 실행 시간 = 시스템 응답 시간`
* FIFO(First in First out) or FCFS(First come First serve): 먼저 도착한 프로세스를 먼저 처리
* RR(Round Robin): 고정된 시간 단위로 프로세스를 순차적으로 처리

> HRN 은 **대실실** 라고 외워보자

* 비선점형(Non-preemptive): 뺏을수 없음, Context Switching 오버헤드가 적음
  * FIFO, SJF, HRN
* 선점형(Preemptive): OS 가 강제로 뺏을수 있음, 할상시간이 끝나는 경우
  * RR, SRT, 다단계 큐(Multilevel Queue)

> SRT 는 CPU 수행 중 더 짧은 남은 시간을 가진 작업이 오면 CPU를 빼앗김

### 교착상태(Deadlock)

**발생조건**
* 상호 배제 (Mutual Exclusion)
  * 세마포어, `P(S)`, `V(S)` 연산을 사용하여 임계 구역(Critical Section) 접근을 제어
  * Peterson 알고리즘, 두 프로세스 간의 상호 배제를 보장하는 알고리즘
  * Dekker 알고리즘, Lamport 알고리즘, 다중 프로세스의 상호 배제를 위한 기법들
* 점유와 대기 (Hold and Wait)
* 비선점 (Non-preemption)
* 환형 대기 (Circular Wait)

**해결 방법**
* 회피(Avoidance): 자원 할당 전 시스템이 안전 상태를 유지하는지 확인 (은행가 알고리즘, 가장 많이 나옴)
* Detection and Recovery: 교착상태 발생하면 감지하고 해결 (실제론 이방식 사용)
* Prevention: 교착 상태의 조건 중 하나를 제거하여 발생 방지 (현실 가능성 없어 시험도 잘 안나옴)

### Example 3
다음과 같은 형태로 임계 구역의 접근을 제어하는 상호배제 기법은?

```
P(S) : while S <= 0 do skip;
S := S - 1;
V(S) : S : S := S + 1;
```

1. Dekker Algorithm
2. Lamport Algorithm
3. Peterson Algorithm
4. Semaphore

> 4

## Page & Segmentation
Process 를 Memory 에 적재하는 2가지 방식

* **Paging**: 프로세스의 메모리를 **고정된 크기**로 나누어 관리하는 방식
* **Segmentation**: 프로세스를 **논리적인 단위**로 구분하여 **가변 크기**로 메모리를 관리하는 방식

### Example 4
다음 설명의 `ㄱ` 과 `ㄴ` 에 들어갈 내용으로 옳은 것은?

> 가상기억장치의 일반적인 구현 방법에는 프로그램을 고정된 크기의 일정한 블록으로 나누는 `ㄱ` 기법과 가변적인 크기의 블록으로 나누는 `ㄴ` 기법이 있다.

> Paging, Segmentation

### 단편화(Fragmentation)

![Memory Fragmentation](/img/os/memory-fragmentation.webp)

* 내부 단편화(Internal Fragmentation): 메모리를 고정된 크기로 나누었을 때, 할당된 공간보다 프로그램 크기가 작아서 공간 내부에 남는 잉여 공간.
* 외부 단편화(External Fragmentation): 메모리를 가변적인 크기로 할당할 때 발생. 전체 남는 공간의 합은 프로그램을 넣기에 충분하지만, 공간들이 흩어져 있어(연속적이지 않아) 새로운 프로그램을 할당하지 못하는 상태.

### 배치 전략
10K 를 새로 배치한다 가정

* First Fit: 위에서부터 차례대로 내려오며 10K를 수용할 수 있는 첫 번째 빈 공간에 배치
* Best Fit: 수용할 수 있는 공간들 중 **가장 작은 공간**을 찾아 배치
  * 외부 단편화가 작게 발생해 쓸모없는 공간 발생
* Worst Fit: 수용할 수 있는 공간들 중 **가장 큰 공간**을 찾아 배치
  * 외부 단편화가 크게 발생해, 다른 Process 가 참여 가능

### 페이지 교체 알고리즘
가상 메모리에서 이어지는 내용

FIFO 와 LRU 가 가장 많이 나옴

* **FIFO**: 가장 먼저 들어온 페이지를 먼저 교체
* **LRU(Least Recently Used)**: 가장 오랫동안 사용되지 않은 페이지를 교체
* **Optimal(OPT)**: 앞으로 가장 오래 사용되지 않을 페이지를 교체
* **LFU(Least Frequently Used)**: 가장 적게 사용된 페이지를 교체

> **Virtual Memory**: 보조기억장치(하드디스크 등)의 일부를 주기억장치처럼 사용하여, 실제 물리 메모리보다 더 큰 프로그램을 실행할 수 있게 해주는 메모리 관리 기법. (프로그램을 여러 개의 페이지나 세그먼트로 나누어 필요한 부분만 메모리에 적재)

### Page Fault
가상 메모리에서 이어지는 내용

> LRU, FIFO 등 페이지 교체 알고리즘에 따라 참조 순서에 따른 페이지 결함 횟수

### Thrashing
> 교환 시간이 프로세스 실행 시간보다 클 때 발생

### Working Set
> 프로세스가 일정 시간 동안 자주 참조하는 페이지들의 집합

### 세그먼트 기법
> 논리 주소는 세그먼트 번호와 오프셋으로 구성

`물리주소` = `시작 주소` + `오프셋`

EX) 세그먼트 2의 시작주소가 222일때, 논리주소 (2, 176)은 물리주소 398에 해당함 (222 + 176)

### 지역성 (Locality)
* **시간 지역성(Temporal Locality)**: 최근에 참조한 데이터를 다시 참조하는 특성
* **공간 지역성(Spatial Locality)**: 인접한 주소를 연속적으로 참조하는 특성

### Example 5
프로세스들 간의 메모리 경쟁으로 인하여 지나치게 페이지 부재가 발생하여 전체 시스템의 성능이 저하되는 현상은?
1. Fragmentation
2. Thrashing
3. Locality
4. Working Set

> 2

### Example 6
프로세스 적재 정책과 관련한 설명으로 틀린 것은?
1. 반복, 스택, 부프로그램은 시간 지역성(Temporal Locality)과 관련이 있다.
2. 공간 지역성(Spatial Locality)은 프로세스가 어떤 페이지를 참조했다면 이후 가상주소 공간상 그 페이지와 인접한 페이지들을 참조할 가능성이 높음을 의미한다.
3. 일반적으로 페이지 교환에 보내는 시간보다 프로세스 수행에 보내는 시간이 더 크면 스래싱(Thrashing)이 발생한다.
4. 스래싱(Thrashing) 현상을 방지하기 위해서는 각 프로세스가 필요로 하는 프레임을 제공할 수 있어야 한다.

> 3