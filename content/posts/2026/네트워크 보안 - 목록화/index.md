---
title: "네트워크 보안 - 목록화"
description: "공격 전 대상의 정보를 수집하는 목록화에 대한 소개"
date: "2026-10-24"
keywords: "Network, KNU"
---

## 풋프린팅(Footprinting)
공격 대상에 대한 정보를 수집하여 네트워크 환경, 조직 구성, 시스템 정보 등을 파악하는 사전 정보 수집 과정
* 수동적 풋프린팅: 공개된 웹사이트, 검색 엔진, WHOIS, DNS 정보, 채용 공고 등에서 정보 수집
* 능동적 풋프린팅: 대상 시스템에 직접 질의를 보내 정보를 수집
* 사회공학: 사람의 심리나 신뢰를 이용해 정보를 얻는 기법, 관리자 사칭, 피싱 등이 해당

## 스캔
대상 시스템에 네트워크 패킷을 전송하고 응답을 분석하여 시스템과 서비스의 상태를 확인하는 과정

주요 목적은 다음과 같다.
* **호스트 탐지:** 시스템이 활성화되어 있는가?
* **포트 스캔:** 어떤 TCP, UDP 포트가 열려 있는가?
* **서비스 탐지:** 어떤 서비스와 버전이 실행되는가?
* **OS 탐지:** 어떤 OS를 사용하고 있는가?
* **방화벽 탐지:** 어떤 패킷이 허용되거나 차단되는가?

> 호스트가 활성화되어 있는지 확인하는 것과 포트가 열려있는지 확인하는 것은 서로 다른 작업

## ICMP를 이용한 호스트 탐지
ICMP 요청에 대한 응답을 통해 호스트의 활성화 여부를 추정할 수 있다.

| Request | Reply | 목적 |
| ------- | ----- | --- |
| Type 8 | Type 0 | Echo: 호스트 응답 확인 |
| Type 13 | Type 14 | Timestamp: 시간 정보 요청 |
| Type 15 | Type 16 | Information: 과거의 정보 요청 방식 |
| Type 17 | Type 18 | Address Mask: 서브넷 마스크 요청 |

> `ping` 명령어는 IPv4에서 Echo Request(Type8)를 보내고 Echo Reply(Type 0)를 받는 방식이다. 나머지는 오래된 ICMP 메시지들이며, 현대 시스템에서는 지원하지 않거나 차단하는 경우가 많다.

> `ping` 응답이 없다고 시스템이 꺼져 있다고 단정할 수 없다, 방화벽이 Echo Request를 차단하거나 OS가 ICMP 응답을 제한할 수도 있기 때문

## TCP 스캔
TCP 포트 스캔의 핵심은 헤더에 들어 있는 플래그를 조작하고 응답을 관찰하는 것이다.

| 플래크 | 역할 |
| ----- | ---- |
| SYN | 연결 수립 요청 |
| ACK | 수신 확인 |
| FIN | 정상적인 연결 종료 요청 |
| RST | 연결 강제 종료 또는 거부 |
| PSH | 데이터를 신속하게 App에 전달하도록 요청 |
| URG | 긴급 데이터 표시 |

> TCP 헤더의 Source Port, Destination Port는 포트를 식별하고, Window Size는 수신 가능 데이터 크기와 관련된다.

### TCP Open 스캔 (TCP Connect Scan)
대상 포트와 정상적인 TCP 3-Way Handshake를 완료해 연결 가능 여부를 확인하는 방식이다.

![tcp connect scan](/img/network-security/tcp-connect-scan.svg)

* `SYN → SYN/ACK → ACK`: 포트 열림
* `SYN → RST`: 포트 닫힘
* 응답 없음 또는 특정 ICMP 오류: 필터링 가능성

### TCP Half Open 스캔 (SYN Scan)
위와는 달리 TCP 연결을 끝까지 성립시키지 않는 방식이다.

![tcp syn scan](/img/network-security/tcp-syn-scan.svg)

* `SYN → SYN/ACK`: 포트 열림, 스캐너는 보통 RST를 보내 연결을 중단한다.
* `SYN → RST`: 포트 닫힘
* 응답 없음 또는 특정 ICMP 오류: 필터링 가능성

### FIN, NULL, XMAS 스캔
TCP 헤더의 특정 Flags를 조작하여 포트 상태를 추측한다.

| 스캔 | 설정하는 Flags | Nmap |
| --- | ------------- | ---- |
| FIN | `FIN` | `-sF` |
| NULL | 없음 | `sN` |
| XMAS | `FIN + PSH + URG` | `-sX` |

이 세 방식은 기본적인 응답 해석이 같다.
* `RST` 수신: 포트 닫힘
* 응답 없음: `open|filtered`
* 특정 ICMP Unreachable 오류: `filtered`

> 포트가 열려 있어도 응답하지 않을 수 있고, 방화벽이 차단해도 응답이 없을 수 있다. 따라서 응답 없음은 포트가 열려 있다는 확정적인 증거가 아니다.

