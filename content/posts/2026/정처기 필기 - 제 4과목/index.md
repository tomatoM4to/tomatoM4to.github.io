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