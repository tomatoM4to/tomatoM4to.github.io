---
title: "컴퓨터 개론 - Middle Test"
description: "202601 컴퓨터 개론, 중간고사 대비 정리"
date: "2026-04-21"
keywords: "KNU"
---
## 1. 디지털 혁명
AI (Artificial Intelligence)

Meta universe

폰 노이만 구조(프로그램 내장 컴퓨터) : CPU, Memory, I/O Device

아날로그 와 디지털 : 아날로그는 연속적인 값을 표현하는 방식, 디지털은 이산적인 값을 표현하는 방식

아날로그를 디지털로 변환하는 과정 : 샘플링 (Sampling) 과 양자화 (Quantization)

bit : binary digit 의 줄임말, 0 과 1 두 가지 상태를 표현하는 가장 작은 단위

## 2. 기반 지식

### IC
집적 회로 (IC) 가 개발된 후 부터 컴퓨터는 급속도로 발전됨

### 진수 변환

**2진수 -> 10진수**
```bash
101010
=
(1 * 2^5) + (0 * 2^4) + (1 * 2^3) + (0 * 2^2) + (1 * 2^1) + (0 * 2^0) = 42
```

**10진수 -> 2진수**
```bash
42 / 2 = 21, 나머지 0
21 / 2 = 10, 나머지 1
10 / 2 = 5, 나머지 0
5 / 2 = 2, 나머지 1
2 / 2 = 1, 나머지 0
1 / 2 = 0, 나머지 1

따라서 42의 2진수 표현은 나머지를 역순으로 읽어서 `101010` 이 된다.

13 / 2 = 6, 나머지 1
6 / 2 = 3, 나머지 0
3 / 2 = 1, 나머지 1
1 / 2 = 0, 나머지 1

따라서 13의 2진수 표현은 나머지를 역순으로 읽어서 `1101` 이 된다.
```

**2진수 -> 8진수**
```bash
`1101` -- 오른쪽 끝에서부터 3자리씩 묶기 --> `001 101` -> `1 5` -> `15`
```

**2진수 -> 16진수**
```bash
`11010` -- 오른쪽 끝에서부터 4자리씩 묶기 --> `0001 1010` -> `1 A` -> `1A`
```

**N진수 -> 2진수**
```bash
8 to 2: `15` -> `1 5` -> `001 101` -> `1101`

16 to 2: `1A` -> `1 A` -> `0001 1010` -> `11010`
```

### 2진수의 보수를 이용한 덧셈 변환
```bash
1010 - 0111

1. 0111 의 1의 보수 : 1000
2. 1000 + 1 = 1001 (2의 보수) [해당 과정에서 자릿수가 넘어가면 버림]

1010 + 1001 = 10011

초과된 1은 버리고, 결과는 `0011` 이 된다.
```

### Gate

![Gate](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj69-AzLL5eb_3eEvD0VupGunCwBHkDiYwwCNs-3BqD6UfR1h3iAqsHQxGNdj4xd0sX7WjILQf4AJ34p-VDPGBideW1XWr2lUdjjvvW1i_7SgcgwGiw6zIkREx47Q-Hm8-Di8gUMorpuykJdqLCMpaPz7LOp3qUkDpnAL06RPksXt7ZVgmdMN6imIvoHA/s1952/Basic%20Logic%20Gates%20with%20Truth%20Table.png)

