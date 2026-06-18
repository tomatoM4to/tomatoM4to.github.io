---
title: "Data Communications - TCP (1)"
description: "2026년 1학기 데이터 통신 Transport layer - TCP"
date: "2026-06-18"
keywords: "Network, KNU"
---

## TCP
* **Point-to-Point**: 오직 하나의 송신자와 하나의 수신자만 연결됨
* **신뢰성 있는 순차적 바이트 스트림**: 데이터의 경계를 구분하지 않고, 연속된 Byte 의 흐름으로 데이터를 쪼개서 보냄, 순서를 100% 보장
* **전이중 통신(Full duplex data)**: 한 연결에서 양방향으로 동시에 데이터를 주고 받을 수 있음
* **누적 확인 응답(Cumulative ACKs)**: 수신자는 지금까지 이 번호 이전의 Byte는 다 잘 받았으니, 다음엔 이 번호부터 줘 라는 의미의 ACK 을 보냄
* **Flow control**: 수신자의 Buffer가 넘치지 않도록 송신자가 속도를 조절함
* **Connection-oriented**: 데이터 전송 전 반드시 handshaking 을 통해 상태를 초기화 함

## TCP Header
> TCP Header 는 Port 번호 외에도 신뢰성을 위한 여러 Field 가 존재

![TCP Header](http://www.ktword.co.kr/img_data/1889_1.jpg)
[Resource](http://www.ktword.co.kr/test/view/view.php?m_temp1=1889)

* **Sequence Number(순서 번호)**: Segment 데이터의 첫번째 Byte 의 Byte Stream 번호 (패킷 단위가 아님에 주의)
  * 500,000 번째 Byte 부터 1,000 Byte 를 보낸다면 `Seq=500,000` 이 된다.
* **Acknowledgment Number(확인 응답 번호)**: 수신자가 다음으로 받기를 기대하는 Byte Number
  * 위의 예에서 수신자가 1,000Byte 를 무사히 받았다면 다음엔 `ACK=501000` 을 보낸다.
* **Window size(rwnd)**: 흐름 제어를 위한 필드로, 수신자가 내 buffer 공간 이만큼 남았다 라고 알려주는 값

## Sequence Number

![simple-telnet-scenario](/img/network/simple-telnet-scenario.webp)

> 해당 예제는 1byte 기준

> 만약 'Hi' 라는 2byte 였다면, Host B 는 Response 로 `Sec=79, ACK=44` 를 보냈을 것

## RTT 측정과 Timeout
> TCP 는 패킷 유실을 감지하기 위해 Timeout 을 사용함, 인터넷 환경은 매순간 변하므로, RTT를 동적으로 추정

> SampleRTT: 세그먼트 전송부터 ACK 수신까지의 측정 시간, 변동성이 매우 크기 때문에 부드럽게 바꿔야 함

* **EstimatedRTT**: 과거의 측정값과 현재 측정값(SampleRTT)을 가중 평균(EWMA) 내어 부드러운 곡선으로 계산
* **TimeoutInterval**: `EstimatedRTT + 안전 여유분(4 * DevRTT)`으로 설정, 너무 짧으면 불필요한 재전송이 발생하고, 너무 길면 데이터 유실 대응이 늦어짐

$$
EstimatedRTT = (1 - \alpha) \cdot EstimatedRTT + \alpha \cdot SampleRTT
$$

$$
DevRTT = (1 - \beta) \cdot DevRTT + \beta \cdot |SampleRTT - EstimatedRTT|
$$

$$
TimeoutInterval = EstimatedRTT + 4 \cdot DevRTT
$$

## TCP sender (simplified)
> App 에서 데이터를 받거나, 타이머가 만료되거나, ACK 를 받았을 때 송신자가 취하는 3가지 주요 행동

1. App 으로부터 데이터를 받았을때
  - Seq 를 포함하여 Segment 를 생성, Seq 는 데이터의 첫번째 바이트 번호
  - 타이머가 실행중이 아니라면 타이머를 시작
2. 타임아웃 발생 시
  - 타임아웃을 유발한 해당 세그먼트를 재전송
  - 타이머를 다시 시작
3. ACK 수신 시 (ACK Received)
  - 받은 ACK 가 이전에 확인되지 않았던 Segment를 확인해주는 것이라면, 해당 Segment들을 ACK 받음 상태로 업데이트
  - 만약 아직 ACK 를 받지 못한 Segment 가 남아있다면 타이머를 다시 시작

## TCP 수신자의 ACK 생성 규칙 (RFC 5681)
> 수신자는 Packet 을 받을 때마다 무조건 즉시 ACK 를 보내지 않는다.

1. **Delayed ACK**: 순서에 맞게 Packet 이 잘 도착했고, 이전에 밀린 ACK가 없다면 최대 500ms 까지 기다림
2. **즉시 누적 ACK**: 기다리고 있는 중에 다음 Packet이 순서에 맞게 딱 도착하면, 2개를 묶어서 즉시 누적 ACK를 보냄
3. **Duplicate ACK**: 순서가 어긋난 Packet(중간에 유실 발생)이 도착하면, 즉시 자신이 기다리던 원래 번호를 중복해서 ACK 로 보냄
4. **빈 공간이 채워졌을 때**: 기다리던 Packet이 도착해서 Gap이 채워지면, 새로 채워진 곳의 다음 번호로 즉시 ACK 을 보냄


## TCP retransmission scenarios
![TCP retransmission scenarios](/img/network/TCP-retransmission-scenarios.webp)

1. **Lost ACK**: B 가 보낸 ACK 가 유실되면 A는 타임아웃 후 데이터를 재전송
2. **Premature timeout**: A 의 타입아웃 시간이 너무 짧아서 ACK 가 오고 있는 중인데도 못참고 재전송해버린 상황
3. **Cumulative ACK**: B 가 보낸 `ACK=100` 이 중간에 유실되었지만, 그 다음에 보낸 `ACK=120` 이 타입아웃 전에 A 에게 도착함, TCP 의 ACK 는 누적(Cumulative) 이기 때문에, A 는 `ACK=120` 만 보고 B 는 `120` 이전까지 데이터들을 다 받았구나 라고 판단





## Fast Retransmit
> Timeout 주기는 일반적으로 꽤 길기 때문에, 패킷이 유실되었을 때 타임아웃만 하염없이 기다리면 Network 지연이 심해진다. 이를 해결하기 위한 기법이 Fast Retransmit

* **조건**: 송신자가 **동일한 데이터에 대한 3개의 추가 중복 ACK (Triple Duplicate ACKs)** 를 수신했을 때.
* **동작 방식**: 타임아웃 타이머가 만료되기 전이더라도, 3개의 중복 ACK를 받는 즉시 유실된 것으로 파악된 해당 패킷을 즉각 재전송
* **원리 (Why 3 Dup-ACK?)**:
  * 수신자에게 중간에 빵꾸(유실)가 났지만, 그 이후의 패킷 3개가 무사히 도착했기 때문에 수신자가 계속해서 빵꾸난 번호를 요구(중복 ACK)하는 상황
  * 즉, 네트워크가 완전히 마비되거나 끊긴 것이 아니라 단순히 패킷 하나가 가다가 길을 잃었을 확률이 높으므로, 긴 타임아웃을 기다리지 않고 빠르게 다시 보내주는 것이 효율적

TODO: 사진


## Flow Control
> 송신자가 너무 많은 데이터를 한 번에 보내서 수신자 측에서 Buffer overflow 가 발생해 데이터가 유실되는 것을 방지하는 메커니즘 (혼잡제어와 다름을 주의)

![TCP-flow-control](/img/network/TCP-flow-control.webp)

* **RcvBuffer(수신 버퍼)**: 수신 측에 할당된 메모리 공간
* **rwnd(수신 윈도우, Receive Window)**: `RcvBuffer` 안에서 실제로 남아있는 순수 여유 공간(Free buffer space)

**동작 원리**
1. **수신자의 통보**: 수신자는 자신이 보내는 모든 TCP Segment Header 의 `Window Size` 필드에 현재 자신의 Buffer 빈 공간 크기를 담아서 송신자에게 계속 알려줌
2. **송신자의 억제**: 송신자는 아직 확인응답(ACK)을 받지 못한 데이터, 즉 인플라이트(In-flight) 데이터의 총량이 수신자가 알려준 rwnd를 절대 넘지 않도록 전송량을 제한

> 수학적으론 `(LastByteSent - LastByteAcked) <= rwnd` 를 철처하게 지킴

> 이를 통해 수신 Buffer 는 Overflow 가 나지 않음을 보장받을 수 있음

## Connection Management
> TCP 는 통신 전 반드시 양측의 상태를 초기화 하는 Handshaking 과정을 거쳐야 함

### Why 3-way Handshake?
* **실패 시나리오 1: 반쪽 연결 (Half-open connection)**
  * Client 가 보낸 연결 요청(SYN)이 지연되어서, Client 가 포기하고 꺼버린 한참 뒤에 Server 에 도착하는 경우
  * Server 혼자 수락(SYN-ACK) 하고 메모리를 낭비하며 Client 를 영원히 기다리는 경우
* **실패 시나리오 2: 중복 데이터 수락 (Dup data accepted)**
  * 옛날 연결에서 길을 읽고 떠돌던 데이터 Packet 이, 새로운 연결을 맺어지기도 전에 갑자기 Server 에 도착
  * Server 측에서 새 데이터 인 줄 알고 잘못 수락해 버림

> Server 가 수락(SYN-ACK) 한뒤에, Client 가 다시 한번 ACK 을 보내어 자신이 보낸것이 맞다라고 확인시켜 줌

### 3-way Handshake

![3-way-handshake](https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/TCP_connection_establishment.svg/1280px-TCP_connection_establishment.svg.png)

1. `Client -> Server`: `SYN=1`, `Seq=1` (클라이언트 상태: `SYN_RCVD`)
2. `Server -> Client`: `SYN=1`, `Seq=y`, `ACK=1` (서버 상태: `SYN_RCVD`)
3. `Client -> Server`: `ACK=y+1` (클라이언트 상태: `ESTABLISHED`)
4. 이후 데이터 전송 가능

### 4-way Handshake (연결 종료)와 TIME_WAIT
> 각 방향의 연결을 독립적으로 닫음 (어느 쪽이든 먼저 끊을 수 있음)

1. `Host A -> Host B (FIN)`: 나 더 이상 보낼 데이터 없어
2. `Host B -> Host A (ACK)`: 알겠어, 잠시만 (남은 데이터 처리 중)
3. `Host B -> Host A (FIN)`: 나도 다 끝났어. 이제 진짜 끊자
4. `Host A -> Host B (ACK)`: 알겠어, 수고했어

**TIME_WAIT의 존재 이유:**
* 먼저 끊자고 한쪽(Active Closer, 위 예시의 Host A)은 마지막 ACK를 보내고 즉시 완전히 종료하지 않고 일정 시간(보통 2 MSL) 동안 TIME_WAIT 상태로 대기
* **이유 1**: 자신이 보낸 마지막 ACK가 유실되어 B가 FIN을 계속 재전송할 경우를 대비해 다시 ACK를 보내주기 위함.
* **이유 2**: 네트워크 상에 떠돌던 옛날 패킷들이 새롭게 맺어질 다른 연결에 섞여 들어가는 것을 막기 위함.


## Quiz

Q. 호스트 A가 호스트 B에게 대용량 파일을 전송하고 있다. A는 연달아 2개의 세그먼트를 보냈다. 첫 번째 세그먼트의 순서 번호(Seq)는 1000이고 데이터 크기는 500바이트이다. 두 번째 세그먼트의 데이터 크기는 1000바이트이다.
* (a): 두 번째 세그먼트의 순서 번호(Seq)는 무엇인가?
* (b): 첫 번째 세그먼트가 무사히 도착했다면, B가 A에게 보내는 ACK 번호는 무엇인가?
* (c): 만약 첫 번째 세그먼트가 네트워크에서 유실되고 두 번째 세그먼트만 먼저 B에게 도착했다면, B가 A에게 보내는 ACK 번호는 무엇인가?

> (a): 1500:  TCP의 순서 번호는 바이트 스트림 번호이므로 1000 + 500 = 1500이 됩니다.

> (b): 1500: 수신자 B는 1499번 바이트까지 무사히 받았으므로 "다음에는 1500번 바이트부터 줘"라는 의미로 `ACK=1500`을 보냅니다.

> (c): TCP는 **누적 응답(Cumulative ACK)** 을 사용합니다. B는 여전히 1000번 바이트를 기다리고 있으므로, 아무리 뒤의 패킷(1500~2499)이 도착하더라도 자신이 받지 못한 1000번을 다시 달라고 ACK=1000을 보냅니다. (이것이 반복되면 3 Dup-ACK가 발생합니다.)


Q. 호스트 A가 B에게 5개의 세그먼트(각 100바이트)를 연달아 보냈다. 각각의 순서 번호(Seq)는 100, 200, 300, 400, 500이다. 전송 도중 두 번째 세그먼트(Seq=200) 하나만 네트워크에서 유실되었고, 나머지 4개는 순서대로 무사히 B에 도착했다.
* (a): 호스트 B가 4개의 세그먼트를 받을 때마다 각각 생성하여 A에게 보내는 ACK 번호를 순서대로 나열하시오.
* (b): 호스트 A는 타임아웃이 발생하기 전에 이 상황을 어떻게 인지하고 어떤 조치를 취하는가?

> (a): 200, 200, 200, 200
> * `Seq=100` 도착 -> 정상 수신. 다음 번호 요구: `ACK=200`
> * `Seq=300` 도착 -> 중간에 200번 누락(Gap) 발생, 즉시 중복 ACK 발송: `ACK=200`
> * `Seq=400` 도착 -> 여전히 200번 누락, 즉시 중복 ACK 발송: `ACK=200`
> * `Seq=500` 도착 -> 여전히 200번 누락, 즉시 중복 ACK 발송: `ACK=200`

> (b): 호스트 A는 처음에 정상적인 ACK=200을 하나 받은 뒤, **3개의 중복된 ACK=200 (Triple Duplicate ACKs)** 을 추가로 받게 됩니다. 이를 통해 A는 200번 패킷이 유실되었음을 깨닫고, 긴 타임아웃을 기다리지 않고 **즉시 Seq=200 패킷을 재전송(Fast Retransmit)** 합니다.

Q. 호스트 A가 호스트 B로 데이터를 전송 중이다. 현재 B의 수신 버퍼 여유 공간은 4,000바이트이므로 TCP 헤더의 `Window Size`에 `rwnd = 4000`을 담아 보냈다. 한편, A가 네트워크 혼잡 상황을 고려하여 자체적으로 계산한 혼잡 윈도우(`cwnd`)는 2,500바이트이다. 현재 A가 전송했지만 아직 ACK를 받지 못한 인플라이트(In-flight) 데이터는 500바이트이다.

* (a): 현재 호스트 A가 추가로 전송할 수 있는 최대 데이터 크기(바이트)는 얼마인가?
* (b): 호스트 A의 전송량이 수신자가 허용한 4,000바이트가 아닌, 위 값으로 제한되는 이유를 설명하시오.

> (a) 2,000 바이트: 송신자가 유지할 수 있는 최대 인플라이트 데이터의 양은 `Min(rwnd, cwnd)`로 결정됩니다. 즉 `Min(4000, 2500) = 2500` 바이트가 최대 허용치입니다. 현재 500바이트가 이미 전송 중이므로, 추가로 보낼 수 있는 양은 `2500 - 500 = 2000` 바이트입니다.

> (b) 수신자(B)의 버퍼 공간(`rwnd`)은 4,000바이트로 넉넉하지만, 송신자(A)가 판단한 네트워크의 수용 능력(`cwnd`)이 2,500바이트밖에 되지 않기 때문입니다. 흐름 제어(수신자 보호)와 혼잡 제어(네트워크 보호) 중 **더 엄격한 기준(작은 값)** 을 따라야 인터넷 인프라의 붕괴를 막을 수 있습니다.