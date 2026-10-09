---
title: "마이크로 프로세서의 이해 - Assembler (1)"
description: "어셈블러 기본기"
date: "2026-10-09"
keywords: "Assembler, KNU"
---

## Register와 CCR

수업에서 소개하는 TOY Processor에선, 32비트 정수를 처리하며, R0부터 R6까지 7개의 범용 레지스터를 가진다. R7는 Program Counter 로 사용한다.

추가적으로 연산 결과에 관한 조건 정보를 저장하기 위한 CCR(Condition Code Register)가 존재한다.

R7는 다음에 실행할 명령어의 메모리 주소를 저장하는 레지스터다. 일반적으로 명령어를 읽으면 PC가 1 증가하며, 분기 명령어를 실행하면 PC가 다른 주소로 변경된다.

CCR은 TOY에서 N과 Z, 두 비트로 구성된다.

* **N:** 가장 최근데 CCR을 갱신한 연산의 32비트 결과가 음수이면 1, 아니면 0
* **Z:** 가장 최근 결과가 0이면 1, 아니면 0

> 실제 프로세서에선 Carry와 Overflow도 사용되지만 단순화 하기 위해 TOY에선 제거함

> 모든 명령어가 CCR을 갱신하지 않는다

## 명령어와 데이터

메모리에는 명령어와 데이터 모두 비트 형태로 저장된다. 그리고 메모리의 비트만 보고 이게 명령어인지 데이터인지 구분할 수 없다.

프로세서는 그저 PC가 가리키는 메모리 주소에서 비트정보를 읽고 IR(Instruction Register)에 저장한 뒤, 명령어를 해독한다. 이 과정에서 PC는 1 증가하며, 해독한 명령어에 따라 연산이나 메모리 접근 등의 작업을 수행한다.

반면 `LOAD`와 같은 명령어를 통해 읽어 온 비트 정보는 명령어가 아니라 데이터로서 처리된다. 결국 메모리의 비트정보를 어떤 목적으로 읽고 해석하는지는 개발자가 지정하는 것이다.

```text
1. Fetch
PC가 가리키는 메모리에서 명령어를 읽어 IR에 저장
↓
2. Decode
명령어를 해독하고 PC ← PC + 1
↓
3. Execute
해독된 명령어에 따라 연산이나 메모리 접근 수행
```

## ASM 문법
```asm
loop:
  LOAD R1, 0x4000
  SUB R1, R1, 10
  BR p, loop
  STORE R1, x

x:
  .BLOCK 1
```

TOY asm은 명령어(Instruction), 피연산자(Operand), 레이블(Label), 지시어(Directive) 등으로 구성된다.

### Label
Label은 메모리 주소에 이름을 부여하는 방법이다. 명령어 앞에 사용하면 분기할 실행 위치를 나타내고, 데이터 앞에 사용하면 변수처럼 메모리 위치를 참조할 수 있다.

`loop:`, `x:` 형식으로 작성한다.

### Operand
`R1, 0x4000`, `R1, R1, 10`, `p, loop`, `R1, x`처럼 구성된다. 기본적으로 아래 표기 규칙을 따른다.

| Operand | 표기 | 의미 |
| ------- | ---- | --- |
| 레지스터 | R0, R1, ..., R7, PC | 특정 레지스터 (PC는 R7과 동일) |
| 수치 | 3, -25, 0x54 | 직접 지정된 정수 (10진수, 16진수) |
| ASCII | 'A', 'a', '3', '#' | ASCII 코드 |
| 주소 | 3000, 0x40A0 | 메모리 상의 주소로서 음이 아닌 수 (10진수, 16진수) |
| 라벨 | x, sum, _next, L2 | 프로그램에 지정된 라벨 위치 |

### Directive
어셈블링 과정에서 필요한 정보를 제공하기 위한 내용으로, 구별하기 쉽도록 `.`로 시작하는 명칭을 사용한다.

**프로세서가 실행하는 명령어가 아니다.**

| 지시어 | 사용 예 | 의미 |
| ----- | ------ | ---- |
| `.ORIGIN addr` | `.ORIGIN 0x2000` | 프로그램을 0x2000번지부터 시작 |
| `.FILL value` | `.FILL 2`, `.FILL 'a'` | 현재 주소에 1개의 32비트 메모리 영역을 확보하고 값을 설정 |
| `.BLOCK n` | `.BLOCK 5` |현재의 주소부터 5개의 32비트 멤모리 영역 확보 |
| `.STRING "str"` | `.STRING "yes"` | 현재의 주소부터 4개의 32비트 메모리 영역을 확보하고 yes 및 null의 ASCII코드 저장

`.FILL L1` 처럼 값을 레이블 L1에 해당하는 주소로 설정할 수 있다.


## TOY Processor의 명령어 집합

| 이름 | 어셈블리언어 표현 | 의미 | CCR 갱신 여부 |
| --- | --------------- | --- | ------------ |
| ADD | `ADD Rd, Rs, Rs2` | Rd ← Rs + Rs2 | O |
| Subtract | `SUB Rd, Rs, Rs2` | Rd ← Rs - Rs2 | O |
| Compare | `CMP Rs, Rs2` | Rs - Rs2 | O |
| And | `AND Rd, Rs, Rs2` | Rd ← Rs AND Rs2 | O |
| Or | `OR Rd, Rs, Rs2` | Rd ← Rs OR Rs2 | O |
| Exclusive Or | `XOR Rd, Rs, Rs2` | Rd ← Rs XOR Rs2 | O |
| Not | `NOT Rd, Rs` | Rd ← NOT Rs | O |
| Copy | `COPY Rd, Rs2` | Rd ← Rs2 | O |
| Load | `LOAD Rd, addr` | Rd ← 메모리 addr 번지의 내용 | X |
| Store | `STORE Rs, addr` | Rs → 메모리[addr] | X |

