---
title: "네트워크 보안 - WHOIS"
description: "도메인 이름, IP 주소 블록, 자율 시스템(AS) 번호의 소유자 및 관리자 등록 정보를 조회하는 공개 프로토콜이자 데이터베이스 시스템에 대한 소계"
date: "2026-10-23"
keywords: "Network, KNU"
---

## Whois 서버가 제공하는 정보
* 도메인 등록 및 관리 기반 정보
* 도메인 이름과 관련된 인터넷 자원 정보
* 목표 사이트의 네트워크 주소와 IP주소 정보
* 등록자, 관리자, 기술 관리자의 이름, 연락처, 이메일 계정 정보
* 레코드의 생성 시기와 갱신 시기 정보
* 주 DNS서버와 보조 DNS서버 정보
* IP주소의 할당 지역 위치 정보

> 개인정보 보호 정책에 따라 등록자의 연락처 등은 공개되지 않을 수 있다. IP 주소의 할당 지역이 실제 서버의 위치를 의미하지는 않는다.

> 현재는 WHOIS를 대체하는 RDAP가 사용되고 있다.

## DNS
DNS(Domain Name System)는 사람이 기억하기 쉬운 도메인 이름을 IP 주소로 변환하는 시스템, 분산된 계층 구조로 구성된다.

```text
       Root (.)
      /        \
   com          kr      ← 최상위 도메인(TLD)
    |            |
 example         ac
  /   \           |
www   mail       knu
```

`www.example.com`을 기준으로 DNS 계층을 살펴보면 다음과 같다.

1. **Root DNS 서버:** 최상위 도메인(TLD) 서버의 위치를 안내한다.
2. **TLD DNS 서버:** `.com`, `.kr`등 해당 최상위 도메인에 속한 권한 DNS 서버의 위치를 안내한다.
3. **권한 DNS 서버(Authoritative DNS):** 해당 도메인의 실제 DNS 레코드를 제공한다.
4. **재귀 DNS 서버(Recursive Resolver):** 클라이언트를 대신해 필요한 DNS 서버들을 조회하고 결과를 전달한다.

> 캐시에 정보가 없다면 재귀 DNS 서버는 Root → TLD → 권한 DNS 서버 순서로 조회할 수 있다.

> 53번 Port 사용, TCP와 UDP 사용

### DNS 작동 순서
1. Client가 Local DNS 서버에 `www.wishfree.com`의 주소를 요청한다.
2. Local DNS 서버가 Root DNS 서버에 질의한다.
3. Root DNS 서버는 `.com` DNS 서버를 안내한다.
4. Local DNS 서버가 `.com` DNS 서버에 질의한다.
5. `.com` DNS 서버는 `wishfree.com`의 Authoritative DNS 서버를 안내한다.
6. Local DNS 서버가 해당 Authoritative DNS 서버에 질의한다.
7. Authoritative DNS 서버가 IP 주소를 응답한다.
8. Local DNS 서버가 Client에게 IP 주소를 전달한다.

> Client는 Local DNS 서버에 재귀 질의(Recursive Query)를 수행하고, Local DNS 서버는 Root → TLD → 권한 DNS 서버에 반복 질의(Iterative Query)를 수행하는 것이 일반적이다.

### Primary DNS, Secondary DNS
Primary DNS 서버에서 관리하는 DNS 데이터의 영역을 Zone이라고 한다.

* **Primary DNS:** Zone의 원본 데이터를 관리하는 서버
* **Secondary DNS:** 원본 서버에서 Zone 데이터를 전달받아 복제본을 유지하는 서버
* **Zone Transfer:** DNS 서버 사이에서 Zone 데이터를 동기화하는 과정
  * **AXFR:** 전체 Zone 데이터를 전송
  * **IXFR:** 변경된 Zone 데이터를 증분 전송

> Zone은 DNS 서버가 관리하는 도메인 영역의 데이터 집합이며, Primary DNS 서버는 원본을 관리하고 Secondary DNS 서버는 Zone Transfer를 통해 복제본을 유지한다.

> DNS 계층의 어느 단계든 자신이 관리하는 Zone에 대해 원본과 복제본을 여러 DNS 서버에 분산해서 운영할 수 있다.

### Zone Transfer 보안

DNS 서버의 Zone Transfer 접근 제어가 잘못 설정되어 있으면 공격자가 허가 없이 Zone 데이터를 요청하여 서브도메인, 호스트명, IP 주소 등 네트워크 구성 정보를 수집할 수 있다.

> 가장 기본적인 해결 방법은 Primary DNS 서버가 Zone 데이터를 달라는 요청을 받았을 때, 요청한 상대가 허가된 Secondary DNS 서버인지 검사

### DNS 레코드
DNS Record는 도메인 이름과 관련된 IP 주소, 메일 서버, 네임 서버 등의 정보를 저장하는 데이터다.

| 레코드 | 기능 |
| ----- | --- |
| A | 도메인 → IPv4 주소 |
| AAAA | 도메인 → IPv6 주소 |
| NS | 도메인의 권한 DNS 서버 |
| MX | 메일 서버 종류 |
| CNAME | 다른 도메인 이름에 대한 별칭 |
| PTR | IP주소 → 도메인 이름 (역방향 조회) |
| SOA | DNS 영역의 관리 및 동기화 정보 |
| TXT | 도메인에 연결된 텍스트 정보 |

> TTL(Time To Live): DNS 레코드를 캐시에 유지할 수 있는 시간

## nslookup
nslookup은 Name Server Lookup의 줄임말로, DNS 서버에 직접 질의하여 IP 주소나 DNS 레코드를 확인하는 네트워크 진단 명령어이다.

| 명령어 | 기능 |
| ----- | --- |
| `nslookup example.com` | 도메인의 IP 주소 조회 |
| `nslookup 8.8.8.8` | IP 주소의 역방향 DNS 조회 |
| `nslookup -type=NS example.com` | 네임 서버 조회 |
| `nslookup -type=MX example.com` | 메일 서버 조회 |
| `nslookup -type=SOA example.com` | Zone 관리 정보 조회 |
| `nslookup example.com 8.8.8.8` | 특정 DNS 서버에 질의 |


## ping
ping은 대상 호스트와의 네트워크 연결 상태를 확인하는 명령어이다.

* ICMP Echo Request 패킷 전송
* ICMP Echo Reply 응답 수신
* 왕복 시간(RTT), 패킷 손실 등을 확인
* 도메인을 입력하면 이름 확인 과정도 수행

> `ping example.com`

> ping 응답이 없더라도 대상 호스트가 반드시 꺼져 있는건 아니다. 방화벽 등이 ICMP를 차단할 수 있다.

## ipconfig
Windows에서 시스템의 TCP/IP 네트워크 설정을 확인하고 관리하는 명령어

| 명령어 | 기능 |
| ----- | --- |
| ipconfig | 기본 IP 설정 확인 |
| ipconfig /all | DNS, MAC, DHCP 등 상세 정보 |
| ipconfig /displaydns | 로컬 DNS 캐시 확인 |
| ipconfig /flushdns | 로컬 DNS 캐시 초기화 |
| ipconfig /release | DHCP 할당 주소 반납 |
| ipconfig /renew | DHCP 주소 재할당 요청 |