[Image Source](https://www.etechnog.com/2023/04/different-types-of-logic-gates-with.html)

### ASCII Code
* 7-bit ASCII : 128개의 문자 표현 가능 (0~127)
* 8번째 비트에 추가하는 1비트 정보를 통해 에러를 검출 함 (Parity Bit)
  * 짝수 패리티: 데이터 비트 중 1의 개수가 짝수면 패리티 비트를 1
  * 홀수 패리티: 데이터 비트 중 1의 개수가 홀수면 패리티 비트를 1
  * 수신 측에서 **패리티 비트를 포함한 전체 비트의 1의 개수**를 세어 패리티가 맞는지 검증, 다르면 오류가 발생한 것으로 판단

### Unicode
아스키 코드의 용량 부족 문제를 해결하고, 전세계의 모든 언어와 기호를 하나의 통일된 체계로 다루기 위해 만든 국제 표준

UTF-8 기준 가변 길이 인코딩 방식을 사용하여 기본 알파벳과 숫자는 아스키코드와 완전히 동일하게 1바이트로 정하고, 한글 같은 복잡한 문자는 3바이트로 저장

## 3. Computer Structure

![Computer Structure](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FIlffB%2FbtrBkD2psQv%2FAAAAAAAAAAAAAAAAAAAAAHA6QvG7PcKj_jtdpOt2eFwRIWiRF6jqS8ghsgL24okE%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1777561199%26allow_ip%3D%26allow_referer%3D%26signature%3DxxILG6tdlsufwf0a4qXxqKa2ar4%253D)

[Image Source](https://yunamom.tistory.com/253)

### 중앙처리 장치(CPU)
개인용 컴퓨터 에서는 **마이크로프로세서** 라고도 부름

1. **연산 장치(ALU):** 데이터를 처리하고 계산, **사칙연산**을 하는 산술연산 과 참/거짓을 판별하는 **논리연산(AND, OR, NOT 등)** 을 수행
2. **제어 장치(Control Unit):** 프로그램의 명령어를 **Decode**, ALU 와 메모리, 입출력 장치 등에 **제어 신호를 보냄**
3. **Register:** CPU 내부에서 실행의 중간 결과나 적은 양의 자료를 임시 보관하는 아주 빠른 임시 기억 장치, Flip-Flop 이라는 회로로 구성되어 있음

> Computer 의 각 장치는 Bus 라고 불리는 실제 물리적 선으로 연결되어 있음

### 프로그램 제어
1. fetch : PC 가 Main Memory 에서 명령어를 가져오는 과정
2. decode : 가져온 명령어를 디코더가 분석하고 각 장치에 제어 신호를 발생
3. execute : 해독된 결과를 수행
4. write : 최종 결과를 레지스터나 Main Memory 에 저장
5. 다시 fetch 단계로 돌아가서 다음 명령어를 가져오는 과정 반복

### Interrupt
프로그램의 실행 도중 OS 나 System 에 의해 실행 중인 프로그램이 잠시 중단된 후 특정한 작업을 수행하는것

I/O 인터럽트, System 인터럽트 등이 존재


### CPU 설계 방식
* CISC(Complex Instruction Set Computer)
  * 명령어의 수가 많음
  * x86 계열의 CPU 가 대표적
* RISC(Reduced Instruction Set Computer)
  * 연산 속도를 극대화 하기 위해 자주 쓰는 명령어 위주로 제어 논리를 단순화 시킨 방식
  * CISC 에 비해 가격이 저렴하고, 전력 소모가 적음
  * ARM 계열의 CPU 가 대표적 (Advanced RISC Machine)

### System Software
User 가 복잡한 하드웨어를 모르고서도 사용할 수 있도록 도와주는 프로그램

* **운영체제(OS)**: 컴퓨터의 전체적인 동작을 통제하고 관리, Windows, macOS, Linux 등이 대표적
* **Compiler**, **Assembler**, **Interpreter** 등 언어 번역 프로그램
* **Utility**: 사용자가 컴퓨터를 더 편리하게 관리할 수 있도록 도와주는 보조 프로그램, **디스크 관련 유틸리티**, **파일 압축 유틸리티**, **정렬/조합/편집 프로그램**

### Device Driver
장치 구동기라 불리며, Hardware 와 OS 중간에 위치하여 OS 가 하드웨어 장치를 제어할 수 있도록 도와주는 프로그램

### Firmware
ROM 에 저장된 프로그램으로, 비휘발성, 변경 불가 등의 특징으로 특수한 영역에 많이 사용됨

> **특수한 영역**
>
> 부팅을 담당하는 BIOS/UEFT, 세탁기 등 가전의 마이크로 컨트롤러를 제어하는 임베디드 펌웨어, 서브 시스템(그래픽 카드, 네트워크 장비 등) 을 제어하는 펌웨어 등

### Register 의 종류
* Program Counter (PC) : 다음에 실행할 명령어의 주소를 저장
* Instruction Decoder (명령어 해독기) : 명령어를 해석하여 제어 신호를 발생
* General Purpose Register (범용 레지스터) : 연산에 필요한 데이터를 임시로 저장하는 레지스터, ALU 와의 데이터 교환에 사용

### 기억 장치
1. Register : CPU 내부에 위치
2. Cache (SRAM) : CPU 내부 or Board 에 위치 (요즘은 대부분 CPU 내부에 위치)
3. Main Memory (DRAM, ROM) : CPU 외부에 위치
4. Secondary Storage (HDD, SSD) : CPU 외부에 위치

### DRAM vs ROM
* **DRAM(Dynamic Random Access Memory):** 휘발성 메모리, 전원이 꺼지면 데이터가 사라짐, 주로 컴퓨터의 주 기억 장치로 사용
* **ROM(Read-Only Memory):** 비휘발성 메모리, 전원이 꺼져도 데이터가 유지됨, 주로 컴퓨터의 부팅 과정에서 필요한 펌웨어나 시스템 설정 정보를 저장하는 데 사용

### SRAM
Static Random Access Memory, DRAM 보다 빠르지만, 집적도가 낮아 비싸고 대용량화 어려움, 휘발성이며 CPU 의 Cache 메모리로 주로 사용됨

### VRAM
VGA 카드와 같은 비디오 회로에 사용하기 위해 설계된 칩

기록하는 핀과 읽는 핀이 따로 구분되어 있음, Read/Write 가 동시에 가능

주기억 장치보단, 그래픽 전용의 보조 기억 장치에 더 가까움

### HBM
High Bandwidth Memory, DRAM 을 수직으로 쌓아 올려 데이터 처리 속도와 용량을 높인 고성능 메로리

## 4. Software
* Software
* Hardware
* Program

소프트웨어는 다시

1. System Software
2. Application Software

## 5. Operating System
**Main Memory 에 상주**하면서 컴퓨터의 효율적인 운영을 담당하는 System Software

목표
1. 하드웨어와 소프트웨어 자원들을 관리
2. 사용자에게 편리한 인터페이스 제공
3. 수행중인 프로그램들의 효율적인 운영을 도움
4. 작업 처리 과정 중 데이터를 공유
5. 입출력에서 보조적인 기능을 수행
6. 오류 발생 시 오류를 원할하게 처리함

운영체제의 자원 관리
1. process : process 의 생성과 삭제, 중지와 재개 등을 관리
2. job 관리
3. Main Memory 관리
4. 보조 기억 장치 관리
5. 입출력 장치 관리
6. 파일 관리
7. 보안 관리

### Process
* Processor : 처리를 수행하는 하드웨어
* Program : 보조기억 장치 에 저장된 정적인 상태의 코드나 명령어의 집합
* Process : 실행 중인 프로그램, Main Memory 에 저장되고 PCB 블럭과 결합된 형태

### Kernel
* OS 의 핵심적인 부분을 모아놓은 부분
* 메모리 관리, 스케줄링, 인터럽트 처리 등의 기능을 담당
* User 는 커널의 기능을 제어할 수 없음
* 항상 메모리에 적재되어 있음

### Memory Management
주기억장치와 보조기억장치 정보 교환

Allocation 과 빈공간 추적

> 프로그램의 참조 지역성 : 인접한 영역을 주로 접근하는 경향, Cache 에 주변 영역을 함께 Copy 함

### Multi Processing
멀티코어

### Multi Programming
여러개의 Process

### Time Sharing System
CPU 의 운영 시간을 쪼개어 여러 사용자에게 나눠주는 시스템

### Real-time System
정해진 짧은 시간 내에 응답하는 시스템 방식
* Hard real-time system : 반드시 정해진 시간 내에 응답해야 하는 시스템, e.g. 원자로 제어, 항공기 제어
* Soft real-time system : 정해진 시간 내에 응답하는 것이 바람직하지만, 반드시 지켜야 하는 것은 아닌 시스템, e.g. 온라인 게임, 동영상 스트리밍

### Distributed System
여러 컴퓨터들의 업무를 지리적 또는 기능적으로 분산 시켜 처리

### Fault-tolerant System (결함 허용 시스템)
에러 발생 시에도 시스템이 계속해서 정상적으로 동작할 수 있도록 설계된 시스템

자원의 다중화 (여러 서버), OS

### I/O System (Interrupt)
System 이 예상치 못한 상황이 발생하였을 때 CPU 가 현재 작업을 잠시 멈추고, 그 상황에 대응하는 작업을 수행하는 시스템

ISR : Interrupt Service Routine, 인터럽트가 발생했을 때 실행되는 특별한 함수

1. Interrupt 발생
2. Process 실행 중단 및 캡처링
3. Interrupt 원인 파악 (어떤 장치나 어떤 이유 등)
4. ISR 실행 (문제 해결 및 데이터 처리)
5. Process 재개

### Buffering
CPU 와 Main Memory, 입출력 장치 간의 속도 차이를 완화하기 위해 데이터를 임시로 저장하는 메모리 공간

Main Memory 의 일부를 Buffer 로 사용하여 데이터를 일시적으로 저장하고, CPU 가 빠르게 접근할 수 있도록 함
### Spooling
보조기억 장치를 매우 큰 Buffer 로 사용

### UNIX
Dennis Ritchie 가 C 언어로 개발한 운영체제

BSD 계열과 System V 계열로 나뉨

대기업 서버, 통신용 서버 등에서 많이 사용 (신뢰성)

### Embedded System
냉장고, 세탁기, 스마트폰 등에 적용되는 특수 목적의 시스템

임베디드 리눅스 가 사용되고 대개 펌웨에 가까운 형태

## 6. Network
군목적으로 개발된 ARPANET 이 인터넷의 시초

2020 년은 초연결 사회로, 인터넷이 일상 생활의 필수적인 부분이 됨

> Protocol - 통신과 관련된 규칙, 메시지 종류의 형식, 메시지 교환 절차, 흐름 제어, 에러 제어 등을 정의

### 단방향 통신

한쪽 방향으로만 데이터를 전송, 송신층은 보내기만 하고 수신측은 받기만 함

TV, 라이도, 키보드 등

### 반이중 통신
양방향 통신이 가능하지만, 동시에는 불가능, 한쪽이 끝날때까지 기다려야 함

무전기가 대표적

### 전이중 통신

양방향으로 동시에 데이터를 주고 받을 수 있음, 송신로와 수신로가 각각 독립, 현대 네트워크 표준

전화, 인터넷 통신

### Network Area
* LAN(Local Area Network) : 작은 지역 내에서 컴퓨터들을 연결하는 네트워크, 학교, 회사 등에서 사용
* WLAN(Wireless Local Area Network) : 무선 기술을 이용하여 LAN 을 구축하는 네트워크, Wi-Fi 가 대표적
* MAN(Metropolitan Area Network) : 도시나 대도시 지역을 연결하는 네트워크, 광역 LAN 이라고도 불림
* WAN(Wide Area Network) : 국가, 대륙 같은 넓은 지역을 연결하는 네트워크