### ACK 스캔
ACK 플래그만 설정한 TCP 패킷을 전송하여 방화벽이 해당 패킷을 통과시키는지 확인하는 방식

* `RST` 응답: `unfiltered` (ACK 패킷이 도달했지만 포트 개폐는 알 수 없음)
* 응답 없음 또는 특정 ICMP 오류: `filtered`

### TCP 단편화 스캔
IP 헤더의 `Identification`, `MF(More Fragments)`, `Fragment Offset` 등을 이용하여 IP 패킷을 여러 조각으로 나누어 전송하는 방식

TCP 헤더까지 여러 IP 조각에 분산되면 단순한 패킷 필터가 TCP 포트나 플래그를 제대로 확인하지 못할 가능성이 있다.

## UDP 스캔
UDP는 비연결형 프로토콜이므로 TCP처럼 3-Way Handshake를 이용한 포트 확인이 불가능하다. UDP 패킷을 전송한 뒤 UDP 또는 ICMP 응답을 분석한다.

| 응답 | 판단 |
| --- | ---- |
| UDP 응답 수신 | open |
| ICMP Type 3, Code 3 | closed |
| 일부 다른 ICMP 오류 | filtered |
| 응답 없음 | open/filtered |

> 포트가 닫혀 있을 때 대상 시스템이 UDP 패킷을 처리할 서비스가 없다고 알려주는 것


## 스텔스 스캔

스텔스 스캔에 해당
* TCP Half Open
* FIN: FIN 플래그만 설정
* NULL 스캔: 플래그를 모두 0으로 설정
* XMAS 스캔: FIN, PSH, URG 플래그를 설정하여 포트 확인

관련은 있지만 구분이 필요한 방식
* ACK 스캔: TCP 연결을 수립하지 않지만 주요 목적인 방화벽 필터링 규칙 확인, 스탤스 스캔으로 분류하기도 함
* TCP 단편화 스캔: IP 패킷을 분할해 탐지를 회피하려는 기법

스텔스 스캔으로 분류하지 않는 방식
* TCP Open 스캔: 3-Way Handshake를 완료하므로 기록이 남을 수 있음
* UDP 스캔




## OS 탐지
OS마다 네트워크 프로토콜을 구현하는 방식이 조금씩 다르다는 점을 이용해 OS를 추정할 수 있다.

대표적인 분석 대상은 다음과 같다.

* IP 헤더의 TTL, Identification
* TCP 헤더의 Windows Size, TCP Options
* 비정상적인 TCP Flags 에 대한 응답
* ICMP 오류 메시지와 응답 특성

> 단일 헤더만으로 판단하지 않고, 여러 패킷 응답의 특징을 종합하여 OS를 추정한다.

## 배너 그래빙
서버가 클라이언트에게 제공하는 서비스 식별 정보를 수집하는 기술이다.

SSH 연결에서 표시되는 서버 소프트웨어 식별 문자열이나 HTTP 응답의 Server 헤더 등을 이용할 수 있다.

서버가 제공하는 소프트웨어 종류와 버전을 추정할 수 있지만, 배너는 숨기거나 변경할 수 있으므로 실제 환경과 다를 수 있다.

## Traceroute
IP 헤더의 TTL 값을 이용하여 목적지까지의 경로를 파악하는 기술이다.

라우터는 패킷을 전달할 때 TTL을 감소시키며, TTL이 0이 되어 폐기할 경우 일반즈거으로 `ICMP Time Exceeded(Type 11, Code 0)` 메시지를 보낸다.

TTL을 1부터 증가시키면 중간 라우터들을 추적할 수 있다.

단 Traceroute로 방화벽이 설치되었는지 확정할 수는 없다. 응답이 사라지는 지점은 필터링 가능성을 시사할 뿐이다.

## Firewalk
Traceroute의 TTL 원리를 확장하여 방화벽의 패킷 필터링 규칙을 추정하는 방법이다.

1. 방화벽으로 의심되는 게이트웨이까지의 홉 수를 파악한다.
2. 게이트웨이 홉 수보다 TTL을 1 크게 설정하여 TCP, UDP 패킷을 전송한다.
3. 패킷이 통과하면 그 다음 홉에서 TTL이 만료되어 ICMP Time Exceeded 응답이 발생할 수 있다.
4. 응답 여부를 바탕으로 해당 포트나 프로토콜의 통과 가능성을 추정한다.

> 이는 대상 시스템의 포트가 열렸는지 확인하는 것이 아니라, 중간 게이트웨이가 해당 트래픽을 전달했는지를 추정하는 기술이다.

## SNMP
SNMP는 라우터, 스위치, 서버, 프린터 등의 네트워크 장비를 원격으로 감시하고 관리하기 위한 응용 계층 프로토콜이다.

네트워크 관리자는 SNMP를 이용하여 장비의 CPU 사용률, 네트워크 인터페이스 상태, 트래픽 통계, 시스템 가동 시간 등을 조회하고, 허용된 경우 설정을 변경할 수 있다.

