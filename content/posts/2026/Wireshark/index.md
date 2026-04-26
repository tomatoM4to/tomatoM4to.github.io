---
title: "Wireshark"
description: "2026년 1학기 Wireshark 이론적 배경"
date: "2026-04-27"
keywords: "Network, KNU"
---

> [https://medium.com/@ahmedsobhialii/under-the-hood-how-wireshark-and-packet-sniffers-really-work-5e6c5d7dc67d](https://medium.com/@ahmedsobhialii/under-the-hood-how-wireshark-and-packet-sniffers-really-work-5e6c5d7dc67d)

## Wireshark 동작 순서
Wireshark 는 단순히 패킷을 캡처하는것 뿐만 아니라, Hardware 와 Kernel 레벨의 높은 상호작용을 하는 소프트웨어 툴임

### 1. NIC
전기/무선 신호를 데이터 프레임으로 변환하는 역할을 하는 NIC은 MAC 주소를 읽어들여, 나에게 도착한 패킷인지 아닌지를 판단하고 Hardware 레벨에서 패킷을 필터링하는 역할을 수행한다.

Wireshark 는 NIC 의 Promiscuous Mode 를 활성화하여, 나에게 도착한 패킷 뿐만 아니라, 네트워크 상의 모든 패킷을 캡처할 수 있도록 한다.


* **Promiscuous Mode** : NIC 이 자신에게 도착한 패킷 뿐만 아니라, 네트워크 상의 모든 패킷을 캡처할 수 있도록 하는 모드
* **Monitor Mode** : 무선 네트워크에서, NIC 이 주변의 모든 무선 신호를 캡처할 수 있도록 하는 모드

> 옆집 컴퓨터도 염탐 가능, 현실적으로 TLS 나 WPA2 같은 암호화된 네트워크에서는 패킷을 캡처하더라도 내용을 해독하기 어렵지만, 공개된 네트워크에서는 패킷의 내용을 쉽게 볼 수 있기 때문에 보안에 주의해야 함

### 2. DMA (Direct Memory Access)
NIC이 CPU의 개입 없이도 패킷 데이터를 시스템 메모리에 직접 복사해 넣을 수 있도록 하는 기술. CPU 의 부담을 줄이고, 패킷 처리 속도를 높이는 기술

### 3. Interrupts
패킷이 시스템 메모리에 저장되면, NIC 이 CPU 에게 Interrupt 를 발생시켜, 패킷이 도착했음을 알린다.

> 이또한 매우 빈번할 수 있기에, 패킷이 쌓일때 까지 Interrupt 를 지연시키는 기술이 존재함

### 4. Kernel 개입
커널은 패킷이 시스템 메모리에 저장되면, 해당 패킷을 Network Stack 의 핵심 자료구조인 `sk_buff` 라는 객체로 감싼다.

이때부터 단순한 0과 1의 나열이 아니라 Kernel 이 관리할 수 있는 Network Packet 객체로 변환된다고 볼 수 있음

### 5. BPF (Filtering)
Wireshark 에서 조건(port 번호, IP 주소 등) 을 설정하면, 커널 레벨에서 해당 조건에 맞는 패킷만 Wireshark 로 전달하도록 필터링이 이루어진다.

Wireshark 가 열어둔 *Raw Socket(AF_PACKET)* 을 통해, 사용자가 지정한 조건이 아니면 패킷 캡처용 경로에서 즉시 폐기 시킨다.

> 해당 과정은 TCP/IP 스택 이전 단계에서 이루어 진다. BPF(Berkeley Packet Filter) 라는 기술로 불림

### 6. User-space 로 전달
필터링된 패킷은 Wireshark 의 User-space 로 전달되어, Wireshark 가 패킷을 분석하고, 사용자에게 보여주는 역할을 수행한다.

이때 Kernel 공간의 패킷 데이터를 user 공간으로 모든 패킷을 복사하는게 아니라 `PACKET_MMAP` 라는 기술을 써서 Kernel 공간의 메모리(Ring Buffer) 와 유저공간의 메모리를 논리적으로 Mapping 해버려, 복사 없이 포인터만 넘겨주는 Zero-copy 기술이 사용된다.