> Rd, Rs: R0부터 R6까지의 레지스터를 지정

> Rs2: R0부터 R6까지의 레지스터나 16비트로 표현이 가능한 정수

> Load와 Store는 Memory에 관해 Read/Write 작업

## SWI (Software Interrupt)
OS의 기능을 호출하는 명령어다. 키보드 입력이나 화면 출력같은 경우가 대표적

| 명령어 | 기능 |
| ----- | --- |
| `SWI 0` | 키보드에서 문자 하나를 읽어 R0에 저장 |
| `SWI 1` | R0에 저장된 문자를 화면에 출력 |
| `SWI 2` | 문자열 입력 |
| `SWI 3` | 문자열 출력 |
| `SWI 4` | 키보드 에코 모드 설정 |
| `SWI 255` | 프로그램 종료 |

> 해당 번호들은 TOY의 가상 OS가 정의한거일 뿐 실제론 OS마다, 버전마다 다르다.


## BR (Branch)
이전 연산 결과에 따라 실행 위치를 변경해야 하는 경우 사용할 수 있다. `if` 와 `while`등을 구현할때 자주 사용된다.

`BR nzp, addr` 식으로 사용되며, **가장 최근에 갱신된 CCR을 이용**한다.
* n: 음수일때
* z: 0일때
* p: 양수일때

하나만 사용할 수도 있고 `nzp`처럼 전부 사용할 수도 있는데 이렇게 3개 모두 사용할 경우 무조건 분기에 해당한다.

```asm
  CMP R1, 10
  BR p, greater

  ; x <= 10인 경우
  BR nzp, end

greater:
  ; x > 10인 경우

end:
```

## 비트간의 논리 연산
* R1: `11000 ... 00011`
* R2: `01010 ... 00101`

| 연산 | Result | N | Z |
| --- | ------- | - | - |
| R1 AND R2 | `01000 ... 00001` | 0 | 0 |
| R1 OR R2 | `11010 ... 00111` | 1 | 0 |
| R1 XOR R2 | `10010 ... 00110` | 1 | 0 |
| R1 NOT | `00111 ... 11100` | 0 | 0 |

### AND를 통한 Bit clear
| R0 AND 1 | `00000 ... 00001` | 0 | 0 |
| -------- | ------------------ | - | - |

`AND 1` 연산을 하면 최하위 비트만 남기고 나머지를 모두 0으로 만들 수 있다.
* R0가 홀수면 R2=1, Z=0
* R0가 짝수면 R2=0, Z=1

> `AND`은 홀짝 검사하는 연산으로 활용 가능

### OR를 통한 Bit Set
ASCII에서는 영문 대문자와 소문자가 정확히 0x20(32)만큼 차이나도록 배치되어 있다. 우연이 아니고 구조적인 특징인데, 그래서 논리연산을 통해 대소문자를 변경할 수있다.

| 문자 | ASCII | 2bit |
| --- | ----- | ---- |
| A | `0x41` | `0100 0001` |
| a | `0x61` | `0110 0001` |

**대문자 → 소문자**
```asm
OR R2, R0, 32
```

**소문자 → 대문자**
```asm
AND R2, R0, -33
```

## Example

### C언어에서의 변수

```c
int x = 7, y;
y = x + 3;
```

```asm
.ORIGIN 0x2000
  LOAD R1, x
  ADD R1, R1, 3
  STORE R1, y
  SWI 255

x: .FILL 7
y: .BLOCK 1
```

> `.ORIGIN`은 어셈블러 지시어로서 프로그램의 시작 주소를 지정한다. 예를 들어 `.ORIGIN 0x2000`이면 `0x2000: LOAD R1, x`, `0x2001: ADD R1, R1, 3`처럼 명령어가 배치된다. 실제 프로그램의 메모리 적재와 실행은 OS가 담당한다.


### 홀수 분류하기

```c
int x = 5, odd;
if (x % 2 == 1) {
  odd = 1;
}
else {
  odd = 0;
}
```

```asm
.ORIGIN 0x2000
  LOAD R1, x
  AND R2, R1, 1

  BR z, else

  COPY R3. 1
  STORE R3. odd
  SWI 255

else:
  COPY R3, 0
  STORE R3, odd
  SWI 255

x:
  .FILL 5

odd:
  .BLOCK 1
```

### 1부터 10까지 더하기
```asm
.ORIGIN 0x2000
  LOAD R1, x
  LOAD R2, sum

loop:
  CMP R1, 10
  BR p, done

  ADD R2, R2, R1
  ADD R1, R1, 1
  BR nzp, loop

done:
  STORE R2, sum
  STORE R1, x
  SWI 255

x: .FILL 1
sum: .FILL 0
```

### 369 게임
```asm
.ORIGIN 0x2000

loop:
	SWI 0
	CMP R0, '3'
	BR z, match
	CMP R0, '6'
	BR z, match
 	CMP R0, '9'
	BR np, print

match:
	COPY R0, '*'

print:
	SWI 1
	BR nzp, loop
```