기존 설명에서 ICMP를 이용한 관리를 개선하기 위해 개발되었다고 했는데, 정확히는 목적이 다르다.

* ICMP: 네트워크 오류 전달 및 연결 상태 진단
* SNMP: 네트워크 장비의 상태 정보 조회, 설정 변경, 이벤트 감시

### SNMP의 구성 요소
크게 Manager, Agent, MIB 로 구성된다.

* `Manager`: 장비에 정보를 요청하고 수집하는 관리 시스템 (NMS)
* `Agent`: 관리 대상 장비에서 요청을 처리하고 상태 정보를 제공하는 소프트웨어
* `MIB`: 관리 가능한 객체의 구조와 식별 체계를 정의하는 정보 모델
* `OID`: MIB 내에서 특정 객체를 식별하는 고유 번호

![snmp structure](/img/network-security/snmp.svg)

동작 방식을 예로 들면 다음과 같다.

1. Manager가 Agent에게 CPU 사용률이나 인터페이스 상태를 요청
2. Agent는 관리 객체의 현재 값을 확인
3. Agent가 SNMP response 로 해당 값을 반환
4. Manager가 수집한 결과를 저장하거나 모니터링 화면에 표시

### 포트 번호
* `UDP 161`: Manager가 Agent에게 조회·설정 요청
* `UDP 162`: Manager가 Trap, Inform과 같은 알림 수신

> 일반적으로 UDP를 사용하지만 TCP 방식도 별도로 정의되어 있다.

### SNMP PDU
PDU는 SNMP에서 수행하려는 작업과 필요한 데이터를 표현하는 프로토콜 데이터 단위이다. 종류에 따라 조회, 수정, 응답, 이벤트 알림 등의 동작을 수행한다.

* `GetRequest`: 특정 OID의 값을 조회
* `GetNextRequest`: 지정한 OID다음에 위치하는 객체 조회
* `GetBulkRequest`: 여러 객체를 효율적으로 연속 조회
* `SetRequest`: 관리 객체의 값 변경
* `Response`: 요청 처리 결과 반환
* `Trap`: Agent가 Manager에게 이벤트 발생을 알림
* `InformRequest`: 수신 확인 응답을 요구하는 알림

### Polling과 Trap
SNMP는 두 가지 방식으로 관리 정보를 수집할 수 있다.

Polling(주기적 조회)은 Manager가 일정한 주기로 Agent에 요청을 보내 현재 상태를 확인한다. 예를 들어 30초마다 네트워크 인터페이스의 트래픽을 조회하여 사용량을 기록할 수 있다.

Trap(이벤트 기반 알림)은 Agent가 특정 이벤트가 발생했을 때 Manager에게 자발적으로 알림을 전송한다. 예를 들어 네트워크 인터페이스가 내려가면 Agent가 `linkDown` 이벤트를 전송할 수 있다.

### Trap과 Inform
Trap은 SNMP 수준의 수신 확인 응답을 요구하지 않지만, Inform은 수신 측에서 Response를 반환한다. 따라서 Inform은 전달 성공 여부를 확인할 수 있다.

### MIB (Management Information Base)
MIB는 SNMP로 관리할 수 있는 객체들을 계층적으로 정의하는 정보 모델이다.

일반적으로 데이터베이스라고 설명하지만, 정확히는 관리 객체의 이름, 자료형, 의미, 접근 권한 등을 정의하는 논리적 정보 구조이다.

MIB의 객체를 조회하면 Agent가 실제 장비의 상태 값을 반환한다.

주요 그룹
* `System`: 시스템 이름, 설명, 가동 시간
* `Interfaces`: 네트워크 인터페이스 상태와 통계
* `AT`: 주소 변환 정보 (폐기된 구형 그룹)
* `IP`: IP 관련 상태와 통계
* `ICMP`: ICMP 메시지 통계
* `TCP`: TCP 연결 및 통계
* `UDP`: UDP 통계
* `EGP`: 과거 EGP 라우팅 프로토콜 정보
* `Transmission`: 전송 매체 관련 관리 정보
* `SNMP`: SNMP 프로토콜 동작 통계

> 이 외에도 다양한 표준 MIB와 제조사 전용 MIB 가 존재

### OID (Object Identifier)
OID는 MIB의 특정 객체를 식별하기 위한 계층적인 번호이다.

### SNMP 버전과 보안
SNMP는 버전에 따라 인증 방식과 보안 기능이 달라진다.

| 버전 | 주요 특징 | 보안 |
| --- | -------- | --- |
| SNMPv1 | 초기 버전, 기본적인 조회, 변경, Trap | Community 기반, 암호화 없음 |
| SNMPv2c | GetBulk, Inform 등의 기능 지원 | Community 기반, 암호화 없음 |
| SNMPv3 | 사용자 기반 보안 및 접근 제어 지원 | 인증, 암호화 지원